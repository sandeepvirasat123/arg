<?php
/** Same-site listing feed for the Home page's "latest properties" tabs. Only cleaned, publishable data. */
declare(strict_types=1);
require dirname(__DIR__) . '/includes/inventory.php';

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');

$list = arg_inventory();
if ($list === null) {
    http_response_code(503);
    echo json_encode(['ok' => false]);
    exit;
}
header('Cache-Control: public, max-age=120');
echo json_encode(['ok' => true, 'total' => count($list), 'rows' => array_map(function ($p) {
    return ['code' => $p['code'], 'bhk' => $p['bhk'], 'html' => arg_card_html($p)];
}, array_slice($list, 0, 40))]);
