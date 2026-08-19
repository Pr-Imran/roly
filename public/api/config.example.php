<?php
declare(strict_types=1);

// Copy this file to config.php in cPanel File Manager and replace the values.
// config.php is blocked from web access by api/.htaccess. Prefer placing it
// above public_html and changing health.php to require that absolute path.
return [
    'db_host' => 'localhost',
    'db_port' => 3306,
    'db_name' => 'cpaneluser_roly',
    'db_user' => 'cpaneluser_rolyapi',
    'db_password' => 'replace-with-the-cpanel-database-user-password',
    'db_charset' => 'utf8mb4',
    'allowed_origin' => 'https://your-domain.example',
];

