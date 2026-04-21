# Vibeclubs Roadmap

> Living document. Updated per sprint.

---

## v1.0 — MVP (Weeks 1-4, April-May 2026)

**Goal:** Ship a working live room at vibeclubs.ai that you can join from a browser, hear ambient + music, see who else is there, and run a synced Pomodoro.

- [ ] Fork `livekit-examples/meet` base
- [ ] Supabase auth + presence table
- [ ] Room creation flow (`/r/[room]`)
- [ ] Three-layer vibe mixer UI (ambient + music + voice)
- [ ] 5 preset ambient tracks hosted on Vercel Blob
- [ ] Spotify embed with per-listener sync
- [ ] YouTube embed with per-listener sync
- [ ] Pomodoro timer synced via Supabase Realtime channel
- [ ] Basic presence feed ("4 people working")
- [ ] Public rooms at `/open`
- [ ] Landing page
- [ ] Deploy to vibeclubs.ai
- [ ] README + LICENSE + basic docs

**Success:** 10 real humans in a room at the same time.

---

## v1.1 — Polish + Public Launch (Week 5)

- [ ] Soft launch on Hacker News "Show HN"
- [ ] ProductHunt prep
- [ ] r/selfhosted post
- [ ] First external contributor PR landed
- [ ] Accessibility pass (WCAG 2.2 AA)
- [ ] Mobile-responsive room UI

**Success:** 100 GitHub stars, 20 real room visits.

---

## v2.0 — Clubs + AI Witness (Weeks 6-8)

**Goal:** Make it feel like a place, not a tool.

- [ ] Club model (persistent groups)
- [ ] Private rooms (invite only)
- [ ] Custom vibe presets per club
- [ ] Scheduled sessions
- [ ] AI witness v1 (Claude via Vercel AI SDK)
- [ ] Session cards (auto-generated, shareable)
- [ ] Suno API integration for shared music
- [ ] Docker self-host guide
- [ ] Karma system + basic mod tools

**Success:** 3 Arcanea/GenCreator clubs live, 500 GitHub stars.

---

## v2.1 — Commercial Tiers (Weeks 9-10)

- [ ] Stripe integration
- [ ] Member tier ($12/mo)
- [ ] Club tier ($49/mo)
- [ ] Enterprise inquiry flow
- [ ] Billing dashboard

**Success:** First 20 paying members.

---

## v3.0 — Ecosystem Integration (Weeks 11-12)

- [ ] GenCreator Inner Circle integration (Inner Circle → auto-joined to GenCreator Studio club)
- [ ] Arcanea retreat alumni integration
- [ ] FrankX blog "Now live in Vibeclubs" widget
- [ ] Club analytics dashboard
- [ ] ProductHunt launch

**Success:** 5K MAU, 100 paying members, $2K MRR.

---

## v4.0 — Scale (Month 4+)

- [ ] Self-hosted enterprise deployments
- [ ] Federated rooms (instance-to-instance)
- [ ] Luminor witness variants (Arcanea integration)
- [ ] Mobile app (React Native with LiveKit SDK)
- [ ] Plugin API for third-party extensions
- [ ] Marketplace for vibe mix presets (revenue share with creators)

---

## Backlog (unscheduled)

- Breakout rooms (VETOED — see philosophy)
- Host controls (VETOED)
- Recording by default (VETOED — opt-in only)
- Calendar integration
- Zapier/n8n webhooks
- Discord bridge bot
- Obsidian-style room notes
- Physical room sensors (Govee, Philips Hue sync to ambient)
