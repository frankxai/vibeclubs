# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

**Before anything else, read `VISION.md`.** It is the durable north star — philosophy, differentiators, vetoes, decision heuristics. Every scope-affecting decision must reconcile with it.

Second file to read: **`docs/ops/README.md`**. It documents the ops harness — scripts, slash commands, Claude agents, CI workflows — so you can dispatch the right subagent / run the right script without asking.

## Commands

pnpm workspaces, Turborepo, Node ≥ 20, pnpm ≥ 9.

```bash
pnpm install                      # bootstrap monorepo
pnpm dev                          # apps/web (Next.js on :3000)
pnpm dev:extension                # apps/extension (Plasmo)
pnpm dev:all                      # both in parallel (Turbo)
pnpm build                        # turbo run build
pnpm lint                         # turbo run lint
pnpm typecheck                    # turbo run typecheck
pnpm test                         # turbo run test (not wired yet)
pnpm format                       # prettier --write .
pnpm format:check                 # prettier --check .

# Ops harness — docs/ops/README.md
pnpm audit:voice                  # scripts/voice-audit.mjs — voice-system scan
pnpm audit:clubs                  # scripts/validate-clubs.mjs — frontmatter schema
pnpm audit:all                    # both audits
pnpm new:club                     # scripts/new-club.mjs — interactive club scaffold

# Target a single workspace
pnpm --filter @vibeclubs/web <cmd>
pnpm --filter @vibeclubs/extension <cmd>
pnpm --filter @vibeclubs/vibe-mix <cmd>
pnpm --filter @frankx/design-core <cmd>
```

## Ops harness — the short version

| Slash command | What it does |
|---|---|
| `/vibe-check` | Full pre-flight — voice + clubs + format + typecheck + build |
| `/club-add` | Interactive scaffold for a new `content/clubs/*.md` |
| `/curate <slug>` | Dispatch the club-curator agent on a listing |
| `/handover` | Write today's handover to `docs/ops/HANDOVER-<date>.md` |
| `/ship` | Classic pre-ship runbook |
| `/launch` | Full launch-day checklist |

| Agent (dispatch via Agent tool) | When to use |
|---|---|
| `club-curator` | Any PR touching `content/clubs/*.md` |
| `voice-auditor` | Any consumer copy change |
| `vibe-mechanic-designer` | Brainstorming or reviewing a new mechanic |
| `design-keeper` | UI / token / motion / 3D / design-core change |
| `research-drafter` | Drafting an applied-research post |
| `cohort-coordinator` | Planning a cohort format |
| `ecosystem-planner` | Deciding which repo owns a new feature |
| `session-recapper` | End-of-session handover doc |

Specs at `.claude/agents/<name>.md`. CI workflows at `.github/workflows/`. Voice system canon at `.claude/skills/voice/SKILL.md` (auto-loads).

Dev requires `apps/web/.env.local` populated per `apps/web/.env.example`. The site renders without Supabase configured (empty states), but `/start`, `/api/clubs`, `/api/sessions`, and `/api/witness` all require live credentials. See `ENVIRONMENT.md` for the full provisioning checklist.

There is no test runner wired yet. Do not invent one without reading `CONTRIBUTING.md` — it specifies Vitest for logic and Playwright for room flows, but neither is installed.

## Architecture — one paragraph

**ADR-002 (format, not platform)** is the active architecture. The product is three surfaces: `apps/web` (directory + playbook + API on Next.js 16), `apps/extension` (Plasmo Manifest V3 Chrome extension that injects a vibe-mixer + synced Pomodoro overlay onto any page), and `packages/*` (framework-agnostic OSS primitives on npm). The extension is the runtime — NOT the web app. The web app is a directory and content layer; the live experience happens wherever the user already is (Meet/Discord/Zoom/IRL) with the extension overlaying audio + timer.

`ADR-001-PLATFORM-STACK.md` is **superseded**. `apps/web/app/r/[room]/page.tsx` is a legacy LiveKit skeleton preserved only for a hypothetical Phase 4. Do not extend it.

## Repo map

```
apps/
  web/                           Next.js 16 + React 19 + Tailwind 4 site
    app/                         App Router pages
      page.tsx                   Landing
      start/                     Club creation wizard (/start)
      explore/                   Club directory (/explore)
      club/[slug]/               Club detail page
      u/[handle]/                User profile
      playbook/                  Playbook index + [slug] entries
      extension/                 Extension landing
      developers/                OSS packages landing
      api/clubs/                 POST create club
      api/sessions/              POST log session
      api/witness/               POST witness event → Claude streaming
      r/[room]/                  LEGACY ADR-001, do not extend
    components/                  nav, footer, club-card
    lib/supabase/                server.ts, client.ts, types.ts
    lib/cn.ts                    tailwind-merge helper

  extension/                     Plasmo / Manifest V3
    popup.tsx                    Club slug selector
    contents/overlay.tsx         Content-script overlay UI
    contents/overlay.css         Overlay styles
    background.ts                Service worker + API proxy

packages/
  vibe-mix/                      Web Audio 3-layer mixer (ambient/music/page)
  pomodoro-sync/                 State machine + Supabase Realtime broadcast
  ai-witness/                    Claude witness prompt builder (no network)
  session-card/                  SVG session card renderer
  suno-bridge/                   Suno API wrapper with fallback

supabase/
  migrations/20260419000000_init.sql   Schema + RLS
  config.toml                    Supabase CLI config

docs/
  architecture.md                System design
  getting-started.md             Dev loop
  extension.md                   Extension dev guide
  self-host.md                   Phase 4 placeholder
```

## Non-obvious conventions

- **TypeScript strict everywhere.** `tsconfig.base.json` enables `noUncheckedIndexedAccess` — array access returns `T | undefined`. Destructuring with defaults is the norm.
- **Server Components by default** in `apps/web`. `"use client"` only where state or browser APIs are required (e.g., `start/start-form.tsx`, `lib/supabase/client.ts`).
- **Supabase server client** is an async function (`createSupabaseServerClient`) because Next 15+'s `cookies()` is async. Always `await` it.
- **Supabase env-var soft-fallback.** `apps/web/app/explore/page.tsx` and `app/club/[slug]/page.tsx` return empty data when `NEXT_PUBLIC_SUPABASE_URL` is unset, so the site renders during design without a provisioned DB.
- **Packages use `"main": "./src/index.ts"`**, not a compiled `dist/`. `next.config.mjs` has `transpilePackages` for them. This keeps the inner dev loop zero-build.
- **`tailwind-merge` via `@/lib/cn`** — use `cn()` for conditional class composition, not raw string concatenation.
- **Design tokens** live in `apps/web/app/globals.css` under `@theme { }`. Use `--color-vibe-amber` / `--color-vibe-bg` / `--color-vibe-purple`.
- **Conventional Commits** (`feat:`, `fix:`, `docs:`, `refactor:`). See `CONTRIBUTING.md`.

## Key invariants (from VISION.md, enforce on review)

1. **No WebRTC / LiveKit in `apps/web` new work.** ADR-002 killed this direction.
2. **No payments in Sprint 1.** Stripe = Sprint 2. Don't scaffold billing components yet.
3. **Extension never reads page content.** Privacy model + Chrome review risk.
4. **AI witness never initiates a message to the user.** Only responds to events. Enforced by the prompt in `packages/ai-witness/src/index.ts`.
5. **Music layer is per-listener, not broadcast.** DMCA + licensing.
6. **Session cards are deterministic from data.** No per-user theming in the card generator.

## Vetoes — do not implement without a discussion

From `CONTRIBUTING.md` §"What We're Not Accepting":

- Breakout rooms
- Host controls
- Recording by default
- Calendar / scheduling / meeting features
- In-app payments on top of OSS core
- Features that belong to the Arcanean hosted tier

If in doubt, it's a no. These are load-bearing constraints.

## Sprint context

`SPRINT-1-PLAN.md` is the active plan (Apr 17 – May 14 2026, tickets VBC-21 → VBC-40). When the user references a VBC-XX ticket, that file has the scope, dependencies, and gate criteria.

## What's scaffolded vs. what's real

Scaffolded with real logic that runs (once credentials land):
- All web pages + API routes
- Supabase migration + RLS
- All five OSS packages (actual Web Audio / Realtime / SVG / Claude prompt logic)
- Extension overlay with working mixer + Pomodoro hooks

Stubs / placeholders (needs the next conversation):
- Supabase client migration SQL is idempotent but not yet run against a real project
- `packages/vibe-mix` ambient presets have no URLs — needs CDN seeded
- `packages/suno-bridge` endpoint shape is informed guess, pending Suno API access
- Extension icon is a text placeholder (replace before Web Store submission)
- `apps/web/.env.local` is unpopulated

## What Claude should do next

### If `.env.local` exists with Supabase credentials:
1. Run `pnpm dev` — verify landing page renders with data
2. Test Supabase auth round-trip (magic link → user row created → session)
3. Test `/api/clubs` POST → club appears in `/explore`
4. Seed ambient preset URLs in `packages/vibe-mix/src/index.ts` (upload 5 royalty-free loops to Vercel Blob, update the `presets` map)
5. Test extension overlay loads on a page (`pnpm dev:extension` → Chrome → load unpacked)
6. Wire Pomodoro sync: open extension on two tabs in same club, verify timer sync via Realtime
7. Test `/api/witness` POST with Anthropic key → Claude streaming response
8. Test session card SVG render from a completed session
9. If Suno API key present: test `packages/suno-bridge` generate call; if not, verify fallback path

### If `.env.local` does NOT exist:
Frank needs to provision credentials first. See `ENVIRONMENT.md` for the full checklist. The site renders without Supabase (empty states), but all interactive features are blocked.

### Sprint position (updated Apr 20, 2026)
All scaffold code is written. Sprint 1 (VBC-21 → VBC-40) is tracked in Linear under the [Vibeclubs project](https://linear.app/arcanea/project/vibeclubsai-the-format-for-vibing-together-8e5e98aa9b13). VBC-21 (scaffolding) is effectively complete — the monorepo, pages, extension, packages, and migration all exist. Next ticket to close is VBC-22 (run migration against a real Supabase project) which requires credentials.

### Linear issue mapping
| VBC | Linear | Title |
|-----|--------|-------|
| VBC-21 | ARC-143 | Project scaffolding |
| VBC-22 | ARC-144 | Supabase schema |
| VBC-23 | ARC-145 | Supabase Auth |
| VBC-24 | ARC-146 | Landing + /playbook |
| VBC-25 | ARC-147 | Extension scaffold |
| VBC-26 | ARC-148 | Supabase client in extension |
| VBC-27 | ARC-159 | Extension VibeMixer |
| VBC-28 | ARC-149 | Pomodoro sync |
| VBC-29 | ARC-150 | /start wizard |
| VBC-30 | ARC-151 | /explore directory |
| VBC-31 | ARC-152 | /club/[slug] page |
| VBC-32 | ARC-153 | Suno integration |
| VBC-33 | ARC-154 | Session tracking |
| VBC-34 | ARC-155 | Session cards |
| VBC-35 | ARC-157 | /u/[user] profile |
| VBC-36 | ARC-156 | Tool recommendations |
| VBC-37 | ARC-158 | OSS npm packages |
