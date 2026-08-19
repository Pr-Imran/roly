# Testing and Go-Live Checklist

Record tester, date, environment, build commit and evidence for every production acceptance test.

## 1. Build and basic UI

- [ ] `npm ci` succeeds from a clean checkout.
- [ ] `npm run lint` passes.
- [ ] `npm run build` passes.
- [ ] Homepage works at desktop, tablet and mobile widths.
- [ ] Hero arrows/dots and campaign targets work.
- [ ] Header dropdowns work with mouse, keyboard focus and touch/mobile menu.
- [ ] Search, favorites, cart and account menus work.
- [ ] Every modal has an X and Cancel/Close behavior; Escape/backdrop behavior matches policy.

## 2. Registration, login and users

- [ ] Normal registration creates `client` regardless of forged role fields.
- [ ] Duplicate emails are rejected case-insensitively.
- [ ] Email verification tokens expire and are single use.
- [ ] Login is rate-limited and does not reveal whether an email exists.
- [ ] Secure session cookie has `HttpOnly`, `Secure` and suitable `SameSite`.
- [ ] Suspended users cannot log in and active sessions are revoked.
- [ ] Password reset revokes previous sessions.
- [ ] MFA is required for owner and Super Admin.
- [ ] User list is available only to Super Admin.

## 3. Bootstrap owner and secondary administrator

- [ ] Bootstrap command creates exactly one owner from server secrets.
- [ ] Running bootstrap again is safe/idempotent.
- [ ] Owner cannot be demoted, suspended or deleted through UI or direct API.
- [ ] A normal registered Client can be promoted by owner to Super Admin.
- [ ] Promotion writes actor, target, old/new role and timestamp to audit.
- [ ] Secondary Super Admin can manage normal administration tasks.
- [ ] Secondary Super Admin cannot alter bootstrap-owner protection or grant another Super Admin.
- [ ] Role changes revoke stale sessions/permissions.

## 4. Categories, menus and content

- [ ] Parent category create/edit/hide works.
- [ ] Subcategory create/edit/hide works.
- [ ] Save synchronizes visible parent/submenu navigation.
- [ ] Custom top-level menu links remain after synchronization.
- [ ] Category/subcategory product filtering is correct.
- [ ] Duplicate or invalid slugs are rejected.
- [ ] Branding, hero, cards, banners, logos and footer updates persist.
- [ ] Slug changes have redirects or an approved link-impact plan.

## 5. Products, variants, media and stock

- [ ] Model codes and SKUs are unique.
- [ ] Every color/size combination creates the correct variant.
- [ ] XL/XXL/XXXL and configured larger sizes use `-BIG` correctly.
- [ ] Unit/pack/box prices and quantities validate correctly.
- [ ] Images reject invalid/oversized files and remove EXIF metadata.
- [ ] WebP/AVIF sizes are generated and CDN URLs work.
- [ ] Stock receipts/corrections create movement records.
- [ ] Available stock equals on-hand minus reserved.
- [ ] Concurrent checkout cannot oversell the same variant.
- [ ] Cancelled/expired orders release reservations exactly once.

## 6. Checkout and orders

- [ ] Server recalculates prices, VAT, fees, shipping and totals.
- [ ] Forged browser prices are ignored.
- [ ] Billing and shipping addresses are snapshotted on the order.
- [ ] Duplicate submit with the same idempotency key creates one order.
- [ ] Client sees only their/company-permitted orders.
- [ ] Vendor sees only assigned vendor data.
- [ ] Logistics role can perform only allowed fulfillment operations.
- [ ] Invalid order status transitions are rejected.

## 7. Documents

- [ ] Packing List opens, closes, prints and downloads.
- [ ] Delivery Note opens, closes, prints and downloads.
- [ ] Invoice opens, closes, prints and downloads.
- [ ] Client cannot request another client's document by changing an ID.
- [ ] Final invoice number is unique and immutable.
- [ ] PDF totals, addresses, items and tax equal database snapshots.
- [ ] Corrections follow credit-note/accounting policy.

## 8. Payments and shipping

- [ ] Gateway sandbox success, rejection, cancellation and timeout paths work.
- [ ] Webhook signature is verified.
- [ ] Duplicate webhook event is idempotent.
- [ ] Browser redirect alone cannot mark an order paid.
- [ ] Refund requires authorized role and is audited.
- [ ] Payment reconciliation report matches provider settlement.
- [ ] Carrier/tracking changes notify the correct client.

## 9. Database, security and privacy

- [ ] MySQL is private and the API uses a non-root restricted user.
- [ ] All migrations apply on an empty database and an upgraded staging copy.
- [ ] Secrets are in a secret manager/server environment, not Git or frontend bundle.
- [ ] CSRF, XSS, injection, broken-access-control and upload tests pass.
- [ ] Security headers and HTTPS redirect are enabled.
- [ ] Logs exclude passwords, hashes, session tokens and card data.
- [ ] Audit events are append-only for application users.
- [ ] Data retention/deletion/export meets applicable privacy policy.

## 10. Backup, recovery and operations

- [ ] Automated database backup succeeds.
- [ ] Object storage versioning/backup is enabled.
- [ ] A full restore has been tested in an isolated environment.
- [ ] Monitoring alerts for API errors, database capacity, failed jobs and webhooks.
- [ ] Rollback process is documented and tested.
- [ ] Owner recovery and administrator compromise procedures are documented.
- [ ] Support contacts and incident responsibilities are assigned.

## 11. Go-live decision

Do not accept real customers until every critical security, access-control, payment, inventory, document and backup item passes against the production backend—not only against the local frontend demo.

