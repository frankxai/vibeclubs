import type { MetadataRoute } from 'next'
import { PLAYBOOK } from './playbook/playbook-data'
import { createSupabaseServerClient } from '@/lib/supabase/server'

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vibeclubs.ai'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE}/`, lastModified: now, priority: 1 },
    { url: `${SITE}/explore`, lastModified: now, priority: 0.9 },
    { url: `${SITE}/start`, lastModified: now, priority: 0.9 },
    { url: `${SITE}/extension`, lastModified: now, priority: 0.85 },
    { url: `${SITE}/developers`, lastModified: now, priority: 0.85 },
    { url: `${SITE}/playbook`, lastModified: now, priority: 0.7 },
    { url: `${SITE}/signin`, lastModified: now, priority: 0.3 },
    { url: `${SITE}/privacy`, lastModified: now, priority: 0.3 },
    { url: `${SITE}/terms`, lastModified: now, priority: 0.3 },
  ]

  const playbookRoutes: MetadataRoute.Sitemap = PLAYBOOK.map((p) => ({
    url: `${SITE}/playbook/${p.slug}`,
    lastModified: now,
    priority: 0.6,
  }))

  const clubRoutes: MetadataRoute.Sitemap = await loadClubRoutes()

  return [...staticRoutes, ...playbookRoutes, ...clubRoutes]
}

async function loadClubRoutes(): Promise<MetadataRoute.Sitemap> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) return []
  try {
    const supabase = await createSupabaseServerClient()
    const { data } = await supabase
      .from('clubs')
      .select('slug, updated_at')
      .eq('is_active', true)
      .limit(1000)
    return (data ?? []).map((c) => ({
      url: `${SITE}/club/${c.slug}`,
      lastModified: new Date((c as { updated_at: string }).updated_at),
      priority: 0.8,
    }))
  } catch {
    return []
  }
}
