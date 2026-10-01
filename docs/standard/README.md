# Starlight Communities Standard

Status: draft 0.1, implemented first through Vibeclubs.

Starlight Communities is a standard for sovereign, agent-assisted human groups.
It is not a replacement social product. A compatible implementation helps a
group gather, create proof, protect consent, use accountable agents, and leave
with its data.

## Standard Documents

- `SCS-001-core.md`: core objects, roles, and compatibility levels.
- `SCS-002-consent.md`: consent snapshots and artifact permissions.
- `SCS-003-agent-runs.md`: accountable agent runs, review gates, and queues.
- `SCS-004-export.md`: portable JSON export bundle.
- `SCS-005-host-ops.md`: host cockpit and operating metrics.
- `SCS-006-certification.md`: conformance, certification, and governance.
- `SCS-007-connectors-workflows.md`: Web2/Web3/Web4 connector and workflow
  gates.

## Compatibility Levels

- **L0: Claims only** — not compatible.
- **L1: Exportable** — exports identity, groups, gatherings, proof, reports, and
  agent runs.
- **L2: Consentful** — every recap, proof artifact, draft, and agent action has
  a versioned consent state.
- **L3: Agent-accountable** — agents have durable ledgers, scoped permissions,
  review gates, and evals.
- **L4: Host-operable** — hosts get a cockpit for status, risk, proof, growth,
  time saved, and next action.
- **L5: Portable adapters** — identity and proof can bridge to other protocols
  without trapping the group.

Vibeclubs currently targets L2/L3 as the first reference implementation and is
moving toward L4.

## Non-Negotiables

- Human consent is data, not copy.
- Agent work is ledgered, scoped, and reviewable.
- Export is a first-class product path.
- Moderation and reports exist before public scale.
- Protocol adapters are optional exits, not the core value.
- A compatible product must still work when any single adapter or extension is
  absent.

## Reference Implementation

Vibeclubs implements the standard through:

- `/start` for host creation.
- `/lock-in` and the extension for gathering logs.
- `session_participants` and `session_cards` for consented proof.
- `agent_runs` for agent evidence.
- `social_drafts` and review gates for distribution without autopublish.
- `data_exports` plus `GET /api/export` for portability.
- `/host` and `/host/review` for host operations.

## Executable Testkit

The first conformance helpers live in `packages/starlight-communities-standard`.
Use them to validate:

- export bundle shape,
- consent snapshots on portable artifacts,
- agent-run review gates for risky or irreversible work,
- connector readiness for consent, export mapping, least-privilege scopes, and
  dangerous-action review gates.
