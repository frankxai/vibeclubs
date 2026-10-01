// Hand-written types mirroring supabase/migrations/20260419000000_init.sql.
// Replace with generated types via `supabase gen types typescript` once the project
// is provisioned (see ENVIRONMENT.md §1).

type DbRelationship = {
  foreignKeyName: string
  columns: string[]
  isOneToOne?: boolean
  referencedRelation: string
  referencedColumns: string[]
}

type DbInsert<T extends Record<string, unknown>> = Record<string, unknown> & Partial<T>
type DbUpdate<T extends Record<string, unknown>> = Record<string, unknown> & Partial<T>

export type ClubType = 'coding' | 'music' | 'design' | 'study' | 'fitness' | 'writing' | 'other'

export type ClubPlatform = 'meet' | 'discord' | 'zoom' | 'in_person' | 'other'

export type PomodoroPreset =
  | '25_5'
  | '50_10'
  | '90_20'
  | 'custom'
  | 'vibe_coding_sprint'
  | 'music_jam'
  | 'dance_break'
  | 'lightning'

export type UserTier = 'free' | 'builder' | 'opener'

export type ClubTier = 'free' | 'featured'

export type MemberRole = 'owner' | 'opener' | 'builder'

export type CardVisibility = 'public' | 'unlisted' | 'private'

export type AgentRunStatus =
  | 'draft'
  | 'queued'
  | 'running'
  | 'needs_review'
  | 'approved'
  | 'blocked'
  | 'failed'
  | 'completed'

export type AgentRunRisk = 'low' | 'normal' | 'high' | 'sovereign'

export type AgentRequestedAction =
  | 'draft'
  | 'recap'
  | 'card'
  | 'social_draft'
  | 'send_external'
  | 'moderation'
  | 'billing'
  | 'export'
  | 'delete'
  | 'admin_write'

export type AgentApprovalState = 'not_required' | 'pending' | 'approved' | 'rejected' | 'blocked'

export type ReportSubjectType = 'club' | 'session' | 'card' | 'profile' | 'other'

export type ReportReason = 'spam' | 'abuse' | 'privacy' | 'safety' | 'ip' | 'other'

export type ReportStatus = 'open' | 'reviewing' | 'resolved' | 'dismissed'

export type ModerationAction =
  | 'no_action'
  | 'hide'
  | 'rate_limit'
  | 'suspend'
  | 'escalate'
  | 'restore'

export type DataExportStatus = 'queued' | 'ready' | 'expired' | 'failed'

export type SocialChannel =
  | 'x'
  | 'threads'
  | 'linkedin'
  | 'tiktok'
  | 'youtube'
  | 'farcaster'
  | 'bluesky'
  | 'other'

export type SocialDraftStatus =
  | 'draft'
  | 'needs_review'
  | 'approved'
  | 'scheduled'
  | 'published'
  | 'rejected'

export interface UserRow extends Record<string, unknown> {
  id: string
  email: string
  handle: string | null
  display_name: string | null
  avatar_url: string | null
  bio: string | null
  links: Record<string, string>
  tier: UserTier
  created_at: string
  updated_at: string
}

export interface ClubRow extends Record<string, unknown> {
  id: string
  slug: string
  name: string
  description: string | null
  type: ClubType
  platform: ClubPlatform
  platform_url: string | null
  schedule: string | null
  pomodoro_preset: PomodoroPreset
  pomodoro_custom: { focus: number; break: number } | null
  ambient_preset: string
  suno_genre: string | null
  opener_id: string
  tier: ClubTier
  location: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface SessionRow extends Record<string, unknown> {
  id: string
  club_id: string | null
  user_id: string
  platform_used: ClubPlatform | null
  started_at: string
  ended_at: string | null
  focus_minutes: number
  break_minutes: number
  pomodoro_cycles: number
  session_card_url: string | null
  metadata: Record<string, unknown>
  created_at: string
}

export interface ToolRecommendationRow extends Record<string, unknown> {
  id: string
  club_type: ClubType
  tool_name: string
  tool_url: string
  category: string
  description: string | null
  affiliate_url: string | null
  is_featured: boolean
  created_at: string
}

export interface SessionParticipantRow extends Record<string, unknown> {
  session_id: string
  user_id: string
  role: MemberRole
  focus_minutes: number
  joined_at: string
  left_at: string | null
  consent_version: string
  witness_consent: boolean
  recap_consent: boolean
  card_consent: boolean
  social_consent: boolean
  metadata: Record<string, unknown>
}

export interface SessionCardRow extends Record<string, unknown> {
  id: string
  session_id: string | null
  user_id: string
  club_id: string | null
  image_url: string | null
  svg_hash: string | null
  public_payload: Record<string, unknown>
  attestation: Record<string, unknown>
  consent_snapshot: Record<string, unknown>
  visibility: CardVisibility
  created_at: string
}

export interface AgentRunRow extends Record<string, unknown> {
  id: string
  actor_user_id: string | null
  agent: string
  lane: string
  scope: string
  scope_id: string | null
  status: AgentRunStatus
  risk: AgentRunRisk
  requested_action: AgentRequestedAction
  approval_required: boolean
  approval_state: AgentApprovalState
  approved_by: string | null
  approved_at: string | null
  blocked_reason: string | null
  input_summary: string | null
  output_summary: string | null
  evidence: Record<string, unknown>
  created_at: string
  completed_at: string | null
}

export interface ReportRow extends Record<string, unknown> {
  id: string
  reporter_id: string
  subject_type: ReportSubjectType
  subject_id: string | null
  reason: ReportReason
  details: string | null
  status: ReportStatus
  created_at: string
  reviewed_at: string | null
}

export interface ModerationActionRow extends Record<string, unknown> {
  id: string
  report_id: string | null
  reviewer_id: string | null
  action: ModerationAction
  subject_type: ReportSubjectType
  subject_id: string | null
  note: string | null
  created_at: string
}

export interface DataExportRow extends Record<string, unknown> {
  id: string
  user_id: string
  status: DataExportStatus
  format: string
  bundle: Record<string, unknown>
  created_at: string
  expires_at: string | null
}

export interface SocialDraftRow extends Record<string, unknown> {
  id: string
  user_id: string
  session_card_id: string | null
  channel: SocialChannel
  body: string
  status: SocialDraftStatus
  approval_required: boolean
  metadata: Record<string, unknown>
  scheduled_at: string | null
  published_at: string | null
  created_at: string
}

type ClubMemberRow = Record<string, unknown> & {
  club_id: string
  user_id: string
  role: MemberRole
  joined_at: string
}

export interface Database {
  public: {
    Tables: {
      users: {
        Row: UserRow
        Insert: DbInsert<UserRow> & { id: string; email: string }
        Update: DbUpdate<UserRow>
        Relationships: DbRelationship[]
      }
      clubs: {
        Row: ClubRow
        Insert: Record<string, unknown> &
          Omit<ClubRow, 'id' | 'created_at' | 'updated_at' | 'tier' | 'is_active'> &
          Partial<ClubRow>
        Update: DbUpdate<ClubRow>
        Relationships: DbRelationship[]
      }
      club_members: {
        Row: ClubMemberRow
        Insert: Record<string, unknown> & { club_id: string; user_id: string; role?: MemberRole }
        Update: Record<string, unknown> & Partial<{ role: MemberRole }>
        Relationships: DbRelationship[]
      }
      sessions: {
        Row: SessionRow
        Insert: Record<string, unknown> &
          Omit<SessionRow, 'id' | 'started_at' | 'created_at' | 'metadata'> &
          Partial<SessionRow>
        Update: DbUpdate<SessionRow>
        Relationships: DbRelationship[]
      }
      tool_recommendations: {
        Row: ToolRecommendationRow
        Insert: Record<string, unknown> &
          Omit<ToolRecommendationRow, 'id' | 'created_at' | 'is_featured'> &
          Partial<ToolRecommendationRow>
        Update: DbUpdate<ToolRecommendationRow>
        Relationships: DbRelationship[]
      }
      session_participants: {
        Row: SessionParticipantRow
        Insert: Record<string, unknown> &
          Omit<SessionParticipantRow, 'joined_at' | 'metadata'> &
          Partial<SessionParticipantRow>
        Update: DbUpdate<SessionParticipantRow>
        Relationships: DbRelationship[]
      }
      session_cards: {
        Row: SessionCardRow
        Insert: Record<string, unknown> &
          Omit<SessionCardRow, 'id' | 'created_at' | 'public_payload' | 'attestation'> &
          Partial<SessionCardRow>
        Update: DbUpdate<SessionCardRow>
        Relationships: DbRelationship[]
      }
      agent_runs: {
        Row: AgentRunRow
        Insert: Record<string, unknown> &
          Omit<
            AgentRunRow,
            | 'id'
            | 'created_at'
            | 'status'
            | 'risk'
            | 'evidence'
            | 'requested_action'
            | 'approval_required'
            | 'approval_state'
            | 'approved_by'
            | 'approved_at'
            | 'blocked_reason'
          > &
          Partial<AgentRunRow>
        Update: DbUpdate<AgentRunRow>
        Relationships: DbRelationship[]
      }
      reports: {
        Row: ReportRow
        Insert: Record<string, unknown> &
          Omit<ReportRow, 'id' | 'created_at' | 'status' | 'reviewed_at'> &
          Partial<ReportRow>
        Update: DbUpdate<ReportRow>
        Relationships: DbRelationship[]
      }
      moderation_actions: {
        Row: ModerationActionRow
        Insert: Record<string, unknown> &
          Omit<ModerationActionRow, 'id' | 'created_at'> &
          Partial<ModerationActionRow>
        Update: DbUpdate<ModerationActionRow>
        Relationships: DbRelationship[]
      }
      data_exports: {
        Row: DataExportRow
        Insert: Record<string, unknown> &
          Omit<DataExportRow, 'id' | 'created_at' | 'status' | 'format'> &
          Partial<DataExportRow>
        Update: DbUpdate<DataExportRow>
        Relationships: DbRelationship[]
      }
      social_drafts: {
        Row: SocialDraftRow
        Insert: Record<string, unknown> &
          Omit<SocialDraftRow, 'id' | 'created_at' | 'status' | 'approval_required'> &
          Partial<SocialDraftRow>
        Update: DbUpdate<SocialDraftRow>
        Relationships: DbRelationship[]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
