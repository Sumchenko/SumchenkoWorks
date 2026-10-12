The tables involved in booking, in their final state after all migrations. Required: **yes** — `NOT NULL`, **no** — NULL allowed.

## orders

An order is a booking of one piece of equipment for a period for a customer.

| Field | Type | Req. | Constraints | Business meaning |
| --- | --- | --- | --- | --- |
| `id` | UUID | yes | PK | Order identifier |
| `number` | VARCHAR(50) | yes | UNIQUE | Human-readable number: `ТР-2026-015`. Issued by the server from `order_counters` |
| `client_id` | UUID | no | FK → `clients`, `ON DELETE SET NULL` | The renting customer |
| `object_id` | UUID | no | FK → `objects`, `ON DELETE SET NULL` | The construction site the equipment goes to |
| `equipment_id` | UUID | no | FK → `equipment`, `ON DELETE SET NULL` | The booked equipment. If empty, no availability checks run |
| `manager_id` | UUID | no | FK → `users`, `ON DELETE SET NULL` | Responsible manager. Currently never filled in (З-9) |
| `driver_name` | VARCHAR(255) | no | — | Driver's (operator's) name |
| `driver_phone` | VARCHAR(50) | no | — | Driver's phone for the customer |
| `status` | VARCHAR(50) | yes | `planned` or `cancelled`, default `planned` | Active or cancelled. The effective status is computed (see below) |
| `start_date` | DATE | yes | — | First rental day, inclusive |
| `end_date` | DATE | yes | Not before `start_date` | Last rental day, inclusive |
| `daily_rate` | NUMERIC(12,2) | yes | Default 0 | Daily rate at booking time |
| `hourly_rate` | NUMERIC(12,2) | no | ≥ 0 | Hourly rate at booking time |
| `hours` | INTEGER | no | > 0 | Hours for a one-day rental |
| `total_amount` | NUMERIC(12,2) | yes | ≥ 0 | Total, ₽. Calculated by the form; the manager may edit it |
| `paid_amount` | NUMERIC(12,2) | yes | ≥ 0 | Amount paid. Recalculated on every payment operation |
| `payment_status` | VARCHAR(50) | yes | `unpaid`, `partial`, `paid` | Nothing paid / partly / fully |
| `notes` | TEXT | no | — | Notes |
| `created_at`, `updated_at` | TIMESTAMPTZ | yes | Default `NOW()` | Service timestamps |

**Double-booking constraint** `orders_equipment_no_overlap`: two `planned` orders for the same equipment cannot overlap in dates (`EXCLUDE USING gist`, inclusive bounds). Orders without equipment are not constrained.

**History.** The shift rate was replaced by an hourly rate and hours; the `draft`, `active`, `completed` statuses were folded into `planned`.

## order_counters

| Field | Type | Req. | Constraints | Business meaning |
| --- | --- | --- | --- | --- |
| `year` | INT | yes | PK | The year being numbered |
| `last_value` | INT | yes | ≥ 0 | The last issued sequence number |

The number is issued inside the order transaction: `INSERT … ON CONFLICT (year) DO UPDATE SET last_value = GREATEST(last_value + 1, <highest existing> + 1)`. The counter only grows and rolls back together with the order.

## equipment

For booking, the status, maintenance dates and rates matter.

| Field | Type | Req. | Constraints | Business meaning |
| --- | --- | --- | --- | --- |
| `id` | UUID | yes | PK | Identifier |
| `name` | VARCHAR(255) | yes | — | "JCB 3CX backhoe loader" |
| `brand`, `model` | VARCHAR(255) | no | — | Brand and model; search works on these and the name |
| `category` | VARCHAR(100) | no | — | Equipment type, shown in the calendar. The UI offers one of 10 values (F-2) |
| `status` | VARCHAR(50) | yes | `available`, `rented`, `maintenance`, `broken` | `broken` forbids booking (422) and hides the equipment from the calendar |
| `daily_rate` | NUMERIC(12,2) | yes | ≥ 0 | Daily rate, filled into the order form |
| `hourly_rate` | NUMERIC(12,2) | no | ≥ 0 | Hourly rate |
| `maintenance_from` | DATE | no | Required for `maintenance` | Start of scheduled maintenance |
| `maintenance_to` | DATE | no | Not before `maintenance_from` | End of maintenance. An order overlapping it — 409 |

Switching to any status other than `maintenance` clears the maintenance dates. The equipment row is locked (`FOR UPDATE`) both when booking and when moving into maintenance, so these operations on one machine run strictly one after another.

## clients and objects

| Table | Key fields | Business meaning |
| --- | --- | --- |
| `clients` | `type` (`legal` or `individual`), `name`, `contact_person`, `phone`, `email`, `inn` (tax id), addresses | A company or an individual. `name` appears in the order as `client_name`. Phone search ignores formatting: `22-33` finds `+7 (495) 111-22-33` |
| `objects` | `client_id` (FK, `SET NULL`), `name`, `address`, `contact_person`, `phone`, `is_active` | A customer's construction site. The server does not check that the order's site belongs to the order's customer |

## users

| Field | Type | Req. | Business meaning |
| --- | --- | --- | --- |
| `email` | VARCHAR(255), UNIQUE | yes | Login |
| `password_hash` | VARCHAR(255) | yes | bcrypt password hash |
| `full_name` | VARCHAR(255) | yes | Appears in the order as `manager_name` |
| `role` | `admin` or `manager` | yes | Role |
| `permissions` | JSONB | no | Manager permissions per module; for orders `{"orders": {"edit", "delete", "cancel"}}`. Put into the JWT at sign-in |
| `status` | `active` or `pending` | yes | `pending` — invited but no password yet; sign-in is blocked |
| `invite_token`, `invite_expires_at` | VARCHAR(64), TIMESTAMPTZ | no | A one-time invitation valid for 7 days; partial unique index |
| `telegram_chat_id` | BIGINT | no | Reserved for notifications |

## audit_log

| Field | Type | Business meaning |
| --- | --- | --- |
| `user_id`, `user_email` | UUID, VARCHAR | Who acted. The email is kept even if the user is deleted |
| `action` | VARCHAR(50) | `CREATE`, `UPDATE`, `DELETE`. Cancelling an order is an `UPDATE` |
| `entity_type`, `entity_id` | VARCHAR | For this feature — `order` and the order id |
| `old_data`, `new_data` | JSONB | The order before and after. On cancel — `{"status": "<old>"}` and `{"status": "cancelled"}` |
| `ip_address` | VARCHAR(50) | User's IP |
| `created_at` | TIMESTAMPTZ | Event time |

## Computed API fields

| Field | How it is computed |
| --- | --- |
| `status` | `CASE WHEN status = 'cancelled' THEN 'cancelled' WHEN CURRENT_DATE < start_date THEN 'planned' WHEN CURRENT_DATE > end_date THEN 'completed' ELSE 'active' END` |
| `client_name`, `object_name`, `equipment_name`, `manager_name` | Subqueries to the reference tables by foreign key |
| Calendar | Non-cancelled orders overlapping `[from, to]`, grouped by equipment; `broken` equipment excluded |

`CURRENT_DATE` uses the database server's time zone, so Active and Completed switch at midnight server time.

**Overlap rule.** Periods `[A_start, A_end]` and `[B_start, B_end]` overlap if `A_start <= B_end AND A_end >= B_start`. Used by the order conflict check, the maintenance check and the calendar query.

## Indexes

| Index | Fields | Why |
| --- | --- | --- |
| `orders_number_key` | `number`, UNIQUE | Unique numbers |
| `orders_equipment_no_overlap` | `equipment_id`, `daterange(start_date, end_date)`, GiST | Forbids overlaps and speeds up conflict lookups |
| `idx_orders_equipment_id` | `equipment_id` | Orders of a given machine |
| `idx_orders_dates` | `start_date`, `end_date` | Calendar for a period |
| `idx_orders_payment_status` | `payment_status` | Payment filter, debtors |
| `idx_equipment_status` | `status` | The calendar excludes `broken` |
| `idx_audit_log_entity` | `entity_type`, `entity_id` | An order's change history |
| `idx_audit_log_created_at` | `created_at DESC` | The log from newest to oldest |
