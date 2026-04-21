export interface PlaybookEntry {
  slug: string
  title: string
  summary: string
  body: string
}

export const PLAYBOOK: PlaybookEntry[] = [
  {
    slug: 'what-is-a-vibeclub',
    title: "What's a vibeclub?",
    summary: 'The one-screen explainer. Format, not platform. Why it works.',
    body: `A vibeclub is what your crew does when you all have something to ship.

It's a format — like hackathon, book club, or run club. A repeatable ritual. You don't need permission, software, or a platform. You need three things: a rhythm, a soundtrack, and at least one other person who's also locking in.

### The three ingredients

1. **A rhythm.** Pomodoro. 25/5, 50/10, 90/20 — pick one, everyone hits the same block.
2. **A soundtrack.** Ambient + music. Usually lofi. Sometimes Suno-generated. Background, never foreground.
3. **A crew.** Not a community. A crew. 2-8 people who've all agreed to show up when the link goes live.

### What it isn't

- Not a meeting. No agenda. No host talking.
- Not a class. No teacher.
- Not a networking event. Connection is a byproduct.

### Why it works

Presence + rhythm = focus. The ADHD body-doubling research points at 30-50% reduction in procrastination when someone else is in the same focused state. Vibeclubs just make that rhythmic and shareable.

### Who hosts

Anyone. Hosts just opened the door. They aren't teachers, moderators, or facilitators. The vibeclub runs itself — the extension handles the timer, the soundtrack, the recap. Host just ships like everyone else.
`,
  },
  {
    slug: 'how-to-host',
    title: 'How to host one',
    summary: '5 minutes. Pick a platform, a rhythm, a soundtrack. Share the link.',
    body: `### 1. Pick ONE thing to ship

Narrower is better. "Lofi coders" beats "general tech." "Thursday morning writers" beats "writing club." The more specific you are, the more the right people feel called.

### 2. Pick a platform you already love

Meet, Discord, Zoom, or IRL. **Don't pick a new tool.** The whole point is the vibeclub runs on what you already have. The extension overlays anywhere.

### 3. Pick a rhythm

- **25/5** — classic pomodoro. Task-switching work, code reviews, triage.
- **50/10** — deep work. Programming, writing, design, music production.
- **90/20** — ultradian cycle. Research, long creative flows.

### 4. Pick a soundtrack

Lofi, rain, café, nature, or space. If in doubt: lofi. It's lofi for a reason.

### 5. Host it

[Host a vibeclub](/start). 60 seconds. You get a link like \`vibeclubs.ai/club/your-slug\`.

### 6. Send it

Post the link. Don't broadcast to strangers. Send it to 2-5 people who already know each other — the first session should feel like friends, not a public event. Gravity grows from there.

### 7. Show up and ship

You're not running a business. You're running a Thursday evening ritual that your friends happen to show up for.
`,
  },
  {
    slug: 'the-mixer',
    title: 'How to tune the mixer',
    summary: 'Three faders: ambient, music, voice. The 30/25/85 starting point.',
    body: `The extension ships a three-layer Web Audio mixer. Most co-working tools give you one volume slider — focus audio isn't one thing.

### Ambient

Shared loops — lofi, rain, café, nature, space. Default: **30-40%**. If you notice the ambient, it's too loud.

### Music

Per-listener. Two sources:

- **Suno-generated** (Pro) — AI tracks matched to the club's genre, fresh per session.
- **Royalty-free fallback** (free) — curated lofi on the Vibeclubs CDN.

Music is never broadcast — each person streams their own. Default: **20-30%**.

### Voice / page audio

Your call audio or tab audio — whichever platform you're on. Default: **70-90%**. Voice is always loudest. The humans are the point.

### The rule

**Ambient < Music < Voice.** If voice is drowning in music, you've lost the vibe. If ambient = music, the mix feels muddy.

### Duck on voice

Turn on "duck ambient when someone speaks" — ambient drops 6dB on WebRTC voice activity, then rides back up. Open audio space that still breathes for conversation.
`,
  },
  {
    slug: 'the-recap',
    title: 'The recap',
    summary: 'Claude watches. Never interrupts. Writes you a two-liner at the end.',
    body: `The recap is a Claude agent that lives quietly in your session. It has exactly three jobs:

1. **Notice.** Track pomodoro starts, completions, breaks, session end.
2. **Log.** Write a short recap when the timer stops.
3. **Celebrate.** At milestones (first session, cycle 5, streak), post a warm one-liner.

### The one rule

**Claude never interrupts.** It doesn't:

- Ask you questions during focus
- Prompt you to set goals
- Check in during breaks
- Join voice
- Respond to chat

If you want it to "help more," you want a different product.

### Why so restrained

The whole point is that nobody's in charge. An AI that runs the vibeclub breaks the format. The recap works because it models the ideal participant: present, aware, quiet.

### When it speaks

- Session start: 1 line ("Session open. I'm here.")
- Cycle complete: optional, only on meaningful counts ("Cycle 3 down. 75 minutes shipped today.")
- Session end: 1-2 line recap ("90 minutes, 3 cycles, Discord. Shipped the landing page rewrite.")

That's it. Everything else is off by default.

### Turning it off

Host → club settings → recap: off. No degradation. No nagging.
`,
  },
]

export function findEntry(slug: string): PlaybookEntry | undefined {
  return PLAYBOOK.find((p) => p.slug === slug)
}
