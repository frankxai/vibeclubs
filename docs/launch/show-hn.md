# Show HN draft

Target post window: Friday May 15 2026, 09:00 ET (15:00 CET).

## Title (≤ 80 chars)

```
Show HN: Vibeclubs – a format for vibing together with your crew
```

Backup variants:
- `Show HN: Vibeclubs – co-working overlay for Meet, Discord, Zoom (MIT)`
- `Show HN: Open-source overlay – synced pomodoro + ambient mixer for any call`

## URL

```
https://vibeclubs.ai
```

## Body (HN body, ≤ 1500 chars — copy as-is)

Hi HN. I'm Frank, solo dev. Vibeclubs is a format for builders who want to make things alongside other builders — without yet another video app.

The premise: you already vibe on Discord, Meet, or in a coffee shop. You duct-tape three tools — ambient music, a pomodoro timer, a call. We formalize that ritual and ship it as a Chrome extension overlay + an open directory.

Three pieces:

1. **Chrome extension** — overlays a three-fader mixer (ambient + AI music + page audio) and a synced pomodoro on whatever tab you're on. Two extension users in the same vibeclub hit the same focus block via Supabase Realtime broadcast.

2. **vibeclubs.ai** — directory of public vibeclubs hosted on whatever platform their host already uses. List your own with a markdown PR (zero backend), or via the hosted /start flow. Your profile collects a card for every focus block you finish.

3. **Five MIT npm packages** — vibe-mix, pomodoro-sync, ai-witness (Claude prompt builder, hard-enforces "never interrupt"), session-card (1200×630 SVG renderer), suno-bridge. Drop them into Electron, Raycast, Tauri, your own site.

What's deliberately not there: breakout rooms, host controls, recording-by-default, calendar features. Those exist; we don't need to rebuild them.

Free forever for hosting. Pro ($12/mo) ships in a few weeks for Suno music gen + full Claude recaps.

Repo: https://github.com/frankxai/vibeclubs

Happy to take feedback on the format, the extension model, or the OSS-first strategy.

## First comment (drop ~5 min after the post)

```
Quick technical notes for HN:

* Architecture: Next.js 16 App Router + a Plasmo (MV3) extension + five MIT
  npm packages. The web app is the directory + playbook + API. The extension
  is the runtime — it's the thing that actually overlays your call.

* Pomodoro sync uses Supabase Realtime broadcast (NOT presence — broadcast is
  cheaper and we don't need membership semantics, just timer state). Late
  joiners send a ping, the host tab replies with current state. Drift-free
  across two devices in our tests.

* The ambient layer uses Web Audio with equal-power gain curves and
  optional duck-on-voice (lowers ambient when someone speaks on the call).
  The mix is per-listener — DMCA-safe because we're not broadcasting music
  back over the call.

* AI recap: Claude Haiku, prompt cached. The system prompt is identical per
  deploy so we get ~70% cache hits. Hard rule baked into the prompt: it
  never initiates, only responds to events. We surface it as "the recap"
  in user-facing copy; the package is `@vibeclubs/ai-witness` because that's
  what it is to a developer.

* Session cards are deterministic SVG — 1200×630, no theming. Same data
  always renders the same card. Brand discipline is on purpose.

* The directory has two paths: drop a markdown file in content/clubs/ via
  PR, or use the hosted /start flow. They merge at read time. The OSS path
  is canonical — the hosted path is a Pro convenience.

Repo: https://github.com/frankxai/vibeclubs
ADR-002 (format-not-platform pivot): in /docs/adr-002-format-not-platform.md
```

## Things to NOT say in the post

Skip the forbidden vocabulary from `VISION.md §Voice`. The big offenders to watch for: <!-- voice-audit: allow -->

- platform — say "format" instead, or describe the surface (Meet, Discord) <!-- voice-audit: allow -->
- community — say "crew" <!-- voice-audit: allow -->
- AI-powered — name the act ("Claude writes the recap") <!-- voice-audit: allow -->
- engage / connect / unlock — describe what actually happens <!-- voice-audit: allow -->

If you catch yourself typing any of them, rewrite using vibeclub / host / crew / lock in / ship.

## Reply playbook (first 4 hours)

- "Why not just LiveKit?" → ADR-002. The cold-start problem killed it. Refer to /docs/strategy/why-not-livekit.md if it exists, else summarize: "we tried — nobody opens a fifth video app." Stay calm.
- "Why not Spotify/YouTube?" → DMCA. Per-listener generative is the only legal broadcast.
- "Is this just a pomodoro?" → Yes plus the mixer plus the recap plus the directory. The mixer alone replaces three tools most builders open today.
- "Pricing concerns" → Free forever for hosting. Pro is for Suno + full recaps. The format is open source — you can run the whole thing with no Pro subscription.
- "Don't say 'open source' if it has a paid tier" → The packages are MIT. The extension is MIT. The web app is MIT. Pro is just hosted convenience.
- "Voice system stuff" → Don't argue. Most people won't notice. The ones who do will respect it.

If a comment is hostile, do not reply. The thread votes itself to the right place.
