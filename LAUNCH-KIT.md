# Launch Kit

Everything needed to ship Vibeclubs publicly. Copy-paste, adapt the 
timestamps, post.

---

## X / Twitter launch tweet

> hosting a vibeclub sunday 9am CET. claude code + lofi, 90-min lock-in, drop in.
> 
> vibeclubs.ai

**Thread (7 tweets):**

1. shipped vibeclubs today. open source. MIT. chrome extension + directory + five npm packages.
2. the idea: a vibeclub is what your crew does when you all have something to ship. shared pomodoro, ambient mixer, auto-recap. works on meet / discord / zoom / wherever you already are.
3. it's a format, not a platform. you don't switch tools to run one. you open the extension on top of whatever's open and hit start.
4. three faders: ambient, ai music (suno), your tab. equal-power web audio mixer. duck-on-voice. you feel the room through your ears.
5. the pomodoro syncs across everyone in the club via supabase realtime. one block, everyone at once. body doubling, ritualized.
6. at session end, claude writes a two-line recap. card lands on your profile. screenshot, post, your crew shows up next sunday. that's the loop.
7. vibeclubs.ai · github.com/frankxai/vibeclubs · hosting one tonight

---

## Show HN post

**Title:**
`Show HN: Vibeclubs – host a pomodoro vibeclub on meet, discord, anywhere`

**Body:**

```
Hi HN —

I'm Frank. I shipped Vibeclubs tonight after a few weekends of 2am work.

A vibeclub is a format for co-working rituals: shared pomodoro, ambient
audio mixer, auto-recap from Claude. The trick is it runs as a Chrome
extension overlay on whatever you already use — Meet, Discord, Zoom,
YouTube, a blank tab. You don't switch tools.

What's open source (MIT):
- @vibeclubs/vibe-mix — three-layer Web Audio mixer (ambient + music + page)
- @vibeclubs/pomodoro-sync — supabase realtime broadcast state machine
- @vibeclubs/ai-witness — Claude prompt builder for session recaps
- @vibeclubs/session-card — 1200×630 SVG card generator
- @vibeclubs/suno-bridge — suno API wrapper with royalty-free fallback

vibeclubs.ai has a directory where you list your club + where your crew
finds one. The extension does the actual work.

Why not another Zoom/Clubhouse clone? Because live-audio is commoditized.
A format is uncapturable — "podcast" beat "audioblog" because it was
format-native to whatever app you had. Vibeclubs is the pomodoro ritual,
productized as an overlay, not as a venue.

Would love feedback on: (1) the extension UX, (2) the mixer model, (3)
whether the recap-card loop actually drives re-attendance. It's my
open-source bet this year.

GitHub: github.com/frankxai/vibeclubs
Site: vibeclubs.ai

— Frank
```

---

## LinkedIn post (operator angle)

> Shipped Vibeclubs — a format for running co-working sessions with your crew on whatever platform you already use.
> 
> Claude Code + lofi + a 90-minute pomodoro. Everyone in the club hits the same block. At the end, Claude writes a short recap. Card lands on your profile.
> 
> Open source (MIT), five npm packages, chrome extension, directory site.
> 
> Hosting the first public one Sunday 9am CET. Link in comments.

---

## Discord drop (Arcanea / FrankX / GenCreator)

> yo — shipped vibeclubs today 🌒
> 
> open source pomodoro format. chrome extension overlays the mixer + timer on whatever you're already using. claude writes a recap at the end.
> 
> hosting a public one sunday 9am CET for the launch. bring whatever you're shipping. drop in: vibeclubs.ai/club/launch-sunday

---

## Reddit posts

### r/selfhosted

**Title:** `Vibeclubs — MIT-licensed pomodoro + audio mixer as a chrome extension (no server required, bring your own call)`

### r/sideproject

**Title:** `Shipped a chrome extension that turns any meet/discord call into a pomodoro vibeclub (MIT)`

### r/productivity

**Title:** `Made an extension that syncs pomodoro across everyone in the same co-working session (open source)`

---

## Producthunt (prep, launch Tuesday after Sprint 1)

- **Tagline:** Host a vibeclub — pomodoro + ambient mixer on any platform
- **Description:** (shortened Show HN text, first three paragraphs)
- **First comment:** "Built this because I kept duct-taping lofi + a timer + a discord call every morning. Wanted the loop formalized. Feedback super welcome."
- **Assets needed:** OG image (`/api/og`), 3 product screenshots (landing, extension overlay, session card), 1 demo loom (90s)

---

## Email to waitlist (magic-link captured signups)

**Subject:** `Sunday vibeclub: your workout playlist, our lofi, 90 min lock-in`

```
hey —

vibeclubs is live. you're on the list because you were early.

first public vibeclub is sunday 9am CET. claude code + your crew + lofi.
come with something to ship — a feature, an email backlog, a deck, a
workout playlist, whatever.

join here: vibeclubs.ai/club/launch-sunday
install the extension: vibeclubs.ai/extension

if sunday doesn't work, there's a directory of others: vibeclubs.ai/explore

if you want to host your own: vibeclubs.ai/start

— frank
```

---

## First session card (Frank's own launch session)

Host Frank's own vibeclub within 24h of launch. Let the auto-recap generate
the first session card. Screenshot it. Post it. That's how the loop starts.

Target: `vibeclubs.ai/u/frank` with one card on it by launch + 24h.

---

## Stop-ship checklist

Don't launch if any of these are false:

- [ ] Landing renders (voice-audit clean)
- [ ] Supabase migration ran against prod
- [ ] Magic-link signin works end-to-end
- [ ] `/api/og` returns a PNG
- [ ] Club creation round-trip (`/start` → DB → `/club/[slug]`)
- [ ] Extension loads in Chrome (unpacked is fine for launch; Web Store is nice-to-have)
- [ ] GitHub repo is public with MIT license + README
- [ ] OSS packages published OR documented as "coming this week"
- [ ] First launch tweet drafted and scheduled
