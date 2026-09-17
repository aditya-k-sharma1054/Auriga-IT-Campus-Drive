# ParkOps — Build Checkpoints

## Philosophy

Every checkpoint asks two independent questions:

1. **Are we building the right product?**
2. **Are we building it correctly?**

A checkpoint may result in:

- **GO** — continue;
- **FIX** — stop and repair;
- **CUT** — remove optional scope to protect the core.

## CP0 — Requirement and product lock

### Target
Before coding.

### Right product?
Can we explain the product in one sentence and identify the attendant's four primary jobs?

### Built correctly?
Do the PRD, domain model and API contract agree?

### Gate
**GO only if vocabulary and priorities are stable.**

## CP1 — Database/domain checkpoint

### Target
~25–30 minutes.

### Right product?
Can the schema represent a garage, spots, active stays and historical stays without hacks?

### Built correctly?
Do invariants and state transitions have a clear place to be enforced?

### Gate
**FIX schema before API/UI work if not.**

## CP2 — Core end-to-end checkpoint

### Target
~75–90 minutes.

### Right product?
Can a real vehicle enter and leave the system successfully?

### Built correctly?
Does check-in transactionally assign/occupy a compatible spot and create an active session? Does checkout calculate fee and release the exact spot?

### Gate
This is the most important checkpoint.

**If FAIL: stop adding features.**

## CP3 — Adversarial/edge-case checkpoint

### Target
~90–105 minutes.

Try:

- duplicate plate;
- no EV spot;
- no compatible spot;
- checkout twice;
- 1h 1m duration;
- cap crossing;
- >24h;
- search unknown plate.

### Gate
**P0 failures must be fixed before UI expansion.**

## CP4 — Requirement completeness checkpoint

### Target
~120–125 minutes.

Checklist:

- DB;
- REST APIs;
- registration;
- login;
- usable UI;
- search;
- landing page;
- pagination;
- sorting.

### Gate
Anything missing that is a mandatory brief requirement outranks optional polish.

## CP5 — Evaluator-use checkpoint

### Target
~130–140 minutes.

A person who did not build the app should be able to:

- register/login;
- check in;
- find a vehicle;
- check out;
- see fee;
- open history;
- search/sort/paginate.

### Gate
If the workflow needs verbal explanation, improve the UI or defaults.

## CP6 — Architecture/code checkpoint

### Target
~140 minutes.

Review git diff and verify:

- modular monolith remains;
- domain services exist where appropriate;
- API contract remains stable;
- no duplicate implementations;
- no unnecessary dependencies;
- no mock P0/P1 data;
- no security regressions.

## CP7 — Fresh-clone checkpoint

### Target
~145 minutes.

Run the documented setup exactly as an evaluator would.

### Gate
The repository must actually work from a clean environment.

## CP8 — Submission checkpoint

### Target
Final 3–5 minutes.

Verify:

- public repository;
- README.md exists;
- REASONING.md exists and is truthful;
- AI_LOGS.md is present and matches required format;
- no accidental secrets;
- repo has committed/pushed latest working state.
