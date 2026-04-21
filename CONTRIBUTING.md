# Contributing to Vibeclubs

Thank you for considering a contribution. Vibeclubs is built with care, and every PR gets a careful review.

## Philosophy

Before opening a PR, read the "Philosophy" section of the [README](./README.md). Every feature must pass the vibe test: *does this make the room feel more alive?*

## Setup

```bash
git clone https://github.com/frankxai/vibeclubs
cd vibeclubs
pnpm install
cp apps/web/.env.example apps/web/.env.local
pnpm dev
```

## Code Style

- **TypeScript strict mode** — no `any`, no `@ts-ignore`
- **Prettier + ESLint** — run `pnpm lint` before committing
- **Components** — colocate styles; prefer Tailwind utility classes
- **Server Components by default** — opt into client with a reason
- **Tests** — Vitest for logic, Playwright for room flows

## Commit Style

[Conventional Commits](https://www.conventionalcommits.org/):

- `feat: add spotify mixer volume control`
- `fix: pomodoro drift on long sessions`
- `docs: update self-host guide`
- `refactor: extract useRoomPresence hook`

## Opening a PR

1. Fork + branch from `main`
2. Write a clear PR description with the *why*, not just the *what*
3. Link any issues: `Closes #123`
4. Add screenshots or a Loom for UI changes
5. Make sure `pnpm lint && pnpm typecheck && pnpm test` passes

## Issue Labels

- `good-first-issue` — easy entry point
- `help-wanted` — we'd love a second set of eyes
- `vibe-test` — needs the vibe test before merge
- `v2` / `v3` — backlog, not current sprint

## What We're Not Accepting

To keep Vibeclubs coherent, we are **not** accepting PRs for:

- Calendar / meeting features (breakout rooms, scheduling, host permissions)
- Recording by default
- In-app payments on top of the OSS core
- Branded features that belong to the Arcanean hosted instance

If in doubt, open a discussion first.

## Community

- Discord: https://discord.gg/vibeclubs
- X: https://x.com/vibeclubsai
- Email: open@vibeclubs.ai

---

Built with vibes. Merged with care.
