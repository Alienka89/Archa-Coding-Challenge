# Expense Admin (Archa Coding Challenge)

A small full-stack application to manage **Expense Categories** and **Expense Codes**.

- Backend: **FastAPI** + SQLAlchemy + SQLite (seeded demo data)
- Frontend: **React (Vite)** + TypeScript + TailwindCSS
- API docs: Swagger UI

## Reviewer notes (where to look first)

If you only have a few minutes:

1. Open the **live UI** (create/update categories and codes):  
   http://ns-syd.io.lv:5173/

2. Check the **Swagger docs** locally (request/response shapes, validation rules):  
   http://localhost:8001/docs

3. Review **tests** to see the minimum expected behaviour captured as executable checks:

- Backend tests: `backend/tests/`
- Frontend tests: `frontend/` (see the test script in `package.json`)

This repository is organised so you can review it “top-down”:
UI → API contract → tests → implementation details.

---

## Quick start (Docker Compose)

From the **repository root**:

```bash
docker compose up --build
```

Open:

**Local**

- Frontend (UI): http://localhost:5173
- Backend (API): http://localhost:8001
- Swagger: http://localhost:8001/docs

**Published**

- Frontend (UI): http://ns-syd.io.lv:5173/

Notes:

- Port mapping is `8001:8000` (host → container).
- Storage is SQLite (`sqlite:///./app.db`) and is persisted via the backend volume.

Stop:

```bash
docker compose down
```

## Project tour (code map)

### Frontend

- UI components are extracted for re-use to avoid duplication and keep screens small and readable.
- API requests are centralised so endpoints / headers / error handling live in one place.
- Mutations are followed by **cache invalidation** so the UI reflects the latest server state.
- I implemented **optimistic updates** as an optional perceived-performance optimisation. In a real product we could go further (e.g. prefetch on hover), but the right level of optimisation depends on requirements.

### Backend

- Routers are intentionally thin (request parsing + response mapping).
- Business logic is kept outside routers (service / use-case style), which makes it easier to test and evolve.
- Persistence concerns are isolated from the API boundary.

---

## Rationale (technology and architecture choices)

- **FastAPI** was chosen to ship quickly for the challenge and to demonstrate how performance-sensitive parts can be extracted into a small API service. In a CRUD-heavy internal admin app in production, I would often choose **Django** to leverage its built-in validation/admin tooling and reduce handwritten plumbing (smaller bug surface area).
- **Clean Architecture** was chosen to keep boundaries explicit and make the codebase easier to navigate for engineers with a Django background. This separation of concerns also tends to work well with AI-assisted review and refactoring. For a truly small service, a simpler layered architecture would likely be sufficient.

---

## API overview

Required endpoints:

- `GET /categories`
- `POST /categories`
- `PUT /categories/{id}`
- `GET /categories/{id}/codes`
- `POST /categories/{id}/codes`
- `PUT /codes/{id}`

### Error handling

This API uses two error “shapes”:

1. **Request body validation** (FastAPI / Pydantic) returns `422` with `detail` as a list of validation errors.

2. **Domain / business validation** returns JSON in a consistent format:

```json
{
  "detail": {
    "code": "duplicate_name",
    "message": "Category name must be unique."
  }
}
```

Status codes are chosen to reflect the brief:

- `400` for invalid input (empty after trimming, duplicates, etc.)
- `404` for missing resources
- `500` for unexpected DB errors

### Validation rules (summary)

Categories:

- `name` is required, trimmed, must not be empty
- unique by name
- `is_active` defaults to `true`

Codes:

- belong to a category
- `code` is required, trimmed, must not be empty
- unique within a category (`(category_id, code)` unique constraint)
- `description` is optional
- `is_active` defaults to `true`

---

## Seed data

On startup, the backend initialises tables and inserts seed data **only if the DB is empty**:

- Categories: Travel, Meals, Office
- Codes: FLIGHT, HOTEL, LUNCH, SUPPLIES

This is intended for local demo and manual QA.

---

## Tests

The brief asks for selective tests (not exhaustive).

The goal is to lock in the minimum expected behaviour and provide a safe base for further changes (especially when working independently).

Test data setup is intentionally simple and reusable. If the suite grows, I would introduce factories and pytest plugins/fixtures to reduce boilerplate and speed up iteration.

Backend tests cover:

- a success case
- a failure case (validation, duplicates, not-found)

### Backend

Run locally:

```bash
cd backend
pytest -q
```

Or via Docker:

```bash
docker compose exec backend pytest -q
```

### Frontend

```bash
cd frontend
npm test
```

---

## Postman / Newman smoke tests

A Postman collection can be run with Newman.

Example:

```bash
npx newman run archa_postman_collection.json \
  --env-var "baseUrl=http://localhost:8001" \
  -r json --reporter-json-export postman_run.json
```

---

## Trade-offs (time constraints)

1. **No migrations**: schema is created on application startup (acceptable for the exercise).
2. **SQLite as storage**: simple, local-first, minimal operational overhead.
3. **Limited API surface**: no delete endpoints, no pagination/search/filtering, no bulk operations.
4. **Minimal “production hardening”**: basic structured errors and logging, without full observability stack.
5. **Selective tests**: focused on key flows and edge cases, rather than aiming for high coverage.

---

## Production improvements

If this were going to production, I would prioritise:

- **Database**: move to Postgres; introduce Alembic migrations; proper connection pooling.
- **API**: pagination + filtering; consistent RFC7807-like problem responses; tighter schema validation contracts.
- **Observability**: request IDs, structured logging, metrics, tracing, SLOs/alerts.
- **Security**: authentication, authorisation, audit log.
- **DX**: pre-commit hooks, CI pipeline, type checking, dependency pinning, container hardening.
- **Testing**: broader integration tests, contract tests, and frontend tests around critical user journeys.

---

## How I would approach…

### Authentication and permissions

- Use OIDC (e.g. company SSO) with JWT access tokens.
- Model roles such as `admin`, `finance_ops`, `viewer`.
- Enforce authorisation at the API boundary (FastAPI dependency) and at the service layer for defence in depth.
- Add audit logging for all config changes (who/when/what).

### Concurrency or conflicting updates

- Add optimistic concurrency control:
  - `version` integer column or `updated_at` timestamp, validated with `If-Match` (ETag) or an explicit `version` field.
- Use database constraints as the final source of truth for uniqueness.
- Consider idempotency keys for create operations in high-latency environments.

### Scaling to thousands of categories or codes

- Add pagination and server-side filtering/search for categories and codes.
- Ensure correct indexes (already present for key lookups; expand as query patterns evolve).
- Cache read-heavy endpoints when appropriate.
- Frontend: list virtualisation, debounced search, and incremental loading.
- Consider splitting read/write models if the admin surface becomes more complex.

---

## Notes

- Authentication is intentionally omitted, as per the brief.
- Styling is intentionally minimal; focus is on correctness and maintainability.
