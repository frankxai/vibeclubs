# SCS-001: Core

Status: draft 0.1.

## Purpose

Define the minimum shared language for Starlight-compatible products.

A Starlight-compatible product must help a human group run a repeatable ritual,
create proof, and retain control over identity, data, and agent assistance.

## Core Objects

### Actor

A person or service account that can own data, host a group, join a gathering,
request export, file reports, or approve agent work.

Required fields:

- `id`
- `display_name` or recoverable profile reference
- `created_at`
- export subject reference

### Group

A group of humans gathering around a recurring purpose. In Vibeclubs this is a
vibeclub.

Required fields:

- `id`
- `slug` or public handle
- `name`
- `description`
- `host_actor_id`
- `created_at`
- active/paused state

### Gathering

A time-bounded shared activity. In Vibeclubs this is a lock-in block or logged
session.

Required fields:

- `id`
- optional `group_id`
- `actor_id`
- `started_at`
- optional `ended_at`
- contribution or duration metrics
- metadata object

### Participant

An actor participating in a gathering.

Required fields:

- `gathering_id`
- `actor_id`
- role
- joined timestamp
- contribution metrics
- consent snapshot or consent flags

### Proof Artifact

A shareable output produced from the gathering.

Required fields:

- `id`
- optional `gathering_id`
- `actor_id`
- optional `group_id`
- public payload
- attestation
- consent snapshot
- visibility
- `created_at`

### Agent Run

A durable record of agent work.

Required fields:

- `id`
- actor or requester
- agent name
- lane
- scope
- requested action
- risk
- status
- approval state
- input summary
- output summary
- evidence
- timestamps

### Report

A user-submitted safety, privacy, quality, or abuse report.

Required fields:

- `id`
- reporter
- subject type
- subject reference
- reason
- status
- timestamps

### Export Bundle

A portable archive of actor-readable data.

Required fields:

- schema version
- exported timestamp
- subject actor id
- portability metadata
- data sections

## Roles

- `owner`: accountable for the group.
- `host`: runs the ritual and reviews risky operations.
- `participant`: joins and contributes.
- `reviewer`: can approve or reject bounded actions.
- `agent`: service actor that drafts, summarizes, evaluates, or recommends.

## Compatibility Requirements

An implementation is Starlight-compatible only when:

- core objects can be mapped to the above model,
- proof artifacts carry consent or visibility state,
- export includes all actor-readable objects,
- agent runs are persisted,
- high-risk or irreversible work requires review,
- reports are durable before public discovery scales.

