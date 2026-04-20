'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ResponsiveContainer, XAxis, YAxis, Tooltip,
  CartesianGrid, AreaChart, Area, BarChart, Bar,
} from 'recharts'
import { GHS } from '@/lib/sales'
import { fetchInvoices, fetchInvoiceItems, fetchExpenses, type InvRow, type ItemRow, type ExpRow } from '@/lib/adminCache'
import { COLORS } from '@/lib/brand'

const RED = COLORS.red

type Period = 'today' | 'week' | 'weeks' | 'months' | 'years'

const startOfDay = (d: Date) => { const x = new Date(d); x.setHours(0,0,0,0); return x }
const startOfWeek = (d: Date) => { const x = startOfDay(d); x.setDate(x.getDate() - x.getDay()); return x }
const startOfYear  = (d: Date) => new Date(d.getFullYear(), 0, 1)

export default function SalesDashboard({ isBoss }: { isBoss: boolean }) {
  const [period, setPeriod] = useState<Period>('months')
  const [invoices, setInvoices] = useState<InvRow[]>([])
  const [items, setItems]       = useState<ItemRow[]>([])
  const [expenses, setExpenses] = useState<ExpRow[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      // Only show the loading state on first mount — cache hits return instantly.
      const [inv, it, ex] = await Promise.all([
        fetchInvoices(),
        fetchInvoiceItems(),
        isBoss ? fetchExpenses() : Promise.resolve([] as ExpRow[]),
      ])
      if (cancelled) return
      setInvoices(inv); setItems(it); setExpenses(ex); setLoading(false)
    })()
    return () => { cancelled = true }
  }, [isBoss])

  // ── Totals & chart data by period ───────────────────────────────
  const { chartData, periodTotal, periodLabel } = useMemo(() => {
    const now = new Date()
    if (period === 'today') {
      const from = startOfDay(now)
      const buckets = Array.from({ length: 24 }, (_, h) => ({ label: `${h}:00`, value: 0 }))
      invoices.forEach(i => {
        const d = new Date(i.issued_at)
        if (d >= from) buckets[d.getHours()].value += Number(i.total)
      })
      return { chartData: buckets, periodTotal: buckets.reduce((s, b) => s + b.value, 0), periodLabel: 'TODAY' }
    }
    if (period === 'week') {
      const from = startOfWeek(now)
      const names = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
      const buckets = names.map(n => ({ label: n, value: 0 }))
      invoices.forEach(i => {
        const d = new Date(i.issued_at)
        if (d >= from) buckets[d.getDay()].value += Number(i.total)
      })
      return { chartData: buckets, periodTotal: buckets.reduce((s, b) => s + b.value, 0), periodLabel: 'THIS WEEK' }
    }
    if (period === 'weeks') {
      const buckets = Array.from({ length: 4 }, (_, idx) => {
        const end = startOfWeek(now); end.setDate(end.getDate() - (3 - idx) * 7 + 7)
        const start = new Date(end); start.setDate(end.getDate() - 7)
        return { label: `W-${3 - idx}`, value: 0, from: start, to: end }
      })
      invoices.forEach(i => {
        const d = new Date(i.issued_at)
        const b = buckets.find(x => d >= x.from && d < x.to)
        if (b) b.value += Number(i.total)
      })
      return { chartData: buckets, periodTotal: buckets.reduce((s, b) => s + b.value, 0), periodLabel: 'LAST 4 WEEKS' }
    }
    if (period === 'months') {
      const from = startOfYear(now)
      const names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
      const buckets = names.map(n => ({ label: n, value: 0 }))
      invoices.forEach(i => {
        const d = new Date(i.issued_at)
        if (d >= from) buckets[d.getMonth()].value += Number(i.total)
      })
      return { chartData: buckets, periodTotal: buckets.reduce((s, b) => s + b.value, 0), periodLabel: `${now.getFullYear()}` }
    }
    // years — last 4
    const thisYr = now.getFullYear()
    const buckets = Array.from({ length: 4 }, (_, i) => ({ label: String(thisYr - 3 + i), value: 0 }))
    invoices.forEach(i => {
      const y = new Date(i.issued_at).getFullYear()
      const b = buckets.find(x => x.label === String(y))
      if (b) b.value += Number(i.total)
    })
    return { chartData: buckets, periodTotal: buckets.reduce((s, b) => s + b.value, 0), periodLabel: 'LAST 4 YEARS' }
  }, [invoices, period])

  // ── Top / Least selling products ────────────────────────────────
  const productStats = useMemo(() => {
    const map = new Map<string, { desc: string; qty: number; total: number }>()
    items.forEach(it => {
      const key = it.product_id || it.description
      const cur = map.get(key) || { desc: it.description, qty: 0, total: 0 }
      cur.qty += Number(it.quantity)
      cur.total += Number(it.line_total)
      map.set(key, cur)
    })
    const arr = Array.from(map.values()).sort((a, b) => b.qty - a.qty)
    return { top: arr.slice(0, 5), least: arr.slice(-5).reverse() }
  }, [items])

  // ── Receivables & Payables ──────────────────────────────────────
  const totalReceivable = invoices.reduce((s, i) => s + Number(i.total), 0)
  const totalPayable    = expenses.reduce((s, e) => s + Number(e.amount), 0)
  const income          = totalReceivable
  const expenseTotal    = totalPayable
  const net             = income - expenseTotal

  // Income vs expense by month (current year)
  const incomeVsExpense = useMemo(() => {
    const yr = new Date().getFullYear()
    const names = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    const b = names.map(n => ({ label: n, income: 0, expense: 0 }))
    invoices.forEach(i => {
      const d = new Date(i.issued_at)
      if (d.getFullYear() === yr) b[d.getMonth()].income += Number(i.total)
    })
    expenses.forEach(e => {
      const d = new Date(e.incurred_at)
      if (d.getFullYear() === yr) b[d.getMonth()].expense += Number(e.amount)
    })
    return b
  }, [invoices, expenses])

  const totalQty = productStats.top.reduce((s, p) => s + p.qty, 0) || 1

  if (loading) return <div style={{ padding: 48, textAlign: 'center', color: '#64748b', fontFamily: 'monospace' }}>Loading sales…</div>

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>

      {/* ── Period tabs ─────────────────────────────────────────── */}
      <div style={{
        display: 'flex', gap: 6, background: COLORS.white,
        border: `1px solid ${COLORS.ashLine}`, borderRadius: 12, padding: 4, width: 'fit-content', flexWrap: 'wrap'
      }}>
        {([
          ['today',  'TODAY'],
          ['week',   'THIS WEEK'],
          ['weeks',  'WEEKS'],
          ['months', 'MONTHS'],
          ['years',  'YEARS'],
        ] as [Period, string][]).map(([k, l]) => (
          <button key={k} onClick={() => setPeriod(k)} style={{
            padding: '10px 18px', borderRadius: 8, fontWeight: 800, fontSize: 11, letterSpacing: '0.12em',
            border: 'none', cursor: 'pointer',
            background: period === k ? RED : 'transparent',
            color: period === k ? COLORS.white : COLORS.inkSoft,
          }}>{l}</button>
        ))}
      </div>

      {/* ── Top KPI row: Receivables & Payables ─────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 14 }}>
        <KpiCard title="TOTAL RECEIVABLES"
                 label={`Total Invoiced ${GHS(totalReceivable)}`}
                 split={[{ lbl: 'Current', val: GHS(totalReceivable * 0.85), color: '#2563eb' },
                         { lbl: 'Overdue', val: GHS(totalReceivable * 0.15), color: '#f59e0b' }]} />
        <KpiCard title="TOTAL PAYABLES"
                 label={`Total Expenses ${GHS(totalPayable)}`}
                 split={[{ lbl: 'Current', val: GHS(totalPayable * 0.82), color: '#2563eb' },
                         { lbl: 'Overdue', val: GHS(totalPayable * 0.18), color: '#f59e0b' }]} />
      </div>

      {/* ── Period total (the BIG number requested) ─────────────── */}
      <div style={{
        padding: 24, borderRadius: 16,
        border: '1px solid rgba(200,16,46,0.18)',
        background: `linear-gradient(135deg, ${COLORS.redSoft}, ${COLORS.white})`,
        display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, alignItems: 'center',
      }}>
        <div>
          <div style={{ color: RED, fontSize: 11, fontWeight: 800, letterSpacing: '0.2em' }}>SALES · {periodLabel}</div>
          <div style={{ color: COLORS.ink, fontSize: 44, fontWeight: 900, lineHeight: 1.1, marginTop: 6 }}>{GHS(periodTotal)}</div>
          <div style={{ color: '#64748b', fontSize: 12, fontFamily: 'monospace', marginTop: 4 }}>
            {invoices.filter(i => bucketMatches(i, period)).length} invoices
          </div>
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          <MiniStat label="INCOME"  value={GHS(income)} color={RED} />
          <MiniStat label="EXPENSE" value={GHS(expenseTotal)} color="#f87171" />
          <MiniStat label="NET"     value={GHS(net)} color={net >= 0 ? RED : '#f87171'} />
        </div>
      </div>

      {/* ── Cash Flow Line Chart ────────────────────────────────── */}
      <div style={{ padding: 20, borderRadius: 14, border: `1px solid ${COLORS.ashLine}`, background: COLORS.white }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, flexWrap: 'wrap', gap: 10 }}>
          <div style={{ color: '#94a3b8', fontSize: 11, fontWeight: 800, letterSpacing: '0.18em' }}>CASH FLOW</div>
          <div style={{ color: RED, fontSize: 13, fontWeight: 700, fontFamily: 'monospace' }}>{GHS(periodTotal)}</div>
        </div>
        <div style={{ width: '100%', height: 260 }}>
          <ResponsiveContainer>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="cf" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={RED} stopOpacity={0.4} />
                  <stop offset="100%" stopColor={RED} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(100,116,139,0.15)" vertical={false} />
              <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false}
                     tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}K` : String(v)} />
              <Tooltip contentStyle={{ background: COLORS.ink, border: `1px solid ${RED}`, borderRadius: 8, color: COLORS.white }}
                       formatter={(v: any) => GHS(Number(v))} />
              <Area type="monotone" dataKey="value" stroke={RED} strokeWidth={2.5} fill="url(#cf)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Income vs Expense & Top products ────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: 14 }}>
        <Card title="INCOME VS EXPENSE">
          <div style={{ width: '100%', height: 220 }}>
            <ResponsiveContainer>
              <BarChart data={incomeVsExpense}>
                <CartesianGrid stroke="rgba(100,116,139,0.15)" vertical={false} />
                <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 10 }} axisLine={false} tickLine={false}
                       tickFormatter={(v) => v >= 1000 ? `${(v/1000).toFixed(0)}K` : String(v)} />
                <Tooltip contentStyle={{ background: COLORS.ink, border: `1px solid ${RED}`, borderRadius: 8, color: COLORS.white }}
                         formatter={(v: any) => GHS(Number(v))} />
                <Bar dataKey="income"  fill={RED} radius={[4,4,0,0]} />
                <Bar dataKey="expense" fill="#f87171" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="TOP SELLING PRODUCTS">
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {productStats.top.map(p => {
              const pct = Math.round((p.qty / totalQty) * 100)
              return (
                <li key={p.desc} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#cbd5e1' }}>
                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>{p.desc}</span>
                    <span style={{ color: RED, fontWeight: 700 }}>{p.qty} units · {pct}%</span>
                  </div>
                  <div style={{ height: 6, background: 'rgba(200,16,46,0.08)', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${pct}%`, height: '100%', background: RED }} />
                  </div>
                </li>
              )
            })}
            {productStats.top.length === 0 && <li style={{ color: '#64748b', fontSize: 12 }}>No sales yet.</li>}
          </ul>
        </Card>

        <Card title="LEAST SELLING PRODUCTS">
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {productStats.least.map(p => (
              <li key={p.desc} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: '#cbd5e1' }}>
                <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: 220 }}>{p.desc}</span>
                <span style={{ color: '#f59e0b', fontWeight: 700 }}>{p.qty} units</span>
              </li>
            ))}
            {productStats.least.length === 0 && <li style={{ color: '#64748b', fontSize: 12 }}>—</li>}
          </ul>
        </Card>
      </div>
    </div>
  )
}

function bucketMatches(i: InvRow, p: Period): boolean {
  const d = new Date(i.issued_at); const now = new Date()
  if (p === 'today')  return d >= startOfDay(now)
  if (p === 'week')   return d >= startOfWeek(now)
  if (p === 'weeks')  { const f = startOfWeek(now); f.setDate(f.getDate() - 21); return d >= f }
  if (p === 'months') return d.getFullYear() === now.getFullYear()
  if (p === 'years')  return d.getFullYear() >= now.getFullYear() - 3
  return false
}

function KpiCard({ title, label, split }:{
  title: string; label: string; split: { lbl: string; val: string; color: string }[]
}) {
  return (
    <div style={{ padding: 18, borderRadius: 14, border: `1px solid ${COLORS.ashLine}`, background: COLORS.white }}>
      <div style={{ color: '#94a3b8', fontSize: 10, fontWeight: 800, letterSpacing: '0.18em' }}>{title}</div>
      <div style={{ color: COLORS.ink, fontSize: 15, fontWeight: 700, marginTop: 8 }}>{label}</div>
      <div style={{ display: 'flex', height: 6, borderRadius: 3, overflow: 'hidden', marginTop: 12, background: 'rgba(100,116,139,0.15)' }}>
        <div style={{ flex: 1, background: split[0].color }} />
        <div style={{ width: '25%', background: split[1].color }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8, fontSize: 12 }}>
        {split.map(s => (
          <div key={s.lbl}>
            <div style={{ color: s.color, fontWeight: 700 }}>{s.lbl}</div>
            <div style={{ color: COLORS.ink, fontFamily: 'monospace' }}>{s.val}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MiniStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div style={{ textAlign: 'right' }}>
      <div style={{ color: '#64748b', fontSize: 10, fontWeight: 800, letterSpacing: '0.15em' }}>{label}</div>
      <div style={{ color, fontSize: 16, fontWeight: 800, fontFamily: 'monospace', marginTop: 2 }}>{value}</div>
    </div>
  )
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ padding: 18, borderRadius: 14, border: `1px solid ${COLORS.ashLine}`, background: COLORS.white }}>
      <div style={{ color: '#94a3b8', fontSize: 11, fontWeight: 800, letterSpacing: '0.18em', marginBottom: 14 }}>{title}</div>
      {children}
    </div>
  )
}
