Decisions are recorded in the log alongside the plan and revisited when requirements change. The main ones, with reasons, are below.

## Storage

**pgx/v5 instead of lib/pq.** lib/pq is in maintenance mode; pgxpool handles NULLs and contexts properly.

**Own migrations on embed instead of goose or golang-migrate.** About 100 lines with no extra dependencies; migrations live in the binary and run on start — each in its own transaction, recorded in `schema_migrations`, under an advisory lock. The first migration is a copy of the old schema with `IF NOT EXISTS`, so a database created by the first version migrated without data loss; this was verified on a database with old data. An applied migration is never changed — only new ones are added.

**NULL means "use the default".** Empty target settings are stored as NULL rather than an empty string or 0, so the default can be changed in config and applies to every target.

**The URL is stored with every check.** The history shows what address was checked at the time, even if the target changed later.

**ON DELETE CASCADE.** Deleting a target deletes its history. To keep the history, the target is disabled instead.

## Checking

**UP means the expected code after redirects plus the keyword.** A broken app often returns 200 with an error page or a hosting stub, so the response code is necessary but not sufficient.

**Response time runs until the body is read (up to 1 MB), not until the headers.** It is closer to what a user sees. The body is always drained so keep-alive works.

**GET only.** The method is not configurable: the keyword needs the response body; anything else is YAGNI.

## Scheduler

**A goroutine per target and a semaphore instead of a worker pool.** Checks run sequentially inside the goroutine, so a target is never checked in parallel with itself; a semaphore sets the overall limit. Fewer channels, a simpler shutdown, and one target is easy to restart.

**The target list is re-read, not listened to.** Every 10 s and right after an API change, instead of LISTEN/NOTIFY: simpler, and survives a database reconnect. Reload requests collapse into one.

**Failed checks interrupted by a shutdown are not saved.** Otherwise every deploy would produce false outages. The processor ignores the context and writes results until the channel closes, so nothing is lost on shutdown.

## UI and access

**html/template without JS frameworks.** One binary, templates embedded, no frontend build. The only JS is a delete confirmation.

**Basic Auth rather than login sessions.** There is one user — the owner; Caddy will provide HTTPS. The password is compared via SHA-256 in constant time.

**Mandatory CSRF protection.** Browsers attach Basic Auth to requests from other sites too, so forms and the API are guarded by `http.CrossOriginProtection` from Go 1.25.

**One server for the UI and API** under one authentication; `/healthz` is outside it, for external monitoring.

**Target headers are plain text.** So only public keys (the Supabase anon key) go there, never service_role.
