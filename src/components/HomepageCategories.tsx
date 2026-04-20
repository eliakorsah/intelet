import Link from 'next/link'
import { getAllCategories, buildTree } from '@/lib/categories'
import { COLORS } from '@/lib/brand'

const RED = COLORS.red

const IconArrow = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>
  </svg>
)

// Category icons mapping — appliance-centric
const ICONS: Record<string, string> = {
  'refrigerators':     '❄️',
  'chest-freezers':    '🧊',
  'washing-machines':  '🫧',
  'air-conditioners':  '💨',
  'televisions':       '📺',
  'small-appliances':  '🍳',
  'samsung':           '📱',
  'midea':             '🏠',
  'bruhm':             '🔧',
  'tamashi':           '⚙️',
  'tcl':               '📡',
  'nasco':             '🔌',
  'haier':             '🏡',
}

export default async function HomepageCategories() {
  const all  = await getAllCategories()
  const tree = buildTree(all).slice(0, 12)

  return (
    <section style={{ background: COLORS.ash }} className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-end justify-between mb-14">
          <div>
            <p className="font-mono text-[11px] tracking-[0.35em] uppercase mb-2" style={{ color: RED }}>
              Browse By
            </p>
            <h2 className="font-black tracking-tight" style={{ fontSize: '2.6rem', color: COLORS.ink }}>
              Product Categories
            </h2>
          </div>
          <Link
            href="/products"
            className="hidden sm:flex items-center gap-2 text-sm font-black tracking-widest uppercase transition-all hover:gap-3"
            style={{ color: RED }}
          >
            View All <IconArrow />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3">
          {tree.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/products?category_id=${cat.id}`}
              className="group relative flex flex-col items-center gap-3 p-5 rounded-2xl transition-all duration-300 text-center cursor-pointer hover:-translate-y-1 hover:shadow-xl"
              style={{
                background: COLORS.white,
                border: `1px solid ${COLORS.ashLine}`,
                boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                animationDelay: `${i * 40}ms`,
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110"
                style={{ background: COLORS.redSoft }}
              >
                {ICONS[cat.slug] || '📦'}
              </div>

              <span
                className="font-heading font-bold text-xs leading-snug transition-colors"
                style={{ color: COLORS.inkSoft }}
              >
                {cat.name}
              </span>

              {(cat.children?.length || 0) > 0 && (
                <span className="text-[9px] font-mono" style={{ color: COLORS.inkMuted }}>
                  {cat.children!.length} subcategories
                </span>
              )}

              <div
                className="absolute bottom-3 right-3 w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                style={{ background: RED }}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
