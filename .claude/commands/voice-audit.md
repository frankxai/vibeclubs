---
description: Audit the app for voice drift. Fails loud on forbidden vocabulary.
---

Scan `apps/web` and `apps/extension` for words that violate the voice system
(see `VISION.md §voice` and `feedback_voice.md` in memory).

Run:

```bash
rg -n -i --type ts --type tsx --type md \
  "\\b(community|members|users|rooms|spaces|engage|connect|unlock|empower|revolutionize|disrupt|platform-powered|cloud tier|anchor|stamp|witness|field|residency|operator)\\b" \
  apps/web apps/extension README.md
```

Note: "users" is OK in `lib/supabase/*` (table name is `users` — database term,
not user-facing). "Platform" is OK when describing Meet/Discord/Zoom/Zoom as
"the platform you already use" — the ban is on calling Vibeclubs a platform.

For every hit NOT in one of those carve-outs, propose a rewrite using the
five-word vocabulary: vibeclub / host / crew / lock in / ship.

Report as a Markdown table:

| File | Line | Hit | Proposed rewrite |
|---|---|---|---|

Do not auto-fix. Surface the table and let Frank (or the next turn) decide.
