# ADR-001: Vibeclubs Platform Stack Decision

**Status:** Proposed  
**Date:** 2026-04-16  
**Decider:** Frank Riemer  

---

## Context

Vibeclubs is a live co-working/co-creating room product where builders open their own "vibe club," code together, mix music live, chat, share screens, and build community — a creative-first StudyTogether. The question is what platform layer to build on.

The forces:

- **Speed to market** — v1 needs to ship in weeks, not months
- **Audio is the product** — three-layer mixer (ambient + music + voice) is the differentiator; not just "a call with chat"
- **Ownership** — need to control the room UX, the mixer, the Pomodoro sync, the AI witness; can't be trapped inside someone else's product chrome
- **Monetization** — Stripe tiers already designed ($12/$49/$299); don't want a platform taking 30%
- **Self-host promise** — README promises Docker self-host; requires an open-source transport layer
- **Community surface** — chat, presence feed, session cards, club pages
- **Scale ceiling** — need to go from 5 users to 50K without re-platforming

---

## Options Considered

### Option A: Build on Whop

Use Whop as the community platform. Vibeclubs becomes a "Whop app" — chat rooms, forums, paywalls, and course delivery handled by Whop. Custom LiveKit or Whereby embed for the live room.

| Dimension | Assessment |
|-----------|------------|
| Complexity | **Low** — Whop handles auth, payments, community, chat, mobile app |
| Cost | **High** — Whop takes transaction fees on every tier; you're a tenant |
| Audio control | **None** — no three-layer mixer; you embed a video call widget |
| Scalability | Whop scales, but you can't self-host or federate |
| Team familiarity | Frank knows Whop from creator economy; easy to start |
| Self-host | **Impossible** — Whop is closed-source SaaS |
| Differentiation | **Low** — you look like every other Whop community |

**Pros:** Fastest to "something live." Built-in payments, mobile app, community features. Good for validating demand.  
**Cons:** You don't own the room experience. No mixer. No self-host. 10% transaction fee. Your product looks like a Whop community, not a standalone brand. You can't ship the features that make Vibeclubs *Vibeclubs*.

**Verdict:** Whop is a distribution channel, not a platform. Could list Vibeclubs *on* Whop later as a growth hack, but can't build *inside* Whop.

---

### Option B: Embed Zoom/Google Meet SDK

Use Zoom Video SDK or Google Meet Add-ons API. Rooms are Zoom/Meet calls with custom UI overlays.

| Dimension | Assessment |
|-----------|------------|
| Complexity | **Medium** — SDK exists but custom audio mixing is severely limited |
| Cost | **High** — Zoom Video SDK: $0.0058/participant-min. Meet: no embeddable SDK for custom apps |
| Audio control | **Minimal** — can mute/unmute; no per-track mixing, no ambient layer, no music layer |
| Scalability | Good (Zoom infra), but locked to their pricing |
| Team familiarity | Low for SDK-level work |
| Self-host | **Impossible** |
| Differentiation | **Very low** — "it's a Zoom call with a timer" |

**Pros:** Trusted infra, users know how to join.  
**Cons:** The entire product thesis (bring-your-own-vibe, three-layer mixer) is impossible. You can't mix multiple audio sources per participant. Meet has no real embeddable SDK. Zoom Video SDK costs scale badly. No self-host. No open source.

**Verdict:** Dead on arrival. The mixer *is* the product; Zoom/Meet can't do it.

---

### Option C: 3D Spatial Rooms (Gather / Spatial.io / Custom Three.js)

Build in 2D/3D spatial world. Users walk around, proximity audio, desks, whiteboards.

| Dimension | Assessment |
|-----------|------------|
| Complexity | **Very high** — spatial audio, avatar system, world editor, collision, networking |
| Cost | Gather: ~$7/user/mo at scale. Custom: months of 3D dev |
| Audio control | Gather: none. Custom: you'd build it, but 3-6 month detour |
| Scalability | Gather caps at ~500/room. Custom: depends on your infra |
| Team familiarity | Low (Three.js/spatial networking is specialized) |
| Self-host | Gather: no. Custom: yes, but you're building a game engine |
| Differentiation | **High visually**, but misaligned — Vibeclubs is audio-first, not space-first |

**Pros:** Visually impressive. Spatial audio is cool. Gather has brand recognition.  
**Cons:** Massive engineering overhead for custom. Gather locks you in and can't do the mixer. The spatial metaphor adds friction to *working* — people don't want to navigate a map to start coding. Audio-first rooms (Clubhouse model) convert better for focused work than spatial-first rooms.

**Verdict:** v3/v4 consideration as an optional "3D club room" mode. Not the v1 stack.

---

### Option D: LiveKit (open-source) + Supabase + Next.js (current scaffold)

Custom-build the room on LiveKit's open-source WebRTC stack. Supabase for auth, presence, Realtime sync. Next.js 16 App Router for the web app.

| Dimension | Assessment |
|-----------|------------|
| Complexity | **Medium-high** — you own the full stack, but LiveKit's React components handle 70% of the room UI |
| Cost | **Low** — LiveKit Cloud free tier: 5K min/mo. $0.0004/min after. Self-host: $0 |
| Audio control | **Full** — LiveKit exposes per-track audio. You can build the three-layer mixer with Web Audio API + LiveKit tracks |
| Scalability | LiveKit scales to millions of participants (proven by their enterprise clients). Self-host on K8s for cost control |
| Team familiarity | React + Next.js: high. LiveKit: moderate (good docs, active Discord). Supabase: high |
| Self-host | **Full** — LiveKit server is Apache 2.0. Supabase is open source. Entire stack self-hostable |
| Differentiation | **Maximum** — you own every pixel, every audio path, every interaction |

**Pros:** Full control over the mixer (the product's core). Open source end-to-end. 2.5-8x cheaper than competitors. Self-host keeps the README promise. React components mean you're not building a video SDK from scratch. LiveKit's `AudioConference` component is literally designed for audio-room products. Supabase Realtime gives you Pomodoro sync and presence for free.  
**Cons:** More upfront work than Whop. You own ops (mitigated by Vercel + LiveKit Cloud + Supabase hosted). No built-in community features (you build chat, clubs, profiles).

**Verdict:** This is the stack.

---

### Option E: Hybrid — LiveKit custom rooms + Whop for community/distribution

Build the room experience on LiveKit (Option D) but use Whop as a community wrapper for chat, forums, payments, and member management. Embed the LiveKit room inside a Whop app iframe.

| Dimension | Assessment |
|-----------|------------|
| Complexity | **Medium** — room is custom, community is outsourced |
| Cost | Whop transaction fees + LiveKit costs. Double platform risk |
| Audio control | **Full** (LiveKit) |
| Scalability | Good, but two systems to manage |
| Self-host | **Partial** — room yes, community no |
| Differentiation | **Split** — room is differentiated, community feels like Whop |

**Pros:** Get Whop's mobile app, payments, and community for free. Focus engineering on the room.  
**Cons:** Brand dilution — half the experience is Whop chrome. Whop takes fees. Self-host promise is half-broken. Two auth systems. Users have to be on Whop to access Vibeclubs (limits TAM). Migration pain when you eventually build your own community layer.

**Verdict:** Viable as a v1 shortcut IF you accept it's throwaway. But the community layer (chat, clubs, profiles) is not that hard with Supabase + a few React components, and building it gives you full ownership. Skip the hybrid.

---

## Decision

**Option D: LiveKit + Supabase + Next.js 16. Full custom.**

### Why

1. **The mixer is the moat.** Three-layer audio mixing (ambient + music + voice) per participant requires raw audio track access. Only LiveKit (and self-built WebRTC) gives this. Every other option kills the feature.

2. **Open source is the product philosophy.** README line 1: "Free forever. Open source forever." LiveKit (Apache 2.0) + Supabase (Apache 2.0) + Next.js (MIT) = the only stack that delivers on this.

3. **Self-host is a promised feature.** Docker compose with LiveKit server + Postgres + Next.js. Can't do this on Whop, Zoom, Gather, or any hosted platform.

4. **Economics.** LiveKit Cloud at $0.0004/min vs Zoom at $0.0058/min is 14.5x cheaper. At 10K MAU doing 2hr/day average, that's ~$7.2K/mo on LiveKit Cloud vs ~$104K/mo on Zoom. And you can self-host LiveKit to $0.

5. **Speed is sufficient.** LiveKit's `@livekit/components-react` gives you `<LiveKitRoom>`, `<AudioConference>`, `<VideoTrack>`, `<Chat>` out of the box. Fork `livekit-examples/meet` as the base. The scaffold already exists in `apps/web/`. Realistic v1 in 3-4 weeks.

6. **Whop as distribution, not platform.** List Vibeclubs on Whop marketplace later as a growth channel. Don't build inside it.

---

## Consequences

**What becomes easier:**
- Full control over room UX, mixer, Pomodoro, AI witness
- Self-host deployments work as promised
- No platform fees on Stripe revenue
- Can add 3D/spatial as a v3 mode without re-platforming
- Community trusts the project (fully open source)

**What becomes harder:**
- Must build chat, clubs, profiles, moderation yourself (Supabase + React)
- Must operate LiveKit Cloud or self-hosted LiveKit (mitigated by managed hosting)
- No built-in mobile app (PWA first, React Native in v4)
- More upfront engineering than Whop

**What we'll revisit:**
- 3D spatial rooms as optional mode (v3/v4)
- Whop/Discord as distribution channels (v2)
- React Native mobile app vs PWA (v4)
- LiveKit Cloud vs self-host cost crossover (at ~$500/mo Cloud spend, self-host wins)

---

## Architecture: High-Level System Design

```
┌─────────────────────────────────────────────────────────────────┐
│                        vibeclubs.ai                             │
│                     (Vercel Edge Network)                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  Next.js 16 App Router                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────┐  │
│  │ Landing   │  │ /open    │  │ /r/[room]│  │ /club/[slug]  │  │
│  │ Page      │  │ Room List│  │ Live Room│  │ Club Home     │  │
│  └──────────┘  └──────────┘  └────┬─────┘  └───────────────┘  │
│                                    │                            │
│  ┌─────────────────────────────────┼──────────────────────────┐│
│  │           Room Client Layer     │                          ││
│  │  ┌──────────┐  ┌───────────┐  ┌┴──────────┐  ┌─────────┐ ││
│  │  │ VibeMixer│  │ Pomodoro  │  │ Presence  │  │  Chat   │ ││
│  │  │ (3-layer │  │ Sync      │  │ Feed      │  │         │ ││
│  │  │  audio)  │  │           │  │           │  │         │ ││
│  │  └────┬─────┘  └─────┬────┘  └─────┬─────┘  └────┬────┘ ││
│  │       │               │             │              │       ││
│  │  Web Audio API   Supabase      Supabase       Supabase    ││
│  │  + LiveKit       Realtime      Realtime       Realtime    ││
│  │  Audio Tracks    Channel       Presence       Channel     ││
│  └───────┼───────────────┼─────────────┼──────────────┼───────┘│
│          │               │             │              │        │
└──────────┼───────────────┼─────────────┼──────────────┼────────┘
           │               │             │              │
    ┌──────▼──────┐  ┌─────▼─────────────▼──────────────▼──────┐
    │  LiveKit    │  │              Supabase                    │
    │  Cloud      │  │  ┌────────┐  ┌──────────┐  ┌─────────┐ │
    │             │  │  │Auth    │  │ Realtime │  │Postgres │ │
    │  WebRTC     │  │  │(magic  │  │(channels,│  │(rooms,  │ │
    │  SFU        │  │  │ link + │  │ presence,│  │ clubs,  │ │
    │  (audio +   │  │  │ OAuth) │  │ broadcast│  │ users,  │ │
    │   video     │  │  └────────┘  └──────────┘  │ sessions│ │
    │   tracks)   │  │                             └─────────┘ │
    └─────────────┘  └────────────────────────────────────────┘

    ┌──────────────┐
    │ AI Witness   │
    │ (Vercel AI   │
    │  SDK +       │
    │  Claude API) │
    │  opt-in per  │
    │  room        │
    └──────────────┘
```

### The Vibe Mixer — The Core Differentiator

This is the thing no other platform can do:

```
┌─────────────── VibeMixer Component ───────────────────┐
│                                                        │
│  Layer 1: AMBIENT        ┌──────────────────────┐     │
│  (rain, cafe, lo-fi)     │ <audio> element       │     │
│  Source: Vercel Blob     │ → Web Audio GainNode  │──┐  │
│  or user upload          └──────────────────────┘  │  │
│                                                     │  │
│  Layer 2: MUSIC          ┌──────────────────────┐  │  │
│  (Spotify/YouTube/Suno)  │ iframe or embed       │  │  │
│  Per-listener, not       │ → volume control only │──┤  │
│  broadcast (licensing)   └──────────────────────┘  │  │
│                                                     │  │
│  Layer 3: VOICE          ┌──────────────────────┐  │  │
│  (LiveKit audio tracks)  │ LiveKit AudioTrack    │  │  │
│  Room-wide or            │ → Web Audio GainNode  │──┤  │
│  proximity-based         └──────────────────────┘  │  │
│                                                     │  │
│                          ┌──────────────────────┐  │  │
│  MASTER OUTPUT       ←── │ Web Audio Destination │◄─┘  │
│  (per-user mix)          └──────────────────────┘     │
│                                                        │
│  UI: Three vertical faders + master + preset buttons  │
└────────────────────────────────────────────────────────┘
```

Key insight: Music (Layer 2) is **per-listener** via iframe embeds (Spotify, YouTube). This avoids DMCA/licensing — each user streams their own music via their own Spotify account. The room shares a "now playing" label, not the actual audio stream. Ambient (Layer 1) is shared audio from a royalty-free library. Voice (Layer 3) is LiveKit WebRTC tracks.

### Data Model (Supabase Postgres)

```sql
-- Core tables
users (id, email, display_name, avatar_url, created_at)
rooms (id, slug, title, created_by, is_public, ambient_preset, 
       pomodoro_config, max_participants, created_at)
clubs (id, slug, name, description, owner_id, tier, created_at)
club_members (club_id, user_id, role, joined_at)
sessions (id, room_id, user_id, started_at, ended_at, 
          focus_minutes, break_minutes)
messages (id, room_id, user_id, content, created_at)

-- Realtime state (ephemeral, managed via Supabase Realtime channels)
-- room:{slug} channel → presence (who's in the room)
-- room:{slug}:pomodoro channel → timer state broadcast
-- room:{slug}:chat channel → live messages
```

### API Routes (Next.js 16 Route Handlers)

```
POST /api/livekit/token     → Generate LiveKit participant token
POST /api/rooms             → Create room
GET  /api/rooms/open        → List public rooms
POST /api/rooms/[slug]/join → Join room + log session
POST /api/ai/witness        → AI witness endpoint (Vercel AI SDK)
POST /api/stripe/checkout   → Stripe checkout session
POST /api/stripe/webhook    → Stripe webhook handler
```

### Build Order (v1 MVP)

```
Week 1: Foundation
 1. pnpm install + Tailwind 4 + TypeScript config
 2. Supabase project + schema migration (users, rooms, sessions, messages)
 3. Supabase Auth (magic link + Google OAuth)
 4. LiveKit Cloud project + token generation route
 5. Base room page (/r/[slug]) with LiveKit <AudioConference>

Week 2: The Differentiators
 6. VibeMixer component (3-layer, Web Audio API)
 7. Ambient preset library (5 tracks on Vercel Blob)
 8. Spotify embed + YouTube embed (per-listener)
 9. Pomodoro sync via Supabase Realtime channel
10. Presence feed ("4 people focusing")

Week 3: Community Surface
11. Room creation flow
12. /open page (public room directory)
13. In-room chat via Supabase Realtime
14. Landing page polish
15. Basic user profiles

Week 4: Ship
16. Vercel deployment + domain binding
17. Stripe integration (Member + Club tiers)
18. AI witness v1 (opt-in, Claude via Vercel AI SDK)
19. Error handling, loading states, mobile responsive
20. Launch checklist: OG images, SEO, analytics
```

---

## Why NOT the Alternatives — One-Liner Summary

| Option | Kill reason |
|--------|------------|
| **Whop** | Can't build three-layer mixer. You're a tenant, not a product. Use as distribution channel later. |
| **Zoom/Meet SDK** | No per-track audio access. $0.0058/min. No self-host. "A Zoom call with a timer" is not a product. |
| **3D/Spatial (Gather, Spatial.io)** | 3-6 month detour for spatial networking. Adds friction to focused work. Audio-first beats space-first for co-working. v3 consideration. |
| **Hybrid (LiveKit + Whop)** | Brand dilution, double auth, Whop fees, half-broken self-host. More complexity for less ownership. |

---

## Action Items

1. [ ] **Frank: Approve or amend this ADR**
2. [ ] Provision LiveKit Cloud project + get API keys
3. [ ] Provision Supabase project + get keys
4. [ ] Bind `vibeclubs.ai` domain to Vercel
5. [ ] Execute Week 1-4 build order
6. [ ] Post-launch: list on Whop marketplace as growth channel (not platform)
