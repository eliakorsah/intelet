// src/components/CategorySidebar.tsx
'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'

const TEAL = '#00c49a'

type SubSub = { name: string; slug: string }
type Sub    = { name: string; slug: string; subsubs?: SubSub[] }
type Cat    = { name: string; slug: string; icon: string | null; subs: Sub[] }

const CATEGORIES: Cat[] = [
  { name: 'Hikvision',  slug: 'hikvision',  icon: '/hik.png',
    subs: [
      { name: 'NVR',              slug: 'hikvision-nvr' },
      { name: 'EVR/EDVR',         slug: 'hikvision-evr' },
      { name: 'DVR',              slug: 'hikvision-dvr', subsubs: [{ name: '2MP', slug: 'hikvision-dvr-2mp' }, { name: '5MP', slug: 'hikvision-dvr-5mp' }] },
      { name: 'IP Cameras',       slug: 'hikvision-ip' },
      { name: 'Analogue Cameras', slug: 'hikvision-analogue-cameras' },
      { name: 'IP Speakers',      slug: 'hikvision-ip-speakers' },
      { name: 'Analogue Speakers',slug: 'hikvision-analogue-speakers' },
    ],
  },
  { name: 'Dahua',      slug: 'dahua',      icon: '/dahu.jpg',
    subs: [
      { name: 'NVR',              slug: 'dahua-nvr' },
      { name: 'DVR',              slug: 'dahua-dvr', subsubs: [{ name: '4MP', slug: 'dahua-dvr-4mp' }, { name: '8MP', slug: 'dahua-dvr-8mp' }] },
      { name: 'IP Cameras',       slug: 'dahua-ip' },
      { name: 'Analogue Cameras', slug: 'dahua-analogue-cameras' },
      { name: 'IP Speakers',      slug: 'dahua-ip-speakers' },
      { name: 'Analogue Speakers',slug: 'dahua-analogue-speakers' },
    ],
  },
  { name: 'TP-Link',    slug: 'tp-link',    icon: '/ti.png',   subs: [] },
  { name: 'D-Link',     slug: 'd-link',     icon: '/dlink.png',subs: [] },
  { name: 'Panasonic',  slug: 'panasonic',  icon: '/pana.png', subs: [] },
  { name: 'Hi-Look',    slug: 'hi-look',    icon: '/hilook-seeklogo.png',    subs: [] },
  { name: 'Grandstream',slug: 'grandstream',icon: '/grandstream.png', subs: [] },
  { name: 'Alfama',     slug: 'alfama',     icon: '/LOGO ALFAMA-bsl-rvb.png', subs: [] },
  { name: 'Addressable Fire Alarm',  slug: 'addressable-fire-alarm',  icon: null, subs: [] },
  { name: 'Conventional Fire Alarm', slug: 'conventional-fire-alarm', icon: null, subs: [] },
  { name: 'Solar 4G PTZ Cameras',    slug: 'solar-4g-ptz',            icon: null, subs: [] },
  { name: 'WiFi Cameras',            slug: 'wifi-cameras',            icon: null, subs: [] },
  { name: 'Networking Accessories',  slug: 'networking-accessories',  icon: null, subs: [] },
  { name: 'CCTV Accessories',        slug: 'cctv-accessories',        icon: null, subs: [] },
]

const Placeholder = ({ name }: { name: string }) => (
  <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center',
    fontSize:'7px', fontWeight:900, color:'#9ca3af', textAlign:'center', lineHeight:1.1 }}>
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

// Helper: get all child slugs of a category (for parent-match filtering)
function getDescendantSlugs(cat: Cat): string[] {
  const slugs: string[] = [cat.slug]
  for (const sub of cat.subs) {
    slugs.push(sub.slug)
    for (const ss of sub.subsubs || []) slugs.push(ss.slug)
  }
  return slugs
}

export default function CategorySidebar() {
  const params   = useSearchParams()
  const router   = useRouter()
  const selected = params.get('category_id') || ''
  const [expanded, setExpanded] = useState<string[]>([])

  // Auto-expand tree to show selected item
  useEffect(() => {
    if (!selected) return
    for (const cat of CATEGORIES) {
      if (cat.slug === selected) {
        setExpanded(e => e.includes(cat.slug) ? e : [...e, cat.slug])
        return
      }
      for (const sub of cat.subs) {
        if (sub.slug === selected || sub.subsubs?.some(ss => ss.slug === selected)) {
          setExpanded(e => {
            const next = [...e]
            if (!next.includes(cat.slug)) next.push(cat.slug)
            if (!next.includes(sub.slug)) next.push(sub.slug)
            return next
          })
          return
        }
      }
    }
  }, [selected])

  const navigate = (slug: string) => {
    const p = new URLSearchParams(params.toString())
    selected === slug ? p.delete('category_id') : p.set('category_id', slug)
    router.push(`/products?${p.toString()}`, { scroll: false })
  }

  const toggle = (slug: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setExpanded(prev => prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug])
  }

  const rowStyle = (slug: string, depth: number): React.CSSProperties => ({
    display:'flex', alignItems:'center', gap:'6px',
    padding:`5px ${6 + depth * 12}px`,
    borderRadius:'8px', cursor:'pointer',
    background: selected === slug ? 'rgba(0,196,154,0.1)' : 'transparent',
    color: selected === slug ? TEAL : depth === 0 ? '#1f2937' : '#4b5563',
    fontWeight: depth === 0 ? 700 : 500,
    fontSize: depth === 0 ? '12px' : '11px',
    transition:'all 0.15s', userSelect:'none',
  })

  return (
    <div style={{ background:'#fff', border:'1px solid #eef0f4', borderRadius:'16px', padding:'14px' }}>
      <p style={{ fontSize:'9px', fontWeight:800, letterSpacing:'0.2em', color:'#9ca3af', textTransform:'uppercase', marginBottom:'8px', paddingLeft:'6px' }}>
        Categories
      </p>

      {/* All Products */}
      <div onClick={() => { const p = new URLSearchParams(params.toString()); p.delete('category_id'); router.push(`/products?${p.toString()}`, { scroll:false }) }}
        style={{ ...rowStyle('', 0), color: !selected ? TEAL : '#6b7280', background: !selected ? 'rgba(0,196,154,0.08)' : 'transparent', marginBottom:'4px' }}>
        <span style={{ width:'10px', flexShrink:0 }} />
        All Products
      </div>

      {CATEGORIES.map(cat => (
        <div key={cat.slug}>
          <div style={rowStyle(cat.slug, 0)} onClick={() => navigate(cat.slug)}>
            {/* Logo icon */}
            <div style={{ width:'20px', height:'20px', borderRadius:'5px', border:'1px solid #e5e7eb', background:'#fff', overflow:'hidden', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', padding:'2px' }}>
              {cat.icon
                ? <Image src={cat.icon} alt={cat.name} width={16} height={16} className="object-contain w-full h-full" />
                : <Placeholder name={cat.name} />
              }
            </div>
            <span style={{ flex:1 }}>{cat.name}</span>
            {cat.subs.length > 0 && (
              <button onClick={e => toggle(cat.slug, e)} style={{ background:'none', border:'none', padding:'2px', cursor:'pointer', display:'flex', color:'inherit' }}>
                <IconChev open={expanded.includes(cat.slug)} />
              </button>
            )}
            {selected === cat.slug && <span style={{ width:'5px', height:'5px', borderRadius:'50%', background:TEAL, flexShrink:0 }} />}
          </div>

          {expanded.includes(cat.slug) && cat.subs.map(sub => (
            <div key={sub.slug}>
              <div style={rowStyle(sub.slug, 1)} onClick={() => navigate(sub.slug)}>
                {sub.subsubs && sub.subsubs.length > 0
                  ? <button onClick={e => toggle(sub.slug, e)} style={{ background:'none', border:'none', padding:'1px', cursor:'pointer', display:'flex', color:'inherit' }}>
                      <IconChev open={expanded.includes(sub.slug)} />
                    </button>
                  : <span style={{ width:'10px', flexShrink:0 }} />
                }
                <span style={{ flex:1 }}>{sub.name}</span>
                {selected === sub.slug && <span style={{ width:'5px', height:'5px', borderRadius:'50%', background:TEAL, flexShrink:0 }} />}
              </div>

              {expanded.includes(sub.slug) && sub.subsubs?.map(ss => (
                <div key={ss.slug} style={rowStyle(ss.slug, 2)} onClick={() => navigate(ss.slug)}>
                  <span style={{ width:'10px', flexShrink:0 }} />
                  <span style={{ flex:1 }}>{ss.name}</span>
                  {selected === ss.slug && <span style={{ width:'5px', height:'5px', borderRadius:'50%', background:TEAL, flexShrink:0 }} />}
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}