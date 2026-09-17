# ParkOps — Decision Log

## D-001 — Modular monolith

**Decision:** One Express backend with internal domain modules.

**Why:** Fits the 2.5-hour assessment, minimizes operational overhead and still creates clean seams for future twists.

**Why not microservices:** The base problem has no independent scaling/deployment need. Microservices would introduce deployment/configuration/network complexity without improving evaluation value.

## D-002 — TypeScript

**Decision:** TypeScript across frontend/backend.

**Why:** AI-assisted work creates integration risk across UI → API → service → DB. Static types help catch field/type mismatches early.

**Why not JavaScript:** JavaScript is faster to start, but the cross-layer contract safety is more valuable here once the scaffold exists.

**Why not a mixed stack:** One language keeps context switching low.

## D-003 — React + Vite

**Decision:** React frontend built with Vite.

**Why:** The product is a stateful dashboard with forms, tables, search, modals and server data. React is well matched and familiar. Vite keeps the frontend setup lightweight.

**Why not Next.js:** SSR/server components are not needed for this authenticated operational dashboard; they add another architecture dimension.

**Why not Angular:** More framework ceremony than needed for a 150-minute application.

**Why not Vue:** Technically suitable, but offers no material advantage over React for this user/workflow/team context.

## D-004 — Tailwind CSS

**Decision:** Tailwind.

**Why:** Fast implementation of the Stitch-approved visual system, responsive layouts, tables, forms and states.

**Why not Material UI:** Faster generic component assembly, but greater risk of a stock/generic visual identity and less direct control over the Stitch design.

**Why not CSS Modules:** Clean, but more manual styling work under a hard timebox.

## D-005 — Express

**Decision:** Express on Node.js.

**Why:** Simple REST routing/middleware, easy to reason about, small operational footprint.

**Why not NestJS:** Good architecture, but more setup/dependency/decorator/DI ceremony than needed for this scope.

**Why not Fastify:** Valid alternative; higher HTTP performance is not the bottleneck for a small parking operations app.

## D-006 — SQLite

**Decision:** SQLite for the assessment build.

**Why:** Real relational persistence with almost zero infrastructure setup, ideal for GitHub Codespaces and a strict 150-minute deadline.

**Why not MongoDB:** The core domain is strongly relational: garage → spots → parking sessions, with state transitions and transactional occupancy. MongoDB can support transactions, but its document model provides no material advantage here.

**Why not PostgreSQL:** PostgreSQL is the stronger production-scale target, but running/connecting a DB service adds setup and environment failure risk in this assessment. Prisma keeps the application persistence boundary replaceable.

**Why not MySQL:** Same assessment-time infrastructure trade-off; no problem-specific advantage over SQLite.

## D-007 — Prisma

**Decision:** Prisma.

**Why:** Clear schema, migrations, relation handling and transactions with less repetitive DB code.

**Why not raw SQL:** More repetitive and more opportunities for AI-generated query inconsistency.

**Why not Sequelize:** Valid, but Prisma's schema-centric workflow is easier for the coding agent and this domain.

**Why not Drizzle:** Also valid; Prisma is chosen for the simplicity and consistency of the generated schema/migration workflow.

## D-008 — JWT + bcrypt

**Decision:** JWT authentication with bcrypt password hashing.

**Why:** Simple stateless REST authentication with secure password storage.

**Why not a third-party auth provider:** Adds external configuration/dependency to a timed local assessment.

## D-009 — Zod

**Decision:** Zod for request validation.

**Why:** Central, explicit schemas for API inputs and query parameters; reduces inconsistent manual validation.

**Why not Joi:** Similar capability; Zod fits the TypeScript stack particularly well.

## D-010 — Axios

**Decision:** Axios unless native fetch materially reduces risk/time.

**Why:** Simple API layer and consistent request/error configuration.

**Why not insist on Axios:** This choice is intentionally low-stakes; native fetch is sufficient if minimizing dependencies becomes more important.

## D-011 — Backend-owned fee calculation

**Decision:** Final fee is calculated on the backend in a dedicated pricing service.

**Why:** Prevents client tampering and centralizes a high-risk business rule.

## D-012 — Backend-owned spot allocation

**Decision:** Client requests vehicle check-in; server selects the spot.

**Why:** Prevents stale UI state and double assignment.

## D-013 — Transactional check-in/check-out

**Decision:** Spot and session state changes occur in database transactions.

**Why:** These are atomic business operations. Partial updates could create impossible garage states.

## D-014 — Money as paise integers

**Decision:** Store money as integer paise.

**Why:** Avoids floating-point currency errors and keeps calculations deterministic.

## D-015 — UTC timestamps

**Decision:** Store timestamps in UTC and format on the client.

**Why:** Avoids timezone arithmetic mistakes and keeps data consistent.

## D-016 — No global state library

**Decision:** Do not add Redux/Zustand by default.

**Why:** Base app state can be managed through React state/context and API calls. A global state library is unnecessary unless actual complexity appears.

## D-017 — No real-time transport

**Decision:** Request-driven refreshes.

**Why:** Brief does not require multi-attendant real-time synchronization. WebSockets would increase code and testing surface.

## D-018 — Deterministic spot assignment

**Decision:** Lowest available compatible floor/spot by deterministic ordering.

**Why:** Easy to explain, test and extend without an optimization engine.

## D-019 — Registration creates garage context

**Decision:** Registration creates/associates a usable garage with default inventory.

**Why:** Lets the evaluator become productive immediately without an extra setup workflow.

## D-020 — Stitch is visual authority only

**Decision:** Use Stitch for UI design, not architecture.

**Why:** Design generation speeds up the visual layer while domain/API/DB decisions remain deterministic.
