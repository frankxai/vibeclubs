export interface SafePlatformLink {
  href: string
  hostname: string
}

export function getSafePlatformLink(value: string | null | undefined): SafePlatformLink | null {
  if (!value) return null

  try {
    const url = new URL(value)
    if (url.protocol !== 'https:' || url.username || url.password) return null

    const hostname = url.hostname.toLowerCase().replace(/\.$/, '')
    if (!hostname) return null

    return {
      href: url.toString(),
      hostname,
    }
  } catch {
    return null
  }
}
