import { cookies } from 'next/headers'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

type CookieUpdate = { name: string; value: string; options?: CookieOptions }

export async function createSupabaseServerClient() {
  const cookieStore = await cookies()
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (values: CookieUpdate[]) => {
          for (const { name, value, options } of values) {
            cookieStore.set(name, value, options)
          }
        },
      },
    },
  )
}

export function createSupabaseServiceClient() {
  // Service-role client for privileged server-side operations (seeding, admin tasks).
  // NEVER import this into a client component.
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  )
}
