# ParkOps — Scope, Constraints & Guardrails

## 1. Assessment constraints

- Strict 2.5-hour build window.
- Candidate may use AI tools.
- Any language/framework is permitted.
- Work happens in GitHub Codespaces.
- Public GitHub repository is required.
- Required root files: README.md, REASONING.md, AI_LOGS.md.

## 2. Scope boundary

### Must build

- full-stack application;
- real persistence;
- REST API;
- registration/login;
- check-in/check-out;
- fee calculation;
- spot assignment;
- EV availability;
- plate search;
- history;
- pagination;
- sorting;
- landing page.

### Build if time remains

- polished empty/error states;
- spot availability drawer;
- garage settings UI;
- small operational activity feed;
- extra history filters that do not endanger core correctness.

### Do not build unless twist requires it

- payments;
- reservations;
- notifications;
- maps;
- real-time infrastructure;
- microservices;
- Redis;
- advanced user roles;
- cloud deployment dependencies.

## 3. Scope rules for the coding agent

- Never add a feature just to make the product look larger.
- Never replace a required core implementation with a mock.
- Never silently change a business rule.
- Never introduce a new major dependency without a clear benefit to the assessment.
- If behind schedule, cut polish before cutting correctness.

## 4. Requirement priority

Priority order:

**P0:** check-in/check-out/fee correctness and DB integrity.

**P1:** authentication, spot compatibility, EV availability, plate lookup.

**P2:** pagination, sorting, history, landing page.

**P3:** visual polish and optional conveniences.

## 5. Anti-overengineering rules

Reject any implementation that introduces complexity without a requirement-backed reason.

Examples:

- one Express app is preferred over multiple services;
- SQLite is preferred over an externally hosted DB for the timed build;
- plain React state is preferred over a global state library unless complexity actually appears;
- no queue/event bus is required;
- no caching layer is required;
- no background worker is required.

## 6. Product correctness rules

The source of truth for:

- occupancy is the backend database;
- fee is the backend pricing service;
- active session is the database record with ACTIVE status;
- garage context is the authenticated user context.

The UI is a client of these rules, never their authority.
