# SCS-004: Export

Status: draft 0.1.

## Purpose

Make sovereignty practical: a person or host can leave with readable data.

## Bundle Requirements

Required top-level fields:

- `schema`
- `exported_at`
- `subject_user_id` or equivalent subject actor id
- `portability`
- `data`

Required `data` sections:

- `profile`
- `owned_clubs` or equivalent groups
- `memberships`
- `sessions` or equivalent gatherings
- `session_cards` or equivalent proof artifacts
- `agent_runs`
- `reports`
- `social_drafts`

## Portability Metadata

Required fields:

- format
- federation/adapters readiness flag
- notes

## Export Rules

- Export only rows the requester can read.
- Include consent snapshots on proof artifacts.
- Include agent evidence where readable.
- Include reports filed by the requester.
- Do not include call recordings unless the implementation explicitly supports
  recording consent and retention.

## Adapter Strategy

Adapters are optional. The export bundle is the stable core.

Recommended adapters after retention proves out:

- DID/Verifiable Credential export for identity and proof claims.
- ATProto/Farcaster proof publication.
- Nostr event mirror.
- Markdown archive.

## Failure Cases

An implementation fails this standard when:

- export is missing agent runs,
- proof artifacts lack consent snapshots,
- export requires paid access,
- export cannot run from an authenticated actor,
- exported data is only useful to the original application.

