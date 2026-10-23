import { NextResponse, type NextRequest } from 'next/server'
import { stripTrailingBackslashes } from '@/lib/trailing-backslash'

/**
 * Redirect `/api/og\` (usually `/api/og%5C` from scrapers reading the escaped
 * RSC payload) to `/api/og`. Without this the request reaches the Node launcher,
 * which throws MODULE_NOT_FOUND for `.next/server/pages/api/og%5C.js` and returns 500.
 */
export function proxy(request: NextRequest) {
  const cleaned = stripTrailingBackslashes(request.nextUrl.pathname)
  if (cleaned === null) return NextResponse.next()

  // Only the pathname changes, so the redirect can never leave this origin.
  const url = request.nextUrl.clone()
  url.pathname = cleaned
  return NextResponse.redirect(url, 308)
}

export const config = {
  matcher: ['/api/og(.*)'],
}
