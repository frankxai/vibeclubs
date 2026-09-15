# Vibeclubs — operating instructions

## Current authority

Read `VISION.md` for the format boundary, then `ADR-004-SKILL-FIRST-HOST-PACK.md` and `docs/strategy/start-studio-engineering.md` for September's host-pack scope. Read `docs/ops/README.md` for the existing harness. The April `SPRINT-1-PLAN.md` is historical, not the current queue.

Vibeclubs is a small crew, a shared clock, and something useful to show. A human hosts on existing tools. The extension is optional. Keep the open format and existing-tool boundary; do not revive the legacy LiveKit platform.

## Verified production snapshot — 2026-09-15

- Domain: https://vibeclubs.ai
- Production commit: `1edb3c66ddb0c429242636ef824eac27da737ed4`.
- Vercel deployment: `dpl_BLNZdidsfnFfv7B8Ffg13qiNWCgb`, READY, production target, native Git source.
- Browser inspection of `/start` confirmed the host-pack form, craft choices, agenda, copy/download controls, and device-local draft status.
- This observation does not verify hosted authentication, public listing writes, synchronized extension use, provider calls, or Chrome Web Store publication. Recheck the actual domain/deployment before making a later release claim.

## What works and what needs activation

`/start` is a local authoring tool. It requires no account, Supabase configuration, model key, extension, or paid integration. It prepares an invite, exact-duration agenda, build brief, v0 prompt, and recap prompt. The September implementation includes validated device-local restoration and copy/download fallbacks. A v0 link and prompt are a handoff, not an embedded generation or deployment integration.

Hosted listing/authentication and database-backed APIs are separate. The optional `/api/build-brief` refinement remains activation-gated by authenticated identity, hosted configuration, a server Anthropic key, `AI_BRIEF_ENABLED`, and the durable quota migration. Follow the activation checklist in `docs/strategy/start-studio-engineering.md`; do not assume migrations or credentials are provisioned because source code exists. Never expose secrets.

The shipped local host-pack flow must continue working when hosted configuration is absent. A missing hosted dependency blocks only the capability that requires it.

## Commands

Use pnpm with the committed lockfile and the repository's `packageManager` pin. Root `package.json` currently pins pnpm 11.5.0. Verify runtime requirements from the current files and CI before changing versions.

```bash
pnpm install --frozen-lockfile
pnpm dev
pnpm dev:extension
pnpm build
pnpm lint
pnpm typecheck
pnpm test
pnpm test:e2e
pnpm audit:all
pnpm audit:built-truth
pnpm audit:release
pnpm format:check
```

Vitest and Playwright are installed and wired in root and web package scripts. Do not follow the obsolete claim that no test runner exists. Use `pnpm --filter @vibeclubs/web <cmd>` for a focused web command.

`pnpm audit:all` runs voice and club checks; it does not run every command listed above. Run the smallest relevant checks, then the required release checks for the changed behavior. Report commands actually run, their revision, and any untested production boundary.

## Architecture and ownership

- `apps/web`: Next.js directory, playbook, local host-pack tool, and separately gated hosted APIs.
- `apps/extension`: optional Plasmo/Manifest V3 overlay; its presence in source does not prove store availability or cross-device operation.
- `packages/*`: existing mixer, timer synchronization, witness prompt, session card, and music bridge primitives.
- `plugins/vibeclubs`: portable host skill and package; no server or billing dependency.
- `apps/web/app/r/[room]/page.tsx`: historical ADR-001 skeleton. Do not extend it.
- GenCreator owns its product identity, CreatorPack, curriculum and paid cohort boundary. Vibeclubs does not supply an active LiveKit service to it.
- Arcanea-specific lore is optional and remains outside the neutral format.

Public source, a built package, a tested installation, a marketplace submission, and published availability are distinct states. Preserve the release ledger.

## Product success and next work

The operating unit is a completed lock-in with a useful artifact. A listing, download, model call, or generated prompt is an intermediate event.

Next slices, each with its own evidence:
1. Verify the local pack in real host use; collect voluntarily supplied preparation time, declared finish and missing capability.
2. Prove repeat hosting and useful artifacts before adding a new service.
3. Add hosted continuity only when its auth, migration, tenant-isolation and deletion behavior can be verified.
4. Add direct v0 generation or sandbox execution only with bounded cost, cancellation, recovery and an observed output.

See the September implementation record for the current ordered gates. Prices in old README/VISION/sprint files are historical hypotheses reconciled by ADR-004. Do not enable checkout or make partnership claims from them.

## Harness

Reuse the existing slash commands and role definitions:
- `/vibe-check`, `/club-add`, `/curate`, `/handover`, `/ship`, `/launch`.
- `club-curator`: club content.
- `voice-auditor`: consumer copy.
- `design-keeper`: UI, tokens, motion and design-core.
- `vibe-mechanic-designer`: mechanics.
- `research-drafter`, `cohort-coordinator`, `ecosystem-planner`, `session-recapper`: bounded specialist work.

Read the applicable definition before dispatch. Old role text cannot restore a superseded product scope. Give each task an outcome, exact files, acceptance cases and verification budget. A reviewer checks the produced behavior independently; a confidence score is not a receipt.

## Invariants

- Keep the format open and bring-your-own tools. No new call platform, breakout rooms, meeting infrastructure, or default recording.
- The human hosts; AI drafts on explicit events. No automatic attendance inference, unsolicited messages, or observation.
- Extension code must not read page content.
- Music remains per-listener; preserve asset provenance.
- Session cards remain deterministic from supplied data.
- Drafting an invitation and timing plan is permitted; calendar writes and a scheduling service are different capabilities.
- Preserve TypeScript strictness, `noUncheckedIndexedAccess`, Server Components by default, and the existing `cn()` utility.
- Await the async Supabase server-client factory. Never treat an empty-state rendering fallback as proof that a database write works.
- Use current local design tokens; read `DESIGN.md` and `TASTE.md` before visual work.
- Keep conventional commits and the existing contribution protocol. Preserve unrelated dirty work and use an isolated branch.
- Validate inputs, authorization, bounded requests, failure states and recovery at the relevant boundary. Optional AI failure must not erase the local pack.

## Product outcome handoff

Read the Product outcome acceptance section of `AGENTS.md` for issue ownership, current policy/source revision, five independent quality verdicts and adoption evidence. Preserve local product scope and release gates.
