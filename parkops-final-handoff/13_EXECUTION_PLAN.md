# ParkOps — 150-Minute Execution Plan

## Core rule

Protect the P0 workflow first. If time is lost, reduce polish/features rather than weaken core correctness.

## Phase 1 — 0–10 min: scaffold

- create repo/application structure;
- initialize frontend/backend;
- install only locked dependencies;
- add environment configuration;
- wire basic health endpoint;
- initialize Prisma.

**Checkpoint:** app boots.

## Phase 2 — 10–25 min: database

- create Prisma schema;
- migration;
- seed/default garage and spots;
- verify tables/relations.

**Checkpoint:** database exists and data can be queried.

## Phase 3 — 25–50 min: auth + foundation

- register;
- login;
- JWT middleware;
- garage context;
- base error handler;
- Zod validation.

**Checkpoint:** authenticated API works.

## Phase 4 — 50–80 min: core parking engine

Build first:

1. normalized plate;
2. compatible spot selection;
3. transactional check-in;
4. isolated pricing service;
5. transactional checkout;
6. active search;
7. dashboard summary.

**Checkpoint:** one full vehicle lifecycle works.

## Phase 5 — 80–105 min: application UI

- shell/navigation;
- dashboard;
- check-in form;
- active vehicles;
- vehicle search;
- checkout flow.

**Checkpoint:** full core flow through UI.

## Phase 6 — 105–120 min: mandatory secondary features

- history;
- search;
- pagination;
- sorting;
- EV availability.

**Checkpoint:** all brief requirements except landing/docs are demonstrable.

## Phase 7 — 120–132 min: Stitch-driven polish

- apply design system;
- landing page;
- improve states;
- responsive fixes;
- consistent spacing/icons/buttons.

Do not introduce new business functionality here.

## Phase 8 — 132–142 min: tests/fixes

Run pricing matrix + key API cases + UI smoke test.

Fix in order:

1. P0 correctness;
2. mandatory requirements;
3. severe UI blockers;
4. cosmetic issues.

## Phase 9 — 142–147 min: docs

- README.md;
- REASONING.md based on actual implementation;
- API endpoint list;
- setup/debug commands;
- known assumptions.

## Phase 10 — 147–150 min: submission

- final git status;
- inspect diff;
- push;
- verify public repo;
- ensure AI_LOGS.md is complete and unmodified as required;
- submit URL.
