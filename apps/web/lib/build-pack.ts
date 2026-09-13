import { z } from 'zod'

export const TRACKS = [
  {
    id: 'coding',
    label: 'Vibe coding',
    verb: 'Ship a working app',
    tools: 'v0 · Claude Code · Vercel',
    outcome: 'A working page with one complete interaction',
    proof: 'A preview link and a tested primary flow',
  },
  {
    id: 'agents',
    label: 'Agent engineering',
    verb: 'Build an agent you trust',
    tools: 'AI SDK · your editor · Vercel',
    outcome: 'An agent that completes one bounded task',
    proof: 'A successful run, a failure case, and a cost limit',
  },
  {
    id: 'design',
    label: 'Design',
    verb: 'Make the interaction click',
    tools: 'Figma · v0 · your taste',
    outcome: 'One polished screen with its key interaction',
    proof: 'A prototype with mobile and keyboard checks',
  },
  {
    id: 'music',
    label: 'Music',
    verb: 'Finish the track',
    tools: 'Suno · Ableton · headphones',
    outcome: 'A finished hook or arrangement passage',
    proof: 'An audio export you have permission to share',
  },
  {
    id: 'writing',
    label: 'Writing',
    verb: 'Get the words out',
    tools: 'Your editor · a quiet soundtrack',
    outcome: 'A complete scene, essay section, or revision',
    proof: 'An excerpt or a private-work note',
  },
  {
    id: 'mixed',
    label: 'Bring your own',
    verb: 'Different crafts. Same clock.',
    tools: 'Whatever you already use',
    outcome: 'One small finish per person',
    proof: 'One artifact, decision, or clear next action each',
  },
] as const

export const BuildDraftSchema = z.object({
  version: z.literal(1),
  track: z.enum(['coding', 'agents', 'design', 'music', 'writing', 'mixed']),
  name: z.string().trim().min(1).max(80),
  outcome: z.string().trim().min(1).max(500),
  duration: z.union([z.literal(60), z.literal(90), z.literal(120)]),
  crew: z.number().int().min(2).max(8),
  place: z.enum(['Discord', 'Google Meet', 'Zoom', 'In person', 'Other']),
  when: z.string().max(120),
  soundtrack: z.enum(['Lo-fi', 'Rain', 'Your own music', 'Silence']),
})
export type BuildDraft = z.infer<typeof BuildDraftSchema>
export const DEFAULT_DRAFT: BuildDraft = {
  version: 1,
  track: 'coding',
  name: 'Ship night',
  outcome: TRACKS[0].outcome,
  duration: 90,
  crew: 4,
  place: 'Discord',
  when: '',
  soundtrack: 'Lo-fi',
}

const BOUNDARIES = {
  60: [0, 5, 30, 35, 50, 60],
  90: [0, 5, 40, 50, 80, 90],
  120: [0, 10, 55, 65, 110, 120],
} as const
const PHASES = [
  {
    name: 'Set the finish',
    detail: 'Each person names a reachable finish. Pick a fallback contact.',
  },
  {
    name: 'Lock in',
    detail: 'Make the smallest useful version. Help is opt-in; questions go in chat.',
  },
  { name: 'Step away', detail: 'Stretch, refill, reset. Offer a pair when someone is stuck.' },
  {
    name: 'Make it hold up',
    detail: 'Test, edit, or refine. Shrink the scope before extending the clock.',
  },
  {
    name: 'Show what changed',
    detail: 'Share a result or lesson, with permission. Name the next action.',
  },
]

export function buildPack(draft: BuildDraft) {
  const track = TRACKS.find((item) => item.id === draft.track) ?? TRACKS[0]
  const times = BOUNDARIES[draft.duration]
  const agenda = PHASES.map((phase, i) => ({ ...phase, start: times[i]!, end: times[i + 1]! }))
  const invite = `${draft.name}\n\nLet's make something together. ${draft.outcome}\n${draft.duration} minutes · up to ${draft.crew} people · ${draft.place}\nWhen: ${draft.when.trim() || 'Agree a time + timezone with the crew'}\n${draft.place === 'In person' ? 'Share the location privately.' : 'Share the call link privately.'}\nSoundtrack: ${draft.soundtrack}. Bring your own tools.\n\nWe name a finish, lock in, take a break, then show what changed. Passing or sharing privately is welcome.`
  const brief = `Build brief: ${draft.name}\nOutcome: ${draft.outcome}\nTime budget: ${draft.duration} minutes\nProof: ${track.proof}\n\n${draft.track === 'agents' ? 'Use the Vercel AI SDK in the existing project. Define one task, typed inputs and a structured result. Give tools explicit schemas, least-privilege access, timeouts and bounded steps. Require human confirmation for writes or external actions. Test a successful run, invalid input, a tool failure, cancellation and exhausted budget. Keep model credentials on the server. Record latency, tokens and cost without private prompt content. Never claim an action succeeded without tool evidence.' : draft.track === 'coding' || draft.track === 'design' ? 'Use the existing stack and design system; for a new web project use Next.js on Vercel. Build one end-to-end interaction. Include responsive layout, keyboard navigation, clear loading, empty and error states. Keep secrets server-side. Use real data only when configured and clearly label sample data. Verify the primary flow before adding more scope.' : 'Use the tools you already know. Create the smallest complete artifact. Check the work against the intended finish. Respect source rights and only share material with permission.'}\n\nWorking contract:\n1. Inspect the starting material and constraints.\n2. Name the smallest deliverable and acceptance checks.\n3. Make the work in a reviewable change.\n4. Review independently against the checks; fix material failures.\n5. Return the artifact, evidence, limitations and next action.\nThe human host owns scope and sharing. Do not message the crew or publish automatically.`
  const v0 = `Create a polished, functional web experience for this brief:\n${draft.outcome}\n\nProject: ${draft.name}\nStart with one complete primary flow. Use the existing design system when provided; otherwise choose a deliberate visual direction. Use Next.js, accessible components, responsive layouts and clear interaction states. Make the main activity available in the first screen. Use real data only when configured; label any examples. Keep API keys server-side. Include a short verification checklist and identify anything still mocked. Prepare a Vercel preview for human review; do not claim a production deployment.\nDefinition of done: ${track.proof}.`
  const recap = `Only use notes I supply. Never invent attendance, progress, quotes or completion.\n\nIntended finish: ${draft.outcome}\nActual result:\nProof and sharing permission:\nWhat remains:\nNext action:\n\nWrite a concise recap of what changed. An unfinished result is valid. The human host reviews before sharing.`
  const markdown = `# ${draft.name}\n\nA vibeclub: a small crew, a shared clock, and something real to show.\n\n## Crew invite\n${invite}\n\n## Host agenda\n${agenda.map((phase) => `${phase.start}–${phase.end} min | ${phase.name}: ${phase.detail}`).join('\n')}\n\n## Build brief\n${brief}\n\n${['coding', 'agents', 'design'].includes(draft.track) ? `## v0 prompt\n${v0}\n\n` : ''}## Recap prompt\n${recap}\n\n## When plans change\nNobody arrives: complete a solo block; do not invent attendance.\nLate arrival: share the current phase without restarting.\nCall fails: use the agreed fallback and continue locally.\nUnfinished: record what changed and one next action.\n\nMade with https://vibeclubs.ai/start\n`
  return { track, agenda, invite, brief, v0, recap, markdown }
}
