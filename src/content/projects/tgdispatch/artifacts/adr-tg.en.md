Decisions of the MVP. The project was built in one day with Claude Code, so the decisions below are about what had to be right from the start and what was deliberately postponed.

## Stack

Python, FastAPI and aiogram 3 in one process; Groq via an OpenAI-compatible API both for parsing tasks (gpt-oss-120b) and for voice (whisper-large-v3-turbo); Notion as the tracker; SQLite as the fallback. Groq was chosen for its free tier and speed: its limits are enough for a small team.

## LLM parsing in JSON mode

The model returns strict JSON with a list of tasks, even when there is only one. The answer is validated by a Pydantic schema with enumerations for priorities and categories. On an invalid answer there is one retry: the model's answer and the note "return only valid JSON" are appended to the conversation. A second failure produces a clear message to the user.

## Splitting rules live in the prompt, with examples

The "one task or several" boundary is the hardest part of parsing. The prompt carries explicit rules and examples of both cases: a list joined by "and also" means different tasks; "on Thursday… no, let's do Friday" is one task with the final decision. The same goes for soft deadlines ("if there's a window this week") and low-priority signals ("whenever", "if you have time").

## Code calculates dates

The model returns the deadline phrase; dateparser calculates the date with normalisation of Russian word forms. Details and examples are in DOC-01.

## A draft before publishing

Nothing reaches Notion without confirmation. Any field can be edited in Telegram: text fields by message, priority and category by buttons, and a new deadline is recalculated from the original message time. An extra click is cheaper than a wrong card on a shared board.

## Notion with an SQLite fallback

Notion is optional: without a token the bot runs entirely on SQLite. When Notion fails, the task is written to a local outbox table and resent on service start and before each new task; the first network error stops the pass so as not to hammer an unavailable service.

## Notifications only to those who have written to the bot

Telegram does not let a bot write first. The bot remembers everyone who has written to it, the `/team` command shows that list, and on assignment the author honestly sees whether the assignee was notified. Name lookup is done in Python rather than with `COLLATE NOCASE`: SQLite's built-in collation does not understand Cyrillic.

## Closed access

The bot answers only a whitelist of Telegram user IDs — it is a work tool, not a public bot.

## Long polling instead of a webhook

The bot runs as a background task in the FastAPI lifespan. No public HTTPS address is needed and the service starts with one command. For production a webhook and keeping states outside memory are the right choice (finding З-2).
