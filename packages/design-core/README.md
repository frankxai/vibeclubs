# @frankx/design-core

Shared design tokens, motion primitives, and theme scaffolding across the FrankX ecosystem — `frankx.ai`, `gencreator.ai`, `vibeclubs.ai`, `arcanea.ai`, `dpi`, `starlight-intelligence.ai`, `AnimeLegends.ai`.

CSS-var-first, framework-agnostic, tree-shakeable. Works in Next.js App Router, Vite, Astro, raw HTML, Chrome extensions (the vibeclubs extension consumes it directly).

## What's in it

- `tokens.css` — base tokens every brand site inherits: ink palette, surface scales, typography scale (2xs→9xl), radii, shadows, ease curves.
- `motion.css` — shared keyframes every brand site can animate against: aurora drift, orb pulse, gradient text drift, shimmer border spin, launch-mark orbit, vc-pulse (brand presence).
- `themes/vibeclubs.css` — brand overlay: amber primary, violet depth, signal-green live.
- `themes/frankx.css` — parent brand overlay: conscious-purple, tech-cyan, music-orange, growth-green.
- `index.ts` — typed token export for programmatic access (React, Node, scripts).

## Install

```bash
pnpm add @frankx/design-core
```

## Usage — Next.js

In your global CSS:

```css
@import '@frankx/design-core/tokens.css';
@import '@frankx/design-core/motion.css';
@import '@frankx/design-core/themes/vibeclubs.css';

/* Your site-specific tokens on top */
@theme {
  --color-my-accent: #...;
}
```

In a component:

```tsx
import { tokens } from '@frankx/design-core'

<div style={{ color: tokens.vibe.amber }}>Hi</div>
```

## Usage — raw HTML / extension

```html
<link rel="stylesheet" href="https://unpkg.com/@frankx/design-core/src/tokens.css" />
<link rel="stylesheet" href="https://unpkg.com/@frankx/design-core/src/themes/vibeclubs.css" />
```

Or copy `tokens.css` into the extension bundle at build time.

## Principle

- **CSS vars are the interface.** JS tokens mirror them; they don't drive them.
- **One brand overlay per file** in `themes/`. Brand sites pick one at the top of globals; tokens layer in that order.
- **Motion is opt-in.** Importing `motion.css` adds ~2KB and only keyframes — no `* { animation: ... }` global rules.
- **Don't break the API without a minor version bump.** Adding a var is safe; renaming isn't.
- **Accessibility is in the base, not the overlay.** `prefers-reduced-motion` fallbacks are in `motion.css` core — every brand gets them for free.

## Ownership

Maintained by Frank Riemer (@frankxai). Design changes that affect more than one brand require the corresponding ADR in the consuming brand's repo.
