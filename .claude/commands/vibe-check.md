---
description: Full pre-flight. Runs voice-audit, club validation, typecheck, and build. Exit non-zero on any failure.
---

Run the canonical pre-ship gate. Use before promoting to production or before opening a PR that touches consumer surfaces.

Execute in this exact order — stop at the first failure:

```bash
# 1. Voice audit — enforces the five-word vocabulary across consumer surfaces
pnpm audit:voice

# 2. Club frontmatter validation — enforces content/clubs/*.md schema
pnpm audit:clubs

# 3. Format check (cheap, catches untouched drift)
pnpm format:check

# 4. Typecheck (strict, no any, no @ts-ignore)
pnpm typecheck

# 5. Build (turbopack + Next production bundle)
pnpm build
```

If any step fails, report the failure mode and the first three lines of error output. Do not try to fix automatically — surface the diagnosis.

If all steps pass, report:

```
✓ voice        — no forbidden vocabulary in consumer surfaces
✓ clubs        — <N> listings all pass frontmatter schema
✓ format       — prettier clean
✓ typecheck    — zero errors
✓ build        — <N> routes built (<N> static / <N> dynamic)

Ship checklist next: ./claude/commands/ship.md
```

## Why these gates exist

- **Voice audit** — catches drift into marketing-speak or capital-noun feature names before it ships to production. Rules in `VISION.md §Voice`, enforced by `scripts/voice-audit.mjs`.
- **Club validation** — every new club listing passes frontmatter schema before reaching `/explore`. Rules in `content/clubs/README.md`, enforced by `scripts/validate-clubs.mjs`.
- **Format / typecheck / build** — normal CI gates. Turbopack + strict TS + noUncheckedIndexedAccess means most runtime bugs die at compile.

## When to skip

If you're on a pure `docs/` change, `pnpm audit:clubs` and the build are waste. Run just `pnpm audit:voice` and move on. Any content in `apps/web/` or `content/` → full check.
