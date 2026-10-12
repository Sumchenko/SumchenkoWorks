The project's working plan: the goal, environment constraints, stages and what was verified at each. It is kept in the repository alongside the code and updated after every significant step.

## Goal

Employers receive links to my pet projects. A service is needed that continuously checks the projects are **up and fully working** and reports an outage immediately — before an employer opens a broken link.

The end result should have:

- an "all green / something is down" overview — in Grafana and in a simple web UI;
- adding, removing and disabling projects without a rebuild;
- charts: current status, uptime, response time, outage history, errors;
- Telegram alerts on outage and recovery;
- 24/7 operation on the VPS.

## Environment constraints

| What | Consequence for the requirements |
| --- | --- |
| The checker will live on the same VPS as the projects | If the VPS goes down, the checker goes down with them and warns nobody — external monitoring of the checker itself is mandatory |
| One project uses free Supabase, which pauses after ~7 days without requests | Regular checks must hit the database; the Supabase REST API needs an `apikey` header — targets have their own headers |
| Future projects — on free hosting with a 30–60 s cold start | A configurable per-target timeout and checks more frequent than the hosting's sleep |
| The projects have no `/health` endpoints yet | Check the home page and a keyword on it |

## Stages

| Stage | Contents | Status |
| --- | --- | --- |
| 0. Preparation | Audit of the first version — 10 issues; the plan; the owner's answers | Done |
| 1. Core | Up/down logic (2xx = UP), one timeout per check, draining the body, own migrations, graceful shutdown, pgx, slog, tests | Done |
| 2. Targets in the DB | A `targets` table, own interval, timeout and code, keyword, headers, picking up changes without a restart | Done |
| 3. UI and API | Web UI, JSON API, validation, immediate application of changes, Basic Auth, CSRF protection, `/healthz` | Done |
| 4. Grafana as code | Datasource and dashboard from the repository, a read-only user, panels for uptime, response time, errors, SSL expiry | Ahead |
| 5. Alerts | DOWN after N consecutive failures, RECOVERED on recovery, no spam; SSL expiry | Ahead |
| 6. Quality | Tests for the processor and API; CI with `go vet`, `-race`, a linter and an image build | Ahead |
| 7. Production | Secrets in `.env`, a non-root container, brute-force protection, deployment behind Caddy with HTTPS, old data cleanup and backups, external monitoring of the checker | Ahead |

## How each stage was verified

- **Stage 1.** `go vet`, `go test -race` across all packages; storage integration tests on PostgreSQL 15 — on a clean database and on a first-version database with old data; running in Docker and `docker stop` with exit code 0. Keep-alive works: GitHub response time 916 → 189 ms from the second check.
- **Stage 2.** Scheduler tests 30 times in a row without flakes; old history carried over; an end-to-end run in Docker: adding, disabling and changing targets is picked up within 3 s, and the keyword tells a working page from a broken one.
- **Stage 3.** Web-layer tests on a fake store: auth, CSRF, forms, API, validation; an end-to-end run: `/healthz` 200 without a password, UI 401 without a password, API create 201, a form with an error 422, a cross-site POST 403, container status healthy.

## Known issues

1. The Grafana dashboard exists only inside the container and is broken by column renames — rebuilt in stage 4.
2. Passwords are hard-coded in compose, Postgres is exposed, images are `:latest`, the container runs as root — stage 7.
3. No cleanup of old checks — stage 7.
4. CI lacks `vet`, `-race` and a linter — stage 6.
