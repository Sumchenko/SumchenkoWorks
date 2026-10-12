What I found while reviewing the MVP code for this portfolio. Each finding was checked against the source; each has a scenario, a risk and a proposal. Finding codes keep the original Russian numbering (З = finding).

| # | Finding | Severity |
| --- | --- | --- |
| З-1 | A new message during draft review replaces the drafts | High |
| З-2 | Drafts are kept in process memory | Medium |
| З-3 | The Notion deadline is text, not a date | Medium |
| З-4 | Deadlines are calculated in the server's time zone | Medium |
| З-5 | The assignee is matched by exact name | Low |
| З-6 | Resending the outbox can create a duplicate card | Low |

## З-1. A new message replaces the drafts

**Issue.** The text handler fires in any state except field editing. If another message arrives while a draft is pending, the bot parses it and overwrites the task list in the state. The old card stays in the chat with its buttons.

**Scenario.** An employee sent three tasks, reviewed the first and, without waiting, wrote a new task. Drafts 2/3 and 3/3 disappear without warning. If the "Confirm" button on the old card is then tapped, the task from the new message is created, not the one on screen.

**Proposal.** In the review state, do not parse a new message right away but ask: "There are unconfirmed drafts — set them aside and parse the new one?". Pass a draft id in the button callback and check it matches the current one.

## З-2. Drafts are kept in process memory

**Issue.** aiogram states live in memory by default. A restart or crash loses every unconfirmed draft, and buttons on old cards stop working without explanation.

**Proposal.** Keep states in SQLite or Redis; answer a button tap without a state with "This draft has expired — please send the task again".

## З-3. The Notion deadline is text, not a date

**Issue.** The Deadline property in the Notion database is text. Dates and unparsed phrases ("someday") are mixed together, so tasks cannot be sorted by deadline, filtered for overdue ones or shown in a Notion calendar.

**Proposal.** Make Deadline a Date property filled in when the deadline is parsed; keep the original phrase in a separate text field, "Deadline as stated".

## З-4. Deadlines are calculated in the server's time zone

**Issue.** The message time is converted to the time zone of the machine running the bot, and "18:00" is interpreted in it too. Locally that matches Moscow, but on a UTC server "tomorrow by 18:00" becomes 21:00 Moscow time, and "by Friday" near midnight can shift by a day.

**Proposal.** Set the team's time zone in settings (`TEAM_TZ=Europe/Moscow`) and calculate deadlines in it.

## З-5. The assignee is matched by exact name

**Issue.** For notifications the name from the task is compared with the Telegram `first_name` or @username. "Katya" will not match "Ekaterina", and of two employees with the same name the first one found gets the notification.

**Proposal.** An employee directory with name variants; on several matches, ask the author whom to assign.

## З-6. Resending the outbox can create a duplicate

**Issue.** When resending, the bot first creates the Notion page and then marks the task as sent. If the process crashes between the two steps, the task is sent again. Also, the resend runs before confirming each new task, so with a large outbox the user waits.

**Proposal.** Store an idempotency key (the local task id) in a Notion property and check it before creating; resend in a scheduled background job rather than at confirmation time.

## What else is worth doing

- Reload the whitelist without a restart, or keep it in the database.
- Log which model answered and how long processing took — as in Mito.
- A set of reference messages with expected parsing results, to test the prompt after every change.
