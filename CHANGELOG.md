# Changelog

Notable changes to Vibeclubs. Dates are YYYY-MM-DD. This project follows
[Keep a Changelog](https://keepachangelog.com/) and uses conventional commits.

## [Unreleased]

### Added

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
