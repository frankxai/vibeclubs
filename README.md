# Vibeclubs

> **Claude Code + your crew + a soundtrack. Host a vibeclub.**
>
> Free. Open source. MIT. The local proof works now; hosted accounts, public extension distribution, and registry packages are still closed.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-16-black.svg)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%2B%20Realtime-green.svg)](https://supabase.com)

---

## What this is

A vibeclub is what your crew does when you all have something to ship. It's a **format** — like hackathon or book club — that runs on whatever platform you already use (Meet, Discord, Zoom, IRL).

The extension source contains:

- **Three-fader mixer** — Web Audio controls; verified public audio files are still needed
- **Timer engine** — local by default; Realtime sync needs a configured build
- **Optional recap** — disclosed and opt-in; saved profile history is not wired
- **Content script** — matches HTTP and HTTPS pages in a developer build

Read [VISION.md](./VISION.md) for the why and the voice system. Read [ADR-002-FORMAT-NOT-PLATFORM.md](./ADR-002-FORMAT-NOT-PLATFORM.md) for the architectural call.

---

## Repo map

```
vibeclubs.ai/
├── apps/
│   ├── web/                     Next.js 16 site (directory + how-it-works + API)
│   └── extension/               Plasmo Chrome extension (Manifest V3)
├── packages/
│   ├── vibe-mix/                Three-layer Web Audio mixer
│   ├── pomodoro-sync/           Supabase Realtime pomodoro state machine
│   ├── ai-witness/              Claude prompt builder for session recaps
│   ├── session-card/            SVG session card generator
│   └── suno-bridge/             Suno API wrapper (+ caller-supplied fallback)
├── supabase/
│   └── migrations/              SQL schema
├── docs/                        Architecture, getting-started, extension dev guide
├── ADR-001-PLATFORM-STACK.md    Superseded
├── ADR-002-FORMAT-NOT-PLATFORM.md  Current
├── VISION.md                    North star + voice system
├── ENVIRONMENT.md               What Frank needs to provision
├── SPRINT-1-PLAN.md             Apr 17 – May 14 2026 tickets
├── HANDOVER-SUPERSEDED.md       Prior Cowork handover, archived
├── CLAUDE.md                    Claude Code dev guide
└── CONTRIBUTING.md              Code style + vetoes
```

## Quick start

```bash
git clone https://github.com/frankxai/vibeclubs
cd vibeclubs
pnpm install

cp apps/web/.env.example apps/web/.env.local
# Drop in Supabase + Anthropic keys — see ENVIRONMENT.md

pnpm dev              # Next.js on :3000
pnpm dev:extension    # Plasmo dev for the extension
```

Full setup: [docs/getting-started.md](./docs/getting-started.md).

## Commands

```bash
pnpm dev            # Web app
pnpm dev:extension  # Chrome extension dev build
pnpm dev:all        # Both in parallel
pnpm build          # Turbo run build
pnpm lint           # Lint
pnpm typecheck      # tsc --noEmit
pnpm format         # Prettier write
```

---

## Philosophy

1. **OSS is the product** — not a free trial. Hosted Pro adds AI compute, not core features.
2. **Does this make the vibe feel alive?** — the vibe test. If no, cut it.
3. **Bring-your-own everything.** Music, ambient, workflow, platform. Vibeclubs is the container.
4. **Claude writes recaps, never interrupts.** One line per event. No coaching.
5. **Ship fast, break nothing.** Weekly, main-ready, feature-flagged around sessions.

Full philosophy + decision heuristics in [VISION.md](./VISION.md).

---

## Vetoes — not shipping

See [CONTRIBUTING.md](./CONTRIBUTING.md):

- Breakout rooms
- Host controls
- Recording by default
- Calendar / scheduling / meeting features
- In-app payments on top of OSS core
- Features that belong to the Arcanean hosted tier

---

## Proposed pricing — not for sale yet

| Tier | Price | Who |
|---|---|---|
| Free | $0 | Everyone, forever. Unlimited vibeclubs, three ambient presets, basic recap. |
| Pro | $12/mo (Sprint 2) | Suno AI music, full Claude recaps, custom mixer presets, featured club. |

No paid plan is active on the public site.

---

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md).

Good-first issues tagged `good-first-issue` on [GitHub](https://github.com/frankxai/vibeclubs/issues).

- X — [@vibeclubsai](https://x.com/vibeclubsai)

---

## License

MIT. See [LICENSE](./LICENSE).

---

**Built by [Frank Riemer](https://frankx.ai) · Part of the [Arcanea](https://arcanea.ai) ecosystem · Designed at 2am with lofi playing**
