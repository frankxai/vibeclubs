# vibeclubs.ai — Agent Instructions

Read `CLAUDE.md` first, then `VISION.md`, `ADR-004-SKILL-FIRST-HOST-PACK.md`, `docs/strategy/start-studio-engineering.md`, and `docs/ops/README.md`. The September host-pack decision and implementation record resolve older extension-first and credential-blocked assumptions; VISION.md retains the format boundary.

For the skill-first host-pack work, also read `ADR-004-SKILL-FIRST-HOST-PACK.md`.
The plugin lives in `plugins/vibeclubs`; it adds no server or billing dependency.

## Repo Role

`vibeclubs.ai` is a pnpm/Turborepo workspace for Vibeclubs: a Next.js web directory/API, Plasmo browser extension, and shared OSS primitives. A human hosts on existing tools. The extension is optional; the web app includes an account-free `/start` host-pack authoring tool as well as the directory and content layer. Hosted APIs and optional AI have separate activation gates.

## Work Pattern

1. Read `VISION.md` before scope-affecting decisions.
2. Use the documented ops harness: slash-command specs, `.claude/agents/`, scripts, and CI workflows.
3. Do not extend the legacy LiveKit skeleton unless the user explicitly reactivates that phase.
4. Do not invent a test runner; follow `CONTRIBUTING.md`.
5. Preserve existing dirty work.

## Commands

```bash
pnpm build
pnpm lint
pnpm typecheck
pnpm audit:all
pnpm format:check
```

For targeted work, use `pnpm --filter @vibeclubs/web <cmd>` or the relevant workspace filter.

## Safety

- Consumer copy changes should route through the voice-auditor pattern.
- UI/token/motion/3D/design-core changes should use the design-keeper pattern.
- Club content changes should run the club validation path.


<!-- PRODUCT-OUTCOME-CONTRACT:START -->
## Product outcome acceptance

Before substantial product work, name the intended user's job, current local product decision, owning issue, exact base revision, relevant skills, budget, acceptance and stop condition. Reuse an existing implementation candidate before creating a competing one.

Use the local product, brand, canon, licensing and release rules above. Portfolio work also resolves reviewed `frankxai/agentic-ops` strategy, Registry and quality at one recorded commit through the authorized connection; do not copy private records into this repository or treat proposal branches as accepted policy. An inaccessible source is an explicit limitation, never permission to invent it.

Review availability, function, customer usefulness, design/editorial quality and economics separately. Unsupported claims, lost work, broken authorization or missing required evidence cannot be offset by style scores. Apply only relevant gates and explain non-applicability.

For production-intent work, bind checks and independent review to the exact candidate revision; bind the stable domain to the accepted deployment/source revision. Record recovery/export behavior, failures, all attempts and human intervention. A preview, merge, or READY deployment does not establish customer success.

At handoff distinguish policy proposed, merged, loaded in this agent session and verified in execution. Include the owning issue, policy/source SHA, artifact, verifier, highest evidenced environment and next action. Dates and goals remain targets until measured.
<!-- PRODUCT-OUTCOME-CONTRACT:END -->

Current implementation and measurement: https://github.com/frankxai/vibeclubs/issues/2.
