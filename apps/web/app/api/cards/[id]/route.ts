import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createSupabaseServerClient } from '@/lib/supabase/server'

interface Params {
  params: Promise<{ id: string }>
}

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params
  const parsed = z.string().uuid().safeParse(id)
  if (!parsed.success) return NextResponse.json({ error: 'Invalid card id' }, { status: 400 })

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return NextResponse.json({ error: 'Supabase is not configured' }, { status: 503 })
  }

  const supabase = await createSupabaseServerClient()
  const { data, error } = await supabase
    .from('session_cards')
    .select('*')
    .eq('id', parsed.data)
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ error: 'Card not found' }, { status: 404 })

  return NextResponse.json({
    card: {
      id: data.id,
      image_url: data.image_url,
      payload: data.public_payload,
      attestation: data.attestation,
      created_at: data.created_at,
    },
  })
}
