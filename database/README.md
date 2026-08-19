# Database Setup

`001_initial_schema.sql` is a MySQL 8.0 starter migration for the intended production backend. It includes users/roles, sessions, hierarchical categories, menus, vendors, products/media/variants, inventory movements, addresses, orders, payments, shipments, documents, settings and audit events.

## Apply

Create a database and restricted application user first, then run:

```powershell
mysql --host=127.0.0.1 --port=3306 --user=roly_api --password roly_commerce < database\001_initial_schema.sql
```

The migration does not create a default password or insert a hardcoded administrator. After the backend is implemented, run its server-only bootstrap command using deployment secrets. See [Installation and deployment](../docs/INSTALLATION_AND_DEPLOYMENT.md#8-create-the-default-protected-super-admin).

Do not run production database credentials in the browser's MySQL screen. That screen is currently a UI demonstration.

## Future migrations

- Add a new numbered file for every schema change: `002_description.sql`, `003_description.sql`, and so on.
- Run each migration once from the backend/deployment job.
- Record successful versions in `schema_migrations`.
- Never edit or reorder a migration already applied in production.
- Back up and test restoration before applying migrations.

