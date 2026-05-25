# Launch

Everything Frank needs to ship Vibeclubs publicly the week of May 14, 2026.

| File | What |
|---|---|
| [`show-hn.md`](./show-hn.md) | Show HN post draft — title, body, first technical comment. |
| [`x-thread.md`](./x-thread.md) | Eight-tweet launch thread — hook + recap + extension + packages + CTA. |
| [`loom-script.md`](./loom-script.md) | 75-second walkthrough script for the launch video. |
| [`one-liner.md`](./one-liner.md) | Stock blurbs at four lengths — for emails, README, HN comment, hallway pitch. |

## Pre-launch checklist (May 13)

- [ ] `pnpm audit:voice` passes — the voice gate is not optional.
- [ ] `/api/og` returns a sharp 1200×630 PNG for at least 3 club slugs (test in browser).
- [ ] `/dev/cards` renders all 8 sample SVGs without overflow on 1080p.
- [ ] Production deploy on `vibeclubs.ai`, SSL valid, Lighthouse perf > 90.
- [ ] Extension installable as `.crx` sideload (Chrome Web Store unlisted is fine for day 1).
- [ ] At least 5 vibeclubs in the directory — 5 markdown ones already shipped, hosted ones bonus.
- [ ] `@frankx/design-core` and at least 2 `@vibeclubs/*` packages published to npm.
- [ ] Loom recorded, hosted, link in show-hn.md and x-thread.md.

## Launch-day order (May 15)

1. **08:00 CET** — Push final commit, verify Vercel prod deploy.
2. **09:00 CET** — Post X thread (`x-thread.md`).
3. **15:00 CET** (09:00 ET) — Post Show HN (`show-hn.md`).
4. **15:05 CET** — Drop the technical first comment under the HN post.
5. **15:30 CET** — Post the X thread to Discord communities Frank's already in.
6. **16:00 CET** — Reply to every HN comment for the first 4 hours. The first 4 hours decide.
7. **20:00 CET** — End of launch window. Rest. Read tomorrow.

## Voice reminder

Every artefact in this folder must pass `pnpm audit:voice`. Forbidden words at a glance: community, members, users, rooms, spaces, "session" (as generic consumer copy), platform, engage, connect, unlock, empower, AI-powered. The five that DO ship: vibeclub, host, crew, lock in, ship.

If a draft fails the audit, rewrite using the five words. Don't add carve-outs unless absolutely needed — see `docs/ops/README.md §Failure-mode runbook`.
