## 1. Context

The user plans the day on a laptop and starts the timer from a phone. For the statistics and the AI mentor to see the full picture, the data must match on every device.

In Mito, data is saved on the device first, so the app works offline. When the user is signed in, changes go to the server and from there to their other devices.

Signing in is a precondition and is not described in this case.

## 2. User stories

**US-1.** As a user with a phone and a laptop, I want changes on one device to appear on the other, so that I see up-to-date tasks and plans everywhere.

| Scenario | Given | When | Then |
| --- | --- | --- | --- |
| Positive | I am signed in on two devices | I create a task on the phone | It appears on the laptop within a couple of seconds |
| Positive | A task exists on both devices | I delete it on the laptop | It disappears on the phone too |
| Negative | The same task was edited on two offline devices | The devices come online | Both keep the later edit |

**US-2.** As a user, I want to work offline without losing changes, so that I do not depend on the connection.

| Scenario | Given | When | Then |
| --- | --- | --- | --- |
| Positive | No internet | I edit tasks | Changes are saved. I see: “Offline — changes will be sent when the connection returns” |
| Positive | There are unsent changes | The connection returns | Changes are sent automatically |
| Negative | The server returned an error | Changes are being sent | I see “Could not sync. Will retry automatically.” Nothing is lost |

**US-3.** As a user, I want only me to see my data, so that I can keep personal plans in the service.

| Scenario | Given | When | Then |
| --- | --- | --- | --- |
| Positive | There are accounts A and B | B requests data | B gets only its own records |
| Negative | The device still holds account A's data | I sign in as B | A's data is removed from the device and never reaches account B |

## 3. Use case

| Field | Value |
| --- | --- |
| Name | Sync the device's data with the account |
| Actor | User |
| Precondition | The user is signed in |
| Trigger | The user changed data, opened the app, came online, or a change arrived from another device |
| Success | Data on the device and on the server match |
| Failure | Changes stay in the device queue and will be sent later |

### Main flow

1. The user changes a task, a calendar block or a timer entry.
2. The app saves the change on the device and adds it to the outgoing queue.
3. The app waits 0.8 seconds to send several edits in one request.
4. The app sends the queued changes to the server.
5. The server checks that the user is signed in and changes only their own records.
6. The server saves the record if it is newer than the one it already has.
7. The app removes the sent records from the queue.
8. The app requests changes made since the last sync.
9. The app stores records that are newer than the local ones.
10. The app shows “Synced” and the time.
11. The server notifies the user's other devices, and they perform steps 8–10.

### Alternative flow

- **A1. A guest signs in for the first time.** If the user worked without an account and then signed in, all their data is sent to the account.

### Exceptions

| Code | Situation | What the system does |
| --- | --- | --- |
| E1 | No internet | Sends nothing. Shows “Offline” and the number of unsent changes. Sends them when the network returns |
| E2 | Server error | Shows “Could not sync”. Retries after 2, 4, 8 … up to 60 seconds. The queue is kept |
| E3 | One record edited on two devices | Keeps the version with the later change time. Shows no error |
| E4 | No access: not signed in or trying to change someone else's record | The server rejects the request (401 or 403). Data is unchanged |
| E5 | The device holds another account's data | Deletes it from the device without sending and loads the new account's data |

**Why.** Conflicts resolve as “the last edit wins”, without a version-picking dialog. The app is personal, and the same task is rarely edited on two devices at once. A picker would be more complex than the problem itself.

## 4. Process

The full model is artifact BPMN-01; a simplified flow is on the Architecture tab.

**Why.** We push our own changes first and pull others' after. Otherwise the app would briefly show old versions over the user's fresh edits.

## 5. API

There is no separate sync server: the app uses Supabase's REST API. Every request carries the user's token, which tells the server who is calling.

| Method | Path | What it does | Responses |
| --- | --- | --- | --- |
| POST | `/rest/v1/rpc/push_records` | Push a batch of changes (up to 200 records) | 200 — accepted; 400 — invalid data; 401 — not signed in; 403 — someone else's record |
| GET | `/rest/v1/records?rev=gt.{N}` | Get records changed since the last sync (up to 500) | 200 — list of records; 401 — not signed in |

Example `push_records` body:

```json
{
  "changes": [
    {
      "id": "0192a3b4-5c6d-7e8f-9a0b-1c2d3e4f5a6b",
      "collection": "tasks",
      "updatedAt": 1759140000000,
      "deletedAt": null,
      "doc": { "id": "0192a3b4-5c6d-7e8f-9a0b-1c2d3e4f5a6b", "title": "Read chapter 3", "status": "open" }
    }
  ]
}
```

## 6. Data model

All entities (tasks, blocks, timer entries) are stored on the server in one `records` table. Details are in data dictionary DD-01 and diagram ERD-01.

**Why.** A record is never deleted from the database; it gets a `deleted_at` mark. If the row disappeared, a device that was offline would never learn it had been deleted.

## 7. Development task

**MITO-7. Sync data across devices**

**Goal.** A signed-in user sees the same data on all devices and can work offline.

What to build:

1. A `records` table in Supabase: a user sees and changes only their own rows.
2. A `push_records` function: saves a record only if it is newer than the server's.
3. An on-device queue of unsent changes.
4. Sync 0.8 s after an edit, on app start, when the network returns and on demand.
5. Status in the UI: “Synced”, “Offline”, “Error”.

**Acceptance criteria:** all scenarios from section 2.

Non-functional requirements:

- Security: a user sees only their own data (an access rule in the database).
- Reliability: offline changes are never lost; automatic retry after an error.
- Deletion only via the `deleted_at` mark.

## 8. Analyst notes

Checking the documentation against the code, I found places worth improving.

| # | Finding | Risk | Proposal |
| --- | --- | --- | --- |
| 1 | If two devices change a record in the same millisecond, each keeps its own version | The devices diverge forever (rare) | Add a tie-breaker for equal timestamps |
| 2 | “The later edit” is decided by the device clock | If a phone's clock runs fast, its edits win even over newer ones | Acceptable for a personal app; otherwise use server time |
| 3 | The timer can run on two devices | After sync there are two time entries for the same span | Check for overlaps after sync |
| 4 | Deleted records stay in the database forever | The table grows; a new device downloads deleted data too | Purge old deletion marks |
