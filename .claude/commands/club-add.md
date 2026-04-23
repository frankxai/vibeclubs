---
description: Scaffold a new content/clubs/*.md file via the interactive CLI. Prompts for every required field, validates on the fly.
---

Scaffold a new vibeclub listing the OSS way — a markdown file you (or a contributor) ships via a PR.

```bash
pnpm new:club
```

The script is interactive — it prompts for:

- Club name (Title Case)
- Slug (auto-generated from name, editable)
- Host handle (with @)
- Platform (meet / discord / zoom / in_person / other)
- Type (coding / music / design / study / fitness / writing / other)
- Pomodoro preset (25_5 / 50_10 / 90_20 / custom / vibe_coding_sprint / music_jam / dance_break / lightning)
- Ambient soundtrack (lofi / rain / cafe / nature / space)
- Schedule (freeform, include timezone)
- Platform URL (optional)
- Location (optional)
- Featured toggle (y/N)
- Body — 1–3 short paragraphs about the vibe

Output is a validated MD file at `content/clubs/<slug>.md`.

## After the scaffold

1. Review the MD file — the script renders a first-pass body from your prompt answer, edit for voice.
2. `pnpm audit:clubs` — validate the frontmatter schema.
3. `pnpm audit:voice` — scan for any voice drift in the body.
4. Commit + open a PR titled `club: <slug>`.
5. Club-curator agent auto-reviews on PR (see `.claude/agents/club-curator.md`).

## References

- `content/clubs/README.md` — frontmatter schema + PR contract
- `.claude/agents/club-curator.md` — the reviewer agent
- `docs/strategy/vibe-mechanics.md` — preset semantics (pick the right one)

## Shortcut

If you don't want the interactive flow, just copy an existing `content/clubs/*.md`, edit the frontmatter, write the body, run `pnpm audit:clubs`, commit.
