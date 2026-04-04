import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/admin/login', '/order'],
      },
    ],
    sitemap: 'https://www.tritechtechnologiesltd.com/sitemap.xml',
    host: 'https://www.tritechtechnologiesltd.com',
  }
}
