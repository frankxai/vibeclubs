export interface ExtensionPublicEnvironment {
  PLASMO_PUBLIC_SUPABASE_URL?: string
  PLASMO_PUBLIC_SUPABASE_ANON_KEY?: string
}

export interface ExtensionSupabaseConfig {
  url: string
  anonKey: string
}

export function readExtensionSupabaseConfig(
  environment: ExtensionPublicEnvironment,
): ExtensionSupabaseConfig | undefined {
  const rawUrl = environment.PLASMO_PUBLIC_SUPABASE_URL
  const anonKey = environment.PLASMO_PUBLIC_SUPABASE_ANON_KEY

  if (!rawUrl || !anonKey || rawUrl !== rawUrl.trim() || anonKey !== anonKey.trim() || !anonKey) {
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
      url.pathname !== '/'
    ) {
      return undefined
    }

    return { url: url.origin, anonKey }
  } catch {
    return undefined
  }
}
