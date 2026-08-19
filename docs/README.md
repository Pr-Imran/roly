# ROLY Commerce Documentation

This directory is the operating manual for the storefront, client area, Super Admin portal, database design, and deployment process.

## Read in this order

1. [System flow and access model](SYSTEM_FLOW_AND_ACCESS.md) — how visitors, clients, administrators, catalog data, orders, documents, and payments move through the platform.
2. [Installation and production deployment](INSTALLATION_AND_DEPLOYMENT.md) — local setup, staging deployment, production architecture, MySQL setup, migrations, owner bootstrap, HTTPS, backups, and release verification.
3. [Namecheap/cPanel deployment](NAMECHEAP_CPANEL_DEPLOYMENT.md) — exact shared-hosting file, PHP, database, health-check and media-storage setup.
4. [Super Admin operations manual](SUPER_ADMIN_OPERATIONS.md) — user list, role changes, categories/submenus, products, stock, orders, invoices, settings, and routine operating tasks.
5. [API and backend contract](BACKEND_API_CONTRACT.md) — endpoints and security rules required to replace the current browser-only storage with a real backend.
6. [Testing and go-live checklist](TESTING_AND_GO_LIVE_CHECKLIST.md) — role, catalog, order, document, payment, security and recovery acceptance tests.
7. [Database README](../database/README.md) — how to apply the starter MySQL migration safely.
8. [Local run, database, and image guide](../LOCAL_RUN_DATABASE_IMAGES_GUIDE.md) — local commands and image-storage recommendations.

## Honest implementation status

The current repository is a React/Vite frontend. Its screens and workflows run locally, but application data is currently stored in browser `localStorage`. It does not yet contain a production authentication/API server.

| Capability | Current local demo | Required for production |
| --- | --- | --- |
| Storefront, catalog, cart and client UI | Implemented | Connect to authenticated API |
| Parent menus and submenus | Implemented | Persist categories/menu order in MySQL |
| User list and role-management UI | Implemented | Enforce permissions on server |
| Registration defaults to Client | Implemented in local data model | Enforce `role = client` in API and database |
| Protected bootstrap owner | Simulated locally | Create from server deployment secrets |
| Secondary Super Admin | Included as local sample | Register normally, then owner promotes account |
| Product and variant stock management | Implemented UI | Transactional inventory API required |
| Invoice, packing list and delivery-note PDF | Implemented in browser | Store immutable document records server-side |
| MySQL setup screen/schema download | Implemented as configuration/demo | Backend migration runner required |
| Image optimizer screen | Demonstration | Server upload, WebP/AVIF processing and object storage |
| Payments | Settings and checkout UI | Gateway SDK, webhook verification and reconciliation |

Do not accept real registrations, passwords, orders, payments, or private customer data until the backend requirements in these documents are implemented.
