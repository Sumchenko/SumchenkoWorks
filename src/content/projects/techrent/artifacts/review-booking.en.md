Mismatches between the requirements of case SRS-01 and the implementation, found during the code review and in the pilot customer's feedback. Each finding has the issue, a scenario, a proposal and a status. Finding codes keep the original Russian numbering (З = finding).

| # | Finding | Severity | Status |
| --- | --- | --- | --- |
| З-1 | Double booking under concurrent requests | High | Fixed |
| З-2 | Availability checks bypassed with another date format | High | Fixed |
| З-11 | The order form shows only part of the fleet (pilot feedback) | High | Fixed |
| З-3 | Order numbers can repeat | Medium | Fixed |
| З-4 | Edit and cancel permissions are not checked by the server | Medium | Open |
| З-5 | The order total is not validated by the server | Medium | Open |
| З-6 | Payment status is not recalculated when the total changes | Medium | Open |
| З-7 | An order cannot be edited once its equipment breaks | Medium | Open |
| З-8 | Missing equipment returns 500 instead of a clear error | Low | Open |
| З-9 | The responsible manager is never filled in | Low | Open |
| З-10 | Cancelling without confirmation, and cancelling completed orders | Low | Open |

## З-1. Double booking under concurrent requests

**Issue.** The overlap check (`SELECT`) and the save (`INSERT`) were two separate queries with no transaction, and the database had no constraint.

**Scenario.** Two managers book the same crane for 10–12 October almost simultaneously. Both checks say "free" because the other order is not written yet. Both orders are saved — the crane is promised to two customers.

**Proposal.** An exclusion constraint `EXCLUDE USING gist (equipment_id WITH =, daterange(start_date, end_date, '[]') WITH &&) WHERE (status = 'planned')`. Without the extension — a transaction with `SELECT … FROM equipment WHERE id = $1 FOR UPDATE` before the check.

**Fixed, both options applied.** Creating and updating an order run in one transaction: lock the equipment row → checks → write → `COMMIT`. The database safeguard is a migration with `EXCLUDE`; a violation is returned as 409. Verified: 10 concurrent requests for the same equipment and dates give one 201 and nine 409s. The same lock also closed the "order ↔ moving equipment into maintenance" race.

## З-2. Availability checks bypassed with another date format

**Issue.** A date parsing error was ignored. A date with time (`2026-10-10T00:00:00Z`) became a zero date, the checks found nothing, and PostgreSQL still stored the string as a real date.

**Scenario.** An integration or a manual API call sends a date with time — an order on taken equipment is created with 201. Not reproducible through the UI: the date field always sends `YYYY-MM-DD`.

**Fixed.** Both dates are parsed strictly before any checks; a date with time, the `DD.MM.YYYY` format and a non-existent date (`2026-02-30`) return 400 `invalid date format (YYYY-MM-DD)`. A unit test was added.

## З-11. The order form shows only part of the fleet

**Source.** Feedback from the pilot customer with 24 machines, confirmed in the code.

**Issue.** The form asked for 200 records, and the server silently replaced anything above 100 with 20. The list showed the 20 newest machines — older equipment could not be booked via "New order". It did not show up in development: the test data had 18 machines. Side effect: booking from the calendar for a machine outside the first 20 left the rates empty and the total at 0.

**Fixed.**

- One pagination check for every list: `per_page` outside `1..100` is an explicit 400 instead of a silent substitution.
- Broken equipment is filtered on the server (`exclude_status=broken`), not in the form's results.
- Equipment and customer are chosen in a field with server-side search from 2 characters, with a hint "Showing 20 of N — refine the query".
- When booking from the calendar, the equipment is loaded by id, so rates are filled in regardless of its position in the list.
- The same problem was fixed in the site and payment forms.

## З-3. Order numbers can repeat

**Issue.** The number was `COUNT(*) + 1` over the year's orders.

**Scenario.** The year has orders 001–003; the administrator deletes 002. The next number is 003 again — a uniqueness violation, 500. No order can be created until another one is deleted. The same happens under concurrent creation.

**Fixed.** A counter table `order_counters (year, last_value)`; the number comes from an atomic upsert inside the order transaction. Not `MAX + 1` — it reissues the number of a deleted last order. Not a `SEQUENCE` — it leaves gaps on failure. The counter rolls back with the transaction and aligns with the highest existing number if orders were inserted around it. Verified: 20 concurrent creations give 20 unique consecutive numbers.

## З-4. Edit and cancel permissions are not checked by the server

**Issue.** Staff settings have "Edit" and "Cancel" permissions for orders. `cancel` is enforced only by the UI (the button is hidden), `edit` nowhere. Any manager can change or cancel any order through the API. Hiding menu sections is UI-only as well.

**Proposal.** Check `orders.cancel` on the cancel route. For `orders.edit`, decide with the business: enforce it on the server or remove the checkbox so as not to mislead the administrator.

## З-5. The order total is not validated by the server

**Issue.** The server stores the total as sent and does not reconcile it with the rate and days. A negative total is stopped only by a database constraint — the user gets 500 instead of 400. A manual discount cannot be told apart from a typo.

**Proposal.** The server calculates the expected total itself and stores a discount as a separate field with a reason; a negative total is rejected with 400.

## З-6. Payment status is not recalculated when the total changes

**Scenario.** A 45,000 ₽ order is fully paid. The manager extends the rental, the total becomes 60,000 ₽, but the status stays "paid". The 15,000 ₽ debt is visible neither in the order nor in the financial summary. The reverse case: the total drops below the amount paid.

**Proposal.** Recalculate the payment status in the same transaction as the order update. Reducing below the amount paid — forbid (422) or require a refund.

## З-7. An order cannot be edited once its equipment breaks

**Scenario.** The equipment is marked broken. The manager wants to add "customer notified" to the notes and gets 422, although neither the equipment nor the dates changed.

**Proposal.** Check availability only when the equipment or dates change, and only for non-cancelled orders.

## З-8. Missing equipment returns 500

**Issue.** If the equipment was deleted while the form was open, the manager sees "Save failed". A malformed UUID in the path also returns 500.

**Proposal.** 422 `equipment not found`; 400 for a malformed UUID.

## З-9. The responsible manager is never filled in

**Issue.** The form does not send `manager_id` and the server does not take it from the token. Who created an order is visible only in the audit log, which only the administrator can see.

**Proposal.** Set `manager_id` from the token when creating an order.

## З-10. Cancelling without confirmation, and cancelling completed orders

**Issue.** An order is cancelled with a single click and cannot be restored. The server also allows cancelling a completed order — the UI hides the button, the API does not forbid it.

**Proposal.** A dialog "Cancel order ТР-…? The equipment will be released"; on the server — 422 for a completed order.

## Pilot customer feedback

| # | What the customer said | Analysis | Where it is reflected |
| --- | --- | --- | --- |
| F-1 | "We have 24 machines, the whole list does not fit when creating an order. We need search" | Not just UX but a defect: equipment beyond 20 is not available in the form at all | З-11, US-2 criterion 8, ticket requirement 9 |
| F-2 | "I couldn't find how to extend the list of equipment types" | Categories are hard-coded in the UI (10 values), although the database accepts any string | Options below — for the catalogue backlog |

**Options for F-2**

| Option | Pros | Cons |
| --- | --- | --- |
| A. A category reference table with an admin screen | Consistent spelling, renaming applies to all equipment at once | Data migration, a new screen |
| B. Free input with suggestions from existing categories | Minimal work | Duplicates with different spellings: "Crane" and "Cranes" |

Recommendation — option A: there are few categories, they rarely change, and consistent spelling matters for filters and future fleet-utilisation analytics by equipment type.

## Business questions

Not bugs but rules to confirm with the customer.

| # | Question | Current behaviour |
| --- | --- | --- |
| Q-1 | Can equipment be returned by one customer and handed to another on the same day? | No: dates are inclusive, an order until 12.10 and one from 12.10 conflict |
| Q-2 | Should one machine be rentable to two customers on the same day by the hour? | No: availability is counted in days, even for hourly orders |
| Q-3 | Should customer and equipment be mandatory in an order? | No: an order can be saved with dates only, and then no availability checks run |
| Q-4 | Should the equipment status "Rented" be set automatically when an order becomes active? | It is not: the catalogue and the calendar may disagree |
