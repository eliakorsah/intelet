import { MetadataRoute } from 'next'
import { supabase } from '@/lib/supabase'
import { COMPANY } from '@/lib/brand'

const BASE = COMPANY.baseUrl

// Regenerate the sitemap at most once an hour (one tiny query per hour),
// so new products appear without a redeploy and the DB isn't hit per crawl.
export const revalidate = 3600

// Fetch all products in pages of 1000 (Supabase's per-query row cap).
async function fetchAllProducts() {
  const PAGE = 1000
  const all: { id: string; brand: string; updated_at: string }[] = []
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from('products')
      .select('id, brand, updated_at')
      .order('created_at', { ascending: false })
      .range(from, from + PAGE - 1)
    if (error || !data || data.length === 0) break
    all.push(...data)
    if (data.length < PAGE) break
  }
  return all
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const static_pages: MetadataRoute.Sitemap = [
    { url: BASE,              lastModified: new Date(), changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/products`,lastModified: new Date(), changeFrequency: 'daily',   priority: 0.9 },
    { url: `${BASE}/about`,   lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
  ]

  // Dynamic product pages — include every product (in & out of stock) so they
  // can all be indexed; availability is conveyed via the Product JSON-LD.
  const products = await fetchAllProducts()

  const product_pages: MetadataRoute.Sitemap = products.map(p => ({
    url: `${BASE}/products/${encodeURIComponent(p.brand)}/${p.id}`,
    lastModified: new Date(p.updated_at),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }))

  return [...static_pages, ...product_pages]
}
