# ParkOps — Requirements Traceability Matrix

## Purpose

Every mandatory assessment requirement should map to something demonstrable in the repository. This prevents “implemented somewhere” ambiguity.

| Requirement | Product feature | API | UI | Verification |
|---|---|---|---|---|
| Real database | SQLite + Prisma schema | All persistent APIs | Dashboard/history use real data | DB migration + smoke test |
| REST APIs | Modular Express routes | `/api/v1/*` | Axios API layer | Endpoint verification |
| Usable UI | React app | N/A | Landing/auth/dashboard/history | UI smoke test |
| Registration | User + Garage creation | `POST /auth/register` | Register page | Auth test |
| Login | JWT auth | `POST /auth/login`, `GET /auth/me` | Login page | Auth test |
| Search | Active plate lookup + history search | `/parking/search`, `/parking/history?search=` | Search controls | Search tests |
| Landing page | Product explanation | N/A | `/` | Manual checklist |
| Pagination | History pagination | `/parking/history?page=&pageSize=` | History pager | Pagination test |
| Sorting | History sorting | `/parking/history?sortBy=&sortOrder=` | Sort controls | Sorting test |
| Check-in | Assign compatible spot | `POST /parking/check-in` | Dashboard check-in | End-to-end test |
| Check-out | Calculate fee + release spot | `POST /parking/:id/check-out` | Checkout dialog | End-to-end + fee tests |
| EV availability | Current EV count/list | `/spots/availability?type=EV` | Dashboard | EV tests |
| No double parking | Transactional occupancy | Internal parking service | Not client-controlled | Concurrency/state tests |
| Correct fee | Dedicated pricing service | Checkout response | Checkout summary | Fee boundary matrix |

## Traceability rule

If a feature cannot be pointed to in at least one of these dimensions:

- API;
- UI;
- database/domain;
- test/verification;

then it is not complete.

## Final audit

Before submission, compare this table against the actual implementation. Do not mark a row complete because code “looks like it should work”; execute the corresponding verification.
