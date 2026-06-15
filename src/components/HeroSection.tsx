'use client'

import Link from 'next/link'
import Image from 'next/image'
import { COMPANY, COLORS, whatsappLink } from '@/lib/brand'

const RED      = COLORS.red
const RED_DEEP = COLORS.redDeep
const BLUE     = COLORS.blue

const IconArrow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
)
const IconTag = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/>
    <circle cx="7.5" cy="7.5" r="1.5"/>
  </svg>
)
const IconShield = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)
const IconTruck = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 17h4V5H2v12h3"/><path d="M20 17h2v-4l-3-4h-5v8h2"/>
    <circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/>
  </svg>
)
const IconChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
)

export default function HeroSection() {
  return (
    <section
      className="relative flex flex-col overflow-hidden pt-6 pb-14 lg:pt-8 lg:pb-16"
      style={{ backgroundColor: COLORS.ash }}
    >
      {/* ── Light background: ash + red blend ───────────── */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 80% 55% at 85% 10%, ${COLORS.redSoft} 0%, transparent 60%),
            radial-gradient(ellipse 70% 50% at 10% 95%, ${COLORS.redSoft} 0%, transparent 55%),
            linear-gradient(180deg, ${COLORS.white} 0%, ${COLORS.ash} 100%)
          `,
        }}
      />

      {/* Diagonal red streak */}
      <div
        className="absolute pointer-events-none"
        style={{
          top: '30%', right: '-10%', width: '55%', height: '3px',
          background: `linear-gradient(to left, transparent, ${RED} 50%, transparent)`,
          transform: 'rotate(-14deg)', filter: 'blur(1px)', opacity: 0.5,
        }}
      />
      <div
        className="absolute pointer-events-none"
        style={{
          top: '62%', left: '-10%', width: '55%', height: '3px',
          background: `linear-gradient(to right, transparent, ${BLUE} 50%, transparent)`,
          transform: 'rotate(-10deg)', filter: 'blur(1px)', opacity: 0.35,
        }}
      />

      {/* Faint grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(200,16,46,0.05) 1px, transparent 1px),
            linear-gradient(90deg, rgba(200,16,46,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '56px 56px',
          maskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black, transparent)',
          WebkitMaskImage: 'radial-gradient(ellipse 80% 70% at 50% 40%, black, transparent)',
        }}
      />

      {/* ── Hero content ───────────────────────── */}
      <div className="relative z-10 flex-1 flex flex-col justify-center">
        <div className="w-full max-w-7xl mx-auto px-6 pt-16 pb-2 lg:pt-24">
          <div className="max-w-5xl">

            {/* ── Text ── */}
            <div style={{ animation: 'fadeRightSpring 0.8s cubic-bezier(0.22,1,0.36,1) 0.05s both' }}>

              {/* Headline */}
              <div
                className="mb-2 -mt-2"
                style={{ animation: 'heroTitle 0.9s cubic-bezier(0.22,1,0.36,1) 0.22s both' }}
              >
                <Image
                  src="/BuyNow.png"
                  alt="Unbeatable Discounts on Home Appliances"
                  width={1536}
                  height={1024}
                  priority
                  className="w-full max-w-[1100px] h-auto"
                />
              </div>

              {/* Subtext */}
              <p
                className="text-base md:text-lg max-w-lg mb-8 leading-relaxed"
                style={{
                  color: COLORS.inkSoft,
                  animation: 'fadeUpSpring 0.8s cubic-bezier(0.22,1,0.36,1) 0.38s both',
                }}
              >
                {COMPANY.name} now has two branches —{' '}
                <strong style={{ color: COLORS.ink }}>Akweteyman</strong> (next to MTN on the N1 Highway) and{' '}
                <strong style={{ color: COLORS.ink }}>Fise</strong> (Amasaman, adjacent to GCB Amasaman / Puma Filling Station).
                Fridges, freezers, washing machines, ACs &amp; TVs from Samsung, Midea, Bruhm, Tamashi, TCL, NASCO &amp; Haier —
                every unit backed by a <strong style={{ color: RED }}>12-month warranty</strong>.
              </p>

              {/* Pills */}
              <div className="flex flex-wrap gap-3 mb-10">
                {[
                  { icon: <IconTag />,    label: 'Best Prices in Accra' },
                  { icon: <IconShield />, label: '12-Month Warranty' },
                  { icon: <IconTruck />,  label: 'Delivery Available' },
                ].map(({ icon, label }, i) => (
                  <div
                    key={label}
                    className="flex items-center gap-2 px-4 py-2 rounded-full"
                    style={{
                      background: COLORS.white,
                      border: `1px solid ${COLORS.ashLine}`,
                      animation: `heroPills 0.6s cubic-bezier(0.22,1,0.36,1) ${0.52 + i * 0.08}s both`,
                    }}
                  >
                    <span style={{ color: RED, display: 'flex' }}>{icon}</span>
                    <span className="text-sm font-heading font-semibold tracking-wide" style={{ color: COLORS.ink }}>
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div
                className="flex flex-col sm:flex-row gap-4"
                style={{ animation: 'fadeUpSpring 0.7s cubic-bezier(0.22,1,0.36,1) 0.72s both' }}
              >
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-heading font-bold tracking-wide text-white text-base active:scale-95"
                  style={{
                    background: `linear-gradient(90deg, ${RED} 0%, ${RED_DEEP} 100%)`,
                    boxShadow: `0 15px 40px -15px ${RED}`,
                    transition: 'box-shadow 0.35s ease, transform 0.2s cubic-bezier(0.22,1,0.36,1)',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 0 36px ${RED}80` }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = `0 15px 40px -15px ${RED}` }}
                >
                  SHOP THE PROMO <IconArrow />
                </Link>
                <a
                  href={whatsappLink()}
                  target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-heading font-bold tracking-wide text-base active:scale-95"
                  style={{
                    border: `2px solid ${RED}`,
                    background: COLORS.white,
                    color: RED,
                    transition: 'background 0.3s ease, color 0.3s ease',
                  }}
                  onMouseEnter={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background = RED
                    ;(e.currentTarget as HTMLAnchorElement).style.color = COLORS.white
                  }}
                  onMouseLeave={e => {
                    (e.currentTarget as HTMLAnchorElement).style.background = COLORS.white
                    ;(e.currentTarget as HTMLAnchorElement).style.color = RED
                  }}
                >
                  WHATSAPP US
                </a>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}
