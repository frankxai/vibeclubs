import { NextResponse } from 'next/server'
import { createSupabaseServerClient } from '@/lib/supabase/server'
import { buildDataExportBundle } from '@/lib/sovereignty/export'

export const runtime = 'nodejs'

export async function GET() {
  const result = await loadBundle()
  if ('response' in result) return result.response

  return NextResponse.json(result.bundle, {
    headers: {
      'content-disposition': `attachment; filename="vibeclubs-export-${result.userId}.json"`,
    },
  })
}

export async function POST() {
  const result = await loadBundle()
  if ('response' in result) return result.response

  const { data, error } = await result.supabase
    .from('data_exports')
    .insert({
      user_id: result.userId,
      bundle: result.bundle as unknown as Record<string, unknown>,
      expires_at: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30).toISOString(),
    })
    .select('id, created_at, expires_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ export: data, bundle: result.bundle })
}

async function loadBundle() {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return {
      response: NextResponse.json({ error: 'Supabase is not configured' }, { status: 503 }),
    }
  }

  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { response: NextResponse.json({ error: 'Not signed in' }, { status: 401 }) }
  }

  const [
    { data: profile },
    { data: ownedClubs },
    { data: memberships },
    { data: sessions },
    { data: sessionCards },
    { data: agentRuns },
    { data: reports },
    { data: socialDrafts },
  ] = await Promise.all([
    supabase.from('users').select('*').eq('id', user.id).maybeSingle(),
    supabase.from('clubs').select('*').eq('opener_id', user.id).order('created_at'),
    supabase.from('club_members').select('*').eq('user_id', user.id).order('joined_at'),
    supabase.from('sessions').select('*').eq('user_id', user.id).order('started_at'),
    supabase.from('session_cards').select('*').eq('user_id', user.id).order('created_at'),
    supabase.from('agent_runs').select('*').eq('actor_user_id', user.id).order('created_at'),
    supabase.from('reports').select('*').eq('reporter_id', user.id).order('created_at'),
    supabase.from('social_drafts').select('*').eq('user_id', user.id).order('created_at'),
  ])

  return {
    supabase,
    userId: user.id,
    bundle: buildDataExportBundle({
      subject: { user_id: user.id },
      profile,
      ownedClubs: ownedClubs ?? [],
      memberships: memberships ?? [],
      sessions: sessions ?? [],
      sessionCards: sessionCards ?? [],
      agentRuns: agentRuns ?? [],
      reports: reports ?? [],
      socialDrafts: socialDrafts ?? [],
    }),
  }
}
