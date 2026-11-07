<?php
/** Served at /sitemap.xml. Property addresses update automatically as the inventory changes. */
declare(strict_types=1);
require __DIR__ . '/includes/inventory.php';

$site = rtrim(arg_config()['site_url'], '/');
header('Content-Type: application/xml; charset=utf-8');
header('Cache-Control: public, max-age=3600');
echo '<?xml version="1.0" encoding="UTF-8"?>' . "\n";
echo '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' . "\n";
foreach (['/', '/buy', '/sell', '/partner', '/about', '/contact'] as $page) {
    echo '  <url><loc>' . e($site . $page) . "</loc></url>\n";
}
foreach (arg_inventory() ?? [] as $p) {
    $date = substr($p['listed_at'], 0, 10);
    echo '  <url><loc>' . e($site . $p['url']) . '</loc>' . (preg_match('/^\d{4}-\d{2}-\d{2}$/', $date) ? "<lastmod>$date</lastmod>" : '') . "</url>\n";
}
echo "</urlset>\n";
