An end-to-end case for one feature: from the user's need to the development ticket. The artifacts follow the order in which an analyst produces them, each building on the previous one. What the acceptance review found is in a separate artifact, NOTE-01.

## 1. Context

**What it is.** Booking is the core operation of the system: a manager assigns a piece of equipment to a customer for a period and gets an order with a number and a calculated price.

**What problem it solves.** With a spreadsheet it is easy to give one machine to two customers for the same dates or rent out one that is under repair. People find out when the driver cannot leave. The feature moves the check to the moment of booking: the system will not save an order if the equipment is broken, under maintenance or already taken. It calculates the price itself from the equipment rates.

**Scope.** Viewing availability, creating, changing and cancelling an order. Payment, deleting orders and printing documents are out of scope.

**Roles.** The system is internal: customers do not log in; the manager takes requests by phone or email.

| Role | Can do |
| --- | --- |
| Administrator | Everything, including staff and the audit log |
| Manager | Creates orders and records payments. Sees the modules the administrator opened; edits, deletes and cancels only where `edit`, `delete`, `cancel` were granted |

## 2. User stories

### US-1. Viewing availability

As a **manager**, I want to **see the whole fleet's availability for a month**, so that **I can find free equipment for a request within a minute**.

| # | Given | When | Then |
| --- | --- | --- | --- |
| 1 | There are open orders in October | The manager opens the October calendar | Each machine is a row, orders are bars with number and customer, coloured by status |
| 2 | An excavator has maintenance on 10–15 October | The manager opens the calendar | Maintenance is a yellow bar under the orders |
| 3 | Equipment is `broken` | The manager opens the calendar | It is not in the calendar |
| 4 | An order is cancelled | The manager opens the calendar | No bar; the dates are free |
| 5 (negative) | — | A request without `from` or `to` | 400 `from and to query params are required` |

### US-2. Booking

As a **manager**, I want to **create an order for the chosen equipment and dates**, so that **the equipment is assigned to the customer and the price is calculated without manual maths**.

| # | Given | When | Then |
| --- | --- | --- | --- |
| 1 | The excavator is free on 10–12 October | The manager saves the order | 201, number like `ТР-2026-015`, status Planned, payment `unpaid` |
| 2 | Rate 15,000 ₽/day | 10–12 October selected | 15,000 × 3 = 45,000 ₽ (both dates inclusive) |
| 3 | Rate 2,500 ₽/hour | One date and 8 hours | The form switches to hourly mode, 2,500 × 8 = 20,000 ₽ |
| 4 (negative) | The excavator is booked 11–14 October | An order for 10–12 October | 409 `equipment already booked for this period` |
| 5 (negative) | Maintenance on 10–15 October | An order for 14–20 October | 409 `equipment is in maintenance for this period` |
| 6 (negative) | Equipment is `broken` | The order reaches the server | 422 `broken equipment cannot be added to an order` |
| 7 (negative) | — | End date before start date | 400 `end_date must be >= start_date` |
| 8 | The fleet has 24 machines | The manager types part of a name, brand or model | All working equipment is available; search narrows the list |

### US-3. Changing a booking

As a **manager**, I want to **move the dates or swap the equipment**, so that **new arrangements are reflected without creating overlaps**.

| # | Given | When | Then |
| --- | --- | --- | --- |
| 1 | An order for 10–12 October, no others | Shift to 11–13 October | 200: overlapping itself is not a conflict |
| 2 (negative) | Another order on 13–14 October | Extend to 13 October | 409, changes not saved |
| 3 (negative) | The order was deleted by another user | Save | 404 `order not found` |

### US-4. Cancelling a booking

As an **administrator**, I want to **cancel an order**, so that **the equipment is released and the order history is kept**.

| # | Given | When | Then |
| --- | --- | --- | --- |
| 1 | The order is Planned or Active | "Cancel order" | Status `cancelled`; a new order for these dates goes through |
| 2 | The manager lacks `orders.cancel` | Opens the order | No cancel button |
| 3 | The order is Completed | Opens the order | No cancel button |
| 4 (negative) | — | `PATCH /status` with anything but `cancelled` | 400 `invalid status value` |

**Why.** Cancelling is a separate story, not deletion: deletion wipes the order together with its payments, cancelling only releases the equipment. Criteria with concrete numbers (15,000 × 3 = 45,000) pin down the "dates are inclusive" rule — otherwise the developer and the tester count days differently.

## 3. Use cases

### UC-01. Book equipment

| Field | Value |
| --- | --- |
| Actor | Manager. The customer is a stakeholder who does not use the system |
| Goal | Assign equipment to a customer for a period and fix the price |
| Trigger | A customer sends a rental request |
| Preconditions | The manager is signed in; the catalogue has equipment |
| Success | A `planned` order with a unique number, `unpaid`; the equipment is taken for those dates; `CREATE` in the audit log |
| Failure | No order, no data changed, the manager sees the reason |

**Main flow**

1. The manager opens the availability calendar and picks a month.
2. The system shows equipment (except `broken`) with orders and maintenance.
3. The manager marks the start and end dates on a free stretch of a machine's row and clicks "Create".
4. The system opens the form with the equipment and dates, fills in the rates and calculates `daily_rate × days`.
5. The manager picks the customer and site, enters the driver and their phone, clicks "Save".
6. The system checks the dates: present, in `YYYY-MM-DD` format, end not before start.
7. The system locks the equipment row until the end of the transaction and checks in order: not broken → not under maintenance on those dates → no other active order overlaps.
8. The system issues the number `ТР-<year>-<NNN>`, saves the order and commits.
9. The system writes `CREATE` to the audit log.
10. The order appears in the list as Planned (or Active if the rental starts today). The manager tells the customer the number.

**Alternative flows**

| # | Condition | What changes |
| --- | --- | --- |
| A1 | The order is created from the Orders page | Steps 1–3 become a "New order" button; equipment is chosen in a search field by name, brand and model, broken equipment is hidden |
| A2 | One-day rental | Hourly mode: total = `hourly_rate × hours` |
| A3 | A discount was agreed | The manager edits the total by hand; the system keeps it |
| A4 | No equipment in the order | Step 7 checks are skipped (business question Q-3) |
| A5 | Backdated booking | The order is created; its status is Active or Completed at once — it is derived from the dates |

**Exceptions.** Checks run strictly in this order; the manager sees the first one that fires.

| # | Situation | Reaction | Code |
| --- | --- | --- | --- |
| E1 | A date is missing | No order (the UI makes the fields required — API only) | 400 |
| E2 | A date is not `YYYY-MM-DD` or does not exist | No order | 400 `invalid date format` |
| E3 | End before start | No order | 400 |
| E4 | Equipment is broken | "Broken equipment cannot be added to an order" | 422 |
| E5 | Dates overlap maintenance | "The equipment is under maintenance in this period" | 409 |
| E6 | Equipment is booked on overlapping dates (inclusive bounds) | "The equipment is already booked for these dates" | 409 |
| E7 | Two managers book the same equipment at once | The first gets 201; the second waits for the lock and gets 409 | 201 / 409 |
| E8 | The access token expired (1 hour) | The frontend silently refreshes and retries; if the refresh token (7 days) expired too — back to sign-in | 401 |
| E9 | Database failure | "Save failed", details in the server log | 500 |
| E10 | Writing the audit event failed | The order **stays created**; the error goes to the log | 201 |

### UC-02. Change or cancel a booking

**Change.** The manager opens the order, clicks "Edit", changes the dates or the equipment. The system runs the same checks as UC-01 but **excludes the current order** from the conflict search. It saves and writes `UPDATE` with before and after data. Order not found — 404.

**Cancel.** The "Cancel order" button is shown to the administrator and to managers with `orders.cancel`, only for Planned and Active orders. The system sets `cancelled`; cancelled orders take no part in conflict checks. Any other status in the request — 400.

### Traceability

| User story | Covered by |
| --- | --- |
| US-1 | UC-01, steps 1–2 |
| US-2 | UC-01: main flow, A1–A3, E1–E7 |
| US-3 | UC-02, change |
| US-4 | UC-02, cancel |

**Why.** Broken first, then maintenance, then overlap. A breakdown does not depend on dates — changing them is pointless, another machine is needed — so it is a 422 and is checked first. Maintenance and overlap can be avoided by changing dates — those are 409. An audit failure does not cancel the order: losing a real booking over a supporting feature is worse than losing one audit record.

## 4. Process

The full model is artifact BPMN-01; a simplified flow is on the Architecture tab. The customer is a separate pool: they are neither an employee nor a user of the system, so they exchange only messages with the process — the request and the confirmation. Unavailable equipment and a save failure are boundary error events on the automated tasks.

**Why.** After an error the process returns to the manager instead of ending: a system refusal is not a refusal to the customer. The manager picks other dates or equipment while the customer is still on the line.

## 5. API

Every endpoint requires `Authorization: Bearer <access_token>`. Errors are `{"error": "<text>"}`. The full specification is artifact API-01.

| Method | Path | Purpose | Codes |
| --- | --- | --- | --- |
| GET | `/api/v1/calendar?from&to` | Availability for a period | 200, 400, 401 |
| POST | `/api/v1/orders` | Create an order | 201, 400, 401, 409, 422 |
| GET | `/api/v1/orders/{id}` | Order details | 200, 401, 404 |
| PUT | `/api/v1/orders/{id}` | Change an order | 200, 400, 401, 404, 409, 422 |
| PATCH | `/api/v1/orders/{id}/status` | Cancel an order | 200, 400, 401, 403, 404 |

Format notes:

- Dates in requests are `YYYY-MM-DD`; responses return date-time `2026-10-10T00:00:00Z`.
- `status` in responses is computed: `planned`, `active`, `completed`, `cancelled`. The database holds only `planned` or `cancelled`.
- `client_name`, `equipment_name` and other names are read-only; the server fills them in from the reference tables.

**Why.** 409 Conflict means the request clashes with other data and is fixed by picking other dates. 422 means the request is well-formed but breaks a rule that dates cannot fix. Different codes let the UI give different hints. Cancelling is a separate `PATCH /status`, not a field in `PUT`: it has its own permission and its own audit record.

## 6. Data model

Tables: `orders`, `equipment`, `clients`, `objects`, `users`, `audit_log` and `order_counters`. Fields and constraints are in data dictionary DD-01; the diagram is ERD-02.

**Why.**

- **Only `planned` and `cancelled` are stored.** Active and Completed depend on today's date. Storing them means updating rows with a nightly job and drifting from reality when it fails.
- **Order foreign keys use `ON DELETE SET NULL`.** Deleting a customer or a machine does not wipe the order and its financial history.
- **Rates are copied into the order.** Changing equipment rates does not alter existing order totals.

## 7. Development ticket

**TR-6. Booking equipment: an order with availability checks**

| Field | Value |
| --- | --- |
| Type | Story |
| Priority | High |
| Components | backend (orders, equipment), frontend (order form, list, calendar) |
| Depends on | TR-3 (JWT and roles), TR-4 (equipment catalogue), TR-5 (customers and sites) |

**Goal.** Managers book rentals in the system instead of a spreadsheet. The system prevents double booking and renting out broken equipment, and calculates prices from the rates.

**Implementation requirements**

1. The stored status is `planned` or `cancelled`; the effective one is computed: before `start_date` — `planned`, between the dates inclusive — `active`, after `end_date` — `completed`.
2. The server builds the number `ТР-<year>-<NNN>`; numbers never repeat.
3. Checks on create and update, strictly in order: `broken` → 422; maintenance overlap → 409; overlap with an active order for the same equipment → 409. Dates are inclusive; on update the current order is excluded.
4. The check and the write are atomic: under concurrent requests only one order gets the equipment for overlapping dates.
5. Total: several days — `daily_rate × days`, one day — `hourly_rate × hours`; rates come from the equipment and the total can be edited by hand.
6. Cancelling is `PATCH /orders/{id}/status` with `cancelled`; allowed for the administrator and managers with `orders.cancel`, otherwise 403.
7. The calendar hides `broken` equipment and cancelled orders.
8. Create, change and cancel are logged with before and after data.
9. The form offers all working equipment regardless of fleet size, with search by name, brand and model.

**Non-functional requirements**

| # | Requirement | How it is met |
| --- | --- | --- |
| 1 | Authorised users only | JWT middleware, 1-hour access token |
| 2 | Database-level integrity | `CHECK (end_date >= start_date)`, `CHECK (total_amount >= 0)`, `UNIQUE (number)`, foreign keys, `EXCLUDE` against overlaps |
| 3 | SQL injection protection | All queries are parameterised |
| 4 | Audit | User, IP, before and after data; an audit failure does not roll back the operation |
| 5 | Logging | Every request with a Request ID; panics are caught and return 500 |

**Test checklist**

- An order on free dates is created; the number is unique and sequential
- Totals: 3 days × 15,000 = 45,000; 1 day × 8 h × 2,500 = 20,000; a manual edit is kept
- Overlap with another order — 409: full, partial, nested, boundary (end = start)
- An order on a cancelled order's dates is created without conflict
- Maintenance overlap — 409; `broken` equipment — 422 and absent from the form and the calendar
- More than 20 machines and customers — all available in the form, search works
- End before start, empty dates, a date with time — 400
- Changing within its own dates — 200; a missing order — 404
- Cancelling without `orders.cancel` via the API — 403
- Two concurrent overlapping requests — one 201 and one 409
- The audit log has `CREATE` and `UPDATE` with the right user and data
- Active or Completed status changes by itself when the date changes
