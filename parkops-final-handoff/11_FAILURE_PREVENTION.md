# ParkOps — Predicted Bottlenecks, Failures & Prevention

## Purpose

A professional implementation plan predicts where a timed AI-generated build will fail and puts a specific control in front of each failure.

| Risk | What goes wrong | Prevention | Detection | Response |
|---|---|---|---|---|
| AI overbuilds | Too much architecture; little working product | Modular monolith + scope guardrails | Time checkpoint | Cut optional modules immediately |
| UI-first trap | Beautiful screens, no working backend | P0 backend/core milestone | CP2 end-to-end test | Stop styling; finish core |
| API drift | Frontend expects fields backend doesn't return | Freeze API contract before coding | Typecheck/integration | Update both from contract, not ad hoc |
| Schema drift | Multiple competing models | DB schema is source of truth | Prisma migration review | Reconcile before adding features |
| Double parking | Two requests claim the same spot | Conditional update + transaction | Concurrent test | Fix transaction boundary |
| Duplicate plate | Same car gets multiple active sessions | Active-session check in transaction | Duplicate test | Block with 409 |
| Wrong EV allocation | EV assigned to standard spot | Compatibility rule in service | CI-02/03 | Make spot filtering server-only |
| Wrong fee | Rounding/cap bug | Isolated pricing service + tests | Fee test matrix | Fix service; don't patch UI |
| Multi-day ambiguity | AI invents different formula | Explicit >24h assumption in domain doc | FT-07 | Follow documented rule |
| Client-side authority | UI calculates fee or state | Backend owns rules | Code review | Move logic server-side |
| Timezone bug | Wrong duration/receipt time | UTC DB + server time | Boundary tests | Normalize date handling |
| Pagination fake | UI downloads everything then slices | Server-side pagination contract | API inspection | Move limit/offset to DB |
| Sort injection | Arbitrary order field reaches query | Allow-list | API test | Reject unknown fields |
| Cross-garage leak | User reads another garage | Derive garageId from auth | Auth isolation test | Add scoped queries everywhere |
| Seed/setup failure | Evaluator cannot start app | One documented setup path | Fresh-clone test | Fix setup before polish |
| Dependency explosion | Install/config time grows | Locked stack | Package review | Remove unnecessary packages |
| Stitch mismatch | UI design and React structure diverge | Canonical design system + page spec | Visual review | Implement components from system |
| Agent rewrites architecture | Codex changes stable decisions | AGENTS.md + decision log | Git diff review | Revert and instruct agent |
| Mock-data leakage | Demo appears functional but DB isn't used | “No mock data in P0/P1” rule | Smoke test | Replace with real API calls |
| Late docs | Product works but submission incomplete | Documentation checkpoint at ~140 min | CP5 | Cut optional polish and finish docs |
| AI log invalid | Conversation is missing/modified | Capture actual conversation as required | Submission checklist | Reconstruct from real log only; never fabricate |
| Concurrent agent conflict | Two coding tools modify same files | One implementation agent at a time | Git diff | Stop secondary agent |
| Twist derails core | New feature rewrites stable modules | Twist impact-analysis protocol | Twist checkpoint | Isolate change; protect P0 rules |
| Browser/Codespaces mismatch | Works locally, fails in evaluation env | Reproduce in Codespaces | Fresh environment test | Fix commands/config |

## Failure-response rule

When a failure occurs, classify it before fixing:

1. **Core correctness** → fix immediately.
2. **Requirement omission** → fix before polish.
3. **Integration/UI issue** → fix after core.
4. **Cosmetic issue** → only fix if time remains.

Never spend the final minutes fixing cosmetics while a P0 rule remains broken.
