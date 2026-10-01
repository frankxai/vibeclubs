# SCS-005: Host Ops

Status: draft 0.1.

## Purpose

Prevent host burnout and vanity dashboards.

The host cockpit should answer: what happened, what needs review, what proof
exists, what risk is open, and what to do next.

## Required Cockpit Signals

- hosted groups
- recent gatherings
- time saved or contribution total
- participant count
- proof artifacts
- pending agent reviews
- pending social drafts
- export readiness
- report or moderation queue
- repeat-use signal

## Money Signal

Revenue readiness must be inferred from behavior:

- repeat gatherings,
- proof artifacts,
- drafts or referrals,
- host time saved,
- participant retention.

Billing is not part of the base standard. A product should not add billing
before the ritual repeats.

## Review Surface

Hosts need a review queue for:

- pending agent runs,
- social drafts,
- reports,
- moderation actions,
- exports triggered by agents.

Minimum actions:

- approve
- reject
- block
- record reason

## Failure Cases

An implementation fails this standard when:

- host metrics are vanity only,
- review queues are hidden,
- agents create work hosts cannot inspect,
- money features ship before repeat use,
- reports are not visible to an accountable reviewer.

