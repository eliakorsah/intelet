'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { downloadInvoicePdf } from '@/lib/invoicePdf'
import { GHS } from '@/lib/sales'
import { COLORS } from '@/lib/brand'

const RED = COLORS.red

interface Row {
  id: string
  invoice_number: string
  customer_name: string
  customer_loc: string | null
  customer_num: string | null
  order_no: string | null
  payment_method: string | null
  subtotal: number
  vat_rate: number
  vat_amount: number
  total: number
  issued_at: string
}

export default function InvoiceList() {
  const [rows, setRows]     = useState<Row[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('invoices')
        .select('id,invoice_number,customer_name,customer_loc,customer_num,order_no,payment_method,subtotal,vat_rate,vat_amount,total,issued_at')
        .order('issued_at', { ascending: false })
        .limit(200)
      setRows((data as Row[]) || [])
      setLoading(false)
    })()
  }, [])

  const filtered = rows.filter(r =>
    `${r.invoice_number} ${r.customer_name}`.toLowerCase().includes(search.toLowerCase()))

  async function reprint(r: Row) {
    const { data: items } = await supabase.from('invoice_items')
      .select('description,quantity,unit_price,line_total')
      .eq('invoice_id', r.id).order('position', { ascending: true })
    downloadInvoicePdf({
      invoice_number: r.invoice_number,
      issued_at: r.issued_at,
      customer_name: r.customer_name,
      customer_loc: r.customer_loc || undefined,
      customer_num: r.customer_num || undefined,
      order_no: r.order_no || undefined,
      payment_method: r.payment_method || 'Cash',
      items: (items || []).map(i => ({
        description: i.description, quantity: Number(i.quantity),
        unit_price: Number(i.unit_price), line_total: Number(i.line_total),
      })),
      subtotal: Number(r.subtotal), vat_rate: Number(r.vat_rate),
      vat_amount: Number(r.vat_amount), total: Number(r.total),
    })
  }

  if (loading) return <div style={{ padding: 48, textAlign: 'center', color: COLORS.inkMuted }}>Loading invoices…</div>

  return (
    <div>
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search invoice # or customer…"
             style={{ width: '100%', maxWidth: 420, padding: '10px 14px', borderRadius: 10, border: `1px solid ${COLORS.ashLine}`, background: COLORS.white, color: COLORS.ink, marginBottom: 14, outline: 'none' }} />
      <div style={{ border: `1px solid ${COLORS.ashLine}`, borderRadius: 12, overflow: 'hidden', background: COLORS.white }}>
        <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr 120px 140px 120px 110px', padding: '10px 14px', background: COLORS.redSoft, color: RED, fontSize: 10, fontWeight: 800, letterSpacing: '0.15em' }}>
          <div>INVOICE #</div><div>CUSTOMER</div><div>DATE</div><div>TOTAL</div><div>METHOD</div><div></div>
        </div>
        {filtered.map(r => (
          <div key={r.id} style={{ display: 'grid', gridTemplateColumns: '140px 1fr 120px 140px 120px 110px', padding: '10px 14px', borderTop: `1px solid ${COLORS.ashLine}`, alignItems: 'center', color: COLORS.inkSoft, fontSize: 13 }}>
            <div style={{ fontFamily: 'monospace', color: RED, fontWeight: 700 }}>{r.invoice_number}</div>
            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: COLORS.ink }}>{r.customer_name}</div>
            <div style={{ fontFamily: 'monospace', color: COLORS.inkMuted, fontSize: 12 }}>{new Date(r.issued_at).toLocaleDateString()}</div>
            <div style={{ fontFamily: 'monospace', fontWeight: 700, color: COLORS.ink }}>{GHS(r.total)}</div>
            <div style={{ fontSize: 12, color: COLORS.inkMuted }}>{r.payment_method}</div>
            <button onClick={() => reprint(r)} style={{ padding: '6px 12px', borderRadius: 8, background: COLORS.redSoft, border: `1px solid ${RED}55`, color: RED, fontWeight: 700, cursor: 'pointer', fontSize: 11 }}>
              REPRINT
            </button>
          </div>
        ))}
        {filtered.length === 0 && <div style={{ padding: 40, textAlign: 'center', color: COLORS.inkMuted }}>No invoices yet.</div>}
      </div>
    </div>
  )
}
