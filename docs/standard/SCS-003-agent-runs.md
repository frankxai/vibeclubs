# SCS-003: Agent Runs

Status: draft 0.1.

## Purpose

Let agents assist without becoming invisible authorities.

Every meaningful agent operation must be logged, scoped, risk-rated, and
reviewable.

## Agent Lanes

- `guardian`: safety, privacy, reports, abuse triage, policy checks.
- `witness`: recaps, proof artifacts, memory, contribution summaries.
- `growth`: social drafts, launch variants, partnership prompts.
- `builder`: code, tests, docs, automations, integrations.
- `queen`: synthesis, escalation, stop/go decisions, cross-lane risk.

## Run States

- `draft`
- `queued`
- `running`
- `needs_review`
- `approved`
- `blocked`
- `failed`
- `completed`

## Approval States

- `not_required`
- `pending`
- `approved`
- `rejected`
- `blocked`

## Review-Required Actions

The following actions always require human approval:

- external sending
- moderation enforcement
- billing
- exports performed by an agent
- deletion
- admin writes
- production promotion
- policy or standard changes

## Queue Contract

Durable queues should store:

- idempotency key
- requested action
- scope
- payload reference
- not-before timestamp
- attempt count
- last error
- linked `agent_run_id`

The first implementation may use `agent_runs` as the durable ledger while queue
infrastructure is added.

## Eval Contract

Every agent lane should have eval fixtures before scale:

- Guardian: false positives, false negatives, escalation quality.
- Witness: recap accuracy, privacy leaks, tone, source faithfulness.
- Growth: voice fit, no autopublish, no claims beyond evidence.
- Builder: tests, rollback notes, blast radius.
- Queen: stop/go quality and risk synthesis.

## Failure Cases

An implementation fails this standard when:

- agent outputs are not attributable,
- high-risk actions skip review,
- failures disappear without evidence,
- agents can publish, bill, ban, delete, or promote silently,
- there is no eval path for core agent lanes.

