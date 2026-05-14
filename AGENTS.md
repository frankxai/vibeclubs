# vibeclubs.ai — Agent Instructions

Read `CLAUDE.md` first, then `VISION.md`, then `docs/ops/README.md`. Those files define the durable north star and the ops harness.

## Repo Role

`vibeclubs.ai` is a pnpm/Turborepo workspace for Vibeclubs: a Next.js web directory/API, Plasmo browser extension, and shared OSS primitives. The extension is the runtime; the web app is the directory and content layer.

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

