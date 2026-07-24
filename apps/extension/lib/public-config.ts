export interface ExtensionPublicEnvironment {
  PLASMO_PUBLIC_SUPABASE_URL?: string
  PLASMO_PUBLIC_SUPABASE_ANON_KEY?: string
}

export interface ExtensionSupabaseConfig {
  url: string
  anonKey: string
}

const FORBIDDEN_RAW_CHARACTER = /[\p{C}\p{White_Space}]/u

export function readExtensionSupabaseConfig(
  environment: ExtensionPublicEnvironment,
): ExtensionSupabaseConfig | undefined {
  const rawUrl = environment.PLASMO_PUBLIC_SUPABASE_URL
  const anonKey = environment.PLASMO_PUBLIC_SUPABASE_ANON_KEY

  if (
    typeof rawUrl !== 'string' ||
    typeof anonKey !== 'string' ||
    !rawUrl ||
    !anonKey ||
    FORBIDDEN_RAW_CHARACTER.test(rawUrl) ||
    FORBIDDEN_RAW_CHARACTER.test(anonKey) ||
    !rawUrl.startsWith('https://') ||
    rawUrl.includes('\\') ||
    rawUrl.includes('@') ||
    rawUrl.includes('?') ||
    rawUrl.includes('#')
  ) {
    return undefined
  }

  try {
    const url = new URL(rawUrl)
    if (
      url.protocol !== 'https:' ||
      !url.hostname ||
      url.username ||
      url.password ||
      url.search ||
      url.hash ||
      url.pathname !== '/' ||
      url.hostname.endsWith('.') ||
      (rawUrl !== url.origin && rawUrl !== `${url.origin}/`)
    ) {
      return undefined
    }

    return { url: url.origin, anonKey }
  } catch {
    return undefined
  }
}
