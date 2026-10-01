# SCS-002: Consent

Status: draft 0.1.

## Purpose

Make consent visible, versioned, portable, and enforceable.

Consent is not a checkbox hidden in onboarding. It is a data object attached to
the artifacts and agent actions it enables.

## Consent Snapshot

Required fields:

- `version`
- `witness`
- `recap`
- `card`
- `social`
- `source`
- `captured_at`

Recommended values:

- `version`: stable string such as `vibeclubs.consent.v1`
- `source`: `explicit`, `default`, `legacy`, or a migration source

## Required Gates

- Recaps require recap consent.
- Proof artifacts require proof/card consent or must stay private.
- Social drafts require social consent and still require review before publish.
- Witness evidence requires witness consent when it includes personal activity.
- Consent state must be exported with every proof artifact.

## Revocation

The minimum viable revocation model:

- future artifacts use the new consent state,
- existing private artifacts can be hidden,
- exports include both the artifact and its consent snapshot,
- irreversible public publication is never performed by agents without approval.

## Failure Cases

An implementation fails this standard when:

- it streams recaps without explicit consent,
- it creates public proof by default without a consent record,
- it lets agents publish externally on consent alone,
- it cannot show which consent version produced an artifact,
- it cannot include consent in export bundles.

