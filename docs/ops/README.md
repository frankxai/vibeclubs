# Ops

Everything a human or agent needs to operate this repo without asking permission. Discoverable by Claude Code sessions via `CLAUDE.md` + `.claude/`. Enforced by GitHub Actions.

## The harness — one screen

| Layer | Where | What it does |
|---|---|---|
| **Scripts** | `scripts/*.mjs` | Node 20 ESM scripts that run in CI and locally |
| **Slash commands** | `.claude/commands/*.md` | What Frank / Claude invoke with `/` — ship, vibe-check, curate, handover |
| **Agents** | `.claude/agents/*.md` | Specialized subagents Claude dispatches — club-curator, voice-auditor, etc. |
| **Skills** | `.claude/skills/*/SKILL.md` | Auto-loaded behavior — voice system today |
| **Workflows** | `.github/workflows/*.yml` | CI gates — quality, voice-audit, club-validate, release-packages |
| **Handovers** | `docs/ops/HANDOVER-*.md` | Session-to-session continuity |
| **Memory** | `~/.claude/projects/C--Users-frank-vibeclubs-ai/memory/*.md` | Persistent user + project context (outside repo) |

## The commands you'll run most

```bash
pnpm audit:voice     # voice-system scan across consumer surfaces
pnpm audit:clubs     # frontmatter schema on content/clubs/*.md
pnpm audit:all       # both above
pnpm new:club        # interactive scaffold — new content/clubs/<slug>.md
pnpm build           # Next production build via Turbopack
pnpm typecheck       # strict TS, noUncheckedIndexedAccess
pnpm dev             # apps/web on :3000
pnpm dev:extension   # Plasmo extension HMR
```

## The slash commands (invoke with `/` in Claude Code)

| Command | What it does |
|---|---|
| `/vibe-check` | Full pre-flight — voice + clubs + format + typecheck + build |
| `/club-add` | Interactive scaffold for a new `content/clubs/*.md` |
| `/curate <slug-or-pr>` | Dispatch club-curator on a listing |
| `/handover` | Write today's handover to `docs/ops/HANDOVER-<date>.md` |
| `/ship` | The classic pre-ship runbook |
| `/launch` | Full launch-day checklist |
| `/migrate` | Run supabase migration |
| `/seed` | Seed directory with internal clubs |
| `/voice-audit` | Legacy ripgrep-based audit (superseded by `pnpm audit:voice`) |

## The agents (dispatched via the Agent tool)

| Agent | When to use |
|---|---|
| `club-curator` | Any PR touching `content/clubs/*.md` |
| `voice-auditor` | Any consumer copy change — marketing, MDX, tweet, email |
| `vibe-mechanic-designer` | Brainstorming or reviewing a new vibe mechanic |
| `design-keeper` | UI / token / motion / 3D / design-core change |
| `research-drafter` | Drafting an applied-research post (full or cross-post) |
| `cohort-coordinator` | Planning a cohort format + gencreator handshake |
| `ecosystem-planner` | Deciding which repo owns a new feature |
| `session-recapper` | End-of-session handover doc |

Each agent has a canonical spec at `.claude/agents/<name>.md`. Read the spec before dispatching.

## The workflows (CI gates on every PR)

| Workflow | Triggers on | What fails the build |
|---|---|---|
| `ci.yml` | All PRs + main push | format, lint, typecheck, test, build |
| `voice-audit.yml` | `apps/**`, `content/**`, `README.md` | any forbidden vocabulary in consumer copy |
| `club-validate.yml` | `content/clubs/**` | malformed frontmatter, missing required fields, wrong enum values |
| `release-packages.yml` | `v*.*.*` tag or `@vibeclubs/*@*` / `@frankx/design-core@*` tag | npm publish failure |

## Failure-mode runbook

### "`pnpm audit:voice` fails on my PR"

The audit script (`scripts/voice-audit.mjs`) found a forbidden word in a consumer surface. Options in order of preference:

1. **Rewrite using the five words** (vibeclub / host / crew / lock in / ship).
2. **Check if it's a denial** ("not a community", "no rooms"). If yes but the audit still fires, the denial keyword might be > 4 lines away — move it closer or inline the negation.
3. **Line-level ignore** — add `<!-- voice-audit: allow -->` on the same line if it's a legitimate meta-use (rare).
4. **File-level carve-out** — add to `SKIP_PATHS` in `scripts/voice-audit.mjs`. This is a brand-loudness cost; use sparingly.

### "`pnpm audit:clubs` fails on my PR"

Read the error — it's specific. Most common:

- `host` doesn't start with `@`
- `platform` / `type` / `preset` / `ambient` uses an invalid enum value
- `body` too short (< 60 chars)
- `platform_url` isn't `http(s)://`

Schema is canonical in `content/clubs/README.md`.

### "I want to add a new forbidden word"

1. Add to `FORBIDDEN` or `FORBIDDEN_PHRASES` in `scripts/voice-audit.mjs`.
2. Update `VISION.md §Voice — forbidden vocabulary` section.
3. Update `.claude/skills/voice/SKILL.md`.
4. Scan the repo for existing uses and rewrite.
5. Commit all four changes together.

### "I want to add a new preset"

1. Add to `Preset` union in `packages/pomodoro-sync/src/index.ts`.
2. Add to `PRESET_SEQUENCES` and `PRESET_BPM` in the same file.
3. Mirror in `apps/web/lib/supabase/types.ts` → `PomodoroPreset`.
4. Mirror in `apps/web/app/api/clubs/route.ts` → Zod enum.
5. Mirror in `apps/web/components/club-card.tsx` → `prettyPreset`.
6. Mirror in `apps/web/app/club/[slug]/page.tsx` → `prettyPreset`.
7. Add to `scripts/validate-clubs.mjs` → `PRESETS` constant.
8. Consider adding a club-templates entry in `apps/web/lib/club-templates.ts`.
9. Add a template vibeclub in `content/clubs/<slug>.md` that uses it.
10. Document in `docs/strategy/vibe-mechanics.md §The four new presets`.

## Where the handovers live

Most recent first:

- `docs/ops/HANDOVER-2026-04-23.md` — vibe-mechanics + autonomous fork + design-core + ops harness (this session)
- `docs/ops/HANDOVER-2026-04-21.md` — repo bootstrap + GitHub push

Each handover is self-contained — a future session can pick up from any of them cold.

## Memory entries (outside this repo)

User + project memory lives at `~/.claude/projects/C--Users-frank-vibeclubs-ai/memory/`:

- `MEMORY.md` — index, loaded automatically on session start
- `user_role.md` — Frank's role + ecosystem context
- `project_architecture.md` — ADR-002 posture
- `project_sprint.md` — active sprint context
- `project_ecosystem_map.md` — cross-brand constellation
- `feedback_collaboration.md` — how Frank wants to collaborate
- `feedback_voice.md` — voice system memory
- `reference_north_star.md` — read VISION.md first

A cold-starting Claude reads `MEMORY.md` → follows the pointers → then reads `CLAUDE.md` → then reads this file.
