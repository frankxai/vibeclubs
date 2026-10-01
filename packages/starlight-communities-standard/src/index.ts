export const STARLIGHT_COMMUNITIES_STANDARD_VERSION = 'scs.draft.0.1'
export const STARLIGHT_EXPORT_SCHEMA = 'starlight_community_export.v1'
export const CONSENT_SCHEMA_VERSION = 'vibeclubs.consent.v1'

export * from './connectors'

export type ConformanceLevel = 'L1' | 'L2' | 'L3' | 'L4' | 'L5'

export interface ConformanceIssue {
  level: ConformanceLevel
  code: string
  message: string
  path: string
  severity: 'error' | 'warning'
}

export interface ConformanceReport {
  ok: boolean
  levels: Record<ConformanceLevel, boolean>
  issues: ConformanceIssue[]
}

export interface ConsentSnapshotLike {
  version?: unknown
  witness?: unknown
  recap?: unknown
  card?: unknown
  social?: unknown
  source?: unknown
  captured_at?: unknown
}

export interface AgentRunLike {
  requested_action?: unknown
  risk?: unknown
  status?: unknown
  approval_required?: unknown
  approval_state?: unknown
  evidence?: unknown
}

const REQUIRED_EXPORT_SECTIONS = [
  'profile',
  'owned_clubs',
  'memberships',
  'sessions',
  'session_cards',
  'agent_runs',
  'reports',
  'social_drafts',
] as const

const REVIEW_ACTIONS = new Set([
  'send_external',
  'moderation',
  'billing',
  'export',
  'delete',
  'admin_write',
])

export function validateConsentSnapshot(
  value: ConsentSnapshotLike,
  path = 'consent',
): ConformanceIssue[] {
  const issues: ConformanceIssue[] = []
  if (value.version !== CONSENT_SCHEMA_VERSION) {
    issues.push(issue('L2', 'consent.version', 'Consent snapshot has an unknown version.', path))
  }
  for (const key of ['witness', 'recap', 'card', 'social'] as const) {
    if (typeof value[key] !== 'boolean') {
      issues.push(
        issue('L2', `consent.${key}`, `${key} consent must be boolean.`, `${path}.${key}`),
      )
    }
  }
  if (!isNonEmptyString(value.source)) {
    issues.push(issue('L2', 'consent.source', 'Consent source is required.', `${path}.source`))
  }
  if (!isIsoDate(value.captured_at)) {
    issues.push(
      issue(
        'L2',
        'consent.captured_at',
        'Consent captured_at must be ISO date text.',
        `${path}.captured_at`,
      ),
    )
  }
  return issues
}

export function validateAgentRunGuardrail(
  run: AgentRunLike,
  path = 'agent_run',
): ConformanceIssue[] {
  const issues: ConformanceIssue[] = []
  const action = typeof run.requested_action === 'string' ? run.requested_action : ''
  const risk = typeof run.risk === 'string' ? run.risk : ''
  const requiresReview = risk === 'high' || risk === 'sovereign' || REVIEW_ACTIONS.has(action)

  if (!isNonEmptyString(run.requested_action)) {
    issues.push(
      issue(
        'L3',
        'agent.action',
        'Agent run requested_action is required.',
        `${path}.requested_action`,
      ),
    )
  }
  if (!isNonEmptyString(run.risk)) {
    issues.push(issue('L3', 'agent.risk', 'Agent run risk is required.', `${path}.risk`))
  }
  if (!isNonEmptyString(run.status)) {
    issues.push(issue('L3', 'agent.status', 'Agent run status is required.', `${path}.status`))
  }
  if (!isNonEmptyString(run.approval_state)) {
    issues.push(
      issue(
        'L3',
        'agent.approval_state',
        'Agent run approval_state is required.',
        `${path}.approval_state`,
      ),
    )
  }
  if (requiresReview && run.approval_required !== true) {
    issues.push(
      issue(
        'L3',
        'agent.review_required',
        'High-risk or irreversible agent action must require approval.',
        `${path}.approval_required`,
      ),
    )
  }
  if (
    requiresReview &&
    !['pending', 'approved', 'rejected', 'blocked'].includes(String(run.approval_state))
  ) {
    issues.push(
      issue(
        'L3',
        'agent.review_state',
        'Review-required agent action must be pending, approved, rejected, or blocked.',
        `${path}.approval_state`,
      ),
    )
  }
  if (!isRecord(run.evidence)) {
    issues.push(
      issue('L3', 'agent.evidence', 'Agent run evidence must be an object.', `${path}.evidence`),
    )
  }
  return issues
}

export function validateExportBundle(bundle: unknown): ConformanceReport {
  const issues: ConformanceIssue[] = []

  if (!isRecord(bundle)) {
    issues.push(issue('L1', 'export.object', 'Export bundle must be an object.', '$'))
    return toReport(issues)
  }

  if (bundle.schema !== STARLIGHT_EXPORT_SCHEMA) {
    issues.push(issue('L1', 'export.schema', 'Export bundle schema is not supported.', '$.schema'))
  }
  if (!isIsoDate(bundle.exported_at)) {
    issues.push(
      issue('L1', 'export.exported_at', 'Export timestamp must be ISO date text.', '$.exported_at'),
    )
  }
  if (!isNonEmptyString(bundle.subject_user_id)) {
    issues.push(
      issue('L1', 'export.subject', 'Export subject_user_id is required.', '$.subject_user_id'),
    )
  }
  if (!isRecord(bundle.portability)) {
    issues.push(
      issue(
        'L1',
        'export.portability',
        'Export portability metadata is required.',
        '$.portability',
      ),
    )
  }
  if (!isRecord(bundle.data)) {
    issues.push(issue('L1', 'export.data', 'Export data object is required.', '$.data'))
    return toReport(issues)
  }

  for (const section of REQUIRED_EXPORT_SECTIONS) {
    if (!(section in bundle.data)) {
      issues.push(
        issue(
          'L1',
          `export.section.${section}`,
          `Missing export data section ${section}.`,
          `$.data.${section}`,
        ),
      )
    }
  }

  const cards = Array.isArray(bundle.data.session_cards) ? bundle.data.session_cards : []
  for (let index = 0; index < cards.length; index++) {
    const card = cards[index]
    if (!isRecord(card)) {
      issues.push(
        issue(
          'L2',
          'card.object',
          'Session card export entry must be an object.',
          `$.data.session_cards[${index}]`,
        ),
      )
      continue
    }
    if (!isRecord(card.consent_snapshot)) {
      issues.push(
        issue(
          'L2',
          'card.consent_snapshot',
          'Session card must include a consent snapshot.',
          `$.data.session_cards[${index}].consent_snapshot`,
        ),
      )
    } else {
      issues.push(
        ...validateConsentSnapshot(
          card.consent_snapshot,
          `$.data.session_cards[${index}].consent_snapshot`,
        ),
      )
    }
  }

  const agentRuns = Array.isArray(bundle.data.agent_runs) ? bundle.data.agent_runs : []
  for (let index = 0; index < agentRuns.length; index++) {
    const run = agentRuns[index]
    if (!isRecord(run)) {
      issues.push(
        issue(
          'L3',
          'agent.object',
          'Agent run export entry must be an object.',
          `$.data.agent_runs[${index}]`,
        ),
      )
      continue
    }
    issues.push(...validateAgentRunGuardrail(run, `$.data.agent_runs[${index}]`))
  }

  return toReport(issues)
}

export function assertConformantExport(bundle: unknown): void {
  const report = validateExportBundle(bundle)
  if (!report.ok) {
    const details = report.issues.map((item) => `${item.path}: ${item.message}`).join('\n')
    throw new Error(`Starlight export conformance failed:\n${details}`)
  }
}

function toReport(issues: ConformanceIssue[]): ConformanceReport {
  const errorLevels = new Set(
    issues.filter((item) => item.severity === 'error').map((item) => item.level),
  )
  return {
    ok: issues.every((item) => item.severity !== 'error'),
    levels: {
      L1: !errorLevels.has('L1'),
      L2: !errorLevels.has('L1') && !errorLevels.has('L2'),
      L3: !errorLevels.has('L1') && !errorLevels.has('L2') && !errorLevels.has('L3'),
      L4: false,
      L5: false,
    },
    issues,
  }
}

function issue(
  level: ConformanceLevel,
  code: string,
  message: string,
  path: string,
  severity: ConformanceIssue['severity'] = 'error',
): ConformanceIssue {
  return { level, code, message, path, severity }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0
}

function isIsoDate(value: unknown): value is string {
  return typeof value === 'string' && !Number.isNaN(Date.parse(value))
}
