<?php
/**
 * Live property inventory: fetches the public API on the server, caches it, cleans it up.
 * Pages are rendered in PHP because the API only allows browser calls from another domain,
 * and because search engines need the listings in the HTML.
 */
declare(strict_types=1);

function arg_config(): array
{
    static $config = null;
    if ($config === null) {
        $file = dirname(__DIR__) . '/api/config.php';
        $config = array_merge([
            'site_url'      => 'https://assetrealtygroup.in',
            'inventory_url' => getenv('ARG_INVENTORY_URL') ?: 'https://backend.propertyplusrealtors.com/public/inventory',
            'cache_dir'     => getenv('ARG_CACHE_DIR') ?: dirname(__DIR__, 2) . '/arg_private/inventory_cache',
            'list_ttl'      => 300,    // seconds before the list is refreshed
            'detail_ttl'    => 600,
            'per_page'      => 24,
            // Listings outside these limits are treated as test or mistyped data and not published
            'min_price_per_sqft' => 1500,
            'max_price_per_sqft' => 60000,
            'min_area_sqft'      => 200,
            'max_area_sqft'      => 20000,
            'blocked_photo_hosts' => ['picsum.photos'], // placeholder images, not real property photos
        ], is_file($file) ? (array) require $file : []);
    }
    return $config;
}

function e(?string $text): string
{
    return htmlspecialchars((string) $text, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8');
}

/* ---------- Fetch and cache ---------- */

function arg_http_json(string $url): ?array
{
    if (!function_exists('curl_init')) {
        return null;
    }
    $curl = curl_init($url);
    curl_setopt_array($curl, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 6,
        CURLOPT_CONNECTTIMEOUT => 3,
        CURLOPT_HTTPHEADER => ['Accept: application/json'],
        CURLOPT_USERAGENT => 'ARG-Website/1.0',
    ]);
    $body = curl_exec($curl);
    $status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
    curl_close($curl);
    if ($status !== 200 || !is_string($body)) {
        return null;
    }
    $data = json_decode($body, true);
    return is_array($data) ? $data : null;
}

/**
 * Returns cached data while fresh. When a refresh fails, keeps serving the last good copy,
 * and waits a minute before retrying so a slow API cannot slow every page view.
 */
function arg_cached(string $key, int $ttl, callable $fetch): ?array
{
    $dir = arg_config()['cache_dir'];
    if (!is_dir($dir)) {
        @mkdir($dir, 0750, true);
        @file_put_contents($dir . '/.htaccess', "Require all denied\nDeny from all\n");
    }
    $file = "$dir/$key.json";
    $failMark = "$dir/$key.fail";
    $age = is_file($file) ? time() - (int) filemtime($file) : PHP_INT_MAX;
    $cached = function () use ($file) {
        $data = is_file($file) ? json_decode((string) file_get_contents($file), true) : null;
        return is_array($data) ? $data : null;
    };
    if ($age < $ttl) {
        return $cached();
    }
    if (is_file($failMark) && time() - (int) filemtime($failMark) < 60) {
        return $cached();
    }
    $fresh = $fetch();
    if ($fresh === null) {
        @touch($failMark);
        return $cached();
    }
    $temp = $file . '.' . bin2hex(random_bytes(4));
    if (@file_put_contents($temp, json_encode($fresh)) !== false) {
        @rename($temp, $file); // atomic, so a reader never sees half a file
    }
    @unlink($failMark);
    return $fresh;
}

/** Every listing from the API, or null when it is down and nothing is cached. */
function arg_inventory_raw(): ?array
{
    $config = arg_config();
    return arg_cached('list', (int) $config['list_ttl'], function () use ($config) {
        $rows = [];
        for ($page = 0; $page < 40; $page++) {
            $data = arg_http_json($config['inventory_url'] . '?limit=50&offset=' . count($rows));
            if ($data === null || !isset($data['rows']) || !is_array($data['rows'])) {
                return null; // never cache a partial list
            }
            $rows = array_merge($rows, $data['rows']);
            if (!$data['rows'] || count($rows) >= (int) ($data['total'] ?? 0)) {
                break;
            }
        }
        return $rows;
    });
}

/* ---------- Clean-up ---------- */

function arg_price_label(float $rupees): string
{
    if ($rupees >= 10000000) {
        return '₹' . rtrim(rtrim(number_format($rupees / 10000000, 2, '.', ''), '0'), '.') . ' Cr';
    }
    return '₹' . rtrim(rtrim(number_format($rupees / 100000, 2, '.', ''), '0'), '.') . ' Lakh';
}

function arg_slugify(string $text): string
{
    return trim((string) preg_replace('/[^a-z0-9]+/', '-', strtolower($text)), '-');
}

/**
 * A media link may carry a ?token=. Only read-only "public_asset" tokens are published.
 * The API has returned links signed with staff login tokens (e.g. role super_admin);
 * putting those on a public page would hand out account access, so they are dropped.
 */
function arg_safe_media_token(string $url): bool
{
    parse_str((string) parse_url($url, PHP_URL_QUERY), $query);
    if (!isset($query['token'])) {
        return true;
    }
    $parts = explode('.', (string) $query['token']);
    $payload = count($parts) === 3 ? json_decode((string) base64_decode(strtr($parts[1], '-_', '+/')), true) : null;
    return is_array($payload) && ($payload['scope'] ?? '') === 'public_asset' && !isset($payload['sub']) && !isset($payload['role']);
}

function arg_clean_media($urls): array
{
    $blocked = arg_config()['blocked_photo_hosts'];
    $clean = [];
    foreach (is_array($urls) ? $urls : [] as $url) {
        $host = is_string($url) && stripos($url, 'https://') === 0 ? strtolower((string) parse_url($url, PHP_URL_HOST)) : '';
        if ($host !== '' && $host !== 'localhost' && $host !== '127.0.0.1' && !in_array($host, $blocked, true) && arg_safe_media_token($url)) {
            $clean[] = $url;
        }
    }
    return array_values(array_unique($clean));
}

/** Nearby landmarks may arrive as text, a list of names, or a list of {name, distance}. */
function arg_landmarks($value): array
{
    if (is_string($value)) {
        $value = preg_split('/[\n,;]+/', $value);
    }
    $out = [];
    foreach (is_array($value) ? $value : [] as $item) {
        if (is_array($item)) {
            $name = trim((string) ($item['name'] ?? $item['title'] ?? $item['label'] ?? ''));
            $distance = trim((string) ($item['distance'] ?? $item['distance_text'] ?? ''));
            if (is_numeric($distance)) {
                $distance .= ' km';
            }
            $item = $name !== '' && $distance !== '' ? "$name ($distance)" : $name;
        }
        $item = trim((string) (is_scalar($item) ? $item : ''));
        if ($item !== '') {
            $out[] = mb_substr($item, 0, 120);
        }
    }
    return array_slice(array_values(array_unique($out)), 0, 12);
}

/** A whole number within a sensible range, or null. */
function arg_count($value, int $max): ?int
{
    return is_numeric($value) && (int) $value >= 0 && (int) $value <= $max ? (int) $value : null;
}

/** Turns one API row into consistent display values. The API has values like "3", "3bhk" and "3.5BHK". */
function arg_normalize(array $row): array
{
    $bhk = preg_match('/\d+(?:\.\d+)?/', (string) ($row['bhk'] ?? ''), $m) ? (float) $m[0] : 0.0;
    $bhkText = $bhk > 0 ? rtrim(rtrim(number_format($bhk, 1, '.', ''), '0'), '.') . ' BHK' : '';
    $type = ucfirst(strtolower(trim((string) ($row['unit_type'] ?? '')))) ?: 'Apartment';
    $society = trim((string) ($row['society_name'] ?? ''));
    $city = trim((string) ($row['city'] ?? ''));
    $code = strtoupper(trim((string) ($row['inventory_code'] ?? '')));
    $price = (float) ($row['listed_price'] ?? 0);
    $area = (float) ($row['area_sqft'] ?? 0);
    $name = trim("$bhkText $type");
    $slug = arg_slugify("$name for sale in $society $city $code");
    $floor = isset($row['floor']) && (int) $row['floor'] >= 0 && (int) $row['floor'] <= 150 ? (int) $row['floor'] : null;
    $furnishing = strtolower(trim((string) ($row['furnishing'] ?? '')));
    $furnishing = ['semi' => 'Semi-furnished', 'unfurnished' => 'Unfurnished', 'furnished' => 'Fully furnished', 'full' => 'Fully furnished'][$furnishing] ?? '';
    $condition = trim((string) ($row['condition'] ?? ''));
    $photos = arg_clean_media(array_merge((array) ($row['photos'] ?? []), [$row['cover_photo_url'] ?? null]));
    $maintenance = is_numeric($row['maintenance_charge'] ?? null) && (float) $row['maintenance_charge'] > 0 && (float) $row['maintenance_charge'] < 1000000 ? (float) $row['maintenance_charge'] : null;
    $lift = $row['has_lift'] ?? null;
    $lift = is_bool($lift) || in_array($lift, [0, 1, '0', '1', 'true', 'false'], true) ? filter_var($lift, FILTER_VALIDATE_BOOLEAN) : null;
    $locality = trim((string) ($row['locality'] ?? ''));

    return [
        'id' => (string) ($row['id'] ?? ''),
        'code' => $code,
        'name' => $name,
        'title' => "$name for Sale in $society, $city",
        'society' => $society,
        'city' => $city,
        'pincode' => trim((string) ($row['pincode'] ?? '')),
        'address' => trim((string) ($row['address'] ?? '')),
        'tower' => trim((string) ($row['tower_name'] ?? '')),
        'bhk' => $bhk,
        'bhk_text' => $bhkText,
        'type' => $type,
        'price' => $price,
        'price_label' => arg_price_label($price),
        'area' => $area,
        'area_label' => number_format($area) . ' sq.ft',
        'per_sqft' => $area > 0 ? (int) round($price / $area) : 0,
        'floor' => $floor,
        'facing' => ucwords(strtolower(trim((string) ($row['facing'] ?? ''))), " -"),
        'furnishing' => $furnishing,
        'condition' => preg_match('/[a-z]/i', $condition) ? ucfirst($condition) : '', // the API has values like "769"
        'parking' => (int) ($row['parking_count'] ?? 0),
        'listed_at' => (string) ($row['listed_at'] ?? ''),
        'description' => trim((string) ($row['description'] ?? '')),
        'photos' => $photos,
        'videos' => arg_clean_media((array) ($row['videos'] ?? [])),
        'bathrooms' => arg_count($row['bathrooms'] ?? null, 20),
        'balconies' => arg_count($row['balconies'] ?? null, 20),
        'maintenance' => $maintenance,
        'age_years' => arg_count($row['property_age_years'] ?? null, 100),
        'lift' => $lift,
        'locality' => strcasecmp($locality, $city) === 0 ? '' : $locality,
        'landmarks' => arg_landmarks($row['nearby_landmarks'] ?? null),
        'url' => "/property/$slug",
        'slug' => $slug,
    ];
}

function arg_publishable(array $p): bool
{
    $c = arg_config();
    return $p['code'] !== '' && $p['society'] !== '' && $p['city'] !== '' && $p['bhk'] > 0 && $p['bhk'] <= 12
        && $p['area'] >= $c['min_area_sqft'] && $p['area'] <= $c['max_area_sqft']
        && $p['per_sqft'] >= $c['min_price_per_sqft'] && $p['per_sqft'] <= $c['max_price_per_sqft'];
}

/** Listings fit to show the public, newest first. Null means the API is down with no saved copy. */
function arg_inventory(): ?array
{
    $raw = arg_inventory_raw();
    if ($raw === null) {
        return null;
    }
    $list = array_values(array_filter(array_map('arg_normalize', $raw), 'arg_publishable'));
    usort($list, function ($a, $b) { return strcmp($b['listed_at'], $a['listed_at']); });
    return $list;
}

/** Full details for one listing, merged over the list row. If the detail call fails, the list row still works. */
function arg_property_by_code(string $code, array $list): ?array
{
    foreach ($list as $listing) {
        if ($listing['code'] !== $code) {
            continue;
        }
        if (!preg_match('/^[0-9a-f-]{36}$/i', $listing['id'])) {
            return $listing;
        }
        $config = arg_config();
        $detail = arg_cached('p-' . strtolower($listing['id']), (int) $config['detail_ttl'], function () use ($config, $listing) {
            return arg_http_json($config['inventory_url'] . '/' . rawurlencode($listing['id']));
        });
        return $detail ? arg_normalize($detail) : $listing;
    }
    return null;
}

/* ---------- Shared markup ---------- */

function arg_icon(string $name): string
{
    return '<svg class="icon" aria-hidden="true"><use href="#' . e($name) . '"/></svg>';
}

function arg_card_html(array $p, int $i = 0): string
{
    $specs = '<span>' . arg_icon('bed') . e($p['bhk_text']) . '</span>';
    if ($p['bathrooms']) {
        $specs .= '<span>' . arg_icon('bath') . $p['bathrooms'] . ' Bath</span>';
    }
    $specs .= '<span>' . arg_icon('area') . e($p['area_label']) . '</span>';
    if ($p['floor'] !== null && !$p['bathrooms']) {
        $specs .= '<span>' . arg_icon('building') . 'Floor ' . $p['floor'] . '</span>';
    }
    $media = $p['photos']
        ? '<img src="' . e($p['photos'][0]) . '" alt="' . e($p['name'] . ' in ' . $p['society']) . '" width="700" height="525" loading="lazy" decoding="async">'
        : '<span class="ph-tile">' . arg_icon('building') . '<b>' . e($p['society']) . '</b><small>Photos on request</small></span>';
    return '<article class="card pop" style="--i:' . $i . '">'
        . '<a class="card-media' . ($p['photos'] ? '' : ' no-photo') . '" href="' . e($p['url']) . '" tabindex="-1" aria-hidden="true">' . $media . '</a>'
        . '<div class="card-body">'
        . '<p class="card-price">' . e($p['price_label']) . ' <small>· ₹' . number_format($p['per_sqft']) . '/sq.ft</small></p>'
        . '<h3 class="card-title"><a href="' . e($p['url']) . '">' . e($p['name']) . ' in ' . e($p['society']) . '</a></h3>'
        . '<p class="card-loc">' . arg_icon('pin') . e(implode(', ', array_filter([$p['locality'], $p['city']]))) . '</p>'
        . '<div class="card-specs">' . $specs . '</div>'
        . '<div class="card-actions"><a class="btn btn-dark" href="' . e($p['url']) . '" aria-label="View details of ' . e($p['name'] . ' in ' . $p['society']) . '">View details</a>'
        . '<button class="icon-btn" type="button" aria-pressed="false" aria-label="Shortlist ' . e($p['name'] . ' in ' . $p['society']) . '" data-shortlist="' . e($p['code']) . '">' . arg_icon('heart') . '</button></div>'
        . '</div></article>';
}

/** JSON for a <script type="application/ld+json"> block. The HEX flags stop data closing the script tag. */
function arg_ld_json(array $data): string
{
    return json_encode($data, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_HEX_TAG | JSON_HEX_AMP);
}
