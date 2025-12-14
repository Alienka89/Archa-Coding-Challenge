# Expense Admin (Archa Coding Challenge)

A small full-stack application to manage **Expense Categories** and **Expense Codes**.

- Backend: **FastAPI** + SQLAlchemy + SQLite (seeded demo data)
- Frontend: **React (Vite)** + TypeScript + TailwindCSS
- API docs: Swagger UI

---

## Quick start (Docker Compose)

From the **repository root**:

```bash
docker compose up --build
```

Open:
- Frontend (UI): http://localhost:5173
- Backend (API): http://localhost:8001
- Swagger: http://localhost:8001/docs

Notes:
- Port mapping is `8001:8000` (host → container).
- Storage is SQLite (`sqlite:///./app.db`) and is persisted via the backend volume.

Stop:

```bash
docker compose down
```

---

## Rationale (technology and architecture choices)

- **FastAPI** was selected to demonstrate how performance-sensitive parts of a system can be extracted into standalone microservices. It is lightweight and typically offers excellent throughput for API workloads, although it requires more explicit wiring compared to Django.
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

The brief asks for selective tests (not exhaustive). Backend tests cover:
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
npx newman run archa_postman_collection.fixed.json \
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
