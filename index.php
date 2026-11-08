<?php
$basePath = __DIR__ . '/index.html';
if (file_exists($basePath)) {
    readfile($basePath);
    exit;
}

http_response_code(404);
echo 'File aplikasi tidak ditemukan.';
