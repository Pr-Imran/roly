# Installation and Production Deployment Guide

## 1. Choose the deployment type

### A. UI review or staging demo

Deploy the generated `dist` directory as a static website. Data remains in each browser's `localStorage`; there is no shared database, real login, durable upload, or payment processing.

### B. Real production commerce

Deploy three services:

- this React frontend;
- an authenticated backend API implementing [the API contract](BACKEND_API_CONTRACT.md);
- MySQL 8.0+ plus private image/object storage.

The current repository does not yet include that production API. Completing only the static deployment is not sufficient for real customers.

## 2. Local installation

Requirements:

- Node.js 20 LTS or newer;
- npm 10 or newer;
- Git (recommended);
- Chrome, Edge or Firefox.

Windows PowerShell:

```powershell
cd F:\Imran\roly\roly
npm install
npm run lint
npm run dev
```

Open `http://localhost:3000`. Stop the server with `Ctrl+C`.

Build verification:

```powershell
npm run lint
npm run build
npm run preview
```

The deployable frontend is written to `dist`.

## 3. Local demo reset

Open browser developer tools, select **Application → Local Storage → http://localhost:3000**, clear the records, and refresh. This restores default demo products, categories and users. It does not touch MySQL.

## 4. Static staging deployment

### Generic hosting panel

1. Run `npm ci` and `npm run build` locally or in CI.
2. Upload the contents of `dist`, not the `dist` folder itself, to the domain's public directory.
3. Configure all unknown routes to return `index.html` if real URL routing is added later.
4. Enable HTTPS and compression.
5. Do not upload `.env.local`, database passwords, source maps containing secrets, or deployment credentials.

### Nginx example

```nginx
server {
    listen 80;
    server_name shop.example.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name shop.example.com;

    root /var/www/roly-frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /assets/ {
        try_files $uri =404;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }

    location /api/ {
        proxy_pass http://127.0.0.1:8080/;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Add certificate paths through Certbot or the hosting provider rather than copying placeholder paths.

## 5. Production server requirements

Recommended minimum for a small deployment:

- Ubuntu 24.04 LTS or managed application hosting;
- 2 CPU, 4 GB RAM for frontend/API workloads;
- managed MySQL 8.0 with automated backups;
- S3-compatible object storage/CDN for images;
- transactional email provider;
- HTTPS certificate and DNS access;
- secret manager or protected server environment file.

Keep MySQL on a private network or firewall it so only the API server can connect.

## 6. MySQL database installation

For a managed MySQL service, create the database and restricted application user in its control panel. For a self-managed server:

```sql
CREATE DATABASE roly_commerce
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

CREATE USER 'roly_api'@'10.%' IDENTIFIED BY 'replace-with-a-random-secret';
GRANT SELECT, INSERT, UPDATE, DELETE, CREATE, ALTER, INDEX, REFERENCES
  ON roly_commerce.* TO 'roly_api'@'10.%';
FLUSH PRIVILEGES;
```

Adjust the allowed host to the exact private API host/subnet. Do not use `root` as the application user.

Apply the starter migration:

```powershell
mysql --host=127.0.0.1 --port=3306 --user=roly_api --password roly_commerce < database\001_initial_schema.sql
```

On Linux:

```bash
mysql --host=127.0.0.1 --port=3306 --user=roly_api --password roly_commerce < database/001_initial_schema.sql
```

The schema uses `CREATE TABLE IF NOT EXISTS`, but future changes must be separate numbered migrations. Never edit a migration after it has run in production.

## 7. Server-only environment settings

The following values belong to the backend deployment, not Vite:

```dotenv
NODE_ENV=production
APP_URL=https://shop.example.com
API_PORT=8080

MYSQL_HOST=private-mysql.example.internal
MYSQL_PORT=3306
MYSQL_DATABASE=roly_commerce
MYSQL_USER=roly_api
MYSQL_PASSWORD=replace-with-random-database-secret
MYSQL_SSL=true

SESSION_SECRET=replace-with-at-least-32-random-bytes
BOOTSTRAP_OWNER_EMAIL=owner@example.com
BOOTSTRAP_OWNER_PASSWORD=replace-with-one-time-random-secret

OBJECT_STORAGE_ENDPOINT=https://storage.example.com
OBJECT_STORAGE_BUCKET=roly-product-media
OBJECT_STORAGE_ACCESS_KEY=server-only-key
OBJECT_STORAGE_SECRET_KEY=server-only-secret

SMTP_HOST=smtp.example.com
SMTP_USER=server-only-user
SMTP_PASSWORD=server-only-secret
```

Never prefix any secret with `VITE_`; Vite exposes those variables to browser JavaScript.

## 8. Create the default protected Super Admin

The backend must provide an idempotent command such as:

```bash
npm run admin:bootstrap
```

Required command behavior:

1. Require `BOOTSTRAP_OWNER_EMAIL` and `BOOTSTRAP_OWNER_PASSWORD`.
2. Validate strong password length and breach policy.
3. Hash with Argon2id or bcrypt.
4. Start a database transaction.
5. Stop if another bootstrap owner exists.
6. Insert/update the matching account as active `super_admin` with `is_bootstrap_owner = true`.
7. Write an audit event without logging the password/hash.
8. Exit successfully when the same owner was already initialized.

Afterwards, remove `BOOTSTRAP_OWNER_PASSWORD` from long-term environment configuration if the platform supports one-time secrets. The owner should immediately change the password and enable MFA.

There is intentionally no documented default password.

## 9. Create another Super Admin

1. The second administrator uses public registration; the server creates a Client.
2. Verify that user's email.
3. Sign in as bootstrap owner.
4. Open **Super Admin → Users & Roles**.
5. Select the account and assign **Super Admin**.
6. Confirm re-authentication/MFA.
7. Confirm a `role_change_audit` row was written.
8. Have the second administrator sign in and verify access.

Do not create a second administrator with a shared password or SQL copied from documentation.

## 10. Backend deployment order

Use this order for each release:

1. Back up MySQL and verify the latest restore test.
2. Upload/build the new backend version without routing traffic to it.
3. Run pending database migrations once.
4. Run the bootstrap-owner command; it must be idempotent.
5. Start the API and check `/health/live` and `/health/ready`.
6. Build frontend with its public API base URL only.
7. Deploy the versioned frontend assets and `index.html`.
8. Run the smoke-test checklist.
9. Monitor errors, login failures, order creation, payment webhooks and queue failures.
10. Keep the previous application version available for rollback; do not roll back destructive database migrations blindly.

## 11. Image deployment

Production uploads should go through the API:

1. Validate MIME signature and dimensions.
2. Limit originals to a configured size, such as 10 MB.
3. remove EXIF/geolocation metadata;
4. create 160, 640, 1200 and optional 1600 pixel versions;
5. encode WebP and optionally AVIF;
6. write files to object storage with content-hashed names;
7. save URL, dimensions, bytes, format and sort order in `product_media`;
8. serve through a CDN with immutable caching.

Do not store image binaries/base64 in MySQL or browser storage.

## 12. Backups and recovery

- Automated MySQL backups: daily, with point-in-time recovery if available.
- Retention: at least 30 daily and 12 monthly backups for a commerce system, adjusted to policy.
- Object storage: enable versioning or replication.
- Secrets: keep an encrypted recovery copy outside the server.
- Test restoration to an isolated environment at least quarterly.
- Document recovery-time and recovery-point objectives.

Example logical backup:

```bash
mysqldump --single-transaction --routines --triggers roly_commerce > roly_commerce_YYYY-MM-DD.sql
```

Encrypt and move backups off the application server.

## 13. Production smoke-test checklist

- Homepage, desktop dropdowns and mobile submenus load over HTTPS.
- Registration creates a Client even if a forged request submits `super_admin`.
- Login, logout, session expiry, password reset and MFA work.
- Owner cannot be demoted, suspended or deleted.
- Owner can promote a verified Client to Super Admin.
- Secondary Super Admin can manage normal operations but cannot alter owner protection.
- Category changes synchronize to the public menu.
- Product variant and `-BIG` SKUs are correct.
- Two concurrent orders cannot oversell inventory.
- Packing list, delivery note and invoice preview/print/PDF work.
- Payment success comes from a verified webhook.
- Unauthorized users receive `403`, not merely a hidden button.
- Uploaded images are optimized and served through the CDN.
- Backup and restore procedures have been tested.

## 14. Current frontend-only deployment limitation

The local Super Admin and MySQL screens model the intended workflow, but they are not security controls. Until the backend exists:

- users and roles are browser-local;
- passwords/sessions are not implemented;
- data is not shared across devices;
- database configuration is not contacted;
- image optimization does not upload/process files;
- payment settings do not call a gateway.

Use a frontend-only deployment only for review/staging, not live commerce.

