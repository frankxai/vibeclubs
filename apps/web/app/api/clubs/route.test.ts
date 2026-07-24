import type { NextRequest } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const { createSupabaseServerClient } = vi.hoisted(() => ({
  createSupabaseServerClient: vi.fn(),
}))

vi.mock('@/lib/supabase/server', () => ({ createSupabaseServerClient }))

import { POST } from './route'

const validClub = {
  name: 'Lofi coders',
  slug: 'lofi-coders',
  description: 'Ship one focused block.',
  type: 'coding',
  platform: 'meet',
  platform_url: '',
  schedule: '',
  pomodoro_preset: '25_5',
  ambient_preset: 'lofi',
}

describe('POST /api/clubs', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://example.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'public-anon-key'
  })

  it('creates the club and owner membership through one transactional RPC', async () => {
    const single = vi.fn().mockResolvedValue({
      data: { id: '5f386063-a624-438c-8d7f-0568ba4dd9fc', slug: validClub.slug },
      error: null,
    })
    const rpc = vi.fn().mockReturnValue({ single })
    createSupabaseServerClient.mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-id' } } }) },
      rpc,
    })

    const response = await POST(requestFor(validClub))

    expect(response.status).toBe(200)
    await expect(response.json()).resolves.toEqual({ slug: validClub.slug })
    expect(rpc).toHaveBeenCalledOnce()
    expect(rpc).toHaveBeenCalledWith('create_club_with_owner', {
      p_name: validClub.name,
      p_slug: validClub.slug,
      p_description: validClub.description,
      p_type: validClub.type,
      p_platform: validClub.platform,
      p_platform_url: null,
      p_schedule: null,
      p_pomodoro_preset: validClub.pomodoro_preset,
      p_ambient_preset: validClub.ambient_preset,
    })
    expect(single).toHaveBeenCalledOnce()
  })

  it('surfaces a transactional membership failure without client-side compensation', async () => {
    const rpc = vi.fn().mockReturnValue({
      single: vi.fn().mockResolvedValue({
        data: null,
        error: { code: '23503', message: 'owner membership insert failed' },
      }),
    })
    const client = {
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-id' } } }) },
      rpc,
    }
    createSupabaseServerClient.mockResolvedValue(client)

    const response = await POST(requestFor(validClub))

    expect(response.status).toBe(500)
    await expect(response.json()).resolves.toEqual({ error: 'owner membership insert failed' })
    expect(rpc).toHaveBeenCalledOnce()
    expect(client).not.toHaveProperty('from')
  })

  it('maps a transactional slug conflict to 409', async () => {
    createSupabaseServerClient.mockResolvedValue({
      auth: { getUser: vi.fn().mockResolvedValue({ data: { user: { id: 'user-id' } } }) },
      rpc: vi.fn().mockReturnValue({
        single: vi.fn().mockResolvedValue({
          data: null,
          error: { code: '23505', message: 'duplicate key value violates unique constraint' },
        }),
      }),
    })

    const response = await POST(requestFor(validClub))

    expect(response.status).toBe(409)
  })
})

function requestFor(body: object): NextRequest {
  return new Request('https://vibeclubs.ai/api/clubs', {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  }) as NextRequest
}
