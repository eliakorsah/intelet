import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'

const BASE = 'https://www.tritechtechnologiesltd.com'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const static_pages: MetadataRoute.Sitemap = [
    { url: BASE,              lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/products`,lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/about`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]

  // Dynamic product pages
  const { data: products } = await supabase
    .from('products')
    .select('id, brand, updated_at')
    .eq('in_stock', true)

  const product_pages: MetadataRoute.Sitemap = (products || []).map(p => ({
    url: `${BASE}/products/${encodeURIComponent(p.brand)}/${p.id}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...static_pages, ...product_pages]
}
