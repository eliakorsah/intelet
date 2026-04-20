'use client'

import Image from 'next/image'
import Link from 'next/link'
import { PARTNER_BRANDS, COLORS } from '@/lib/brand'

// Duplicate for seamless infinite loop
const items = [...PARTNER_BRANDS, ...PARTNER_BRANDS]

export default function BrandsTicker() {
  return (
    <div
      style={{
        background: COLORS.white,
        borderTop: `1px solid ${COLORS.ashLine}`,
        borderBottom: `1px solid ${COLORS.ashLine}`,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Fade edges */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: '80px', zIndex: 2,
        background: `linear-gradient(to right, ${COLORS.white}, transparent)`,
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: '80px', zIndex: 2,
        background: `linear-gradient(to left, ${COLORS.white}, transparent)`,
        pointerEvents: 'none',
      }} />

      <style>{`
        @keyframes brandScroll {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .brands-track {
          display: flex;
          align-items: center;
          width: max-content;
          animation: brandScroll 32s linear infinite;
        }
        .brands-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="brands-track">
        {items.map((brand, i) => (
          <Link
            key={i}
            href={`/products?brand=${encodeURIComponent(brand.name)}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              padding: '12px 32px',
              borderRight: `1px solid ${COLORS.ashLine}`,
              textDecoration: 'none',
              flexShrink: 0,
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(200,16,46,0.05)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent' }}
          >
            <div style={{
              width: '36px', height: '36px', borderRadius: '8px',
              border: `1px solid ${COLORS.ashLine}`, background: COLORS.white,
              overflow: 'hidden', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '4px',
            }}>
              <Image
                src={brand.logo}
                alt={brand.name}
                width={28} height={28}
                className="object-contain"
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <span style={{
              fontFamily: "'Rajdhani', sans-serif",
              fontWeight: 700,
              fontSize: '12px',
              letterSpacing: '0.14em',
              textTransform: 'uppercase',
              color: brand.accent ?? COLORS.ink,
              whiteSpace: 'nowrap',
            }}>
              {brand.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  )
}
