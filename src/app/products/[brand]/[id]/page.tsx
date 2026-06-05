import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import ProductImageGallery from '@/components/ProductImageGallery'
import { COMPANY, COLORS, PARTNER_BRANDS, whatsappLink } from '@/lib/brand'

const RED = COLORS.red

// Cache each product page for 5 min (ISR) so crawler/visitor traffic doesn't
// hit Supabase on every request. Admin edits still appear within ~5 minutes.
export const revalidate = 300

const brandLogos: Record<string, string> = Object.fromEntries(
  PARTNER_BRANDS.map(b => [b.name, b.logo])
)

export async function generateMetadata(
  { params }: { params: Promise<{ brand: string; id: string }> }
): Promise<Metadata> {
  const { brand: rawBrand, id } = await params
  const brand = decodeURIComponent(rawBrand)
  const { data } = await supabase.from('products').select('title, description, model_number, images, price').eq('id', id).limit(1)
  const p = data?.[0]
  if (!p) return { title: 'Product Not Found' }

  const title = `${p.title} — ${brand} | ${COMPANY.name}`
  const description = p.description
    ? `${p.description.slice(0, 150)}… Buy ${p.title} (${p.model_number}) from ${COMPANY.name}. ${p.price ? `GH₵ ${p.price.toLocaleString()}.` : ''} 12-month warranty, delivery available.`
    : `Buy ${p.title} (${p.model_number}) from ${COMPANY.name}. Genuine ${brand} with a 12-month warranty.`
  const image = p.images?.[0]

  return {
    title,
    description,
    keywords: [p.title, p.model_number, brand, 'Ghana', 'buy', 'price', COMPANY.name, 'home appliance'],
    openGraph: {
      title,
      description,
      url: `${COMPANY.baseUrl}/products/${encodeURIComponent(brand)}/${id}`,
      images: image ? [{ url: image, alt: p.title }] : [{ url: '/preview.jpg' }],
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description, images: image ? [image] : ['/preview.jpg'] },
    alternates: { canonical: `${COMPANY.baseUrl}/products/${encodeURIComponent(brand)}/${id}` },
  }
}

const IconArrow = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
)
const IconCheck = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="m5 12 5 5L20 7"/>
  </svg>
)
const IconPhone = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9a16 16 0 0 0 6 6l1.15-.95a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
)
const IconWhatsApp = ({ size = 18 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
  </svg>
)

export default async function ProductPage({
  params,
}: {
  params: Promise<{ brand: string; id: string }>
}) {
  const { id } = await params

  const { data: rows, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .limit(1)

  if (error?.message) console.error('Supabase error:', error.message)

  const product = rows?.[0] ?? null
  if (!product) notFound()

  const { data: related } = await supabase
    .from('products')
    .select('*')
    .eq('brand', product.brand)
    .eq('in_stock', true)
    .neq('id', id)
    .limit(4)

  const waMsg = encodeURIComponent(`Hello ${COMPANY.name}, I'm interested in the *${product.title}* (${product.model_number}). Please share pricing and availability.`)
  const waUrl = whatsappLink(waMsg)
  const logo  = brandLogos[product.brand]
  const images = (product.images || []).filter(Boolean)
  const specs  = product.specifications && Object.keys(product.specifications).length > 0
    ? product.specifications as Record<string, string> : null

  // Absolute image URLs for structured data (Google prefers absolute).
  const absImages = images.map((u: string) => (u.startsWith('http') ? u : `${COMPANY.baseUrl}${u}`))
  const productUrl = `${COMPANY.baseUrl}/products/${encodeURIComponent(product.brand)}/${product.id}`

  // Product rich-result schema (price, availability, brand → Google snippet).
  const productLd: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    sku: product.model_number,
    mpn: product.model_number,
    brand: { '@type': 'Brand', name: product.brand },
    description: product.description || `${product.title} (${product.model_number}) — genuine ${product.brand} with a 12-month warranty at ${COMPANY.name}, Accra.`,
    ...(absImages.length ? { image: absImages } : {}),
    ...(product.price != null ? {
      offers: {
        '@type': 'Offer',
        url: productUrl,
        priceCurrency: 'GHS',
        price: Number(product.price),
        itemCondition: 'https://schema.org/NewCondition',
        availability: product.in_stock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
        seller: { '@type': 'Organization', name: COMPANY.name },
      },
    } : {}),
  }

  const breadcrumbLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: COMPANY.baseUrl },
      { '@type': 'ListItem', position: 2, name: 'Products', item: `${COMPANY.baseUrl}/products` },
      { '@type': 'ListItem', position: 3, name: product.brand, item: `${COMPANY.baseUrl}/products?brand=${encodeURIComponent(product.brand)}` },
      { '@type': 'ListItem', position: 4, name: product.title, item: productUrl },
    ],
  }

  return (
    <div style={{ background: COLORS.ash, minHeight: '100vh' }}>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }} />

      {/* Breadcrumb */}
      <div style={{ background: COLORS.white, borderBottom: `1px solid ${COLORS.ashLine}` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-2 text-xs font-mono flex-wrap" style={{ color: COLORS.inkMuted }}>
          <Link href="/" className="transition-colors hover:text-[#C8102E]">Home</Link>
          <span>/</span>
          <Link href="/products" className="transition-colors hover:text-[#C8102E]">Products</Link>
          <span>/</span>
          <Link href={`/products?brand=${encodeURIComponent(product.brand)}`} className="transition-colors hover:text-[#C8102E]">{product.brand}</Link>
          <span>/</span>
          <span className="truncate max-w-[180px]" style={{ color: COLORS.ink }}>{product.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 mb-16">

          <ProductImageGallery images={images} title={product.title} />

          <div className="flex flex-col">
            {/* Brand row */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center bg-white flex-shrink-0"
                style={{ border: `1px solid ${COLORS.ashLine}`, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                {logo
                  ? <Image src={logo} alt={product.brand} width={32} height={32} className="object-contain w-8 h-8" />
                  : <span className="text-[8px] font-black text-center px-1 leading-tight" style={{ color: COLORS.inkSoft }}>{product.brand}</span>
                }
              </div>
              <div>
                <p className="font-mono text-[10px] tracking-widest font-bold uppercase" style={{ color: RED }}>{product.brand}</p>
                <p className="font-mono text-[10px] tracking-wider" style={{ color: COLORS.inkMuted }}>{product.model_number}</p>
              </div>
              {product.featured && (
                <span
                  className="ml-auto px-2.5 py-1 rounded-full text-[9px] font-mono font-bold tracking-wider flex-shrink-0"
                  style={{ background: COLORS.redSoft, color: RED, border: `1px solid ${RED}` }}
                >
                  ★ FEATURED
                </span>
              )}
            </div>

            <h1 className="font-black mb-4 leading-tight" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)', color: COLORS.ink }}>
              {product.title}
            </h1>

            <div className="flex items-center gap-2 flex-wrap mb-6">
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold"
                style={product.in_stock
                  ? { background: COLORS.redSoft, color: RED, border: `1px solid ${RED}` }
                  : { background: 'rgba(239,68,68,0.1)', color: '#b91c1c', border: '1px solid rgba(239,68,68,0.25)' }}
              >
                {product.in_stock ? '● In Stock' : '○ Out of Stock'}
              </span>
              {product.category && (
                <span className="px-3 py-1.5 rounded-lg text-[11px] font-mono" style={{ background: COLORS.ash, color: COLORS.inkSoft }}>
                  {product.category}
                </span>
              )}
              <span
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold"
                style={{ background: COLORS.white, color: COLORS.ink, border: `1px solid ${COLORS.ashLine}` }}
              >
                12-MONTH WARRANTY
              </span>
            </div>

            {product.price != null && (
              <div className="mb-6 pb-6" style={{ borderBottom: `1px solid ${COLORS.ashLine}` }}>
                <p className="text-[9px] font-mono tracking-widest mb-1" style={{ color: COLORS.inkMuted }}>
                  {product.price_old != null && product.price_old > product.price ? 'WORLD CUP PROMO' : 'PRICE'}
                </p>
                <div className="flex items-baseline gap-3 flex-wrap">
                  <p className="font-black" style={{ fontSize: '2.4rem', color: RED, lineHeight: 1 }}>
                    GH₵ {product.price.toLocaleString()}
                  </p>
                  {product.price_old != null && product.price_old > product.price && (
                    <p className="font-bold text-xl line-through" style={{ color: COLORS.inkMuted }}>
                      GH₵ {product.price_old.toLocaleString()}
                    </p>
                  )}
                </div>
                {product.price_old != null && product.price_old > product.price && (
                  <span className="inline-block mt-2 px-2.5 py-1 rounded-md text-[11px] font-black tracking-wider text-white uppercase"
                    style={{ background: RED }}>
                    Save GH₵ {(product.price_old - product.price).toLocaleString()}
                  </span>
                )}
              </div>
            )}

            {product.description && (
              <p className="text-sm leading-relaxed mb-6" style={{ color: COLORS.inkSoft }}>{product.description}</p>
            )}

            {specs && (
              <div className="grid grid-cols-2 gap-2 mb-7">
                {Object.entries(specs).slice(0, 4).map(([k, v]) => (
                  <div key={k} className="p-3 rounded-xl" style={{ background: COLORS.white, border: `1px solid ${COLORS.ashLine}` }}>
                    <p className="text-[8px] font-mono tracking-widest uppercase mb-0.5" style={{ color: COLORS.inkMuted }}>{k}</p>
                    <p className="text-xs font-bold" style={{ color: COLORS.ink }}>{v}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <a
                href={waUrl}
                target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2.5 py-4 rounded-xl font-black text-sm tracking-widest text-white uppercase transition-all hover:opacity-90 active:scale-95"
                style={{ background: '#25D366' }}
              >
                <IconWhatsApp size={17} /> Order on WhatsApp
              </a>
              <a
                href={`tel:${COMPANY.phones.primary}`}
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-black text-sm tracking-widest uppercase transition-all duration-200"
                style={{ border: `2px solid ${COLORS.ink}`, color: COLORS.ink, background: COLORS.white }}
              >
                <IconPhone /> Call Us
              </a>
            </div>

            <div
              className="flex flex-wrap gap-3 mt-4 p-4 rounded-xl"
              style={{ background: COLORS.redSoft, border: `1px solid ${RED}40` }}
            >
              {['12-month warranty', 'Delivery available', 'Cash or Mobile Money'].map(item => (
                <div key={item} className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: RED }}>
                    <span style={{ color: COLORS.white, display: 'flex' }}><IconCheck /></span>
                  </span>
                  <span className="text-xs" style={{ color: COLORS.ink }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {specs && (
          <div
            className="rounded-2xl p-6 sm:p-8 mb-16"
            style={{ background: COLORS.white, border: `1px solid ${COLORS.ashLine}`, boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}
          >
            <h2 className="font-black text-xl mb-6 tracking-tight" style={{ color: COLORS.ink }}>Full Specifications</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(specs).map(([k, v]) => (
                <div key={k} className="p-3 rounded-xl" style={{ background: COLORS.ash }}>
                  <p className="text-[9px] font-mono tracking-widest uppercase mb-1" style={{ color: COLORS.inkMuted }}>{k}</p>
                  <p className="text-sm font-bold" style={{ color: COLORS.ink }}>{v}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {related && related.length > 0 && (
          <div>
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="font-mono text-[10px] tracking-[0.35em] uppercase mb-1.5" style={{ color: RED }}>
                  More from {product.brand}
                </p>
                <h2 className="font-black text-2xl tracking-tight" style={{ color: COLORS.ink }}>Related Products</h2>
              </div>
              <Link
                href={`/products?brand=${encodeURIComponent(product.brand)}`}
                className="flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase transition-all hover:gap-2.5"
                style={{ color: RED }}
              >
                View All <IconArrow />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((p: any) => {
                const rImgs = (p.images || []).filter(Boolean)
                return (
                  <Link
                    key={p.id}
                    href={`/products/${encodeURIComponent(p.brand)}/${p.id}`}
                    className="group rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                    style={{ background: COLORS.white, border: `1px solid ${COLORS.ashLine}`, boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}
                  >
                    <div className="relative overflow-hidden" style={{ aspectRatio: '4/3', background: COLORS.ash }}>
                      {rImgs[0]
                        ? <Image src={rImgs[0]} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="25vw" />
                        : <div className="flex items-center justify-center h-full text-4xl">📦</div>
                      }
                    </div>
                    <div className="p-3 sm:p-4">
                      <p className="text-[9px] font-mono tracking-widest mb-1" style={{ color: COLORS.inkMuted }}>{p.model_number}</p>
                      <h3 className="font-bold text-xs sm:text-sm line-clamp-2 leading-snug transition-colors" style={{ color: COLORS.ink }}>{p.title}</h3>
                      {p.price && <p className="font-black text-base mt-2" style={{ color: RED }}>GH₵ {p.price.toLocaleString()}</p>}
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
