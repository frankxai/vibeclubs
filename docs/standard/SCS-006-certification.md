# SCS-006: Certification

Status: draft 0.1.

## Purpose

Make "Starlight-compatible" testable.

Certification is not a badge for vibes. It is a conformance report against the
standard.

## Certification Levels

### L1: Exportable

- bundle has required top-level fields,
- bundle has required data sections,
- proof artifacts and agent runs are included.

### L2: Consentful

- consent snapshots are versioned,
- recap/card/social/witness permissions are explicit,
- proof artifacts include consent snapshots.

### L3: Agent-Accountable

- agent runs include scope, action, risk, status, approval state, and evidence,
- irreversible actions require approval,
- review-required work is blocked or pending.

### L4: Host-Operable

- hosts can inspect pending agent runs,
- hosts can approve/reject social drafts,
- cockpit surfaces proof, risk, repeat use, and export readiness.

### L5: Adapter-Portable

- exports can map to at least one external identity/proof/social protocol,
- adapters are optional and reversible.

## Required Evidence

- schema or migration references,
- API route references,
- export example,
- test output,
- security/RLS notes,
- known gaps.

## Governance

Changes to SCS documents require:

- a changelog entry,
- migration notes if schemas change,
- conformance test updates,
- red-team review for agent, moderation, export, or consent changes.

