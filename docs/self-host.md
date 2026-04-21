# Self-Host (Phase 4 placeholder)

The README historically promised a `docker compose` self-host path. Under ADR-002 (format, not platform) this is deferred to Phase 4 because the product is now primarily:

1. **A Chrome extension** — already works on anyone's browser against any Supabase instance.
2. **A Next.js directory site** — deploys to any Node host.
3. **OSS npm packages** — `npm install` anywhere.

**There is no WebRTC server to self-host in Phase 1.** The platform-layer LiveKit self-host diagram in the README belongs to ADR-001 and will return only if Phase 4 ships.

## What to self-host today

If you want to run your own Vibeclubs:

### Option A — Just the extension, against your own Supabase

1. Fork the repo.
2. Provision your own Supabase project (see [../ENVIRONMENT.md](../ENVIRONMENT.md)).
3. Build the extension with your Supabase URL/anon key baked in (edit `apps/extension/.env`).
4. Load unpacked or publish to the Chrome Web Store under your own brand.

### Option B — Full site + extension, against your own Supabase

1. Fork and deploy `apps/web` to Vercel / Fly / Railway / your own host.
2. Point your domain.
3. Ship your own extension that talks to your domain.

### Option C — Phase 4 (future)

When native WebRTC rooms ship, a `docker/self-host/` directory will land with:
- LiveKit server
- Postgres (Supabase-compatible)
- Next.js web app
- Caddy for TLS + TURN

Expected delivery: contingent on demand (see `ADR-002-FORMAT-NOT-PLATFORM.md` §"Scale path"). Do not build infrastructure assuming this path.
