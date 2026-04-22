# Design evolution

*Motion, depth, 3D, and component-registry strategy for vibeclubs.ai. Written 2026-04-22. Works with `FrankX/DESIGN_SYSTEM.md` (liquid-glass foundation) and proposes the vibeclubs-specific evolution.*

---

## Current state

The `apps/web/` design system already ships:

- **Ink palette** — `--color-ink-950 … -500`, `--color-cream-50 … -200`
- **Three brand accents** — amber (signal presence), violet (depth), signal-green (live/active)
- **Surface tokens** — `--color-surface-1 … -4` as layered rgba whites for glassmorphic depth
- **Aurora + grain primitives** — `vc-aurora` radial gradients + `vc-grain` SVG noise overlay
- **Typographic scale** — 2xs (11) through 9xl (120), Cal Sans / Inter / JetBrains Mono
- **16 UI primitives** in `components/ui/` — Button (cva), Card, Badge, Kbd, Avatar, Fader, TimerDisplay, etc.
- **11 patterns** — FeatureCard, StatBlock, TierCard, EmptyState, SessionCardPreview, AuroraBg, etc.
- **Motion ready** — `framer-motion ^11.5.0` already installed, not yet applied
- **Ease tokens** — `--ease-out-quint`, `--ease-in-out-cubic`, `--ease-spring`

What's missing (the gap this doc closes): **no animations are actually applied**. The aurora is static. Sections enter at full opacity. The timer is a number, not a live pulse. The session card is stationary. There is no signature 3D element. The landing page reads strong but doesn't *feel* alive the way `VISION.md §Philosophy Rule 2` demands ("Does this make the room feel more alive? If no, it doesn't ship").

This doc is the bridge from *strong* to *alive*.

---

## Design posture

**Opinionated minimalism with one signature moment per page.** Not a 3D-everywhere site (performance suicide, off-brand for a dev tool). Not a static Vercel clone either. One moment per page that makes the viewer feel "this is alive" — the rest is quiet, legible, fast.

Three discipline rules:

1. **Motion is a first-class token**, not decoration. Each motion has a reason: enter (welcome), accent (celebrate a cycle), feedback (confirm an action). If it doesn't fit a reason, cut it.
2. **Respect `prefers-reduced-motion`**. Every animation degrades to a no-op. Non-negotiable.
3. **Mobile first-fold stays CPU-cheap.** No three.js on the first fold of mobile. No parallax on mobile. Signature moments can be heavier on desktop.

## Relationship to FrankX design system

`FrankX/DESIGN_SYSTEM.md` is the *parent brand's* system: conscious-purple, tech-cyan, music-orange, growth-green — glassmorphic, WCAG AAA, 8px grid. Vibeclubs **inherits the glassmorphic vocabulary** (frosted surfaces, layered depth, aurora tint) and **diverges on palette and voice**:

| FrankX DS | Vibeclubs DS | Reason |
|---|---|---|
| conscious-purple primary | amber primary | Vibeclubs reads as "focus / presence / a warm desk lamp at 11 PM," not "consciousness." |
| tech-cyan secondary | violet secondary | Night-coded. The room after sunset. |
| growth-green | signal-green | Same family, role-coded: "live / now / on." |
| WCAG AAA baseline | WCAG AAA baseline | Inherited. No exceptions. |
| 8px grid | 4pt baseline (matches typographic scale) | Intentional divergence; vibeclubs' typographic rhythm is tighter. |

If these drift far enough to need a shared kernel, extract a `@frankx/design-core` package with the shared tokens (spacing, typography, glass recipes) and let vibeclubs / gencreator / frankx.ai each ship their own brand overlay. **Not now** — extract when the third consumer lands, not before.

---

## 21st.dev — what it is, what we use

**21st.dev** (also surfaced as "magicui-like" patterns) is a registry of animated shadcn-compatible React components: aurora backgrounds, beam effects, shimmer borders, animated gradients, number tickers, marquees, dock animations, sparkles, word-rotate, text-reveal. It pairs with an MCP server that lets an agent install a component into a project directly.

**Use for vibeclubs:**

| Pattern | Where | Install path |
|---|---|---|
| Animated gradient text | Hero H1 "Host a vibeclub" signature | In-house (custom, to match voice) |
| Aurora background (animated) | Hero + section breaks | Evolve `AuroraBg` in place |
| Number ticker | Stats block (cycles, minutes) | In-house (small; don't import) |
| Text reveal on scroll | Section headings | In-house via framer-motion `useInView` |
| Shimmer border | Primary CTA on hover | In-house via Tailwind + CSS |
| Dock effect | N/A | Skip (not on-brand) |
| Sparkles | Session card celebration | Consider for Phase 2 |

**Don't use the whole registry.** We inherit the *patterns*, not the stylesheets. Each pattern we adopt gets implemented in-house with our tokens so voice stays tight and bundle stays small. The MCP workflow is useful for *discovery* only.

---

## 3D strategy

The user asked: what 3D objects can we create vs. import? Answer in three tiers:

### Tier 0 — zero-dependency 3D-feel (ship this first)

Pure CSS + SVG illusions of depth. No `three`, no `@react-three/fiber`, no bundle impact.

- **SparkOrb** — CSS radial-gradient sphere with backdrop-filter blur, pulsing. Sits behind hero typography. Ships this commit. ~2KB CSS.
- **GlassCard depth** — `backdrop-filter: blur(20px) saturate(180%)` + layered shadow + 1px inner-stroke. Already present in SessionCardPreview pattern; extract to a reusable `<Glass>` primitive.
- **Parallax cursor halo** — pointer-tracked radial gradient in hero. Disabled on touch + reduced-motion. ~30 lines.
- **Conic gradient CTA** — animated conic gradient border on the primary button. Shimmer effect, no JS motion lib needed for this one.

### Tier 1 — React Three Fiber, one signature element per key page

Adds `three`, `@react-three/fiber`, `@react-three/drei`. ~80KB gzipped. Lazy-loaded below the fold so first paint is unaffected.

- **VibeOrb** — a low-poly shader sphere reacting to the three mixer faders (ambient / music / voice). Uses a fragment shader that takes three uniforms and paints a chromatic gradient. Lives on `/extension` landing as a signature hero. Doubles as the extension's actual hero visual when presented in the Chrome Web Store listing.
- **TimerRing** — a 3D torus visualization of the pomodoro cycle. Phase-colored (amber idle / signal-green focus / violet break). Lives on the `/start` wizard confirmation step. Maybe also on `/club/[slug]` when a club is live.
- **SessionCardFlip** — a 3D-flip reveal when a session card first renders on `/u/[handle]`. Two-sided: front = stats, back = recap. Uses drei's `PresentationControls` for optional drag-to-rotate on desktop.

### Tier 2 — Spline / Lottie / GLB imports (Phase 3)

For moments that need an artist touch beyond what shader code can produce.

- **Hero illustration on `/developers`** — optional Spline scene of interconnected nodes (the 5 OSS packages). 3D-soft, subtle rotation.
- **Launch-week animated mark** — Lottie microvideo of the amber→violet orbit mark assembling. Used in launch posts, OG dynamic renders, email header.
- **Custom GLB vibeclub "signet"** — a 3D monogram for premium / Pro tier badges. Maybe. Evaluate at $1k MRR, not before.

**Tier decision for this session:** ship Tier 0 now. Plan Tier 1 as a distinct sprint post-launch. Defer Tier 2 entirely.

---

## Motion system — concrete primitives

Add one folder: `apps/web/components/motion/`.

| Component | Purpose | Dependencies |
|---|---|---|
| `<Reveal>` | Fade-and-rise on first scroll into viewport. Variants: `up`, `down`, `left`, `right`, `scale`, `fade`. Respects reduced-motion. | framer-motion |
| `<Stagger>` | Orchestrates a stagger on children `<Reveal>`s. Used for feature grids, template grids. | framer-motion |
| `<Counter>` | Animated number counter. Used for minutes / cycles / install counts. RAF-based. | framer-motion `useInView` |
| `<GradientText>` | Animated conic-gradient text. Used for hero H1 signature line. Pure CSS with `background-clip: text`. | none |
| `<ShimmerBorder>` | Animated conic-gradient border on interactive elements (primary CTA). Pure CSS. | none |
| `<SparkOrb>` | CSS 3D-feel orb for hero and section breaks. Lives in `patterns/` since it's composed. | none |

Total added bundle (gzipped): ~4KB on top of framer-motion which was already bundled. No three.js this pass.

## Landing page — what the upgrade does

Concrete section-by-section motion plan (applied in the companion commit):

1. **Hero** — staggered entrance: badge → H1 (gradient-text, slow conic) → subhead → CTAs → footnote. Session card slides in from right with 200ms delay + subtle 3° wobble settle (spring). `SparkOrb` sits behind the H1 at 40% opacity, drifts slowly on a 40s loop.
2. **Aurora** — promote `vc-aurora` to animate: three radial blobs each drifting independently on 30–45s keyframes. Already a primitive in globals.css; only the animation is new.
3. **Thesis section** — on-scroll fade-up, no stagger (it's one paragraph block).
4. **How it works (3 FeatureCards)** — Stagger with 80ms increments. Hover: subtle lift + amber border glow.
5. **Live mixer preview** — faders animate in sequence from left on reveal. Each fader's fill grows from 0 to default value over 600ms.
6. **Recap + Templates + Three Surfaces** — on-scroll fade-up, no heavy orchestration.
7. **Pricing** — TierCard featured card gets a subtle conic shimmer border. The "Free" card stays quiet (anti-pattern: don't out-animate the featured tier).
8. **Final CTA** — headline reveal on scroll; primary button gets ShimmerBorder on hover + a 1px amber glow.

## Performance budget

For vibeclubs.ai landing page (measured at `/`):

| Metric | Target | Enforcement |
|---|---|---|
| LCP (mobile, 4G) | < 2.0s | Lighthouse CI on PR (Phase 2 — not wired yet) |
| CLS | < 0.05 | Reserve space for all motion-revealed elements |
| JS main-bundle (gzipped) | < 200KB | `next build` output in CI |
| Main-thread time for animation | < 16ms per frame | Respect `will-change` sparingly; transform/opacity only |
| Reduced-motion path | Instant to final state | `useReducedMotion()` honored by every motion component |

If any target is missed, the signature moment on that page is Tier-1 and must be lazy-loaded below the fold.

---

## Roadmap

| Phase | Scope | Ship date |
|---|---|---|
| **Phase 1 (this commit)** | Tier 0 3D-feel. Motion system. Animated hero + scroll reveals. Aurora drift. | 2026-04-22 |
| **Phase 2** | VibeOrb (Tier 1) on `/extension`. TimerRing on `/start`. Lazy-loaded R3F. Lighthouse CI wired. | Before May 14 ship |
| **Phase 3** | SessionCardFlip on `/u/[handle]`. Spline scene on `/developers`. Launch-week Lottie mark. | Post-launch |
| **Phase 4 (optional)** | Extract `@frankx/design-core` package shared across vibeclubs / gencreator / frankx.ai / arcanea. Only if three consumers need shared tokens. | When it hurts, not before |

## References this doc reconciles with

- `VISION.md` §Design + §Voice (local)
- `FrankX/DESIGN_SYSTEM.md` (v1.0, 2026-01-14) — parent brand's system
- `FrankX/BRAND_IDENTITY.md` — parent brand's identity baseline
- `gencreator.ai/strategy_v3.md` §Engine 1 — why visual evidence matters ("the proof is artefacts members ship")
- `docs/strategy/ecosystem-role.md` — how vibeclubs surfaces render cohort artefacts

## Open decisions

1. **Cal Sans licensing.** Token references `Cal Sans` as the display font. If not licensed for commercial use, fall back to Inter display or switch to Geist. Worth checking before Pro tier launches.
2. **Lazy-load threshold for Tier-1 3D.** Fire when element enters a 500px prefetch zone? Or on user interaction only? Proposal: prefetch zone on desktop, interaction-only on mobile.
3. **Spline vs in-house shader for `/developers` hero.** Spline ships faster but adds a ~200KB runtime. In-house shader ships slower but is ~10KB. Proposal: in-house. Flagged.
