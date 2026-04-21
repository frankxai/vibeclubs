import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from '@/components/ui/toast'
import { TooltipProvider } from '@/components/ui/tooltip'

export const metadata: Metadata = {
  title: {
    default: 'Vibeclubs — Host a vibeclub',
    template: '%s · Vibeclubs',
  },
  description:
    'Claude Code + your crew + a soundtrack. Lock in for 90 minutes, ship the thing, recap lands on your profile. Open source. Works on Meet, Discord, Zoom, anywhere.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vibeclubs.ai'),
  keywords: [
    'co-working',
    'pomodoro',
    'vibeclub',
    'body doubling',
    'focus',
    'claude code',
    'open source',
    'discord',
    'google meet',
    'webaudio mixer',
  ],
  authors: [{ name: 'Frank Riemer', url: 'https://frankx.ai' }],
  creator: 'Frank Riemer',
  openGraph: {
    title: 'Vibeclubs — Host a vibeclub',
    description:
      'Claude Code + your crew + a soundtrack. Lock in, ship, recap lands on your profile. Open source.',
    url: 'https://vibeclubs.ai',
    siteName: 'Vibeclubs',
    type: 'website',
    images: ['/api/og'],
  },
  twitter: {
    card: 'summary_large_image',
    creator: '@vibeclubsai',
    images: ['/api/og'],
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0a0a0f] text-white antialiased">
        <TooltipProvider delayDuration={200} skipDelayDuration={300}>
          {children}
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  )
}
