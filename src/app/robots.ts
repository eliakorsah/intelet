import { MetadataRoute } from 'next'
import { COMPANY } from '@/lib/brand'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/login', '/order'],
      },
    ],
    sitemap: `${COMPANY.baseUrl}/sitemap.xml`,
    host: COMPANY.baseUrl,
  }
}
