# ParkOps — Engineering, Security & Quality Guardrails

## 1. Architecture guardrails

- Keep a modular monolith.
- Keep business rules in services.
- Keep controllers thin.
- Keep DB access through Prisma.
- Keep pricing in a dedicated pricing service.
- Keep the API contract stable after it is implemented.

## 2. TypeScript guardrails

- Use strict TypeScript where practical.
- Avoid `any` unless there is a documented reason.
- Reuse domain/API types instead of duplicating string literals across UI and backend.
- Do not over-genericize code purely to reduce line count.

## 3. Database guardrails

- Use foreign keys.
- Use compound uniqueness where it truly represents an invariant.
- Add indexes matching common queries.
- Store money in integer paise.
- Store timestamps in UTC.
- Use transactions for state-changing check-in/check-out operations.

## 4. Authentication/security

- Hash passwords with bcrypt.
- Never store plaintext passwords.
- Never return passwordHash.
- Sign JWTs from a server-side secret in environment variables.
- Do not commit secrets.
- Protect authenticated routes.
- Derive garage context from authenticated user identity.
- Never trust client-provided garageId for authorization.

For the assessment implementation, a JWT stored in the browser can be used for simplicity. Do not store a password or other sensitive credentials in browser storage.

## 5. Input validation

Validate:

- email;
- password;
- plate;
- vehicle type;
- floor;
- spot number;
- pricing values;
- pagination values;
- sorting fields.

Invalid input returns a structured 400 error.

## 6. Query safety

Sorting is allow-listed.

Example:

```ts
const allowedSortFields = {
  checkedInAt: 'checkedInAt',
  checkedOutAt: 'checkedOutAt',
  plateNumber: 'plateNumber',
  feePaisa: 'feePaisa'
} as const;
```

Do not pass arbitrary client strings into SQL/order expressions.

## 7. Frontend guardrails

- No hard-coded parking state.
- No mock records in the final operating flow.
- No client-side final fee authority.
- API access belongs in the API layer, not copied into every component.
- Disable action buttons while a mutation is in progress.
- Handle 409 conflicts clearly.

## 8. Error handling

Use one top-level error middleware on the server.

Error response must expose a safe code/message pair.

Never expose internal stack traces in production-style responses.

## 9. Time/date guardrails

- server determines check-in/check-out timestamps;
- database stores UTC;
- calculate duration from actual timestamps;
- use integer minute/hour arithmetic rather than floating-point currency math;
- test boundary times explicitly.

## 10. Code-generation guardrails

When AI generates code:

1. inspect the generated code before accepting architectural changes;
2. keep the domain model canonical;
3. ask the AI to modify existing modules before creating replacements;
4. remove duplicate implementations;
5. run typecheck/tests after significant generated changes;
6. never accept “works visually” as proof of backend correctness.

## 11. Dependencies

Prefer the locked stack.

A new dependency is justified only if:

- it materially reduces implementation risk/time;
- it has a clear role;
- it does not create deployment/configuration burden.

## 12. Documentation guardrails

README must match actual commands/endpoints.

REASONING.md must reflect what actually happened.

AI_LOGS.md must contain the real AI conversation exactly as required by the assessment.
