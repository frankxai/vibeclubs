const BASE = 'https://vibeclubs.ai'

export function safeNextPath(candidate: string | null | undefined, fallback = '/'): string {
  if (!candidate?.startsWith('/')) return fallback

  try {
    const parsed = new URL(candidate, BASE)
    if (parsed.origin !== BASE) return fallback
    return `${parsed.pathname}${parsed.search}${parsed.hash}`
  } catch {
    return fallback
  }
}
