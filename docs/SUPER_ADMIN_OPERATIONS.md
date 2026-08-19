# Super Admin Operations Manual

## 1. Opening the administration area

In the local demo, select the account icon and choose **Super Admin**. Production must show this option only after the backend confirms an active Super Admin session. Direct URL/API access must also enforce authorization.

## 2. Dashboard and daily checks

At the start of each working day:

1. Review new orders, pending payments and low-stock warnings.
2. Check failed payment webhooks and delayed shipments.
3. Review recent privileged-role changes and suspicious login events.
4. Confirm backup and background-job health.
5. Resolve products with missing media, prices or stock matrices.

## 3. Users and roles

Open **Users & Roles** to view name, email, company, role, status and owner protection.

### Register a user from Admin

The form creates the account as **Client**. Name, valid email and company are required. In production, prefer an invitation flow so the user sets their own password.

### Change a normal role

1. Find the user by verified email.
2. Select Client, Vendor or Logistics Admin.
3. Confirm the action.
4. Verify the audit record.
5. Ask the user to sign in again if sessions were revoked.

### Promote a second Super Admin

Only the bootstrap owner performs this action. Promote the already registered/verified account, require MFA re-authentication and verify the audit record.

### Suspend an account

Suspension must revoke active sessions and block new login. Preserve orders and audit history. Never reuse another user's account.

### Protected owner rules

The owner cannot be deleted, suspended or demoted. There must be no UI, API or database maintenance shortcut that bypasses this accidentally. Emergency owner recovery should be a documented server-side procedure with identity verification and audit logging.

## 4. Categories, submenus and navigation

Open **Pages, Menus & Media → Categories and synchronized submenus**.

1. Add/edit the parent category name and stable slug.
2. Add/edit child submenu labels and slugs.
3. Toggle visibility instead of deleting a category that has historical products.
4. Save the page; the public navigation is rebuilt from visible categories.
5. Test desktop hover/focus, keyboard navigation and mobile nested links.

Avoid changing a live slug without a redirect plan because bookmarks/search links may break.

Custom links such as Catalogue, Customizer or Outlet remain top-level items and are not overwritten by category synchronization.

## 5. Homepage, branding and footer

- **Branding & Site Texts:** logo URL, favicon, brand/company name, tax/contact details, primary color and global descriptions.
- **Pages, Menus & Media:** hero slides, overlay visibility, audience cards, banners, story cards, certification logos and footer columns.
- Use optimized first-party image URLs rather than permanent hotlinks to another site.
- Check mobile cropping and text contrast after every hero/banner change.

## 6. Products and variations

For each product:

1. Choose category, vendor and gender/target.
2. Enter unique model code, name, description, composition and GSM.
3. Configure unit, pack and box prices/quantities.
4. Add available sizes.
5. Add colors with code, name, hex swatch and media.
6. Verify each color/size SKU.
7. Confirm XL and larger configured sizes receive `-BIG`.
8. Add stock only after variant data is correct.

In production, model codes and variant SKUs require database unique constraints.

## 7. Stock management

Stock changes should be movements with reason, actor and timestamp:

- receipt from supplier;
- manual correction;
- order reservation;
- reservation release;
- dispatch;
- return;
- damaged/lost stock.

Never allow negative available stock unless backorders are explicitly enabled. Large imports should support dry-run validation and an error report.

## 8. Vendor management

Create vendor/factory records, set commission, contact details and status. Suspending a vendor should prevent new product/order activity while retaining historical records. Vendor users must only access their vendor's records.

## 9. Payments and delivery

Configure enabled methods, display instructions, fees, free-shipping thresholds, carriers and delivery estimates. Gateway secret keys and webhook secrets must be managed on the backend/secret manager, never this admin browser.

After any payment configuration change, test authorization, rejection, duplicate webhook delivery, refund and reconciliation in the gateway sandbox.

## 10. Order processing

1. Confirm payment or approved credit terms.
2. Move Pending to Processing.
3. Review stock reservation and picking quantities.
4. Open/print the Packing List.
5. Pack items and record boxes/weight.
6. Create/open the Delivery Note.
7. Select carrier and enter tracking number.
8. Mark Dispatched and notify the client.
9. Mark Delivered after confirmation.
10. Finalize and download/print the Invoice according to accounting rules.

Use **Cancel**, the modal X, backdrop click or Escape to close document dialogs. Print and PDF Download are separate actions.

## 11. Database setup page

The current page stores demonstration configuration and downloads starter SQL; it does not connect to MySQL. In production, migrations should be executed by a deployment job/API server, not an administrator's browser.

## 12. Image optimizer page

The current counters are a workflow demonstration. Production processing must run on the backend or an image service. See [the installation guide](INSTALLATION_AND_DEPLOYMENT.md#11-image-deployment).

## 13. Monthly maintenance

- Review all Super Admin and Logistics accounts.
- Remove unused privileges and revoke dormant sessions.
- Verify payment reconciliation and invoice sequence.
- Review stock adjustments and negative/low stock.
- Check broken image links and storage growth.
- Install tested security/dependency updates.
- Restore a recent backup in an isolated environment.
- Export and review audit events.

## 14. Incident checklist

If an administrator account is suspected compromised:

1. Suspend it using the owner account.
2. Revoke all sessions/API tokens.
3. Rotate affected passwords/secrets.
4. Review role, user, order, payment, stock and content audit events.
5. Contact payment/hosting providers if needed.
6. Preserve logs before cleanup.
7. Restore changed data carefully; do not erase audit evidence.
8. Record cause, impact and preventive actions.

