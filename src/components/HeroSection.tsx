'use client'

import { useRef, useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import NetworkAnimation from './NetworkAnimation'

const TEAL = '#00d4aa'

const slides = [
  '/heroproducts/1_0_01_04_40077_399911328-Black_crop_thumb.png',
  '/heroproducts/1_0_01_07_15908_729347164_crop_thumb.png',
  '/heroproducts/1_0_01_07_15908_729347579_crop_thumb.png',
  '/heroproducts/1_0_01_21_10315_528077270_crop_thumb.png',
  '/heroproducts/1_0_01_21_10315_528077271_crop_thumb.png',
  '/heroproducts/DS-2CD2T47G2-L_image_1.png',
  '/heroproducts/DS-2CD2T47G2-L_image_3.png',
  '/heroproducts/b1.jpg',
  '/heroproducts/OII (2).png',
  '/heroproducts/OIO (2).png',
]

const IconArrow = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
)
const IconShield = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
)
const IconCamera = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/>
    <circle cx="12" cy="13" r="3"/>
  </svg>
)
const IconWifi = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12.55a11 11 0 0 1 14.08 0"/><path d="M1.42 9a16 16 0 0 1 21.16 0"/>
    <path d="M8.53 16.11a6 6 0 0 1 6.95 0"/><circle cx="12" cy="20" r="1" fill="currentColor"/>
  </svg>
)
const IconChevronDown = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6"/>
  </svg>
)

export default function HeroSection() {
  const videoRef                      = useRef<HTMLVideoElement>(null)
  const [mounted,      setMounted]    = useState(false)
  const [videoReady,   setVideoReady] = useState(false)
  const [videoError,   setVideoError] = useState(false)
  const [current, setCurrent] = useState(0)
  const [prev,    setPrev]    = useState<number | null>(null)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    if (!mounted) return
    const v = videoRef.current
    if (!v) return
    v.muted = true; v.playsInline = true; v.loop = true
    const tryPlay = () => v.play().catch(() => setVideoError(true))
    if (v.readyState >= 3) tryPlay()
    else v.addEventListener('canplay', tryPlay, { once: true })
    return () => v.removeEventListener('canplay', tryPlay)
  }, [mounted])

  // Auto-advance slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      setPrev(current)
      setCurrent(c => (c + 1) % slides.length)
      setTimeout(() => setPrev(null), 900)
    }, 3800)
    return () => clearInterval(timer)
  }, [current])

  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden" style={{ backgroundColor: '#03070f' }}>

      {/* ── Background ───────────────────────────────── */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse 80% 60% at 50% 40%, #060d1a 0%, #03070f 100%)'
      }} />

      {/* Central glow orb */}
      <div className="absolute pointer-events-none" style={{
        top: '18%', left: '30%', transform: 'translateX(-50%)',
        width: '320px', height: '320px',
        background: 'radial-gradient(circle, rgba(120,80,255,0.35) 0%, rgba(60,120,255,0.2) 30%, transparent 70%)',
        filter: 'blur(40px)',
      }} />
      <div className="absolute pointer-events-none" style={{
        top: '25%', left: '30%', transform: 'translateX(-50%)',
        width: '180px', height: '180px',
        background: 'radial-gradient(circle, rgba(0,212,170,0.25) 0%, transparent 70%)',
        filter: 'blur(20px)',
      }} />

      {/* Light streaks */}
      {[
        { rotate: '-28deg', color: 'rgba(0,180,255,0.45)',  width: '45%', top: '42%', left: '-5%',  origin: '100% 50%', dir: 'right' },
        { rotate: '-16deg', color: 'rgba(130,80,255,0.35)', width: '40%', top: '48%', left: '-5%',  origin: '100% 50%', dir: 'right' },
        { rotate: '-8deg',  color: 'rgba(0,212,170,0.25)',  width: '38%', top: '53%', left: '-5%',  origin: '100% 50%', dir: 'right' },
        { rotate: '28deg',  color: 'rgba(0,180,255,0.45)',  width: '45%', top: '42%', right: '-5%', origin: '0% 50%',   dir: 'left'  },
        { rotate: '16deg',  color: 'rgba(130,80,255,0.35)', width: '40%', top: '48%', right: '-5%', origin: '0% 50%',   dir: 'left'  },
        { rotate: '8deg',   color: 'rgba(0,212,170,0.25)',  width: '38%', top: '53%', right: '-5%', origin: '0% 50%',   dir: 'left'  },
      ].map((ray, i) => (
        <div key={i} className="absolute pointer-events-none" style={{
          top: ray.top,
          ...('left' in ray ? { left: ray.left } : { right: (ray as any).right }),
          width: ray.width, height: '2px',
          background: `linear-gradient(to ${ray.dir}, transparent, ${ray.color} 50%, transparent)`,
          transform: `rotate(${ray.rotate})`,
          transformOrigin: ray.origin,
          filter: 'blur(2px)',
        }} />
      ))}

      <div className="absolute bottom-0 left-0 right-0 pointer-events-none" style={{
        height: '35%',
        background: 'linear-gradient(to top, rgba(0,80,160,0.12) 0%, transparent 100%)',
      }} />

      {/* Video */}
      {mounted && !videoError && (
        <div className="absolute inset-0">
          <video ref={videoRef} loop muted playsInline preload="auto"
            onCanPlay={() => setVideoReady(true)} onError={() => setVideoError(true)}
            className="w-full h-full object-cover"
            style={{ opacity: videoReady ? 0.12 : 0, transition: 'opacity 1.5s ease' }}>
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
        </div>
      )}

      {/* Network dots */}
      <div className="absolute inset-0" style={{ opacity: 0.2 }}>
        <NetworkAnimation />
      </div>

      {/* Corner brackets */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[
          { top: '5rem',    left: '2rem',  borderTop: '2px solid rgba(0,212,170,0.35)', borderLeft: '2px solid rgba(0,212,170,0.35)' },
          { top: '5rem',    right: '2rem', borderTop: '2px solid rgba(0,212,170,0.35)', borderRight: '2px solid rgba(0,212,170,0.35)' },
          { bottom: '8rem', left: '2rem',  borderBottom: '2px solid rgba(0,212,170,0.35)', borderLeft: '2px solid rgba(0,212,170,0.35)' },
          { bottom: '8rem', right: '2rem', borderBottom: '2px solid rgba(0,212,170,0.35)', borderRight: '2px solid rgba(0,212,170,0.35)' },
        ].map((s, i) => <div key={i} className="absolute w-12 h-12" style={s} />)}
      </div>

      {/* ── Two-column content ───────────────────────── */}
      <div className="relative z-10 flex-1 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 py-24">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* ── LEFT: Text ── */}
            <div style={{ animation: 'fadeRightSpring 0.8s cubic-bezier(0.22,1,0.36,1) 0.05s both' }}>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 mb-8 px-5 py-2 rounded-full border"
                style={{
                  background: 'rgba(0,212,170,0.08)', borderColor: 'rgba(0,212,170,0.25)',
                  animation: 'heroBadge 0.7s cubic-bezier(0.22,1,0.36,1) 0.1s both',
                }}>
                <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: TEAL }} />
                <span className="font-mono text-xs tracking-widest" style={{ color: TEAL }}>
                  GHANA&apos;S PREMIER IT SOLUTIONS PROVIDER
                </span>
              </div>

              {/* Headline */}
              <h1 className="font-heading font-black text-white leading-none mb-6"
                style={{
                  fontSize: 'clamp(2.4rem, 5.5vw, 4.8rem)', letterSpacing: '-0.02em',
                  animation: 'heroTitle 0.9s cubic-bezier(0.22,1,0.36,1) 0.22s both',
                }}>
                Securing Ghana&apos;s<br />
                <span style={{
                  color: TEAL,
                  textShadow: '0 0 60px rgba(0,212,170,0.5), 0 0 120px rgba(0,212,170,0.2)',
                }}>
                  Digital Future
                </span>
              </h1>

              {/* Subtext */}
              <p className="text-white/60 text-base max-w-lg mb-10 leading-relaxed font-light"
                style={{ animation: 'fadeUpSpring 0.8s cubic-bezier(0.22,1,0.36,1) 0.38s both' }}>
                Over <strong className="text-white/90 font-semibold">20 years</strong> delivering premium CCTV,
                access control, networking and IT equipment across Ghana and beyond.
              </p>

              {/* Pills */}
              <div className="flex flex-wrap gap-3 mb-10">
                {[
                  { icon: <IconCamera />, label: 'CCTV & Security' },
                  { icon: <IconWifi />,   label: 'Networking' },
                  { icon: <IconShield />, label: 'Access Control' },
                ].map(({ icon, label }, i) => (
                  <div key={label}
                    className="flex items-center gap-2 px-4 py-2 rounded-full border"
                    style={{
                      background: 'rgba(255,255,255,0.05)', borderColor: 'rgba(255,255,255,0.12)',
                      animation: `heroPills 0.6s cubic-bezier(0.22,1,0.36,1) ${0.52 + i * 0.08}s both`,
                      transition: 'background 0.3s ease, border-color 0.3s ease',
                    }}>
                    <span style={{ color: TEAL, display: 'flex' }}>{icon}</span>
                    <span className="text-sm font-heading font-semibold tracking-wide text-white/70">{label}</span>
                  </div>
                ))}
              </div>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row gap-4"
                style={{ animation: 'fadeUpSpring 0.7s cubic-bezier(0.22,1,0.36,1) 0.72s both' }}>
                <Link href="/products"
                  className="btn-shimmer inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-heading font-bold tracking-wide text-white text-base active:scale-95"
                  style={{
                    backgroundColor: TEAL,
                    transition: 'box-shadow 0.35s ease, transform 0.2s cubic-bezier(0.22,1,0.36,1)',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = '0 0 32px rgba(0,212,170,0.5)' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.boxShadow = 'none' }}>
                  EXPLORE PRODUCTS <IconArrow />
                </Link>
                <a href="https://wa.me/233555517658?text=Hello%2C%20I%20would%20like%20a%20FREE%20consultation"
                  target="_blank" rel="noopener noreferrer"
                  className="btn-shimmer inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-heading font-bold tracking-wide text-white text-base active:scale-95 border"
                  style={{
                    borderColor: 'rgba(255,255,255,0.25)', background: 'rgba(255,255,255,0.05)',
                    transition: 'background 0.3s ease, border-color 0.3s ease, transform 0.2s cubic-bezier(0.22,1,0.36,1)',
                  }}>
                  FREE CONSULTATION
                </a>
              </div>
            </div>

            {/* ── RIGHT: Image Slideshow ── */}
            <div className="hidden lg:flex items-center justify-center"
              style={{ animation: 'fadeLeftSpring 0.9s cubic-bezier(0.22,1,0.36,1) 0.35s both' }}>

              <div style={{ position: 'relative', width: '100%', maxWidth: '480px', aspectRatio: '1/1' }}>
                {slides.map((src, i) => {
                  const isActive = i === current
                  const isPrev   = i === prev
                  return (
                    <div key={src} style={{
                      position: 'absolute', inset: 0,
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? 'scale(1)' : isPrev ? 'scale(1.06)' : 'scale(0.96)',
                      transition: 'opacity 0.85s cubic-bezier(0.22,1,0.36,1), transform 0.85s cubic-bezier(0.22,1,0.36,1)',
                      zIndex: isActive ? 2 : isPrev ? 1 : 0,
                    }}>
                      <Image
                        src={src}
                        alt={`product-${i}`}
                        fill
                        className="object-contain"
                        sizes="480px"
                        priority={i === 0}
                      />
                    </div>
                  )
                })}
              </div>

            </div>

          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 animate-bounce">
        <span className="text-[10px] text-white/30 font-mono tracking-[0.25em]">SCROLL</span>
        <IconChevronDown />
      </div>

    </section>
  )
}
