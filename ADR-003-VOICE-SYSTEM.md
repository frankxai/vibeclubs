# ADR-003: The Vibeclubs Voice System

**Status:** Accepted
**Date:** 2026-04-21
**Decider:** Frank Riemer
**Supersedes:** N/A — augments ADR-002

---

## Context

ADR-002 established Vibeclubs as a format, not a platform. Once the
architecture was right, the next load-bearing decision was **language**.

A prior agent proposed a taxonomy: Cycle, Stamp, Season, Anchor, Regular,
Operator, Field, Witness, Residency. Eight capital-noun inventions. Frank
rejected it in one sentence: *a 28-year-old builder would never text any
of those words to a friend*.

That sentence became the only test that matters.

## Decision

**Five words. That's the vocabulary.**

1. **vibeclub** — noun + verb. Lowercase. "Host a vibeclub." "Let's vibeclub tomorrow."
2. **host** — the role. Not anchor, not opener, not facilitator.
3. **crew** — the people. Not community, not members, not users.
4. **lock in** — the focus state. Ride the 2025-2026 slang already in the wild.
5. **ship** — the output. Builder grammar, universal.

**Canonical hero:** "Claude Code + your crew + a soundtrack. Host a vibeclub."

Everything else — the extension, the AI recap, the hosted tier, the OSS
packages — uses lowercase-descriptive naming. No capital-noun features.

## Why this beats the alternatives

- **Invented taxonomies don't spread.** People text what feels natural. "Host a vibeclub" tests clean in 8 of 8 formats (text, IG caption, Discord, X, LinkedIn, email subject, Slack, product copy). "Host a Cycle and earn a Stamp" tests clean in 0 of 8.
- **The word is already built.** "Vibeclub" pluralizes, conjugates, and travels. A product's job is to make the word spread. Inventing more words dilutes the one that works.
- **The April 2026 narrative wave is restraint.** Linear, Cursor, Vercel, Arc, Anthropic — every top tooling brand this cycle underplays proper nouns and lets the product do the work. Capital-T Witness in April 2026 reads like a 2021 crypto whitepaper.
- **Five words is testable.** A voice-audit command can grep the codebase and surface drift. An eight-word taxonomy makes auditing impractical and turns voice into vibes instead of enforcement.

## Forbidden vocabulary

| Word | Replace with |
|---|---|
| community | crew |
| members | crew / hosts |
| users (in consumer copy) | crew / hosts |
| rooms | vibeclub |
| spaces | vibeclub |
| sessions (in consumer copy) | vibeclub / the lock-in |
| platform (for Vibeclubs itself) | format |
| engage / connect | show up / lock in |
| unlock / empower | ship / hand over |
| revolutionize / disrupt | delete and rewrite the sentence |
| AI-powered | the specific act ("Claude writes the recap") |
| Cloud (as a paid tier name) | Pro |

**Capital-noun features** are banned: no Stamps, no Anchors, no Witnesses, no
Fields, no Residency, no Operators. Lowercase-descriptive nouns only: recap,
extension, card, crew, host.

## Carve-outs

- Database columns and types keep their technical names (`public.users`,
  `club_members.role`, `auth.users.id`).
- Architecture docs can say "platform" when referring to Meet / Discord /
  Zoom — those are literally the platforms Vibeclubs overlays.
- Package names (`@vibeclubs/ai-witness`, etc.) stay as-is. Devs read code,
  not marketing. The name is technical shorthand, not product surface.

## Enforcement

1. **`.claude/skills/voice/SKILL.md`** — voice skill loaded automatically by
   Claude Code when working on copy.
2. **`.claude/commands/voice-audit.md`** — command that greps the forbidden
   list and reports drift as a Markdown table.
3. **CI (optional, Sprint 2)** — add a `scripts/voice-audit.sh` that runs in
   CI on PRs touching `apps/web/**/*.tsx` and warns on hits.
4. **CODEOWNERS** — voice-sensitive surfaces (`apps/web/app/page.tsx`, nav,
   footer) require Frank as reviewer.
5. **VISION.md §Voice** — canonical dictionary, updated here.

## Consequences

**What becomes easier:**
- Writing hero copy (there's only one right answer).
- Reviewing PRs (the audit is mechanical).
- Onboarding future agents (they read one skill file).
- Brand compounding across surfaces (website, extension, OSS, Twitter all sound identical).

**What becomes harder:**
- Product taxonomy discussions get short-circuited (intentional).
- Feature naming is boring by design (also intentional).

## Revision

The five words are a commitment. If a sixth word earns its place through
organic use (three builders text it unprompted in a week, not one), re-open
this ADR and ratify it. Do not add words via PR description.

## Action items

1. [x] Update `VISION.md` with the voice section.
2. [x] Rewrite landing + nav + all user-facing copy to match.
3. [x] Write `.claude/skills/voice/SKILL.md` and voice-audit command.
4. [ ] Add a CI voice-audit step when a forbidden-word hit would block merge (Sprint 2).
5. [ ] Run `/voice-audit` before every `/ship`.
