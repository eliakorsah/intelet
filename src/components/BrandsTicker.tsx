'use client'

import Image from 'next/image'
import Link from 'next/link'

const brands = [
  { name: 'Hikvision',   logo: '/hik.png',         slug: 'hikvision' },
  { name: 'Dahua',       logo: '/dahu.jpg',         slug: 'dahua' },
  { name: 'TP-Link',     logo: '/ti.png',           slug: 'tp-link' },
  { name: 'D-Link',      logo: '/dlink.png',        slug: 'd-link' },
  { name: 'Panasonic',   logo: '/pana.png',         slug: 'panasonic' },
  { name: 'Hi-Look',     logo: '/hilook-seeklogo.png',      slug: 'hi-look' },
  { name: 'Grandstream', logo: '/grandstream.png',  slug: 'grandstream' },
  { name: 'Alfama',      logo: '/LOGO ALFAMA-bsl-rvb.png', slug: 'alfama' },
]

// Duplicate for seamless infinite loop
const items = [...brands, ...brands]

export default function BrandsTicker() {
  return (
    <div
      style={{
        background: '#ffffff',
        borderBottom: '1px solid #eef0f4',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Fade edges */}
      <div style={{
        position: 'absolute', left: 0, top: 0, bottom: 0, width: '80px', zIndex: 2,
        background: 'linear-gradient(to right, #ffffff, transparent)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'absolute', right: 0, top: 0, bottom: 0, width: '80px', zIndex: 2,
        background: 'linear-gradient(to left, #ffffff, transparent)',
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
          animation: brandScroll 28s linear infinite;
        }
        .brands-track:hover {
          animation-play-state: paused;
        }
      `}</style>

      <div className="brands-track">
        {items.map((brand, i) => (
          <Link
            key={i}
            href={`/products?brand=${brand.name}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 28px',
              borderRight: '1px solid #f0f2f5',
              textDecoration: 'none',
              flexShrink: 0,
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(0,196,154,0.04)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background = 'transparent' }}
          >
            <div style={{
              width: '32px', height: '32px', borderRadius: '8px',
              border: '1px solid #e5e7eb', background: '#fff',
              overflow: 'hidden', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '3px',
            }}>
              <Image
                src={brand.logo}
                alt={brand.name}
                width={26} height={26}
                className="object-contain"
                style={{ width: '100%', height: '100%' }}
              />
            </div>
            <span style={{
              fontFamily: 'inherit',
              fontWeight: 700,
              fontSize: '11px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: '#374151',
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
