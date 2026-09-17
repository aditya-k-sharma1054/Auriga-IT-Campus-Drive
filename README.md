# ParkOps

ParkOps is an attendant-first parking-operations system for multi-level garages. It supports vehicle check-in, compatible bay allocation, EV-only EV bays, backend fee calculation, checkout, live plate lookup, history, per-spot-type rates, a testable nightly auto-close routine, and valet plate transfers.

## Stack

- React, Vite, TypeScript
- Node.js, Express, TypeScript
- Prisma client with SQLite persistence
- JWT authentication, bcrypt password hashing, Zod validation

## Run locally

```powershell
npm.cmd install --include=optional
npm.cmd run db:generate
npm.cmd run db:init
npm.cmd run dev
```

Open `http://localhost:5173`. The API runs at `http://localhost:4000`.

`db:init` creates the SQLite schema at `apps/api/prisma/dev.db`. It is used because the local Prisma `db push` wrapper returned an empty schema-engine error in this environment, although the generated Prisma client and SQLite engine were available.

## Debugging

```powershell
npm.cmd run typecheck
npm.cmd run build
```

If the local database does not exist, rerun `npm.cmd run db:init`.

## API endpoints

All protected routes require `Authorization: Bearer <JWT>`.

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/v1/auth/register` | Register operator, garage, default rates, and default spots |
| POST | `/api/v1/auth/login` | Log in |
| GET | `/api/v1/auth/me` | Current user context |
| GET | `/api/v1/dashboard/summary` | Occupancy and EV metrics |
| GET | `/api/v1/garage` | Garage and cleaned rate records |
| GET | `/api/v1/spots/availability?type=EV` | Typed spot availability |
| POST | `/api/v1/rates/import` | Import and clean a per-spot-type rate card |
| POST | `/api/v1/parking/check-in` | Allocate a compatible spot and create a session |
| GET | `/api/v1/parking/active` | Paginated active sessions |
| GET | `/api/v1/parking/search?plate=...` | Active plate lookup |
| POST | `/api/v1/parking/:sessionId/check-out` | Bill and complete an active session |
| POST | `/api/v1/parking/:sessionId/transfer-plate` | Valet plate hand-off preserving spot and entry time |
| GET | `/api/v1/parking/history` | Searchable, sortable, paginated completed history |
| POST | `/api/v1/clock` | Assessment clock trigger; auto-closes stays over 24 hours |

## Core rules

- EV vehicles are assigned only EV spots.
- An active plate cannot be checked in twice in the same garage.
- The API, not the UI, selects the spot and calculates fees.
- Partial hours round up; rates use first-hour, additional-hour, and daily-cap amounts.
- Check-in and checkout update session/spot state together in a transaction.

