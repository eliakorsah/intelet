'use client'

import { useEffect, useMemo, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { downloadInvoicePdf, type InvoiceLine } from '@/lib/invoicePdf'
import { GHS } from '@/lib/sales'
import { fetchProductsLite, invalidate } from '@/lib/adminCache'
import { COMPANY, COLORS } from '@/lib/brand'

const RED = COLORS.red
const VAT_RATE = 15 // percent

interface Product { id: string; title: string; model_number: string; price: number | null }

interface Line {
  key: number
  product_id: string | null
  description: string
  quantity: number
  unit_price: number
}

let keyCounter = 0
const newLine = (): Line => ({ key: ++keyCounter, product_id: null, description: '', quantity: 1, unit_price: 0 })

export default function InvoiceForm({ onSaved }: { onSaved?: () => void }) {
  const [products, setProducts] = useState<Product[]>([])
  const [customer, setCustomer] = useState('')
  const [loc, setLoc] = useState('')
  const [num, setNum] = useState('')
  const [orderNo, setOrderNo] = useState('')
  const [payment, setPayment] = useState('Cash')
  const [lines, setLines] = useState<Line[]>([newLine()])
  const [saving, setSaving] = useState(false)
  const [issueDate, setIssueDate] = useState(() => new Date().toISOString().slice(0,10))

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const data = await fetchProductsLite()
      if (!cancelled) setProducts(data as Product[])
    })()
    return () => { cancelled = true }
  }, [])

  const subtotal = useMemo(() => lines.reduce((s, l) => s + l.quantity * l.unit_price, 0), [lines])
  const vatAmount = +(subtotal * VAT_RATE / 100).toFixed(2)
  const total = +(subtotal + vatAmount).toFixed(2)

  const updateLine = (key: number, patch: Partial<Line>) =>
    setLines(ls => ls.map(l => l.key === key ? { ...l, ...patch } : l))

  const pickProduct = (key: number, pid: string) => {
    if (!pid) return updateLine(key, { product_id: null, description: '', unit_price: 0 })
    const p = products.find(x => x.id === pid)
    if (!p) return
    updateLine(key, {
      product_id: p.id,
      description: `${p.title}${p.model_number ? ' — ' + p.model_number : ''}`,
      unit_price: p.price ?? 0,
    })
  }

  async function save() {
    if (!customer.trim()) return alert('Customer name is required')
    const validLines = lines.filter(l => l.description.trim() && l.quantity > 0)
    if (validLines.length === 0) return alert('Add at least one line item')

    setSaving(true)
    try {
      const { data: numRes, error: numErr } = await supabase.rpc('next_invoice_number')
      if (numErr) throw numErr
      const invoice_number: string = numRes

      const { data: { user } } = await supabase.auth.getUser()

      const issued_at = new Date(issueDate + 'T' + new Date().toTimeString().slice(0,8)).toISOString()

      const { data: inv, error: invErr } = await supabase.from('invoices').insert({
        invoice_number,
        customer_name: customer.trim(),
        customer_loc: loc || null,
        customer_num: num || null,
        order_no: orderNo || null,
        payment_method: payment,
        subtotal, vat_rate: VAT_RATE, vat_amount: vatAmount, total,
        issued_at,
        created_by: user?.id ?? null,
      }).select('id').single()
      if (invErr) throw invErr

      const itemsPayload = validLines.map((l, i) => ({
        invoice_id: inv.id,
        product_id: l.product_id,
        description: l.description,
        quantity: l.quantity,
        unit_price: l.unit_price,
        line_total: +(l.quantity * l.unit_price).toFixed(2),
        position: i + 1,
      }))
      const { error: itemErr } = await supabase.from('invoice_items').insert(itemsPayload)
      if (itemErr) throw itemErr

      const pdfItems: InvoiceLine[] = itemsPayload.map(i => ({
        description: i.description, quantity: i.quantity, unit_price: i.unit_price, line_total: i.line_total,
      }))
      downloadInvoicePdf({
        invoice_number,
        issued_at, customer_name: customer, customer_loc: loc, customer_num: num,
        order_no: orderNo, payment_method: payment,
        items: pdfItems, subtotal, vat_rate: VAT_RATE, vat_amount: vatAmount, total,
      })

      invalidate('invoices', 'invoice_items')

      setCustomer(''); setLoc(''); setNum(''); setOrderNo('')
      setLines([newLine()])
      onSaved?.()
    } catch (e: any) {
      alert(e.message || 'Failed to save invoice')
    } finally { setSaving(false) }
  }

  const fld: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: 8, fontSize: 14, outline: 'none',
    border: `1px solid ${COLORS.ashLine}`, background: COLORS.white, color: COLORS.ink,
  }
  const lbl: React.CSSProperties = { fontSize: 10, fontWeight: 800, color: RED, letterSpacing: '0.18em', textTransform: 'uppercase', display: 'block', marginBottom: 5 }

  return (
    <div style={{ maxWidth: 980 }}>

      {/* Paper-like header banner */}
      <div style={{
        padding: 18, borderRadius: 12,
        background: `linear-gradient(135deg, ${COLORS.redSoft}, ${COLORS.white})`,
        border: `1px solid ${RED}33`,
        marginBottom: 18,
      }}>
        <div style={{ color: RED, fontSize: 11, fontWeight: 800, letterSpacing: '0.2em' }}>INVOICE</div>
        <div style={{ color: COLORS.ink, fontWeight: 900, fontSize: 22 }}>{COMPANY.name}</div>
        <div style={{ color: COLORS.inkSoft, fontSize: 12, fontFamily: 'monospace' }}>{COMPANY.tagline}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(220px,1fr))', gap: 12, marginBottom: 16 }}>
        <div><label style={lbl}>Customer Name *</label><input style={fld} value={customer} onChange={e => setCustomer(e.target.value)} placeholder="e.g. AKWASI" /></div>
        <div><label style={lbl}>Location</label><input style={fld} value={loc} onChange={e => setLoc(e.target.value)} /></div>
        <div><label style={lbl}>Customer Num</label><input style={fld} value={num} onChange={e => setNum(e.target.value)} placeholder="phone number" /></div>
        <div><label style={lbl}>Order No.</label><input style={fld} value={orderNo} onChange={e => setOrderNo(e.target.value)} placeholder="001" /></div>
        <div><label style={lbl}>Payment</label>
          <select style={fld} value={payment} onChange={e => setPayment(e.target.value)}>
            <option>Cash</option><option>Mobile Money</option><option>Bank Transfer</option><option>Cheque</option>
          </select>
        </div>
        <div><label style={lbl}>Date</label><input type="date" style={fld} value={issueDate} onChange={e => setIssueDate(e.target.value)} /></div>
      </div>

      {/* Line items table */}
      <div style={{ border: `1px solid ${COLORS.ashLine}`, borderRadius: 12, overflow: 'hidden', marginBottom: 14, background: COLORS.white }}>
        <div style={{ display: 'grid', gridTemplateColumns: '40px 1fr 90px 130px 130px 40px', padding: '10px 12px', background: COLORS.redSoft, color: RED, fontSize: 10, fontWeight: 800, letterSpacing: '0.15em' }}>
          <div>#</div><div>ITEM / DESCRIPTION</div><div>QTY</div><div>UNIT PRICE</div><div>TOTAL GH¢</div><div></div>
        </div>
        {lines.map((l, i) => (
          <div key={l.key} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 90px 130px 130px 40px', padding: 10, borderTop: `1px solid ${COLORS.ashLine}`, alignItems: 'center', gap: 6 }}>
            <div style={{ color: COLORS.inkMuted, fontFamily: 'monospace' }}>{i + 1}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <select style={{ ...fld, padding: '6px 10px', fontSize: 12 }} value={l.product_id || ''} onChange={e => pickProduct(l.key, e.target.value)}>
                <option value="">— Pick product —</option>
                {products.map(p => <option key={p.id} value={p.id}>{p.title} · {p.model_number}</option>)}
              </select>
              <input style={{ ...fld, padding: '6px 10px', fontSize: 12 }} value={l.description} onChange={e => updateLine(l.key, { description: e.target.value })} placeholder="or type description" />
            </div>
            <input type="number" min={0} step="1" style={{ ...fld, padding: '6px 10px' }} value={l.quantity} onChange={e => updateLine(l.key, { quantity: +e.target.value || 0 })} />
            <input type="number" min={0} step="0.01" style={{ ...fld, padding: '6px 10px' }} value={l.unit_price} onChange={e => updateLine(l.key, { unit_price: +e.target.value || 0 })} />
            <div style={{ color: COLORS.ink, fontFamily: 'monospace', fontSize: 13, textAlign: 'right', fontWeight: 700 }}>{(l.quantity * l.unit_price).toFixed(2)}</div>
            <button onClick={() => setLines(ls => ls.filter(x => x.key !== l.key))} style={{ background: 'none', border: 'none', color: '#dc2626', cursor: 'pointer', fontSize: 18 }} title="Remove">×</button>
          </div>
        ))}
        <div style={{ padding: 10, borderTop: `1px solid ${COLORS.ashLine}` }}>
          <button onClick={() => setLines(ls => [...ls, newLine()])} style={{ padding: '8px 14px', borderRadius: 8, background: COLORS.redSoft, border: `1px solid ${RED}55`, color: RED, fontWeight: 700, cursor: 'pointer', fontSize: 12 }}>
            + Add line
          </button>
        </div>
      </div>

      {/* Totals */}
      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 18 }}>
        <div style={{ minWidth: 280, border: `1px solid ${COLORS.ashLine}`, borderRadius: 12, overflow: 'hidden', background: COLORS.white }}>
          <Row l="SubTotal" v={GHS(subtotal)} />
          <Row l={`VAT (${VAT_RATE}%)`} v={GHS(vatAmount)} />
          <Row l="TOTAL" v={GHS(total)} emphasis />
        </div>
      </div>

      <button onClick={save} disabled={saving} style={{
        width: '100%', padding: 16, borderRadius: 12,
        background: saving ? COLORS.ashDeep : `linear-gradient(135deg, ${RED}, ${COLORS.redDeep})`,
        color: saving ? COLORS.inkMuted : COLORS.white,
        fontWeight: 900, fontSize: 14, letterSpacing: '0.12em',
        border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
        boxShadow: saving ? 'none' : `0 6px 18px ${RED}40`,
      }}>
        {saving ? 'SAVING & DOWNLOADING…' : 'SAVE & PRINT (AUTO-DOWNLOAD PDF)'}
      </button>
    </div>
  )
}

function Row({ l, v, emphasis }: { l: string; v: string; emphasis?: boolean }) {
  return (
    <div style={{
      display: 'flex', justifyContent: 'space-between', padding: '10px 14px',
      background: emphasis ? COLORS.redSoft : 'transparent',
      borderTop: emphasis ? `1px solid ${RED}55` : `1px solid ${COLORS.ashLine}`,
      color: emphasis ? RED : COLORS.inkSoft,
      fontWeight: emphasis ? 900 : 500,
      fontFamily: 'monospace', fontSize: emphasis ? 15 : 13,
    }}>
      <span>{l}</span><span>{v}</span>
    </div>
  )
}
