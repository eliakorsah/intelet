'use client'

import { useRef, useState } from 'react'
import Link from 'next/link'
import { Play, Pause, Phone, Shield, Wifi, Camera, Server, Lock } from 'lucide-react'
import dynamic from 'next/dynamic'

const NetworkCanvas = dynamic(() => import('./NetworkCanvas'), { ssr: false })

const FLOATING_ICONS = [
  { Icon: Camera, label: 'CCTV', x: '10%', y: '20%', delay: '0s' },
  { Icon: Wifi, label: 'Network', x: '85%', y: '15%', delay: '1.5s' },
  { Icon: Server, label: 'Servers', x: '8%', y: '70%', delay: '0.8s' },
  { Icon: Lock, label: 'Access', x: '88%', y: '65%', delay: '2s' },
  { Icon: Shield, label: 'Security', x: '50%', y: '8%', delay: '1.2s' },
]

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoLoaded, setVideoLoaded] = useState(false)

  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
    } else {
      videoRef.current.play()
    }
    setIsPlaying(!isPlaying)
  }

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-navy-900">
      {/* Video background */}
      <div className="absolute inset-0 z-0">
        <video
          ref={videoRef}
          className="w-full h-full object-cover opacity-40"
          loop
          muted
          playsInline
          preload="metadata"
          onLoadedData={() => setVideoLoaded(true)}
          poster="/images/hero-poster.jpg"
        >
          {/* Replace with your actual video file */}
          <source src="/videos/hero.mp4" type="video/mp4" />
          <source src="/videos/hero.webm" type="video/webm" />
        </video>
        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-900 via-navy-900/70 to-navy-900/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-900 via-transparent to-transparent" />
      </div>

      {/* Cyber grid */}
      <div className="absolute inset-0 cyber-grid-bg z-1" />

      {/* Network animation overlay */}
      <div className="absolute inset-0 z-2">
        <NetworkCanvas />
      </div>

      {/* Floating tech icons */}
      {FLOATING_ICONS.map(({ Icon, label, x, y, delay }) => (
        <div
          key={label}
          className="absolute z-10 hidden lg:flex flex-col items-center gap-1 opacity-60"
          style={{ left: x, top: y }}
        >
          <div
            className="w-10 h-10 border border-teal-500/40 bg-navy-900/60 backdrop-blur-sm flex items-center justify-center"
            style={{
              animation: `float 6s ease-in-out infinite`,
              animationDelay: delay,
            }}
          >
            <Icon className="w-5 h-5 text-teal-400" />
          </div>
          <span className="font-mono text-[9px] text-teal-500 tracking-widest">{label}</span>
        </div>
      ))}

      {/* Scan lines decoration */}
      <div className="absolute inset-0 z-3 pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-teal-500/20 to-transparent"
            style={{ top: `${20 + i * 15}%`, animationDelay: `${i * 0.5}s` }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="max-w-2xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-teal-500/10 border border-teal-500/30 px-4 py-1.5 mb-6">
            <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
            <span className="font-mono text-xs text-teal-400 tracking-widest uppercase">
              20+ Years of Excellence in Ghana
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-900 leading-tight mb-6">
            <span className="text-white">Your Trusted</span>
            <br />
            <span className="text-gradient">IT & Security</span>
            <br />
            <span className="text-white">Solutions Partner</span>
          </h1>

          <p className="text-slate-400 text-lg sm:text-xl mb-8 max-w-lg leading-relaxed font-body">
            Quality IT equipment and security systems at affordable prices.
            Serving residential, commercial, and industrial clients throughout Ghana.
          </p>

          {/* Stats */}
          <div className="flex gap-6 mb-8">
            {[
              { value: '20+', label: 'Years Experience' },
              { value: '1000+', label: 'Products' },
              { value: '8', label: 'Top Brands' },
            ].map(({ value, label }) => (
              <div key={label}>
                <div className="font-display text-2xl font-800 text-gradient">{value}</div>
                <div className="font-mono text-xs text-slate-400 tracking-wider">{label}</div>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-4">
            <Link href="/products" className="btn-primary text-base py-3 px-8">
              Browse Products
            </Link>
            <a
              href={`tel:${'+233555517658'}`}
              className="btn-outline text-base py-3 px-8 flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              Call Us Now
            </a>
          </div>
        </div>

        {/* Video control */}
        {videoLoaded && (
          <button
            onClick={togglePlay}
            className="absolute bottom-8 right-8 flex items-center gap-2 bg-glass border border-teal-500/20 px-4 py-2 text-teal-400 hover:bg-teal-500/10 transition-all font-mono text-xs tracking-wider"
            aria-label={isPlaying ? 'Pause video' : 'Play video'}
          >
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? 'PAUSE' : 'PLAY'} REEL
          </button>
        )}
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#060f24] to-transparent z-10" />

      {/* Corner decorators */}
      <div className="absolute top-24 right-8 hidden lg:block">
        <div className="border border-teal-500/20 p-4 font-mono text-[10px] text-teal-500/60 leading-relaxed">
          <div className="text-teal-400/80">{'// SYSTEM STATUS'}</div>
          <div>CONNECTION: <span className="text-teal-400">SECURED</span></div>
          <div>CAMERAS: <span className="text-teal-400">ONLINE</span></div>
          <div>NETWORK: <span className="text-teal-400">ACTIVE</span></div>
        </div>
      </div>
    </section>
  )
}
