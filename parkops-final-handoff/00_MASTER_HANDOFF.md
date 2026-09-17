# ParkOps — Master Engineering Handoff

## Purpose

This folder is the pre-execution source of truth for implementing the Auriga IT Builder Round parking-garage product.

The supplied assessment brief requires a working full-stack product with a real database, REST APIs, usable UI, registration/login, search, a one-page landing page, pagination and sorting. The round is strict and time-boxed to 2.5 hours. The problem statement prioritizes check-in/check-out and fee correctness first, then spot types and lookups.

## Product in one sentence

**ParkOps is an attendant-first parking operations system that keeps garage occupancy correct while making vehicle check-in, check-out, finding vehicles, EV availability, and fee calculation fast and reliable.**

## Source-of-truth hierarchy

1. Original assessment brief supplied by the candidate.
2. This engineering packet.
3. `10_DECISION_LOG.md` for explicit decisions and assumptions.
4. Domain/API/architecture documents for implementation detail.
5. Stitch/design documents for visual/UI decisions.
6. Agent instructions in `16_AGENTS.md`.
7. Generated code must not silently override the above.

If a contradiction is discovered, do not invent a new architecture or silently change a contract. Follow the highest applicable source and record a decision.

## Locked technical direction

- Frontend: React + Vite + TypeScript
- Styling: Tailwind CSS
- Routing: React Router
- HTTP client: Axios (native `fetch` is acceptable only if it materially reduces implementation risk)
- Backend: Node.js + Express + TypeScript
- Validation: Zod
- Authentication: JWT + bcrypt
- ORM: Prisma
- Database: SQLite for the assessment build
- API style: REST/JSON
- Architecture: modular monolith
- UI acceleration: Google Stitch
- Development environment required by assessment: GitHub Codespaces

## Core modules

- Auth
- Garage
- Parking Spots
- Parking
- Pricing

## Core entities

- User
- Garage
- ParkingSpot
- ParkingSession

## Critical invariants

- EV vehicles can only be assigned EV spots.
- A spot cannot have two active occupants.
- A vehicle plate cannot have two active sessions within the same garage.
- Every ACTIVE parking session has exactly one occupied spot.
- Every COMPLETED session keeps its historical fee and timestamps.
- Checkout only operates on an ACTIVE session.
- Final fee is calculated on the backend.
- Check-in/check-out state changes are transactional.
- All authenticated operations are scoped to the current user's garage.

## Primary UI routes

- `/` — Landing
- `/login` — Login
- `/register` — Registration
- `/app/dashboard` — Main operations dashboard
- `/app/history` — Parking history

Checkout is a modal/sheet within the application rather than a separate route unless implementation needs otherwise.

## Core user journey

1. User registers.
2. A garage is created/associated with the user and usable default spot inventory exists.
3. User logs in.
4. Dashboard shows occupancy and EV availability.
5. Attendant checks in a vehicle.
6. Backend finds a compatible available spot and atomically occupies it.
7. Attendant searches the plate and sees the active vehicle.
8. Attendant checks out the session.
9. Backend calculates the fee, closes the session, and releases the exact spot atomically.
10. History shows the completed record with search, sorting, and pagination.

## What success looks like

A fresh evaluator can clone the repo, follow README instructions, register/login, park an EV, find it by plate, check it out, see the correct fee, and verify the history without needing the developer to explain the architecture verbally.

## Documents

| File | Purpose |
|---|---|
| `00_MASTER_HANDOFF.md` | Overall source of truth |
| `01_PRD.md` | Product requirements, scope, acceptance criteria |
| `02_SCOPE_AND_GUARDRAILS.md` | Explicit inclusions/exclusions and anti-overbuild rules |
| `03_DOMAIN_MODEL.md` | Entities, invariants, state machines, business rules |
| `04_DATABASE_SCHEMA.md` | Concrete SQLite/Prisma schema specification |
| `05_API_CONTRACT.md` | REST endpoints, contracts, errors, pagination/sorting |
| `06_ARCHITECTURE.md` | Application structure and responsibilities |
| `07_UI_IA_AND_PAGES.md` | Pages, components, states and UX behavior |
| `08_STITCH_SPEC.md` | Canonical Google Stitch prompt and design requirements |
| `09_ENGINEERING_AND_SECURITY.md` | Implementation/security guardrails |
| `10_TEST_PLAN.md` | Test matrix and evaluator smoke path |
| `11_FAILURE_PREVENTION.md` | Predicted bottlenecks/failures and prevention mechanisms |
| `12_CHECKPOINTS.md` | Product + engineering checkpoints with GO/FIX/CUT rules |
| `13_EXECUTION_PLAN.md` | 150-minute implementation schedule |
| `14_TWIST_READINESS.md` | Safe method for incorporating the surprise twist |
| `15_DECISION_LOG.md` | Important decisions and rationale |
| `16_AGENTS.md` | Codex/Antigravity implementation instructions |
| `17_DESIGN_SYSTEM.md` | Shared visual language for Stitch and frontend |
| `18_REQUIREMENTS_TRACEABILITY.md` | Requirement-to-feature/API/UI/test mapping |
| `19_DEMO_SCRIPT.md` | Evaluator walkthrough and proof points |
| `README_PREPROCESS.md` | How to use this packet |

## Important assessment-document rule

Do not pre-generate a fake `AI_LOGS.md`. The assessment requires the complete AI conversation to be pasted as-is and unmodified. Create it from the actual coding session only.

Do not write a fictional `REASONING.md` in advance. Generate it after implementation from the real decisions, tests, fixes and trade-offs that occurred.
