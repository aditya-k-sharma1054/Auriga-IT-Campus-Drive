# ParkOps — System Architecture

## 1. Architecture pattern

**Modular monolith**.

One deployable backend with internal domain boundaries.

## 2. High-level flow

```text
Google Stitch / Design
        ↓
React + Vite + TypeScript
        ↓
Axios
        ↓
REST / JSON
        ↓
Express + TypeScript
        ↓
Controllers
        ↓
Domain Services
        ↓
Prisma
        ↓
SQLite
```

## 3. Frontend structure

```text
client/src/
  components/
  pages/
  layouts/
  api/
  hooks/
  types/
  utils/
  App.tsx
  main.tsx
```

### Frontend responsibilities

- render UI;
- collect input;
- call APIs;
- display server state;
- handle loading/error/empty states;
- perform non-authoritative formatting.

### Frontend must not own

- final fee calculation;
- authoritative spot availability;
- authoritative session status;
- garage security scope.

## 4. Backend structure

```text
server/src/
  modules/
    auth/
    garage/
    spots/
    parking/
    pricing/
  middleware/
  lib/
  utils/
  app.ts
  server.ts
```

Each module may contain:

```text
routes.ts
controller.ts
service.ts
schema.ts
```

Do not create a file merely for the sake of a layer if it adds no value; preserve responsibility boundaries.

## 5. Layer responsibilities

### Routes

Map HTTP methods/paths to controllers and middleware.

### Controllers

Translate HTTP input to service calls and service output to HTTP responses.

### Services

Contain business rules and orchestration.

### Pricing service

Pure/deterministic fee calculation where possible.

### Prisma

Persistence, queries, transactions and relations.

### Middleware

Authentication, error handling and request validation.

## 6. Critical sequence: check-in

```text
UI
 ↓
POST /parking/check-in
 ↓
auth middleware
 ↓
Zod validation
 ↓
ParkingService.checkIn()
 ↓
normalize plate
 ↓
check active plate
 ↓
find compatible AVAILABLE spot
 ↓
transaction:
  conditional occupy
  create ACTIVE session
 ↓
return assignment
 ↓
UI refreshes dashboard/search state
```

## 7. Critical sequence: checkout

```text
UI
 ↓
POST /parking/:id/check-out
 ↓
auth middleware
 ↓
ParkingService.checkOut()
 ↓
load ACTIVE session
 ↓
PricingService.calculateFee()
 ↓
transaction:
  complete session
  release exact spot
 ↓
return receipt
 ↓
UI shows checkout result
```

## 8. State refresh strategy

For the base build, use simple request-driven refreshes rather than WebSockets.

After check-in/check-out:

- update the local success state;
- refetch dashboard summary;
- refetch relevant active/search data.

WebSockets are deliberately excluded because the brief does not require real-time multi-user synchronization.

## 9. Extensibility

New features should attach to domain seams:

```text
Reservation → Reservation module + Parking integration
Weekend pricing → Pricing service
Revenue reporting → reporting/read-model layer
Multiple garages → expanded membership/garage context
```

Do not split into microservices unless a future twist explicitly makes it necessary.
