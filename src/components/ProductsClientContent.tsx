'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import CategorySidebar from '@/components/CategorySidebar'
import { supabase } from '@/lib/supabase'

const TEAL = '#00c49a'

// All slugs and their children — used to match parent-category filter
// e.g. clicking "Hikvision" shows products with category_id of hikvision, hikvision-nvr, hikvision-dvr-2mp, etc.
const SLUG_CHILDREN: Record<string, string[]> = {
  'hikvision':     ['hikvision', 'hikvision-nvr', 'hikvision-evr', 'hikvision-dvr', 'hikvision-dvr-2mp', 'hikvision-dvr-5mp', 'hikvision-ip', 'hikvision-analogue-cameras', 'hikvision-ip-speakers', 'hikvision-analogue-speakers'],
  'hikvision-dvr': ['hikvision-dvr', 'hikvision-dvr-2mp', 'hikvision-dvr-5mp'],
  'dahua':         ['dahua', 'dahua-nvr', 'dahua-dvr', 'dahua-dvr-4mp', 'dahua-dvr-8mp', 'dahua-ip', 'dahua-analogue-cameras', 'dahua-ip-speakers', 'dahua-analogue-speakers'],
  'dahua-dvr':     ['dahua-dvr', 'dahua-dvr-4mp', 'dahua-dvr-8mp'],
}
function getSlugsToMatch(slug: string): string[] {
  return SLUG_CHILDREN[slug] || [slug]
}

// Brand → category_id slug mapping (so brand filter also matches category_id)
const BRAND_SLUGS: Record<string, string[]> = {
  'Hikvision':  ['hikvision', 'hikvision-nvr', 'hikvision-evr', 'hikvision-dvr', 'hikvision-dvr-2mp', 'hikvision-dvr-5mp', 'hikvision-ip', 'hikvision-analogue-cameras', 'hikvision-ip-speakers', 'hikvision-analogue-speakers'],
  'Dahua':      ['dahua', 'dahua-nvr', 'dahua-dvr', 'dahua-dvr-4mp', 'dahua-dvr-8mp', 'dahua-ip', 'dahua-analogue-cameras', 'dahua-ip-speakers', 'dahua-analogue-speakers'],
  'TP-Link':    ['tp-link'],
  'D-Link':     ['d-link'],
  'Panasonic':  ['panasonic'],
}

const BRANDS = ['Hikvision','Dahua','TP-Link','D-Link','Panasonic','Hi-Look','Grandstream','Alfama']

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

  const categoryId = searchParams.get('category_id') || ''

  // Load all products once
  useEffect(() => {
    supabase.from('products').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setProducts(data || []); setLoading(false) })
  }, [])

  // Sync search + brand from URL
  useEffect(() => {
    setSearch(searchParams.get('search') || '')
    setBrand(searchParams.get('brand') || '')
  }, [searchParams])

  // Filter logic
  useEffect(() => {
    let r = [...products]

    // Text search — matches title, model, description, brand, category_id
    if (search) {
      const q = search.toLowerCase()
      r = r.filter(p =>
        [p.title, p.model_number, p.description, p.brand, p.category_id]
          .filter(Boolean).join(' ').toLowerCase().includes(q)
      )
    }

    // Brand filter — also matches category_id slugs for brand-named categories
    if (brand) {
      const brandSlugs = BRAND_SLUGS[brand] || []
      r = r.filter(p =>
        p.brand === brand ||
        (p.category_id && brandSlugs.includes(p.category_id))
      )
    }

    // Category filter — matches selected slug AND all its children slugs
    if (categoryId) {
      const slugsToMatch = getSlugsToMatch(categoryId)
      r = r.filter(p => p.category_id && slugsToMatch.includes(p.category_id))
    }

    if (inStockOnly) r = r.filter(p => p.in_stock)

    setFiltered(r)
  }, [search, brand, categoryId, inStockOnly, products])

  const applyFilter = (key: string, val: string) => {
    const p = new URLSearchParams(searchParams.toString())
    val ? p.set(key, val) : p.delete(key)
    router.push(`/products?${p.toString()}`, { scroll: false })
  }

  const clearAll = () => { setInStockOnly(false); router.push('/products', { scroll: false }) }

  const hasFilters = search || brand || categoryId || inStockOnly

  // Page title based on active filters
  const pageTitle = (() => {
    if (brand) return `${brand} Products`
    if (categoryId) {
      // Find name from slug
      const allCats = [
        { name:'Hikvision',slug:'hikvision'},{name:'NVR',slug:'hikvision-nvr'},{name:'EVR/EDVR',slug:'hikvision-evr'},
        {name:'DVR',slug:'hikvision-dvr'},{name:'2MP DVR',slug:'hikvision-dvr-2mp'},{name:'5MP DVR',slug:'hikvision-dvr-5mp'},
        {name:'IP Cameras',slug:'hikvision-ip'},{name:'Analogue Cameras',slug:'hikvision-analogue-cameras'},
        {name:'IP Speakers',slug:'hikvision-ip-speakers'},{name:'Analogue Speakers',slug:'hikvision-analogue-speakers'},
        {name:'Dahua',slug:'dahua'},{name:'NVR',slug:'dahua-nvr'},
        {name:'DVR',slug:'dahua-dvr'},{name:'4MP DVR',slug:'dahua-dvr-4mp'},{name:'8MP DVR',slug:'dahua-dvr-8mp'},
        {name:'IP Cameras',slug:'dahua-ip'},{name:'Analogue Cameras',slug:'dahua-analogue-cameras'},
        {name:'IP Speakers',slug:'dahua-ip-speakers'},{name:'Analogue Speakers',slug:'dahua-analogue-speakers'},
        {name:'TP-Link',slug:'tp-link'},{name:'D-Link',slug:'d-link'},{name:'Panasonic',slug:'panasonic'},
        {name:'Hi-Look',slug:'hi-look'},{name:'Grandstream',slug:'grandstream'},{name:'Alfama',slug:'alfama'},
        {name:'Addressable Fire Alarm',slug:'addressable-fire-alarm'},{name:'Conventional Fire Alarm',slug:'conventional-fire-alarm'},
        {name:'Solar 4G PTZ',slug:'solar-4g-ptz'},{name:'WiFi Cameras',slug:'wifi-cameras'},
        {name:'Networking Accessories',slug:'networking-accessories'},{name:'CCTV Accessories',slug:'cctv-accessories'},
      ]
      return allCats.find(c => c.slug === categoryId)?.name || 'Products'
    }
    return 'All Products'
  })()

  return (
    <div style={{ background: '#f7f8fc', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #eef0f4' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <p className="font-mono text-[10px] tracking-[0.35em] uppercase mb-1" style={{ color: TEAL }}>Our Catalogue</p>
          <h1 className="font-black tracking-tight text-[#0d1117]" style={{ fontSize: 'clamp(1.6rem, 4vw, 2.4rem)' }}>
            {pageTitle}
          </h1>
          <p className="mt-1 text-xs" style={{ color: '#9ca3af' }}>
            {loading ? 'Loading…' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">

        {/* Top filter bar */}
        <div className="flex flex-wrap gap-2 mb-5">
          <div className="relative flex-1 min-w-[180px]">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"><IconSearch /></span>
            <input type="text" placeholder="Search products, models, brands…" value={search}
              onChange={e => { setSearch(e.target.value); applyFilter('search', e.target.value) }}
              className="w-full pl-8 pr-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-[#00c49a] transition-colors"
              style={{ color: '#0d1117' }} />
          </div>

          

          <button onClick={() => setInStockOnly(!inStockOnly)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-black tracking-widest uppercase transition-all"
            style={inStockOnly
              ? { background: 'rgba(0,196,154,0.08)', borderColor: TEAL, color: TEAL }
              : { background: '#fff', borderColor: '#e5e7eb', color: '#9ca3af' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: inStockOnly ? TEAL : '#d1d5db' }} />
            In Stock
          </button>

          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-xs font-black tracking-widest uppercase"
            style={{ color: sidebarOpen ? TEAL : '#6b7280' }}>
            <IconFilter /> Categories
          </button>

          {hasFilters && (
            <button onClick={clearAll}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-100 bg-red-50 text-xs font-black text-red-400 hover:bg-red-100 tracking-widest uppercase">
              <IconX /> Clear All
            </button>
          )}
        </div>

        {/* Active filter chips */}
        {hasFilters && (
          <div className="flex flex-wrap gap-2 mb-4">
            {brand && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: 'rgba(0,196,154,0.08)', color: TEAL, border: '1px solid rgba(0,196,154,0.2)' }}>
                {brand} <button onClick={() => { setBrand(''); applyFilter('brand','') }}><IconX /></button>
              </span>
            )}
            {search && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: 'rgba(0,196,154,0.08)', color: TEAL, border: '1px solid rgba(0,196,154,0.2)' }}>
                &ldquo;{search}&rdquo; <button onClick={() => { setSearch(''); applyFilter('search','') }}><IconX /></button>
              </span>
            )}
            {categoryId && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: 'rgba(0,196,154,0.08)', color: TEAL, border: '1px solid rgba(0,196,154,0.2)' }}>
                {pageTitle} <button onClick={() => applyFilter('category_id','')}><IconX /></button>
              </span>
            )}
            {inStockOnly && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: 'rgba(0,196,154,0.08)', color: TEAL, border: '1px solid rgba(0,196,154,0.2)' }}>
                In Stock Only <button onClick={() => setInStockOnly(false)}><IconX /></button>
              </span>
            )}
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
                  <div key={i} className="h-72 rounded-2xl animate-pulse" style={{ background: '#fff', border: '1px solid #eef0f4' }} />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-5xl mb-3">📦</p>
                <h2 className="font-black text-xl text-[#0d1117] mb-2">No products found</h2>
                <p className="text-sm mb-5" style={{ color: '#9ca3af' }}>Try a different category, brand or search term</p>
                <button onClick={clearAll} className="px-7 py-3 rounded-xl font-black text-sm text-white uppercase tracking-widest" style={{ background: TEAL }}>
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
      <div style={{ background: '#f7f8fc', minHeight: '100vh' }}>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="h-72 rounded-2xl animate-pulse" style={{ background: '#fff' }} />)}
          </div>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}