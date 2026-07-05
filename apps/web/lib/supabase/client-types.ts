import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

export type PublicSchema = Database['public']

type SupabaseAuthError = {
  message: string
  [key: string]: unknown
}

type SupabaseUser = {
  id: string
  email?: string
  [key: string]: unknown
}

type VibeSupabaseAuth = {
  getUser(): Promise<{
    data: { user: SupabaseUser | null }
    error: SupabaseAuthError | null
  }>
  exchangeCodeForSession(code: string): Promise<{
    data: unknown
    error: SupabaseAuthError | null
  }>
  signInWithOtp(credentials: { email: string; options?: { emailRedirectTo?: string } }): Promise<{
    data: unknown
    error: SupabaseAuthError | null
  }>
}

export type VibeSupabaseClient = SupabaseClient<Database, 'public'> & {
  auth: VibeSupabaseAuth
}
