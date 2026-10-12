The spec for the bot's core function: an employee's message becomes one or more task cards. It describes what the MVP implements; mismatches found later are in artifact NOTE-01. The bot works in Russian, so example messages are translated.

## 1. Context

The team runs large events — conferences and festivals for tens of thousands of attendees. Tasks are set on the fly in chats, often as voice messages: "Marina, a post about the headliner by Friday", "order cupcakes by tomorrow". There is a tracker, but nobody has time to copy messages into it by hand.

**Goal.** An employee sets a task in one message, and a card with a clear title, deadline, priority, assignee and category appears in the tracker.

**Scope.** The bot creates tasks. Status changes, comments and closing tasks happen in Notion.

## 2. User stories

**US-1.** As an employee, I want to set a task by text or voice, so that I do not fill in a card in the tracker.

| # | Given | When | Then |
| --- | --- | --- | --- |
| 1 | I am whitelisted | I write "Marina, make a post about the headliner by Friday, it's important" | A draft: title, description, deadline — the date of the coming Friday, priority "high", assignee "Marina", category "Content" |
| 2 | — | I send a voice message with the same text | The bot replies "Recognised: «…»" and shows the same draft |
| 3 (negative) | I am not whitelisted | I write to the bot | "Access to this bot is restricted" |
| 4 (negative) | Speech recognition or the LLM did not answer | I write to the bot | A clear error message; the bot keeps working |

**US-2.** As an employee, I want to list several items in one message, so that each becomes a separate task.

| # | Given | When | Then |
| --- | --- | --- | --- |
| 1 | — | "Order cupcakes by tomorrow, and also tell Katya to finish the announcement by Friday" | Two drafts in turn, "1/2" and "2/2", each with its own deadline and assignee |
| 2 | — | "Meeting on Thursday at 14:00… no, let's do Friday morning" | One task with the deadline "Friday, 09:00" |

**US-3.** As an employee, I want to review and edit the draft, so that a model mistake does not reach the tracker.

| # | Given | When | Then |
| --- | --- | --- | --- |
| 1 | A draft is shown | I tap "Edit" → "Deadline" and write "tomorrow by 18:00" | The deadline is recalculated from the original message time; the draft is updated |
| 2 | A draft is shown | "Edit" → "Assignee" and I write "-" | The assignee is removed |
| 3 | A draft is shown | I tap "Cancel" | No task is created; the draft is marked "Task cancelled" |

**US-4.** As an assignee, I want to be notified about a task assigned to me.

| # | Given | When | Then |
| --- | --- | --- | --- |
| 1 | Katya has written to the bot at least once | A task for "Katya" is confirmed | Katya gets "You have a new task" with the card |
| 2 | Katya has never written to the bot | The task is confirmed | The author sees "Katya has not written to this bot yet — no notification sent" |
| 3 | The task is for the author | The task is confirmed | No notification is sent |

## 3. Main flow

1. The employee sends a text or voice message.
2. The bot checks the user is whitelisted and remembers them for future notifications.
3. A voice message is transcribed by Whisper; the bot shows the recognised text.
4. The LLM returns JSON with a list of tasks; the answer is validated against TaskSchema.
5. For each task the deadline is converted to a date relative to the message time.
6. The bot shows the first draft with Confirm, Edit and Cancel buttons.
7. After confirmation a Notion card is created with status Not started.
8. The assignee is notified; the author sees the final card with a link.
9. If there are several tasks, the bot shows the next draft.

## 4. Exceptions

| # | Situation | Reaction |
| --- | --- | --- |
| E1 | The user is not whitelisted | Access denied; the message is not processed |
| E2 | The voice message could not be downloaded or transcribed | "Could not recognise the voice message" |
| E3 | The LLM returned invalid JSON | One retry with a clarification; a second failure — "The AI service could not parse the message" |
| E4 | Timeout or model API error | A clear message; no draft is created |
| E5 | The deadline could not be turned into a date | The card keeps the original phrase — better to show people what they wrote |
| E6 | Notion is not configured or unavailable | The task is saved to SQLite and the author sees "saved locally (id #N)"; it is sent later |
| E7 | The assignee cannot be messaged (blocked the bot) | The task is created; the author sees the notification failed |

## 5. Task fields

| Field | Req. | Values | Extraction rule |
| --- | --- | --- | --- |
| Title | yes | up to 80 characters | Verb + essence, no filler |
| Description | yes | text | A coherent description with the details of this task only |
| Deadline | no | `YYYY-MM-DD`, `YYYY-MM-DDTHH:MM` or a phrase | The model returns the deadline phrase, code calculates the date (DOC-01) |
| Priority | yes | low, medium, high, urgent | By tone: "on fire", "ASAP" → urgent; "if you have time" → low; medium by default |
| Assignee | no | a name or `@username` | Only if someone is named; "remind me" — empty |
| Category | yes | Marketing, Procurement, Content, Technical, Logistics, General | The closest in meaning |
| Status | yes | Not started, In progress, Done | Always Not started for a new task; the kanban groups by it |

## 6. Non-functional requirements

- **Access.** Only whitelisted Telegram user IDs; the list lives in settings and changes require a restart.
- **Reliability.** A Groq or Notion error does not crash the bot; a task is not lost when Notion fails.
- **Verifiability.** The model's answer is validated by a Pydantic schema; dates are calculated by deterministic code.
- **Easy start.** One `uvicorn` process with no public address — the bot uses long polling.
