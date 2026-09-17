# ParkOps — Google Stitch Handoff Specification

## Purpose

Use Google Stitch to accelerate the UI design while keeping the engineering architecture and business logic controlled by this packet.

## Stitch boundary

Stitch decides:

- visual style;
- component appearance;
- layout;
- typography hierarchy;
- color semantics;
- spacing;
- interaction presentation.

Stitch does NOT decide:

- database schema;
- API contracts;
- domain rules;
- authentication architecture;
- transaction behavior;
- fee calculation.

## Product context to give Stitch

ParkOps is an attendant-first parking operations system for busy multi-level garages.

The user is a parking attendant who needs to:

- check in vehicles;
- check out vehicles;
- see where a vehicle is parked;
- quickly search by license plate;
- know whether EV spots are available;
- inspect a large parking history.

The UI should feel like a focused B2B operations product, not a consumer booking website.

## Visual direction

- professional;
- clean;
- operational;
- high information clarity;
- compact but not cramped;
- strong visual hierarchy;
- restrained decoration;
- modern SaaS quality;
- desktop-first operational dashboard;
- responsive for smaller widths.

Avoid:

- excessive gradients;
- glassmorphism everywhere;
- giant marketing graphics;
- dashboard clutter;
- decorative charts that do not support the task;
- excessive animation.

## Required screens to generate

1. Landing
2. Login
3. Register
4. Dashboard
5. Checkout modal/sheet state
6. History
7. Empty/error/loading states where useful

## Dashboard priorities

The visual hierarchy should make these obvious in this order:

1. occupied/available/EV available status;
2. check-in;
3. find vehicle;
4. active vehicles;
5. EV spot detail;
6. secondary information.

## Design system output

Create a consistent system covering:

- typography;
- headings/body/captions;
- spacing scale;
- border radius;
- button variants;
- input states;
- status badges;
- cards;
- tables;
- dialogs/sheets;
- empty states;
- loading skeleton/spinner pattern;
- error states.

The design system should be reusable in React.

## Canonical design prompt

```text
Design ParkOps, a professional B2B parking operations product for parking attendants in busy multi-level garages.

Primary user: parking attendant.

Primary tasks:
- check in a vehicle;
- automatically assign a compatible parking spot;
- find an active vehicle by license plate;
- check out a vehicle and review the final parking fee;
- see EV spot availability;
- browse/search/sort/paginate parking history.

Product character:
- fast;
- trustworthy;
- operational;
- clear;
- modern B2B SaaS;
- high information density without clutter.

Create a coherent design system first, then design these screens:
1) landing page,
2) login,
3) registration,
4) primary dashboard,
5) checkout confirmation/modal,
6) parking history.

The dashboard must prioritize occupancy metrics, EV availability, check-in, vehicle search, and active vehicles.

Use clear loading, empty, validation-error and success states.

Do not add irrelevant consumer features, payment flows, maps, reservations, or analytics to the base UI.
```
