## Аутентификация

Каждый продукт получает отдельный ключ доступа; ключ передаётся в заголовке `Authorization`.

## Статусы платежа

- created → authorized → captured
- created → failed
- captured → refunded (полностью или частично)

## События

Изменения статусов публикуются в топик `payment.status`. Потребитель должен обрабатывать повторную доставку.

```json
{
  "type": "payment.status",
  "payment_id": "…",
  "status": "captured",
  "occurred_at": "2025-09-01T10:00:00Z"
}
```
