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
  async redirects() {
    return [
      {
        source: '/favicon.ico',
        destination: '/icon.svg',
        permanent: true,
      },
    ]
  },
}

export default nextConfig
