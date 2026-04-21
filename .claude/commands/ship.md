---
description: Pre-flight + deploy. Run before promoting to production.
---

Ship pipeline — run every check before the green button.

1. **Format** — `pnpm format:check`. If fails, run `pnpm format` and commit.
2. **Lint** — `pnpm lint`. Any warning blocks.
3. **Typecheck** — `pnpm typecheck`. Zero errors required.
4. **Unit tests** — `pnpm test`. All green required.
5. **Build** — `pnpm build`. Must succeed with the current env.
6. **Smoke E2E** — `pnpm test:e2e`. Optional if no UI changed.
7. **Voice audit** — grep for forbidden words in changed files:
   ```
   rg -i "community|members|rooms|spaces|revolutionize|unlock|engage" apps/web
   ```
   Every hit must be justified (or rewritten per VISION.md §voice).
8. **Vercel preview** — `vercel` (or push to a PR). Visit the preview URL.
9. **Production deploy** — `vercel --prod` (or merge the PR).

After shipping:
- Tweet the launch (template in `LAUNCH-KIT.md`).
- Update `CHANGELOG.md` under a fresh version header.
- Submit the sitemap to Google Search Console if the domain changed.

If any step fails, STOP. Diagnose, fix, re-run from step 1.
