## 1. Purpose

This document describes the requirements for a single payment gateway serving three products.

## 2. Functional requirements

- FR-01 — accept a payment with an idempotency key
- FR-02 — full and partial refunds
- FR-03 — routing across providers

## 3. Non-functional requirements

- NFR-01 — p95 ≤ 300 ms excluding the provider
- NFR-02 — 99.9% monthly availability
- NFR-03 — operation log retained for 5 years

## 4. Assumptions

Providers support webhooks; products are ready to send an idempotency key.
