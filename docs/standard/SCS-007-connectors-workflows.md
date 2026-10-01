# SCS-007: Connectors And Workflows

Status: draft 0.1.

This document defines how Starlight Communities should connect to Web2, Web3,
and Web4 surfaces without losing sovereignty, consent, or agent accountability.

## Connector Contract

Every connector must declare:

- `id`: stable machine identifier.
- `ecosystem`: `web2`, `web3`, or `web4`.
- `mode`: surface, identity, proof, governance, automation, or agent tool.
- `priority`: now, next, or later.
- `minimumScopes`: least-privilege scopes only.
- `consentBoundary`: what data the connector may read or write.
- `exportMapping`: which Starlight export records the connector touches.
- `supportedRisks`: read, write, external send, value transfer, or admin.
- `reviewRequiredFor`: risky actions that require human review.

The executable registry lives in
`packages/starlight-communities-standard/src/connectors.ts`.

## Required Gates

A connector is not compatible unless:

1. It has an explicit consent boundary.
2. It maps back to exportable records.
3. It uses least-privilege scopes.
4. It requires review before writes, external sends, value movement, or admin
   actions.
5. It fails closed when the adapter is unavailable.

## Priority Order

### Now

- Sovereign Export API.
- GitHub Discussions and Issues for developer proof.
- Discord Activity for in-place lock-ins.

### Next

- Slack Workflow Builder handoff.
- Farcaster Mini App proof and launch flows.
- MCP agent connectors with tool-call ledgers.

### Later

- AT Protocol proof feed.
- Snapshot governance.
- Guild and Collab.Land gated access.

## Workflow Contract

Every workflow must declare:

- trigger,
- steps,
- produced artifacts,
- consent checkpoints,
- human approval boundaries,
- export records.

The first standard workflows are:

- lock-in to proof,
- host review to post,
- Web3 gated lock-in,
- agent scout to draft,
- export to protocol adapter.

## Web2 Pattern

Use Web2 connectors to reduce friction:

- embed into Discord where crews already gather,
- route proof into GitHub where builders already ship,
- let Slack teams trigger workflows without changing tools.

Web2 connectors should not become hidden surveillance. They may ingest only
explicit commands, activity events, and consented proof artifacts.

## Web3 Pattern

Use Web3 connectors for optional ownership and verification:

- read-only wallet or role checks,
- public proof publishing,
- governance summaries,
- token or NFT access only when it improves trust.

No connector should require wallet-first onboarding for the core lock-in loop.

## Web4 Pattern

Use Web4 connectors for bounded agent autonomy:

- MCP resources for approved context,
- MCP tools for approved actions,
- prompts and workflow templates as reviewable artifacts,
- agent identities and logs for every action.

Web4 claims are invalid without explicit approval boundaries, independent agent
identity, audit logs, and a way to export or revoke data.

## Conformance

Use `evaluateConnectorReadiness()` to score each connector and
`evaluateWorkflowReadiness()` to score each workflow. Any connector or workflow
scoring below 100 is not compatible with SCS draft 0.1.
