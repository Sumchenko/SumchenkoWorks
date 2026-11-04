The core principle: a finite-state machine drives the dialogue and the LLM decides nothing on its own. The most dangerous phrases are caught by code — before the utterance ever reaches the model.

## Red flags

The regulations split them into two categories. A — a life threat ("my chest is tight", "cannot breathe", "going to kill myself"): the assistant immediately names 103/112 and transfers to a human. B — an acute condition (unbearable pain, a 40-degree fever, "getting worse"): an offer to connect a registrar. The safety rule: a false alarm is acceptable, a miss is not. That is why the rules are broad, and outside operators' working hours category B is handled as A.

## How the detector works

A rule is a set of concepts that must appear near each other, within a window of a few words, in any order: "chest pain", "my chest feels pressed" and "my heart stabs into my arm" are all caught by one rule. Words are lemmatised (pymorphy3), and every parse counts: "колет" is both the verb "to stab" and the noun. Negation binds to the next word and carries through modal verbs: "my chest does not hurt" is not a flag, but "cannot breathe" is. A safety net supplements the main rules — the same words matched as lemma prefixes, so even "my chest does not hurt" raises an alarm: when in doubt, flag.

## Self-harm and "probably false"

Self-harm gets dedicated rules and its own phrase ("Your safety is important to me…") rather than a blind transfer to a registrar. "Probably false" — a flag about something long past or mild ("a year ago", "a little"): the assistant still mentions 103 but does not abort the scenario. This is a refinement of the detector, not part of it: a softer "probably false" would mean a miss.

## The invariant, tested

A corpus of phrases in tests/unit/red_flag_corpus.json: no corpus phrase may lose its flag or change category. On top of that, an eval on a live LLM: 84 control dialogues, 0 missed red flags.

## The other invariants

The assistant gives no diagnoses and no medical advice; "you are booked" is said only after the HIS answers; personal data is never named first in a conversation; audio and recognition stay inside the VM (152-FZ).
