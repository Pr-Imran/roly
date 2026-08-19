<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

$configPath = __DIR__ . '/config.php';
if (!is_file($configPath)) {
    http_response_code(503);
    echo json_encode([
        'ok' => false,
        'database' => ['connected' => false],
        'code' => 'SETUP_REQUIRED',
        'message' => 'Create api/config.php from config.example.php on the server.',
    ]);
    exit;
}

$config = require $configPath;
$allowedOrigin = (string)($config['allowed_origin'] ?? '');
$requestOrigin = (string)($_SERVER['HTTP_ORIGIN'] ?? '');
if ($requestOrigin !== '' && $allowedOrigin !== '' && hash_equals($allowedOrigin, $requestOrigin)) {
    header('Access-Control-Allow-Origin: ' . $allowedOrigin);
    header('Vary: Origin');
}

try {
    $dsn = sprintf(
        'mysql:host=%s;port=%d;dbname=%s;charset=%s',
        $config['db_host'],
        (int)($config['db_port'] ?? 3306),
        $config['db_name'],
        $config['db_charset'] ?? 'utf8mb4'
    );
    $pdo = new PDO($dsn, $config['db_user'], $config['db_password'], [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);
    $pdo->query('SELECT 1')->fetchColumn();
    $migration = $pdo->query("SELECT version FROM schema_migrations ORDER BY applied_at DESC LIMIT 1")->fetchColumn();

    echo json_encode([
        'ok' => true,
        'database' => [
            'connected' => true,
            'migration' => $migration ?: null,
        ],
        'php' => PHP_MAJOR_VERSION . '.' . PHP_MINOR_VERSION,
    ]);
} catch (Throwable $error) {
    error_log('ROLY database health check failed: ' . $error->getMessage());
    http_response_code(503);
    echo json_encode([
        'ok' => false,
        'database' => ['connected' => false],
        'code' => 'DATABASE_UNAVAILABLE',
        'message' => 'The server could not connect to the configured database. Check cPanel configuration and server logs.',
    ]);
}

