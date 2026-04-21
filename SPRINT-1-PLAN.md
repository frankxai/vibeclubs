# Sprint 1: Vibeclubs — Format + Toolkit MVP

**Dates:** Apr 17 – May 14, 2026 (4 weeks)  
**Team:** Frank (solo + AI agents)  
**Sprint Goal:** Ship vibeclubs.ai as a live playbook site + club directory + Chrome extension MVP. A creator can list a Vibe Club, a builder can find it, install the extension, and run a vibed-out session on any platform (Meet, Discord, Zoom) with ambient mixing, synced Pomodoro, and auto-generated session cards.

**Architecture:** ADR-002 — Vibeclubs is a Format, Not a Platform.

---

## Capacity

| Person | Available Days | Allocation | Notes |
|--------|---------------|------------|-------|
| Frank | 20 of 20 | 60 pts | Solo dev, AI-augmented. Other brands paused for sprint. |

**Planned Load:** 58 pts / 60 pts capacity (97%)

---

## Sprint Backlog

### Week 1: Foundation — Site + Auth + Schema (Apr 17-21) — 13 pts

| # | Issue | Est | Due | Deps | Linear |
|---|-------|-----|-----|------|--------|
| VBC-21 | Project scaffolding — Next.js 16, pnpm, TW4, TS, ESLint, Turborepo | 2 | Apr 17 | None | ARC-143 |
| VBC-22 | Supabase schema — users, clubs, club_members, sessions, tool_recommendations | 3 | Apr 18 | None | ARC-144 |
| VBC-23 | Supabase Auth — magic link + Google OAuth | 3 | Apr 19 | VBC-22 | ARC-145 |
| VBC-24 | Landing page + /playbook — MDX content, brand, "what is a Vibe Club" | 3 | Apr 20 | VBC-21 | ARC-146 |
| VBC-25 | Chrome extension scaffold — Plasmo, Manifest V3, content script shell | 2 | Apr 21 | None | ARC-147 |

**Week 1 gate:** vibeclubs.ai renders landing + playbook. Auth works. Extension loads in Chrome with empty overlay. Schema deployed to Supabase.

---

### Week 2: Core Extension + Directory (Apr 22-28) — 18 pts

| # | Issue | Est | Due | Deps | Linear |
|---|-------|-----|-----|------|--------|
| VBC-26 | Supabase client in extension — auth bridge, realtime connection | 2 | Apr 22 | VBC-23, VBC-25 | ARC-148 |
| VBC-27 | Extension VibeMixer — ambient + page audio control overlay | 5 | Apr 24 | VBC-25, VBC-26 | ARC-159 |
| VBC-28 | Pomodoro sync — Supabase Realtime broadcast across extension users | 3 | Apr 25 | VBC-26 | ARC-149 |
| VBC-29 | /start wizard — create a club (name, type, platform, schedule, presets) | 3 | Apr 27 | VBC-22, VBC-23 | ARC-150 |
| VBC-30 | /explore directory — browse clubs, filter by type/platform, search | 3 | Apr 27 | VBC-22 | ARC-151 |
| VBC-31 | /club/[slug] page — club detail, next session, platform link, members | 2 | Apr 28 | VBC-29 | ARC-152 |

**Week 2 gate:** Extension overlay on any page with working ambient mixer + synced Pomodoro timer. Club directory live with create/browse/detail flow.

---

### Week 3: Session Engine + Community (Apr 29 – May 5) — 15 pts

| # | Issue | Est | Due | Deps | Linear |
|---|-------|-----|-----|------|--------|
| VBC-32 | Suno AI music integration — generate session tracks, shared playback | 5 | May 1 | VBC-27 | ARC-153 |
| VBC-33 | Session tracking — auto-log start/end/duration/platform in extension | 3 | May 2 | VBC-26, VBC-28 | ARC-154 |
| VBC-34 | Session cards — auto-generated shareable images (club, duration, cycles) | 3 | May 3 | VBC-33 | ARC-155 |
| VBC-35 | /u/[user] profile — session history, clubs, session cards, streaks | 2 | May 4 | VBC-23, VBC-33 | ARC-157 |
| VBC-36 | Tool recommendations engine — per club type, affiliate links | 2 | May 5 | VBC-22 | ARC-156 |

**Week 3 gate:** Full session lifecycle works end-to-end. Builder joins club → opens Meet/Discord → extension activates → mixer + Suno + Pomodoro → session logged → card generated → appears on profile.

---

### Week 4: Ship + Scale (May 6-14) — 12 pts

| # | Issue | Est | Due | Deps | Linear |
|---|-------|-----|-----|------|--------|
| VBC-37 | OSS packages — @vibeclubs/vibe-mix + @vibeclubs/pomodoro-sync on npm | 3 | May 10 | VBC-27, VBC-28 | ARC-158 |
| VBC-38 | Vercel deploy + domain binding + Chrome Web Store submission | 3 | May 8 | All above | *see below* |
| VBC-39 | Error handling, loading states, mobile-responsive site | 3 | May 12 | All above | — |
| VBC-40 | Launch checklist — OG images, SEO, analytics, Show HN draft, X thread | 3 | May 14 | All above | — |

**Week 4 gate:** vibeclubs.ai live in production. Extension on Chrome Web Store (or unlisted link). OSS packages published. Show HN + X thread ready.

---

## Success Metrics

### Ship Criteria (binary — all must pass)

| Metric | Target | How to verify |
|--------|--------|---------------|
| Club creation | Create a club via /start, visible on /explore and /club/[slug] | Manual test |
| Extension overlay | VibeMixer renders on Google Meet, Discord, YouTube, blank tab | Manual test, 4 sites |
| Ambient mixer | 3 faders independently control ambient, music, page audio | Manual test |
| Pomodoro sync | Timer identical across 2 extension users in same club | Manual test, two devices |
| Suno generation | Premium user triggers AI track, plays in mixer music layer | API test |
| Session tracking | Session auto-logged with duration, platform, Pomodoro count | Check Supabase after session |
| Session card | Shareable image generated at session end | Visual check |
| Profile | /u/frank shows session history and cards | Manual test |
| Production | vibeclubs.ai loads, SSL valid, Lighthouse > 90 perf | Lighthouse + manual |
| Extension installable | .crx sideload or Web Store listing works | Install on fresh Chrome |

### Growth Targets (stretch, post-launch week)

| Metric | Target | Timeframe |
|--------|--------|-----------|
| Extension installs | 50 | 2 weeks post-launch |
| Clubs listed | 5 (3 internal + 2 organic) | Launch week |
| GitHub stars (OSS packages) | 100 | 2 weeks post-launch |
| Show HN upvotes | 50 | Launch day |
| First session with 3+ people | 1 | Launch week |

---

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Suno API unavailable or rate-limited | No AI music layer | Fallback to curated royalty-free lo-fi library on CDN. Mixer still works, music fader controls fallback tracks. |
| Chrome extension review delays | Can't distribute via Web Store | Ship as unlisted/sideload first. Web Store approval is parallel, not blocking. |
| Web Audio API browser compat | Mixer breaks on some browsers | Extension is Chrome-only (Manifest V3). Safari/Firefox are non-goals for v1. |
| Supabase Realtime limits | Pomodoro sync lag at scale | Free tier = 200 concurrent. Sufficient for v1 targets (50 installs). Monitor. |
| Solo dev bandwidth | Sprint slips | VBC-36 (tool recs) and VBC-37 (OSS packages) are P2. Cut first if behind. |
| Content script conflicts | Extension breaks on certain sites | Test on top 5 targets (Meet, Discord, YouTube, Zoom web, blank tab). Allowlist approach if needed. |

---

## Stretch Items (cut if behind)

1. VBC-36: Tool recommendations engine — nice-to-have, static JSON acceptable
2. VBC-37: OSS packages — can extract post-launch
3. Emoji reactions in session cards
4. PWA manifest for vibeclubs.ai
5. Stripe integration (defer to Sprint 2 — free launch first to validate)

---

## Key Architectural Decisions

| Decision | Rationale |
|----------|-----------|
| No Stripe in Sprint 1 | Launch free. Validate format adoption before gating features. Monetization = Sprint 2. |
| No LiveKit / native rooms | ADR-002. Extension-on-existing-platforms eliminates cold-start. LiveKit preserved for Phase 4 if demand proves. |
| Plasmo for extension | Best DX for Manifest V3. React in content scripts. Hot reload. TypeScript. |
| MDX for playbook | Static, SEO-friendly, version-controlled. The playbook IS the product for non-extension users. |
| Suno over Spotify/YouTube | Royalty-free = legally broadcastable. No DMCA risk. Generative = unique per session. |

---

## Project Management

| System | Role | Link |
|--------|------|------|
| **Linear** | Sprint board, issues, tracking | [Project](https://linear.app/arcanea/project/vibeclubsai-the-format-for-vibing-together-8e5e98aa9b13) |
| **GitHub** | Code, PRs, CI | github.com/frankxai/vibeclubs |
| **Vercel** | Deploy, preview, production | vibeclubs.ai |
| **Cowork/Claude** | AI pair programming, sprint execution | This session |

---

## Key Dates

| Date | Event |
|------|-------|
| Apr 17 | Sprint start — scaffolding + schema |
| Apr 21 | Week 1 gate: site renders, auth works, extension shell loads |
| Apr 28 | Week 2 gate: mixer + Pomodoro + directory work |
| May 5 | Week 3 gate: full session lifecycle E2E |
| May 8 | Production deploy + Chrome Web Store submit |
| May 12 | Feature freeze |
| May 14 | Sprint end |
| May 15 | Show HN + X thread + seed 3 internal clubs |

---

## Tomorrow (Apr 17) — Day 1 Plan

**VBC-21 + VBC-22 in parallel.**

1. `pnpm create next-app` → Turborepo monorepo (apps/web + packages/)
2. Tailwind 4 + PostCSS config
3. TypeScript strict + ESLint flat config
4. Provision Supabase project (or use existing)
5. Write + run SQL migration (users, clubs, club_members, sessions, tool_recommendations)
6. Supabase client setup in Next.js (server + client components)
7. Landing page shell with "What is a Vibe Club?" hero
8. Extension scaffold (Plasmo init in apps/extension)

**Blocker for Day 1:** Need Supabase project URL + keys. Provision before morning or provision during session.

**End of Day 1 target:** Landing page renders at localhost:3000. Database schema exists. Extension loads in Chrome as unpacked. Playbook has first MDX page.
