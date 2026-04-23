---
name: Club submission
about: List a new vibeclub on vibeclubs.ai/explore
title: 'club: <your-slug>'
labels: ['club']
---

<!--
The OSS-first way to list a vibeclub. Fill this issue with the details, open
a PR that adds `content/clubs/<your-slug>.md` with the frontmatter below, and
the club-curator agent will review before merge.

Or skip the issue — just open the PR directly. This template is for folks
who'd rather discuss the proposal first.
-->

## Club

**Name (Title Case):**

**Slug (URL-safe):**

**Host handle (with @):**

**Platform:** meet / discord / zoom / in_person / other

**Type:** coding / music / design / study / fitness / writing / other

**Preset:** 25_5 / 50_10 / 90_20 / custom / vibe_coding_sprint / music_jam / dance_break / lightning

**Ambient:** lofi / rain / cafe / nature / space

**Schedule (include timezone):**

**Platform URL (optional, public invite):**

**Location (optional):**

## The vibe — 1–3 paragraphs

<!--
Write like you're texting a friend. Specific beats generic every time.
Voice rules: VISION.md §Voice — the five words.
-->

## Why now

<!-- One sentence. What's happening in your world that makes this the right vibeclub to run now? -->

## How to submit

1. Fork the repo.
2. Copy one of the existing `content/clubs/*.md` files to `content/clubs/<your-slug>.md`.
3. Fill the frontmatter + body from this issue.
4. Run `pnpm audit:clubs && pnpm audit:voice` locally — both must pass.
5. Open a PR titled `club: <your-slug>`. Link back to this issue.

Once the PR merges, your club is live on `https://vibeclubs.ai/explore` within a deploy (usually < 5 minutes).
