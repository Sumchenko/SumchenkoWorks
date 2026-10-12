## Table `timeBlocks` — calendar blocks (device)

Blocks the user added from the plan are written here.

| Field | Type | Required | Constraints | Meaning |
| --- | --- | --- | --- | --- |
| `id` | uuid | yes | Primary key | Block identifier |
| `taskId` | uuid | no | Reference to a task. The task must exist | Which task is planned. Empty — a break or an event |
| `title` | string | if there is no `taskId` | Not empty | Title of a block without a task, e.g. “Lunch” |
| `start` | datetime | yes | — | Block start |
| `end` | datetime | yes | Later than `start` | Block end |
| `kind` | string | yes | `task`, `event`, `break`, `routine` | Block type: task, event, break, routine |
| `origin` | string | yes | `user` or `mentor` | Who created the block: the user or the AI mentor |

Blocks may overlap: a plan is an intention, not a fact.

**Indexes:** `taskId` — find a task's blocks; `start`, `end` — find blocks for a period (e.g. a day).

## Table `tasks` — tasks (device)

The fields the day plan uses.

| Field | Type | Required | Constraints | Meaning |
| --- | --- | --- | --- | --- |
| `id` | uuid | yes | Primary key | Task identifier |
| `title` | string | yes | Not empty | Title |
| `status` | string | yes | `open`, `done`, `cancelled` | Only open tasks (`open`) go into the plan |
| `priority` | int | yes | 0–3, default 0 | Importance: 0 — none, 3 — high |
| `estimateMin` | int | no | Greater than 0 | How many minutes the task takes, by the user's estimate |
| `plannedDate` | date | no | Format `YYYY-MM-DD` | When the user intends to do the task. Set automatically when a block is added |
| `dueDate` | date | no | Format `YYYY-MM-DD` | Deadline. Tasks due soon go into the plan first |

**Indexes:** `plannedDate`, `dueDate` — quickly find tasks for a day and tasks due soon.

## Table `daily` — request limit (mentor server, SQLite)

| Field | Type | Required | Constraints | Meaning |
| --- | --- | --- | --- | --- |
| `key` | text | yes | Primary key together with `day` | Hash of the user's address. The row `*` is the shared counter for everyone |
| `day` | text | yes | Primary key together with `key`, a date | Which day the counter is for |
| `count` | integer | yes | — | How many requests have been made |

Limits: 60 requests per day from one address, 800 per day for everyone. The “10 per minute” limit is kept in the server's memory, not in the table.

## How answer fields become a calendar block

| Field in the server answer | Field in `timeBlocks` |
| --- | --- |
| `taskRef` (e.g. `t1`) | `taskId` — the app substitutes the real task id |
| `title` | `title` |
| `date` + `start` | `start` |
| `date` + `end` | `end` |
| — | `origin` = `mentor` |
| `reason` | Not stored; shown only in the plan |
