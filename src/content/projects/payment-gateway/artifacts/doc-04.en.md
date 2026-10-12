## Authentication

Each product gets its own access key; the key is sent in the `Authorization` header.

## Payment statuses

- created → authorized → captured
- created → failed
- captured → refunded (fully or partially)

## Events

Status changes are published to the `payment.status` topic. Consumers must handle redelivery.

```json
{
  "type": "payment.status",
  "payment_id": "…",
  "status": "captured",
  "occurred_at": "2025-09-01T10:00:00Z"
}
```
