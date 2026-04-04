'use client'

import Link from 'next/link'
import { BRANDS } from '@/lib/constants'
import { ArrowRight } from 'lucide-react'

export default function BrandsSection() {
  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-navy-900/50 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-14">
          <div className="inline-block font-mono text-xs text-teal-500 tracking-widest uppercase mb-3">
            Our Partners
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-800 text-white mb-4">
            Authorized Brand Partners
          </h2>
          <div className="section-divider mx-auto" />
          <p className="mt-4 text-slate-400 max-w-xl mx-auto">
            We are authorized distributors for the world&apos;s leading IT and security brands
          </p>
        </div>

        {/* Brands grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-10">
          {BRANDS.map((brand, index) => (
            <Link
              key={brand.slug}
              href={`/products/${brand.slug}`}
              className="cyber-card group p-6 flex flex-col items-center justify-center gap-3 cursor-pointer text-center"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Brand color indicator */}
              <div
                className="w-12 h-1 rounded-full mb-1 group-hover:w-16 transition-all duration-300"
                style={{ backgroundColor: brand.color }}
              />

              {/* Brand name */}
              <span className="font-display font-700 text-lg text-white group-hover:text-gradient transition-all">
                {brand.name}
              </span>

              <div className="flex items-center gap-1 text-xs text-teal-500 opacity-0 group-hover:opacity-100 transition-opacity font-mono tracking-wider">
                VIEW PRODUCTS <ArrowRight className="w-3 h-3" />
              </div>

              {/* Animated corner decorations */}
              <div className="corner-decoration corner-tl absolute" />
              <div className="corner-decoration corner-br absolute" />
            </Link>
          ))}
        </div>

        {/* Trust badges */}
        <div className="flex flex-wrap justify-center gap-6 mt-10">
          {[
            '🏆 Authorized Distributor',
            '✅ Genuine Products Only',
            '🚚 Nationwide Delivery',
            '🔧 After-Sales Support',
          ].map((badge) => (
            <div
              key={badge}
              className="flex items-center gap-2 bg-teal-500/5 border border-teal-500/20 px-4 py-2 font-body text-sm text-slate-300"
            >
              {badge}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
