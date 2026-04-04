import Link from 'next/link'
import { getAllCategories, buildTree, type Category } from '@/lib/categories'

const TEAL = '#00c49a'

const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
)

// Category icons mapping
const ICONS: Record<string, string> = {
  'hikvision': '📹', 'hi-look': '🎥', 'grandstream': '📞', 'alfama': '🔒',
  'addressable-fire-alarm': '🔥', 'conventional-fire-alarm': '🚨',
  'solar-4g-ptz': '☀️', 'wifi-cameras': '📡', 'analogue-cameras': '🎞️',
  'networking-accessories': '🌐', 'cctv-accessories': '🔧',
  'analogue-speakers': '🔊', 'ip-speakers': '📢',
}

export default async function HomepageCategories() {
  const all  = await getAllCategories()
  const tree = buildTree(all).slice(0, 12) // top-level only, max 12

  return (
    <section style={{ background: '#f0f4ff' }} className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="font-mono text-[11px] tracking-[0.35em] uppercase mb-2" style={{ color: TEAL }}>Browse By</p>
            <h2 className="font-black tracking-tight" style={{ fontSize: '2.6rem', color: '#0d1117' }}>
              Product Categories
            </h2>
          </div>
          <Link href="/products"
            className="hidden sm:flex items-center gap-2 text-sm font-black tracking-widest uppercase transition-all hover:gap-3"
            style={{ color: TEAL }}>
            View All <IconArrow />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {tree.map((cat, i) => (
            <Link key={cat.id}
              href={`/products?category_id=${cat.id}`}
              className="group relative flex flex-col items-center gap-3 p-5 rounded-2xl bg-white border border-gray-100 hover:border-[#00c49a] hover:-translate-y-1 hover:shadow-xl transition-all duration-300 text-center cursor-pointer"
              style={{ boxShadow: '0 1px 4px rgba(0,0,0,0.04)', animationDelay: `${i * 40}ms` }}>

              {/* Icon */}
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110"
                style={{ background: 'rgba(0,196,154,0.08)' }}>
                {ICONS[cat.slug] || '📦'}
              </div>

              <span className="font-heading font-bold text-xs leading-snug text-gray-700 group-hover:text-[#00c49a] transition-colors">
                {cat.name}
              </span>

              {/* Sub-count badge */}
              {(cat.children?.length || 0) > 0 && (
                <span className="text-[9px] font-mono" style={{ color: '#9ca3af' }}>
                  {cat.children!.length} subcategories
                </span>
              )}

              {/* Hover teal dot */}
              <div className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: TEAL }} />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
