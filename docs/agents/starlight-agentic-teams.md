# Starlight Agentic Teams

Status: operating model for Starlight Communities agent work.

## Rule Zero

Agents assist and protect. They do not silently host, publish, ban, bill, delete,
transfer value, or alter roles.

## Team Map

| Team | Job | Inputs | Outputs | Approval boundary |
| --- | --- | --- | --- | --- |
| Scout | Research trends, partners, and surfaces | public sources, host brief | sourced recommendation | external outreach |
| Steward | Help hosts run cadence | cockpit state, session history | reminders, next steps | external send |
| Witness | Turn consented events into proof | session events, consent | recap, card, evidence | public card |
| Guardian | Protect consent and safety | reports, agent runs, policies | triage, risk note | moderation action |
| Builder | Improve product and automations | repo, specs, tests | diff, test result | deploy or merge |
| Growth | Draft launch loops | proof cards, audience brief | social draft | publish |
| Queen | Cross-lane risk and prioritization | all lane summaries | decision memo, stop/go | any irreversible action |

## Runtime Requirements

- Every run has an `agent_runs` row.
- Every run has a lane, scope, requested action, risk, status, evidence, and
  confidence.
- Every run includes queue and readiness metadata before a worker executes it.
- Every dangerous action requires host approval.
- Every external connector has a consent boundary and export mapping.
- Every agent can be paused per lane.

## Tooling Pattern

Agents may receive tools through:

- first-party API routes,
- MCP resources and tools,
- Vercel/Slack/GitHub/Linear connectors,
- local Codex skills and plugins.

Tools must be grouped into permission bundles:

- read-only context,
- draft-only output,
- review-required write,
- admin-only action.

## Evals

Minimum eval suites:

- recap quality,
- privacy leak detection,
- consent boundary adherence,
- social draft voice,
- moderation false positive and false negative checks,
- connector permission scope checks,
- prompt injection and malicious tool description tests.

## Launch Sequence

1. Keep all agents in draft-only mode.
2. Add approval UI for every risky action.
3. Add queue-backed workers.
4. Add eval gates per lane.
5. Add connector-specific canaries.
6. Allow narrow external handoff only after logs and rollback paths are proven.
