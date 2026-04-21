# Architecture

Vibeclubs is a *format*, not a platform (see `ADR-002-FORMAT-NOT-PLATFORM.md`). The codebase reflects that.

```
┌────────────────────────────────────────────────────────────────┐
│                    vibeclubs.ai (apps/web)                     │
│                    Next.js 16 · Vercel Edge                    │
├─────────────┬──────────────┬──────────────┬───────────────────┤
│  PLAYBOOK   │  DIRECTORY   │  PROFILES    │  API              │
│             │              │              │                   │
│  /playbook  │  /explore    │  /u/[handle] │  /api/clubs       │
│  /playbook/ │  /start      │              │  /api/sessions    │
│    [slug]   │  /club/[slug]│              │  /api/witness     │
└─────────────┴──────┬───────┴──────┬───────┴────────┬──────────┘
                     │              │                │
              ┌──────▼──────────────▼────────────────▼──────────┐
              │              Supabase                            │
              │  Auth · Postgres · Realtime · (Storage later)   │
              └─────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│           apps/extension  (Plasmo / Manifest V3)               │
│                                                                │
│  Content script overlay (contents/overlay.tsx)                 │
│  ├─ @vibeclubs/vibe-mix       three-layer Web Audio mixer      │
│  ├─ @vibeclubs/pomodoro-sync  Supabase Realtime broadcast      │
│  ├─ @vibeclubs/ai-witness     Claude witness prompts           │
│  ├─ @vibeclubs/session-card   session card SVG generator       │
│  └─ @vibeclubs/suno-bridge    Suno API wrapper                 │
│                                                                │
│  background.ts  proxies /api/witness and /api/sessions calls   │
│  popup.tsx      set active club slug                           │
└────────────────────────────────────────────────────────────────┘
```

## Data flow: a session end-to-end

1. **Opener creates a club** on `vibeclubs.ai/start`. Writes a row to `clubs` with RLS policy `clubs_insert_self`.
2. **Builder discovers** the club on `/explore` or via direct link. No account needed to browse.
3. **Builder installs** the Chrome extension. Opens popup. Enters `lofi-coders` as slug. `chrome.storage.local` saves it.
4. **Builder opens** Google Meet / Discord / YouTube / any page. The Plasmo content script injects the overlay.
5. **Builder clicks Start.** The overlay calls `createMixer()` (needs user gesture for AudioContext) and `createPomodoro({ clubId, preset })`.
6. **Pomodoro broadcasts** its state to `club:{slug}:pomodoro` via Supabase Realtime. Any other extension user with the same slug subscribes and follows along.
7. **At session end**, the overlay POSTs a session summary to `vibeclubs.ai/api/sessions` via the background service worker. The session card is rendered from `@vibeclubs/session-card` and uploaded to Supabase Storage (Phase 2).
8. **The witness** (if enabled) calls `/api/witness` with each Pomodoro event. That endpoint streams a Claude completion using `@vibeclubs/ai-witness`.

## Why this shape

- **Separation of concerns.** The site is a directory. The extension is the runtime. The packages are the reusable core. Nobody is tempted to cram features into the wrong layer.
- **OSS surface is the packages.** People can embed the vibe mixer in their Electron app, their Raycast extension, their own website — without running the Vibeclubs site.
- **The site has no live-room code.** The `apps/web/app/r/[room]/page.tsx` file is legacy from ADR-001 and preserved only for Phase 4. New work does not add live-room features to the site.

## Key invariants

| Invariant | Why |
|---|---|
| No WebRTC / LiveKit in `apps/web` (live-room scaffold preserved but dormant) | ADR-002 killed the platform path |
| No payments in Sprint 1 | Sprint 1 is format validation; Stripe = Sprint 2 |
| Extension never reads page content | Privacy model; also a Chrome Web Store review risk |
| AI witness never initiates a message to the user | Philosophy rule #4 — witness, don't host |
| Music layer is per-listener (not broadcast) | DMCA; licensing impossibility |
| Session card image is deterministic from data | Shareable brand consistency |

## Phase boundaries

- **Phase 1 (Sprint 1, Apr 17 – May 14 2026):** Site + extension + OSS packages. Free tier only.
- **Phase 2 (Sprint 2):** Stripe, Suno premium, analytics dashboard.
- **Phase 3 (Sprint 3):** Partnerships (Suno, Replit, Arcanea). Ecosystem integrations.
- **Phase 4 (Month 3+):** *Optional* native rooms. Revives `apps/web/app/r/[room]/page.tsx`, adds LiveKit. Only if demand proves ("we want integrated rooms, not Meet").
