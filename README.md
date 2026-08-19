# ROLY Commerce Storefront and Administration UI

React/Vite storefront, client area, product/stock controls, order processing, document printing/PDF, configurable site content, hierarchical navigation, and Super Admin user/role-management interface.

## Important production status

This repository currently contains the frontend application. It stores demonstration data in browser `localStorage`; it does not yet contain a production authentication/API server. Deploy the static build only for UI review or staging until the backend contract is implemented.

## Documentation

Start with the [documentation index](docs/README.md).

- [Full system flow and roles](docs/SYSTEM_FLOW_AND_ACCESS.md)
- [Installation and production deployment](docs/INSTALLATION_AND_DEPLOYMENT.md)
- [Namecheap shared-hosting deployment](docs/NAMECHEAP_CPANEL_DEPLOYMENT.md)
- [Super Admin operations manual](docs/SUPER_ADMIN_OPERATIONS.md)
- [Backend API/security contract](docs/BACKEND_API_CONTRACT.md)
- [MySQL migration instructions](database/README.md)
- [Local run, database and image guide](LOCAL_RUN_DATABASE_IMAGES_GUIDE.md)

## Run locally

Requirements: Node.js 20 LTS or newer and npm.

```powershell
cd F:\Imran\roly\roly
npm install
npm run lint
npm run dev
```

Open `http://localhost:3000`.

## Build

```powershell
npm run lint
npm run build
npm run preview
```

The static output is created in `dist`.

## Demo access model

The local user list contains a protected owner, a secondary Super Admin, Client, Vendor and Logistics examples. These are interface records only—there are no shipped default passwords.

For production:

- every public registration must become a Client;
- the bootstrap owner must be created server-side from deployment secrets;
- the owner promotes a verified registered user to secondary Super Admin;
- authorization must be enforced by the backend on every protected request;
- database and payment secrets must never be placed in Vite/browser variables.
