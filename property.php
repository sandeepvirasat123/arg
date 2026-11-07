<?php
/** Property detail page: /property/3-bhk-apartment-for-sale-in-coco-country-1-greater-noida-west-inv-000085 */
declare(strict_types=1);
require __DIR__ . '/includes/inventory.php';

$site = rtrim(arg_config()['site_url'], '/');
$slug = strtolower((string) ($_GET['slug'] ?? ''));
$code = preg_match('/(inv-\d+)$/', $slug, $m) ? strtoupper($m[1]) : '';
$list = arg_inventory();
$p = $list !== null && $code !== '' ? arg_property_by_code($code, $list) : null;

// The code in the URL decides the property. A changed name or old link redirects to the current address.
if ($p && $p['slug'] !== $slug) {
    header('Location: ' . $p['url'], true, 301);
    exit;
}

function arg_page_open(string $title, string $description, string $extraHead = ''): void
{
    ?>
<!doctype html>
<html lang="en-IN">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
  <title><?= e($title) ?></title>
  <meta name="description" content="<?= e($description) ?>">
  <meta name="theme-color" content="#26626a">
  <link rel="icon" href="/assets/img/arg-logo.jpeg">
  <link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Manrope:wght@400;600;700;800&display=swap" onload="this.onload=null;this.rel='stylesheet'">
  <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Manrope:wght@400;600;700;800&display=swap"></noscript>
  <link rel="stylesheet" href="/assets/css/style.css">
  <?= $extraHead ?>
  <script src="/assets/js/main.js" defer></script>
</head>
<body class="property-page">
<?php
    readfile(__DIR__ . '/includes/header.html');
}

if (!$p) {
    // API down with nothing saved: 503 tells search engines to come back, rather than dropping the page
    $down = $list === null;
    http_response_code($down ? 503 : 404);
    if ($down) {
        header('Retry-After: 600');
    }
    arg_page_open($down ? 'Property details unavailable | Asset Realty Group' : 'Property not available | Asset Realty Group', 'Browse current properties from Asset Realty Group.', '<meta name="robots" content="noindex">');
    ?>
  <main id="main"><section class="section"><div class="wrap property-missing">
    <p class="eyebrow">Property</p>
    <h1><?= $down ? 'We could not load this property just now.' : 'This property is no longer available.' ?></h1>
    <p><?= $down ? 'Please try again shortly, or call us and we will share the details.' : 'It may have been sold or removed. Our current properties are on the Buy page.' ?></p>
    <div class="banner-actions"><a class="btn btn-dark" href="/buy">See current properties <?= arg_icon('arrow') ?></a><a class="btn btn-ghost" href="tel:+919217093330"><?= arg_icon('phone') ?>+91 92170 93330</a></div>
  </div></section></main>
    <?php
    readfile(__DIR__ . '/includes/footer.html');
    echo "</body>\n</html>\n";
    exit;
}

$canonical = $site . $p['url'];
$pageTitle = $p['title'] . ' | ' . $p['price_label'] . ' | ARG';
$facts = array_filter([
    $p['floor'] !== null ? 'on floor ' . $p['floor'] : '',
    $p['facing'] ? 'facing ' . strtolower($p['facing']) : '',
]);
$summary = $p['bhk_text'] . ' ' . strtolower($p['type']) . ' in '
    . ($p['tower'] ? e($p['tower']) . ', ' : '') . e($p['society']) . ', ' . e($p['city']) . ', listed at ' . e($p['price_label'])
    . ' for ' . e($p['area_label']) . ' (about ₹' . number_format($p['per_sqft']) . ' per sq.ft)'
    . ($facts ? ', ' . e(implode(', ', $facts)) : '') . '.';
$metaDescription = $p['bhk_text'] . ' ' . strtolower($p['type']) . ' in ' . $p['society'] . ', ' . $p['city'] . ': ' . $p['price_label'] . ', ' . $p['area_label']
    . '. See details and book a site visit with Asset Realty Group.';
$image = $p['photos'][0] ?? $site . '/assets/img/arg-logo.jpeg';

$listingLd = [
    '@context' => 'https://schema.org',
    '@type' => 'RealEstateListing',
    'name' => $p['title'],
    'description' => $metaDescription,
    'url' => $canonical,
    'image' => $image,
    'identifier' => $p['code'],
    'offers' => ['@type' => 'Offer', 'price' => $p['price'], 'priceCurrency' => 'INR', 'availability' => 'https://schema.org/InStock', 'url' => $canonical,
        'seller' => ['@type' => 'RealEstateAgent', 'name' => 'Asset Realty Group', 'telephone' => '+91-9217093330', 'url' => $site . '/']],
    'about' => array_filter([
        '@type' => $p['type'] === 'Apartment' ? 'Apartment' : 'Residence',
        'name' => $p['name'] . ' in ' . $p['society'],
        'numberOfBedrooms' => $p['bhk'],
        'floorSize' => ['@type' => 'QuantitativeValue', 'value' => $p['area'], 'unitCode' => 'FTK'],
        'address' => array_filter(['@type' => 'PostalAddress', 'streetAddress' => trim($p['society'] . ($p['address'] ? ', ' . $p['address'] : '')), 'addressLocality' => $p['city'], 'postalCode' => $p['pincode'], 'addressCountry' => 'IN']),
    ]),
];
if ($p['listed_at']) {
    $listingLd['datePosted'] = substr($p['listed_at'], 0, 10);
}
$buyCity = '/buy?loc=' . rawurlencode($p['city']);
$crumbLd = ['@context' => 'https://schema.org', '@type' => 'BreadcrumbList', 'itemListElement' => [
    ['@type' => 'ListItem', 'position' => 1, 'name' => 'Home', 'item' => $site . '/'],
    ['@type' => 'ListItem', 'position' => 2, 'name' => 'Buy', 'item' => $site . '/buy'],
    ['@type' => 'ListItem', 'position' => 3, 'name' => 'Properties in ' . $p['city'], 'item' => $site . $buyCity],
    ['@type' => 'ListItem', 'position' => 4, 'name' => $p['name'] . ' in ' . $p['society']],
]];

$extraHead = '<link rel="canonical" href="' . e($canonical) . '">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="Asset Realty Group">
  <meta property="og:title" content="' . e($pageTitle) . '">
  <meta property="og:description" content="' . e($metaDescription) . '">
  <meta property="og:url" content="' . e($canonical) . '">
  <meta property="og:image" content="' . e($image) . '">
  <script type="application/ld+json">' . arg_ld_json($listingLd) . '</script>
  <script type="application/ld+json">' . arg_ld_json($crumbLd) . '</script>';

$visitMessage = 'Hi ARG, I would like to know more about the ' . $p['name'] . ' in ' . $p['society'] . ', ' . $p['city'] . ' (Ref ' . $p['code'] . ', ' . $p['price_label'] . '). Can we schedule a site visit?';
$waUrl = 'https://wa.me/919217093330?text=' . rawurlencode($visitMessage);
$photoMessage = 'https://wa.me/919217093330?text=' . rawurlencode('Hi ARG, please share photos of the ' . $p['name'] . ' in ' . $p['society'] . ' (Ref ' . $p['code'] . ').');

$details = array_filter([
    ['bed', 'Configuration', $p['bhk_text']],
    ['area', 'Area', $p['area_label']],
    ['rupee', 'Price per sq.ft', '₹' . number_format($p['per_sqft'])],
    ['home', 'Property type', $p['type']],
    ['building', 'Tower', $p['tower']],
    ['arrow-up', 'Floor', $p['floor'] !== null ? (string) $p['floor'] : ''],
    ['map', 'Facing', $p['facing']],
    ['key', 'Furnishing', $p['furnishing']],
    ['eye', 'Condition', $p['condition']],
    ['tag', 'Parking', $p['parking'] > 0 ? (string) $p['parking'] : ''],
], function ($row) { return $row[2] !== ''; });

$similar = array_values(array_filter($list, function ($x) use ($p) { return $x['code'] !== $p['code'] && $x['city'] === $p['city']; }));
if (count($similar) < 3) {
    $similar = array_merge($similar, array_values(array_filter($list, function ($x) use ($p) { return $x['code'] !== $p['code'] && $x['city'] !== $p['city']; })));
}
$similar = array_slice($similar, 0, 3);

header('Cache-Control: public, max-age=300');
arg_page_open($pageTitle, $metaDescription, $extraHead);
?>
  <main id="main">
    <section class="prop-head"><div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/">Home</a><span aria-hidden="true">/</span><a href="/buy">Buy</a><span aria-hidden="true">/</span><a href="<?= e($buyCity) ?>"><?= e($p['city']) ?></a><span aria-hidden="true">/</span><span aria-current="page"><?= e($p['society']) ?></span></nav>
      <div class="prop-head-row">
        <div>
          <h1><?= e($p['name']) ?> for Sale in <em><?= e($p['society']) ?>, <?= e($p['city']) ?></em></h1>
          <p class="prop-loc"><?= arg_icon('pin') ?><?= e(implode(', ', array_filter([$p['tower'], $p['address'], $p['society'], $p['city'], $p['pincode']]))) ?></p>
        </div>
        <div class="prop-price">
          <strong><?= e($p['price_label']) ?></strong>
          <span>₹<?= number_format($p['per_sqft']) ?> per sq.ft · Ref <?= e($p['code']) ?></span>
        </div>
      </div>
    </div></section>

    <section class="section prop-body"><div class="wrap prop-grid">
      <div class="prop-main">
        <?php if ($p['photos']): ?>
        <div class="gallery">
          <figure class="gallery-main"><img id="gallery-main" src="<?= e($p['photos'][0]) ?>" alt="<?= e($p['name'] . ' in ' . $p['society']) ?>, photo 1" width="1200" height="800" fetchpriority="high" decoding="async"></figure>
          <?php if (count($p['photos']) > 1): ?>
          <ul class="gallery-thumbs" aria-label="More photos">
            <?php foreach ($p['photos'] as $i => $photo): ?>
            <li><a href="<?= e($photo) ?>" data-gallery-thumb<?= $i === 0 ? ' aria-current="true"' : '' ?> aria-label="Show photo <?= $i + 1 ?> of <?= count($p['photos']) ?>"><img src="<?= e($photo) ?>" alt="" width="160" height="110" loading="lazy" decoding="async"></a></li>
            <?php endforeach; ?>
          </ul>
          <?php endif; ?>
        </div>
        <?php else: ?>
        <div class="gallery-empty">
          <?= arg_icon('building') ?>
          <p class="gallery-empty-name"><?= e($p['society']) ?></p>
          <p>Photos of this property are available on request.</p>
          <a class="btn btn-light btn-sm" href="<?= e($photoMessage) ?>" target="_blank" rel="noopener"><?= arg_icon('wa') ?>Ask for photos</a>
        </div>
        <?php endif; ?>

        <h2 class="prop-h2">Property details</h2>
        <dl class="prop-facts">
          <?php foreach ($details as [$icon, $label, $value]): ?>
          <div><?= arg_icon($icon) ?><dt><?= e($label) ?></dt><dd><?= e($value) ?></dd></div>
          <?php endforeach; ?>
        </dl>

        <h2 class="prop-h2">About this property</h2>
        <p class="prop-text">This is a <?= $summary ?></p>
        <?php if ($p['description']): ?><p class="prop-text"><?= nl2br(e($p['description'])) ?></p><?php endif; ?>

        <?php if ($p['videos']): ?>
        <h2 class="prop-h2">Videos</h2>
        <ul class="prop-videos">
          <?php foreach ($p['videos'] as $i => $video): ?>
          <li><?php if (preg_match('/\.(mp4|webm)(\?|$)/i', $video)): ?><video controls preload="none" src="<?= e($video) ?>" aria-label="Video <?= $i + 1 ?> of this property"></video><?php else: ?><a class="link" href="<?= e($video) ?>" target="_blank" rel="noopener">Watch video <?= $i + 1 ?> <?= arg_icon('arrow') ?></a><?php endif; ?></li>
          <?php endforeach; ?>
        </ul>
        <?php endif; ?>

        <p class="prop-note"><?= arg_icon('shield') ?><span>Details are as listed and can change. Please confirm price, availability and documents with the ARG team before you decide.</span></p>
      </div>

      <aside class="prop-side">
        <form class="form-card" id="visit" data-wa="<?= e($visitMessage) ?>" aria-labelledby="visit-title">
          <h2 id="visit-title">Book a site visit</h2>
          <p>Share your details and continue on WhatsApp with this property's reference.</p>
          <div class="form-grid">
            <div class="field full"><label for="v-name">Your name</label><input id="v-name" name="name" autocomplete="name" required minlength="2"></div>
            <div class="field full"><label for="v-phone">Mobile number</label><input id="v-phone" name="phone" type="tel" autocomplete="tel" inputmode="tel" required pattern="[0-9+\s\-]{10,15}" placeholder="10-digit mobile number"></div>
          </div>
          <button class="btn btn-copper btn-block" type="submit"><?= arg_icon('wa') ?>Continue on WhatsApp</button>
          <a class="btn btn-ghost btn-block prop-call" href="tel:+919217093330"><?= arg_icon('phone') ?>Call +91 92170 93330</a>
        </form>
      </aside>
    </div></section>

    <?php if ($similar): ?>
    <section class="section bg-paper"><div class="wrap">
      <div class="head-row"><div class="section-head"><p class="eyebrow">Keep looking</p><h2>More properties</h2></div><a class="btn btn-ghost" href="/buy">See all properties <?= arg_icon('arrow') ?></a></div>
      <div class="listing-grid three"><?php foreach ($similar as $i => $x) { echo arg_card_html($x, $i); } ?></div>
    </div></section>
    <?php endif; ?>
  </main>
<?php readfile(__DIR__ . '/includes/footer.html'); ?>
  <div class="mobile-bar"><a class="btn btn-dark" href="tel:+919217093330"><?= arg_icon('phone') ?>Call</a><a class="btn btn-wa" href="<?= e($waUrl) ?>" target="_blank" rel="noopener"><?= arg_icon('wa') ?>WhatsApp</a></div>
</body>
</html>
