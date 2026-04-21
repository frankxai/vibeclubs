---
description: Full launch-day checklist, from build to first tweet.
---

The full Sprint 1 launch-day runbook. Work top-to-bottom. Cross off in a
comment thread as you go so the commit history records the launch.

## Pre-launch (T-24h)

- [ ] `/voice-audit` — zero off-brand hits
- [ ] `/ship` — full pre-flight
- [ ] Verify production env vars on Vercel
- [ ] Test magic-link auth end-to-end on preview
- [ ] Seed `/explore` via `/seed` — three internal clubs visible
- [ ] Hit `/api/og?slug=claude-code` manually — image renders
- [ ] Test OG on https://cards-dev.twitter.com/validator and https://linkedin.com/post-inspector
- [ ] Chrome extension: package via `pnpm --filter=@vibeclubs/extension package`
- [ ] Submit extension to Chrome Web Store (review window 1-3 days — start now)

## Launch hour (T-0)

- [ ] Promote Vercel preview → production
- [ ] Tag the release in git (`v0.1.0`) and push the tag
- [ ] Publish OSS packages: `pnpm --filter '@vibeclubs/*' publish --access public`
- [ ] Post the launch tweet (from `LAUNCH-KIT.md`)
- [ ] Post the Show HN thread
- [ ] Post to r/selfhosted, r/sideproject
- [ ] Drop in 3 Discord servers (Arcanea, FrankX, GenCreator)
- [ ] Email waitlist (if any)

## T+24h

- [ ] Respond to Show HN comments
- [ ] Post the first session card — host Frank's own vibeclub + screenshot
- [ ] Check analytics — installs, clubs, sessions
- [ ] Fix any P0 bugs same-day
- [ ] Second tweet: retrospective + what you shipped in the first 24h
