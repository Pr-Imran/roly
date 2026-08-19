# Backend API and Security Contract

This is the minimum contract a production backend must implement before the frontend can use real MySQL data. Endpoint names may change, but the behaviors and permission checks are required.

## 1. General rules

- Base path: `/api/v1`.
- HTTPS only in production.
- JSON requests/responses except file downloads/uploads.
- Secure `HttpOnly` session cookie; CSRF protection on state-changing cookie-authenticated requests.
- Validate all inputs on the server.
- Return `401` for no valid session and `403` for insufficient permission.
- Use idempotency keys for checkout, payment and document-finalization requests.
- Add request IDs and structured logs without passwords, tokens or payment-card data.

## 2. Authentication

| Method | Endpoint | Access | Behavior |
| --- | --- | --- | --- |
| POST | `/auth/register` | Public | Creates `client` only; ignores/rejects submitted role flags |
| POST | `/auth/verify-email` | Public token | Verifies email and activates account |
| POST | `/auth/login` | Public | Rate-limited password check; MFA challenge for privileged roles |
| POST | `/auth/mfa/verify` | Challenge | Completes privileged login |
| POST | `/auth/logout` | Authenticated | Revokes current session |
| POST | `/auth/logout-all` | Authenticated | Revokes all sessions for user |
| POST | `/auth/password/forgot` | Public | Sends single-use reset token without revealing account existence |
| POST | `/auth/password/reset` | Public token | Changes hash and revokes sessions |
| GET | `/auth/me` | Authenticated | Returns current server-authorized user/profile |

Example registration request:

```json
{
  "name": "A Client User",
  "email": "client@example.com",
  "password": "user-selected-password",
  "company": "Example Textiles Ltd"
}
```

Even if the request includes `"role":"super_admin"`, the inserted role must remain `client`.

## 3. User administration

| Method | Endpoint | Access |
| --- | --- | --- |
| GET | `/admin/users` | Super Admin |
| POST | `/admin/users/invite` | Super Admin; invite starts as Client |
| PATCH | `/admin/users/:id/role` | Super Admin for normal roles; owner required to grant/revoke Super Admin |
| PATCH | `/admin/users/:id/status` | Super Admin; protected owner forbidden |
| GET | `/admin/role-audit` | Owner or authorized auditor |

Role changes must lock the target row, check actor/target rules, update the role, write audit data and revoke target sessions in one transaction.

## 4. Catalog and content

| Method | Endpoint | Access |
| --- | --- | --- |
| GET | `/catalog/navigation` | Public |
| GET | `/catalog/categories` | Public |
| POST/PATCH | `/admin/categories` | Super Admin |
| DELETE | `/admin/categories/:id` | Super Admin; reject if unsafe, prefer hide/archive |
| GET | `/products` and `/products/:code` | Public/price policy |
| POST/PATCH | `/admin/products` | Super Admin or scoped Vendor |
| POST | `/admin/products/:id/media` | Authorized product manager |
| GET/PATCH | `/admin/site-settings` | Super Admin |

Category writes and public navigation generation should commit atomically or use category records as the direct navigation source.

## 5. Inventory

| Method | Endpoint | Access |
| --- | --- | --- |
| GET | `/inventory/products/:id` | Logistics/Super Admin/scoped Vendor |
| POST | `/inventory/movements` | Logistics or Super Admin |
| GET | `/inventory/movements` | Logistics or Super Admin |
| POST | `/inventory/import/validate` | Logistics or Super Admin |
| POST | `/inventory/import/commit` | Logistics or Super Admin |

Inventory writes must be transactional and append stock movements. Checkout must lock/reserve relevant variants so concurrent requests cannot oversell.

## 6. Client account and orders

| Method | Endpoint | Access |
| --- | --- | --- |
| GET/PATCH | `/me/profile` | Current user |
| GET/POST/PATCH/DELETE | `/me/addresses` | Current user |
| GET | `/me/orders` | Current user's company scope |
| POST | `/checkout/quote` | Client |
| POST | `/orders` | Client with idempotency key |
| GET | `/orders/:id` | Owner of order or authorized staff |
| PATCH | `/admin/orders/:id/status` | Logistics/Super Admin according to transition |
| PATCH | `/admin/orders/:id/shipment` | Logistics/Super Admin |

The backend recalculates price, discounts, VAT, shipping, fees and total from database configuration.

## 7. Documents

| Method | Endpoint | Access |
| --- | --- | --- |
| GET | `/orders/:id/packing-list.pdf` | Order owner or authorized staff |
| GET | `/orders/:id/delivery-note.pdf` | Order owner or authorized staff |
| POST | `/admin/orders/:id/invoice/finalize` | Authorized finance/Super Admin |
| GET | `/orders/:id/invoice.pdf` | Order owner or authorized staff |

Document access checks order ownership on every request. Finalized invoice number/content is immutable; corrections use credit notes or the jurisdiction's required method.

## 8. Payments

| Method | Endpoint | Access |
| --- | --- | --- |
| POST | `/payments/session` | Client for owned pending order |
| POST | `/webhooks/payments/:provider` | Gateway signature required |
| POST | `/admin/payments/:id/refund` | Authorized finance/Super Admin |
| GET | `/admin/payments/reconciliation` | Authorized finance/Super Admin |

Never trust a browser redirect as payment confirmation. Webhook event IDs require unique constraints/idempotent handling.

## 9. Upload/media rules

- Accept known image formats after signature inspection.
- Reject SVG unless sanitized by a dedicated process.
- Strip metadata and generate optimized variants asynchronously.
- Store object keys/metadata in MySQL, files in object storage.
- Use signed upload/download URLs where appropriate.
- Scan untrusted files and enforce per-user/product limits.

## 10. Audit requirements

Audit at minimum:

- login success/failure and MFA changes;
- role/status changes;
- category/menu/site-setting changes;
- product price and stock changes;
- order status/shipment changes;
- invoice finalization;
- payment/refund actions;
- secret/configuration changes without recording secret values.

Each event needs actor, target, action, before/after summary, timestamp, request ID and source IP/user agent where policy permits.

