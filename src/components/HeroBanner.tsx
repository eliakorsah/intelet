'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { COMPANY, COLORS } from '@/lib/brand'
import { supabase } from '@/lib/supabase'

const RED = COLORS.red
const FALLBACK_HERO = ['/hero.png']

// Full-width hero banner shown between the navbar and the brands ticker on the
// home page. Images are admin-managed (table: hero_images); falls back to /hero.png.
export default function HeroBanner() {
  const [current, setCurrent] = useState(0)
  const [images,  setImages]  = useState<string[]>(FALLBACK_HERO)

  useEffect(() => {
    supabase.from('hero_images').select('url').order('sort_order', { ascending: true })
      .then(({ data }) => {
        const urls = (data || []).map((d: any) => d.url).filter(Boolean)
        if (urls.length) { setImages(urls); setCurrent(0) }
      })
  }, [])

  useEffect(() => {
    if (images.length < 2) return
    const timer = setInterval(() => {
      setCurrent(c => (c + 1) % images.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [images.length])

  return (
    <div className="relative w-full overflow-hidden" style={{ background: COLORS.ash }}>
      <div className="relative w-full overflow-hidden" style={{ height: 'clamp(200px, 42vw, 680px)' }}>
        {images.map((src, i) => {
          const isActive = i === current
          return (
            <div
              key={`${src}-${i}`}
              style={{
                position: 'absolute', inset: 0,
                opacity: isActive ? 1 : 0,
                transition: 'opacity 0.9s ease-in-out',
                zIndex: isActive ? 2 : 1,
                willChange: 'opacity',
              }}
            >
              <Image
                src={src}
                alt={`${COMPANY.name} hero ${i + 1}`}
                fill
                className="object-cover"
                sizes="100vw"
                priority={i === 0}
              />
            </div>
          )
        })}

        {/* Soft white fade at the base */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none z-[5]"
          style={{ height: '22%', background: `linear-gradient(to top, ${COLORS.white} 0%, transparent 100%)` }}
        />
      </div>

      {images.length > 1 && (
        <div className="absolute left-1/2 -translate-x-1/2 bottom-3 flex gap-1.5 z-10">
          {images.map((_, i) => (
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
      )}
    </div>
  )
}
