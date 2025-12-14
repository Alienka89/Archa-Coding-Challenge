# End of day summary

**Date:** 14 Dec 2025 (EET)

## What I shipped today

- Implemented a FastAPI backend for managing Expense Categories and Expense Codes.
- Added SQLite persistence with SQLAlchemy models and constraints:
  - unique category names
  - unique codes per category (`(category_id, code)`)
  - foreign key with cascade delete
- Implemented required endpoints:
  - `GET/POST/PUT /categories`
  - `GET/POST /categories/{id}/codes`
  - `PUT /codes/{id}`
- Added seed data for a quick local demo.
- Added backend tests covering both success and failure cases.
- Added a React (Vite) frontend with:
  - category list
  - codes list per selected category
  - create/update flows with loading states and basic error handling
  - limited, meaningful tests (hooks/components)
- Dockerised the full stack so **frontend + backend** start with a single command via Docker Compose.

## How to review

Start the full stack from the repository root:

```bash
docker compose up --build
```

Open:

- Frontend: http://localhost:5173
- Backend API: http://localhost:8001
- Swagger: http://localhost:8001/docs

Optional: run the Postman/Newman collection from `archa_postman_collection.fixed.json` to validate API behaviour.

## Key decisions / trade-offs

- DB schema is created on startup (no migrations yet) — acceptable for the exercise, but not for production.
- No pagination/filtering; reasonable for the task scope, but will not scale for large datasets.
- Tests are selective rather than exhaustive to keep focus on core behaviour and error cases.
- Frontend uses Vite dev server and proxies `/api/*` to the backend:
  - in Docker Compose the proxy targets `http://backend:8000` over the internal network
  - on the host machine the API is exposed as `http://localhost:8001`

## Observability (logging & monitoring)

- I treat observability as a first-class concern for a growing/high-load service:
  - Structured logging (JSON), consistent log fields, and clear log levels.
  - Correlation IDs propagated through the request lifecycle (and to the frontend where applicable) to make cross-service debugging predictable.
  - Centralised log aggregation: hands-on experience with Grafana + Loki for high-volume log ingestion and fast querying (Promtail/Fluent Bit agents, dashboards, and alerting).
  - Metrics (e.g., Prometheus) for request rates, latency percentiles, error rates, DB timings, and resource utilisation.
  - Distributed tracing (OpenTelemetry + Tempo/Jaeger) as the next step once the system becomes multi-service or performance-sensitive.
  - Alerting via Grafana (SLO-style alerts where possible) to reduce noise and focus on impact.

## Next steps (if we continued)

### Product & API

- Add pagination, filtering, and search (plus stable ordering) for large datasets.
- Add bulk operations where useful (e.g., bulk import codes, bulk deactivate).
- Add explicit API versioning and expand OpenAPI docs (examples, error schema, conventions).

### Data & consistency

- Introduce migrations (Alembic) and move to Postgres.
- Add appropriate indexes and constraints for common queries at scale.
- Consider optimistic concurrency control (ETags/version column) to prevent accidental overwrites.
- Define audit requirements early (soft-delete vs hard-delete; immutable audit trail where needed).

### Architecture & scalability

- Formalise boundaries (modules) and keep domain rules in the service/use-case layer; keep routers thin.
- If the domain grows: split into bounded contexts and move towards a hexagonal/clean architecture consistently across modules.
- Add background processing for heavy tasks and consider an event-driven approach (outbox pattern) when integrations appear.
- Add caching where it makes sense with explicit invalidation rules.

### Security & governance

- Add authentication (SSO/OIDC) and RBAC.
- Add audit logging for critical changes (who/when/what), especially if deactivation/activation affects business workflows.
- Add rate limiting and request validation hardening for production exposure.

### Engineering quality

- Improve test depth (edge cases, concurrency scenarios, contract tests).
- Add CI checks: linting, type checking, tests, and basic security scanning.
- Improve developer UX: `.env` templates, make targets, and clear runbooks for local + CI.

## Questions / risks

- Do we expect codes to be unique globally or only within category? (Currently within category, matching the brief.)
- Any requirements for soft-delete vs hard-delete and auditability?
- Expected data size / load profile (will drive pagination strategy, indexes, and observability priorities).
