'use client'

import { useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, Package } from 'lucide-react'
import { getImageUrl } from '@/utils'

interface ProductImageGalleryProps {
  images: string[]
  title: string
}

export default function ProductImageGallery({ images, title }: ProductImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0)
  const hasImages = images.length > 0

  if (!hasImages) {
    return (
      <div className="cyber-card aspect-square flex items-center justify-center">
        <Package className="w-24 h-24 text-teal-500/20" />
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative aspect-square cyber-card overflow-hidden bg-navy-800 group">
        <Image
          src={getImageUrl(images[activeIndex])}
          alt={title}
          fill
          className="object-contain p-4"
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
        />

        {/* Arrow navigation */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActiveIndex((i) => (i - 1 + images.length) % images.length)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-navy-900/80 border border-teal-500/30 flex items-center justify-center text-teal-400 hover:bg-teal-500/20 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => setActiveIndex((i) => (i + 1) % images.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-navy-900/80 border border-teal-500/30 flex items-center justify-center text-teal-400 hover:bg-teal-500/20 transition-all opacity-0 group-hover:opacity-100"
              aria-label="Next image"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </>
        )}

        {/* Index indicator */}
        {images.length > 1 && (
          <div className="absolute bottom-3 right-3 bg-navy-900/80 border border-teal-500/20 px-2 py-1 font-mono text-[10px] text-teal-400">
            {activeIndex + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {images.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative aspect-square overflow-hidden border transition-all ${
                activeIndex === index
                  ? 'border-teal-500'
                  : 'border-teal-500/20 hover:border-teal-500/50'
              }`}
            >
              <Image
                src={getImageUrl(img)}
                alt={`${title} view ${index + 1}`}
                fill
                className="object-contain p-1"
                sizes="80px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
