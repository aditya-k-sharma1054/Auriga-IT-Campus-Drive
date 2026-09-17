# ParkOps — Twist Readiness Protocol

## Goal

The surprise twist should become a controlled extension, not a rewrite.

## First response when twist arrives

Do not code immediately.

In 2–5 minutes, classify the twist as one or more of:

1. new entity;
2. new state;
3. new business rule;
4. new query/report;
5. new user capability;
6. external integration;
7. change to an existing workflow.

## Impact analysis

Answer:

- Which existing invariant changes?
- Which DB table/model changes?
- Which service owns the new rule?
- Which API changes/additions are needed?
- Which UI page changes?
- Which existing tests become invalid?
- What can remain untouched?

## Extension principle

Prefer:

```text
new requirement
    ↓
extend existing domain boundary
    ↓
add schema only if required
    ↓
add service rule
    ↓
add API
    ↓
add UI
    ↓
add focused tests
```

Avoid:

```text
new requirement
    ↓
rewrite existing architecture
```

## Stable core

Protect these from accidental regression:

- authentication;
- garage context;
- spot occupancy;
- active parking sessions;
- check-in transaction;
- checkout transaction;
- pricing service;
- history.

## Examples

### Reservation twist

Add a Reservation domain entity/service. Make spot assignment reservation-aware. Do not rewrite existing session history.

### Weekend pricing twist

Extend PricingService with an explicit rate-selection policy. Keep money calculations centralized.

### Multi-garage twist

Expand identity/membership modeling rather than adding hard-coded garage switches.

### Revenue dashboard twist

Build read queries over completed sessions. Do not duplicate fee logic in a reporting module.

### New vehicle type twist

Add the type to the domain enum/compatibility policy and update validation/UI. Preserve the same assignment transaction.

## Twist checkpoint

After implementation of the twist:

- run the original P0 tests again;
- run new twist-specific tests;
- verify no base API behavior broke unexpectedly;
- verify UI still exposes the original core actions.
