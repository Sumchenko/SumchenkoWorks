The project went through 14 steps. Each step started with the "why", then the code and verification commands, and the next one began only after my "done". Decisions were recorded in tables in the repository's `CLAUDE.md` — the main ones are below.

## Stack and infrastructure — steps 1–2

Go 1.24 + Chi + PostgreSQL 16, all in Docker Compose. The pgx/v5 driver with sqlx instead of an ORM: SQL stays under control, and `StructScan` removes manual mapping. Migrations are embedded in the binary via `//go:embed` and run on start. Test data comes from a separate `seed` binary inside the container.

## Authentication and permissions — steps 3 and 13

Stateless JWT: a 1-hour access token and a 7-day refresh token, nothing stored in the database. Manager permissions by module (`equipment`, `clients`, `objects`, `orders`, `payments`) and action (`edit`, `delete`, `cancel`) are stored in JSONB and put into the token at sign-in — no database query per request. The cost: changed permissions apply after the next sign-in. Managers are invited with a link carrying a 32-byte `crypto/rand` token valid for 7 days, and set their own password.

## Layers and dependencies — all steps

handler → service → repository, connected through interfaces. Business rules live only in the service: "broken equipment cannot be booked" is one rule for both create and update. The audit logger is passed to handlers as an interface, which avoids an import cycle. Empty lists in Go are created with `make([]T, 0)`: a `nil` slice becomes `null` in JSON and crashes the UI.

## Pricing — step 6

The shift rate was dropped: a one-day rental is priced by the hour (`hourly_rate × hours`), a multi-day one by inclusive days. Rates are copied into the order so a tariff change does not alter existing totals.

## Payments — step 7

Creating, updating and deleting a payment and recalculating the order's `paid_amount` and `payment_status` happen in one transaction. The "payments + new > order total → 422" check runs before the insert inside the same transaction, so concurrent payments cannot overpay.

## Audit log — step 8

Fire-and-forget: a failure to write the audit record does not roll back the main operation; it is only logged on the server. For updates the "before" snapshot is a separate read — one extra query for a complete diff.

## Calendar — steps 9–10

A Gantt chart in plain CSS (`position: absolute`) with no third-party libraries: full control over the look, highlighting and maintenance periods. Maintenance is a date range on the equipment card; overlap with an order is a 409. Marking equipment as broken does not cancel orders; it shows the affected ones with phone numbers — the decision stays with the manager.

## Order statuses — step 11

The database stores only `planned` and `cancelled`; Active and Completed are computed with `CASE WHEN` in every query. No background jobs and no drift; filters on "virtual" statuses are translated into date conditions.

## Navigation — step 12

State between pages travels in the URL (`?view=`, `?highlight=`, `?month=`) rather than a global store: a link to an order in the calendar can be reopened or shared.

## Booking integrity — acceptance

A `FOR UPDATE` lock on the equipment row inside the order transaction plus `EXCLUDE` in the database (З-1). The lock gives a clear 409 and serialises booking with moving equipment into maintenance — an invariant spanning two tables that `EXCLUDE` cannot express. `EXCLUDE` guards every write path: seed, manual SQL, future code. The service works with an `OrderTx` type and cannot write outside a transaction.

## Order numbers — acceptance

A per-year counter table instead of `COUNT + 1` (З-3). `MAX + 1` reuses the number of a deleted last order, and a `SEQUENCE` is non-transactional and leaves gaps — neither suits contracts and invoices. The counter lock is taken last, after the equipment lock: a single lock order rules out deadlocks.

## Pagination and picking from large lists — acceptance

`per_page` above 100 is an explicit 400 rather than the silent substitution that caused bug З-11. Equipment and customers are picked in a field with server-side search instead of loading the whole reference list, so the form does not depend on fleet size.
