# Local Run, Database and Image Hosting Guide

This guide explains how to run and test the current project, what the MySQL screens currently do, when a real database is needed, and how product images should be optimized for production hosting.

For the complete application flow, user roles, production deployment and operating procedures, start at [docs/README.md](docs/README.md).

## 1. Current project status

The application is currently a React/Vite single-page application.

- Products, orders, cart data, site content, commerce settings and the MySQL form are saved in the browser's `localStorage`.
- The storefront and administration screens can be tested locally without MySQL.
- The MySQL connection and image optimizer screens are demonstrations of the intended administration workflow.
- They do **not** currently contact a MySQL server, create database tables, upload files, or compress images.
- Product and site images are currently stored as image URLs, not as uploaded image files.

> Important: do not enter a real production MySQL password in the current browser form. Browser data can be read by anyone who has access to that browser profile. Database passwords and payment secrets must only exist on the server.

## 2. Requirements

Install:

- Node.js 20 LTS or newer
- npm, which is included with Node.js
- A modern browser such as Chrome, Edge or Firefox

MySQL is not required for the current local UI demonstration.

## 3. Run locally on Windows

Open PowerShell and run:

```powershell
cd F:\Imran\roly\roly
npm install
npm run dev
```

Open:

```text
http://localhost:3000
```

The development server remains active while the PowerShell window is open. Stop it with `Ctrl+C`.

The `GEMINI_API_KEY` shown in `.env.example` is not required for the current storefront, administration, cart or checkout flows.

## 4. What to test locally

### Storefront

1. Open the homepage and check the header, hero slider and homepage sections.
2. Open a category and use its filters.
3. Open a product, select a colour and enter quantities for different sizes.
4. Add the product to the cart.
5. Open checkout and select a delivery and payment method.
6. Place the test order and inspect order tracking and the client area.

### Administration

1. Select the account icon in the top-right header.
2. Select **Super Admin**.
3. Test these administration sections:
   - **Branding & Site Texts**: logo, favicon, company details, colour and global text.
   - **Pages, Menus & Media**: parent categories, synchronized submenus, navigation, hero slides, homepage cards and footer.
   - **Users & Roles**: register a user (always Client), promote users, suspend accounts, and confirm that the bootstrap owner is locked.
   - **Product Variations**: products, colours, colour images, gallery images and prices.
   - **Stock & Variant SKUs**: stock quantities for every colour and size.
   - **Payments & Delivery**: checkout methods, tax behavior, fees and shipping rules.
   - **Order Processing**: order status, payment status, carrier and tracking data.

When an XL, XXL/2XL, XXXL/3XL or larger size is selected, its generated variant SKU ends in `-BIG`.

### Reset all local demonstration data

The application intentionally retains changes between browser refreshes. To start again:

1. Open browser developer tools with `F12`.
2. Open **Application** or **Storage**.
3. Open **Local Storage** and select `http://localhost:3000`.
4. Clear the stored values.
5. Refresh the page.

This deletes only the data stored by the local browser demonstration.

## 5. Validate a production build

Run:

```powershell
cd F:\Imran\roly\roly
npm run lint
npm run build
npm run preview
```

The optimized site is created in `dist`. The preview server normally opens at:

```text
http://localhost:4173
```

Upload the contents of `dist` only when deploying the frontend as a static site.

## 6. Does MySQL connect and create tables automatically now?

No. In the current version:

- **Test & Save MySQL Connection** validates form fields and simulates a successful connection.
- **Connect & Initialize MySQL** does not open a network connection.
- MySQL configuration is saved only in browser `localStorage`.
- **Download schema.sql** generates a starter SQL file, but does not execute it.

The downloaded schema can be reviewed or manually imported by a database administrator, but it is not a replacement for a complete server migration system. A more complete reviewable starter migration is included at [database/001_initial_schema.sql](database/001_initial_schema.sql).

## 7. When is a real MySQL database needed?

You do not need MySQL while reviewing the UI on one computer.

Add the backend and database before any of these situations:

- real customers, staff or vendors sign in;
- data must be shared between browsers or devices;
- real orders, payments, stock or invoices are accepted;
- uploaded images must be retained;
- roles and permissions must be enforced securely;
- backups, reports or audit history are required;
- the site is opened to the public.

For production, the browser should communicate with an HTTPS API. The API—not React—should connect to MySQL.

```text
Browser / React frontend
          |
          | HTTPS JSON requests
          v
Server API with authentication
          |
          | Private database connection
          v
        MySQL
```

## 8. Recommended database initialization

The backend should use versioned migrations. On deployment, the server runs pending migrations once and records which versions were applied. Migrations should be safe to run again.

A complete production schema will normally need:

- administrators, users, roles, permissions and sessions;
- customers, companies and addresses;
- vendors and warehouses;
- categories, products and product content;
- colours, sizes, generated SKUs and product media;
- stock balances, reservations and stock movement history;
- carts, orders and order items;
- payments, gateway events, refunds and reconciliation;
- shipments, packages and tracking events;
- invoices, delivery notes and packing lists;
- site settings, navigation, homepage content and footer content;
- audit logs and notification records.

Keep server credentials in server-only environment variables. Never prefix secrets with `VITE_`, because Vite variables with that prefix are included in browser code.

Example server-only settings:

```dotenv
MYSQL_HOST=127.0.0.1
MYSQL_PORT=3306
MYSQL_DATABASE=store_database
MYSQL_USER=store_api
MYSQL_PASSWORD=replace_with_a_strong_secret
MYSQL_SSL=true
```

Use a restricted database user. It should not be the MySQL `root` account.

### Bootstrap owner and registration security

Do not hardcode an owner email or password in React, JavaScript, a public Git repository, or `schema.sql`. That would expose the backdoor to every visitor who downloads the frontend files.

The production backend should instead:

1. Create exactly one bootstrap owner during the first server-side migration or deployment command.
2. Read the initial owner email and password from deployment secrets, hash the password with Argon2id or bcrypt, then discard the plaintext value.
3. Mark this account as `is_bootstrap_owner = true` and prevent API operations from deleting, suspending or demoting it.
4. Force every public registration to use the `client` role, ignoring any role value supplied by the browser.
5. Allow the bootstrap owner to promote another existing user to Super Admin; ordinary administrators should not be able to create an owner.
6. Require MFA for privileged users and write every role change to an audit table.

Example server-only bootstrap values:

```dotenv
BOOTSTRAP_OWNER_EMAIL=owner@example.com
BOOTSTRAP_OWNER_PASSWORD=use-a-long-random-deployment-secret
```

The current local demo models these rules in `localStorage` so the interface can be tested, but browser-side checks are not production security.

## 9. Current image behavior

The admin currently saves URLs such as:

```text
https://cdn.example.com/products/model-colour-800.webp
```

The image optimizer screen currently changes demonstration statistics only. It does not process files. Remote reference images also remain dependent on the remote host and may disappear or become slow.

Do not store large images as base64 text in MySQL or `localStorage`. Store image files in object storage or a dedicated uploads directory, and save only their paths and metadata in MySQL.

## 10. Recommended image optimization pipeline

When an administrator uploads an image, the production server should:

1. Verify that the file is a genuine JPEG, PNG or WebP image.
2. Reject unexpectedly large files; a reasonable original upload limit is 10 MB.
3. Remove EXIF metadata, including camera and location information.
4. Correct image orientation.
5. Resize the image without enlarging a small source.
6. Generate modern WebP or AVIF variants.
7. Generate a small placeholder or thumbnail.
8. Save dimensions, file size and URL in the database.
9. Serve the files through a CDN with long cache headers.

Suggested output sizes:

| Use | Width | Format and quality target |
| --- | ---: | --- |
| Admin thumbnail | 160 px | WebP quality 70–75 |
| Product/card image | 480–640 px | WebP quality 75–82 |
| Product detail | 1000–1200 px | WebP quality 80–85 |
| Zoom image | 1600 px maximum | WebP or AVIF quality 82–88 |

For transparent garment cut-outs, use WebP with alpha and test that fabric edges remain clean. Keep the original source in private storage only if future reprocessing is required.

## 11. Recommended image storage

For a small server:

```text
/var/www/store/uploads/products/ab/cd/content-hash-800.webp
```

For scalable hosting, use S3-compatible object storage such as Amazon S3, Cloudflare R2, Backblaze B2 or the hosting provider's object-storage service.

Recommended file naming:

```text
products/{product-id}/{colour-code}/{content-hash}-{width}.webp
```

Content hashes prevent duplicate uploads and allow aggressive browser caching. Deleting a product should enqueue unused images for cleanup rather than immediately deleting a file that another record might reference.

## 12. Frontend image delivery checklist

The final frontend should use:

- `loading="lazy"` for images below the first screen;
- explicit image width and height to prevent layout movement;
- `srcset` and `sizes` so mobile devices do not download desktop images;
- a small placeholder while the full image loads;
- a fallback image when an external URL fails;
- CDN cache headers such as `Cache-Control: public, max-age=31536000, immutable` for hashed files.

## 13. Recommended production implementation order

1. Finish reviewing the local storefront and administration UI.
2. Choose hosting, a MySQL provider, an image-storage provider and a payment gateway.
3. Build the authenticated server API and database migrations.
4. Replace `localStorage` product/order/settings operations with API requests.
5. Implement secure server-side image upload and optimization.
6. Connect the selected payment gateway using its server SDK and webhook verification.
7. Import demonstration data into MySQL.
8. Test backups, restores, permissions, refunds, failed payments and stock conflicts.
9. Deploy to staging before accepting live customers.
