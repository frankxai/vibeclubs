# Vibeclubs Vision

> The durable north star. This file is the source of truth for *why* Vibeclubs exists and *what shape* it should take. Read this before making any scope-affecting decision.

---

## One-line pitch

**Vibeclubs is a format — like "hackathon" or "book club" — for people who want to make things together, on whatever tools they already use.**

## The insight that shaped the product

Builders already vibe together on Discord voice channels, Meet co-working calls, and lo-fi YouTube streams. They duct-tape three tools: ambient music + a timer + a call. The opportunity is **not** to replace those tools with yet another platform. It is to formalize the ritual and enhance the experience with a lightweight overlay.

> "Vibe Clubs are a system and process for vibing together... an overlay to any community... people start being like 'hey let's make a VibeClub'... with their own tools, whatever they want to use." — Frank, April 16 2026

This reframe (captured in `ADR-002-FORMAT-NOT-PLATFORM.md`) kills the cold-start problem that would have sunk a custom WebRTC platform.

## Three surfaces

1. **vibeclubs.ai** — the playbook, directory, and profile layer. Next.js 16 App Router on Vercel.
2. **Chrome extension** — the overlay. Injects vibe mixer + synced Pomodoro + session cards onto Meet, Discord, YouTube, anywhere. Plasmo / Manifest V3.
3. **OSS packages on npm** — the building blocks. `@vibeclubs/vibe-mix`, `@vibeclubs/pomodoro-sync`, `@vibeclubs/ai-witness`, `@vibeclubs/session-card`, `@vibeclubs/suno-bridge`. MIT. Work anywhere.

## Three differentiators

1. **The vibe mixer.** Three-layer Web Audio mix — ambient (shared, royalty-free), music (per-listener, Suno-generated or BYO), page audio / voice (tab volume or WebRTC). Nothing else gives you this.
2. **Pomodoro synced across a distributed room.** Everyone in the club, on whatever platform, hits the same focus block. Supabase Realtime channel keyed by club.
3. **AI witness, not AI host.** A Claude agent that notices, logs wins, and celebrates completions. Never interrupts. Never runs the session. Opt-in per club.

## Five philosophy rules (from `README.md`)

1. **OSS is the product**, not a free trial.
2. **Does this make the room feel more alive?** If no, it doesn't ship.
3. **Bring-your-own everything.** Music, ambient, workflow — Vibeclubs is the container, not the curator.
4. **Witness, don't host.** The agent never interrupts.
5. **Ship fast, break nothing.** Weekly, main-ready, feature-flagged.

## The vetoes (explicitly out of scope)

From `CONTRIBUTING.md` §"What We're Not Accepting":

- Breakout rooms
- Host controls
- Recording by default
- Calendar/meeting features
- In-app payments on top of the OSS core
- Features that belong to the Arcanean hosted tier (brand, compute-heavy AI)

If in doubt, it's a no. These are load-bearing constraints — they are *why* the product doesn't feel like Zoom.

## Who it's for

- **Vibe coders** — solo and pair programmers doing long async sessions
- **Live music producers** — Suno / Ableton / studio folks who work to music and want other makers around
- **Ambitious founders** — deep-work blocks, build-in-public energy
- **Writers doing deep work** — timed sprints, ambient presence
- **Fitness creators doing co-training** — session-based, schedule-driven
- **Arcanea retreat alumni** — staying connected between sessions

It is **not** for: meetings, webinars, classes, support calls, hiring interviews.

## Business model (ADR-002)

| Tier | Price | Who |
|---|---|---|
| Free | $0 | Everyone. 3 ambient presets, basic Pomodoro, 1 club listing, playbook access. |
| Builder | $9/mo | Premium extension. All ambient presets, Suno gen, synced Pomodoro, AI witness, session cards. |
| Opener | $29/mo | Club owners. Everything in Builder + featured listing, analytics, multi-club, scheduling. |
| Partnerships | B2B | Suno, Replit/Cursor, Arcanea, enterprise. Revenue share and affiliates. |

Monthly infra cost at launch: **$15–$195/mo**. Break-even at 2–22 Builder subscribers. This is a zero-capital launch.

## Ecosystem fit

Vibeclubs is **connective tissue** for Frank's five-brand system (FrankX, GenCreator, Arcanea, Luminor, Vibeclubs). It's where members of those communities actually *do work together*, with referral flows and eventual B2B integrations.

## What "done" looks like for v1 (Sprint 1, Apr 17 – May 14 2026)

See `SPRINT-1-PLAN.md` for the ticket list. Ship criteria:

- A creator can list a club via `/start`, it appears on `/explore` and `/club/[slug]`.
- A builder installs the Chrome extension, opens Meet/Discord/YouTube, and sees the VibeMixer overlay.
- Two extension users in the same club share a synced Pomodoro across devices.
- A premium user triggers Suno music generation and hears it in the mixer music layer.
- Sessions auto-log (duration, platform, Pomodoro count) and produce shareable session cards.
- vibeclubs.ai live in production. Extension on Chrome Web Store (or unlisted).
- OSS packages published to npm.
- Show HN + X thread ready.

Success = 50 installs, 5 clubs, 100 GitHub stars, one session with 3+ real humans in the first post-launch week.

## Failure modes to avoid

1. **Rebuilding ADR-001.** The legacy LiveKit room scaffold at `apps/web/app/r/[room]/page.tsx` is *preserved* for a hypothetical Phase 4. It is not the current direction. Don't extend it.
2. **Feature-creeping the hosted tier into the OSS core.** The hosted Arcanean instance adds brand polish, curated ambient library, and AI witness compute — and *nothing else*. Everything else ships as OSS.
3. **Building a meeting app.** Every no in the veto list exists because someone will inevitably ask for it. The answer stays no.
4. **Platform-mode thinking.** If you find yourself designing a "room experience," ask: could this live as a Chrome extension overlay on an existing platform? If yes, that's the answer.

## Decision-making heuristics

When in doubt:
1. Does this pass the **vibe test**? ("Does this make the room feel more alive?")
2. Does this pass the **format test**? ("Could someone run a Vibe Club with this, on their existing tools?")
3. Does this pass the **witness test**? (If it's AI, is it noticing and celebrating, or is it interrupting?)
4. Does this pass the **OSS test**? (Can someone self-host and fork this without hitting a paywall in the core?)

Three yeses → ship. Any no → cut or redesign.

---

## Voice — the five words

Written language is a load-bearing constraint. If nobody in a group chat would text it, it doesn't ship. This section is the dictionary.

### The five words

1. **vibeclub** — noun, verb, gerund, all lowercase. "Host a vibeclub." "Let's vibeclub." "Vibeclubbing tonight." "In a vibeclub rn." The word already conjugates — don't invent new ones.
2. **host** — not "anchor," not "opener," not "facilitator." People already say "who's hosting."
3. **crew** — not "community," not "members," not "operators." "Bring your crew."
4. **lock in** — legitimate 2025-2026 slang for focused mode. "Lock in with me." "90-min lock-in." Use it.
5. **ship** — what the vibeclub produces. "Shipped in a vibeclub." Builder grammar, universal.

### The canonical test

Does a 28-year-old builder text this? Say it out loud as:

- "yo vibeclub tomorrow 10am?"
- "hosting a vibeclub sat, claude code + lofi, drop in"
- "in a vibeclub rn, ping me after"

If any surface copy fails that test, rewrite it.

### Forbidden vocabulary

- "community" (dead word)
- "members" / "users" (flat/ugly)
- "rooms" / "spaces" / "sessions" in consumer copy (generic)
- "platform" (the whole thesis is format, not platform)
- "engage" / "connect" / "unlock" / "empower" / "revolutionize" (veto list, non-negotiable)
- "AI-powered" (always replace with the specific act: "Claude writes the recap," "Suno mixes the music")
- "Cloud" as a paid tier name — use "Pro"
- Capital-noun features — no "Witness," no "Field," no "Stamps." Lowercase-descriptive: "recap," "extension," "card."

### Brand-adjacent naming

- The extension: just "the Vibeclubs extension." Don't sub-brand it.
- The AI: lowercase "the recap" or "Claude writes the recap." Never capital-T "Witness" in consumer copy. (The npm package stays `@vibeclubs/ai-witness` — devs read code, not marketing.)
- The hosted tier: "Pro" — plain, cheap, Stripe-simple. Ships Sprint 2.
- The OSS packages: keep current `@vibeclubs/*` names. Devs don't need metaphors.

### The one sentence that kills every ambiguity

**"Claude Code + your crew + a soundtrack. Host a vibeclub."**

Every hero, every tweet, every pitch falls out of that. Drift from it earns a rewrite.

---

## Revision log

- **Apr 16 2026** — Initial vision captured (Frank + Claude).
- **Apr 21 2026** — Voice section added. Superseded the "Stamps/Anchors/Field/Residency" naming proposal. The five words (vibeclub/host/crew/lock in/ship) are canonical. Any PR that invents new grammar is off-brand.

---

*Owner: Frank Riemer. Any meaningful change to this file is an ADR-level decision.*
