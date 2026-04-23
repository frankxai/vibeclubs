# content/clubs — the autonomous directory

Every `.md` file in this folder is a **listed vibeclub**. This is the OSS-first, zero-backend path to listing a club. No Supabase, no auth, no DB — just a markdown file + a pull request.

## Adding your vibeclub

1. Copy any existing club file (e.g. `lofi-coders-amsterdam.md`) to `content/clubs/<your-slug>.md`.
2. Fill in the frontmatter — see the schema below.
3. Write 1–3 short paragraphs in the body describing the vibe.
4. Open a PR titled `club: <your-slug>`.
5. After merge, your club appears on `https://vibeclubs.ai/explore` within a deploy (usually < 5 min).

## Frontmatter schema

```yaml
---
name: Lofi Coders Amsterdam      # Display name. Title case.
host: '@frankx'                   # Your handle. Include the @.
platform: discord                 # One of: meet, discord, zoom, in_person, other
type: coding                      # One of: coding, music, design, study, fitness, writing, other
preset: 50_10                     # One of: 25_5, 50_10, 90_20, custom,
                                  #         vibe_coding_sprint, music_jam,
                                  #         dance_break, lightning
ambient: lofi                     # One of: lofi, rain, cafe, nature, space
schedule: 'Mondays 21:00 CET'     # Freeform. Human-readable. Timezone required.
platform_url: 'https://discord.gg/your-invite'  # Optional, any public invite
featured: false                   # Optional. true only for Arcanea-curated clubs.
location: 'Amsterdam'             # Optional. Only if in-person or location-flavored.
---

Body copy. One to three short paragraphs. What the crew is shipping.
What they're skipping. The energy. Why a stranger should drop in tonight.
```

## What the static directory gives up

Compared to the hosted Supabase directory:

- No per-user auth gate on creation.
- No realtime member count.
- No private clubs (by design — public is the ethos).
- No edits without a PR.

## When to use the hosted path instead

The hosted Supabase path (`/start` → POST `/api/clubs`) is the right choice when:

- You want private clubs for a specific cohort.
- You need realtime presence on `/club/<slug>` (Sprint 2).
- Your crew is non-technical and can't file a PR.

The two paths coexist. Hosted clubs and static clubs both render on `/explore` with no visual distinction. The DATA SOURCE is an implementation detail.

## What "approved" looks like

There is no approval. Open a PR, pass CI (voice-audit + typecheck), and a human merges. Merge = live. The only rejection reasons:

- Violates the voice system (see `VISION.md §Voice` + `ADR-003-VOICE-SYSTEM.md`).
- Violates the vetoes (calendar features, host controls, breakout rooms — see `CONTRIBUTING.md`).
- Platform URL is a login-required service that can't be verified without joining first.

That's it.
