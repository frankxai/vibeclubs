# ADR-004: Skill-first host pack

Status: implementation proposed for review, 2026-09-07.

## Decision

Deliver one Vibeclubs plugin with the host-a-vibeclub skill in this repository.
The skill produces runnable host packs using existing tools; the human hosts.
Keep the format open. Add no new MCP, accounts, payments, call infrastructure,
or automatic observation in this change. The extension is optional, not a
prerequisite for hosting. Preserve ADR-002's format-not-platform boundary.

The web distribution fallback is /host-pack.txt: a copyable prompt, not a claim
that the plugin is installed or publicly approved. Plugin marketplace submission
and host-specific installation remain distinct release actions.

## Boundaries

Vibeclubs owns the shared making ritual and its host pack. GenCreator retains
curriculum and paid cohort ownership. Arcanea-specific lore remains optional and
outside this neutral plugin. Assistant preparation is compatible with the
existing witness-not-host rule: the assistant does not run or monitor a call.

## Conflict ledger

| Earlier statement | Current interpretation |
| --- | --- |
| Extension is the runtime | Optional runtime enhancement; a human can host from the pack alone |
| README Pro $12; VISION Builder $9 / Opener $29 | Historical hypotheses, not approved offers; no billing in this release |
| Previous chat suggested Host Pro $19 | Unvalidated suggestion, not an implemented or approved price |
| Scheduling veto versus paid scheduling ideas | Drafting timing and invitation copy is allowed; no new scheduler or calendar writes |
| Legacy sprint assumes npm/store publication | Source, validation, installation, submission and public availability are separate states |
| ADR-003 suggested in prior chat | ADR-003 already governs voice; preserve it and use ADR-004 |

## Evidence gate for additional services

Review the first ten real gatherings. Record only voluntarily supplied host
feedback: preparation time, whether the gathering happened, declared output,
repeat hosting, and requested missing capability. Do not invent seed activity.
Add publishing, persistence, calendar integration, or an MCP only when a repeated
job needs it. Reuse a common application contract instead of MCP-only logic.

## Acceptance

- Valid plugin manifest and skill frontmatter; every reference resolves.
- Host pack handles online, in-person, private work, and absent tooling.
- 60/90/120-minute example plans have exact duration arithmetic.
- No fabricated publication, installation, synchronization, or attendance.
- Public text is available on the reviewed deployment before claiming release.
- Existing hosted-service gates and unrelated PRs remain untouched.
