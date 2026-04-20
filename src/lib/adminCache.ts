'use client'

/**
 * Module-level cache for admin-panel data. Survives component unmounts
 * so switching tabs doesn't refetch the whole dataset every time.
 * TTL: 60s. Exposes invalidate() for mutations.
 */

import { supabase } from '@/lib/supabase'

interface Entry<T> { data: T; at: number; inflight?: Promise<T> }
const TTL_MS = 60_000
const store = new Map<string, Entry<any>>()

function fresh(e: Entry<any> | undefined) {
  return !!e && Date.now() - e.at < TTL_MS
}

/** Fetch or return cached data for a given key. Concurrent calls de-dupe. */
export async function cached<T>(key: string, fetcher: () => Promise<T>): Promise<T> {
  const hit = store.get(key)
  if (fresh(hit)) return hit!.data as T
  if (hit?.inflight) return hit.inflight as Promise<T>
  const p = fetcher().then(data => {
    store.set(key, { data, at: Date.now() })
    return data
  }).catch(err => { store.delete(key); throw err })
  store.set(key, { data: hit?.data, at: 0, inflight: p })
  return p
}

/** Drop one or all keys — call after inserts/updates/deletes. */
export function invalidate(...keys: string[]) {
  if (keys.length === 0) store.clear()
  else keys.forEach(k => store.delete(k))
}

// ── Typed helpers for the admin panel ──────────────────────────
export interface InvRow { id: string; total: number; subtotal: number; issued_at: string }
export interface ItemRow { product_id: string | null; description: string; quantity: number; line_total: number }
export interface ExpRow { amount: number; incurred_at: string; category: string }

export const fetchInvoices = () => cached<InvRow[]>('invoices', async () => {
  const { data } = await supabase.from('invoices')
    .select('id,total,subtotal,issued_at')
    .order('issued_at', { ascending: false })
    .range(0, 9999)
  return (data as InvRow[]) || []
})

export const fetchInvoiceItems = () => cached<ItemRow[]>('invoice_items', async () => {
  const { data } = await supabase.from('invoice_items')
    .select('product_id,description,quantity,line_total')
    .range(0, 19999)
  return (data as ItemRow[]) || []
})

export const fetchExpenses = () => cached<ExpRow[]>('expenses', async () => {
  const { data } = await supabase.from('expenses')
    .select('amount,incurred_at,category')
    .range(0, 9999)
  return (data as ExpRow[]) || []
})

export interface ProductRow { id: string; title: string; model_number: string; price: number | null }
export const fetchProductsLite = () => cached<ProductRow[]>('products_lite', async () => {
  const { data } = await supabase.from('products')
    .select('id,title,model_number,price')
    .order('title', { ascending: true })
  return (data as ProductRow[]) || []
})
