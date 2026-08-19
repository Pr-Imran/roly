# Namecheap Shared Hosting and MySQL Deployment

This guide targets regular Namecheap shared hosting with cPanel, PHP and MySQL/MariaDB.

## 1. Safe connection architecture

The browser must not connect directly to MySQL. MySQL credentials placed in React can be downloaded by every visitor and most hosting databases will not accept public browser connections.

Use this same-domain flow:

```text
https://your-domain.com React frontend
                 |
                 | fetch('/api/...')
                 v
public_html/api/*.php
                 |
                 | PDO using server-only config.php
                 v
Namecheap MySQL/MariaDB
```

The project now includes `public/api/health.php`. Vite copies it into `dist/api/health.php`, allowing the Super Admin database test to verify the hosted PHP-to-MySQL connection.

## 2. Build locally

```powershell
cd F:\Imran\roly\roly
npm install
npm run lint
npm run build
```

Do not place database credentials in `.env`, `.env.local`, TypeScript or the generated JavaScript.

## 3. Select PHP in cPanel

1. Open Namecheap **Hosting List → Go to cPanel**.
2. Open **Select PHP Version**.
3. Select PHP 8.2 or newer.
4. Ensure `pdo`, `pdo_mysql`, `fileinfo`, `json`, `mbstring` and `openssl` are enabled.
5. Enable `imagick` if available for future server-side image resizing.

## 4. Create the database

1. In cPanel open **MySQL Databases** or **Manage My Databases**.
2. Create a database, for example `roly`.
3. Create a separate database user with a strong random password.
4. Add that user to the database with required privileges.
5. Record the complete cPanel-prefixed names. They normally look like:

```text
Database: cpanelusername_roly
User:     cpanelusername_rolyapi
Host:     localhost
Port:     3306
```

6. Open **phpMyAdmin**, select the new database, choose **Import**, and import [database/001_initial_schema.sql](../database/001_initial_schema.sql).

## 5. Upload the website

1. Zip the contents inside `dist`.
2. In cPanel open **File Manager → public_html** for the main domain. For an addon domain, use the document root shown in cPanel **Domains**.
3. Upload and extract the zip.
4. Confirm these paths exist:

```text
public_html/index.html
public_html/assets/
public_html/api/health.php
public_html/api/config.example.php
public_html/api/.htaccess
public_html/uploads/.htaccess
public_html/.htaccess
```

Enable “Show Hidden Files” in File Manager if `.htaccess` is not visible.

## 6. Configure PHP-to-MySQL

In `public_html/api`:

1. Copy `config.example.php` to `config.php`.
2. Edit only `config.php` with the actual database information:

```php
<?php
return [
    'db_host' => 'localhost',
    'db_port' => 3306,
    'db_name' => 'cpanelusername_roly',
    'db_user' => 'cpanelusername_rolyapi',
    'db_password' => 'your-random-database-password',
    'db_charset' => 'utf8mb4',
    'allowed_origin' => 'https://your-domain.com',
];
```

3. Do not download or commit this completed file.
4. Best practice: place the real config above `public_html` and change `health.php` to require its absolute server path. If it remains in `api`, the included `.htaccess` blocks direct web access.
5. Use HTTPS before testing from Super Admin.

## 7. Test the connection

Open:

```text
https://your-domain.com/api/health.php
```

Expected result:

```json
{
  "ok": true,
  "database": {
    "connected": true,
    "migration": "001_initial_schema"
  },
  "php": "8.2"
}
```

Then open **Super Admin → MySQL Database Setup → Test connection**. The frontend calls the same endpoint; it does not receive the database password.

If `SETUP_REQUIRED` appears, `api/config.php` is missing. If `DATABASE_UNAVAILABLE` appears, check the cPanel-prefixed database/user names, password, assigned privileges, `localhost`, selected database and server error log.

## 8. What the included PHP endpoint does

It confirms:

- PHP is running;
- PDO can connect to MySQL/MariaDB;
- the migration table exists;
- the current migration version can be read.

It does not yet provide production login, registration, CRUD, payments or upload authorization. Those endpoints must implement [the backend contract](BACKEND_API_CONTRACT.md) before real commerce data replaces browser `localStorage`.

## 9. Where product and homepage images stay

Do not store image binary data inside MySQL. Use:

```text
public_html/uploads/products/{product-id}/{colour-code}/{hash}-640.webp
public_html/uploads/products/{product-id}/{colour-code}/{hash}-1200.webp
public_html/uploads/site/{section}/{hash}-1600.webp
public_html/uploads/videos/{hash}.mp4
```

MySQL stores only metadata in `product_media`/site settings:

- product ID and optional color code;
- public URL or object key;
- width and height;
- format and byte size;
- alt text and sort order.

Updating the `dist` files must not delete `public_html/uploads`. Back up that directory separately. On larger sites, move media to S3-compatible storage/CDN.

## 10. Managing homepage/product media

The current Super Admin supports:

- product gallery and color image URLs in **Product Variations**;
- hero, audience cards, latest banners, stories and campaign URLs in **Pages, Menus & Media**;
- video carousel MP4/poster URLs;
- workwear video/poster URLs;
- “Featured in Roly” and “Featured in Workwear” model-code lists;
- certification logo URLs.

Product-rail images come from the selected products, so changing a product's image updates its homepage card.

The current file inputs/URL editors do not securely upload files to hosting. A production media-upload endpoint needs authenticated Super Admin authorization, MIME/signature validation, resizing/encoding and audit logging. Until it is implemented, upload optimized files through cPanel/FTP and paste their `/uploads/...` URLs into Super Admin.

## 11. Recommended permissions and protection

- Directories: normally `755`.
- Files: normally `644`.
- `config.php`: restrict as tightly as the server permits, commonly `600` or `640`.
- Never set all files/directories to `777`.
- Keep directory listing disabled.
- Keep PHP execution blocked inside `uploads`.
- Keep HTTPS enabled and redirect HTTP to HTTPS through cPanel/`.htaccess`.

## 12. Update procedure

1. Back up MySQL and `public_html/uploads`.
2. Run/build/test locally.
3. Upload new `index.html`, `assets`, `api` code and `.htaccess`.
4. Do not overwrite the live `api/config.php` with the example.
5. Do not delete `uploads`.
6. Apply new numbered SQL migrations through phpMyAdmin.
7. Test `/api/health.php`, homepage, login/roles when backend exists, product images, checkout and documents.

