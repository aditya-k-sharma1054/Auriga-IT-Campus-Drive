# ParkOps — Domain Model, Invariants & State Machines

## 1. Domain entities

### User

Represents an authenticated garage operator/attendant.

Key fields:

- id
- name
- email
- passwordHash
- garageId
- createdAt
- updatedAt

### Garage

Represents one managed garage.

Key fields:

- id
- name
- address
- firstHourRatePaisa
- additionalHourRatePaisa
- dailyCapPaisa
- createdAt
- updatedAt

### ParkingSpot

Represents one physical parking location.

Key fields:

- id
- garageId
- floor
- number
- type
- status
- createdAt
- updatedAt

### ParkingSession

Represents one vehicle stay.

Key fields:

- id
- garageId
- spotId
- plateNumber
- vehicleType
- checkedInAt
- checkedOutAt
- feePaisa
- status
- createdAt
- updatedAt

## 2. Spot state machine

```text
AVAILABLE
   |
   | successful check-in transaction
   v
OCCUPIED
   |
   | successful checkout transaction
   v
AVAILABLE
```

There is no frontend-only spot state.

## 3. Parking session state machine

```text
(no session)
     |
     | successful check-in
     v
  ACTIVE
     |
     | successful checkout
     v
 COMPLETED
```

No transition back to ACTIVE.

## 4. Core invariants

### Invariant I-01 — EV compatibility

`vehicleType = EV` requires `spot.type = EV`.

### Invariant I-02 — No double occupancy

One physical spot cannot simultaneously belong to two ACTIVE sessions.

### Invariant I-03 — One active plate

A normalized plate cannot have multiple ACTIVE sessions in the same garage.

### Invariant I-04 — Active session has one occupied spot

An ACTIVE session must reference exactly one spot whose status is OCCUPIED.

### Invariant I-05 — Completed session is historical

A COMPLETED session retains its final fee, check-in time and checkout time.

### Invariant I-06 — Checkout is one-way

A completed session cannot be checked out again.

### Invariant I-07 — Server-owned timestamps

Check-in and check-out timestamps come from the server. Clients do not provide authoritative times.

### Invariant I-08 — Garage isolation

Every authenticated query and mutation is constrained by the authenticated user's garageId. A client cannot choose another garageId to access.

## 5. Plate normalization

Before persistence/search:

1. trim whitespace;
2. uppercase;
3. remove spaces and hyphens.

Example:

`RJ14 AB-1234` → `RJ14AB1234`.

Store the normalized value. Display it in a clean uppercase form.

## 6. Spot compatibility policy

Base version:

- COMPACT vehicle → COMPACT spot.
- STANDARD vehicle → STANDARD spot.
- EV vehicle → EV spot.

This is a deliberate base-release simplification. The brief explicitly requires EV → EV; it does not define cross-compatibility for compact/standard. Keeping the mapping strict makes assignment deterministic and easy to explain.

## 7. Spot assignment policy

The backend automatically chooses a compatible spot.

Base ordering:

1. lowest floor;
2. lowest/lexicographically first spot number within that floor.

This is deterministic, easy to test and does not require an optimization engine.

## 8. Fee model

Inputs:

- checkedInAt
- checkedOutAt
- firstHourRatePaisa
- additionalHourRatePaisa
- dailyCapPaisa

### Base rules

- minimum billable duration is 1 hour;
- any partial hour rounds up;
- first billable hour uses firstHourRate;
- remaining billable hours use additionalHourRate;
- each complete 24-hour block costs the daily cap;
- remaining partial 24-hour block is calculated hourly and capped by the daily cap.

Example with 50/30/250:

- 45 minutes → ₹50
- 1h exactly → ₹50
- 1h 1m → ₹80
- 3h → ₹110
- 24h → ₹250
- 27h → ₹250 + ₹110 = ₹360

All amounts are stored as integer paise in the database.

## 9. Transaction boundaries

### Check-in transaction

```text
BEGIN
  verify no active plate
  find compatible available spot
  conditionally mark spot OCCUPIED
  create ACTIVE session
COMMIT
```

If the chosen spot is no longer available at the conditional update, retry assignment rather than creating an inconsistent session.

### Checkout transaction

```text
BEGIN
  load ACTIVE session
  calculate fee from server time
  mark session COMPLETED + save fee/timestamp
  conditionally release the exact spot
COMMIT
```

If any required state update fails, the transaction must not leave a half-completed checkout.
