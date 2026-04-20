'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { COLORS } from '@/lib/brand'

const RED = COLORS.red

interface Props {
  brands: string[]
  logos: Record<string, string>
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function BrandsGrid({ brands, logos }: Props) {
  const [order, setOrder]   = useState<string[]>(brands)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      // fade out
      setFading(true)
      setTimeout(() => {
        setOrder(prev => shuffle(prev))
        // fade back in
        setTimeout(() => setFading(false), 80)
      }, 350)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
      {order.map((brand) => (
        <Link
          key={brand}
          href={`/products?brand=${brand}`}
          className="group flex flex-col items-center justify-center p-5 rounded-2xl border transition-all duration-500 text-center aspect-square"
          style={{
            background: 'white',
            borderColor: '#e5e7eb',
            opacity: fading ? 0 : 1,
            transform: fading ? 'scale(0.94)' : 'scale(1)',
            transition: 'opacity 0.35s ease, transform 0.35s ease, border-color 0.2s, box-shadow 0.2s',
          }}
          onMouseEnter={e => {
            const el = e.currentTarget
            el.style.borderColor = RED
            el.style.boxShadow = '0 8px 30px rgba(200,16,46,0.14)'
            el.style.transform = 'translateY(-3px)'
          }}
          onMouseLeave={e => {
            const el = e.currentTarget
            el.style.borderColor = '#e5e7eb'
            el.style.boxShadow = 'none'
            el.style.transform = fading ? 'scale(0.94)' : 'scale(1)'
          }}
        >
          <div className="w-12 h-12 flex items-center justify-center mb-2.5">
            <Image
              src={logos[brand] || '/placeholder.png'}
              alt={brand}
              width={44} height={44}
              className="object-contain w-full h-full transition-transform duration-300 group-hover:scale-110"
            />
          </div>
          <span
            className="font-heading font-bold text-[9px] tracking-widest transition-colors leading-tight uppercase"
            style={{ color: COLORS.inkSoft }}
          >
            {brand}
          </span>
        </Link>
      ))}
    </div>
  )
}
