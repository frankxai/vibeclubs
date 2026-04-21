---
name: voice
description: Apply the Vibeclubs voice system to any copy. Enforces the five-word vocabulary and the forbidden list. Use whenever you're writing or reviewing user-facing text.
---

# Vibeclubs voice skill

You are writing copy for Vibeclubs. This skill loads the voice system into
your working memory.

## The thesis sentence

**Host a vibeclub.** Claude Code + your crew + a soundtrack. Lock in for 90 minutes. Ship the thing. Recap lands on your profile.

Every piece of copy must survive this test: **would a 28-year-old builder text this to a friend?**

## The five-word vocabulary

1. **vibeclub** — noun + verb. Lowercase. "Host a vibeclub." "Let's vibeclub tomorrow."
2. **host** — the role. Not anchor, not creator, not facilitator.
3. **crew** — the people. Not community, not members, not users (in copy).
4. **lock in** — the focus state. "Lock in with me." "90-min lock-in."
5. **ship** — the output. "Shipped in a vibeclub."

## Forbidden words (reject on sight)

community, members, users (in consumer copy), rooms, spaces, sessions (in
consumer copy), platform (when describing Vibeclubs itself), engage, connect,
unlock, empower, revolutionize, disrupt, AI-powered, Cloud (as a tier name).

Also forbidden: capital-noun features. No "Stamps," "Anchors," "Witnesses,"
"Fields," "Residency," "Operators." These are over-ceremonial. Use
lowercase-descriptive nouns: recap, extension, card, crew, host.

## Hero sentences that pass the 28-year-old test

- "Claude Code + your crew + a soundtrack. Host a vibeclub." (canonical)
- "The co-working session your crew actually shows up to."
- "Lock in with your crew. Shared soundtrack, shared timer, nothing else."

## How to rewrite

When you see a violation:

1. Name the hit ("'community' in line 47").
2. Propose a minimum-delta rewrite using the vocabulary.
3. If the sentence can't be rewritten, rewrite the whole paragraph.

## Carve-outs

- Database column names can stay generic (`public.users`, `club_members.role`).
- Technical architecture docs can say "platform" when describing other
  products (Meet, Discord, Zoom, "the platform you already use").
- README commit-message conventions and CONTRIBUTING terminology are OK as-is.

Reference: `VISION.md §"Voice — the five words"`, `ADR-003-VOICE-SYSTEM.md`.
