# NEXUS Network

NEXUS Network is a React + TypeScript + Vite frontend with a separately managed NestJS API in `backend/`. The backend addition does not change the frontend routes, pages, or data services.

## Frontend

From the project root:

```bash
npm install
npm run dev
```

The Vite development server uses `http://localhost:5173` by default. To create a frontend production build, run `npm run build`.

## Backend API

Use Node.js 20.11 or later. In a second terminal:

```bash
cd backend
npm install
```

Copy `backend/.env.example` to `backend/.env` and set `DATABASE_URL` to your PostgreSQL connection string for device registry use. The health endpoint itself does not access PostgreSQL or attempt router connectivity.

Phase 1/2 uses the active Windows IPv4 default-route interface and is deliberately limited to RFC1918 private subnets with at most 254 hosts. It probes hosts with ICMP, resolves available reverse DNS hostnames and reads the interface/neighbor MAC cache. A device that blocks ICMP may not be detected; a hostname or MAC is reported as unknown when the operating system cannot provide it. Online status means currently reachable by the scan (or this machine's own interface), and a registry entry is marked offline after two successful scans miss it. This is LAN discovery, not a router DHCP lease query, and it does not attempt router authentication.

The registry requires a PostgreSQL database. Set `DATABASE_URL` in the local `backend/.env`, then apply the included migration before using the device API. No real credentials are checked in.

Start the API in development mode:

```bash
npm run start:dev
```

The API listens on port 3000 by default. Verify it with:

```bash
curl http://localhost:3000/api/health
```

Expected response fields are `status: "ok"`, `service: "nexus-network-api"`, and an ISO-8601 `timestamp`. `FRONTEND_ORIGIN` controls CORS and accepts a comma-separated list of HTTP(S) origins.

Build the backend with `npm run build` from `backend/`. The device registry includes a PostgreSQL migration; router integration remains intentionally out of scope.

### Windows PowerShell: configure and verify

From the project root, copy the example configuration, then set the local PostgreSQL connection string in the ignored `backend/.env` file. Keep credentials local; do not commit that file.

```powershell
Copy-Item backend/.env.example backend/.env
notepad backend/.env
Set-Location backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm test
npm run build
```

For a real scan without touching the registry database, use `npm run discovery:local`. To exercise the API, start `npm run start:dev` in one terminal and open another PowerShell terminal:

```powershell
Invoke-RestMethod http://localhost:3000/api/health
Invoke-RestMethod http://localhost:3000/api/devices
Invoke-RestMethod -Method Post http://localhost:3000/api/devices/discover
```

Start the frontend from the project root in a separate terminal with `npm run dev`. The Connected Devices page now triggers live discovery and the dashboard device preview uses live registry observations; unrelated traffic, router, access-control and activity features remain on their existing frontend data until their own phases.
