// src/components/Navbar.tsx
'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { COMPANY, COLORS, PARTNER_BRANDS, APPLIANCE_CATEGORIES, whatsappLink } from '@/lib/brand'

const RED = COLORS.red

// ── Icons ────────────────────────────────────────────────────
const IconSearch = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
  </svg>
)
const IconMenu = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="6" x2="20" y2="6"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
  </svg>
)
const IconX = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)
const IconChevronDown = ({ open }: { open: boolean }) => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ transition: 'transform 0.25s', transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
    <path d="m6 9 6 6 6-6"/>
  </svg>
)
const IconChevronRight = ({ open }: { open: boolean }) => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
    style={{ transition: 'transform 0.2s', transform: open ? 'rotate(90deg)' : 'rotate(0deg)', flexShrink: 0 }}>
    <path d="m9 18 6-6-6-6"/>
  </svg>
)
const IconArrow = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
)
const IconPhone = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13.1a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.42 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
)
const IconWhatsApp = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
)

// ── Category tree ────────────────────────────────────────────
type Sub = { name: string; slug: string }
type Cat = { name: string; slug: string; icon: string | null; subs: Sub[] }

const CATEGORIES: Cat[] = [
  // Partner brands first
  ...PARTNER_BRANDS.map<Cat>(b => ({
    name: b.name, slug: b.slug, icon: b.logo,
    subs: [
      { name: 'Refrigerators',    slug: `${b.slug}-refrigerators` },
      { name: 'Chest Freezers',   slug: `${b.slug}-chest-freezers` },
      { name: 'Washing Machines', slug: `${b.slug}-washing-machines` },
      { name: 'Air Conditioners', slug: `${b.slug}-air-conditioners` },
      { name: 'Televisions',      slug: `${b.slug}-televisions` },
    ],
  })),
  // Category-level entries
  ...APPLIANCE_CATEGORIES.map<Cat>(c => ({
    name: c.name, slug: c.slug, icon: null, subs: [],
  })),
]

const Placeholder = ({ name }: { name: string }) => (
  <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: '7px', fontWeight: 900, color: '#9ca3af', textAlign: 'center', lineHeight: 1.1, padding: '2px' }}>
    {name.slice(0, 4).toUpperCase()}
  </div>
)

const NAV_LINKS = [
  { label: 'HOME',     href: '/' },
  { label: 'PRODUCTS', href: '/products' },
  { label: 'ABOUT',    href: '/about' },
  { label: 'CONTACT',  href: '/contact' },
]

export default function Navbar() {
  const [mounted,      setMounted]      = useState(false)
  const [scrolled,     setScrolled]     = useState(false)
  const [visible,      setVisible]      = useState(true)
  const [megaOpen,     setMegaOpen]     = useState(false)
  const [hoveredCat,   setHoveredCat]   = useState<string | null>(null)
  const [mobileOpen,   setMobileOpen]   = useState(false)
  const [mobileCats,   setMobileCats]   = useState(false)
  const [expandedCat,  setExpandedCat]  = useState<string | null>(null)
  const [searchOpen,   setSearchOpen]   = useState(false)
  const [searchQuery,  setSearchQuery]  = useState('')
  const pathname = usePathname()
  const lastY    = useRef(0)
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    const fn = () => {
      const y = window.scrollY
      setScrolled(y > 10)
      if (y > 120) setVisible(y < lastY.current)
      else setVisible(true)
      lastY.current = y
    }
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => { setMobileOpen(false); setMegaOpen(false) }, [pathname])

  const openMega  = () => { if (closeTimer.current) clearTimeout(closeTimer.current); setMegaOpen(true) }
  const closeMega = () => { closeTimer.current = setTimeout(() => { setMegaOpen(false); setHoveredCat(null) }, 120) }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/products?search=${encodeURIComponent(searchQuery)}`
      setSearchOpen(false); setSearchQuery('')
    }
  }

  const hovCat = CATEGORIES.find(c => c.slug === hoveredCat)

  return (
    <>
      <style>{`
        @keyframes navSlideDown { from{opacity:0;transform:translateY(-100%)} to{opacity:1;transform:translateY(0)} }
        @keyframes megaDrop     { from{opacity:0;transform:translateY(-8px)}  to{opacity:1;transform:translateY(0)} }
        @keyframes mobileSlide  { from{opacity:0;transform:translateY(-6px)}  to{opacity:1;transform:translateY(0)} }
        .nav-animate   { animation: navSlideDown 0.45s cubic-bezier(0.16,1,0.3,1) forwards; }
        .mega-animate  { animation: megaDrop 0.18s cubic-bezier(0.16,1,0.3,1) forwards; }
        .mobile-animate{ animation: mobileSlide 0.18s ease forwards; }
        .cat-row:hover { background: rgba(200,16,46,0.05); }
      `}</style>

      {/* ── Top bar: contacts + Grand Opening badge ─────────── */}
      <div className="hidden md:block bg-[#1a1a1a] text-white/80 border-b border-black/20">
        <div className="max-w-7xl mx-auto px-6 py-1.5 flex justify-between items-center">
          <div className="flex items-center gap-5">
            {[
              { href: `tel:${COMPANY.phones.primary}`,   label: COMPANY.phones.primaryFmt },
              { href: `tel:${COMPANY.phones.secondary}`, label: COMPANY.phones.secondaryFmt },
              { href: `mailto:${COMPANY.email}`,         label: COMPANY.email },
            ].map(({ href, label }) => (
              <a key={href} href={href} className="flex items-center gap-1.5 text-xs font-mono text-white/60 hover:text-white transition-colors">
                <span style={{ color: RED, display: 'flex' }}><IconPhone /></span>{label}
              </a>
            ))}
          </div>
          <span className="font-mono text-[10px] tracking-[0.25em] uppercase font-bold" style={{ color: RED }}>
            AKWETEYMAN · NEXT TO MTN ON THE N1 HIGHWAY &nbsp;|&nbsp; FISE · AMASAMAN (ADJ. GCB / PUMA)
          </span>
        </div>
      </div>

      {/* ── Main nav ─────────────────────────── */}
      <nav suppressHydrationWarning
        className={`sticky top-0 z-50 nav-animate ${
          scrolled ? 'bg-white/95 backdrop-blur-xl shadow-[0_1px_20px_rgba(0,0,0,0.08)] border-b border-gray-100'
          : 'bg-white border-b border-gray-100'
        }`}
        style={{ transform: visible ? 'translateY(0)' : 'translateY(-100%)', transition: 'transform 0.35s cubic-bezier(0.16,1,0.3,1), background 0.3s, box-shadow 0.3s' }}>

        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between" style={{ height: '72px' }}>

            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="relative w-11 h-11 rounded-xl overflow-hidden ring-1 ring-black/5 bg-white">
                <Image src="/intelet-logo.png" alt={COMPANY.name} fill className="object-contain p-1" sizes="44px" priority />
              </div>
              <div className="hidden sm:block">
                <div className="font-heading font-black text-base leading-none tracking-widest text-gray-900 group-hover:text-[#C8102E] transition-colors">
                  {COMPANY.short}
                </div>
                <div className="text-[9px] font-mono tracking-[0.22em] leading-none mt-0.5" style={{ color: RED }}>
                  ENTERPRISE · APPLIANCES
                </div>
              </div>
            </Link>

            {/* ── Desktop nav ──────────────────── */}
            <div className="hidden lg:flex items-center absolute left-1/2 -translate-x-1/2">

              {NAV_LINKS.map(({ label, href }) => {
                const active = pathname === href || (href === '/products' && pathname.startsWith('/products'))
                return (
                  <Link key={href} href={href}
                    className={`relative px-4 py-2 font-heading font-bold text-[11px] tracking-[0.18em] transition-colors duration-200 ${active?'':'text-gray-500 hover:text-gray-900'}`}
                    style={{ color: active ? RED : undefined }}>
                    {label}
                    <span className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full transition-transform duration-300 origin-center"
                      style={{ backgroundColor: RED, transform: active ? 'scaleX(1)' : 'scaleX(0)' }} />
                  </Link>
                )
              })}

              {/* Categories mega trigger */}
              <div className="relative" onMouseEnter={openMega} onMouseLeave={closeMega}>
                <button className="relative flex items-center gap-1.5 px-4 py-2 font-heading font-bold text-[11px] tracking-[0.18em] transition-colors duration-200 text-gray-500 hover:text-gray-900">
                  BRANDS <IconChevronDown open={megaOpen} />
                  <span className="absolute bottom-0 left-4 right-4 h-[2px] rounded-full transition-transform duration-300"
                    style={{ backgroundColor: RED, transform: megaOpen ? 'scaleX(1)' : 'scaleX(0)' }} />
                </button>

                {megaOpen && (
                  <div className="mega-animate absolute top-full left-1/2 -translate-x-1/2 mt-0 bg-white border border-gray-200/80 rounded-b-2xl overflow-hidden"
                    style={{ width: hoveredCat && hovCat && hovCat.subs.length > 0 ? '680px' : '540px', transition: 'width 0.18s', boxShadow: '0 24px 60px rgba(0,0,0,0.13)' }}
                    onMouseEnter={openMega} onMouseLeave={closeMega}>
                    <div className="flex">

                      <div style={{ width: '270px', flexShrink: 0, padding: '14px 10px' }}>
                        <p className="text-[9px] font-mono tracking-[0.25em] uppercase mb-2 px-3" style={{ color: '#9ca3af' }}>Browse Brands & Categories</p>
                        <div style={{ maxHeight: '360px', overflowY: 'auto' }}>
                          {CATEGORIES.map(cat => (
                            <div key={cat.slug} className="cat-row"
                              style={{ borderRadius: '10px', transition: 'background 0.12s' }}
                              onMouseEnter={() => setHoveredCat(cat.slug)}>
                              <button onClick={() => window.location.href = `/products?category_id=${cat.slug}`}
                                className="flex items-center gap-2.5 px-3 py-2 group/cat w-full text-left hover:bg-gray-50 transition-colors rounded-lg">
                                <div style={{ width: '28px', height: '28px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3px' }}>
                                  {cat.icon
                                    ? <Image src={cat.icon} alt={cat.name} width={22} height={22} className="object-contain w-full h-full" />
                                    : <Placeholder name={cat.name} />
                                  }
                                </div>
                                <span className={`text-xs font-heading font-semibold flex-1 tracking-wide transition-colors ${hoveredCat === cat.slug ? '' : 'text-gray-600 group-hover/cat:text-[#C8102E]'}`}
                                  style={{ color: hoveredCat === cat.slug ? RED : undefined }}>
                                  {cat.name}
                                </span>
                                {cat.subs.length > 0 && <IconChevronRight open={hoveredCat === cat.slug} />}
                              </button>
                            </div>
                          ))}
                        </div>
                        <div style={{ borderTop: '1px solid #f3f4f6', marginTop: '8px', paddingTop: '10px', paddingLeft: '12px' }}>
                          <Link href="/products" className="flex items-center gap-2 text-xs font-heading font-bold transition-all hover:gap-3" style={{ color: RED }}>
                            View All Products <IconArrow />
                          </Link>
                        </div>
                      </div>

                      {hoveredCat && hovCat && hovCat.subs.length > 0 && (
                        <div style={{ flex: 1, borderLeft: '1px solid #f3f4f6', padding: '14px 14px' }}>
                          <div className="flex items-center gap-3 mb-4 px-1">
                            <div style={{ width: '40px', height: '40px', borderRadius: '10px', border: '1px solid #e5e7eb', background: '#fff', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px' }}>
                              {hovCat.icon
                                ? <Image src={hovCat.icon} alt={hovCat.name} width={32} height={32} className="object-contain w-full h-full" />
                                : <Placeholder name={hovCat.name} />
                              }
                            </div>
                            <div>
                              <p className="font-heading font-black text-sm text-gray-800">{hovCat.name}</p>
                              <p className="text-[9px] font-mono" style={{ color: '#9ca3af' }}>{hovCat.subs.length} product lines</p>
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            {hovCat.subs.map(sub => (
                              <Link key={sub.slug} href={`/products?category_id=${sub.slug}`}
                                className="flex items-center justify-between px-3 py-2 rounded-xl hover:bg-gray-50 transition-all group/sub">
                                <span className="text-xs font-heading font-semibold text-gray-600 group-hover/sub:text-[#C8102E] transition-colors tracking-wide">
                                  {sub.name}
                                </span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-1.5">
              {searchOpen ? (
                <form onSubmit={handleSearch} className="flex items-center gap-1">
                  <input autoFocus type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                    placeholder="Search appliances…"
                    className="w-44 border border-gray-200 focus:border-[#C8102E] outline-none px-3 py-1.5 text-sm rounded-xl bg-gray-50 text-gray-800 placeholder-gray-400 transition-all"
                    style={{ fontSize: '13px' }} />
                  <button type="submit" className="p-1.5 rounded-xl text-white hover:opacity-90" style={{ backgroundColor: RED }}><IconSearch /></button>
                  <button type="button" onClick={() => { setSearchOpen(false); setSearchQuery('') }} className="p-1.5 text-gray-400 hover:text-gray-600"><IconX /></button>
                </form>
              ) : (
                <button onClick={() => setSearchOpen(true)} className="p-2 rounded-xl transition-all duration-200 text-gray-400 hover:text-[#C8102E] hover:bg-gray-50">
                  <IconSearch />
                </button>
              )}
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer"
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-xl text-white text-[11px] font-heading font-black tracking-widest transition-all hover:opacity-90 active:scale-95"
                style={{ backgroundColor: RED }}>
                <IconWhatsApp /> WhatsApp
              </a>
              <button onClick={() => setMobileOpen(!mobileOpen)}
                className="lg:hidden p-2 rounded-xl transition-all text-gray-500 hover:text-[#C8102E]">
                {mobileOpen ? <IconX /> : <IconMenu />}
              </button>
            </div>
          </div>
        </div>

        {/* ── Mobile drawer ──────────────────── */}
        {mobileOpen && (
          <div className="mobile-animate lg:hidden border-t border-gray-100 bg-white" style={{ maxHeight: '80vh', overflowY: 'auto' }}>
            <div className="max-w-7xl mx-auto px-6 py-4 space-y-0.5">
              {NAV_LINKS.map(({ label, href }) => {
                const active = pathname === href
                return (
                  <Link key={href} href={href}
                    className="flex items-center px-4 py-3 font-heading font-bold text-xs tracking-widest rounded-xl transition-colors"
                    style={active ? { color: RED, background: 'rgba(200,16,46,0.06)' } : { color: '#374151' }}>
                    {active && <span className="w-1.5 h-1.5 rounded-full mr-2.5 flex-shrink-0" style={{ background: RED }} />}
                    {label}
                  </Link>
                )
              })}

              <button onClick={() => setMobileCats(!mobileCats)}
                className="w-full flex items-center justify-between px-4 py-3 font-heading font-bold text-xs tracking-widest text-gray-700 rounded-xl hover:bg-gray-50">
                BRANDS & CATEGORIES <IconChevronDown open={mobileCats} />
              </button>

              {mobileCats && (
                <div className="px-1 pb-2 space-y-0.5">
                  {CATEGORIES.map(cat => (
                    <div key={cat.slug}>
                      <div className="flex items-center gap-1">
                        <Link href={`/products?category_id=${cat.slug}`}
                          className="flex items-center gap-2 flex-1 px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors">
                          <div style={{ width: '24px', height: '24px', borderRadius: '6px', border: '1px solid #e5e7eb', background: '#fff', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2px' }}>
                            {cat.icon
                              ? <Image src={cat.icon} alt={cat.name} width={18} height={18} className="object-contain w-full h-full" />
                              : <Placeholder name={cat.name} />
                            }
                          </div>
                          <span className="text-xs font-heading font-semibold text-gray-600 tracking-wide">{cat.name}</span>
                        </Link>
                        {cat.subs.length > 0 && (
                          <button onClick={() => setExpandedCat(expandedCat === cat.slug ? null : cat.slug)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 flex-shrink-0">
                            <IconChevronRight open={expandedCat === cat.slug} />
                          </button>
                        )}
                      </div>

                      {expandedCat === cat.slug && cat.subs.length > 0 && (
                        <div className="ml-9 mt-0.5 space-y-0.5">
                          {cat.subs.map(sub => (
                            <Link key={sub.slug} href={`/products?category_id=${sub.slug}`}
                              className="flex items-center px-3 py-1.5 rounded-xl hover:bg-gray-50 text-xs font-heading font-semibold text-gray-500 hover:text-[#C8102E] transition-colors">
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2 pb-1">
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl text-white text-xs font-heading font-black tracking-widest hover:opacity-90"
                  style={{ backgroundColor: RED }}>
                  <IconWhatsApp /> WHATSAPP US
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </>
  )
}
