How the system works, from a call to a booking in the HIS. Everything runs on a single hackathon VM (4 vCPU, 7.8 GB, no GPU) under docker compose: two ownership zones — BE (backend and telephony) and ML (voice and dialogue) — plus the external "Reception" stand that plays the HIS.

## Telephony

A call arrives from a softphone through the organisers' SIP gateway at our Asterisk 18 (number 047). The dialplan mints a call_id, streams audio to the agent over AudioSocket — TCP, 8 kHz — and drives channels over ARI: transfers to a registrar, outbound robocalls, call recordings (MixMonitor). If the agent crashes, the dialplan does not drop the call: after 20/30/90 seconds of silence it connects the patient straight to a registrar.

## Voice pipeline (the ML zone)

One Python/asyncio task per call. Silero VAD finds the utterance, GigaAM v3 CTC recognises it locally on the CPU (~0.2 s per utterance), the red-flag detector checks the text in code before the LLM, the dialogue FSM picks the next step, and the LLM understands the utterance via function calling — only the current step's functions are exposed. Silero TTS with a phrase cache speaks the reply; if the LLM takes longer than 1.5 s, the assistant covers the pause with "one second, let me check".

## Backend (my contribution)

FastAPI, SQLAlchemy asyncio and Postgres 16. The schedule (specialties, doctors, slots) is imported from Excel and free time is computed from it; booking takes two steps — reserve the slot locally, then create it in the stand — with protection against duplicates and repeat bookings to the same specialty. Transfers with a case card, С-10/С-11 robocalls via ARI, an SMS log, the registrar panel /panel and the testing console /pult — server-rendered Jinja2, no SPA. Next to it sits a /stub/api with the same contract but in memory: the eval runs against it without burning the stand's quota.

## The queue to the stand

The stand allows at most 10 requests per minute, so the agent never talks to it directly: the backend puts requests into a priority queue — a live call first, robocalls next, background last. The timeout is 5 seconds: if the stand is late — 503 MIS_UNAVAILABLE, and the assistant hands the patient back to a registrar.

## Observability and personal data

Both services expose /health, /ready and /metrics for Prometheus. Call recordings, masked transcripts and the personal-data access log live in the panel. ASR and TTS are local — audio never leaves the VM (152-FZ).
