import { NextResponse, type NextRequest } from 'next/server'
import { z } from 'zod'
import { streamText } from 'ai'
import { anthropic } from '@ai-sdk/anthropic'
import { witnessPrompt } from '@vibeclubs/ai-witness'

export const runtime = 'nodejs'
export const maxDuration = 60

/**
 * /api/recap — the session-recap endpoint.
 *
 * Accepts pomodoro + session events from the extension. Streams a short Claude
 * completion back. The Claude prompt (in @vibeclubs/ai-witness) hard-enforces
 * "never interrupt" behavior: one line per event, no questions, no coaching.
 *
 * The package is still called `ai-witness` internally — it's a witness pattern.
 * We surface it to users as "recap" because that's what builders actually call it.
 */
const Event = z.object({
  type: z.enum([
    'session_start',
    'pomodoro_start',
    'pomodoro_complete',
    'pomodoro_break_start',
    'pomodoro_break_complete',
    'session_end',
    'milestone',
  ]),
  club_id: z.string().optional(),
  club_name: z.string().optional(),
  platform: z.string().optional(),
  cycle_number: z.number().int().optional(),
  focus_minutes_so_far: z.number().int().optional(),
  participant_count: z.number().int().optional(),
  time_of_day: z.string().optional(),
  participant_handle: z.string().optional(),
})

export async function POST(request: NextRequest) {
  const parsed = Event.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid recap event' }, { status: 400 })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json({ error: 'Recap not configured' }, { status: 503 })
  }

  const { system, user } = witnessPrompt(parsed.data)

  const result = streamText({
    model: anthropic('claude-haiku-4-5-20251001'),
    system,
    prompt: user,
    maxTokens: 200,
    // Cache the witness system prompt across every session — it's identical per deploy.
    providerOptions: {
      anthropic: {
        cacheControl: { type: 'ephemeral' },
      },
    },
  })

  return result.toTextStreamResponse()
}
