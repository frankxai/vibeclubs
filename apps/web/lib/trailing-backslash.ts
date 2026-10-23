/**
 * Scrapers that regex URLs out of HTML sometimes cut a URL from the JSON-escaped
 * RSC payload (`"content":"https://vibeclubs.ai/api/og\"`) and keep the escaping
 * backslash, then request `/api/og%5C`. No such route exists, and on Vercel the
 * Node launcher crashes with MODULE_NOT_FOUND instead of returning 404.
 *
 * Returns the pathname without trailing backslashes (raw or percent-encoded),
 * or null when there is nothing to strip.
 */
const TRAILING_BACKSLASHES = /(?:\\|%5c)+$/i

export function stripTrailingBackslashes(pathname: string): string | null {
  if (!TRAILING_BACKSLASHES.test(pathname)) return null
  const cleaned = pathname.replace(TRAILING_BACKSLASHES, '')
  return cleaned === '' ? '/' : cleaned
}
