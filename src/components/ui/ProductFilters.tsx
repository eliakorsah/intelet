'use client'

import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { BRANDS, CATEGORIES } from '@/lib/constants'
import { Filter, X } from 'lucide-react'

interface ProductFiltersProps {
  currentBrand?: string
  currentCategory?: string
  currentInStock?: string
}

export default function ProductFilters({ currentBrand, currentCategory, currentInStock }: ProductFiltersProps) {
  const pathname = usePathname()

  const buildUrl = (updates: Record<string, string | undefined>) => {
    const params = new URLSearchParams()
    if (currentBrand && updates.brand !== undefined ? updates.brand : currentBrand) {
      params.set('brand', (updates.brand !== undefined ? updates.brand : currentBrand)!)
    }
    if (currentCategory && updates.category !== undefined ? updates.category : currentCategory) {
      params.set('category', (updates.category !== undefined ? updates.category : currentCategory)!)
    }
    if (currentInStock && updates.inStock !== undefined ? updates.inStock : currentInStock) {
      params.set('inStock', (updates.inStock !== undefined ? updates.inStock : currentInStock)!)
    }
    Object.entries(updates).forEach(([key, val]) => {
      if (val !== undefined && val !== '') params.set(key, val)
      else params.delete(key)
    })
    const qs = params.toString()
    return `${pathname}?${qs}`
  }

  const hasFilters = currentBrand || currentCategory || currentInStock

  return (
    <div className="space-y-6">
      {/* Filter header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 font-display font-700 text-white">
          <Filter className="w-4 h-4 text-teal-400" />
          FILTERS
        </div>
        {hasFilters && (
          <Link
            href="/products"
            className="flex items-center gap-1 text-xs text-red-400 hover:text-red-300 font-mono"
          >
            <X className="w-3 h-3" />
            Clear
          </Link>
        )}
      </div>

      {/* Brands */}
      <div>
        <div className="font-mono text-[10px] text-teal-500 tracking-widest uppercase mb-3">
          By Brand
        </div>
        <div className="space-y-1">
          <Link
            href="/products"
            className={`block w-full text-left px-3 py-2 text-sm font-body transition-colors ${
              !currentBrand
                ? 'bg-teal-500/10 text-teal-400 border-l-2 border-teal-500'
                : 'text-slate-400 hover:text-teal-400 hover:bg-teal-500/5'
            }`}
          >
            All Brands
          </Link>
          {BRANDS.map((brand) => (
            <Link
              key={brand.slug}
              href={buildUrl({ brand: brand.name, page: undefined })}
              className={`flex items-center gap-2 w-full text-left px-3 py-2 text-sm font-body transition-colors ${
                currentBrand === brand.name
                  ? 'bg-teal-500/10 text-teal-400 border-l-2 border-teal-500'
                  : 'text-slate-400 hover:text-teal-400 hover:bg-teal-500/5'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: brand.color }} />
              {brand.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div>
        <div className="font-mono text-[10px] text-teal-500 tracking-widest uppercase mb-3">
          By Category
        </div>
        <div className="space-y-1">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat}
              href={buildUrl({ category: cat, page: undefined })}
              className={`block w-full text-left px-3 py-2 text-sm font-body transition-colors ${
                currentCategory === cat
                  ? 'bg-teal-500/10 text-teal-400 border-l-2 border-teal-500'
                  : 'text-slate-400 hover:text-teal-400 hover:bg-teal-500/5'
              }`}
            >
              {cat}
            </Link>
          ))}
        </div>
      </div>

      {/* Stock filter */}
      <div>
        <div className="font-mono text-[10px] text-teal-500 tracking-widest uppercase mb-3">
          Availability
        </div>
        <Link
          href={buildUrl({ inStock: currentInStock ? undefined : 'true', page: undefined })}
          className={`flex items-center gap-2 px-3 py-2 text-sm font-body transition-colors ${
            currentInStock
              ? 'bg-teal-500/10 text-teal-400 border border-teal-500/30'
              : 'text-slate-400 hover:text-teal-400 border border-teal-500/10'
          }`}
        >
          <div className={`w-3 h-3 border flex items-center justify-center ${currentInStock ? 'border-teal-400 bg-teal-400/20' : 'border-slate-500'}`}>
            {currentInStock && <div className="w-1.5 h-1.5 bg-teal-400" />}
          </div>
          In Stock Only
        </Link>
      </div>
    </div>
  )
}
