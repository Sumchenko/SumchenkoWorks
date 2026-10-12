The HTTP API for managing monitoring targets. It runs on the same server as the web UI and under the same authentication. The service speaks Russian, so error texts below are translated.

## Access

- Everything except `/healthz` is behind Basic Auth (`ADMIN_USER` / `ADMIN_PASSWORD`). Without a password — 401.
- Requests from other sites are rejected (`http.CrossOriginProtection`, Go 1.25) — 403. Browsers attach Basic Auth by themselves, so without this protection any page could delete a target. Requests without `Origin` / `Sec-Fetch-Site` headers (curl, scripts) pass.
- `GET /healthz` is open: it pings the database and returns 200 or 503 — for the Docker HEALTHCHECK and external monitoring.

## Endpoints

| Method | Path | What it does | Responses |
| --- | --- | --- | --- |
| GET | `/api/targets` | All targets with status | 200 |
| POST | `/api/targets` | Create a target | 201, 400, 422 |
| GET | `/api/targets/{id}` | One target with status | 200, 404 |
| PUT | `/api/targets/{id}` | Replace a target entirely | 200, 400, 404, 422 |
| DELETE | `/api/targets/{id}` | Delete a target with its history | 204, 404 |

After any change the scheduler applies it immediately, without waiting for the periodic reload.

## Target

| Field | Type | Default | Meaning |
| --- | --- | --- | --- |
| `name` | string | — | Name in the UI, required |
| `url` | string | — | `http(s)://…`, required |
| `expected_status` | int | any 2xx | Expected code after redirects, 100–599 |
| `keyword` | string | none | A string that must be in the first megabyte of the response, case-sensitive |
| `headers` | object | `{}` | Request headers, e.g. `apikey` for Supabase; stored as plain text |
| `interval_seconds` | int | `CHECK_INTERVAL` (60 s) | At least 30 s |
| `timeout_seconds` | int | `CHECK_TIMEOUT` (15 s) | At most 120 s and less than the interval |
| `enabled` | bool | `true` | A disabled target is not checked; its history is kept |

## Status in the response

| Field | Meaning |
| --- | --- |
| `state` | `up`, `down`, `pending` (no checks yet) or `disabled` |
| `last_checked_at` | Time of the last check |
| `status_code` | HTTP code; absent if there was no response |
| `response_time_ms` | Time until the body is read — closer to what a user sees |
| `error` | Reason for the outage: a network error, an unexpected code, a missing keyword |
| `uptime_24h` | Share of successful checks over 24 hours, % |

A real response for the "Mito" target:

```json
{
  "id": 3,
  "name": "Mito",
  "url": "https://mito.13-143-64-158.sslip.io/",
  "keyword": "Mito",
  "interval_seconds": 30,
  "timeout_seconds": 15,
  "enabled": true,
  "status": {
    "state": "up",
    "last_checked_at": "2026-10-12T21:20:34.109818Z",
    "status_code": 200,
    "response_time_ms": 85,
    "uptime_24h": 100
  }
}
```

And the status of a target that is down:

```json
{
  "state": "down",
  "last_checked_at": "2026-10-12T21:20:34.128419Z",
  "response_time_ms": 446,
  "error": "Get \"https://old-demo.sumchenko-tech.ru/\": remote error: tls: internal error",
  "uptime_24h": 0
}
```

## Errors

| Code | When | Body |
| --- | --- | --- |
| 400 | Invalid JSON or an unknown field | `{"error": "invalid JSON: json: unknown field \"color\""}` |
| 401 | No password or a wrong one | — |
| 403 | A cross-site request | — |
| 404 | No target with this id | `{"error": "target not found"}` |
| 422 | Settings failed validation — all problems listed at once | `{"errors": ["interval must be at least 30 s", "timeout (15 s) must be less than the interval (10 s)"]}` |

**Why.** Unknown fields are an error, not silently ignored: otherwise a typo in a field name would quietly become "use the default". Validation errors come as a list so everything can be fixed in one go. `PUT` replaces the whole target — with a partial update it is ambiguous what a missing field means.
