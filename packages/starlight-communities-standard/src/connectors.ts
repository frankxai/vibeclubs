export const CONNECTOR_REGISTRY_VERSION = 'scs.connectors.draft.0.1'

export type EcosystemLayer = 'web2' | 'web3' | 'web4'
export type ConnectorMode =
  | 'surface'
  | 'identity'
  | 'proof'
  | 'governance'
  | 'automation'
  | 'agent_tool'

export type ConnectorPriority = 'now' | 'next' | 'later'
export type ConnectorRisk = 'read' | 'write' | 'external_send' | 'value_transfer' | 'admin'

export interface ConnectorBlueprint {
  id: string
  label: string
  ecosystem: EcosystemLayer
  mode: ConnectorMode
  priority: ConnectorPriority
  purpose: string
  minimumScopes: string[]
  consentBoundary: string
  exportMapping: string[]
  supportedRisks: ConnectorRisk[]
  reviewRequiredFor: ConnectorRisk[]
}

export interface WorkflowBlueprint {
  id: string
  label: string
  ecosystems: EcosystemLayer[]
  trigger: string
  steps: string[]
  produces: string[]
  consentCheckpoints: string[]
  humanApprovalBefore: string[]
  exportRecords: string[]
}

export interface ConnectorReadinessReport {
  ok: boolean
  score: number
  issues: string[]
  checks: {
    hasConsentBoundary: boolean
    hasExportMapping: boolean
    usesLeastPrivilegeScopes: boolean
    reviewGatesDangerousActions: boolean
  }
}

export interface WorkflowReadinessReport {
  ok: boolean
  score: number
  issues: string[]
  checks: {
    hasTrigger: boolean
    hasSteps: boolean
    producesArtifacts: boolean
    hasConsentCheckpoints: boolean
    hasHumanApprovalBoundaries: boolean
    hasExportRecords: boolean
  }
}

export const STARLIGHT_CONNECTORS: ConnectorBlueprint[] = [
  {
    id: 'discord-activity',
    label: 'Discord Activity',
    ecosystem: 'web2',
    mode: 'surface',
    priority: 'now',
    purpose: 'Run a lock-in inside the place many crews already gather.',
    minimumScopes: ['identify', 'rpc.activities.write'],
    consentBoundary:
      'No page or message scraping; collect only activity context and explicit lock-in events.',
    exportMapping: ['sessions', 'session_participants', 'session_cards'],
    supportedRisks: ['read', 'external_send'],
    reviewRequiredFor: ['external_send'],
  },
  {
    id: 'slack-workflow',
    label: 'Slack Workflow',
    ecosystem: 'web2',
    mode: 'automation',
    priority: 'next',
    purpose: 'Let work crews start, recap, and route proof through existing channels and canvases.',
    minimumScopes: ['commands', 'chat:write', 'workflow.steps:execute'],
    consentBoundary: 'Only channel-approved commands and workflow payloads enter agent memory.',
    exportMapping: ['sessions', 'agent_runs', 'social_drafts'],
    supportedRisks: ['read', 'write', 'external_send', 'admin'],
    reviewRequiredFor: ['write', 'external_send', 'admin'],
  },
  {
    id: 'github-discussions-issues',
    label: 'GitHub Discussions and Issues',
    ecosystem: 'web2',
    mode: 'proof',
    priority: 'now',
    purpose: 'Turn shipped work into durable developer proof without building a new work tracker.',
    minimumScopes: ['read:discussion', 'read:issue'],
    consentBoundary:
      'Read public or explicitly installed repositories only; writes require host review.',
    exportMapping: ['session_cards', 'agent_runs'],
    supportedRisks: ['read', 'write', 'external_send'],
    reviewRequiredFor: ['write', 'external_send'],
  },
  {
    id: 'farcaster-mini-app',
    label: 'Farcaster Mini App',
    ecosystem: 'web3',
    mode: 'proof',
    priority: 'next',
    purpose: 'Make proof cards actionable in a social feed with wallet-aware interactions.',
    minimumScopes: ['farcaster:profile', 'farcaster:miniapp'],
    consentBoundary: 'Publishing proof cards or wallet actions requires explicit host approval.',
    exportMapping: ['session_cards', 'social_drafts'],
    supportedRisks: ['read', 'write', 'external_send', 'value_transfer'],
    reviewRequiredFor: ['write', 'external_send', 'value_transfer'],
  },
  {
    id: 'atproto-proof-feed',
    label: 'AT Protocol Proof Feed',
    ecosystem: 'web3',
    mode: 'proof',
    priority: 'later',
    purpose: 'Map public proof artifacts into interoperable social records.',
    minimumScopes: ['atproto:repo.read'],
    consentBoundary: 'Only public or host-approved proof leaves Vibeclubs.',
    exportMapping: ['session_cards'],
    supportedRisks: ['read', 'write', 'external_send'],
    reviewRequiredFor: ['write', 'external_send'],
  },
  {
    id: 'snapshot-governance',
    label: 'Snapshot Governance',
    ecosystem: 'web3',
    mode: 'governance',
    priority: 'later',
    purpose: 'Let mature crews vote on rules, grants, and shared commitments without gas costs.',
    minimumScopes: ['snapshot:space.read', 'snapshot:proposal.read'],
    consentBoundary: 'Agents may summarize proposals but cannot cast or publish votes.',
    exportMapping: ['agent_runs', 'reports'],
    supportedRisks: ['read', 'write', 'external_send', 'admin'],
    reviewRequiredFor: ['write', 'external_send', 'admin'],
  },
  {
    id: 'guild-collabland-gating',
    label: 'Guild and Collab.Land Gating',
    ecosystem: 'web3',
    mode: 'identity',
    priority: 'later',
    purpose: 'Verify token, NFT, or social credentials while keeping the vibeclub loop optional.',
    minimumScopes: ['wallet:read', 'role:read'],
    consentBoundary:
      'Wallet checks must be read-only and must not imply custody or token transfer.',
    exportMapping: ['memberships', 'reports'],
    supportedRisks: ['read', 'write', 'admin'],
    reviewRequiredFor: ['write', 'admin'],
  },
  {
    id: 'mcp-agent-connectors',
    label: 'MCP Agent Connectors',
    ecosystem: 'web4',
    mode: 'agent_tool',
    priority: 'next',
    purpose: 'Expose approved tools, resources, and prompts to bounded Starlight agents.',
    minimumScopes: ['mcp:resources.read', 'mcp:tools.invoke'],
    consentBoundary:
      'Every tool call is ledgered; dangerous tools require host approval before invocation.',
    exportMapping: ['agent_runs', 'data_exports'],
    supportedRisks: ['read', 'write', 'external_send', 'value_transfer', 'admin'],
    reviewRequiredFor: ['write', 'external_send', 'value_transfer', 'admin'],
  },
  {
    id: 'sovereign-export-api',
    label: 'Sovereign Export API',
    ecosystem: 'web4',
    mode: 'identity',
    priority: 'now',
    purpose: 'Give every host and participant a portable history before protocol adapters harden.',
    minimumScopes: ['export:self.read'],
    consentBoundary:
      'Exports are requester-scoped and must include consent snapshots for portable artifacts.',
    exportMapping: [
      'profile',
      'owned_clubs',
      'memberships',
      'sessions',
      'session_cards',
      'agent_runs',
      'reports',
      'social_drafts',
    ],
    supportedRisks: ['read', 'external_send'],
    reviewRequiredFor: ['external_send'],
  },
]

export const STARLIGHT_WORKFLOWS: WorkflowBlueprint[] = [
  {
    id: 'lock-in-to-proof',
    label: 'Lock-in to proof',
    ecosystems: ['web2'],
    trigger: 'A host starts a timed block from the extension, Discord Activity, or web fallback.',
    steps: ['capture consent', 'log participant event', 'create card', 'offer export'],
    produces: ['session', 'session_card', 'exportable proof'],
    consentCheckpoints: ['recap', 'card', 'social'],
    humanApprovalBefore: ['publishing a public card'],
    exportRecords: ['sessions', 'session_participants', 'session_cards'],
  },
  {
    id: 'host-review-to-post',
    label: 'Host review to post',
    ecosystems: ['web2', 'web3'],
    trigger: 'A Growth agent drafts launch copy from consented proof.',
    steps: ['draft copy', 'store social_draft', 'host review', 'connector handoff'],
    produces: ['social_draft', 'agent_run', 'approval_decision'],
    consentCheckpoints: ['social'],
    humanApprovalBefore: ['external send', 'wallet action'],
    exportRecords: ['social_drafts', 'agent_runs'],
  },
  {
    id: 'web3-gated-lock-in',
    label: 'Web3 gated lock-in',
    ecosystems: ['web2', 'web3'],
    trigger: 'A host optionally requires wallet, token, or NFT proof for a private crew.',
    steps: ['verify read-only credential', 'map role', 'start lock-in', 'avoid custody'],
    produces: ['membership_attestation', 'session'],
    consentCheckpoints: ['wallet verification', 'card'],
    humanApprovalBefore: ['role changes', 'public proof'],
    exportRecords: ['memberships', 'sessions', 'reports'],
  },
  {
    id: 'agent-scout-to-draft',
    label: 'Agent scout to draft',
    ecosystems: ['web2', 'web3', 'web4'],
    trigger: 'A Scout agent researches trends or partner channels for a host.',
    steps: ['collect sources', 'summarize evidence', 'draft recommendation', 'queue review'],
    produces: ['agent_run', 'draft recommendation'],
    consentCheckpoints: ['source logging'],
    humanApprovalBefore: ['external outreach', 'public recommendation'],
    exportRecords: ['agent_runs'],
  },
  {
    id: 'export-to-protocol-adapter',
    label: 'Export to protocol adapter',
    ecosystems: ['web3', 'web4'],
    trigger: 'A participant or host asks to move proof into another identity or social protocol.',
    steps: [
      'build export bundle',
      'validate conformance',
      'map adapter fields',
      'request approval',
    ],
    produces: ['data_export', 'adapter_payload'],
    consentCheckpoints: ['export', 'protocol publish'],
    humanApprovalBefore: ['adapter publish', 'external send'],
    exportRecords: ['data_exports', 'agent_runs'],
  },
]

const DANGEROUS_RISKS = new Set<ConnectorRisk>([
  'write',
  'external_send',
  'value_transfer',
  'admin',
])

export function evaluateConnectorReadiness(
  connector: ConnectorBlueprint,
): ConnectorReadinessReport {
  const dangerousSupported = connector.supportedRisks.filter((risk) => DANGEROUS_RISKS.has(risk))
  const missingReview = dangerousSupported.filter(
    (risk) => !connector.reviewRequiredFor.includes(risk),
  )
  const checks = {
    hasConsentBoundary: connector.consentBoundary.trim().length > 0,
    hasExportMapping: connector.exportMapping.length > 0,
    usesLeastPrivilegeScopes:
      connector.minimumScopes.length > 0 &&
      connector.minimumScopes.every((scope) => scope !== '*' && !scope.endsWith(':*')),
    reviewGatesDangerousActions: missingReview.length === 0,
  }
  const issues = [
    !checks.hasConsentBoundary ? 'Missing consent boundary.' : null,
    !checks.hasExportMapping ? 'Missing export mapping.' : null,
    !checks.usesLeastPrivilegeScopes ? 'Connector scopes are too broad.' : null,
    !checks.reviewGatesDangerousActions
      ? `Dangerous actions missing review gates: ${missingReview.join(', ')}.`
      : null,
  ].filter((issue): issue is string => Boolean(issue))
  const passed = Object.values(checks).filter(Boolean).length
  return {
    ok: issues.length === 0,
    score: Math.round((passed / Object.keys(checks).length) * 100),
    issues,
    checks,
  }
}

export function evaluateWorkflowReadiness(workflow: WorkflowBlueprint): WorkflowReadinessReport {
  const checks = {
    hasTrigger: workflow.trigger.trim().length > 0,
    hasSteps: workflow.steps.length > 0,
    producesArtifacts: workflow.produces.length > 0,
    hasConsentCheckpoints: workflow.consentCheckpoints.length > 0,
    hasHumanApprovalBoundaries: workflow.humanApprovalBefore.length > 0,
    hasExportRecords: workflow.exportRecords.length > 0,
  }
  const issues = [
    !checks.hasTrigger ? 'Missing workflow trigger.' : null,
    !checks.hasSteps ? 'Missing workflow steps.' : null,
    !checks.producesArtifacts ? 'Missing produced artifacts.' : null,
    !checks.hasConsentCheckpoints ? 'Missing consent checkpoints.' : null,
    !checks.hasHumanApprovalBoundaries ? 'Missing human approval boundaries.' : null,
    !checks.hasExportRecords ? 'Missing export records.' : null,
  ].filter((issue): issue is string => Boolean(issue))
  const passed = Object.values(checks).filter(Boolean).length
  return {
    ok: issues.length === 0,
    score: Math.round((passed / Object.keys(checks).length) * 100),
    issues,
    checks,
  }
}

export function connectorsForEcosystem(ecosystem: EcosystemLayer): ConnectorBlueprint[] {
  return STARLIGHT_CONNECTORS.filter((connector) => connector.ecosystem === ecosystem)
}

export function workflowsForEcosystem(ecosystem: EcosystemLayer): WorkflowBlueprint[] {
  return STARLIGHT_WORKFLOWS.filter((workflow) => workflow.ecosystems.includes(ecosystem))
}
