# ParkOps — Evaluator Demo Script

## Goal

Demonstrate the product in 2–3 minutes through the core business story instead of giving a code tour.

## Demo setup

Use a fresh or prepared account with a garage containing:

- multiple floors;
- occupied and available spots;
- at least one available EV spot;
- enough history records to demonstrate pagination.

## Flow

### 1. Landing

Show:

- what ParkOps does;
- target audience;
- main features;
- three future features.

Then click Get Started.

### 2. Authentication

Register/login.

Point out that the application is backed by a real garage context rather than static demo data.

### 3. Dashboard

Show:

- total occupancy;
- available spots;
- EV availability;
- check-in form;
- vehicle lookup.

### 4. Check in an EV

Enter a test plate and choose EV.

Show the returned assigned EV spot.

Immediately show that EV availability/occupancy changed.

### 5. Find the vehicle

Search the same plate.

Show its active session and exact spot.

### 6. Checkout

Click checkout.

Show:

- duration;
- billable hours;
- fee;
- released spot.

### 7. History

Open history.

Demonstrate:

- plate search;
- sorting;
- pagination.

## Optional verbal architecture proof point

If asked how correctness is maintained:

> “The backend owns parking state. Check-in and checkout are transactional operations. Spot assignment is performed server-side, and fee calculation is isolated in a pricing service. The frontend only presents the resulting state.”

## Do not demo

Avoid spending demo time on:

- source-code walkthroughs;
- unused APIs;
- optional settings;
- architectural jargon without a concrete question.
