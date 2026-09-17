# ParkOps Reasoning

## Product focus

The solution prioritizes the attendant's high-risk workflow: correct check-in, compatible bay assignment, accurate checkout billing, and persistent history. Secondary UI polish was deliberately kept behind those rules.

## Key decisions

- **SQLite with Prisma:** real relational persistence without an external service.
- **Backend authority:** the server controls timestamps, allocation, occupancy, and final billing; the browser is only a client.
- **Integer paise:** rates and fees are stored as integers to avoid floating-point currency errors.
- **Strict base compatibility:** Compact, Standard, and EV vehicles receive their matching spot type. This makes allocation deterministic and ensures EVs cannot receive non-EV spots.
- **Per-type rate records:** the updated rate-card twist required rates to be selected using the occupied spot type rather than one garage-wide price.
- **Transactional state changes:** check-in claims a spot and creates an ACTIVE session together; checkout completes the session and releases that exact spot together.

## Updated twists

- **Messy rate card:** `POST /rates/import` parses valid Compact, Standard, and EV rows, reports junk rows as rejected, and stores clean integer-paise rates.
- **Nightly close:** `POST /clock` finds active sessions older than 24 hours and completes them with normal server-side billing.
- **Valet hand-off:** `POST /parking/:sessionId/transfer-plate` changes only an ACTIVE session's normalized plate, retains original entry time and spot, and records a transfer audit row.

## Verification performed

1. TypeScript checks passed for API and web workspaces.
2. A real isolated garage lifecycle was executed through the API:
   - EV check-in received an EV spot;
   - normalized active plate lookup returned the session;
   - plate transfer updated the active plate;
   - checkout returned `COMPLETED`, recorded a fee, and created a history record.
3. Twist verification executed:
   - 3 valid rate-card rows imported;
   - 1 junk rate-card row was rejected;
   - `POST /clock` auto-closed a 25-hour session and persisted its fee.

## Environment note

The Prisma client was generated successfully. In this local environment, Prisma's `db push` wrapper returned an empty schema-engine error even though its installed engine ran normally. A small Node `node:sqlite` bootstrap script creates the schema used by the same Prisma models so the application has real SQLite persistence.
