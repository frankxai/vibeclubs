import { NextResponse } from 'next/server'
import { loadStaticClubs } from '@/lib/clubs/content'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { hasHostedConfig } from '@/lib/hosted-config'
import { PLAYBOOK } from '../playbook/playbook-data'

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vibeclubs.ai'

export async function GET() {
  const staticClubs = loadStaticClubs()

  let supabaseClubs: Array<{ slug: string }> = []
  if (hasHostedConfig()) {
    try {
      const supabase = await createSupabaseServerClient()
      const { data } = await supabase.from('clubs').select('slug').eq('is_active', true).limit(100)
      if (data) supabaseClubs = data
    } catch {}
  }

  const allClubSlugs = new Set([
    ...staticClubs.map((c) => c.slug),
    ...supabaseClubs.map((c) => c.slug),
  ])

  let text = `# Vibeclubs\n\nLock in with your crew. Ship the thing.\n\n`

  text += `## Core Routes\n`
  text += `- [Home](${SITE}/)\n`
  text += `- [Explore](${SITE}/explore)\n`
  text += `- [Host a vibeclub](${SITE}/start)\n`
  text += `- [Extension source](${SITE}/extension)\n`
  text += `- [Developer source](${SITE}/developers)\n`
  text += `- [Playbook](${SITE}/playbook)\n\n`

  text += `## Playbook Entries\n`
  for (const entry of PLAYBOOK) {
    text += `- [${entry.title}](${SITE}/playbook/${entry.slug})\n`
  }
  text += '\n'

  text += `## Vibeclubs\n`
  for (const slug of Array.from(allClubSlugs).sort()) {
    text += `- [${slug}](${SITE}/club/${slug})\n`
  }

  return new NextResponse(text, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
    },
  })
}
