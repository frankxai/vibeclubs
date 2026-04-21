/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true,
  },
  transpilePackages: [
    '@vibeclubs/vibe-mix',
    '@vibeclubs/pomodoro-sync',
    '@vibeclubs/ai-witness',
    '@vibeclubs/session-card',
    '@vibeclubs/suno-bridge',
  ],
}

export default nextConfig
