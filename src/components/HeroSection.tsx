'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { COMPANY, COLORS, FEATURED_PROMO, whatsappLink } from '@/lib/brand'

const RED      = COLORS.red
const RED_DEEP = COLORS.redDeep
const BLUE     = COLORS.blue

// Slides drawn from the featured Grand-Opening promo products.
const slides = FEATURED_PROMO.map(p => ({ src: p.image, label: p.name }))

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
  const [current, setCurrent] = useState(0)
  const [prev,    setPrev]    = useState<number | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setPrev(current)
      setCurrent(c => (c + 1) % slides.length)
      setTimeout(() => setPrev(null), 900)
    }, 3800)
    return () => clearInterval(timer)
  }, [current])

  return (
    <section
      className="relative min-h-[92vh] flex flex-col overflow-hidden"
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

      {/* ── Two-column content ───────────────────────── */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 py-20 lg:py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* ── LEFT: Text ── */}
            <div style={{ animation: 'fadeRightSpring 0.8s cubic-bezier(0.22,1,0.36,1) 0.05s both' }}>

              {/* Grand Opening badge */}
              <div
                className="inline-flex items-center gap-2 mb-6 px-5 py-2 rounded-full"
                style={{
                  background: RED, color: COLORS.white,
                  boxShadow: `0 10px 30px -10px ${RED}`,
                  animation: 'heroBadge 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s both',
                }}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                <span className="font-mono text-xs tracking-widest">
                  {COMPANY.grandOpening.headline} · {COMPANY.grandOpening.label}
                </span>
              </div>

              {/* Headline */}
              <h1
                className="font-heading font-black leading-[0.95] mb-5"
                style={{
                  color: COLORS.ink,
                  fontSize: 'clamp(2.4rem, 5.5vw, 4.8rem)',
                  letterSpacing: '-0.02em',
                  animation: 'heroTitle 0.9s cubic-bezier(0.22,1,0.36,1) 0.22s both',
                }}
              >
                Unbeatable{' '}
                <span
                  style={{
                    background: `linear-gradient(90deg, ${RED} 0%, ${RED_DEEP} 100%)`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                  }}
                >
                  DISCOUNTS
                </span>
                <br />
                on Home Appliances
              </h1>

              {/* Subtext */}
              <p
                className="text-base md:text-lg max-w-lg mb-8 leading-relaxed"
                style={{
                  color: COLORS.inkSoft,
                  animation: 'fadeUpSpring 0.8s cubic-bezier(0.22,1,0.36,1) 0.38s both',
                }}
              >
                {COMPANY.name} is open at{' '}
                <strong style={{ color: COLORS.ink }}>{COMPANY.address.line1}</strong> — next to MTN on the N1 Highway.
                Fridges, freezers, washing machines, ACs &amp; TVs from Samsung, Midea, Bruhm, Tamashi, TCL, NASCO &amp; Haier —
                every unit backed by a <strong style={{ color: RED }}>12-month warranty</strong>.
              </p>

              {/* Pills */}
              <div className="flex flex-wrap gap-3 mb-10">
                {[
                  { icon: <IconTag />,    label: 'Grand Opening Prices' },
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

            {/* ── RIGHT: Appliance slideshow ── */}
            <div
              className="hidden lg:flex items-center justify-center"
              style={{ animation: 'fadeLeftSpring 0.9s cubic-bezier(0.22,1,0.36,1) 0.35s both' }}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  maxWidth: '520px',
                  aspectRatio: '1/1',
                  borderRadius: '24px',
                  background: `radial-gradient(circle at 50% 40%, ${COLORS.white} 0%, ${COLORS.ash} 75%)`,
                  border: `1px solid ${COLORS.ashLine}`,
                  boxShadow: `0 40px 80px -40px ${RED}66`,
                  overflow: 'hidden',
                }}
              >
                {slides.map((s, i) => {
                  const isActive = i === current
                  const isPrev   = i === prev
                  return (
                    <div
                      key={s.src}
                      style={{
                        position: 'absolute', inset: 24,
                        opacity: isActive ? 1 : 0,
                        transform: isActive ? 'scale(1)' : isPrev ? 'scale(1.06)' : 'scale(0.96)',
                        transition: 'opacity 0.85s cubic-bezier(0.22,1,0.36,1), transform 0.85s cubic-bezier(0.22,1,0.36,1)',
                        zIndex: isActive ? 2 : isPrev ? 1 : 0,
                      }}
                    >
                      <Image
                        src={s.src}
                        alt={s.label}
                        fill
                        className="object-contain"
                        sizes="520px"
                        priority={i === 0}
                      />
                    </div>
                  )
                })}

                {/* Floating % off sticker */}
                <div
                  className="absolute font-heading font-black text-white flex flex-col items-center justify-center"
                  style={{
                    top: '20px', right: '20px', width: '92px', height: '92px',
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${RED} 0%, ${RED_DEEP} 100%)`,
                    boxShadow: `0 12px 30px -8px ${RED}`,
                    transform: 'rotate(-8deg)',
                    zIndex: 3,
                  }}
                >
                  <span className="text-[10px] tracking-[0.18em] opacity-90">UP TO</span>
                  <span className="text-2xl leading-none">40%</span>
                  <span className="text-[10px] tracking-[0.18em] opacity-90">OFF</span>
                </div>

                {/* Label ribbon */}
                <div
                  className="absolute left-6 right-6 bottom-6 flex items-center justify-between px-4 py-3 rounded-xl"
                  style={{ background: COLORS.white, border: `1px solid ${COLORS.ashLine}`, zIndex: 3 }}
                >
                  <div>
                    <div className="text-[10px] font-mono tracking-[0.18em]" style={{ color: COLORS.inkMuted }}>
                      GRAND OPENING FEATURED
                    </div>
                    <div className="text-sm font-heading font-bold" style={{ color: COLORS.ink }}>
                      {slides[current]?.label}
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    {slides.map((_, i) => (
                      <span
                        key={i}
                        style={{
                          width: i === current ? 18 : 6, height: 6, borderRadius: 4,
                          background: i === current ? RED : COLORS.ashLine,
                          transition: 'all 0.35s ease',
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 animate-bounce" style={{ color: COLORS.inkMuted }}>
        <span className="text-[10px] font-mono tracking-[0.25em]">SCROLL</span>
        <IconChevronDown />
      </div>
    </section>
  )
}
