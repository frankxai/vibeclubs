# Vibe mechanics — how this actually makes people vibe together

*Written 2026-04-23. The design question nobody else in the co-working-tool space is asking: what mechanics make a distributed session feel like a band playing the same song, not ten people running ten stopwatches?*

---

## The reframe

Most focus tools are **chronometers with a chat window glued on**. Vibeclubs is not a focus tool — it's a format for people who want to **make something with their crew** while vibing. The distinction is load-bearing. A chronometer ticks; a vibeclub *pulses*.

Pulse requires **felt simultaneity** — six mechanics that make the crew feel like they're on the same song even when they're on five different platforms in four timezones.

## The six mechanics

### 1. Shared tempo — same beat, not just same block

**Problem:** Pomodoro-sync gets everyone onto the same 25/5 cycle. But *inside* the cycle, each listener's music is per-listener (DMCA-safe). There's no shared heartbeat.

**Fix:** Every vibeclub session carries a **BPM** as a first-class field on the pomodoro state. The extension and site render a subtle shared pulse (SVG + CSS animation) at that BPM. When you open the club page, the page breathes at the same rate as every other crew member's page. Music is still per-listener; *tempo* is communal.

Default BPMs by phase:

| Phase | BPM | Feel |
|---|---|---|
| Idle (lobby) | 78 | Warming up. |
| Focus (lofi-coders default) | 95 | Head-down but moving. |
| Focus (sprint/music) | 120 | Locked in. |
| Break | 128 | Stretch / snack / hydrate. |
| Dance break (music clubs) | 128–140 | Get up. |

The host can override per club; templates carry a default.

### 2. Presence awareness — I can see who's breathing

**Problem:** A club page is a static directory listing. When you visit `/club/lofi-coders-amsterdam` while seven people are locked in together, you have no idea anyone is there.

**Fix:** `/club/[slug]` becomes **live** during active sessions. Pulsing avatars (brighter = deeper-into-focus), current cycle phase badge, shipped count for the day, the shared BPM pulse overlaying the page. Even without joining, a visitor feels the vibe happening.

Presence data goes over the same Supabase Realtime broadcast channel the pomodoro already uses. When a user's extension broadcasts `session_start`, their avatar lights up on the club page. Zero-additional-backend cost; pure channel reuse.

### 3. Ship moment — the rhythm of share, not just the rhythm of work

**Problem:** A 25-min focus cycle ends. Timer goes "ding." Everyone resets. That's a metronome, not a band.

**Fix:** At the end of each focus cycle, a **60-second ship moment** runs before the break. The extension opens a small overlay: "Drop what you just shipped — one line, a screenshot, a commit URL, or 🔥 if you just cooked." Everything dropped lands on the club page in real time as a crew receipt. Break starts only after drops close.

Structure:

```
 ←── Focus 25 min ──→ ← Ship 60 s → ← Break 4 min → ← Focus 25 min →
                       drops fly in       vibes
```

The ship moment is **the vibeclub's signature ritual**. It's what replaces the dead Pomodoro ring-and-reset with a felt "we did a thing, together, just now."

### 4. Stakes — pressure that sharpens without becoming work

**Problem:** Vibeclubs are too low-stakes. You can skip the session card, leave mid-cycle, nobody notices. "Lock in" without "or else" decays into "sit near your laptop."

**Fix:** **The Sprint preset.** Four cycles of 22 min focus + 3 min ship + 0 min break (no rest between cycles 1-3; one long break after cycle 2). If you miss three drops in a row you're auto-dropped from the session card's crew list. Stakes are visible to the crew: "3 shipping · 1 drifting · 0 dropped."

This is opt-in. The default 25/5 preset has no dropout. Sprint is for crews that want the edge.

### 5. Energy modulation — the session as a DJ set

**Problem:** Per-listener music + static ambient = no energy arc. Every cycle feels the same.

**Fix:** Suno generation in `@vibeclubs/suno-bridge` reads the **cycle index** and produces a matching track:

| Cycle | Prompt shape | Target BPM |
|---|---|---|
| 1 (warm) | "gentle" + club genre | 85–95 |
| 2 (peak) | "focused" + club genre | 105–115 |
| 3 (sprint) | "energetic" + club genre | 120–130 |
| Break | "celebratory" + genre × 1.3 | 128 |

The user hears an escalation without operating a DJ board. For vibeclubs using fallback royalty-free tracks instead of Suno, the ambient preset library carries the same three-tier tagging (`warm`, `peak`, `sprint`).

### 6. Body — the dance break as first-class phase

**Problem:** Vibeclubs positions itself as focus-oriented. Bodies don't lock in well for 90 minutes without moving. And for music producer crews, "vibe" explicitly means *move*.

**Fix:** New phase alongside `idle / focus / break` — **`dance`**. It's a 5-minute break flavored for movement. BPM ramps to 128+. The extension shows a rhythm lattice pulsing to the beat. Mixer music fader auto-boosts 20%. Optional "I'm dancing" toggle — other extensions see faint shimmer on the shared page.

Dance breaks are opt-in per preset. The `music-jam` and `dance-break` templates carry them. The `study-group` template does not. Hosts pick the preset that matches their crew's body posture.

---

## The four new presets

| Preset | Cycle | Phases | Who it's for |
|---|---|---|---|
| `vibe-coding-sprint` | 22 + 3 ship + 0 break (×3) then 15-min break | focus → ship → focus → ship → focus → ship → break | Vibe coders who want stakes |
| `music-jam` | 90 min continuous with BPM ramp + 1 dance break at min 45 | focus → dance → focus | Suno producers, beatmakers |
| `dance-break` | 25 focus + 5 dance (×3) | focus → dance | Creators who body-vibe |
| `lightning` | 10 focus + 2 ship (×5) | focus → ship | Designers / writers doing timed outputs |

All of these extend — they don't replace — the existing `25_5 / 50_10 / 90_20 / custom` presets. The classic presets remain for crews that want quiet focus without the choreography.

## How the mechanics stack

A single session on the `vibe-coding-sprint` preset looks like this, moment by moment:

```
T+0:00   Idle — crew avatars pulse at 78 BPM. Host hits start.
T+0:00   Focus cycle 1 — BPM ramps to 120. VibeOrb warms.
         Music fader generates warm lofi at 95. Shared pulse
         at 120 everywhere the club surfaces live.
T+22:00  Ship moment — overlay opens on every extension:
         "Drop what you shipped." 60 s. Crew watches each
         others' drops land on the club page.
T+23:00  Focus cycle 2 — music ramps to 115 BPM. Avatars
         glow brighter (focus depth). Stakes display: "4
         shipping, 1 drifting."
T+45:00  Ship moment #2. 60 s.
T+46:00  Focus cycle 3 — music to 125 BPM. Stakes tighten.
T+68:00  Ship moment #3 + break transition. 60 s.
T+69:00  Break (15 min) — mixer swells, BPM 128. Crew
         posts their final outputs. Session card compiles
         aggregate shipped.
T+84:00  Session ends. Session card lands on each profile,
         tagged with the crew handles. Claude writes the
         recap.
```

That's a vibeclub. Not a timer — a shared three-act structure with felt rhythm.

---

## What gets built in code

This doc ships with the first wave. What's wired now vs. planned:

| Mechanic | State | Where |
|---|---|---|
| BPM on pomodoro state | ✅ in this commit | `packages/pomodoro-sync/src/types.ts` |
| Four new presets | ✅ in this commit | `packages/pomodoro-sync/src/presets.ts` + `apps/web/lib/club-templates.ts` |
| Shared pulse primitive (`PulseBeat`) | ✅ in this commit | `apps/web/components/motion/pulse-beat.tsx` |
| Ship moment component (`ShipDrop`) | ✅ in this commit (UI mock) | `apps/web/components/patterns/ship-drop.tsx` |
| Live club page | 🔜 Sprint 2 | needs Supabase Realtime presence channel |
| Dropout mechanic | 🔜 Sprint 2 | needs session-level state management |
| Suno energy ramp | 🔜 when Suno access lands | `packages/suno-bridge/src/index.ts` |
| Dance phase styling | ✅ token-level | `packages/design-core/tokens.css` |

## Principles

Three rules constrain what counts as a valid vibe mechanic. If it fails any, cut it.

1. **Does it make the crew feel each other?** If it only helps a solo user, it's a focus tool, not a vibeclub.
2. **Does it work on platforms we don't control?** All mechanics must ride through the extension overlay on Meet/Discord/Zoom/any tab. No mechanic that requires a custom platform.
3. **Does it degrade gracefully to solo?** The mechanics must make a one-person vibeclub feel decent too. A crew of one is still a valid config.

## Failure modes to avoid

- **Gamifying it into Habitica.** No points, no leaderboards, no streaks as a mechanic. Session cards are artefacts, not scoreboards.
- **Making the AI a DJ.** Claude stays a witness. The BPM + presets + energy ramp are deterministic / template-driven, not AI-curated.
- **Adding chat.** Ship moment is share-at-a-moment, not chat. If it becomes an ongoing conversation, we're building Slack. Kill the feature.
- **Requiring video.** Vibeclubs assumes the call is happening on Meet/Discord already. We never add our own video layer.
