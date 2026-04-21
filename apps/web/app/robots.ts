import type { MetadataRoute } from 'next'

const SITE = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://vibeclubs.ai'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/auth/', '/signin'],
      },
    ],
    sitemap: `${SITE}/sitemap.xml`,
    host: SITE,
  }
}
