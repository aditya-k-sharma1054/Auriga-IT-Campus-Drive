# ParkOps — Test & Verification Plan

## 1. Test philosophy

The test budget is limited. Prioritize correctness of business invariants and the end-to-end parking flow.

## 2. Unit tests — pricing

### FT-01 — 0 to <1 hour

Expected: first-hour rate.

### FT-02 — exactly 1 hour

Expected: first-hour rate.

### FT-03 — just over 1 hour

Expected: two billable hours.

### FT-04 — several hours

Expected: first-hour rate + additional-hour rate for remaining billable hours.

### FT-05 — daily cap

Expected: hourly charge never exceeds the configured daily cap for the billable period.

### FT-06 — exactly 24 hours

Expected: one daily cap.

### FT-07 — 24h + partial hours

Expected: daily cap + correctly billed remaining partial block.

### FT-08 — same timestamp

Expected: minimum one-hour charge.

## 3. Integration/API tests — parking

### CI-01

Standard vehicle with matching spot → succeeds.

### CI-02

EV vehicle with EV spot → succeeds.

### CI-03

EV vehicle with no EV spots → 409, no state mutation.

### CI-04

All compatible spots occupied → 409, no active session created.

### CI-05

Duplicate active plate → 409, no second session.

### CI-06

Concurrent competing check-ins for one spot → only valid allocations survive; no double occupancy.

### CO-01

Valid active checkout → fee calculated, session completed, spot released.

### CO-02

Checkout already completed session → 409, no duplicate release/billing.

### CO-03

Unknown session → 404.

## 4. Auth tests

- duplicate email registration fails;
- wrong password fails;
- protected endpoint without token fails;
- invalid/expired token fails;
- authenticated user cannot access another garage's records.

## 5. Search tests

- exact normalized plate finds active vehicle;
- spaces/hyphens normalize correctly;
- unknown plate returns empty result;
- history search filters expected records.

## 6. Pagination/sorting tests

- page 1 and page 2 return different records where enough data exists;
- total/totalPages are correct;
- allowed sort fields work;
- unsupported sort field is rejected or falls back safely;
- search + pagination work together.

## 7. UI smoke test

```text
Landing
  ↓
Register
  ↓
Login / authenticated dashboard
  ↓
Check in EV
  ↓
Confirm assigned EV spot
  ↓
Search plate
  ↓
Checkout
  ↓
Confirm fee
  ↓
Confirm spot available again
  ↓
History
  ↓
Search + sort + pagination
```

## 8. Fresh-clone verification

Before submission:

- clone/re-open repository in a clean environment;
- install dependencies;
- create/migrate DB;
- seed/setup;
- start frontend/backend;
- execute smoke test.

## 9. Final visual verification

Check:

- no broken routes;
- no console-breaking errors;
- no placeholder/mock data in core flows;
- no overflow on primary desktop view;
- clear primary action hierarchy;
- loading/error/empty states render correctly.
