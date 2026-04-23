<!--
Pull request template for vibeclubs.ai.

The ops harness is documented at docs/ops/README.md. Run `pnpm audit:all`
locally before opening the PR — CI runs the same gates.
-->

## What this changes

<!-- 1–3 sentences. What did you do, and what does the user feel differently as a result? -->

## Type of change

- [ ] 🎯 `feat` — new feature or capability
- [ ] 🧹 `fix` — bug fix
- [ ] ♻️ `refactor` — no behavior change
- [ ] 📚 `docs` — docs / strategy only
- [ ] 🎨 `style` — visual / CSS only
- [ ] 🤖 `ops` — ops harness, CI, agent, or script
- [ ] 🏛️ `chore` — misc repo upkeep (lockfile, config)

## Pre-ship checks (all must pass)

- [ ] `pnpm audit:voice` — no forbidden vocabulary in consumer surfaces
- [ ] `pnpm audit:clubs` — frontmatter schema clean (if `content/clubs/` touched)
- [ ] `pnpm typecheck` — zero errors
- [ ] `pnpm build` — full Next build succeeds
- [ ] Reduced-motion path tested (if new animations added)
- [ ] Mobile viewport checked (if UI changed)

## Vibe test (VISION.md §Philosophy rule #2)

**Does this make the room feel more alive?**

<!-- One sentence. Or delete this section if not applicable (pure ops / docs change). -->

## Voice test (VISION.md §Voice)

<!-- Would a 28-year-old builder text this to a friend? If any consumer copy changed, paste the relevant sentence here. -->

## Format / platform test (VISION.md §Decision heuristics)

- [ ] Could someone run a vibeclub with this on their existing tools? (If this locks users into vibeclubs.ai specifically, reconsider.)
- [ ] Does this pass the witness test? (If AI, is it noticing + celebrating, or interrupting?)
- [ ] Does this pass the OSS test? (Can someone self-host and fork this without hitting a paywall in the core?)

## Vetoes check (CONTRIBUTING.md)

- [ ] No breakout rooms
- [ ] No host controls
- [ ] No recording by default
- [ ] No calendar / scheduling / meeting features
- [ ] No in-app payments on OSS core
- [ ] Nothing belonging to the Arcanean hosted tier

## Agent review

Dispatch the relevant agent(s) before requesting human review:

- [ ] `club-curator` (if `content/clubs/` touched)
- [ ] `voice-auditor` (if consumer copy changed)
- [ ] `design-keeper` (if UI / tokens / motion / 3D changed)
- [ ] `vibe-mechanic-designer` (if a new mechanic added)
- [ ] `ecosystem-planner` (if a feature might span brands)

## Linked issues

<!-- Closes #X, addresses VBC-YY, ties to docs/strategy/Z.md -->
