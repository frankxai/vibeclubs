// @vitest-environment node
import { NextRequest } from 'next/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_DRAFT } from '@/lib/build-pack'

const { createSupabaseServerClient, generateText, anthropic, outputObject } = vi.hoisted(() => ({
  createSupabaseServerClient: vi.fn(),
  generateText: vi.fn(),
  anthropic: vi.fn(),
  outputObject: vi.fn(),
}))

vi.mock('@/lib/supabase/server', () => ({ createSupabaseServerClient }))
vi.mock('ai', () => ({ generateText, Output: { object: outputObject } }))
vi.mock('@ai-sdk/anthropic', () => ({ anthropic }))

import { POST } from './route'

const brief = {
  finish: 'Ship one working search flow',
  steps: ['Build the search input', 'Handle an empty result'],
  checks: ['Keyboard submission works', 'Empty results explain what happened'],
  cut: 'Account settings',
}

describe('POST /api/build-brief', () => {
  const getUser = vi.fn()
  const rpc = vi.fn()

  beforeEach(() => {
    vi.resetAllMocks()
    vi.stubEnv('AI_BRIEF_ENABLED', 'true')
    vi.stubEnv('ANTHROPIC_API_KEY', 'test-key')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'https://example.supabase.co')
    vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-anon-key')
    getUser.mockResolvedValue({ data: { user: { id: 'host-id' } }, error: null })
    rpc.mockResolvedValue({ data: true, error: null })
    createSupabaseServerClient.mockResolvedValue({ auth: { getUser }, rpc })
    anthropic.mockReturnValue({ provider: 'test-provider' })
    outputObject.mockImplementation((configuration: unknown) => configuration)
    generateText.mockResolvedValue({ output: brief })
  })

  afterEach(() => vi.unstubAllEnvs())

  it.each(['AI_BRIEF_ENABLED', 'ANTHROPIC_API_KEY', 'NEXT_PUBLIC_SUPABASE_URL'])(
    'returns 503 without spending quota when %s is unavailable',
    async (variable) => {
      vi.stubEnv(variable, '')
      const response = await POST(requestFor())
      expect(response.status).toBe(503)
      expect(createSupabaseServerClient).not.toHaveBeenCalled()
      expect(generateText).not.toHaveBeenCalled()
    },
  )

  it.each(['https://unrelated.example', null])(
    'rejects the origin %s before auth',
    async (origin) => {
      const response = await POST(requestFor(JSON.stringify(DEFAULT_DRAFT), origin))
      expect(response.status).toBe(403)
      expect(createSupabaseServerClient).not.toHaveBeenCalled()
      expect(generateText).not.toHaveBeenCalled()
    },
  )

  it.each(['not-json', '{}', JSON.stringify({ ...DEFAULT_DRAFT, outcome: '' })])(
    'returns 400 for invalid input without querying auth or quota',
    async (body) => {
      const response = await POST(requestFor(body))
      expect(response.status).toBe(400)
      expect(createSupabaseServerClient).not.toHaveBeenCalled()
      expect(generateText).not.toHaveBeenCalled()
    },
  )

  it('rejects an oversized body even without a Content-Length header', async () => {
    const request = requestFor('x'.repeat(8193))
    expect(request.headers.has('content-length')).toBe(false)
    const response = await POST(request)
    expect(response.status).toBe(413)
    expect(createSupabaseServerClient).not.toHaveBeenCalled()
    expect(generateText).not.toHaveBeenCalled()
  })

  it.each([
    { data: { user: null }, error: null },
    { data: { user: { id: 'host-id' } }, error: { message: 'Expired auth' } },
  ])('returns 401 when auth cannot establish the host', async (authResult) => {
    getUser.mockResolvedValue(authResult)
    const response = await POST(requestFor())
    expect(response.status).toBe(401)
    expect(rpc).not.toHaveBeenCalled()
    expect(generateText).not.toHaveBeenCalled()
  })

  it('fails closed with 503 when the quota RPC is unavailable', async () => {
    rpc.mockResolvedValue({ data: null, error: { message: 'Function does not exist' } })
    const response = await POST(requestFor())
    expect(response.status).toBe(503)
    expect(rpc).toHaveBeenCalledExactlyOnceWith('claim_build_brief')
    expect(generateText).not.toHaveBeenCalled()
  })

  it('returns 429 without a model call when the atomic quota is exhausted', async () => {
    rpc.mockResolvedValue({ data: false, error: null })
    const response = await POST(requestFor())
    expect(response.status).toBe(429)
    expect(generateText).not.toHaveBeenCalled()
  })

  it('returns structured output without sending host identity or invite details to the model', async () => {
    const draft = {
      ...DEFAULT_DRAFT,
      name: 'Private crew name',
      place: 'In person',
      when: 'Private appointment detail',
    }
    const response = await POST(requestFor(JSON.stringify(draft)))
    expect(response.status).toBe(200)
    expect(response.headers.get('cache-control')).toBe('no-store')
    await expect(response.json()).resolves.toEqual({ brief })
    expect(generateText).toHaveBeenCalledOnce()
    const [options] = generateText.mock.calls[0]!
    expect(JSON.parse(options.prompt)).toEqual({
      craft: draft.track,
      outcome: draft.outcome,
      minutes: draft.duration,
    })
    expect(options).toMatchObject({ maxOutputTokens: 1000, maxRetries: 0 })
    expect(options.abortSignal.aborted).toBe(false)
    expect(options).not.toHaveProperty('tools')
    expect(outputObject).toHaveBeenCalledOnce()
    const [configuration] = outputObject.mock.calls[0]!
    expect(configuration.schema.safeParse(brief).success).toBe(true)
    expect(configuration.schema.safeParse({ ...brief, steps: [] }).success).toBe(false)
    expect(
      configuration.schema.safeParse({ ...brief, checks: Array(5).fill('check') }).success,
    ).toBe(false)
  })

  it('returns 502 on model failure without leaking provider errors or changing the input', async () => {
    generateText.mockRejectedValue(new Error('private provider credential error'))
    const draft = { ...DEFAULT_DRAFT }
    const response = await POST(requestFor(JSON.stringify(draft)))
    expect(response.status).toBe(502)
    await expect(response.json()).resolves.toEqual({
      error: 'Could not refine this brief. Your original pack is unchanged.',
    })
    expect(draft).toEqual(DEFAULT_DRAFT)
    expect(generateText).toHaveBeenCalledOnce()
  })
})

function requestFor(
  body = JSON.stringify(DEFAULT_DRAFT),
  origin: string | null = 'https://vibeclubs.ai',
): NextRequest {
  return new NextRequest('https://vibeclubs.ai/api/build-brief', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(origin ? { origin } : {}),
    },
    body,
  })
}
