'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { Database } from './types'
import type { PublicSchema, VibeSupabaseClient } from './client-types'

let singleton: VibeSupabaseClient | null = null

export function createSupabaseBrowserClient() {
  if (singleton) return singleton
  singleton = createBrowserClient<Database, 'public', PublicSchema>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  ) as VibeSupabaseClient
  return singleton
}
