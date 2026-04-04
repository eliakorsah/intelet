'use client'

import { useState } from 'react'
import Image from 'next/image'

const TEAL = '#00c49a'

interface Props { images: string[]; title: string }

export default function ProductImageGallery({ images, title }: Props) {
  const [active, setActive] = useState(0)
  const [zoomed, setZoomed] = useState(false)

  if (!images.length) {
    return (
      <div className="aspect-[4/3] rounded-2xl bg-gray-100 flex items-center justify-center text-gray-300 text-6xl">
        📦
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 lg:sticky lg:top-24">
      {/* Main image */}
      <div
        className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gray-100 cursor-zoom-in"
        onClick={() => setZoomed(true)}
      >
        <Image
          key={active}
          src={images[active]}
          alt={title}
          fill
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold text-white"
            style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(6px)' }}>
            {active + 1} / {images.length}
          </div>
        )}
        <div className="absolute top-3 right-3 px-2.5 py-1.5 rounded-lg text-[10px] font-mono text-white opacity-0 hover:opacity-100 transition-opacity"
          style={{ background: 'rgba(0,0,0,0.4)' }}>
          Click to zoom
        </div>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button key={i} onClick={() => setActive(i)}
              className="relative flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden transition-all duration-200"
              style={{
                border: `2px solid ${i === active ? TEAL : '#e5e7eb'}`,
                opacity: i === active ? 1 : 0.65,
              }}>
              <Image src={img} alt={`${title} ${i + 1}`} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {zoomed && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          onClick={() => setZoomed(false)}>
          <div className="relative w-full max-w-3xl aspect-[4/3]" onClick={e => e.stopPropagation()}>
            <Image src={images[active]} alt={title} fill className="object-contain rounded-xl" sizes="90vw" />
          </div>
          <button onClick={() => setZoomed(false)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors text-xl font-black">
            ×
          </button>
          {images.length > 1 && (
            <>
              <button onClick={e => { e.stopPropagation(); setActive(i => (i - 1 + images.length) % images.length) }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors font-black">
                ‹
              </button>
              <button onClick={e => { e.stopPropagation(); setActive(i => (i + 1) % images.length) }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white hover:bg-white/20 transition-colors font-black">
                ›
              </button>
            </>
          )}
        </div>
      )}
    </div>
  )
}
