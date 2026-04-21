# Getting Started

Zero-to-dev-loop in 5 minutes.

## Prerequisites

- Node ≥ 20
- pnpm ≥ 9
- A Supabase project (free tier fine) — see [../ENVIRONMENT.md](../ENVIRONMENT.md)
- Anthropic API key (for AI witness — optional for first pass)

## Clone + install

```bash
git clone https://github.com/frankxai/vibeclubs
cd vibeclubs
pnpm install
```

## Configure the web app

```bash
cp apps/web/.env.example apps/web/.env.local
# Fill NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY
```

The site will render without Supabase configured — `/explore` and `/club/[slug]` show an empty-state that guides you to `ENVIRONMENT.md`.

## Run the schema migration

Either paste `supabase/migrations/20260419000000_init.sql` into the Supabase SQL editor, or:

```bash
supabase link --project-ref <your-ref>
supabase db push
```

## Run dev

```bash
pnpm dev              # Next.js on :3000
pnpm dev:extension    # Plasmo-dev for the Chrome extension
pnpm dev:all          # Both in parallel
```

## Commands

```bash
pnpm build            # Build everything via Turbo
pnpm lint             # Lint all workspaces
pnpm typecheck        # tsc --noEmit everywhere
pnpm test             # Not wired yet
pnpm format           # Prettier write
pnpm format:check     # Prettier check (CI)
```

Target a single workspace:

```bash
pnpm --filter @vibeclubs/web <cmd>
pnpm --filter @vibeclubs/extension <cmd>
pnpm --filter @vibeclubs/vibe-mix <cmd>
```

## Develop the extension

1. `pnpm dev:extension`
2. Open `chrome://extensions` → Developer mode on → Load unpacked → point to `apps/extension/build/chrome-mv3-dev`
3. Pin the Vibeclubs icon. Click it. Set a club slug.
4. Open Meet/Discord/YouTube — the overlay should appear bottom-right.

## Design tokens

The web app uses Tailwind 4 with CSS-variable tokens defined in `apps/web/app/globals.css`:

- `--color-vibe-bg` — `#0a0a0f` (background)
- `--color-vibe-amber` — `#f59e0b` (primary accent)
- `--color-vibe-purple` — `#a855f7` (secondary accent)

Prefer tokens over one-off colors.

## Code style

- TypeScript strict. No `any`, no `@ts-ignore`. See `CONTRIBUTING.md`.
- Conventional Commits: `feat:`, `fix:`, `docs:`, `refactor:`.
- Server Components by default in `apps/web`. Opt into `"use client"` with a reason.
