'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { COLORS } from '@/lib/brand'

const RED = COLORS.red

interface Product { id: string; title: string; model_number: string }
interface Watch   { id: string; product_id: string; created_at: string; product?: Product }
interface Alert {
  id: string; watch_id: string; product_id: string; quantity: number; created_at: string;
  read_at: string | null; products?: { title: string; model_number: string } | null
  invoice_id: string | null
}

export default function ProductWatches() {
  const [products, setProducts] = useState<Product[]>([])
  const [watches, setWatches] = useState<Watch[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [search, setSearch] = useState('')

  const load = async () => {
    const [p, w, a] = await Promise.all([
      supabase.from('products').select('id,title,model_number').order('title'),
      supabase.from('product_watches').select('id,product_id,created_at, products(id,title,model_number)').order('created_at', { ascending: false }),
      supabase.from('watch_alerts').select('id,watch_id,product_id,quantity,created_at,read_at,invoice_id, products(title,model_number)').order('created_at', { ascending: false }).limit(50),
    ])
    setProducts((p.data as Product[]) || [])
    setWatches(((w.data as any[]) || []).map(x => ({ ...x, product: x.products })) as Watch[])
    setAlerts(((a.data as any[]) || []).map(x => ({
      ...x,
      products: Array.isArray(x.products) ? (x.products[0] ?? null) : x.products,
    })) as Alert[])
  }

  useEffect(() => { load() }, [])

  async function toggleWatch(productId: string) {
    const existing = watches.find(w => w.product_id === productId)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    if (existing) {
      await supabase.from('product_watches').delete().eq('id', existing.id)
    } else {
      await supabase.from('product_watches').insert({ product_id: productId, user_id: user.id })
    }
    load()
  }

  async function markAllRead() {
    const ids = alerts.filter(a => !a.read_at).map(a => a.id)
    if (!ids.length) return
    await supabase.from('watch_alerts').update({ read_at: new Date().toISOString() }).in('id', ids)
    load()
  }

  const watchedIds = new Set(watches.map(w => w.product_id))
  const filtered = products.filter(p =>
    `${p.title} ${p.model_number}`.toLowerCase().includes(search.toLowerCase()))
  const unread = alerts.filter(a => !a.read_at)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 18 }}>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ color: RED, fontSize: 11, fontWeight: 800, letterSpacing: '0.18em' }}>WATCHED PRODUCTS ({watches.length})</div>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…"
               style={{ width: '100%', padding: '9px 12px', borderRadius: 10, border: `1px solid ${COLORS.ashLine}`, background: COLORS.white, color: COLORS.ink, marginBottom: 10, outline: 'none' }} />
        <div style={{ maxHeight: 440, overflowY: 'auto', border: `1px solid ${COLORS.ashLine}`, borderRadius: 12, background: COLORS.white }}>
          {filtered.map(p => {
            const on = watchedIds.has(p.id)
            return (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderBottom: `1px solid ${COLORS.ashLine}` }}>
                <div style={{ minWidth: 0 }}>
                  <div style={{ color: COLORS.ink, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.title}</div>
                  <div style={{ color: COLORS.inkMuted, fontSize: 11, fontFamily: 'monospace' }}>{p.model_number}</div>
                </div>
                <button onClick={() => toggleWatch(p.id)} style={{
                  padding: '6px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700, letterSpacing: '0.1em',
                  border: on ? 'none' : `1px solid ${RED}55`,
                  background: on ? RED : 'transparent',
                  color: on ? COLORS.white : RED, cursor: 'pointer',
                }}>{on ? 'WATCHING' : '+ WATCH'}</button>
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <div style={{ color: RED, fontSize: 11, fontWeight: 800, letterSpacing: '0.18em' }}>RECENT ALERTS ({unread.length} unread)</div>
          {unread.length > 0 && (
            <button onClick={markAllRead} style={{ background: 'none', border: 'none', color: COLORS.inkSoft, cursor: 'pointer', fontSize: 11, fontWeight: 700 }}>
              MARK ALL READ
            </button>
          )}
        </div>
        <div style={{ maxHeight: 500, overflowY: 'auto', border: `1px solid ${COLORS.ashLine}`, borderRadius: 12, background: COLORS.white }}>
          {alerts.length === 0 && <div style={{ padding: 30, textAlign: 'center', color: COLORS.inkMuted, fontSize: 12 }}>No alerts yet. Flag products to get notified when they sell.</div>}
          {alerts.map(a => (
            <div key={a.id} style={{
              padding: '12px 14px', borderBottom: `1px solid ${COLORS.ashLine}`,
              background: a.read_at ? 'transparent' : COLORS.redSoft,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8 }}>
                <div style={{ color: COLORS.ink, fontSize: 13, fontWeight: 600 }}>
                  {a.products?.title || 'Watched product'} sold
                </div>
                {!a.read_at && <span style={{ background: RED, color: COLORS.white, fontSize: 9, fontWeight: 900, padding: '2px 6px', borderRadius: 4, letterSpacing: '0.12em' }}>NEW</span>}
              </div>
              <div style={{ color: COLORS.inkSoft, fontSize: 12, marginTop: 2 }}>
                Qty: <span style={{ color: RED, fontWeight: 700 }}>{a.quantity}</span> · {new Date(a.created_at).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Utility for the header badge — exported so Admin page can render a count
export function useUnreadAlertCount(enabled: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!enabled) { setCount(0); return }
    let cancelled = false
    const fetchCount = async () => {
      const { count: c } = await supabase
        .from('watch_alerts')
        .select('id', { count: 'exact', head: true })
        .is('read_at', null)
      if (!cancelled) setCount(c || 0)
    }
    fetchCount()
    const t = setInterval(fetchCount, 30_000)
    return () => { cancelled = true; clearInterval(t) }
  }, [enabled])
  return count
}
