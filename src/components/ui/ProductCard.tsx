import Link from 'next/link'
import Image from 'next/image'
import { ShoppingCart, Eye, Package } from 'lucide-react'
import { formatPrice, getImageUrl, truncate } from '@/utils'
import { BRANDS } from '@/lib/constants'
import { Product } from '@/types'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const brand = BRANDS.find(b => b.name === product.brand)
  const imageUrl = product.images[0] ? getImageUrl(product.images[0]) : null

  return (
    <div className="cyber-card group relative overflow-hidden rounded-sm">
      {/* Image */}
      <Link href={`/products/${product.brand.toLowerCase().replace(/\s+/g, '-')}/${product.slug}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-navy-800">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Package className="w-12 h-12 text-teal-500/30" />
            </div>
          )}

          {/* Overlay on hover */}
          <div className="absolute inset-0 bg-navy-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
            <span className="flex items-center gap-1 bg-teal-500/80 text-white text-xs font-mono px-3 py-1.5 tracking-wider">
              <Eye className="w-3 h-3" /> VIEW
            </span>
          </div>

          {/* Featured badge */}
          {product.featured && (
            <div className="absolute top-2 left-2 bg-teal-500 text-navy-900 text-[10px] font-display font-700 px-2 py-0.5 tracking-widest uppercase">
              FEATURED
            </div>
          )}

          {/* Stock status */}
          {!product.in_stock && (
            <div className="absolute top-2 right-2 bg-red-500/80 text-white text-[10px] font-mono px-2 py-0.5">
              OUT OF STOCK
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        {/* Brand */}
        <div className="flex items-center gap-2 mb-2">
          {brand && (
            <span
              className="text-[10px] font-mono tracking-widest uppercase px-2 py-0.5"
              style={{
                color: brand.color,
                backgroundColor: `${brand.color}15`,
                border: `1px solid ${brand.color}40`,
              }}
            >
              {brand.name}
            </span>
          )}
          {product.category && (
            <span className="tag text-[10px]">{product.category}</span>
          )}
        </div>

        {/* Title */}
        <Link href={`/products/${product.brand.toLowerCase().replace(/\s+/g, '-')}/${product.slug}`}>
          <h3 className="font-display font-700 text-white text-base leading-tight mb-1 hover:text-teal-400 transition-colors line-clamp-2">
            {product.title}
          </h3>
        </Link>

        {/* Model number - very important */}
        <div className="flex items-center gap-1 mb-2">
          <span className="font-mono text-[10px] text-slate-500">MODEL:</span>
          <span className="font-mono text-[11px] text-teal-400 font-600">{product.model_number}</span>
        </div>

        {/* Description */}
        <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">
          {truncate(product.description, 100)}
        </p>

        {/* Price & CTA */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="font-display font-800 text-lg text-gradient">
              {formatPrice(product.price)}
            </div>
          </div>

          <Link
            href={`/order?product=${product.id}`}
            className="flex items-center gap-1.5 bg-teal-500/10 border border-teal-500/30 hover:bg-teal-500/20 hover:border-teal-500/60 text-teal-400 text-xs font-mono px-3 py-2 transition-all tracking-wider"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            ORDER
          </Link>
        </div>
      </div>
    </div>
  )
}
