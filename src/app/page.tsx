import { Suspense } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import HeroSection from '@/components/HeroSection'
import ProductCard from '@/components/ProductCard'
import ScrollReveal from '@/components/ScrollReveal'
import CountUpStat from '@/components/CountUpStat'
import { supabase } from '@/lib/supabase'

const TEAL = '#00c49a'

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

const services = [
  { img: '/cctvsys.png',   title: 'CCTV Systems',   desc: 'IP & Analog cameras, NVRs, DVRs for complete surveillance coverage.' },
  { img: '/access.jpg',    title: 'Access Control',  desc: 'Fingerprint readers, boom barriers, turnstiles and smart locks.' },
  { img: '/network.png',   title: 'Networking',      desc: 'Switches, routers, PoE equipment, structured cabling solutions.' },
  { img: '/fire.jpg',      title: 'Fire Alarm',      desc: 'Addressable & conventional fire detection and alarm systems.' },
  { img: '/itequip.png',   title: 'IT Equipment',    desc: 'Computers, accessories and peripherals at competitive prices.' },
  { img: '/install.png',   title: 'Installation',    desc: 'Expert on-site installation and after-sales support throughout Ghana.' },
]

const industries = [
  'Commercial Offices', 'Retail Spaces', 'Educational Institutions',
  'Healthcare Facilities', 'Hospitality & Hotels', 'Residential Buildings',
  'Public Venues', 'Industrial Facilities',
]

const perks = [
  'Authorized dealer for all major security brands',
  'Free delivery throughout Ghana',
  'Expert installation and after-sales support',
  'Competitive pricing — wholesale and retail',
  'Tailored solutions for any industry',
]

const stats = [
  { value: '20+',   label: 'Years in Business' },
  { value: '1000+', label: 'Products' },
  { value: '8',     label: 'Premium Brands' },
  { value: '24/7',  label: 'Support' },
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
      <section style={{ background: '#ffffff', borderBottom: '1px solid #eef0f4' }}>
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map(({ value, label }, i) => (
              <div key={label} className={`py-9 text-center ${i < stats.length - 1 ? 'border-r border-[#eef0f4]' : ''}`}>
                <CountUpStat value={value} label={label} delay={i * 120} color={TEAL} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Services ────────────────────────────────── */}
      <section style={{ background: '#f0f4ff' }} className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <ScrollReveal direction="up" duration={700}>
            <div className="mb-16">
              <p className="font-mono text-[11px] tracking-[0.35em] uppercase mb-3" style={{ color: TEAL }}>
                What We Offer
              </p>
              <h2 className="font-heading font-black tracking-tight leading-[1.05]"
                style={{ fontSize: '2.8rem', color: '#0d1117' }}>
                End-to-end IT &<br />Security Solutions
              </h2>
              <p className="mt-4 text-sm leading-relaxed max-w-md" style={{ color: '#6b7280' }}>
                From surveillance cameras to enterprise networking — we supply, install and support it all.
              </p>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map(({ img, title, desc }, i) => (
              <ScrollReveal key={title} delay={i * 80} direction="up" duration={700} distance={50}>
                <div
                  className="group rounded-2xl overflow-hidden border border-[#e5e7eb] bg-white hover:border-[#00c49a] hover:shadow-[0_20px_60px_rgba(0,196,154,0.12)] hover:-translate-y-2 transition-all duration-300 cursor-default h-full"
                  style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                >
                  {/* Fixed-height image container — inline style ensures SSR + desktop both work */}
                  <div className="relative w-full overflow-hidden bg-gray-200" style={{ height: '192px' }}>
                    <Image
                      src={img}
                      alt={title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                    {/* Dark gradient so title is readable */}
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(to top, rgba(13,17,23,0.62) 0%, rgba(13,17,23,0.1) 55%, transparent 100%)' }}
                    />
                    {/* Title overlaid on image */}
                    <div className="absolute bottom-0 left-0 right-0 px-5 py-4">
                      <span className="font-heading font-black text-white tracking-tight"
                        style={{ fontSize: '1.05rem', textShadow: '0 1px 4px rgba(0,0,0,0.4)' }}>
                        {title}
                      </span>
                    </div>
                  </div>
                  {/* Description below image */}
                  <div className="px-5 py-4">
                    <p className="text-sm leading-relaxed" style={{ color: '#6b7280' }}>{desc}</p>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Featured Products ───────────────────────── */}
      {featured.length > 0 && (
        <section style={{ background: '#ffffff' }} className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <ScrollReveal direction="up" duration={700}>
              <div className="flex items-end justify-between mb-14">
                <div>
                  <p className="font-mono text-[11px] tracking-[0.35em] uppercase mb-2" style={{ color: TEAL }}>
                    Handpicked
                  </p>
                  <h2 className="font-heading font-black tracking-tight"
                    style={{ fontSize: '2.6rem', color: '#0d1117' }}>
                    Featured Products
                  </h2>
                </div>
                <Link href="/products"
                  className="flex items-center gap-2 text-sm font-heading font-bold tracking-widest uppercase transition-all hover:gap-3"
                  style={{ color: TEAL }}>
                  View All <IconArrow size={15} />
                </Link>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featured.map((product: any, i: number) => (
                <ScrollReveal key={product.id} delay={i * 90} direction="up" duration={700} distance={50}>
                  <Suspense fallback={<div className="rounded-2xl animate-pulse" style={{ background: '#f0f4ff', height: '320px' }} />}>
                    <ProductCard product={product} />
                  </Suspense>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Latest Products ─────────────────────────── */}
      {latest.length > 0 && (
        <section style={{ background: '#f7f8fc' }} className="py-24">
          <div className="max-w-7xl mx-auto px-6">
            <ScrollReveal direction="up" duration={700}>
              <div className="flex items-end justify-between mb-14">
                <div>
                  <p className="font-mono text-[11px] tracking-[0.35em] uppercase mb-2" style={{ color: TEAL }}>
                    Just In
                  </p>
                  <h2 className="font-heading font-black tracking-tight"
                    style={{ fontSize: '2.6rem', color: '#0d1117' }}>
                    Latest Products
                  </h2>
                </div>
                <Link href="/products"
                  className="flex items-center gap-2 text-sm font-heading font-bold tracking-widest uppercase transition-all hover:gap-3"
                  style={{ color: TEAL }}>
                  Browse All <IconArrow size={15} />
                </Link>
              </div>
            </ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {latest.map((product: any, i: number) => (
                <ScrollReveal key={product.id} delay={i * 50} direction="up" duration={650} distance={40}>
                  <Suspense fallback={<div className="rounded-2xl animate-pulse border border-[#eef0f4]" style={{ background: '#fff', height: '290px' }} />}>
                    <ProductCard product={product} />
                  </Suspense>
                </ScrollReveal>
              ))}
            </div>
            <ScrollReveal direction="up" delay={150} duration={600}>
              <div className="text-center mt-16">
                <Link href="/products"
                  className="inline-flex items-center gap-3 px-10 py-4 rounded-xl font-heading font-black tracking-widest text-sm text-white uppercase transition-all hover:opacity-90 hover:gap-4 active:scale-95"
                  style={{ backgroundColor: TEAL }}>
                  View All Products <IconArrow size={16} />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* ── About / Who We Are ──────────────────────── */}
      <section style={{ background: '#ffffff' }} className="py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">

            <ScrollReveal direction="left" duration={800} distance={60}>
              <div>
                <p className="font-mono text-[11px] tracking-[0.35em] uppercase mb-4" style={{ color: TEAL }}>
                  Who We Are
                </p>
                <h2 className="font-heading font-black leading-[1.05] tracking-tight mb-6"
                  style={{ fontSize: '3.2rem', color: '#0d1117' }}>
                  Ghana&apos;s Trusted<br />IT Partner<br />
                  <span style={{ color: TEAL }}>Since 2003</span>
                </h2>
                <p className="leading-relaxed mb-8 text-sm max-w-lg" style={{ color: '#6b7280' }}>
                  At Tritech Technologies Ghana Limited, we understand the importance of reliable IT
                  infrastructure and robust security systems. With over{' '}
                  <strong style={{ color: '#0d1117', fontWeight: 600 }}>20 years of experience</strong>,
                  we provide quality IT equipment and accessories at affordable prices, with efficient
                  delivery services throughout Ghana.
                </p>
                <div className="space-y-3 mb-10">
                  {perks.map((item, i) => (
                    <ScrollReveal key={item} delay={100 + i * 70} direction="left" duration={600}>
                      <div className="flex items-center gap-3">
                        <span className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: 'rgba(0,196,154,0.12)' }}>
                          <span style={{ color: TEAL, display: 'flex' }}><IconCheck /></span>
                        </span>
                        <span className="text-sm" style={{ color: '#374151' }}>{item}</span>
                      </div>
                    </ScrollReveal>
                  ))}
                </div>
                <Link href="/about"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl border-2 border-[#0d1117] text-[#0d1117] font-heading font-black text-sm tracking-widest uppercase transition-all duration-200 hover:gap-3 hover:bg-[#0d1117] hover:text-white">
                  Learn More <IconArrow size={15} />
                </Link>
              </div>
            </ScrollReveal>

            <ScrollReveal direction="right" duration={800} distance={60}>
              <div className="grid grid-cols-2 gap-3">
                {industries.map(industry => (
                  <div key={industry}
                    className="p-5 rounded-2xl border border-[#e5e7eb] bg-[#f7f8fc] hover:border-[#00c49a] hover:bg-white hover:shadow-[0_8px_30px_rgba(0,196,154,0.1)] hover:-translate-y-0.5 transition-all duration-300 cursor-default group">
                    <div className="w-2 h-2 rounded-full mb-3 transition-transform duration-300 group-hover:scale-150"
                      style={{ backgroundColor: TEAL }} />
                    <span className="font-heading font-bold text-sm leading-snug" style={{ color: '#374151' }}>
                      {industry}
                    </span>
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────── */}
      <section className="py-24 relative overflow-hidden" style={{ background: '#03070f' }}>
        {/* Light rays */}
        {[
          { rotate: '-25deg', color: 'rgba(0,180,255,0.35)',  width: '42%', top: '48%', side: 'left',  val: '-4%', origin: '100% 50%', dir: 'right' },
          { rotate: '-14deg', color: 'rgba(100,60,255,0.28)', width: '40%', top: '54%', side: 'left',  val: '-4%', origin: '100% 50%', dir: 'right' },
          { rotate: '-6deg',  color: 'rgba(0,196,154,0.2)',   width: '38%', top: '59%', side: 'left',  val: '-4%', origin: '100% 50%', dir: 'right' },
          { rotate: '25deg',  color: 'rgba(0,180,255,0.35)',  width: '42%', top: '48%', side: 'right', val: '-4%', origin: '0% 50%',   dir: 'left'  },
          { rotate: '14deg',  color: 'rgba(100,60,255,0.28)', width: '40%', top: '54%', side: 'right', val: '-4%', origin: '0% 50%',   dir: 'left'  },
          { rotate: '6deg',   color: 'rgba(0,196,154,0.2)',   width: '38%', top: '59%', side: 'right', val: '-4%', origin: '0% 50%',   dir: 'left'  },
        ].map((ray, i) => (
          <div key={i} className="absolute pointer-events-none" style={{
            top: ray.top,
            [ray.side]: ray.val,
            width: ray.width, height: '1.5px',
            background: `linear-gradient(to ${ray.dir}, transparent, ${ray.color} 50%, transparent)`,
            transform: `rotate(${ray.rotate})`,
            transformOrigin: ray.origin,
            filter: 'blur(1.5px)',
          }} />
        ))}
        {/* Central glow */}
        <div className="absolute pointer-events-none" style={{
          top: '15%', left: '50%', transform: 'translateX(-50%)',
          width: '500px', height: '250px',
          background: 'radial-gradient(ellipse, rgba(0,196,154,0.08) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }} />

        <ScrollReveal direction="up" duration={800}>
          <div className="relative max-w-2xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 mb-7 px-5 py-2.5 rounded-full border"
              style={{ background: 'rgba(0,196,154,0.08)', borderColor: 'rgba(0,196,154,0.2)' }}>
              <span style={{ color: TEAL, display: 'flex' }}><IconShield size={12} /></span>
              <span className="font-mono text-[10px] tracking-[0.3em] uppercase" style={{ color: TEAL }}>
                Your Safety Is Our Priority
              </span>
            </div>
            <h2 className="font-heading font-black text-white leading-tight tracking-tight mb-5"
              style={{ fontSize: 'clamp(2rem, 6vw, 3.2rem)' }}>
              Protect What<br />Matters Most
            </h2>
            <p className="max-w-lg mx-auto mb-10 leading-relaxed text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>
              Whether you need security solutions for residential buildings, offices, retail spaces, or public
              venues — we&apos;ve got you covered. Contact us today for a free consultation.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="https://wa.me/233555517658?text=Hello%2C%20I%20need%20a%20security%20consultation"
                target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-9 py-4 rounded-xl font-heading font-black tracking-widest text-sm uppercase text-white transition-all hover:opacity-90 active:scale-95"
                style={{ backgroundColor: TEAL }}>
                Get Free Consultation
              </a>
              <Link href="/products"
                className="inline-flex items-center justify-center gap-2 px-9 py-4 rounded-xl font-heading font-black tracking-widest text-sm uppercase text-white border border-white/20 bg-white/5 hover:bg-white/10 transition-all active:scale-95">
                Browse Products <IconArrow size={15} />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>
    </>
  )
}