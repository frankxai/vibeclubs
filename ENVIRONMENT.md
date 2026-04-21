# Environment Setup — Frank's Checklist

> This is the single list of things only you can do. Claude can't click OAuth buttons or paste credit cards. Everything below unlocks the next layer of Sprint 1 work.

---

## 0. Git (local)

The repo is not yet a git repo. When you're ready:

```bash
cd /c/Users/frank/vibeclubs.ai
git init -b main
git add .
git commit -m "chore: bootstrap vibeclubs monorepo (Sprint 1, ADR-002)"
git remote add origin git@github.com:frankxai/vibeclubs.git
git push -u origin main
```

Claude intentionally did **not** run `git init` — that's a repo-shape decision you should own.

## 1. Supabase (P0 — unblocks VBC-22, VBC-23, VBC-28, VBC-33)

| Step | What | Where |
|---|---|---|
| 1.1 | Create project `vibeclubs-prod` at [supabase.com](https://supabase.com) | EU-West region recommended (Frank is in Europe, lower latency) |
| 1.2 | Run the migration in `supabase/migrations/20260419000000_init.sql` | SQL editor → paste → run, *or* `supabase db push` via CLI |
| 1.3 | Enable Magic Link + Google provider in Auth → Providers | Redirect URL: `http://localhost:3000/auth/callback` and `https://vibeclubs.ai/auth/callback` |
| 1.4 | Copy URL + anon key + service role key into `apps/web/.env.local` | See `apps/web/.env.example` for exact var names |
| 1.5 | Enable Realtime on the `sessions` table (for session-tracking) and the broadcast feature (for Pomodoro sync — broadcast is always on, no config needed) | Database → Replication |

## 2. Anthropic (P0 — unblocks VBC-33 / AI witness)

| Step | What |
|---|---|
| 2.1 | [console.anthropic.com](https://console.anthropic.com) → Create API key `vibeclubs-prod` |
| 2.2 | Set monthly budget cap at $50 (witness is low-volume; alarm at $25) |
| 2.3 | Drop into `ANTHROPIC_API_KEY` in `apps/web/.env.local` |
| 2.4 | Same key will be reused by the Chrome extension via a signed-JWT proxy on `/api/witness` — don't ship the key to the extension directly |

## 3. Suno (P1 — unblocks VBC-32 / premium music gen)

| Step | What |
|---|---|
| 3.1 | Check Suno API access at [suno.com/developers](https://suno.com/developers) — if private beta, request access |
| 3.2 | If unavailable: fall back to curated royalty-free lo-fi on Vercel Blob (`packages/vibe-mix` supports both via same interface) |
| 3.3 | Set `SUNO_API_KEY` in `apps/web/.env.local` |

## 4. Vercel (P0 — unblocks VBC-38)

| Step | What |
|---|---|
| 4.1 | Import `frankxai/vibeclubs` at [vercel.com/new](https://vercel.com/new) |
| 4.2 | Framework: Next.js. Root directory: `apps/web`. Build: `pnpm build --filter=@vibeclubs/web`. Install: `pnpm install` |
| 4.3 | Paste all env vars from `apps/web/.env.local` into Vercel project settings |
| 4.4 | Bind domain `vibeclubs.ai` (and `www.vibeclubs.ai` → redirect) |
| 4.5 | Enable Vercel Analytics + Speed Insights (free tier ok) |

## 5. Chrome Web Store (P0 — unblocks VBC-38)

| Step | What |
|---|---|
| 5.1 | Pay $5 one-time developer fee at [chrome.google.com/webstore/devconsole](https://chrome.google.com/webstore/devconsole) |
| 5.2 | Submit extension from `apps/extension/build/chrome-mv3-prod` (produced by `pnpm -F @vibeclubs/extension build`) |
| 5.3 | Listing copy: see `apps/extension/listing.md` (to be written Week 4) |
| 5.4 | Expect 1–3 day review. Ship an **unlisted** version first for `/extension` download flow while review is pending |

## 6. Spotify / YouTube (deferred per ADR-002)

Per-listener embeds were removed from v1 in ADR-002 — Suno is the music source. Spotify/YouTube return as a v2 "BYO music" toggle. **Do not** provision API keys yet.

## 7. LiveKit (deferred to Phase 4 per ADR-002)

The `apps/web/app/r/[room]/page.tsx` legacy skeleton references `LIVEKIT_API_KEY`. If you want to delete it now (cleaner), Claude can remove it and the env vars. Otherwise leave the env vars blank — the homepage doesn't touch them.

---

## Provisioning priority order

1. Supabase → unblocks auth + schema + Realtime (most of Sprint 1)
2. Vercel project import → unblocks previews per PR
3. Anthropic → unblocks AI witness
4. Chrome Web Store dev fee → unblocks extension submission Week 4
5. Suno → unblocks premium music layer (nice-to-have; fallback exists)

## What Claude will do once credentials land in `.env.local`

- Wire up Supabase server + browser clients and test auth magic-link end-to-end
- Run the migration via Supabase CLI (or generate the SQL for you to paste)
- Implement the `/start` → `create club` database round-trip
- Implement Pomodoro sync over Realtime broadcast
- Implement AI witness `/api/witness` streaming endpoint with prompt caching

Tell Claude "credentials are in" when you're ready and it will continue.
