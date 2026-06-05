// @refresh reset
'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { COMPANY, COLORS, PARTNER_BRANDS } from '@/lib/brand'

const BRAND_LOGOS: Record<string, string> = Object.fromEntries(
  PARTNER_BRANDS.map(b => [b.name.toLowerCase(), b.logo])
)

const RED = COLORS.red
const WA_NUMBER = COMPANY.whatsapp.number

const IconBox = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m7.5 4.27 9 5.15"/>
    <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/>
    <path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/>
  </svg>
)
const IconEye = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)
const IconWA = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
)

interface Product {
  id: string
  title: string
  model_number: string
  description?: string
  price?: number
  price_old?: number | null
  brand: string
  images?: string[]
  in_stock: boolean
  [key: string]: any
}

// Name changed to InteletProductCard to bust Turbopack module cache
function InteletProductCard({ product }: { product: Product }) {
  const images   = (product.images || []).filter(Boolean)
  const hasMulti = images.length > 1

  const [mounted,  setMounted]  = useState(false)
  const [imgIdx,   setImgIdx]   = useState(0)
  const [imgError, setImgError] = useState(false)
  const timer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => { setMounted(true) }, [])

  const stop = useCallback(() => {
    if (timer.current) { clearInterval(timer.current); timer.current = null }
  }, [])

  const start = useCallback(() => {
    if (!hasMulti) return
    stop()
    timer.current = setInterval(() => {
      setImgIdx(i => (i + 1) % images.length)
      setImgError(false)
    }, 3000)
  }, [hasMulti, images.length, stop])

  useEffect(() => () => stop(), [stop])

  const goTo = (i: number, e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    setImgIdx(i); setImgError(false); stop()
    setTimeout(start, 4000)
  }

  const waUrl = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(
    `Hello, I'm interested in the ${product.title} (${product.model_number}). Can you provide more details?`
  )}`
  const src     = mounted ? (images[imgIdx] || '') : (images[0] || '')
  const showImg = !!src && !imgError

  return (
    <div
      className="rounded-2xl bg-white overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl"
      style={{ border: '1px solid #e5e7eb', boxShadow: '0 1px 6px rgba(0,0,0,0.05)' }}
      onMouseEnter={() => { if (mounted && hasMulti) start() }}
      onMouseLeave={() => { if (mounted) stop() }}
    >
      <div className="relative bg-gray-100 overflow-hidden" style={{ aspectRatio: '4/3' }}>
        {showImg ? (
          <Image
            key={mounted ? imgIdx : 0}
            src={src}
            alt={product.title}
            fill
            className="object-cover transition-transform duration-700"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2.5 px-4"
            style={{ background: `linear-gradient(135deg, ${COLORS.ash} 0%, ${COLORS.ashDeep} 100%)` }}>
            {BRAND_LOGOS[product.brand?.toLowerCase()] ? (
              <Image src={BRAND_LOGOS[product.brand.toLowerCase()]} alt={product.brand}
                width={88} height={40} className="object-contain max-h-9 w-auto opacity-90" />
            ) : (
              <span className="font-black tracking-tight text-lg" style={{ color: COLORS.inkSoft }}>{product.brand}</span>
            )}
            <span style={{ color: COLORS.inkMuted }}><IconBox /></span>
            <span className="text-[8px] font-mono tracking-[0.25em] uppercase" style={{ color: COLORS.inkMuted }}>
              Image coming soon
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

        <div className="absolute top-3 right-3 px-2 py-0.5 rounded-lg text-[9px] font-mono tracking-wider font-bold"
          style={product.in_stock
            ? { background: COLORS.white, color: RED, border: `1px solid ${RED}` }
            : { background: 'rgba(239,68,68,0.15)', color: '#b91c1c', border: '1px solid rgba(239,68,68,0.3)' }}>
          {product.in_stock ? '● IN STOCK' : '○ OUT'}
        </div>

        {mounted && (
          <>
            
            {hasMulti && (
              <div className="absolute bottom-3.5 right-3 flex gap-1 items-center">
                {images.map((_, i) => (
                  <button key={i} onClick={e => goTo(i, e)}
                    className="rounded-full transition-all duration-300"
                    style={{ width: i === imgIdx ? '18px' : '6px', height: '6px', background: i === imgIdx ? RED : 'rgba(255,255,255,0.75)' }} />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex flex-col flex-1 p-2.5 sm:p-3">
        <div className="text-[8px] text-gray-400 font-mono tracking-widest mb-0.5 uppercase truncate">{product.model_number}</div>
        <h3 className="font-bold leading-snug mb-1.5 line-clamp-2 transition-colors"
          style={{ fontSize: '0.8rem', color: COLORS.ink }}>
          {product.title}
        </h3>
        <div className="mt-auto">
          {product.price != null && (
            <div className="mb-2">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-black text-base sm:text-lg" style={{ color: RED }}>
                  GH₵ {product.price.toLocaleString()}
                </span>
                {product.price_old != null && product.price_old > product.price && (
                  <span className="text-sm line-through" style={{ color: COLORS.inkMuted }}>
                    GH₵ {product.price_old.toLocaleString()}
                  </span>
                )}
              </div>
              {product.price_old != null && product.price_old > product.price && (
                <span className="inline-block mt-1.5 px-2 py-0.5 rounded-md text-[10px] font-black tracking-wider text-white uppercase"
                  style={{ background: RED }}>
                  World Cup • Save GH₵ {(product.price_old - product.price).toLocaleString()}
                </span>
              )}
            </div>
          )}
          <div className="flex gap-1.5">
            <Link href={`/products/${encodeURIComponent(product.brand)}/${product.id}`}
              className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[11px] font-black tracking-wide transition-all uppercase"
              style={{ border: `1px solid ${COLORS.ashLine}`, color: COLORS.inkSoft, background: COLORS.white }}>
              <IconEye /> View
            </Link>
            <a href={waUrl} target="_blank" rel="noopener noreferrer"
              className="flex-1 bg-[#25D366] flex items-center justify-center gap-1 py-2 rounded-lg text-[11px] font-black tracking-wide text-white uppercase hover:opacity-90"
              >
              <IconWA /> Order
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InteletProductCard