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

  // Mock mode — when no API key is configured we still return a usable recap
  // so launch demos and CI smoke tests don't 503. The mock is deterministic from
  // the event payload so it reads as "real" but never costs a token.
  if (!process.env.ANTHROPIC_API_KEY) {
    const text = mockRecap(parsed.data)
    return new Response(text, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8', 'X-Recap-Mode': 'mock' },
    })
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

/**
 * Deterministic stand-in for the live Claude recap. Each event type maps to a
 * one-line acknowledgement that obeys the same "never interrupt, never coach"
 * rule as the witness prompt. Used when ANTHROPIC_API_KEY is unset.
 */
function mockRecap(event: z.infer<typeof Event>): string {
  const club = event.club_name ?? event.club_id ?? 'the vibeclub'
  const cycle = event.cycle_number ?? 0
  switch (event.type) {
    case 'session_start':
      return `Locked in. ${club} is on the clock.`
    case 'pomodoro_start':
      return `Focus block ${cycle || 1} live.`
    case 'pomodoro_complete':
      return `Cycle ${cycle} shipped. Stretch.`
    case 'pomodoro_break_start':
      return `Break. Stand up.`
    case 'pomodoro_break_complete':
      return `Back in. One more cycle.`
    case 'session_end':
      return `Session done. Card on its way to your profile.`
    case 'milestone':
      return `That's a marker. Keep going.`
    default:
      return `Noted.`
  }
}
