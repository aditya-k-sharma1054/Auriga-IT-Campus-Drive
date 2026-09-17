# ParkOps — Pre-Execution Packet Guide

## What this is

A complete engineering handoff for a vibe-coding agent before implementation of the Auriga Builder Round parking problem.

## Intended workflow

### 1. Human review

Read:

- Master handoff
- PRD
- Scope/guardrails
- Domain model
- Database schema
- API contract
- Architecture
- UI/page spec
- Stitch spec
- Test plan
- Failure prevention
- Requirements traceability
- Demo script
- Checkpoints
- Decision log

Resolve any remaining human preference decisions before coding.

### 2. Stitch

Use `08_STITCH_SPEC.md` + `17_DESIGN_SYSTEM.md` to generate the visual system and screens.

Do not allow UI generation to redefine domain/API/database decisions.

### 3. Coding agent

Give the repository/folder to Codex or Antigravity with `16_AGENTS.md` as persistent instructions.

The coding agent should use the rest of the files as the detailed specification.

### 4. Implementation

Follow `13_EXECUTION_PLAN.md` and stop at each checkpoint in `12_CHECKPOINTS.md`.

### 5. Actual submission docs

Create:

- `README.md` — actual setup/debug instructions + endpoint list;
- `REASONING.md` — truthful record of decisions, tests and fixes;
- `AI_LOGS.md` — complete AI conversation exactly as required by the assessment.

Do not fabricate either of the last two.

## Final pre-coding checklist

- [ ] Stack is locked.
- [ ] Domain entities are locked.
- [ ] State transitions are locked.
- [ ] Fee semantics are explicit.
- [ ] API contract is locked.
- [ ] UI pages are defined.
- [ ] Search is defined.
- [ ] Pagination/sorting are defined.
- [ ] Failure modes are known.
- [ ] Checkpoints are defined.
- [ ] Twist protocol is defined.
- [ ] Agent instructions are present.
- [ ] Requirements can be traced from brief → API/UI/test.
- [ ] Evaluator demo path is defined.
- [ ] Stitch has a canonical design brief.
