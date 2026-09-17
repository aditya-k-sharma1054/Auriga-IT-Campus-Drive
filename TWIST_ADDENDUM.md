# ParkOps — Updated Requirements Addendum

This addendum records the updated builder-round requirements. It supplements the base handoff and takes priority wherever the two conflict.

## T4 — Messy, per-spot-type rate card

Rates are no longer a single garage-wide set. Each garage has one cleaned rate for each `COMPACT`, `STANDARD`, and `EV` spot type. A `SpotRate` record stores first-hour, additional-hour, and daily-cap amounts as integer paise.

The pricing service selects the rate using the parked session's assigned spot type. A rate-card import endpoint accepts raw data, discards invalid/junk rows, normalizes supported spot-type labels, validates non-negative currency amounts, and atomically replaces only the valid cleaned rates. It reports accepted and rejected rows so an attendant can correct incomplete imports.

## T2 — Nightly auto-close, testable by clock endpoint

The backend owns a clock service. In normal use it returns the server's current UTC time. `POST /api/v1/clock` accepts a test time and runs the nightly close routine: every session still ACTIVE for more than 24 hours is billed using its assigned spot type's cleaned rate, marked COMPLETED, and its exact spot is released in the same transaction.

The endpoint returns every auto-closed session and its final fee. It exists for assessment/test automation; production deployment would restrict or replace its time-setting capability.

## T6 — Valet plate transfer

`POST /api/v1/parking/:sessionId/transfer-plate` transfers an ACTIVE session to a new normalized plate. It rejects a plate that already has an active session in the same garage. The original `checkedInAt` and `spotId` never change. A `PlateTransfer` audit record preserves the hand-off history.

## Unchanged invariants

- An EV remains restricted to an EV spot.
- One spot cannot have more than one ACTIVE session.
- One normalized plate cannot have more than one ACTIVE session per garage.
- Authoritative fees, timestamps, spot state, and garage scope remain backend-owned.
