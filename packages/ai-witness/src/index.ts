/**
 * @vibeclubs/ai-witness
 *
 * Prompt builder for the Claude-powered session witness.
 *
 * The witness has exactly three jobs (VISION.md §"The witness rule"):
 *   1. Notice  — track Pomodoro starts, completions, breaks, session end
 *   2. Log     — write a short session summary on request
 *   3. Celebrate — post a one-line congratulation at milestones
 *
 * The witness NEVER interrupts. These prompts enforce that by hard-coding
 * refusal behaviors for anything that would pull a participant out of flow.
 */

export type WitnessEventType =
  | 'session_start'
  | 'pomodoro_start'
  | 'pomodoro_complete'
  | 'pomodoro_break_start'
  | 'pomodoro_break_complete'
  | 'session_end'
  | 'milestone'

export interface WitnessEvent {
  type: WitnessEventType
  club_id?: string
  club_name?: string
  platform?: string
  cycle_number?: number
  focus_minutes_so_far?: number
  participant_count?: number
  time_of_day?: string
  participant_handle?: string
  /** e.g. "first session", "5th cycle", "10-session streak" */
  milestone_label?: string
}

export interface WitnessPrompt {
  system: string
  user: string
}

const SYSTEM_PROMPT = `You are the Vibeclubs witness. You live quietly inside a focused work session.

Your three jobs, exactly:
1. NOTICE — acknowledge a Pomodoro event in one short sentence.
2. LOG    — produce a 1-2 sentence session summary when asked.
3. CELEBRATE — at milestones, post a warm one-liner.

You NEVER:
- Ask questions of the participant
- Prompt them to share goals, feelings, or progress
- Interrupt during focus or break blocks
- Suggest productivity techniques
- Respond to chat messages from participants

Voice:
- Warm, brief, specific. Think "supportive friend who's in the room with you."
- No emoji unless the event is a true milestone (first session, cycle 5, streak).
- No em-dashes. Short sentences. No preamble like "Great job!" — just the observation.
- Never say "I noticed" or "I see that" — just note the thing.

Length: always 1 sentence, under 25 words. Exception: session_end summary may be 2 sentences.

If asked to do anything outside notice/log/celebrate, respond with a single word: "listening."`

export function witnessPrompt(event: WitnessEvent): WitnessPrompt {
  return {
    system: SYSTEM_PROMPT,
    user: renderEvent(event),
  }
}

function renderEvent(e: WitnessEvent): string {
  const club = e.club_name ? ` for ${e.club_name}` : ''
  switch (e.type) {
    case 'session_start':
      return `Event: session_start${club}. Participant: ${e.participant_handle ?? 'a maker'}. Platform: ${e.platform ?? 'unknown'}. Produce a one-line acknowledgement.`

    case 'pomodoro_start':
      return `Event: pomodoro_start. Cycle ${e.cycle_number ?? 1}. Produce a one-line acknowledgement.`

    case 'pomodoro_complete':
      return `Event: pomodoro_complete. Cycle ${e.cycle_number ?? '?'} done. ${
        e.focus_minutes_so_far ? `Total focus today: ${e.focus_minutes_so_far}m. ` : ''
      }Produce a one-line acknowledgement.`

    case 'pomodoro_break_start':
      return `Event: pomodoro_break_start. Produce a one-line acknowledgement that a break has begun.`

    case 'pomodoro_break_complete':
      return `Event: pomodoro_break_complete. Break is over. Produce a one-line re-entry acknowledgement.`

    case 'session_end':
      return `Event: session_end${club}. Cycles completed: ${e.cycle_number ?? 0}. Total focus: ${
        e.focus_minutes_so_far ?? 0
      }m. Produce a 1-2 sentence session summary.`

    case 'milestone':
      return `Event: milestone — ${e.milestone_label ?? 'something worth noting'}. Produce a warm one-line celebration. Emoji allowed.`
  }
}

/** Heuristic milestone detector — the host app should call this per event. */
export function detectMilestone(input: {
  totalSessions: number
  cyclesThisSession: number
  totalFocusMinutesAllTime: number
}): string | null {
  if (input.totalSessions === 1) return 'first session'
  if (input.cyclesThisSession === 5) return '5th cycle in a session'
  if (input.totalFocusMinutesAllTime % 1000 === 0 && input.totalFocusMinutesAllTime > 0)
    return `${input.totalFocusMinutesAllTime} minutes of focused work all-time`
  if (input.totalSessions % 10 === 0 && input.totalSessions > 0)
    return `${input.totalSessions}-session streak`
  return null
}
