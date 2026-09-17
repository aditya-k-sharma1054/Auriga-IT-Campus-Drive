# ParkOps — Agent Instructions (Codex / Antigravity)

You are implementing **ParkOps**, an attendant-first parking operations system for the Auriga IT Builder Round.

## Read before coding

Read all files in this folder, especially:

1. `00_MASTER_HANDOFF.md`
2. `01_PRD.md`
3. `03_DOMAIN_MODEL.md`
4. `04_DATABASE_SCHEMA.md`
5. `05_API_CONTRACT.md`
6. `06_ARCHITECTURE.md`
7. `07_UI_IA_AND_PAGES.md`
8. `09_ENGINEERING_AND_SECURITY.md`
9. `10_TEST_PLAN.md`
10. `11_FAILURE_PREVENTION.md`
11. `12_CHECKPOINTS.md`
12. `15_DECISION_LOG.md`
13. `17_DESIGN_SYSTEM.md`

These documents are the implementation source of truth.

## Mission

Build a working, requirement-complete product before polishing optional details.

## First principles

- correctness > feature count;
- backend authority > client convenience;
- small coherent architecture > clever architecture;
- explicit rules > AI guesswork;
- tests of invariants > superficial screenshot validation.

## Locked stack

- React + Vite + TypeScript
- Tailwind CSS
- React Router
- Axios if useful
- Node.js + Express + TypeScript
- Prisma
- SQLite
- Zod
- JWT + bcrypt

## Architecture rules

Keep one modular monolith.

Backend modules:

- auth;
- garage;
- spots;
- parking;
- pricing.

Keep controllers thin and business logic in services.

## Never violate these rules

1. Never calculate the authoritative checkout fee only in the frontend.
2. Never let the frontend decide the authoritative spot status.
3. Never create two active sessions for the same normalized plate within one garage.
4. Never allocate an EV to a non-EV spot.
5. Never occupy a spot that the database says is occupied.
6. Never complete checkout without releasing the exact occupied spot.
7. Never accept a client-supplied garageId as the authorization source.
8. Never commit plaintext passwords or secrets.
9. Never use unbounded client-provided sort fields in DB queries.
10. Never replace the required real DB flow with mock data.

## Implementation order

Implement in this order unless a concrete dependency requires otherwise:

1. project scaffold;
2. Prisma schema + migration + seed;
3. auth;
4. garage context;
5. spot queries;
6. pricing service;
7. transactional check-in;
8. transactional checkout;
9. active search;
10. dashboard summary;
11. React shell/dashboard;
12. history/search/pagination/sorting;
13. landing page;
14. tests/fixes;
15. README/REASONING.

## Working style

Before introducing a new abstraction, ask whether the current requirement actually needs it.

Before modifying a core domain rule, check the domain model and decision log.

Prefer editing/extending existing modules to creating replacement implementations.

Do not create duplicate API clients, duplicate fee calculators or multiple representations of spot/session state.

## Error handling

Use structured errors:

```json
{
  "error": {
    "code": "SOME_CODE",
    "message": "Human-readable message"
  }
}
```

## Testing after meaningful changes

At minimum, keep these passing:

- fee boundary tests;
- check-in happy path;
- EV/no-EV path;
- duplicate plate path;
- checkout path;
- pagination/sorting path;
- auth path.

## Checkpoints

After schema: verify database.

After backend core: execute a complete check-in → search → checkout lifecycle.

Before polish: verify every mandatory assessment requirement.

Before submission: perform a fresh-clone smoke test.

## If time becomes tight

Cut in this order:

1. animations;
2. optional filters;
3. extra dashboard widgets;
4. optional settings UI;
5. visual refinements.

Never cut:

- database persistence;
- auth;
- check-in;
- checkout;
- fee calculation;
- spot compatibility;
- search;
- pagination;
- sorting;
- required landing page;
- documentation required by the assessment.

## When a new twist arrives

Do not immediately rewrite the system.

Classify the twist, identify affected entities/invariants/services/APIs/pages/tests, protect the stable core, then implement the smallest additive change that satisfies the requirement.

## Git discipline

Keep changes coherent and inspect diffs after major generated changes.

Do not silently overwrite a working implementation with generated alternatives.
