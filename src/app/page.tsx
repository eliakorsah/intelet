import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import HeroSection from '@/components/HeroSection'
import ProductCard from '@/components/ProductCard'
import ScrollReveal from '@/components/ScrollReveal'
import CountUpStat from '@/components/CountUpStat'
import { supabase } from '@/lib/supabase'
import {
  COMPANY,
  COLORS,
  PARTNER_BRANDS,
  APPLIANCE_CATEGORIES,
  whatsappLink,
} from '@/lib/brand'

const RED      = COLORS.red
const RED_DEEP = COLORS.redDeep

// Re-fetch product data (incl. newly added images) at most every 60s instead
// of freezing it at build time, so admin edits show on the home page.
export const revalidate = 60

const IconArrow = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
)
const IconShield = ({ size = 14 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)
const IconCheck = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m5 12 5 5L20 7"/>
  </svg>
)

const perks = [
  'Authorised dealer for Samsung, Midea, Bruhm, Tamashi, TCL, NASCO & Haier',
  'Best prices in Accra — genuine appliances at fair prices',
  '12-month manufacturer warranty on every appliance',
  'Cash or Mobile Money accepted — flexible payment',
  'Doorstep delivery available across Accra and beyond',
]

const stats = [
  { value: '7',     label: 'Trusted Brands' },
  { value: '6',     label: 'Appliance Categories' },
  { value: '12',    label: 'Month Warranty' },
  { value: '100%',  label: 'Original Products' },
]

async function getFeaturedProducts() {
  const { data } = await supabase.from('products').select('*')
    .eq('featured', true).eq('in_stock', true)
    .order('created_at', { ascending: false }).limit(6)
  return data || []
}

async function getLatestProducts() {
  const { data } = await supabase.from('products').select('*')
    .eq('in_stock', true)
    .order('created_at', { ascending: false }).limit(12)
  return data || []
}

export default async function HomePage() {
  const [featured, latest] = await Promise.all([
    getFeaturedProducts().catch(() => []),
    getLatestProducts().catch(() => []),
  ])

  return (
    <>
      <HeroSection />

      {/* ── Stats strip ─────────────────────────────── */}
      <section style={{ background: COLORS.white, borderTop: `1px solid ${COLORS.ashLine}`, borderBottom: `1px solid ${COLORS.ashLine}` }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map(({ value, label }, i) => (
              <div key={label} className={`py-9 text-center ${i < stats.length - 1 ? `border-r` : ''}`}
                style={{ borderColor: COLORS.ashLine }}>
                <CountUpStat value={value} label={label} delay={i * 120} color={RED} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── World Cup Featured Deals (DB) ─────────────── */}
      {featured.length > 0 && (
      <section id="grand-opening" style={{ background: COLORS.ash }} className="py-24">
        <div className="max-w-[1600px] mx-auto px-6">
          <ScrollReveal direction="up" duration={700}>
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
              <div>
                <p className="font-mono text-[11px] tracking-[0.35em] uppercase mb-3" style={{ color: RED }}>
                  WORLD CUP PROMO
                </p>
                <h2 className="font-heading font-black tracking-tight leading-[1.05]"
                  style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: COLORS.ink }}>
                  Top <span style={{ color: RED }}>DEALS</span> on<br />Best-Selling Appliances
                </h2>
                <p className="mt-4 text-sm leading-relaxed max-w-lg" style={{ color: COLORS.inkSoft }}>
                  Our best sellers at World Cup prices — Bruhm and more. Walk into our showroom at{' '}
                  {COMPANY.address.line1}, next to MTN on the N1 Highway, or message us on WhatsApp.
                </p>
              </div>
              <a
                href={whatsappLink()}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-heading font-bold tracking-widest uppercase text-sm text-white self-start md:self-auto"
                style={{ background: `linear-gradient(90deg, ${RED} 0%, ${RED_DEEP} 100%)` }}
              >
                Message Us <IconArrow size={15} />
              </a>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2.5 sm:gap-3">
            {featured.map((product: any, i: number) => (
              <ScrollReveal key={product.id} delay={i * 80} direction="up" duration={700} distance={50}>
                <ProductCard product={product} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ── Shop by Category ─────────────────────────── */}
      <section style={{ background: COLORS.white }} className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal direction="up" duration={700}>
            <div className="mb-14">
              <p className="font-mono text-[11px] tracking-[0.35em] uppercase mb-3" style={{ color: RED }}>
                Browse the Store
              </p>
              <h2 className="font-heading font-black tracking-tight leading-[1.05]"
                style={{ fontSize: 'clamp(2rem, 4vw, 2.8rem)', color: COLORS.ink }}>
                Shop by <span style={{ color: RED }}>Category</span>
              </h2>
              <p className="mt-4 text-sm leading-relaxed max-w-md" style={{ color: COLORS.inkSoft }}>
                Everything you need for the home — from fridges and freezers to washers, ACs, TVs and small appliances.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {APPLIANCE_CATEGORIES.map((c, i) => (
              <ScrollReveal key={c.slug} delay={i * 80} direction="up" duration={700} distance={50}>
                <Link
                  href={`/products?category=${c.slug}`}
                  className="group block rounded-2xl overflow-hidden h-full transition-all duration-300 hover:-translate-y-2"
                  style={{
                    border: `1px solid ${COLORS.ashLine}`,
                    background: COLORS.white,
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                  }}
                >
                  <div className="relative w-full overflow-hidden" style={{ height: '210px', background: COLORS.ash }}>
                    <Image
                      src={c.image}
                      alt={c.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: `linear-gradient(to top, ${COLORS.ink}AA 0%, transparent 55%)` }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 px-5 py-4 flex items-end justify-between">
                      <span className="font-heading font-black text-white tracking-tight text-lg">{c.name}</span>
                      <span className="text-white/80 group-hover:text-white group-hover:translate-x-1 transition-all">
                        <IconArrow size={18} />
                      </span>
                    </div>
                  </div>
                  <div className="px-5 py-4">
                    <p className="text-sm leading-relaxed" style={{ color: COLORS.inkSoft }}>{c.blurb}</p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Latest Products (DB) ────────────────────── */}
      {latest.length > 0 && (
        <section style={{ background: COLORS.white }} className="py-24">
          <div className="max-w-[1600px] mx-auto px-6">
            <ScrollReveal direction="up" duration={700}>
              <div className="flex items-end justify-between mb-14">
                <div>
                  <p className="font-mono text-[11px] tracking-[0.35em] uppercase mb-2" style={{ color: RED }}>
                    Just In
                  </p>
                  <h2 className="font-heading font-black tracking-tight"
                    style={{ fontSize: '2.6rem', color: COLORS.ink }}>
                    Latest Appliances
                  </h2>
                </div>
                <Link href="/products"
                  className="flex items-center gap-2 text-sm font-heading font-bold tracking-widest uppercase transition-all hover:gap-3"
                  style={{ color: RED }}>
                  Browse All <IconArrow size={15} />
                </Link>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2.5 sm:gap-3">
              {latest.map((product: any, i: number) => (
                <ScrollReveal key={product.id} delay={i * 50} direction="up" duration={650} distance={40}>
                  <Suspense fallback={<div className="rounded-2xl animate-pulse" style={{ background: COLORS.ash, height: '290px' }} />}>
                    <ProductCard product={product} />
                  </Suspense>
                </ScrollReveal>
              ))}
            </div>
            <ScrollReveal direction="up" delay={150} duration={600}>
              <div className="text-center mt-16">
                <Link href="/products"
                  className="inline-flex items-center gap-3 px-10 py-4 rounded-xl font-heading font-black tracking-widest text-sm text-white uppercase transition-all hover:opacity-90 hover:gap-4 active:scale-95"
                  style={{ background: `linear-gradient(90deg, ${RED} 0%, ${RED_DEEP} 100%)` }}>
                  View All Products <IconArrow size={16} />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ── About / Who We Are ──────────────────────── */}
      <section style={{ background: COLORS.ash }} className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">

            <ScrollReveal direction="left" duration={800} distance={60}>
              <div>
                <p className="font-mono text-[11px] tracking-[0.35em] uppercase mb-4" style={{ color: RED }}>
                  Who We Are
                </p>
                <h2 className="font-heading font-black leading-[1.05] tracking-tight mb-6"
                  style={{ fontSize: '3.2rem', color: COLORS.ink }}>
                  Ghana&apos;s Home<br />of Quality<br />
                  <span style={{ color: RED }}>Appliances</span>
                </h2>
                <p className="leading-relaxed mb-8 text-sm max-w-lg" style={{ color: COLORS.inkSoft }}>
                  {COMPANY.name} is a trusted home-appliance retailer based at{' '}
                  <strong style={{ color: COLORS.ink, fontWeight: 600 }}>{COMPANY.address.line1}</strong>,
                  next to MTN on the N1 Highway. We partner directly with the brands you trust to bring you
                  genuine fridges, freezers, washing machines, ACs and televisions — at fair prices, with real
                  after-sales support and a 12-month warranty on every unit.
                </p>
                <div className="space-y-3 mb-10">
                  {perks.map((item, i) => (
                    <ScrollReveal key={item} delay={100 + i * 70} direction="left" duration={600}>
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: COLORS.redSoft }}>
                          <span style={{ color: RED, display: 'flex' }}><IconCheck /></span>
                        </span>
                        <span className="text-sm" style={{ color: COLORS.inkSoft }}>{item}</span>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
                <Link href="/about"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-heading font-black text-sm tracking-widest uppercase transition-all duration-200 hover:gap-3"
                  style={{
                    border: `2px solid ${COLORS.ink}`,
                    color: COLORS.ink,
                    background: COLORS.white,
                  }}>
                  Learn More <IconArrow size={15} />
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" duration={800} distance={60}>
              <div className="grid grid-cols-2 gap-3">
                {PARTNER_BRANDS.map(b => (
                  <div key={b.slug}
                    className="p-6 rounded-2xl flex flex-col items-center justify-center gap-3 transition-all duration-300 cursor-default group hover:-translate-y-0.5"
                    style={{
                      background: COLORS.white,
                      border: `1px solid ${COLORS.ashLine}`,
                      minHeight: '130px',
                    }}>
                    <div className="relative w-14 h-10">
                      <Image src={b.logo} alt={b.name} fill className="object-contain" sizes="56px" />
                    </div>
                    <span className="font-heading font-bold text-sm tracking-widest uppercase"
                      style={{ color: b.accent ?? COLORS.ink }}>
                      {b.name}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────── */}
      <section
        className="py-24 relative overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${RED_DEEP} 0%, ${RED} 50%, ${RED_DEEP} 100%)` }}
      >
        {/* Soft orbs */}
        <div className="absolute pointer-events-none" style={{
          top: '10%', left: '50%', transform: 'translateX(-50%)',
          width: '500px', height: '250px',
          background: 'radial-gradient(ellipse, rgba(255,255,255,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />

        <ScrollReveal direction="up" duration={800}>
          <div className="relative max-w-2xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 mb-7 px-5 py-2.5 rounded-full"
              style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}>
              <span className="flex" style={{ color: COLORS.white }}><IconShield size={12} /></span>
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: COLORS.white }}>
                NOW OPEN · {COMPANY.address.line1}
              </span>
            </div>
            <h2 className="font-heading font-black text-white leading-tight tracking-tight mb-5"
              style={{ fontSize: 'clamp(2rem, 6vw, 3.2rem)' }}>
              Visit our showroom<br />at {COMPANY.address.line1}
            </h2>
            <p className="max-w-lg mx-auto mb-10 leading-relaxed text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>
              {COMPANY.address.line2}, {COMPANY.address.city}. Walk in, WhatsApp us, or call to get the best price on your next appliance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href={whatsappLink()}
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-9 py-4 rounded-xl font-heading font-black tracking-widest text-sm uppercase transition-all hover:opacity-90 active:scale-95"
                style={{ background: COLORS.white, color: RED }}>
                WhatsApp {COMPANY.phones.primaryFmt}
              </a>
              <Link href="/contact"
                className="inline-flex items-center justify-center gap-2 px-9 py-4 rounded-xl font-heading font-black tracking-widest text-sm uppercase text-white border border-white/40 bg-white/10 hover:bg-white/20 transition-all active:scale-95">
                Get Directions <IconArrow size={15} />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </>
  )
}
