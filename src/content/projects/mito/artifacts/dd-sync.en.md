## Table `records` (server, PostgreSQL)

One row is one user record: a task, a calendar block, a timer entry and so on.

| Field | Type | Required | Constraints | Meaning |
| --- | --- | --- | --- | --- |
| `id` | uuid | yes | Primary key | Record identifier. Generated on the device, so a record can be created offline |
| `user_id` | uuid | yes | Foreign key to the user. Defaults to the current user | Record owner |
| `collection` | text | yes | Only values from the list: `projects`, `tags`, `tasks`, `timeEntries`, `timeBlocks`, `goals`, `mentorNotes` | What kind of record this is |
| `doc` | jsonb | yes | — | The record itself with all its fields (task title, block time and so on) |
| `updated_at` | bigint | yes | Time in milliseconds | When the record last changed. Used to pick the newer version |
| `deleted_at` | bigint | no | Time in milliseconds | When the record was deleted. Empty — not deleted |
| `rev` | bigint | yes | Set by the server; a new number on every change | Change number. A device asks for “everything new after number N” |

### Indexes

| Index | Fields | Why |
| --- | --- | --- |
| Primary key | `id` | Find a record quickly when saving |
| `records_user_rev` | `user_id`, `rev` | Quickly select “this user's records after number N” |

**Access rules.** The database enforces a rule: a user reads and changes only rows where `user_id` is them. Deleting rows is forbidden for everyone; deletion is only via `deleted_at`.

## Queue `outbox` (device, IndexedDB)

Changes not yet sent to the server.

| Field | Type | Required | Constraints | Meaning |
| --- | --- | --- | --- | --- |
| `key` | string | yes | Primary key, form `tasks:<id>` | One row per record, however many times it changed |
| `table` | string | yes | Table name | Where the changed record lives |
| `id` | string | yes | — | Which record changed |
| `seq` | number | yes | Grows with every change | Send order |

## Service state `syncState` (device)

| Key | What it holds |
| --- | --- |
| `cursor` | The `rev` of the last received change |
| `owner` | Which account the data on the device belongs to. Empty — guest data |

## Fields of the `push_records` request

| Request field | Stored in |
| --- | --- |
| `id` | `records.id` |
| `collection` | `records.collection` |
| `doc` | `records.doc` |
| `updatedAt` | `records.updated_at` |
| `deletedAt` | `records.deleted_at` |
