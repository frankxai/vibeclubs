# Arcanea Studio — Evolution Plan

**Source:** fork of [Anil-matcha/Open-Generative-AI](https://github.com/Anil-Matcha/Open-Generative-AI) @ `6f9cdee`
**Destination:** `C:\Users\frank\Arcanea\forks\arcanea-studio` (local), `frankxai/arcanea-studio` (remote, private until license verified)
**Decision date:** 2026-04-20
**Owner:** Frank
**Strategic slot:** Library / Atelier visual-generation surface — the "highest-margin Pro/Atelier product" referenced in Prompt OS v1.2.0

---

## 1. Why this repo, why now

Upstream ships a production-grade Electron + Next.js shell around **200+ image/video/lipsync/cinema models** (Flux, Nano Banana 2, Sora, Veo, Kling, Seedance 2.0, Grok Imagine, Wan 2.2, LTX Lipsync, Midjourney, Runway, Infinite Talk). Four studios — Image, Video, LipSync, Cinema — already wired with multi-image input (14 refs), generation history, pending-job resume, dynamic aspect/resolution controls, glassmorphism UI.

**The wedge:** it is 100% coupled to **Muapi.ai** as a single upstream provider. `src/lib/muapi.js` is the entire backend. That is exactly the abstraction gap Arcanea already filled on npm (`@arcanea/router-spec@1.0.2`, `@arcanea/orchestrator@1.2.1`). Forking this skips **~3 months of UI + model-catalog work** and lets us ship a branded, Luminor-wired creative surface in Sprint scope instead of Q.

**Cost of building from scratch:** 8–12 weeks, ~€40–60K in Cursor/Claude burn.
**Cost of this fork:** ~10 days of surgical work, most of it renaming providers and wiring Supabase.

## 2. Upstream inventory (what we get for free)

| Surface | Files | Notes |
|---|---|---|
| Image Studio | `src/components/ImageStudio.js`, `packages/studio/src/components/` | t2i + i2i dual-mode, 105+ models |
| Video Studio | `src/components/VideoStudio.js` | t2v + i2v, 100+ models |
| Lip Sync Studio | `src/components/LipSyncStudio.js` | 9 models, portrait & video modes |
| Cinema Studio | `src/components/CinemaStudio.js`, `src/components/CameraControls.js` | Camera/lens/focal/aperture picker |
| Upload history | `src/lib/uploadHistory.js` | localStorage-backed, dedupes re-uploads |
| Pending jobs | `src/lib/pendingJobs.js` | Resume on reload — critical for long video renders |
| Model catalog | `src/lib/models.js` + `models_dump.json` (66KB) | Complete endpoint schemas |
| Electron shell | `electron/main.js`, `afterPack.js`, `build/linux/apparmor.profile` | Cross-platform packaging (DMG, NSIS, AppImage, .deb) works today |
| Next.js hosted mode | `app/`, `components/ApiKeyModal.js`, `components/StandaloneShell.js` | Parallel web target — same engine |

## 3. What it is **not** (technical debt, on purpose)

- **No persistence beyond localStorage.** History, uploads, API keys all client-side. Zero account/team model.
- **No provider abstraction.** `muapi.js` is the only client. Switching or multi-routing is manual.
- **No lineage, no attribution, no royalties.** Generations are flat outputs with no Creation Card graph.
- **No agent layer.** No prompt enhancement, no Luminor context injection, no multi-agent fanout.
- **UI theme is neon-yellow dark mode.** Not on-brand — needs Atlantean Teal / Cosmic Blue / Gold + Geist / Instrument Serif.
- **Single LICENSE risk.** No LICENSE file committed upstream. Must stay private until confirmed with Anil Matcha (I flagged this — see §8).
- **Vanilla JS core.** `packages/studio` and `src/` are plain JS, no TypeScript. TS migration is Phase 2 cost, not Phase 1.

## 4. Six-phase evolution

### Phase 0 — Fork & sanitize (Day 0, DONE)
- Copy tree to `Arcanea/forks/arcanea-studio`, rebrand `package.json` → `@arcanea/studio`
- Remove `.git` to decouple from upstream history (fresh init)
- Confirm build works unchanged — `pnpm install && pnpm build` (currently `npm` — migrate to pnpm as part of Phase 1)
- **Exit criteria:** `npm run build` succeeds, Electron package signs locally.

### Phase 1 — Router abstraction (Days 1–3)
Replace `src/lib/muapi.js` with `@arcanea/router-spec` adapter.
- Keep Muapi as provider #1 (backwards-compat for existing model catalog)
- Add Replicate + Fal + Runware + direct (OpenAI images, Runway, Veo via Google) as providers #2–#5
- Provider selection in Settings modal + per-model default provider in `models.js`
- Fallback chain: if primary provider fails → route to next cheapest compatible
- **Exit criteria:** same Image Studio generation call works against any 2 providers without code change.

### Phase 2 — Arcanea design system (Days 2–4, parallel to Phase 1)
- Strip neon-yellow-green theme, port `@arcanea/design-system@0.2.0` tokens:
  - Atlantean Teal `#00bcd4` primary, Cosmic Blue `#0d47a1` secondary, Gold `#ffd700` accent
  - Background `#09090b`, glass cards `bg-white/[0.03] border-white/[0.06] backdrop-blur-sm`
  - Fonts: Geist (display + body), Instrument Serif (editorial), JetBrains Mono (code)
  - **NO Cinzel, NO Space Grotesk, NO Inter** (Anthropic frontend-design anti-pattern list, per project memory)
- Framer Motion `domAnimation` only, per Arcanea CLAUDE.md
- **Exit criteria:** design-critique skill pass, no token drift from canonical package.

### Phase 3 — Supabase + Creation Cards (Days 3–6)
- Replace `localStorage` history with Supabase `generations` + `creation_cards` tables
- Every generation becomes a forkable Creation Card with:
  - Lineage (parent generations, prompt graph)
  - Attribution cascade (**default-ON, locked** per Creator Forge decision Apr 17)
  - Royalty hooks (on-chain optional — tie to `arcanea-onchain` workspace)
- Reuse existing `members` table from gencreator.ai (`tier_access` view) for entitlements
- Pending-job resume continues to work via Supabase Realtime subscription instead of localStorage poll
- **Exit criteria:** generate, close tab, reopen 20 min later — job resumes from cloud state.

### Phase 4 — Luminor wiring (Days 5–8)
Each Studio becomes a Luminor-native surface. Routing via existing AMCAS orchestrator (`@arcanea/orchestrator@1.2.1`).

| Studio | Luminor | Role |
|---|---|---|
| Image | **Artisan** | Style anchoring, reference management, taste enforcement |
| Video | **Director** | Shot planning, continuity across multi-clip renders |
| Lip Sync | **Oracle** (voice persona) | Voice-match, script-to-timing alignment |
| Cinema | **Cinematographer** | Camera/lens/lighting reasoning, mood boards |

- Prompt box becomes agent chat surface — Luminor enhances prompt before sending to router
- Multi-studio fanout: one prompt → Artisan proposes image → Director storyboards → Cinematographer picks lens → render fleet executes in parallel
- Coordinated by **Lumina Queen** (12-Chosen + Queen pattern already shipped Apr 19, PR #47)
- **Exit criteria:** `/studio cinematic scene of Marbella ocean villa at golden hour` produces image + video + lipsync all in one request.

### Phase 5 — Monetization + ship (Days 7–10)
- **Pricing tiers** (per Starlight OS open-core pricing already set):
  - Free (€0): web, 10 gens/day, watermark, Muapi-only
  - Pro (€19/mo): web, unlimited gens, no watermark, all providers, Creation Cards with lineage
  - Atelier (€497/mo + €99 setup): Electron desktop app, agent orchestration, royalty smart contracts, private Luminor fine-tune
- Stripe subscription for Pro/Atelier → existing gencreator.ai handler (ADR-005 pattern — `members.stripe_customer_id` coexists)
- Electron installers signed + notarized → auto-update via electron-builder's `publish` config to GitHub Releases
- Affiliate links in model cards (Replicate, Fal, Runware refs) — per OSS-first multi-stream revenue feedback
- **Exit criteria:** first paid Atelier user onboarded, first royalty distributed via arcanea-onchain.

## 5. Integration map into existing Arcanea surfaces

| Arcanea surface | Studio plays role of |
|---|---|
| **arcanea.ai** main site | `/studio` subroute — the visual creation layer |
| **ArcaneaClaws** (5 autonomous social agents) | Studio is their generation backend — Claws request renders via router |
| **Creator Forge** | Every Studio output is a Creation Card in Forge with fork/lineage/royalties |
| **Publishing Layer v0.5.0** | TASTE gate already live in author chat — extends to Studio publish flow |
| **Prompt OS v1.2.0** | Daily Brief surfaces top-performing generations, Reflective Council reviews taste |
| **Library (Pro/Atelier product)** | Studio is the Library's generative engine |
| **AMCAS orchestrator** | Powers the Luminor routing in Phase 4 |
| **arcanea-onchain** | Royalty smart contracts for attribution cascade |

## 6. Vetoes — do **not** build into this fork

- ❌ Content filters / guardrails (upstream is explicitly uncensored — respect that; keep TASTE as *quality* gate, not morality gate)
- ❌ Chat with human users ("customer support") — that's a separate surface
- ❌ Training / fine-tuning UI — Phase 6+, not alpha scope
- ❌ In-app image editor (inpaint/outpaint) — Phase 6+
- ❌ Live collaboration / shared canvas — Vibeclubs owns real-time; Studio is single-user Electron or isolated web sessions

## 7. Sprint breakdown (Linear-ready)

Drop into **ARC** project under a new epic **ARC-STUDIO**:

| Ticket | Phase | Title | Est |
|---|---|---|---|
| ARC-STUDIO-01 | 0 | Fork, rebrand, verify build (DONE today) | — |
| ARC-STUDIO-02 | 1 | `@arcanea/router-spec` adapter replaces `muapi.js` | 2d |
| ARC-STUDIO-03 | 1 | Add Replicate + Fal providers | 1d |
| ARC-STUDIO-04 | 2 | Design-system token port (remove neon, add teal/cosmic/gold) | 2d |
| ARC-STUDIO-05 | 2 | Font + glassmorphism pass, design-critique gate | 1d |
| ARC-STUDIO-06 | 3 | Supabase generations + creation_cards schema + RLS | 1d |
| ARC-STUDIO-07 | 3 | Migrate history + pendingJobs off localStorage | 2d |
| ARC-STUDIO-08 | 3 | Creation Card lineage UI (fork button, parent graph) | 2d |
| ARC-STUDIO-09 | 4 | Luminor mapping — Artisan/Director/Oracle/Cinematographer | 3d |
| ARC-STUDIO-10 | 4 | Multi-studio fanout via Lumina Queen | 2d |
| ARC-STUDIO-11 | 5 | Stripe Pro/Atelier entitlement check | 1d |
| ARC-STUDIO-12 | 5 | Electron signed + notarized + auto-update | 2d |
| ARC-STUDIO-13 | 5 | Vercel deploy `arcanea.ai/studio` | 1d |

**Total:** ~20 engineering days, parallelizable to 10 calendar days across 2 agents.

## 8. License — blocker before public push

**Upstream has no LICENSE file.** README says "open-source" and "free" but no formal grant. Actions:

1. **Today:** keep fork private at `frankxai/arcanea-studio` (push with `gh repo create --private`)
2. **This week:** email Anil Matcha (`@matchaman11`) to confirm MIT / Apache-2 / similar
3. **If confirmed permissive:** flip to public, open attribution PR upstream ("Arcanea Studio is a fork — thanks")
4. **If restrictive or unresponsive:** rewrite the 3 load-bearing files (`muapi.js`, `models.js`, `models_dump.json`) from clean-room research of Muapi/provider public API docs; keep our UI components (which we will have heavily modified by then anyway); **do not distribute without clean license**

## 9. Install commands (for your laptop when you're back)

```powershell
# One-time setup
cd C:\Users\frank\Arcanea\forks\arcanea-studio
pnpm install                     # migrate from npm; CLAUDE.md rule
pnpm build                       # one-shot Next.js build (no dev server — 16GB RAM rule)

# Electron desktop (for Atelier preview)
pnpm vite:build
pnpm electron:build:win          # produces release/Arcanea Studio Setup 0.1.0.exe

# Or — web dev (only when actively testing)
pnpm dev                         # localhost:3000 — kill when done
```

Needs an API key in Settings modal on first run (Muapi key — paste yours, or stub with any provider once Phase 1 router is in).

## 10. What I did today vs. what's queued

**Done autonomously (this session):**
- Cloned upstream `@ 6f9cdee`, inspected source, confirmed architecture fit
- Copied sanitized tree (no git history) to `C:\Users\frank\Arcanea\forks\arcanea-studio`
- Rebranded `package.json` (name, version, author, homepage, repository, appId, productName) — upstream reference preserved in this doc only
- Added `@arcanea/router-spec@^1.0.2` dependency placeholder
- Kicked `npm install` in sandbox for build verification (parallel to doc)
- Wrote this evolution plan
- Created 4 TodoList tasks for session continuity

**Queued, needs your go-ahead:**
- `gh repo create frankxai/arcanea-studio --private` + push
- Email to Anil Matcha for license clarification (can draft on request)
- Spin the ARC-STUDIO epic in Linear with the 13 tickets above
- Start Phase 1 router adapter (~2 days focused agent work)

---

**Decision required from you:**

1. Push to `frankxai/arcanea-studio` **private** today, or wait?
2. Phase 1 router — use existing `@arcanea/router-spec` as-is or extend the spec first?
3. Electron-first (Atelier tier leader) or web-first (Pro tier leader) for alpha?
