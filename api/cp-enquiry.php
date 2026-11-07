<?php
/**
 * ARG Channel Partner enquiry endpoint.
 *
 * One public form, one lead type ("Website CP Enquiry"). Collaboration interests are
 * stored as attributes of the lead, never as separate partner categories. Submitting
 * an enquiry does not activate portal access or create any agreement.
 *
 * Order of work: validate -> spam checks -> rate limit -> save lead -> notify -> CRM.
 * The saved file is the source of truth, so a failed email or CRM call never loses a lead.
 */
declare(strict_types=1);

const LEAD_TYPE = 'Website CP Enquiry';
const CONSENT_VERSION = '2026-11-v1';
const CONSENT_TEXT = 'I agree that Asset Realty Group may contact me by phone, WhatsApp or email about this Channel Partner enquiry and keep these details for that purpose.';
const INTERESTS = [
    'property' => ['property_opportunities'],
    'buyer'    => ['buyer_connections'],
    'both'     => ['property_opportunities', 'buyer_connections'],
];
const MAX_BODY_BYTES = 8192;
const MIN_FILL_SECONDS = 2;
const RATE_LIMIT = 8;             // submissions per IP per hour
const DUPLICATE_WINDOW_DAYS = 90;

$config = array_merge([
    'data_dir'     => getenv('ARG_CP_DATA_DIR') ?: dirname(__DIR__, 2) . '/arg_private/cp_enquiries',
    'notify_email' => 'info@assetrealtygroup.in',
    'from_email'   => 'no-reply@assetrealtygroup.in',
    'crm_webhook'  => '',
    'crm_token'    => '',
    'hash_salt'    => 'change-me-in-config',
], is_file(__DIR__ . '/config.php') ? (array) require __DIR__ . '/config.php' : []);

$wantsJson = stripos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false;

function respond(int $status, array $body, bool $json): void
{
    http_response_code($status);
    header('X-Content-Type-Options: nosniff');
    header('Cache-Control: no-store');
    if ($json) {
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($body);
        exit;
    }
    // Plain page for browsers submitting without JavaScript
    header('Content-Type: text/html; charset=utf-8');
    $title = !empty($body['ok']) ? 'Thank you. Your enquiry is with the ARG team.' : 'We could not send your enquiry.';
    $text = !empty($body['ok'])
        ? 'The team will review your enquiry and contact you to discuss the next steps.'
        : implode(' ', array_values($body['errors'] ?? [$body['message'] ?? 'Please go back and try again.']));
    echo '<!doctype html><html lang="en-IN"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">'
        . '<title>ARG Channel Partner enquiry</title><body style="font:16px/1.6 sans-serif;max-width:560px;margin:15vh auto;padding:0 16px;color:#233238">'
        . '<h1 style="color:#26626A">' . htmlspecialchars($title) . '</h1><p>' . htmlspecialchars($text) . '</p>'
        . '<p><a href="/partner" style="color:#26626A">Back to the Channel Partner programme</a></p></body></html>';
    exit;
}

function clean(string $key, int $max): string
{
    $value = $_POST[$key] ?? '';
    if (!is_string($value)) {
        return '';
    }
    $value = trim((string) preg_replace('/\s+/u', ' ', strip_tags($value)));
    return mb_substr($value, 0, $max);
}

/** Runs $work while holding an exclusive lock, so simultaneous submissions cannot race. */
function withLock(string $dir, callable $work)
{
    $lock = fopen($dir . '/.lock', 'c');
    if ($lock === false || !flock($lock, LOCK_EX)) {
        throw new RuntimeException('Could not lock storage');
    }
    try {
        return $work();
    } finally {
        flock($lock, LOCK_UN);
        fclose($lock);
    }
}

function prepareStorage(string $dir): void
{
    if (!is_dir($dir) && !mkdir($dir, 0750, true) && !is_dir($dir)) {
        throw new RuntimeException('Could not create storage directory');
    }
    // Normally outside the web root; this also protects it if the path is ever public
    if (!is_file($dir . '/.htaccess')) {
        file_put_contents($dir . '/.htaccess', "Require all denied\nDeny from all\n");
    }
}

function rateLimited(string $dir, string $ipHash): bool
{
    $file = $dir . '/rate.json';
    $now = time();
    $hits = is_file($file) ? (json_decode((string) file_get_contents($file), true) ?: []) : [];
    foreach ($hits as $ip => $times) {
        $hits[$ip] = array_values(array_filter($times, function ($t) use ($now) { return $t > $now - 3600; }));
        if (!$hits[$ip]) {
            unset($hits[$ip]);
        }
    }
    $limited = count($hits[$ipHash] ?? []) >= RATE_LIMIT;
    if (!$limited) {
        $hits[$ipHash][] = $now;
    }
    file_put_contents($file, json_encode($hits));
    return $limited;
}

function findExistingLead(string $file, string $mobile): ?string
{
    if (!is_file($file)) {
        return null;
    }
    $cutoff = time() - DUPLICATE_WINDOW_DAYS * 86400;
    $handle = fopen($file, 'r');
    $found = null;
    while ($handle && ($line = fgets($handle)) !== false) {
        $lead = json_decode($line, true);
        if (is_array($lead) && ($lead['mobile'] ?? '') === $mobile && empty($lead['duplicate_of'])
            && strtotime((string) $lead['created_at']) >= $cutoff) {
            $found = $lead['id'];
        }
    }
    if ($handle) {
        fclose($handle);
    }
    return $found;
}

function logDelivery(string $dir, string $id, string $channel, bool $ok): void
{
    file_put_contents($dir . '/delivery.log', date('c') . " $id $channel " . ($ok ? 'ok' : 'FAILED') . "\n", FILE_APPEND | LOCK_EX);
}

function notifyTeam(array $lead, array $config): bool
{
    $repeat = !empty($lead['duplicate_of']);
    $subject = ($repeat ? 'Repeat ' : 'New ') . LEAD_TYPE . ' - ' . $lead['id'];
    $body = implode("\n", array_filter([
        $repeat ? 'This number already enquired (original: ' . $lead['duplicate_of'] . '). Please do not create a second lead.' : '',
        'Lead type: ' . LEAD_TYPE,
        'Name: ' . $lead['full_name'],
        'Mobile: ' . $lead['mobile'],
        'City / area: ' . $lead['city_area'],
        'Applying as: ' . $lead['applicant_type'],
        $lead['firm_name'] ? 'Firm: ' . $lead['firm_name'] : '',
        $lead['email'] ? 'Email: ' . $lead['email'] : '',
        'Interested in: ' . implode(', ', $lead['collaboration_interests']),
        'Consent: yes (' . $lead['consent']['version'] . ')',
        'Received: ' . $lead['created_at'],
        '',
        'Portal access has not been activated. Route to authorised onboarding.',
    ], function ($line) { return $line !== ''; }));
    $headers = 'From: ARG Website <' . $config['from_email'] . ">\r\nContent-Type: text/plain; charset=utf-8";
    if ($lead['email']) {
        $headers .= "\r\nReply-To: " . $lead['email']; // validated by FILTER_VALIDATE_EMAIL, so no header injection
    }
    return function_exists('mail') && @mail($config['notify_email'], $subject, $body, $headers);
}

function sendToCrm(array $lead, array $config): bool
{
    if (!function_exists('curl_init')) {
        return false;
    }
    $headers = ['Content-Type: application/json'];
    if ($config['crm_token']) {
        $headers[] = 'Authorization: Bearer ' . $config['crm_token'];
    }
    $curl = curl_init($config['crm_webhook']);
    curl_setopt_array($curl, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => json_encode($lead),
        CURLOPT_HTTPHEADER => $headers,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 5,
    ]);
    curl_exec($curl);
    $status = (int) curl_getinfo($curl, CURLINFO_RESPONSE_CODE);
    curl_close($curl);
    return $status >= 200 && $status < 300;
}

/* ---------- Request checks ---------- */
if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'message' => 'Please use the form on the Channel Partner page.'], $wantsJson);
}
if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > MAX_BODY_BYTES) {
    respond(413, ['ok' => false, 'message' => 'That submission is too large.'], $wantsJson);
}
$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if ($origin !== '' && strcasecmp((string) parse_url($origin, PHP_URL_HOST), (string) preg_replace('/:\d+$/', '', $_SERVER['HTTP_HOST'] ?? '')) !== 0) {
    respond(403, ['ok' => false, 'message' => 'Please use the form on the Channel Partner page.'], $wantsJson);
}

/* ---------- Spam: bots get a normal-looking success and nothing is stored ---------- */
$started = (int) ($_POST['started'] ?? 0); // milliseconds since the visitor first used the form
$tooFast = isset($_POST['started']) && $started < MIN_FILL_SECONDS * 1000;
if (!empty($_POST['website']) || $tooFast) {
    respond(200, ['ok' => true], $wantsJson);
}

/* ---------- Validation ---------- */
$errors = [];
$name = clean('full_name', 100);
if (mb_strlen($name) < 2 || !preg_match("/^[\p{L}\p{M} .'-]+$/u", $name)) {
    $errors['full_name'] = 'Please enter your full name.';
}
$digits = (string) preg_replace('/\D/', '', (string) ($_POST['mobile'] ?? ''));
$digits = (string) preg_replace('/^(?:91|0)(?=\d{10}$)/', '', $digits);
if (!preg_match('/^[6-9]\d{9}$/', $digits)) {
    $errors['mobile'] = 'Please enter a valid 10-digit Indian mobile number.';
}
$city = clean('city_area', 100);
if (mb_strlen($city) < 2) {
    $errors['city_area'] = 'Please enter your city or area.';
}
$applicantType = clean('applicant_type', 20);
if (!in_array($applicantType, ['Individual', 'Firm'], true)) {
    $errors['applicant_type'] = 'Please choose Individual or Firm.';
}
$email = clean('email', 150);
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $errors['email'] = 'Please enter a valid email address, or leave it blank.';
}
$firm = $applicantType === 'Firm' ? clean('firm_name', 120) : '';
$interest = clean('interest', 20);
if (!isset(INTERESTS[$interest])) {
    $errors['interest'] = 'Please choose how you would like to collaborate.';
}
if (($_POST['consent'] ?? '') !== 'yes') {
    $errors['consent'] = 'Please confirm that ARG may contact you about this enquiry.';
}
if ($errors) {
    respond(422, ['ok' => false, 'errors' => $errors], $wantsJson);
}

/* ---------- Save, then deliver ---------- */
$now = date('c');
$ipHash = hash('sha256', ($_SERVER['REMOTE_ADDR'] ?? '') . $config['hash_salt']);
$mobile = '+91' . $digits;
$source = [];
foreach (['page', 'utm_source', 'utm_medium', 'utm_campaign'] as $key) {
    $value = clean('src_' . $key, 200);
    if ($value !== '') {
        $source[$key] = $value;
    }
}

try {
    $dir = $config['data_dir'];
    prepareStorage($dir);
    $lead = withLock($dir, function () use ($dir, $ipHash, $mobile, $name, $city, $applicantType, $firm, $email, $interest, $now, $source) {
        if (rateLimited($dir, $ipHash)) {
            return null;
        }
        $file = $dir . '/enquiries.jsonl';
        $lead = [
            'id' => 'CP-' . date('Ymd') . '-' . strtoupper(bin2hex(random_bytes(3))),
            'lead_type' => LEAD_TYPE,
            'created_at' => $now,
            'status' => 'new',
            'duplicate_of' => findExistingLead($file, $mobile),
            'full_name' => $name,
            'mobile' => $mobile,
            'city_area' => $city,
            'applicant_type' => $applicantType,
            'firm_name' => $firm,
            'email' => $email,
            'collaboration_interests' => INTERESTS[$interest],
            'consent' => ['given' => true, 'version' => CONSENT_VERSION, 'text' => CONSENT_TEXT, 'at' => $now],
            'source' => $source,
            'ip_hash' => $ipHash,
            'portal_access_activated' => false,
        ];
        if (file_put_contents($file, json_encode($lead, JSON_UNESCAPED_UNICODE) . "\n", FILE_APPEND) === false) {
            throw new RuntimeException('Could not save lead');
        }
        return $lead;
    });
} catch (Throwable $e) {
    error_log('CP enquiry storage error: ' . $e->getMessage());
    respond(500, ['ok' => false, 'message' => 'We could not save your enquiry.'], $wantsJson);
}

if ($lead === null) {
    respond(429, ['ok' => false, 'message' => 'Too many attempts. Please try again later, or call or WhatsApp us.'], $wantsJson);
}

logDelivery($dir, $lead['id'], 'email', notifyTeam($lead, $config));
if ($config['crm_webhook'] && !$lead['duplicate_of']) {
    logDelivery($dir, $lead['id'], 'crm', sendToCrm($lead, $config));
}

// A repeat enquiry gets the same response, so the form never reveals whether a number is already known
respond(200, ['ok' => true], $wantsJson);
