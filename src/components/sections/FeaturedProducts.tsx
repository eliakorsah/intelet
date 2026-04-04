import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import ProductCard from '@/components/ui/ProductCard'

async function getFeaturedProducts() {
  const { data } = await supabase
    .from('products')
    .select('*')
    .eq('featured', true)
    .eq('in_stock', true)
    .order('created_at', { ascending: false })
    .limit(6)
  return data || []
}

export default async function FeaturedProducts() {
  const products = await getFeaturedProducts()

  if (!products.length) return null

  return (
    <section className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-end justify-between mb-10">
          <div>
            <div className="font-mono text-xs text-teal-500 tracking-widest uppercase mb-2">
              Shop Now
            </div>
            <h2 className="font-display text-3xl sm:text-4xl font-800 text-white">
              Featured Products
            </h2>
            <div className="section-divider mt-3" />
          </div>
          <Link
            href="/products"
            className="hidden sm:flex items-center gap-2 text-teal-400 hover:text-teal-300 font-mono text-sm tracking-wider transition-colors group"
          >
            VIEW ALL
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-8 text-center sm:hidden">
          <Link href="/products" className="btn-outline inline-block">
            View All Products
          </Link>
        </div>
      </div>
    </section>
  )
}
