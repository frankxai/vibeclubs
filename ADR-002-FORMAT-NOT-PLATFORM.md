# ADR-002: Vibeclubs is a Format, Not a Platform

**Status:** Accepted (supersedes ADR-001)  
**Date:** 2026-04-16  
**Decider:** Frank Riemer  

---

## Context

ADR-001 chose LiveKit + Supabase + Next.js to build a custom WebRTC co-working platform. During architecture review, three problems emerged:

1. **Cold-start hell.** A room product with no users is worse than no product. You need 5-10 concurrent strangers from day zero. StudyTogether solved this with millions of YouTube viewers first. We have no equivalent funnel.

2. **The value isn't in the transport.** The three differentiators — the vibe mixer, Pomodoro sync, AI witness — are software layers. They don't require owning a WebRTC stack. They can run on top of ANY audio/video platform.

3. **People already vibe together.** Builders are already on Discord voice channels, Google Meet co-working calls, lo-fi YouTube streams. They duct-tape 3 tools together (ambient music + timer + call). The opportunity is to formalize and enhance what they already do, not to move them to a new platform.

**New insight from Frank:** "Vibe Clubs are a system and process for vibing together... an overlay to any community... people start being like 'hey let's make a VibeClub'... with their own tools, whatever they want to use."

This reframes the entire product.

---

## Decision

**A Vibe Club is a format — like "hackathon" or "book club."**

vibeclubs.ai is the brand, the playbook, the directory, and a lightweight toolkit. It is NOT a video/audio platform. People run Vibe Clubs on whatever tools they already use. We enhance the experience with a Chrome extension and open-source components.

---

## Architecture

```
┌────────────────────────────────────────────────────────────────┐
│                    vibeclubs.ai (Next.js 16)                   │
│                        Vercel Edge                             │
├─────────────┬──────────────┬──────────────┬───────────────────┤
│  PLAYBOOK   │  DIRECTORY   │  PROFILES    │  TOOLKIT          │
│             │              │              │                   │
│  /playbook  │  /explore    │  /u/[user]   │  /tools           │
│  /start     │  /club/[id]  │  /sessions   │  /extension       │
│  /templates │  /submit     │  /settings   │  /developers      │
│             │              │              │                   │
│  MDX pages  │  Supabase    │  Supabase    │  Chrome ext       │
│  static     │  clubs table │  users +     │  download +       │
│  content    │  + Realtime  │  sessions    │  docs             │
└─────────────┴──────┬───────┴──────┬───────┴────────┬──────────┘
                     │              │                │
              ┌──────▼──────────────▼────────────────▼──────────┐
              │              Supabase                            │
              │  ┌─────────┐  ┌──────────┐  ┌───────────────┐  │
              │  │Auth     │  │Postgres  │  │Realtime       │  │
              │  │(magic + │  │(clubs,   │  │(Pomodoro sync │  │
              │  │ Google) │  │ users,   │  │ across ext    │  │
              │  │         │  │ sessions)│  │ users)        │  │
              │  └─────────┘  └──────────┘  └───────────────┘  │
              └─────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│              CHROME EXTENSION — "Vibeclubs"                    │
│                                                                │
│  Injects onto ANY page (Meet, Discord, YouTube, blank tab)     │
│                                                                │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────────────┐ │
│  │ VibeMixer   │  │ Pomodoro     │  │ Session Card         │ │
│  │             │  │ Timer        │  │ Generator            │ │
│  │ Ambient:    │  │              │  │                      │ │
│  │  <audio> +  │  │ Synced via   │  │ Auto-captures:       │ │
│  │  GainNode   │  │ Supabase     │  │ - duration           │ │
│  │             │  │ Realtime     │  │ - participants        │ │
│  │ Music:      │  │ across all   │  │ - platform used       │ │
│  │  Suno API   │  │ extension    │  │ - shareable card      │ │
│  │  generated  │  │ users in     │  │                      │ │
│  │  + controls │  │ same club    │  │ Posted to profile     │ │
│  │             │  │              │  │ on vibeclubs.ai       │ │
│  │ Page audio: │  │ 25/5, 50/10  │  │                      │ │
│  │  Tab volume │  │ 90/20, custom│  │                      │ │
│  │  control    │  │              │  │                      │ │
│  └─────────────┘  └──────────────┘  └──────────────────────┘ │
│                                                                │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │ AI Witness (optional, premium)                           │ │
│  │ Watches: timer state, session duration, platform context │ │
│  │ Posts: session summaries, milestone celebrations         │ │
│  │ Triggers: Suno mood regen based on session phase         │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘

┌────────────────────────────────────────────────────────────────┐
│              OSS PACKAGES (npm)                                │
│                                                                │
│  @vibeclubs/vibe-mix       — Web Audio mixer, ambient loader  │
│  @vibeclubs/pomodoro-sync  — Supabase Realtime state machine  │
│  @vibeclubs/ai-witness     — Claude SDK session observer      │
│  @vibeclubs/session-card   — Shareable card generator         │
│  @vibeclubs/suno-bridge    — Suno API wrapper for sessions    │
└────────────────────────────────────────────────────────────────┘
```

### How a Vibe Club Session Works (E2E)

**Opener creates a club on vibeclubs.ai:**
1. Signs up → /start wizard
2. Names the club, picks type (coding, music, design, study, fitness)
3. Picks their platform: Google Meet, Discord, Zoom, in-person, other
4. Sets rhythm: Pomodoro preset, session schedule
5. Gets a club page: vibeclubs.ai/club/lofi-coders-amsterdam
6. Shares link on X, Discord, wherever

**Builder joins:**
1. Finds club via /explore or direct link
2. Club page shows: next session schedule, platform link (e.g. Google Meet URL), recommended tools, past session cards
3. Clicks "Join session" → opens their platform (Meet/Discord/etc)
4. Installs Chrome extension (prompted once)
5. Extension activates: ambient mixer appears, Pomodoro syncs with other extension users in the same club, Suno generates session music
6. Builder works. Extension tracks session. Timer syncs.
7. Session ends → session card auto-generated, posted to profile

**The extension is the glue.** It turns any call into a Vibe Club session. Without the extension, you can still run a Vibe Club manually (the playbook tells you how). The extension just makes it seamless.

### Data Model (Supabase Postgres)

```sql
users (id, email, display_name, avatar_url, bio, links, tier, created_at)

clubs (
  id, slug, name, description, type, -- coding|music|design|study|fitness|other
  platform, -- meet|discord|zoom|in_person|other
  platform_url, -- e.g. Google Meet link
  schedule, -- cron or human-readable
  pomodoro_preset, -- 25/5|50/10|90/20|custom
  ambient_preset, -- rain|cafe|lofi|nature|space
  suno_genre, -- genre prompt for Suno
  opener_id, tier, -- free|featured
  location, -- for local clubs
  is_active, created_at
)

club_members (club_id, user_id, role, joined_at)

sessions (
  id, club_id, user_id,
  platform_used, -- what they actually used
  started_at, ended_at,
  focus_minutes, break_minutes,
  session_card_url, -- generated card image
  created_at
)

tool_recommendations (
  id, club_type, tool_name, tool_url, category,
  description, affiliate_url
)
```

### Revenue Architecture

```
FREE TIER (extension + vibeclubs.ai):
├── 3 ambient presets (rain, cafe, lo-fi)
├── Pomodoro timer (basic, not synced)
├── Club listing (1 free club)
├── Session tracking (basic)
└── Playbook access (all content free)

BUILDER ($9/mo — extension premium):
├── All ambient presets (10+)
├── Suno AI music generation (5 tracks/session)
├── Synced Pomodoro (across all extension users in club)
├── AI Witness (session summaries, milestones)
├── Custom presets + profiles
├── Session cards (shareable, branded)
└── Priority support

OPENER ($29/mo — club premium):
├── Everything in Builder
├── Featured listing on /explore
├── Custom club branding
├── Analytics dashboard (session stats, member activity)
├── Scheduled sessions with reminders
├── Multiple clubs (up to 10)
└── Tool recommendation customization

PARTNERSHIPS (B2B):
├── Suno: revenue share on premium music gen
├── Replit/Cursor: affiliate on "recommended tools"
├── Arcanea: retreat alumni → auto-club setup
└── Enterprise: custom club deployments for companies
```

### Cost Structure

| Item | Monthly | Notes |
|------|---------|-------|
| Vercel | $0-20 | Pro plan when needed |
| Supabase | $0-25 | Free tier handles 50K MAU |
| Suno API | $10-100 | Pay per generation, passed to premium users |
| Anthropic API | $5-50 | AI witness, low volume per session |
| Chrome Web Store | $5 one-time | Developer fee |
| Domain | ~$1 | Already owned |
| **Total** | **$15-195/mo** | |

Break-even: 2-22 premium users depending on Suno usage.

### Why This Beats a Platform (ADR-001 comparison)

| Dimension | Platform (ADR-001) | Format + Toolkit (ADR-002) |
|-----------|-------------------|---------------------------|
| Build time | 4 weeks | 2-3 weeks |
| Infra cost | $200-500/mo | $15-195/mo |
| Cold-start risk | Critical | Zero |
| User acquisition | "Come to our platform" | "Enhance what you already do" |
| TAM | People willing to switch platforms | Everyone who does video calls |
| OSS value | WebRTC room (niche) | Vibe components (universal) |
| Defensibility | Low (anyone can build a room) | High (brand + format + community) |
| Ecosystem fit | Standalone product | Connective tissue for all 5 brands |
| Content opportunity | Build-in-public series | Format evangelism + community stories |

### Scale Path

```
Phase 1 (Sprint 1): Brand + Directory + Extension MVP
  → 50 extension installs, 5 clubs listed, vibeclubs.ai live
  
Phase 2 (Sprint 2): Premium + Suno + AI Witness  
  → 500 installs, 20 clubs, first paying users, Suno integration
  
Phase 3 (Sprint 3): Ecosystem + Partnerships
  → 2K installs, 100 clubs, Suno/Replit partnerships, Arcanea integration
  
Phase 4 (Month 3+): Optional Native Rooms
  → IF demand warrants, add LiveKit native rooms as premium tier
  → Only built when clubs say "we want integrated rooms, not Meet"
  → ADR-001 architecture preserved for this phase
```

---

## Consequences

**What becomes easier:**
- Ship in 2 weeks, not 4
- Zero cold-start — clubs form around existing communities
- Near-zero infra cost at launch
- Every brand in the Arcanea ecosystem feeds the directory
- Content/marketing is the product (playbook pages, club stories)
- Chrome extension has built-in viral loop

**What becomes harder:**
- Less control over the in-session experience (depends on Meet/Discord/etc)
- Extension must work across many platforms (compatibility testing)
- Revenue per user lower ($9 vs $12-49)
- No "wow" moment of a fully integrated room (yet)

**What we preserve:**
- ADR-001 architecture for Phase 4 native rooms (LiveKit when demand proves)
- OSS commitment (packages are MIT)
- Self-host story (packages work anywhere)

---

## Action Items

1. [x] Frank: approve format strategy
2. [ ] Rewrite Linear sprint for new architecture
3. [ ] Build vibeclubs.ai (playbook + directory + /start wizard)
4. [ ] Build Chrome extension MVP (mixer + Pomodoro + session cards)
5. [ ] Integrate Suno for premium music gen
6. [ ] Launch on Chrome Web Store + Show HN
7. [ ] Seed directory with 3 internal clubs (Arcanea builders, FrankX coders, Music producers)
