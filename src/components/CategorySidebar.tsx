// src/components/CategorySidebar.tsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { COLORS, PARTNER_BRANDS, APPLIANCE_CATEGORIES } from '@/lib/brand'

const RED = COLORS.red

type Sub = { name: string; slug: string }
type Cat = { name: string; slug: string; icon: string | null; subs: Sub[] }

// Build categories from brand.ts:
//   - one "group" per partner brand, with the appliance categories as sub-rows
//   - plus a second group for "Shop by Category" (appliance categories on their own)
const BRAND_GROUPS: Cat[] = PARTNER_BRANDS.map(b => ({
  name: b.name,
  slug: b.slug,
  icon: b.logo,
  subs: APPLIANCE_CATEGORIES.map(c => ({
    name: c.name,
    slug: `${b.slug}-${c.slug}`,
  })),
}))

const CATEGORY_GROUP: Cat = {
  name: 'Shop by Category',
  slug: '__categories__',
  icon: null,
  subs: APPLIANCE_CATEGORIES.map(c => ({ name: c.name, slug: c.slug })),
}

const CATEGORIES: Cat[] = [CATEGORY_GROUP, ...BRAND_GROUPS]

const Placeholder = ({ name }: { name: string }) => (
  <div style={{
    width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center',
    fontSize:'7px', fontWeight:900, color: COLORS.inkMuted, textAlign:'center', lineHeight:1.1,
  }}>
    {name.slice(0,4).toUpperCase()}
  </div>
)

const IconChev = ({ open }: { open: boolean }) => (
  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
    strokeLinecap="round" strokeLinejoin="round"
    style={{ transition:'transform 0.2s', transform: open?'rotate(90deg)':'none', flexShrink:0 }}>
    <path d="m9 18 6-6-6-6"/>
  </svg>
)

export default function CategorySidebar() {
  const params   = useSearchParams()
  const router   = useRouter()
  const selected = params.get('category_id') || params.get('category') || ''
  const [expanded, setExpanded] = useState<string[]>(['__categories__'])

  useEffect(() => {
    if (!selected) return
    for (const cat of CATEGORIES) {
      if (cat.slug === selected) {
        setExpanded(e => e.includes(cat.slug) ? e : [...e, cat.slug])
        return
      }
      if (cat.subs.some(s => s.slug === selected)) {
        setExpanded(e => e.includes(cat.slug) ? e : [...e, cat.slug])
        return
      }
    }
  }, [selected])

  const navigate = (slug: string) => {
    if (slug === '__categories__') return
    const p = new URLSearchParams(params.toString())
    p.delete('category')
    if (selected === slug) p.delete('category_id')
    else p.set('category_id', slug)
    router.push(`/products?${p.toString()}`, { scroll: false })
  }

  const toggle = (slug: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpanded(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug])
  }

  const rowStyle = (slug: string, depth: number): React.CSSProperties => ({
    display:'flex', alignItems:'center', gap:'6px',
    padding:`5px ${6 + depth * 12}px`,
    borderRadius:'8px', cursor: slug === '__categories__' ? 'default' : 'pointer',
    background: selected === slug ? COLORS.redSoft : 'transparent',
    color: selected === slug ? RED : depth === 0 ? COLORS.ink : COLORS.inkSoft,
    fontWeight: depth === 0 ? 700 : 500,
    fontSize: depth === 0 ? '12px' : '11px',
    transition:'all 0.15s', userSelect:'none',
  })

  return (
    <div style={{ background: COLORS.white, border: `1px solid ${COLORS.ashLine}`, borderRadius:'16px', padding:'14px' }}>
      <p style={{
        fontSize:'9px', fontWeight:800, letterSpacing:'0.2em',
        color: COLORS.inkMuted, textTransform:'uppercase',
        marginBottom:'8px', paddingLeft:'6px',
      }}>
        Browse
      </p>

      {/* All Products */}
      <div
        onClick={() => {
          const p = new URLSearchParams(params.toString())
          p.delete('category_id'); p.delete('category')
          router.push(`/products?${p.toString()}`, { scroll:false })
        }}
        style={{
          ...rowStyle('', 0),
          cursor: 'pointer',
          color: !selected ? RED : COLORS.inkSoft,
          background: !selected ? COLORS.redSoft : 'transparent',
          marginBottom:'4px',
        }}
      >
        <span style={{ width:'10px', flexShrink:0 }} />
        All Appliances
      </div>

      {CATEGORIES.map(cat => (
        <div key={cat.slug}>
          <div style={rowStyle(cat.slug, 0)} onClick={() => navigate(cat.slug)}>
            {/* Brand icon / placeholder */}
            <div style={{
              width:'20px', height:'20px', borderRadius:'5px',
              border:`1px solid ${COLORS.ashLine}`, background: COLORS.white,
              overflow:'hidden', flexShrink:0,
              display:'flex', alignItems:'center', justifyContent:'center', padding:'2px',
            }}>
              {cat.icon
                ? <Image src={cat.icon} alt={cat.name} width={16} height={16} className="object-contain w-full h-full" />
                : <Placeholder name={cat.name} />
              }
            </div>
            <span style={{ flex:1 }}>{cat.name}</span>
            {cat.subs.length > 0 && (
              <button
                onClick={e => toggle(cat.slug, e)}
                style={{ background:'none', border:'none', padding:'2px', cursor:'pointer', display:'flex', color:'inherit' }}
              >
                <IconChev open={expanded.includes(cat.slug)} />
              </button>
            )}
            {selected === cat.slug && <span style={{ width:'5px', height:'5px', borderRadius:'50%', background: RED, flexShrink:0 }} />}
          </div>

          {expanded.includes(cat.slug) && cat.subs.map(sub => (
            <div key={sub.slug} style={rowStyle(sub.slug, 1)} onClick={() => navigate(sub.slug)}>
              <span style={{ width:'10px', flexShrink:0 }} />
              <span style={{ flex:1 }}>{sub.name}</span>
              {selected === sub.slug && <span style={{ width:'5px', height:'5px', borderRadius:'50%', background: RED, flexShrink:0 }} />}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}
