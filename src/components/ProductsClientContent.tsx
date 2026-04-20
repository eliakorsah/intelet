'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import CategorySidebar from '@/components/CategorySidebar'
import { supabase } from '@/lib/supabase'
import { COLORS, PARTNER_BRANDS, APPLIANCE_CATEGORIES } from '@/lib/brand'

const RED = COLORS.red

// Build brand → category_id slug map.
// Each partner brand matches its own slug plus brand-category combos
// (e.g. "samsung-refrigerators", "samsung-washing-machines", …)
const BRAND_SLUGS: Record<string, string[]> = Object.fromEntries(
  PARTNER_BRANDS.map(b => [
    b.name,
    [b.slug, ...APPLIANCE_CATEGORIES.map(c => `${b.slug}-${c.slug}`)],
  ])
)

// Category slug → children (brand-specific variants + itself)
function getSlugsToMatch(slug: string): string[] {
  // Match appliance category across all brands
  const cat = APPLIANCE_CATEGORIES.find(c => c.slug === slug)
  if (cat) return [cat.slug, ...PARTNER_BRANDS.map(b => `${b.slug}-${cat.slug}`)]

  // Match partner brand across all categories
  const brand = PARTNER_BRANDS.find(b => b.slug === slug)
  if (brand) return BRAND_SLUGS[brand.name]

  return [slug]
}

const IconSearch = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
)
const IconX = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12"/>
  </svg>
)
const IconFilter = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>
  </svg>
)

function ProductsContent() {
  const searchParams = useSearchParams()
  const router       = useRouter()

  const [products,    setProducts]    = useState<any[]>([])
  const [filtered,    setFiltered]    = useState<any[]>([])
  const [loading,     setLoading]     = useState(true)
  const [search,      setSearch]      = useState(searchParams.get('search') || '')
  const [brand,       setBrand]       = useState(searchParams.get('brand') || '')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const categoryId = searchParams.get('category_id') || searchParams.get('category') || ''

  useEffect(() => {
    supabase.from('products').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setProducts(data || []); setLoading(false) })
  }, [])

  useEffect(() => {
    setSearch(searchParams.get('search') || '')
    setBrand(searchParams.get('brand') || '')
  }, [searchParams])

  useEffect(() => {
    let r = [...products]

    if (search) {
      const q = search.toLowerCase()
      r = r.filter(p =>
        [p.title, p.model_number, p.description, p.brand, p.category_id]
          .filter(Boolean).join(' ').toLowerCase().includes(q)
      )
    }

    if (brand) {
      const brandSlugs = BRAND_SLUGS[brand] || []
      r = r.filter(p =>
        p.brand === brand ||
        (p.category_id && brandSlugs.includes(p.category_id))
      )
    }

    if (categoryId) {
      const slugsToMatch = getSlugsToMatch(categoryId)
      r = r.filter(p => p.category_id && slugsToMatch.includes(p.category_id))
    }

    if (inStockOnly) r = r.filter(p => p.in_stock)

    setFiltered(r)
  }, [search, brand, categoryId, inStockOnly, products])

  const applyFilter = (key: string, val: string) => {
    const p = new URLSearchParams(searchParams.toString())
    if (val) p.set(key, val); else p.delete(key)
    router.push(`/products?${p.toString()}`, { scroll: false })
  }

  const clearAll = () => { setInStockOnly(false); router.push('/products', { scroll: false }) }

  const hasFilters = search || brand || categoryId || inStockOnly

  const pageTitle = (() => {
    if (brand) return `${brand} Appliances`
    if (categoryId) {
      const cat = APPLIANCE_CATEGORIES.find(c => c.slug === categoryId)
      if (cat) return cat.name
      const b = PARTNER_BRANDS.find(b => b.slug === categoryId)
      if (b) return `${b.name} Appliances`
      return 'Appliances'
    }
    return 'All Appliances'
  })()

  return (
    <div style={{ background: COLORS.ash, minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: COLORS.white, borderBottom: `1px solid ${COLORS.ashLine}` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <p className="font-mono text-[10px] tracking-[0.35em] uppercase mb-1" style={{ color: RED }}>
            Our Catalogue
          </p>
          <h1 className="font-black tracking-tight" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', color: COLORS.ink }}>
            {pageTitle}
          </h1>
          <p className="mt-1 text-xs" style={{ color: COLORS.inkMuted }}>
            {loading ? 'Loading…' : `${filtered.length} item${filtered.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* Top filter bar */}
        <div className="flex flex-wrap gap-2 mb-5">
          <div className="relative flex-1 min-w-[180px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: COLORS.inkMuted }}>
              <IconSearch />
            </span>
            <input
              type="text"
              placeholder="Search fridges, washers, ACs…"
              value={search}
              onChange={e => { setSearch(e.target.value); applyFilter('search', e.target.value) }}
              className="w-full pl-8 pr-3 py-2.5 rounded-xl bg-white text-sm outline-none transition-colors"
              style={{ border: `1px solid ${COLORS.ashLine}`, color: COLORS.ink }}
              onFocus={e => { e.currentTarget.style.borderColor = RED }}
              onBlur={e => { e.currentTarget.style.borderColor = COLORS.ashLine }}
            />
          </div>

          <button
            onClick={() => setInStockOnly(!inStockOnly)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black tracking-widest uppercase transition-all"
            style={inStockOnly
              ? { background: COLORS.redSoft, border: `1px solid ${RED}`, color: RED }
              : { background: COLORS.white, border: `1px solid ${COLORS.ashLine}`, color: COLORS.inkMuted }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: inStockOnly ? RED : COLORS.ashLine }} />
            In Stock
          </button>

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black tracking-widest uppercase"
            style={{
              background: COLORS.white,
              border: `1px solid ${COLORS.ashLine}`,
              color: sidebarOpen ? RED : COLORS.inkSoft,
            }}
          >
            <IconFilter /> Categories
          </button>

          {hasFilters && (
            <button
              onClick={clearAll}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black tracking-widest uppercase"
              style={{ background: COLORS.redSoft, border: `1px solid ${RED}`, color: RED }}
            >
              <IconX /> Clear All
            </button>
          )}
        </div>

        {/* Active filter chips */}
        {hasFilters && (
          <div className="flex flex-wrap gap-2 mb-4">
            {[
              brand && { label: brand,                key: 'brand',       onClear: () => { setBrand(''); applyFilter('brand','') } },
              search && { label: `"${search}"`,       key: 'search',      onClear: () => { setSearch(''); applyFilter('search','') } },
              categoryId && { label: pageTitle,       key: 'category',    onClear: () => { applyFilter('category_id',''); applyFilter('category','') } },
              inStockOnly && { label: 'In Stock Only', key: 'stock',      onClear: () => setInStockOnly(false) },
            ].filter(Boolean).map((chip: any) => (
              <span
                key={chip.key}
                className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: COLORS.redSoft, color: RED, border: `1px solid ${RED}` }}
              >
                {chip.label} <button onClick={chip.onClear}><IconX /></button>
              </span>
            ))}
          </div>
        )}

        {/* Sidebar + grid */}
        <div className="flex gap-6 items-start">
          <div className={`flex-shrink-0 w-52 ${sidebarOpen ? 'block' : 'hidden'} lg:block`}>
            <Suspense fallback={null}>
              <CategorySidebar />
            </Suspense>
          </div>

          <div className="flex-1 min-w-0">
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-72 rounded-2xl animate-pulse"
                    style={{ background: COLORS.white, border: `1px solid ${COLORS.ashLine}` }} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-5xl mb-3">📦</p>
                <h2 className="font-black text-xl mb-2" style={{ color: COLORS.ink }}>No products found</h2>
                <p className="text-sm mb-5" style={{ color: COLORS.inkMuted }}>
                  Try a different category, brand or search term
                </p>
                <button
                  onClick={clearAll}
                  className="px-7 py-3 rounded-xl font-black text-sm text-white uppercase tracking-widest"
                  style={{ background: RED }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filtered.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductsClientContent() {
  return (
    <Suspense fallback={
      <div style={{ background: COLORS.ash, minHeight: '100vh' }}>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-72 rounded-2xl animate-pulse"
                style={{ background: COLORS.white, border: `1px solid ${COLORS.ashLine}` }} />
            ))}
          </div>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}
