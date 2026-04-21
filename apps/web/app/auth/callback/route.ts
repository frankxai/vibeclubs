import { NextResponse, type NextRequest } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'

/**
 * Supabase magic-link callback.
 *
 * The magic-link email contains a URL like:
 *   https://vibeclubs.ai/auth/callback?code=xxxx&next=/start
 *
 * We exchange the code for a session cookie and redirect to `next`.
 */
export async function GET(request: NextRequest) {
  const url = new URL(request.url)
  const code = url.searchParams.get('code')
  const next = url.searchParams.get('next') ?? '/'

  if (code) {
    try {
      const supabase = await createSupabaseServerClient()
      await supabase.auth.exchangeCodeForSession(code)
    } catch (err) {
      console.error('[auth/callback] exchange failed', err)
      return NextResponse.redirect(new URL('/signin?error=exchange', url.origin))
    }
  }

  return NextResponse.redirect(new URL(next, url.origin))
}
