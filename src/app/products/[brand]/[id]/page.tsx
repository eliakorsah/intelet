import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import ProductImageGallery from '@/components/ProductImageGallery'

export async function generateMetadata(
  { params }: { params: Promise<{ brand: string; id: string }> }
): Promise<Metadata> {
  const { brand: rawBrand, id } = await params
  const brand = decodeURIComponent(rawBrand)
  const { data } = await supabase.from('products').select('title, description, model_number, images, price').eq('id', id).limit(1)
  const p = data?.[0]
  if (!p) return { title: 'Product Not Found' }

  const title = `${p.title} — ${brand} | Tritech Technologies Ghana`
  const description = p.description
    ? `${p.description.slice(0, 150)}... Buy ${p.title} (${p.model_number}) from Tritech Technologies Ghana. ${p.price ? `GH₵ ${p.price.toLocaleString()}.` : ''} Authorized dealer with nationwide delivery.`
    : `Buy ${p.title} (${p.model_number}) from Tritech Technologies Ghana. Authorized ${brand} dealer with genuine products and nationwide delivery.`
  const image = p.images?.[0]

  return {
    title,
    description,
    keywords: [p.title, p.model_number, brand, 'Ghana', 'buy', 'price', 'Tritech Technologies'],
    openGraph: {
      title,
      description,
      url: `https://www.tritechtechnologiesltd.com/products/${encodeURIComponent(brand)}/${id}`,
      images: image ? [{ url: image, alt: p.title }] : [{ url: '/preview.jpg' }],
      type: 'website',
    },
    twitter: { card: 'summary_large_image', title, description, images: image ? [image] : ['/preview.jpg'] },
    alternates: { canonical: `https://www.tritechtechnologiesltd.com/products/${encodeURIComponent(brand)}/${id}` },
  }
}

const TEAL = '#00c49a'
const WA_NUMBER = '233555517658'

const brandLogos: Record<string, string> = {
  'Hikvision': '/hik.png', 'Dahua': '/dahu.jpg', 'TP-Link': '/ti.png',
  'Hi-Look': '/hi-look.png', 'Grandstream': '/grandstream.png', 'Alfama': '/alfama.png',
  'D-Link': '/dlink.png', 'Panasonic': '/pana.png',
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
  // Next.js 15+ — params is always a Promise, must be awaited
  const { brand: rawBrand, id } = await params
  const brand = decodeURIComponent(rawBrand)

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

  const waMsg = encodeURIComponent(`Hello, I'm interested in the *${product.title}* (${product.model_number}). Please provide pricing and availability.`)
  const waUrl = `https://wa.me/${WA_NUMBER}?text=${waMsg}`
  const logo  = brandLogos[product.brand]
  const images = (product.images || []).filter(Boolean)
  const specs  = product.specifications && Object.keys(product.specifications).length > 0
    ? product.specifications as Record<string, string> : null

  return (
    <div style={{ background: '#f7f8fc', minHeight: '100vh' }}>

      {/* Breadcrumb */}
      <div style={{ background: '#fff', borderBottom: '1px solid #eef0f4' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-2 text-xs font-mono flex-wrap" style={{ color: '#9ca3af' }}>
          <Link href="/" className="hover:text-[#00c49a] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-[#00c49a] transition-colors">Products</Link>
          <span>/</span>
          <Link href={`/products?brand=${product.brand}`} className="hover:text-[#00c49a] transition-colors">{product.brand}</Link>
          <span>/</span>
          <span className="truncate max-w-[180px]" style={{ color: '#4b5563' }}>{product.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 mb-16">

          <ProductImageGallery images={images} title={product.title} />

          <div className="flex flex-col">
            {/* Brand row */}
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl overflow-hidden flex items-center justify-center bg-white border border-gray-200 shadow-sm flex-shrink-0">
                {logo
                  ? <Image src={logo} alt={product.brand} width={32} height={32} className="object-contain w-8 h-8" />
                  : <span className="text-[8px] font-black text-gray-600 text-center px-1 leading-tight">{product.brand}</span>
                }
              </div>
              <div>
                <p className="font-mono text-[10px] tracking-widest font-bold uppercase" style={{ color: TEAL }}>{product.brand}</p>
                <p className="font-mono text-[10px] tracking-wider" style={{ color: '#9ca3af' }}>{product.model_number}</p>
              </div>
              {product.featured && (
                <span className="ml-auto px-2.5 py-1 rounded-full text-[9px] font-mono font-bold tracking-wider flex-shrink-0"
                  style={{ background: 'rgba(251,191,36,0.12)', color: '#f59e0b', border: '1px solid rgba(251,191,36,0.25)' }}>
                  ★ FEATURED
                </span>
              )}
            </div>

            <h1 className="font-black text-[#0d1117] mb-4 leading-tight" style={{ fontSize: 'clamp(1.4rem, 3vw, 2rem)' }}>
              {product.title}
            </h1>

            <div className="flex items-center gap-2 flex-wrap mb-6">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-mono font-bold"
                style={product.in_stock
                  ? { background: 'rgba(0,196,154,0.1)', color: TEAL, border: '1px solid rgba(0,196,154,0.25)' }
                  : { background: 'rgba(239,68,68,0.1)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }}>
                {product.in_stock ? '● In Stock' : '○ Out of Stock'}
              </span>
              {product.category && (
                <span className="px-3 py-1.5 rounded-lg text-[11px] font-mono" style={{ background: '#f0f4ff', color: '#6b7280' }}>
                  {product.category}
                </span>
              )}
            </div>

            {product.price && (
              <div className="mb-6 pb-6" style={{ borderBottom: '1px solid #eef0f4' }}>
                <p className="text-[9px] font-mono tracking-widest mb-1" style={{ color: '#9ca3af' }}>PRICE</p>
                <p className="font-black" style={{ fontSize: '2.4rem', color: TEAL, lineHeight: 1 }}>
                  GH₵ {product.price.toLocaleString()}
                </p>
              </div>
            )}

            {product.description && (
              <p className="text-sm leading-relaxed mb-6" style={{ color: '#6b7280' }}>{product.description}</p>
            )}

            {specs && (
              <div className="grid grid-cols-2 gap-2 mb-7">
                {Object.entries(specs).slice(0, 4).map(([k, v]) => (
                  <div key={k} className="p-3 rounded-xl bg-white border border-gray-100">
                    <p className="text-[8px] font-mono tracking-widest uppercase mb-0.5" style={{ color: '#9ca3af' }}>{k}</p>
                    <p className="text-xs font-bold" style={{ color: '#1f2937' }}>{v}</p>
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-3 mt-auto">
              <a href={waUrl} target="_blank" rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2.5 py-4 rounded-xl font-black text-sm tracking-widest text-white uppercase transition-all hover:opacity-90 active:scale-95"
                style={{ background: '#25D366' }}>
                <IconWhatsApp size={17} /> Order on WhatsApp
              </a>
              <a href="tel:+233555517658"
                className="flex items-center justify-center gap-2 px-6 py-4 rounded-xl font-black text-sm tracking-widest uppercase border-2 border-[#0d1117] text-[#0d1117] hover:bg-[#0d1117] hover:text-white transition-all duration-200">
                <IconPhone /> Call Us
              </a>
            </div>

            <div className="flex flex-wrap gap-3 mt-4 p-4 rounded-xl"
              style={{ background: 'rgba(0,196,154,0.05)', border: '1px solid rgba(0,196,154,0.12)' }}>
              {['Free delivery in Ghana', 'Warranty included', 'Expert installation'].map(item => (
                <div key={item} className="flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0"
                    style={{ background: 'rgba(0,196,154,0.15)' }}>
                    <span style={{ color: TEAL, display: 'flex' }}><IconCheck /></span>
                  </span>
                  <span className="text-xs" style={{ color: '#4b5563' }}>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {specs && (
          <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 mb-16"
            style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
            <h2 className="font-black text-[#0d1117] text-xl mb-6 tracking-tight">Full Specifications</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {Object.entries(specs).map(([k, v]) => (
                <div key={k} className="p-3 rounded-xl" style={{ background: '#f7f8fc' }}>
                  <p className="text-[9px] font-mono tracking-widest uppercase mb-1" style={{ color: '#9ca3af' }}>{k}</p>
                  <p className="text-sm font-bold" style={{ color: '#1f2937' }}>{v}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {related && related.length > 0 && (
          <div>
            <div className="flex items-end justify-between mb-8">
              <div>
                <p className="font-mono text-[10px] tracking-[0.35em] uppercase mb-1.5" style={{ color: TEAL }}>
                  More from {product.brand}
                </p>
                <h2 className="font-black text-[#0d1117] text-2xl tracking-tight">Related Products</h2>
              </div>
              <Link href={`/products?brand=${product.brand}`}
                className="flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase transition-all hover:gap-2.5"
                style={{ color: TEAL }}>
                View All <IconArrow />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((p: any) => {
                const rImgs = (p.images || []).filter(Boolean)
                return (
                  <Link key={p.id} href={`/products/${encodeURIComponent(p.brand)}/${p.id}`}
                    className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:border-[#00c49a] hover:-translate-y-1 hover:shadow-xl transition-all duration-300"
                    style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                    <div className="relative overflow-hidden bg-gray-100" style={{ aspectRatio: '4/3' }}>
                      {rImgs[0]
                        ? <Image src={rImgs[0]} alt={p.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="25vw" />
                        : <div className="flex items-center justify-center h-full text-4xl">📦</div>
                      }
                    </div>
                    <div className="p-3 sm:p-4">
                      <p className="text-[9px] font-mono tracking-widest mb-1" style={{ color: '#9ca3af' }}>{p.model_number}</p>
                      <h3 className="font-bold text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-[#00c49a] transition-colors" style={{ color: '#0d1117' }}>{p.title}</h3>
                      {p.price && <p className="font-black text-base mt-2" style={{ color: TEAL }}>GH₵ {p.price.toLocaleString()}</p>}
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