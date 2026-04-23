---
name: New vibe mechanic
about: Propose a mechanic that makes the session feel more alive
title: 'mechanic: <short name>'
labels: ['mechanic', 'discussion']
---

<!--
Vibe mechanics are the things that make a distributed session feel like a
crew playing the same song — not ten people running stopwatches. Every
proposed mechanic goes through the vibe-mechanic-designer agent and gets
tested against three principles and four vetoes.

Read docs/strategy/vibe-mechanics.md first.
-->

## The mechanic — one sentence

<!-- What does it do? 15 words max. -->

## The felt-simultaneity question

<!--
How does this make the crew feel each other? Be specific. "You see something
the crew sees at the same moment" or "you hear a change in tempo the crew
hears" qualify; "motivational quotes" doesn't.
-->

## State shape

<!-- If this adds fields to PomodoroState or ClubState, specify them. -->

## Surfaces

<!-- Where does it render? Extension overlay / /club/[slug] / session card / all. -->

## Transport

<!-- Supabase Realtime broadcast / per-listener local / bring-your-own. Which channel and why. -->

## Voice hooks

<!-- How does this mechanic show up in consumer copy, using only the five words (vibeclub / host / crew / lock in / ship)? -->

## Principles check

- **Does it make the crew feel each other?** <yes / no + reason>
- **Does it work on platforms we don't control?** <yes / no + reason>
- **Does it degrade gracefully to solo?** <yes / no + reason>

## Failure modes you're avoiding

- [ ] Not gamifying it into Habitica (no points / streaks / leaderboards as a mechanic)
- [ ] Not making the AI a DJ (deterministic, not curated by Claude)
- [ ] Not adding chat (share-at-a-moment only)
- [ ] Not requiring video

## References read before proposing

- [ ] `docs/strategy/vibe-mechanics.md`
- [ ] `VISION.md §Philosophy rules`
- [ ] `packages/pomodoro-sync/src/index.ts` (state shape)
- [ ] `CONTRIBUTING.md §"What We're Not Accepting"`
