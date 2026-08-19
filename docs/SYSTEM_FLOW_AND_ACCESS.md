# System Flow and Access Model

## 1. Platform overview

The production system has three separate security boundaries:

```text
Visitor browser / React storefront
              |
              | HTTPS requests and secure session cookie
              v
Authenticated backend API
        |                 |
        | private SQL     | signed upload/download requests
        v                 v
      MySQL          Object storage / CDN
```

React renders the interface. The backend owns authentication, authorization, validation, prices, stock, orders, payments, document records, and audit logs. MySQL must never be exposed directly to a browser.

## 2. User roles

| Role | Intended access |
| --- | --- |
| Client | Browse prices, manage company profile/addresses, order, view own invoices, packing lists, delivery notes and tracking |
| Vendor | Maintain permitted vendor products/media and view vendor-scoped orders or stock only |
| Logistics Admin | Manage stock, reservations, picking, packing, shipments, carrier and tracking data |
| Super Admin | Full normal platform administration: users, catalog, products, stock, orders, content, vendors, payments and reports |
| Bootstrap owner | A protected Super Admin with the additional ability to grant/revoke Super Admin; cannot be deleted, suspended or demoted |

The bootstrap owner is a protection flag on one account, not a separate public registration role.

## 3. Demonstration user list

The local UI contains these non-production examples:

| User | Role | Purpose |
| --- | --- | --- |
| `owner@local.invalid` | Super Admin + bootstrap owner | Demonstrates the protected deployment owner |
| `admin@local.invalid` | Super Admin | Demonstrates a promoted operational administrator |
| `maria@example.com` | Client | Demonstrates a registered customer |
| `factory@example.com` | Vendor | Demonstrates a vendor/factory account |
| `warehouse@example.com` | Logistics Admin | Demonstrates warehouse access |

These are records for interface testing, not login credentials. No default passwords are shipped.

## 4. First deployment and bootstrap-owner flow

1. The database migration creates the user tables and guarantees that at most one account is marked `is_bootstrap_owner`.
2. A server-only bootstrap command reads `BOOTSTRAP_OWNER_EMAIL` and `BOOTSTRAP_OWNER_PASSWORD` from deployment secrets.
3. The backend hashes the password with Argon2id or bcrypt and inserts the owner in a transaction.
4. The plaintext secret is removed or rotated after the first successful login.
5. The owner enables MFA and stores recovery codes offline.
6. The owner signs in and verifies the audit log.

Never place the bootstrap password in React, a `VITE_` variable, Git, SQL, browser storage, or documentation.

## 5. Registration and promotion flow

```text
Registration submitted
        |
        v
API validates email, password and company
        |
        v
Database inserts role = client (server controlled)
        |
        v
Email verification -> active Client account
        |
        v
Owner opens Users & Roles
        |
        +--> keep Client
        +--> promote to Vendor
        +--> promote to Logistics Admin
        +--> promote to Super Admin (owner only)
```

The API must ignore or reject a `role`, `isAdmin`, or `isBootstrapOwner` value sent by a registration browser. A visitor cannot choose a privileged role.

### Creating the second administrator

1. The future administrator registers through the normal public registration form and becomes a Client.
2. The bootstrap owner signs in.
3. Open **Super Admin → Users & Roles**.
4. Find the verified user by email.
5. Change the role to **Super Admin**.
6. Confirm the change with MFA or password re-authentication.
7. The server writes the old role, new role, actor, target, timestamp and request IP to the audit log.
8. The new administrator signs out and in again so the server issues a session with current permissions.

The second administrator can perform normal administration tasks but cannot delete, suspend or demote the bootstrap owner. Only the owner should grant another Super Admin.

## 6. Login/session flow

1. User submits email and password over HTTPS.
2. Backend applies rate limiting and checks the password hash.
3. Suspended or unverified accounts are rejected.
4. Privileged accounts complete MFA.
5. Backend creates a database-backed or signed session.
6. Browser receives an `HttpOnly`, `Secure`, `SameSite=Lax` session cookie.
7. Every protected API request loads the current user and checks its role on the server.
8. Password/role/status changes revoke existing sessions.

Do not store long-lived authentication tokens in `localStorage`.

## 7. Category and submenu flow

1. Super Admin opens **Pages, Menus & Media**.
2. Create/edit a parent category and its subcategories.
3. Set visibility and ordering.
4. Save; the category tree becomes the source for the header menu.
5. Desktop displays dropdowns; mobile displays nested menu items.
6. Clicking a submenu sends both category and subcategory slugs to the catalog filter.

Production saves the hierarchy in `categories.parent_id`. If custom menu links are required, store them in `menu_items`; category-linked menu items reference a category rather than duplicating its label and URL.

## 8. Product, variants and stock flow

1. Admin selects vendor, category and subcategory.
2. Admin enters model code, description, composition, GSM, prices and pack/box quantities.
3. Admin adds colors, sizes and optimized media.
4. Backend creates one variant for every valid color/size combination.
5. XL, XXL/2XL, XXXL/3XL and larger variants receive the `-BIG` SKU suffix according to the configured rule.
6. Logistics staff add stock through stock movements, not by silently replacing totals.
7. Available stock is calculated as `on_hand - reserved`.
8. Checkout reserves stock in a database transaction; payment failure/timeout releases it.

## 9. Client purchase flow

1. Client browses category/subcategory or searches by model code.
2. Client selects color and quantities per size.
3. Cart shows unit/pack/box pricing and totals.
4. Checkout validates company, VAT, billing/delivery address, payment and shipping method.
5. Server recalculates every price, tax, fee and stock value; browser totals are never trusted.
6. Server creates order and order items in a transaction and reserves inventory.
7. Payment is authorized or the order is placed on approved account terms.
8. Client receives an order number and can track status in Client Area.

## 10. Order-processing and document flow

```text
Pending -> Processing -> Dispatched -> Delivered -> Invoiced
   |            |
   |            +--> packing list / delivery note
   +--> payment or credit approval

Any permitted stage -> Cancelled (with stock release/refund rules)
```

Packing lists, delivery notes and invoices can be previewed, printed and downloaded. In production, finalized invoices must use immutable server-side numbering and stored snapshots so later product/address edits do not change historical documents.

## 11. Payment flow

1. Admin configures public method settings; secret gateway credentials remain on the server.
2. Backend creates a payment intent/session.
3. Client completes gateway authentication.
4. Gateway calls the backend webhook.
5. Backend verifies webhook signature and handles the event idempotently.
6. Backend changes payment/order state and records reconciliation data.
7. Browser success pages display server-confirmed state, not query-string claims.

## 12. Permission summary

| Task | Client | Vendor | Logistics | Super Admin | Owner |
| --- | :---: | :---: | :---: | :---: | :---: |
| View own orders/documents | Yes | Scoped | Scoped | Yes | Yes |
| Edit assigned vendor products | No | Yes | No | Yes | Yes |
| Edit stock/shipments | No | Scoped | Yes | Yes | Yes |
| Edit menus/site content | No | No | No | Yes | Yes |
| Change Client/Vendor/Logistics roles | No | No | No | Yes | Yes |
| Grant Super Admin | No | No | No | No | Yes |
| Demote/suspend bootstrap owner | No | No | No | No | No |

