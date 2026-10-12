How the phrase "by Friday" becomes a date. Module `app/deadline_resolver.py`. The bot works in Russian; phrases below are translated, the results are the module's real output.

## Why not the model

An LLM understands well that "by Friday" is a deadline but is bad at date arithmetic: it confuses "this" Friday with "next", slips at week and month boundaries, and the result changes from run to run. So the work is split:

- **the model** only extracts the deadline phrase exactly as written — "by Friday", "the day after tomorrow in the morning";
- **code** turns it into a date relative to the moment the message was sent, not when it was processed.

Deterministic code can be checked against a table of examples and fixed precisely when a phrase is parsed wrongly.

## How a phrase is parsed

1. **"This week", "next week", "within a week"** without a specific day → Friday of this or next week. dateparser alone would read this as "+7 days from the current hour". If Friday has already passed, the deadline moves to the next one.
2. **Inflected weekdays and adjectives** are brought to forms dateparser understands (Russian cases: "пятницы" → "пятница", "завтрашнего" → "завтра").
3. **Time of day** is extracted before parsing the day: morning → 09:00, before lunch → 11:00, lunch and afternoon → 13:00, after lunch → 14:00, evening → 18:00, night → 22:00.
4. **Filler words** "by", "to", "on" and commas are removed — they confuse the parser.
5. **dateparser** parses the rest relative to the message time and prefers future dates.
6. A time is written to the result only if it was explicit in the text. Otherwise it would produce "the day after tomorrow at 14:00" — the hour the message arrived.
7. If nothing parses, the original phrase is returned: people are better off seeing what they wrote than an empty field.

## Results

Real module output. The message was sent on Tuesday, 22 September 2026, at 14:00.

| Phrase | Result |
| --- | --- |
| "by Friday" | `2026-09-25` |
| "for Friday" | `2026-09-25` |
| "tomorrow by 18:00" | `2026-09-23T18:00` |
| "the day after tomorrow in the morning" | `2026-09-24T09:00` |
| "in 2 days" | `2026-09-24` |
| "by tomorrow evening" | `2026-09-23T18:00` |
| "this week" | `2026-09-25` |
| "next week" | `2026-10-02` |
| "within a week" | `2026-09-25` |
| "Friday morning" | `2026-09-25T09:00` |
| "before lunch" | `2026-09-22T11:00` |
| "after lunch" | `2026-09-22T14:00` |
| "on Monday at 10:30" | `2026-09-28T10:30` |
| "someday" | `someday` — kept as text |

## Limitations

- "Within a week" on a Tuesday gives Friday of this week, not "in 7 days". It is a deliberate rule — "by the end of the working week" — but worth confirming with the team.
- Deadlines are calculated in the server's time zone (finding З-4).
- Weekends and holidays are not considered: "in 2 days" on a Friday is a Sunday.
