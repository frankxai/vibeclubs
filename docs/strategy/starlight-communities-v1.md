# Starlight Communities V1 Operating Model

Status: substrate and first operator surfaces are now implemented in Vibeclubs.

Vibeclubs remains the first shippable wedge: a format for crews that lock in and
ship on tools they already use. Starlight Communities is the reusable substrate
under that loop: explicit consent, exportable data, portable proof, reports,
social drafts, and audited agent work.

For the next connector and agent-runtime layer, read
`docs/research/community-needs-2026.md`,
`docs/standard/SCS-007-connectors-workflows.md`, and
`docs/strategy/sovereign-intelligence-system-roadmap.md`.

## Executive Choice

Build the sharp loop first:

1. Host creates a vibeclub.
2. Crew locks in from the extension or `/lock-in`.
3. Session facts are saved with explicit consent.
4. Portable cards, recaps, drafts, and agent evidence flow from those facts.
5. Host uses `/host` to see status, growth signal, review queue, proof shipped,
   time saved, and export readiness.

Do not build a generic community platform. The category is crowded and vague.
The wedge is proof-of-work social focus: people show up, make progress, and
leave with portable evidence.

## How To Use It

- Create a vibeclub at `/start`.
- Run a block with the Chrome extension when the crew is inside Meet, Discord,
  Zoom, or another app.
- Use `/lock-in` when someone does not have the extension yet. This keeps the
  adoption path honest and still records consent, proof, and exportable data.
- Use `/host` as the daily cockpit. It shows:
  - time saved from logged focus minutes,
  - crew count from signed-in participants,
  - proof cards created,
  - growth drafts waiting for review,
  - agent runs that need approval,
  - export bundle readiness.
- Use `/host/review` to approve, reject, or block risky agent runs and launch
  drafts before anything external moves.
- Use `GET /api/export` to download a signed-in user's portable JSON bundle.
- Use `POST /api/export` to store a 30-day export snapshot in `data_exports`.
- Use `@starlight/communities-standard` as the executable conformance package
  for export, consent, and agent-run checks.

## How It Works

### Data Layer

- `session_participants`: who joined a logged block, with consent flags.
- `session_cards`: portable public artifacts with attestation and consent
  snapshot metadata.
- `agent_runs`: evidence for Guardian, Witness, Growth, Builder, and Queen
  workers.
- `reports` and `moderation_actions`: safety and abuse audit rail.
- `data_exports`: versioned Starlight JSON bundles.
- `social_drafts`: launch post candidates that require review.

### Consent Layer

`buildConsentSnapshot()` produces a versioned consent object for every block.
The API writes it to participant rows and session-card rows. Recap generation is
blocked unless recap consent is explicit. Social and witness evidence are also
explicit choices.

### Agent Runtime Layer

`resolveAgentRunPolicy()` gates agent runs:

- low/normal risk draft work can be queued without approval,
- high or sovereign risk work is forced to `needs_review`,
- irreversible actions such as external sending, moderation, billing, export,
  delete, or admin write require approval,
- approval constraints are enforced again in SQL.

Agents can help draft, summarize, review, and recommend. They do not publish,
ban, bill, delete, or promote production without approval.

### Sovereignty Layer

Sovereignty is practical, not decorative:

- RLS protects user-owned tables.
- Export bundles include profile, owned vibeclubs, memberships, sessions,
  cards, agent runs, reports, and social drafts.
- Web5, DID, Nostr, ATProto, Farcaster, and other ecosystems stay
  adapter-first. They plug into the export/card/identity boundary after the
  core loop proves retention.

## Leadership Lanes

### CEO

Win a narrow market before expanding: hosted lock-in crews for builders,
creators, study groups, and operator cohorts. Success is repeat sessions, proof
cards, and social pull, not signups alone.

### CTO

Keep the stack boring where trust matters: Next.js, Supabase RLS, typed route
schemas, SQL constraints, Vercel previews, Vitest policy tests, and Playwright
smoke checks. Add queues only when agent work needs durable retries.

### CPO

First-week product promise: a host can create a vibeclub, invite the crew, run a
block, save proof, and see the cockpit update. Consent must feel visible and
normal, not buried.

### CMO

Market the behavior, not the substrate. The phrase is "host a vibeclub, lock in,
ship the thing." Proof cards and recap clips become the distribution surface.

### CAIO

Use agents as accountable operators:

- Guardian watches reports, abuse, privacy, and policy drift.
- Witness turns consented session events into recaps and evidence.
- Growth drafts launch posts and variants.
- Builder proposes code and tests.
- Queen synthesizes cross-lane risk and decides when to stop.

Every agent run gets evidence. Every risky run gets review.

## Milestones

### M0: Substrate Foundation

Done in this pass:

- portable session cards,
- reports and moderation audit rail,
- data exports,
- social drafts,
- agent run evidence,
- queue envelopes and readiness evals on agent runs,
- consent snapshots,
- approval constraints,
- RLS contract tests,
- `/host` cockpit,
- `/host/review` approval queue,
- `/lock-in` web fallback.

### M1: Trust And First-Week Use

- Apply migrations to the live Supabase project.
- Verify RLS with real authenticated users.
- Add consent copy to extension onboarding.
- Add host share/invite analytics without dark patterns.
- Run the standard conformance package against real export bundles.

### M2: Durable Agent Runtime

- Replace the current queue envelope scaffold with a durable worker and retry
  runner.
- Add eval fixtures for Guardian, Witness, Growth, Builder, and Queen.
- Add per-lane permissions and scoped tools.
- Use the connector registry in `@starlight/communities-standard` to reject
  unsafe adapter work before implementation.
- Add red-team tests for prompt injection, accidental publishing, bad exports,
  and report abuse.

### M3: Distribution Loop

- Turn session cards into profile/recent-proof surfaces.
- Add approved social draft handoff to Postiz or n8n.
- Add creator cohort templates.
- Add referral links that point to a specific vibeclub or saved block.

### M4: Sovereign Adapters

- Ship connector readiness tests before adapter code.
- Add DID/Verifiable Credential export adapter.
- Add ATProto and Farcaster proof-card publishing adapters.
- Add Nostr event adapter for public proof.
- Keep all adapters optional and reversible.

### M5: Revenue

- Only after repeat use is visible:
  - founding host kit,
  - featured vibeclub placement,
  - cohort ops package,
  - white-label host dashboard,
  - enterprise export and audit tier.

No billing before the habit is real.

## Red-Team Verdict

This is stronger than a generic community product because it has a concrete
behavior loop, an artifact people can share, and trust primitives underneath.
It is not yet stronger if the project drifts into protocol-first architecture or
agent theater.

Main risks:

- RLS claims are only as good as live-project tests.
- The extension is powerful but adoption can be slow, so `/lock-in` must stay
  excellent.
- Consent must be visible on every recap/card/social path.
- Agent approval needs a real UI, not only API policy.
- Money should wait for repeat sessions and proof-card pull.
- Web5 should stay adapter-first until the first-week user magic is undeniable.

Decision rule: if a feature does not help a host create a block, get the crew to
show up, save proof, protect consent, or grow from that proof, it waits.
