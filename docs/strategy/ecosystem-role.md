# Vibeclubs in the ecosystem

*Positioning doc. Written 2026-04-22. Reconciles vibeclubs.ai with `gencreator.ai/strategy_v3.md` (same day) and the Starlight SIP substrate.*

---

## The question this doc answers

"Frank already has a sophisticated constellation — SIP substrate, 14 Arcanea pillars, a 64-agent Luminor Conductor, a GenCreator OS with three engines, a DPI substrate, a research hub pattern. Where does vibeclubs sit inside that? And what does it uniquely do that nothing else in the stack does?"

## The one-sentence answer

**Vibeclubs is the practice surface of the GenCreator OS.** The place where research → stack library → curriculum finally becomes *work a human did with their crew, on a Tuesday night, in 90 minutes, with a recap to prove it*.

Everything else in Frank's stack produces *artefacts* (posts, stacks, reports, curriculum, agents). Vibeclubs produces *sessions* — the unit of time in which a creator actually ships.

---

## Map

```
                     ┌──────────────────────────────────┐
                     │   Starlight · SIP substrate      │   portable contract
                     └────────────────┬─────────────────┘   (file spec)
                                      │
          ┌───────────────────────────┼───────────────────────────┐
          │                           │                           │
    FrankX vertical           GenCreator OS              DPI · Wealth IS
    (personal brand,          (operating system           (monetization
     enterprise AI,            for creators)               substrate)
     research hub)                    │
                                      │
                       ┌──────────────┼──────────────┐
                       │              │              │
                Engine 1           Engine 2        Engine 3
                Research &         Cohort          Curriculum &
                Stack Library      Community       Substrate Routing
                (gencreator.ai     (6-wk cohorts,  (Explorer → GenCreator
                 /research,         ACOS-led,       → Operator arc)
                 /stacks)           June onward)
                       │              │              │
                       └──────────────┼──────────────┘
                                      │
                                      ▼
                       ┌──────────────────────────────┐
                       │   VIBECLUBS · practice surface│
                       │   (format + extension + npm)  │
                       │                               │
                       │   Where the work happens.     │
                       │   Outputs session cards that  │
                       │   feed back into research.    │
                       └──────────────────────────────┘
                                      │
                      ┌───────────────┴───────────────┐
                      │                               │
                Arcanea (hosted)                Anime Legends
                — premium retreats,             — narrative IP
                  Guardian agents,                substrate
                  curated vibeclubs
```

## What vibeclubs is NOT (clarifying against veto list)

Per `VISION.md`:

- Not a meeting platform.
- Not a curriculum host. (GenCreator is.)
- Not a research hub. (frankx.ai/research + gencreator.ai/research are.)
- Not a community platform. (Circle + Discord are, for their respective audiences.)
- Not a cohort host. (gencreator.ai is.)
- Not a monetization substrate. (DPI is.)

Vibeclubs is **the format** crews run during any of the above.

## What vibeclubs uniquely owns

1. **The ritual definition.** What a "vibeclub" is. The playbook. The voice. The five words.
2. **The extension runtime.** Mixer + synced pomodoro + recap overlay, on any platform.
3. **The OSS toolkit.** Five `@vibeclubs/*` npm packages any cohort / product / community can compose with.
4. **The directory.** Where anyone can list a public vibeclub and anyone can find one tonight.
5. **The session card.** The deterministic proof-of-work artefact.

Everything in this list is *format-layer*, not platform-layer. That is the ADR-002 commitment.

---

## The flywheel (one full loop)

1. **Monday AM** — Frank picks a research question in GenCreator Engine 1 ("Claude 4.7 vs Opus 4.6 for long-form writing across 50 tasks"). Runs the test solo.
2. **Monday PM** — Frank ships raw artefacts into `gencreator.ai/research` pipeline. ACOS multiplies into 8 downstream outputs (post, YT long, clips, X thread, LI, newsletter, Circle drop, `/stacks` entry).
3. **Tuesday night** — A June cohort member sees the new stack entry, wants to try it on their project. They open `vibeclubs.ai/explore`, find a claude-code vibeclub running in their timezone tonight. They install the extension. They lock in for 90 minutes with 4 other people.
4. **Wednesday AM** — The session card lands on their profile with duration + cycles + platform. Claude wrote a 3-bullet recap. They post the card to X. One new Explorer sees it.
5. **Wednesday PM** — That Explorer lands on `gencreator.ai` via the card. Joins the newsletter. The loop just closed.

Every session is both consumption (of the stack knowledge) and production (of the proof artefact). Vibeclubs is the conversion point where passive research becomes active practice.

---

## How vibeclubs serves each engine

| GenCreator Engine | What vibeclubs provides |
|---|---|
| **Engine 1 — Research & Stack Library** | Cohort members run vibeclubs to *test* a stack recipe from `/stacks`. Their session cards become qualitative evidence. Member-spotlight research reports (Strategy v3 §2) recruit from the vibeclubs that produced standout cards. |
| **Engine 2 — Cohort Community** | The cohort's weekly 90-min "lock-in" runs as a vibeclub. The extension provides the synced pomodoro. The session card is submitted as the week's proof-of-work. Guardians (Otome, Veloura, Watcher) observe via AI-witness and contribute recap without hosting. |
| **Engine 3 — Curriculum & Substrate Routing** | Vibeclubs is one of the curriculum's atomic rituals: "complete 4 vibeclubs in Week 2 to graduate to Week 3." The session count is a verifiable curriculum checkpoint. |

## Who runs cohort vibeclubs

Per Strategy v3 §3: cohorts are ACOS-led with Frank in cameo. Mapping that onto vibeclubs:

- **Host role** — rotating cohort member OR Guardian-run pilot vibeclub. Never Frank as the default.
- **Recap** — the AI-witness (`@vibeclubs/ai-witness`) writes the first-pass recap. Veloura (communication Guardian) polishes for cohort-wide distribution.
- **Session tracking** — extension auto-logs into Supabase → streams into the cohort's `vibe_sessions` table (already provisioned in gencreator.ai per GO-LIVE §1). Cross-repo link via member handle.
- **Frank's weekly cameo vibeclub** — Monday 18:00 CET, Frank hosts one public vibeclub on vibeclubs.ai + X. Open to cohort + anyone. The agenda is *the* stack test of the week. This is the dogfooding commitment and the recruitment channel.

---

## What to expose where (surface rules)

| Surface | Shows | Does not show |
|---|---|---|
| `vibeclubs.ai/` landing | Format pitch. Extension install. Public directory. OSS packages. Voice stays the five words. | Business model beyond Free/Pro. Cohort copy. Curriculum. |
| `vibeclubs.ai/playbook` | How to host a vibeclub. How to join one. Format variations. Free, MIT, AEO-optimized. | Cohort curriculum. GenCreator marketing. |
| `vibeclubs.ai/explore` | All public clubs + cohort-run clubs (tagged). | Private cohort rooms, member lists. |
| `gencreator.ai/cohort` | Cohort curriculum. Enrollment. Schedule. Includes "vibeclubs are how we lock in each week." | Vibeclubs-format playbook (link out, don't duplicate). |
| `gencreator.ai/research` | Lab reports. Stack benchmarks. Links *into* relevant vibeclubs for practice. | Host controls. Session-tracking UI. |
| `frankx.ai/research` | AI-neuroscience research. Cross-link to vibeclubs where "flow state practice" is the human application. | Cohort mechanics. |
| `dpi/` (repo) | Monetization substrate. Links vibeclubs as one of the "sovereign creator rituals." | Vibeclubs format copy. |

## Voice cross-compatibility

VISION.md Voice section is the source of truth for vibeclubs copy. It constrains this repo's surfaces only. FrankX, GenCreator, Arcanea, DPI each have their own voice profiles (stored in their own AGENTS.md / SKILL.md per the SIP pattern). Cross-link via canonical hero only, not shared vocabulary.

---

## Near-term (through end of Sprint 1, May 14)

What this ecosystem framing changes about the active Sprint 1:

| Change | Why |
|---|---|
| Add a `docs/strategy/` folder (this commit) | Makes the ecosystem role legible to any cohort member who audits the OSS repo. |
| `/explore` directory seeds to include 1 Frank-hosted public vibeclub | The Monday cameo commitment. Needs a concrete slug like `claude-code-mondays`. |
| `/playbook/running-a-cohort-vibeclub` entry | Written before June cohort launch. Links out to `gencreator.ai/cohort` — not duplicated. |
| Extension emits a `cohort_id` field when present in session payload | Already supported by Supabase schema (nullable). Enables cross-repo cohort attribution. |
| `@vibeclubs/session-card` accepts a cohort badge | Optional prop; renders cohort emoji + name alongside platform pill. Strictly optional — public vibeclubs stay clean. |

What it does NOT change:

- Sprint 1 ship criteria stay identical. Ticket list is unchanged.
- No payments in Sprint 1. Stripe = Sprint 2.
- No LiveKit. ADR-002 holds.
- The five-word voice system holds.

## Post-Sprint-1 (May 15 → June launch)

| Week | Action | Owner |
|---|---|---|
| May 15–21 | Launch week. Show HN, X, Product Hunt. 3 internal vibeclubs seeded. | Frank + ACOS distribution agents |
| May 22–28 | First public cohort slot opens on gencreator.ai, referencing vibeclubs as the lock-in format. | gencreator.ai |
| May 29–Jun 4 | Cohort 1 intake closes. Vibeclubs extension used by 30+ cohort members in onboarding week. | Guardians + Frank cameo |
| Jun 5–Jul 16 | Cohort 1 runs (6 weeks). Four vibeclubs per member minimum. Session cards become curriculum artefacts. | ACOS + cohort members |
| Jul 17+ | Post-cohort retrospective. Session-card aggregate becomes first "State of Cohort 1" research report on gencreator.ai/research. | Frank + Otome |

## What could break this framing

Flag on review:

1. If vibeclubs.ai develops a cohort management UI → violates veto list (host controls). Cohort management stays on gencreator.ai.
2. If the extension starts broadcasting the music layer → DMCA risk (VISION §5). Per-listener only.
3. If we build a curriculum on vibeclubs.ai → drift from format-not-platform. Link out to gencreator.ai/cohort.
4. If "Guardians" leak into vibeclubs.ai consumer copy → drift from voice system (no capital-noun feature names in consumer copy). The package name `@vibeclubs/ai-witness` stays technical.

## Open decisions

These are decisions Frank needs to make that this doc cannot make alone:

1. **Cameo slot timing.** Monday 18:00 CET is the default proposal. Alternatives: Sunday 20:00 CET (end-of-week shipping), Friday 15:00 CET (before weekend). Pick one.
2. **Public cohort vibeclub tagging.** Should cohort-run vibeclubs be visible on `/explore` with a cohort badge, or private to cohort members? Proposal: public + badge (recruitment channel). Flagged for review.
3. **Session card cross-brand routing.** When a cohort member posts a session card, should it link back to `vibeclubs.ai/u/<handle>` or `gencreator.ai/u/<handle>`? Proposal: card links to vibeclubs handle; cohort dashboard on gencreator.ai pulls the card via handle match.

If you disagree with any of the above, overwrite this file — the `VISION.md` principles do not change but positioning and mechanics can.
