# ParkOps — Product Requirements Document

## 1. Problem

A busy multi-level city-centre parking garage needs a reliable operational tool. Cars enter and leave throughout the day; spots are limited and typed; EVs require EV spots; attendants need fast lookup; and the parking log becomes large.

## 2. Primary user

### Parking attendant

A user working at or around the garage who prioritizes speed, correctness, clear status and minimal clicks.

## 3. Product goal

Build a compact but complete operational system that:

- maintains correct garage occupancy;
- assigns compatible spots;
- calculates parking fees correctly;
- allows fast plate lookup;
- makes EV availability immediately visible;
- keeps a persistent historical log.

## 4. Product principles

1. **Correctness before cleverness.**
2. **Attendant speed before decorative UI.**
3. **Backend authority over critical state.**
4. **Simple architecture with clear seams for future features.**
5. **No feature should exist merely because an AI can generate it.**

## 5. Functional requirements

### FR-01 Authentication

Users can register and log in. Protected application APIs require authentication.

### FR-02 Garage context

Each authenticated user operates within a garage context. Garage data includes name, address and configurable pricing.

### FR-03 Spot inventory

A garage contains parking spots with:

- floor;
- number;
- type: COMPACT, STANDARD, EV;
- status: AVAILABLE, OCCUPIED.

### FR-04 Vehicle check-in

Given a valid plate and vehicle type:

1. reject malformed input;
2. reject a duplicate active plate;
3. find a compatible available spot;
4. atomically create an ACTIVE session and occupy the spot;
5. return the assigned spot.

### FR-05 Vehicle check-out

Given an active parking session:

1. use server-side current time;
2. calculate billable duration;
3. calculate the fee from garage pricing;
4. atomically complete the session and release the exact spot;
5. return a checkout summary.

### FR-06 Fee calculation

The business rule is:

- first hour uses the first-hour rate;
- additional hours use the additional-hour rate;
- partial hours round up;
- a daily cap applies;
- full 24-hour blocks use the daily cap;
- a remaining partial 24-hour block is billed hourly, capped at the daily cap.

This last multi-day interpretation is an implementation assumption because the brief does not define the exact >24-hour formula.

### FR-07 EV compatibility

An EV vehicle can only be assigned an EV spot.

### FR-08 EV availability

The dashboard must expose the number of available EV spots and allow the attendant to inspect the availability list.

### FR-09 Vehicle lookup

The attendant can search for a vehicle by normalized license plate and see active parking information.

### FR-10 Parking history

The user can browse completed parking sessions through a server-paginated and server-sorted history API.

### FR-11 Search

The product must provide:

- active vehicle lookup by plate;
- history search by plate.

### FR-12 Pagination and sorting

History data is paginated on the server. Sorting is limited to an allow-list of known fields.

### FR-13 Landing page

A single page must explain:

- what ParkOps is;
- key features;
- target audience;
- how it helps;
- exactly three future features.

## 6. Non-functional requirements

- responsive enough for desktop/tablet/mobile inspection;
- clear loading, success, empty and error states;
- no critical flow should depend on mock data;
- repeatable setup from a fresh clone;
- no secrets committed to git;
- stable API error format;
- business logic covered by focused tests.

## 7. Out of scope

Unless the surprise twist explicitly requires one, do not implement:

- payments;
- online reservations;
- QR scanning;
- notifications;
- maps/navigation;
- driver accounts;
- advanced RBAC;
- real-time WebSocket synchronization;
- Redis;
- microservices;
- cloud-specific infrastructure;
- advanced analytics;
- AI features inside the product.

## 8. Acceptance criteria

The base release is accepted only if all of the following are true:

- registration works;
- login works;
- authenticated dashboard loads real DB data;
- a vehicle can be checked in;
- the backend assigns a compatible spot;
- duplicate active plates are blocked;
- an EV cannot be assigned a non-EV spot;
- no-compatible-spot is handled cleanly;
- checkout calculates and returns a fee;
- checkout releases the exact occupied spot;
- completed history persists;
- plate search works;
- EV availability is visible;
- history supports search, pagination and sorting;
- landing page contains every required section;
- README lists setup and API endpoints;
- application works from a fresh clone.

## 9. Definition of done

A feature is done only when:

1. it works through the UI;
2. the API behaves correctly;
3. the database state is correct;
4. critical error cases are handled;
5. relevant tests/smoke checks pass;
6. no mock implementation remains in the final flow.
