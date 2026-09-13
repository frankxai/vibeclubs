# Vibeclubs: from intent to a repeatable creative practice

Implementation record · 2026-09-14

## Product decision

A vibeclub is a small crew, a shared clock, and something real to show. People may work on one project or different projects. The shared product is the rhythm, explicit finish, optional help, and evidence of progress. A human hosts. Existing call, creative, and coding tools remain the runtime.

The primary unit is a **completed lock-in with a useful artifact**, not a listing, chat message, model call, or membership. An unfinished artifact with an honest next action is valid. There are no invented attendance counts or compulsory public posts.

`/start` is now an authoring tool. It must work without an account, database, model key, extension, or paid integration. Hosted publication is a separate, deliberate action. This implements ADR-002 and ADR-004 without reviving the legacy meeting infrastructure.

## Delivered in this change

- Six craft paths: vibe coding, agent engineering, design, music, writing, mixed crew.
- Editable outcome, name, 2–8-person crew, meeting choice, soundtrack, optional time with timezone.
- Deterministic 60/90/120-minute agendas matching the host skill's canonical arithmetic.
- Device-local draft restoration with schema validation; corrupt storage does not block creation.
- Invite, host agenda, build brief, technical v0 prompt, recap prompt, and contingency instructions.
- Clipboard fallback, Markdown download, reset, accessible tabs and choices, responsive layout.
- Known template deep links initialize the craft and relevant meeting defaults. Existing drafts take precedence to avoid refresh data loss.
- Existing public listing/authentication form remains behind its original configuration check.
- AI SDK 4 → 6 migration, Anthropic provider 1 → 3, existing recap token option migrated.
- Optional `/api/build-brief`: authenticated, structured scope refinement with a durable daily quota.

## What v0 owns; what the editor owns

v0 receives a human-reviewed prompt for the product's visible interaction and responsive states. The builder supplies a copyable prompt and a link to v0. This is a handoff, not an embedded v0 API integration, and does not claim to generate or deploy anything inside Vibeclubs.

An editor agent inspects the actual repository, implements the smallest behavior, runs checks, and returns a diff and evidence. Vercel provides a preview for a human to review. No generated code runs inside the Vibeclubs request handler.

The next v0 integration should retain explicit consent before sending a private brief. The v0 project/chat identifier, artifact revision, and preview URL belong to an artifact record; provider credentials belong on the server. Add the direct API only after its account, billing, and usage limits are configured. Do not put an unmetered generation button on the public route.

## Agent engineering contract

The agent path produces one bounded task with typed tool inputs, output evidence, timeout, step/token budget, and failure checks. Every external write needs explicit human authorization. A model's prose is not evidence that a tool acted.

The engineering loop is:

1. Inspect the source and acceptance constraints.
2. Scope one task, its tools, its budget, and observable success/failure.
3. Build an isolated reviewable change.
4. Verify the result independently; failures return to implementation.
5. Present the artifact and evidence to the human before release.

AI is a drafting and implementation capability, not the host. No automatic meeting observation, unsolicited coaching, crew messaging, attendance inference, or autonomous publishing is added.

## Implemented AI boundary

The current optional endpoint uses AI SDK 6 `generateText` with `Output.object` and a Zod schema. It receives the draft but sends only craft, outcome, and duration to Anthropic. It returns a proposed finish, steps, checks, and one scope cut. It has no tools and cannot execute code or publish.

The route requires `AI_BRIEF_ENABLED=true`, Anthropic credentials, valid hosted configuration, matching request origin, valid authenticated identity, and a successful quota claim. Request bodies are bounded to 8 KiB while streaming. Output is bounded to 1,000 tokens, with no provider retries and a 20-second abort. Generated text is rendered as text, never HTML.

The database function atomically reserves up to ten requests per authenticated account per UTC day. Quota is consumed even when the provider fails, to bound repeated upstream work. It fails closed when the migration is missing. Old counters are removed on the account's next request; no prompt or model response is stored in that table. Counter access is through the authenticated function, not direct table access.

### Activation gate

AI refinement is implemented but disabled by default. To activate, apply `supabase/migrations/20260914000000_build_brief_quota.sql` to the intended project, verify quota concurrency and account isolation, confirm hosted sign-in, configure the server Anthropic key, then set `AI_BRIEF_ENABLED=true` and deploy. Set a provider account spending cap and Vercel WAF abuse limits before public activation; a per-account cap does not prevent account farming.

This change does not claim that database migrations, provider billing, or production AI were provisioned. The primary pack workflow does not depend on them.

## Next product slices and evidence gates

| Slice | Product behavior | Gate before release |
| --- | --- | --- |
| Host pack (this change) | A person leaves with something they can run immediately | No-account export, reload safety, correct timing, readable mobile layout |
| Verified first run | Capture the actual finish and consented artifact in a reusable recap | Real host pilot; no fabricated attendance; private work supported |
| Hosted continuity | Reuse club defaults and link explicitly shared artifacts | Database/auth receipt, tenant isolation and deletion behavior |
| Direct v0 handoff | Generate an isolated preview from a reviewed brief | Scoped credentials, usage limits, cancel/retry behavior, verified preview |
| Agent tool execution | Execute approved build tasks in a sandbox | Isolation, network/file allowlists, human write gates, cost telemetry, eval suite |
| Repeat practice | Hosts return with the same crew and a new reachable finish | Observed repeat hosting and useful artifacts, not vanity activity |

Vercel Sandbox is the future execution boundary for untrusted generated code. Long-running work should use durable workflows rather than extending an HTTP request indefinitely. A model gateway is useful when measured quality/cost requirements justify multiple providers. These are planned boundaries, not claims of installed services.

## Minimal future data model

`club` holds the format and host ownership. `run` captures the declared intent and duration. `artifact` holds an explicit proof link and sharing scope. `agent_run` records task version, approved capabilities, budget, outcome, and verification references. `release` identifies the reviewed artifact revision and destination. Keep invitations and private locations out of public artifact payloads.

Do not store all of these before hosted continuity is needed. The current local version deliberately persists only the validated draft.

## Measurement

First meaningful metric: a host can produce a usable pack and run it with another person. Next: those people return and make something again. Track export completion, actual artifact completion, repeat hosting, and model cost per accepted brief only after a privacy-conscious measurement plan is implemented. No new analytics provider is installed in this change.

## Technical references

- [AI SDK 6](https://v6.ai-sdk.dev/)
- [AI SDK 6 migration guide](https://ai-sdk.dev/docs/migration-guides/migration-guide-6-0)
- [v0](https://v0.app/)
- [Vercel Sandbox](https://vercel.com/docs/vercel-sandbox)

Keep these external capabilities distinct from the installed versions and verified production behavior recorded above.
