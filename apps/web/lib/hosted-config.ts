export interface HostedConfigEnvironment {
  NEXT_PUBLIC_SUPABASE_URL?: string
  NEXT_PUBLIC_SUPABASE_ANON_KEY?: string
}

export function hasHostedConfig(
  environment: HostedConfigEnvironment = {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
): boolean {
  return (
    isHttpsUrl(environment.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(environment.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim())
  )
}

function isHttpsUrl(value: string | undefined): boolean {
  if (!value || value !== value.trim()) return false

  try {
    const url = new URL(value)
    return (
      url.protocol === 'https:' &&
      Boolean(url.hostname) &&
      !url.username &&
      !url.password &&
      !url.search &&
      !url.hash
    )
  } catch {
    return false
  }
}
