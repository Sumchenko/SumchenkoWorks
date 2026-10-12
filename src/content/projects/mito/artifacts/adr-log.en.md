Decisions were made along an 11-stage roadmap and recorded in a table in `docs/ROADMAP.md`. The developer (Claude Code) brought contested questions to me with options and a recommendation; the decision was mine.

## Client — 2026-09-23

React + TypeScript + Vite, CSS Modules and CSS variables. No Tailwind or ready-made component kits, so the UI does not look like a generic “AI template”. State — Zustand; animation — Motion in the spirit of Fluent / Windows 11.

## Data: local-first — 2026-09-23

IndexedDB (Dexie) behind a repository layer — the only way to write. Server and sync are a separate stage. The data model was ready for sync from day one: UUIDv7, `updatedAt`, soft deletion via `deletedAt`.

## Task model — 2026-09-23

Subtasks are full tasks (one nesting level). Two dates: `plannedDate` (when to do it) and `dueDate` (deadline). Statuses `open`, `done`, `cancelled`. The timer can start without a task.

## Timer — 2026-09-23

The time entry in the database is the source of truth. Timer state (mode, Pomodoro phase, pause) lives in localStorage and stays in sync across tabs. The engine is pure functions with tests. Entries shorter than 10 seconds are discarded.

## Calendar and semantic zoom — 2026-09-23 … 27

The calendar is one surface: a camera over an endless strip of weeks. Levels of detail blend: time scale → bars → tiles → heat map. Colour in the calendar always means the project. A task block sets the task's `plannedDate`. Geometry is pure functions with tests. Phones get their own gestures: tap, long press, bottom sheets instead of popovers.

## Analytics — 2026-09-23

The core is pure functions in `src/analytics`, shared by the statistics page and the AI mentor. Charts are custom SVG components on theme tokens. Plan vs actual uses two metrics: “completion” (time spent on planned tasks on the same day) and “accuracy” (overlap with the planned hours).

## Backend and sync — 2026-09-23

Supabase: Postgres, Auth, Realtime. Guest mode without an account, with gentle invitations to sign in. An outgoing change queue on the client, a server revision counter for fetching changes, last-write-wins by `updatedAt`, deletion via tombstones. Delivery via Realtime plus catch-up sync on start and when back online.

## Hosting — 2026-09-25

The site and the Supabase proxy run on Caddy on a VPS in Germany; the backend is Supabase Cloud. Deploys via GitHub Actions on every push to main: checks → migrations → atomic release switch → smoke test. The browser only talks to our domain (Supabase under `/sb`, email links to `/auth/confirm`), so the app works where the Supabase host is unreachable.

## AI mentor — 2026-09-27

The mentor server is a Node service on our VPS behind Caddy, without database access: the app builds the data summary with its analytics core. Providers speak an OpenAI-compatible protocol; the chain is Groq → Gemini Flash → Gemini Flash-Lite with automatic fallback. The order is based on measurements: Groq is faster and plans better, while Gemini Flash on the free tier is often overloaded. Open to everyone, with a per-IP limit and a global daily limit. Keys stay on the server. Actions from the chat require confirmation.

## Learning mentor — 2026-09-27

Two modes: “Mentor” (learning goals) and “Assistant” (planning only). Onboarding is a conversation with option buttons, ending in a “Did I get it right?” card. The plan is stages with outcomes plus tasks for 1–2 weeks; a weekly review then adapts it to the real pace. A short knowledge check at the end of each stage. Study days are a goal setting: any proposed date is moved to the nearest study day by code, not by the model.
