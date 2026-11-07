<?php
/**
 * Local preview only: php -S localhost:8000 dev-router.php
 * Copies the clean-URL rules from .htaccess for PHP's built-in server. Blocked on the live site.
 */
$path = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$root = __DIR__;
if ($path === '/') {
    readfile("$root/index.html");
    return true;
}
if ($path === '/buy') {
    require "$root/buy.php";
    return true;
}
if ($path === '/sitemap.xml') {
    require "$root/sitemap.php";
    return true;
}
if (preg_match('#^/property/([a-z0-9-]+)/?$#', $path, $m)) {
    $_GET['slug'] = $m[1];
    require "$root/property.php";
    return true;
}
if (is_file("$root$path.html")) {
    header('Content-Type: text/html; charset=utf-8');
    readfile("$root$path.html");
    return true;
}
if (is_file($root . $path)) {
    return false;
}
http_response_code(404);
echo 'Not found';
