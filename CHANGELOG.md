# Changelog

Notable changes to Vibeclubs. Dates are YYYY-MM-DD. This project follows
[Keep a Changelog](https://keepachangelog.com/) and uses conventional commits.

## [Unreleased]

> Release candidate: `v0.2.0` at
> `417dc5185e7175e365323483808bf38032f2abaa`. This is not a published tag or
> GitHub release. See [`docs/releases/release-ledger.json`](docs/releases/release-ledger.json)
> for the machine-readable release state.

### Added

- `/start` host-pack studio: six craft paths, editable finishes, timed agendas,
  device-local drafts, private crew invites, v0 prompts, agent briefs, and Markdown export.
- Optional structured AI brief refinement with authenticated daily quotas and bounded
  requests. Disabled until its database migration and production configuration are verified.
- Product and Vercel/v0/agent engineering roadmap in
  `docs/strategy/start-studio-engineering.md`.
- 41 tests for host-pack invariants and the optional AI route.

- Full design system scaffolding in `apps/web/components/ui/*` — Button, Input, Card,
  Badge, Fader, TimerDisplay, PlatformPill, TypePill, CodeBlock, Dialog,
  Tooltip, Toast, Skeleton, Avatar, Kbd.
- Layout primitives in `apps/web/components/layout/container.tsx` — Container,
  Section, Eyebrow, PageHeader.
- Composition patterns: FeatureCard, StatBlock, Fact, TierCard, EmptyState,
  SessionCardPreview, Prose, AuroraBg.
- Club template system — six pre-filled templates picked via `?template=<id>`
  on `/start`. See `apps/web/lib/club-templates.ts`.
- Chrome extension: tabbed overlay (Timer / Mixer / Settings), keyboard
  shortcuts (⌘J, ⌘K, ⌘⇧M), duck-on-voice toggle, AI-recap toggle, inline
  recap stream display.
- New routes: `/signin`, `/auth/callback`, `/privacy`, `/terms`, `/not-found`.
- `/api/og` — dynamic OpenGraph image generator using `next/og`.
- `/api/recap` — Claude-powered streaming recap endpoint (replaces
  `/api/witness` UI-side; package name `@vibeclubs/ai-witness` retained).
- Testing: Vitest root config, per-package unit tests (ai-witness,
  session-card, suno-bridge, pomodoro-sync, vibe-mix), Playwright smoke.
- CI: GitHub Actions workflow (lint / typecheck / test / build).
- Dev tooling: `.editorconfig`, `.nvmrc`, `.npmrc`, `.vscode/settings.json`,
  `.vscode/extensions.json`.

### Changed

- `/start` now works without an account or hosted database. Public listings remain
  a separate action. Template links preserve saved drafts across reloads.
- Upgraded web AI SDK from 4 to 6 and Anthropic provider from 1 to 3.

- Entire web app rewritten against the five-word voice system
  (vibeclub / host / crew / lock in / ship) — see `VISION.md`.
- Canonical hero: "Host a vibeclub." with subhead
  "Claude Code + your crew + a soundtrack."
- Tailwind v4 tokens expanded to cover surfaces, borders, shadows,
  typography scale, motion primitives.
- README rewritten around the voice-system hero.

### Removed

- Legacy LiveKit `livekit-server-sdk` dependency from `apps/web`; the
  `/r/[room]` skeleton is retained but dormant for Phase 4.
- `/api/witness` (renamed to `/api/recap`; extension updated).

## [0.1.0] — 2026-04-16

### Added

- Monorepo scaffolding (pnpm + Turbo + Next.js 16 + React 19).
- Supabase migration + RLS in `supabase/migrations/`.
- Five OSS packages with working logic (vibe-mix, pomodoro-sync, ai-witness,
  session-card, suno-bridge).
- Plasmo Chrome extension scaffold.
- ADR-001, ADR-002, SPRINT-1-PLAN, VISION, ENVIRONMENT, CLAUDE.md.
