# Handover — Superseded

A prior Cowork session produced a detailed "build the full Vibeclubs.ai website tonight" handover that positioned Vibeclubs as an **MIT-licensed LiveKit wrapper** + hosted Cloud tier (a Clubhouse replacement play).

**That handover is dead.** `ADR-002-FORMAT-NOT-PLATFORM.md` supersedes it. The reasoning:

- LiveKit is commoditized. Another MIT-licensed live-audio wrapper doesn't bend a market.
- The cold-start problem — a room product with no users is worse than no product.
- Builders already vibeclub on Meet, Discord, YouTube. They duct-tape ambient + timer + call. Sell them the duct tape as a Chrome extension, not another platform.

## Current architecture

See `VISION.md`, `ADR-002-FORMAT-NOT-PLATFORM.md`, `CLAUDE.md`, and `SPRINT-1-PLAN.md`. Three surfaces:

1. `apps/web` — directory + how-to + profile (Next.js 16)
2. `apps/extension` — the runtime (Plasmo Chrome extension)
3. `packages/*` — five MIT npm packages (vibe-mix, pomodoro-sync, ai-witness, session-card, suno-bridge)

## What survives from the old handover

- MIT license posture (non-negotiable)
- Free-core / paid-hosted dual model (Pro tier ships Sprint 2, not Sprint 1)
- Developer-grade docs discipline (`/playbook` + `/developers` + `docs/`)
- Geist Mono for code/developer surfaces
- Signal Green `#4FD18C` for live/active states in the extension overlay

## What's burned

- `/r/[room]` and any LiveKit-backed "live room" feature on vibeclubs.ai (legacy skeleton is preserved only for a hypothetical Phase 4; do not extend)
- "Vibeclubs Cloud" as a Sprint 1 narrative (Pro, not Cloud; Sprint 2, not now)
- The 10-route IA from the old handover
- Waitlist capture on landing (bring-your-own-email; magic-link at `/signin`)

Future Cowork / Claude Code sessions: do not re-litigate this decision. If you think native WebRTC rooms should return, it's a Phase 4 discussion and it needs new proof — not a resurrected 2026-04 artifact.
