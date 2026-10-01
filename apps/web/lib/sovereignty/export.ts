export const STARLIGHT_EXPORT_VERSION = 'starlight_community_export.v1'

export interface DataExportInput {
  subject: {
    user_id: string
    exported_at?: string
  }
  profile: unknown
  ownedClubs: unknown[]
  memberships: unknown[]
  sessions: unknown[]
  sessionCards: unknown[]
  agentRuns: unknown[]
  reports: unknown[]
  socialDrafts: unknown[]
}

export interface DataExportBundle {
  schema: typeof STARLIGHT_EXPORT_VERSION
  exported_at: string
  subject_user_id: string
  portability: {
    format: 'json'
    federation_ready: boolean
    notes: string[]
  }
  data: {
    profile: unknown
    owned_clubs: unknown[]
    memberships: unknown[]
    sessions: unknown[]
    session_cards: unknown[]
    agent_runs: unknown[]
    reports: unknown[]
    social_drafts: unknown[]
  }
}

export function buildDataExportBundle(input: DataExportInput): DataExportBundle {
  const exportedAt = input.subject.exported_at ?? new Date().toISOString()
  return {
    schema: STARLIGHT_EXPORT_VERSION,
    exported_at: exportedAt,
    subject_user_id: input.subject.user_id,
    portability: {
      format: 'json',
      federation_ready: true,
      notes: [
        'Vibeclubs exports the directory/session artifact layer, not call recordings.',
        'Session cards are portable public artifacts and can map to ActivityStreams objects later.',
        'Private agent evidence and moderation records are scoped to rows the requester can read.',
      ],
    },
    data: {
      profile: input.profile,
      owned_clubs: input.ownedClubs,
      memberships: input.memberships,
      sessions: input.sessions,
      session_cards: input.sessionCards,
      agent_runs: input.agentRuns,
      reports: input.reports,
      social_drafts: input.socialDrafts,
    },
  }
}
