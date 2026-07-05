# Vibeclubs Runtime Proof Brief

Date: 2026-07-05

## Decision

Upgrade the Vibeclubs homepage hero from a recap-card-first composition to a runtime-proof composition.

The live page was already tasteful and on-voice, but the first viewport made the card feel like the product. Per `VISION.md`, the extension is the runtime. The hero now needs to prove the actual format: crew already somewhere else, Vibeclubs extension overlay, three faders, shared timer, and recap card after the lock-in.

## Audience Expectation

Best-fit audience:

- Vibe coders and AI-native builders who already work in Meet, Discord, YouTube, Figma, or a local setup.
- Small crews who need a ritual that feels alive without becoming a meeting app.
- OSS-minded builders who need to see the mechanism before they trust the promise.

They expect:

- Immediate clarity that Vibeclubs is a format and extension, not another hosted meeting product.
- Proof that the mixer/timer/recap pieces are concrete.
- Copy that sounds like a builder would text it.
- Motion that gives life without hiding content, especially for reduced-motion users.

## Visual Story

First read:

> Host a vibeclub. The crew is already in a tab. The extension brings the soundtrack, timer, and recap.

Hero proof object:

- Browser shell: `meet.google.com / crew-lock-in`.
- Crew panel: `Claude Code sprint`, 90 minutes, 3 cycles.
- Extension panel: Vibeclubs extension, 32:14 focus timer, Ambient/Suno/Voice faders.
- Outcome rows: any tab, card ready, music per listener, Claude keeps quiet notes.
- Mobile proof strip: Meet/Discord, 3 faders, recap card.

## Motion Job

Track A only.

- Keep existing aurora atmosphere.
- Remove SparkOrb as the focal object.
- Keep Framer entrance wrappers, but harden reduced-motion so reveal wrappers resolve to visible final state.
- No Three.js, v0 code copy, Spline, or new animation runtime in this lane.

## Tool Routing

- Codex: repo-native implementation, tests, visual QA, evidence, PR.
- Premium Web OS: brief, asset-tier gate, first-viewport scoring.
- Motion Design Studio: reduced-motion and motion-purpose review.
- v0: not used for this scoped pass. Use later only for alternate extension-overlay layout explorations, then adapt repo-native.
- Figma/Canva: not needed unless turning the runtime proof into launch/social assets.

## Acceptance

- Desktop first viewport shows a runtime proof object, not a decorative orb or lone card.
- Mobile first viewport shows proof plus primary CTA before the first scroll.
- Reduced-motion screenshot shows the same information hierarchy.
- `pnpm audit:voice` passes.
- `corepack pnpm install --frozen-lockfile --force` passes with the repo's pnpm 9 package manager.
- Changed-file ESLint and whitespace checks pass.
- Any repo-wide type/build/deploy residual is recorded separately from the scoped visual lane.
