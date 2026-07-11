# Vibeclubs Product System

## Business model

Open core with a hosted team upgrade.

- Free/open: ritual playbook, timer engine, audio mixer, structured recap prompt builder, SVG recap card.
- Hosted: recurring runs, durable history, private access, admin controls, and optional richer recaps after those paths are proven.
- No affiliate or ad model. No sale of behavioral data.

## Capability truth

| Capability | Current proof | Public posture |
|---|---|---|
| Local timer | `@vibeclubs/pomodoro-sync` | Working in homepage proof |
| Focus/ship choreography | `sequenceForPreset('vibe_coding_sprint')` | Visible in homepage proof |
| Recap card | `@vibeclubs/session-card` | Generated and downloadable locally |
| Live sync | Supabase Realtime package path | Hosted path; requires configuration |
| Optional AI recap | Structured Anthropic API route | Off by default; explicit host consent |
| Music generation | Suno bridge | Optional, configuration dependent |

## Privacy boundary

The homepage proof is browser-only. Hosted AI recap may receive structured event facts, never audio, video, chat, screen pixels, or page content. Consent and deletion language must remain adjacent to the feature.

## Success measures

1. Proof starts per homepage visitor.
2. Proof completion to card download.
3. Proof completion to hosted start.
4. First hosted run with a named ship target.
5. Returning hosts and crews after 7 and 30 days.

The hosted upgrade is earned only when retention and operational reliability justify it.
