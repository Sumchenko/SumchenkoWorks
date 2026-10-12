## 1. Context

Laying tasks out by the hour is work in itself, and that is exactly where people give up on planning. In Mito it can be handed to the AI mentor. It takes deadlines, priorities, time already booked in the calendar and the user's usual rhythm into account, then proposes a schedule for today or tomorrow.

Nothing reaches the calendar without confirmation: the user reviews the proposed plan and picks what to add. The feature works without an account too.

## 2. User stories

**US-1.** As a user who struggles with planning, I want a day plan in one click, so that I do not spend effort arranging tasks.

| Scenario | Given | When | Then |
| --- | --- | --- | --- |
| Positive | There are open tasks and free time | I click “Plan my day” | I see a list of blocks: time, task, why at that time. The calendar is not changed yet |
| Negative | There are no suitable tasks or no free time | I click “Plan my day” | “No free time or suitable tasks — no plan needed.” |
| Negative | AI models are unavailable | I click “Plan my day” | “The mentor is temporarily unavailable. Try again later.” |

**US-2.** As a user, I want to choose which blocks go into the calendar, so that the plan stays mine.

| Scenario | Given | When | Then |
| --- | --- | --- | --- |
| Positive | A plan of 5 blocks is shown | I untick two and click “Add to calendar (3)” | The calendar has 3 new blocks; the tasks get a planned day |
| Negative | A task was deleted while I was reviewing the plan | I click “Add” | The deleted task's block is skipped; the rest are added |

**US-3.** As a user, I want to add a wish (“meeting after 3 pm”), so that the plan fits my day.

| Scenario | Given | When | Then |
| --- | --- | --- | --- |
| Positive | I entered a wish | I click “Plan my day” | The plan takes the wish into account |
| Negative | I made too many requests in a row | I click “Plan my day” | “Request limit reached. Try again in N min.” |

## 3. Use case

| Field | Value |
| --- | --- |
| Name | Plan the day with AI |
| Actor | User (guest or signed in) |
| Precondition | The app has tasks |
| Trigger | The “Plan my day” button |
| Success | The blocks the user picked are added to the calendar |
| Failure | The calendar is unchanged; the user sees the reason |

### Main flow

1. The user picks “Today” or “Tomorrow”, optionally writes a wish and clicks “Plan my day”.
2. The app gathers data: open tasks, a 4-day calendar, statistics for 2 weeks.
3. The app sends the data to the mentor server.
4. The server validates the request and the limit: no more than 10 requests per minute and 60 per day from one address.
5. The server sends the data to an AI model and asks for a plan.
6. The server validates the model's answer: drops blocks with invalid times and tasks the user does not have.
7. The app shows the plan with every block ticked.
8. The user unticks unwanted blocks and clicks “Add to calendar”.
9. The app creates the calendar blocks and sets the tasks' planned day.
10. The app shows “Added to calendar: N”.

### Alternative flows

- **A1. Another option.** At step 7 the user clicks “Another option” — the flow repeats from step 2.
- **A2. The model did not answer.** At step 5 the model returned an error or an invalid answer — the server asks the next model: Groq → Gemini.

### Exceptions

| Code | Situation | Server response | What the user sees |
| --- | --- | --- | --- |
| E1 | Invalid request (e.g. a wish longer than 500 characters) | 400 | “Could not send the request.” |
| E2 | Request limit exceeded | 429 | “Request limit reached. Try again in N min.” |
| E3 | All models unavailable or the server is busy | 503 | “The mentor is temporarily unavailable. Try again later.” The request does not count against the limit |
| E4 | The model proposed a task the user does not have | 200 | That block is not in the plan: the server removed it |
| E5 | A task was deleted while the user reviewed the plan | — | That block is not added; the rest are |

**Why.** The plan is shown first and only then added. A model can be wrong, and the calendar is personal space. An extra click is cheaper than lost trust in the service.

## 4. Process

The full model is artifact BPMN-02; a simplified flow is on the Architecture tab.

**Why.** The server validates the AI model's answer, not the model itself. A model can invent a task or a time, so its answer cannot be trusted without a check.

## 5. API

| Method | Path | What it does | Responses |
| --- | --- | --- | --- |
| POST | `/api/mentor` | Get a day plan | 200 — plan; 400 — invalid request; 429 — limit; 503 — models unavailable or server busy |

There is no authorization: the feature is open to guests. Protection is a per-address request limit.

Request example (shortened):

```json
{
  "mode": "plan",
  "lang": "en",
  "date": "2026-09-29",
  "note": "meeting after 3 pm",
  "context": {
    "now": "2026-09-29T10:05",
    "tasks": [
      { "ref": "t1", "title": "Read chapter 3", "priority": 2, "estimateMin": 60, "dueDate": "2026-09-30" }
    ],
    "blocks": [
      { "ref": "b1", "date": "2026-09-29", "start": "11:00", "end": "12:00", "title": "Call" }
    ]
  }
}
```

Response example:

```json
{
  "summary": "Chapter 3 after the call — it is due tomorrow.",
  "blocks": [
    { "taskRef": "t1", "date": "2026-09-29", "start": "12:15", "end": "13:30", "reason": "due tomorrow" }
  ]
}
```

The model sees tasks under short refs `t1`, `t2`, not their real identifiers. Only the app knows which ref belongs to which task.

## 6. Data model

`TASK` and `TIME_BLOCK` live on the user's device; `DAILY_LIMIT` is a table on the mentor server that counts requests per day. Details are in data dictionary DD-02.

**Why.** The user's address is stored only as a hash — a one-way transformation that cannot be reversed. To enforce a limit it is enough to tell users apart; the address itself would be extra personal data.

## 7. Development task

**MITO-8. Day plan from the AI mentor**

**Goal.** In one click the user gets a day plan and decides what to add to the calendar.

What to build:

1. A “Plan my day” button with a “Today” / “Tomorrow” choice and a wish field.
2. Data for the model: tasks, calendar, 2 weeks of statistics.
3. Mentor server `POST /api/mentor`: request validation, limit, model call, answer validation.
4. If a model does not answer — call the next one.
5. Show the plan with checkboxes and an “Add to calendar” button.
6. Mentor blocks are marked `origin = mentor`.

**Acceptance criteria:** all scenarios from section 2.

Non-functional requirements:

- Security: AI model keys are stored only on the server; user addresses only as hashes.
- Validation: the server rejects invalid requests and removes invalid blocks from the model's answer.
- Logging: the server records which model answered and how long it took.

## 8. Analyst notes

| # | Finding | Risk | Proposal |
| --- | --- | --- | --- |
| 1 | The wish field is unlimited in the UI, while the server accepts at most 500 characters | A long wish produces a vague “Could not send the request” error | Limit the field to 500 characters and show a counter |
| 2 | The rules “no blocks in the past” and “no overlap with existing blocks” exist only in the prompt; the server does not check them | The model may break a rule and such a block reaches the calendar | Add these checks on the server |
| 3 | The limit is per address, not per user | People on one network (office, dorm) share one limit | Count the limit per account for signed-in users |
| 4 | There is no overall timeout | If models answer slowly, the user waits for minutes | Cap the wait, for example at one minute |
