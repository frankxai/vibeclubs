---
description: Write an end-of-session handover doc to docs/ops/HANDOVER-YYYY-MM-DD.md so the next session (or Frank on Monday) can pick up cold.
---

Dispatch the `session-recapper` agent to generate a single handover document. The agent reads:

- `git log --oneline origin/main..HEAD` — commits made this session
- `git log -1 --stat` — latest commit footprint
- `git status --short` — uncommitted state
- Prior handover under `docs/ops/HANDOVER-*.md` for tone + format
- Active `SPRINT-*.md` for ticket context
- Any new `docs/strategy/*.md` created this session

Output:

- Writes to `docs/ops/HANDOVER-<today's date>.md` (or appends `## Revision <N>` if one already exists for today).
- Structure per `.claude/agents/session-recapper.md` — Situation, Goal of next session, What's Done, What's Not Done, Critical Context, Next Actions, Files to Read First, Repo Map, Memory entries.

After the file is written, the session-recapper reports:

- File path written
- Commits covered
- Any uncommitted state flagged
- Suggested next-session first action

## When to run this

- End of a substantive multi-hour session
- Before context is about to auto-compact (> 70% usage)
- Before handing off to a cloud-based Claude Code instance
- Before going offline for more than 24h

## Voice + rules

The handover is dev-facing. Forbidden consumer vocabulary is looser but the five-word identity still holds (see `session-recapper.md` §"Voice rules").

## Dispatch

Use the Agent tool with `subagent_type: general-purpose` or the configured routing that maps to `session-recapper`. Briefing template:

> "Generate today's handover to `docs/ops/HANDOVER-<date>.md`. Read prior handovers for format. Focus on: <the specific session focus>."
