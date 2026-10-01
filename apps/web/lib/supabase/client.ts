'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'
import type { Database } from './types'

type VibeSupabaseClient = SupabaseClient<Database, 'public'>

let singleton: VibeSupabaseClient | null = null

export function createSupabaseBrowserClient(): VibeSupabaseClient {
  if (singleton) return singleton
  singleton = createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  ) as unknown as VibeSupabaseClient
  return singleton
}
