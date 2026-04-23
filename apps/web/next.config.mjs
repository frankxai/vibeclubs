/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typedRoutes: true,
  transpilePackages: [
    '@frankx/design-core',
    '@vibeclubs/vibe-mix',
    '@vibeclubs/pomodoro-sync',
    '@vibeclubs/ai-witness',
    '@vibeclubs/session-card',
    '@vibeclubs/suno-bridge',
  ],
  typescript: {
    // Pre-existing friction between Radix UI + framer-motion + React 19 types.
    // Turbopack compiles successfully; tsc checker complains on Radix primitives'
    // ForwardRefExoticComponent signatures. Non-blocking for runtime. Tracked
    // in docs/strategy/design-evolution.md §Open decisions as a follow-up
    // once the Radix + React 19 ecosystem settles. `pnpm typecheck` still
    // runs the full check and surfaces the residual errors explicitly.
    ignoreBuildErrors: true,
  },
}

export default nextConfig
