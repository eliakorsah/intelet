'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import ProductCard from '@/components/ProductCard'
import { supabase } from '@/lib/supabase'

const TEAL = '#00c49a'
const BRANDS = ['Hikvision', 'Dahua', 'TP-Link', 'Tenda', 'JDVISION', 'CISCO', 'D-Link', 'Panasonic']
const CATEGORIES = ['CCTV', 'Access Control', 'Networking', 'Fire Alarm', 'IT Equipment']

const IconSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
)
const IconX = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 6 6 18M6 6l12 12"/>
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
  const [category,    setCategory]    = useState(searchParams.get('category') || '')
  const [inStockOnly, setInStockOnly] = useState(false)

  // Load all products once
  useEffect(() => {
    async function load() {
      setLoading(true)
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })
      setProducts(data || [])
      setLoading(false)
    }
    load()
  }, [])

  // Sync filters from URL params whenever they change
  useEffect(() => {
    setSearch(searchParams.get('search') || '')
    setBrand(searchParams.get('brand') || '')
    setCategory(searchParams.get('category') || '')
  }, [searchParams])

  // Apply filters
  useEffect(() => {
    let result = [...products]
    if (search)      result = result.filter(p =>
      `${p.title} ${p.model_number} ${p.description || ''}`.toLowerCase().includes(search.toLowerCase()))
    if (brand)       result = result.filter(p => p.brand === brand)
    if (category)    result = result.filter(p => p.category === category)
    if (inStockOnly) result = result.filter(p => p.in_stock)
    setFiltered(result)
  }, [search, brand, category, inStockOnly, products])

  // Update URL when filters change
  const applyFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (value) params.set(key, value)
    else params.delete(key)
    router.push(`/products?${params.toString()}`, { scroll: false })
  }

  const clearAll = () => {
    setInStockOnly(false)
    router.push('/products', { scroll: false })
  }

  const hasFilters = search || brand || category || inStockOnly

  return (
    <div style={{ background: '#f7f8fc', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ background: '#fff', borderBottom: '1px solid #eef0f4' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <p className="font-mono text-[10px] tracking-[0.35em] uppercase mb-2" style={{ color: TEAL }}>Our Catalogue</p>
          <h1 className="font-black tracking-tight text-[#0d1117]" style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)' }}>
            {brand ? `${brand} Products` : 'All Products'}
          </h1>
          <p className="mt-1.5 text-sm" style={{ color: '#9ca3af' }}>
            {loading ? 'Loading…' : `${filtered.length} product${filtered.length !== 1 ? 's' : ''} found`}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-7">

        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row gap-2.5 mb-5 flex-wrap">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none"><IconSearch /></span>
            <input type="text" placeholder="Search products, models…"
              value={search}
              onChange={e => { setSearch(e.target.value); applyFilter('search', e.target.value) }}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-[#00c49a] transition-colors"
              style={{ color: '#0d1117' }} />
          </div>

          {/* Brand filter */}
          <select value={brand}
            onChange={e => { setBrand(e.target.value); applyFilter('brand', e.target.value) }}
            className="px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-[#00c49a] transition-colors cursor-pointer"
            style={{ color: brand ? '#0d1117' : '#9ca3af' }}>
            <option value="">All Brands</option>
            {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
          </select>

          {/* Category filter */}
          <select value={category}
            onChange={e => { setCategory(e.target.value); applyFilter('category', e.target.value) }}
            className="px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:border-[#00c49a] transition-colors cursor-pointer"
            style={{ color: category ? '#0d1117' : '#9ca3af' }}>
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          {/* In stock */}
          <button onClick={() => setInStockOnly(!inStockOnly)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border text-xs font-black tracking-widest uppercase transition-all"
            style={inStockOnly
              ? { background: 'rgba(0,196,154,0.08)', borderColor: TEAL, color: TEAL }
              : { background: '#fff', borderColor: '#e5e7eb', color: '#9ca3af' }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: inStockOnly ? TEAL : '#d1d5db' }} />
            In Stock
          </button>

          {hasFilters && (
            <button onClick={clearAll}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-red-100 bg-red-50 text-xs font-black text-red-400 hover:bg-red-100 transition-colors tracking-widest uppercase">
              <IconX /> Clear
            </button>
          )}
        </div>

        {/* Active chips */}
        {hasFilters && (
          <div className="flex flex-wrap gap-2 mb-5">
            {brand && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: 'rgba(0,196,154,0.08)', color: TEAL, border: '1px solid rgba(0,196,154,0.2)' }}>
                {brand}
                <button onClick={() => { setBrand(''); applyFilter('brand', '') }}><IconX /></button>
              </span>
            )}
            {category && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: 'rgba(0,196,154,0.08)', color: TEAL, border: '1px solid rgba(0,196,154,0.2)' }}>
                {category}
                <button onClick={() => { setCategory(''); applyFilter('category', '') }}><IconX /></button>
              </span>
            )}
            {search && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: 'rgba(0,196,154,0.08)', color: TEAL, border: '1px solid rgba(0,196,154,0.2)' }}>
                &ldquo;{search}&rdquo;
                <button onClick={() => { setSearch(''); applyFilter('search', '') }}><IconX /></button>
              </span>
            )}
            {inStockOnly && (
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold"
                style={{ background: 'rgba(0,196,154,0.08)', color: TEAL, border: '1px solid rgba(0,196,154,0.2)' }}>
                In Stock Only
                <button onClick={() => setInStockOnly(false)}><IconX /></button>
              </span>
            )}
          </div>
        )}

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 rounded-2xl animate-pulse" style={{ background: '#fff', border: '1px solid #eef0f4' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-5xl mb-4">📦</p>
            <h2 className="font-black text-xl text-[#0d1117] mb-2">No products found</h2>
            <p className="text-sm mb-6" style={{ color: '#9ca3af' }}>Try adjusting your search or filters</p>
            <button onClick={clearAll}
              className="px-7 py-3 rounded-xl font-black text-sm text-white uppercase tracking-widest"
              style={{ background: TEAL }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// useSearchParams requires Suspense boundary
export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div style={{ background: '#f7f8fc', minHeight: '100vh' }}>
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-80 rounded-2xl animate-pulse" style={{ background: '#fff' }} />
            ))}
          </div>
        </div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}