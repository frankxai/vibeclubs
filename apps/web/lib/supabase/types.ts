// Hand-written types mirroring supabase/migrations/20260419000000_init.sql.
// Replace with generated types via `supabase gen types typescript` once the project
// is provisioned (see ENVIRONMENT.md §1).

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

type SupabaseRecord<T extends object> = T & Record<string, unknown>

export type UserRow = {
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

export type ClubRow = {
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

export type SessionRow = {
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

export type ToolRecommendationRow = {
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

export interface Database {
  public: {
    Tables: {
      users: {
        Row: SupabaseRecord<UserRow>
        Insert: SupabaseRecord<Partial<UserRow> & { id: string; email: string }>
        Update: SupabaseRecord<Partial<UserRow>>
        Relationships: []
      }
      clubs: {
        Row: SupabaseRecord<ClubRow>
        Insert: SupabaseRecord<{
          id?: string
          slug: string
          name: string
          description: string | null
          type: ClubType
          platform: ClubPlatform
          platform_url?: string | null
          schedule?: string | null
          pomodoro_preset: PomodoroPreset
          pomodoro_custom?: { focus: number; break: number } | null
          ambient_preset: string
          suno_genre?: string | null
          opener_id: string
          tier?: ClubTier
          location?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }>
        Update: SupabaseRecord<Partial<ClubRow>>
        Relationships: []
      }
      club_members: {
        Row: SupabaseRecord<{
          club_id: string
          user_id: string
          role: MemberRole
          joined_at: string
        }>
        Insert: SupabaseRecord<{ club_id: string; user_id: string; role?: MemberRole }>
        Update: SupabaseRecord<Partial<{ role: MemberRole }>>
        Relationships: []
      }
      sessions: {
        Row: SupabaseRecord<SessionRow>
        Insert: SupabaseRecord<{
          id?: string
          club_id?: string | null
          user_id: string
          platform_used?: ClubPlatform | null
          started_at?: string
          ended_at?: string | null
          focus_minutes: number
          break_minutes: number
          pomodoro_cycles: number
          session_card_url?: string | null
          metadata?: Record<string, unknown>
          created_at?: string
        }>
        Update: SupabaseRecord<Partial<SessionRow>>
        Relationships: []
      }
      tool_recommendations: {
        Row: SupabaseRecord<ToolRecommendationRow>
        Insert: SupabaseRecord<
          Omit<ToolRecommendationRow, 'id' | 'created_at' | 'is_featured'> &
            Partial<ToolRecommendationRow>
        >
        Update: SupabaseRecord<Partial<ToolRecommendationRow>>
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
