'use client'

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { supabase } from '@/lib/supabase'
import { COLORS } from '@/lib/brand'

// ─────────────────────────────────────────────────────────────
// THEME
// ─────────────────────────────────────────────────────────────
interface Theme {
  bg: string; card: string; border: string; text: string; sub: string;
  muted: string; input: string; inputBorder: string; headerBg: string;
  rowHover: string; tag: string; teal: string; shadow: string;
}
const DARK: Theme = {
  bg: '#0a0f1a', card: 'rgba(20,26,40,0.88)', border: 'rgba(200,16,46,0.18)',
  text: '#e2e8f0', sub: '#94a3b8', muted: '#64748b',
  input: '#14192a', inputBorder: '#2a2f3e', headerBg: 'rgba(200,16,46,0.08)',
  rowHover: 'rgba(200,16,46,0.05)', tag: 'rgba(200,16,46,0.12)',
  teal: COLORS.red, shadow: '0 8px 32px rgba(0,0,0,0.5)',
}
const LIGHT: Theme = {
  bg: COLORS.ash, card: COLORS.white, border: COLORS.ashLine,
  text: COLORS.ink, sub: COLORS.inkSoft, muted: COLORS.inkMuted,
  input: COLORS.white, inputBorder: COLORS.ashLine, headerBg: COLORS.redSoft,
  rowHover: 'rgba(200,16,46,0.06)', tag: 'rgba(200,16,46,0.1)',
  teal: COLORS.red, shadow: '0 8px 32px rgba(0,0,0,0.08)',
}

// ─────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────
interface Warehouse {
  id: string
  name: string
  color: string
  date_columns: string[]
}

interface StockItem {
  id: string
  warehouse: string
  model: string
  opening_stock: number
  daily_taken: Record<string, number>
  total_taken: number
  closing_stock: number
  min_level: number | null
  stock_status: string
}

// ─────────────────────────────────────────────────────────────
// SEED DATA (only inserted if tables are empty)
// ─────────────────────────────────────────────────────────────
const DAYS_1_31 = Array.from({ length: 31 }, (_, i) => String(i + 1))
const SEED_WAREHOUSES = [
  { name: 'MAIN SHOWROOM', color: COLORS.red, date_columns: DAYS_1_31 },
]

const SEED_STOCK: any[] = []

// ─────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────
function computeTotals(item: { opening_stock: number; daily_taken: Record<string, number> }) {
  const total_taken = Object.values(item.daily_taken).reduce((s, v) => s + (v || 0), 0)
  return { total_taken, closing_stock: item.opening_stock - total_taken }
}
function computeStatus(item: { closing_stock: number; min_level: number | null }) {
  if (!item.min_level) return ''
  return item.closing_stock < item.min_level ? 'LOW' : 'OK'
}
function statusColor(item: StockItem, teal: string) {
  if (item.closing_stock <= 0) return '#ef4444'
  if (item.stock_status === 'LOW') return '#f59e0b'
  if (item.stock_status === 'OK') return teal
  return '#64748b'
}
function statusLabel(item: StockItem) {
  if (item.closing_stock <= 0) return 'EMPTY'
  if (item.stock_status === 'LOW') return 'LOW'
  if (item.stock_status === 'OK') return 'OK'
  return '–'
}

// ─────────────────────────────────────────────────────────────
// ATOMS
// ─────────────────────────────────────────────────────────────
const Badge = ({ label, color }: { label: string; color: string }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', padding: '2px 8px',
    borderRadius: '6px', fontSize: '10px', fontWeight: 800, letterSpacing: '0.12em',
    background: `${color}18`, color, border: `1px solid ${color}30`, whiteSpace: 'nowrap',
  }}>{label}</span>
)
const StockBar = ({ pct, color }: { pct: number; color: string }) => (
  <div style={{ width: '100%', height: '3px', background: 'rgba(128,128,128,0.15)', borderRadius: '4px', overflow: 'hidden' }}>
    <div style={{ width: `${Math.min(100, Math.max(0, pct))}%`, height: '100%', background: color, transition: 'width 0.3s' }} />
  </div>
)
const Spinner = ({ color }: { color: string }) => (
  <div style={{ width: 24, height: 24, border: `3px solid ${color}30`, borderTopColor: color, borderRadius: '50%', animation: 'spin 0.7s linear infinite' }} />
)

// ─────────────────────────────────────────────────────────────
// WAREHOUSE MODAL
// ─────────────────────────────────────────────────────────────
function WarehouseModal({ wh, onSave, onClose, T, dark }: {
  wh: Partial<Warehouse> & { id?: string }
  onSave: (w: Omit<Warehouse, 'id'> & { id?: string }) => void
  onClose: () => void
  T: Theme
  dark: boolean
}) {
  const [name,     setName]     = useState(wh.name || '')
  const [color,    setColor]    = useState(wh.color || COLORS.red)
  const [datesRaw, setDatesRaw] = useState((wh.date_columns || []).join(', '))
  const [err,      setErr]      = useState('')

  const inp: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '16px',
    border: `1px solid ${T.inputBorder}`, background: T.input, color: T.text,
    outline: 'none', boxSizing: 'border-box',
  }
  const lbl: React.CSSProperties = {
    fontSize: '10px', fontWeight: 800, color: T.teal, letterSpacing: '0.15em',
    textTransform: 'uppercase', display: 'block', marginBottom: '5px',
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1100, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: T.card, borderRadius: 18, border: `1px solid ${T.border}`, width: '100%', maxWidth: 480, padding: 28, boxShadow: T.shadow }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ color: T.text, fontWeight: 900, fontSize: 17, margin: 0 }}>{wh.id ? '✏️ Edit Warehouse' : '🏭 Add New Warehouse'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: T.sub, cursor: 'pointer', fontSize: 20 }}>✕</button>
        </div>

        {err && <div style={{ padding: '10px 14px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', color: '#ef4444', fontSize: 13, marginBottom: 14 }}>{err}</div>}

        <div style={{ marginBottom: 16 }}>
          <label style={lbl}>Warehouse Name *</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. MAIN STORE" style={inp} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: 14, marginBottom: 16 }}>
          <div>
            <label style={lbl}>Color</label>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input type="color" value={color} onChange={e => setColor(e.target.value)}
                style={{ width: 42, height: 38, borderRadius: 8, border: `1px solid ${T.inputBorder}`, background: T.input, cursor: 'pointer', padding: 2 }} />
              <input value={color} onChange={e => setColor(e.target.value)} style={{ ...inp, fontFamily: 'monospace' }} />
            </div>
          </div>
          <div>
            <label style={lbl}>Badge Preview</label>
            <div style={{ padding: '10px 12px', borderRadius: 8, border: `1px solid ${T.inputBorder}`, display: 'flex', alignItems: 'center' }}>
              <Badge label={name || 'PREVIEW'} color={color} />
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 22 }}>
          <label style={lbl}>Day columns (comma-separated day numbers)</label>
          <input value={datesRaw} onChange={e => setDatesRaw(e.target.value)} placeholder="e.g. 1, 2, 3, ... 31" style={inp} />
          <p style={{ color: T.sub, fontSize: 11, margin: '5px 0 0', fontFamily: 'monospace' }}>Enter the day-of-month numbers that will appear as columns in the stock table</p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => {
            if (!name.trim()) return setErr('Warehouse name is required')
            const date_columns = datesRaw.split(',').map(s => s.trim()).filter(Boolean)
            onSave({ id: wh.id, name: name.trim().toUpperCase(), color, date_columns })
          }} style={{ flex: 1, padding: 12, borderRadius: 10, background: T.teal, color: '#fff', fontWeight: 900, fontSize: 14, border: 'none', cursor: 'pointer' }}>
            {wh.id ? 'UPDATE WAREHOUSE' : 'ADD WAREHOUSE'}
          </button>
          <button onClick={onClose} style={{ padding: '12px 20px', borderRadius: 10, background: 'transparent', color: T.sub, fontWeight: 700, border: `1px solid ${T.inputBorder}`, cursor: 'pointer' }}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// STOCK ITEM MODAL
// ─────────────────────────────────────────────────────────────
function StockModal({ item, warehouses, onSave, onClose, T, dark }: {
  item: Partial<StockItem> & { id?: string }
  warehouses: Warehouse[]
  onSave: (item: StockItem) => void
  onClose: () => void
  T: Theme
  dark: boolean
}) {
  const [form, setForm] = useState<Partial<StockItem>>({
    warehouse: item.warehouse || warehouses[0]?.name || '',
    model: item.model || '',
    opening_stock: item.opening_stock ?? 0,
    daily_taken: { ...(item.daily_taken ?? {}) },
    min_level: item.min_level ?? null,
    ...item,
  })
  const [saving, setSaving] = useState(false)

  const activeDates = warehouses.find(w => w.name === form.warehouse)?.date_columns || []
  const tots = computeTotals({ opening_stock: form.opening_stock || 0, daily_taken: form.daily_taken || {} })

  const updateDaily = (day: string, val: string) => {
    const n = parseInt(val) || 0
    setForm(f => ({
      ...f,
      daily_taken: n > 0
        ? { ...f.daily_taken, [day]: n }
        : (() => { const d = { ...f.daily_taken }; delete d![day]; return d })(),
    }))
  }

  const inp: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: '8px', fontSize: '16px',
    border: `1px solid ${T.inputBorder}`, background: T.input, color: T.text,
    outline: 'none', boxSizing: 'border-box',
  }
  const lbl: React.CSSProperties = {
    fontSize: '10px', fontWeight: 800, color: T.teal, letterSpacing: '0.15em',
    textTransform: 'uppercase', display: 'block', marginBottom: '5px',
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16 }}
      onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{ background: T.card, borderRadius: 18, border: `1px solid ${T.border}`, width: '100%', maxWidth: 680, maxHeight: '90vh', overflow: 'auto', boxShadow: T.shadow, padding: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <h2 style={{ color: T.text, fontWeight: 900, fontSize: 18, margin: 0 }}>{item.id ? '✏️ Edit Stock Item' : '➕ Add New Stock Item'}</h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: T.sub, cursor: 'pointer', fontSize: 20 }}>✕</button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={lbl}>Warehouse</label>
          <select value={form.warehouse} onChange={e => setForm(f => ({ ...f, warehouse: e.target.value, daily_taken: {} }))} style={inp}>
            {warehouses.map(w => <option key={w.id} value={w.name}>{w.name}</option>)}
          </select>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={lbl}>Model / Product Name *</label>
          <input value={form.model} onChange={e => setForm(f => ({ ...f, model: e.target.value }))} placeholder="e.g. DS-7208HGHI-M1" style={inp} />
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: 14, marginBottom: 16 }}>
          <div>
            <label style={lbl}>Opening Stock</label>
            <input type="number" min="0" value={form.opening_stock}
              onChange={e => setForm(f => ({ ...f, opening_stock: parseInt(e.target.value) || 0 }))} style={inp} />
          </div>
          <div>
            <label style={lbl}>Min Level (alert threshold)</label>
            <input type="number" min="0" value={form.min_level ?? ''}
              onChange={e => setForm(f => ({ ...f, min_level: e.target.value ? parseInt(e.target.value) : null }))}
              placeholder="Leave blank = no alert" style={inp} />
          </div>
        </div>

        {activeDates.length > 0 && (
          <div style={{ marginBottom: 20 }}>
            <label style={lbl}>Daily Quantities Taken (by day of month)</label>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(68px, 1fr))', gap: 8,
              padding: 14, borderRadius: 10,
              background: dark ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.04)',
              border: `1px solid ${T.inputBorder}`,
            }}>
              {activeDates.map(day => (
                <div key={day}>
                  <div style={{ fontSize: 10, color: T.teal, fontWeight: 700, textAlign: 'center', marginBottom: 3 }}>Day {day}</div>
                  <input type="number" min="0"
                    value={(form.daily_taken || {})[day] || ''}
                    onChange={e => updateDaily(day, e.target.value)}
                    placeholder="0"
                    style={{
                      ...inp, padding: '6px 4px', textAlign: 'center',
                      background: (form.daily_taken || {})[day] ? `${T.teal}15` : T.input,
                      borderColor: (form.daily_taken || {})[day] ? T.teal : T.inputBorder,
                    }} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Live totals */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(100px,1fr))', gap: 10, marginBottom: 24,
          padding: 14, borderRadius: 10,
          background: dark ? 'rgba(200,16,46,0.06)' : 'rgba(200,16,46,0.06)',
          border: `1px solid ${T.teal}25`,
        }}>
          {[
            { label: 'Opening',     value: form.opening_stock || 0, color: T.sub },
            { label: 'Total Taken', value: tots.total_taken,        color: '#f59e0b' },
            { label: 'Closing',     value: tots.closing_stock,      color: tots.closing_stock < 0 ? '#ef4444' : T.teal },
          ].map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 10, color: T.sub, letterSpacing: '0.1em', marginBottom: 3 }}>{s.label.toUpperCase()}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: s.color, fontFamily: 'monospace' }}>{s.value}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button disabled={saving} onClick={async () => {
            if (!form.model?.trim()) return alert('Model name is required')
            setSaving(true)
            const tots2  = computeTotals({ opening_stock: form.opening_stock || 0, daily_taken: form.daily_taken || {} })
            const status = computeStatus({ closing_stock: tots2.closing_stock, min_level: form.min_level ?? null })
            onSave({
              id: item.id || '',
              warehouse:     form.warehouse     || '',
              model:         form.model         || '',
              opening_stock: form.opening_stock || 0,
              daily_taken:   form.daily_taken   || {},
              total_taken:   tots2.total_taken,
              closing_stock: tots2.closing_stock,
              min_level:     form.min_level ?? null,
              stock_status:  status,
            })
          }} style={{
            flex: 1, padding: 12, borderRadius: 10,
            background: saving ? T.inputBorder : T.teal,
            color: '#fff', fontWeight: 900, fontSize: 14, border: 'none',
            cursor: saving ? 'not-allowed' : 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
          }}>
            {saving ? <><Spinner color="#fff" /> Saving…</> : (item.id ? 'UPDATE ITEM' : 'ADD ITEM')}
          </button>
          <button onClick={onClose} style={{ padding: '12px 20px', borderRadius: 10, background: 'transparent', color: T.sub, fontWeight: 700, border: `1px solid ${T.inputBorder}`, cursor: 'pointer' }}>Cancel</button>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
export default function StockTab({ darkMode, onToggleDark }: { darkMode: boolean; onToggleDark: () => void }) {
  const T = darkMode ? DARK : LIGHT

  const [warehouses,  setWarehouses]  = useState<Warehouse[]>([])
  const [data,        setData]        = useState<StockItem[]>([])
  const [loading,     setLoading]     = useState(true)
  const [seeding,     setSeeding]     = useState(false)
  const [warehouse,   setWarehouse]   = useState('ALL')
  const [filter,      setFilter]      = useState<'all'|'low'|'zero'>('all')
  const [query,       setQuery]       = useState('')
  const [sortKey,     setSortKey]     = useState<keyof StockItem>('model')
  const [sortDir,     setSortDir]     = useState<'asc'|'desc'>('asc')
  const [page,        setPage]        = useState(1)
  const [selected,    setSelected]    = useState<StockItem|null>(null)
  const [stockModal,  setStockModal]  = useState<(Partial<StockItem> & { id?: string })|null>(null)
  const [whModal,     setWhModal]     = useState<(Partial<Warehouse> & { id?: string })|null>(null)
  const [viewDates,   setViewDates]   = useState(false)
  const [manageWh,    setManageWh]    = useState(false)
  const [toast,       setToast]       = useState<{ msg: string; ok: boolean }|null>(null)
  const PER_PAGE = 20

  const showToast = (msg: string, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }

  // ── Fetch warehouses ─────────────────────────────────────
  const fetchWarehouses = useCallback(async () => {
    const { data: rows, error } = await supabase.from('warehouses').select('*').order('created_at')
    if (error) { showToast('Failed to load warehouses', false); return [] }
    if (!rows || rows.length === 0) {
      const { data: seeded } = await supabase.from('warehouses').insert(SEED_WAREHOUSES).select()
      return seeded || []
    }
    return rows
  }, [])

  // ── Fetch stock ──────────────────────────────────────────
  const fetchStock = useCallback(async () => {
    const { data: rows, error } = await supabase.from('warehouse_stock').select('*').order('created_at')
    if (error) { showToast('Failed to load stock data', false); setLoading(false); return [] }
    if (!rows || rows.length === 0) {
      setSeeding(true)
      const toInsert = SEED_STOCK.map(s => {
        const tots   = computeTotals(s as any)
        const status = computeStatus({ closing_stock: tots.closing_stock, min_level: s.min_level })
        return { ...s, ...tots, stock_status: status }
      })
      for (let i = 0; i < toInsert.length; i += 50) {
        await supabase.from('warehouse_stock').insert(toInsert.slice(i, i + 50))
      }
      const { data: seeded } = await supabase.from('warehouse_stock').select('*').order('created_at')
      setSeeding(false)
      return seeded || []
    }
    return rows
  }, [])

  useEffect(() => {
    const init = async () => {
      try {
        const [whs, stock] = await Promise.all([fetchWarehouses(), fetchStock()])
        setWarehouses(whs)
        setData(stock)
      } catch (err: any) {
        showToast('Stock init failed: ' + (err?.message || 'unknown'), false)
      } finally {
        setSeeding(false)
        setLoading(false)
      }
    }
    init()
  }, [])

  // ── Save stock item (insert or update) ───────────────────
  const handleSaveStock = async (item: StockItem) => {
    const payload = {
      warehouse:     item.warehouse,
      model:         item.model,
      opening_stock: item.opening_stock,
      daily_taken:   item.daily_taken,
      total_taken:   item.total_taken,
      closing_stock: item.closing_stock,
      min_level:     item.min_level,
      stock_status:  item.stock_status,
    }
    if (item.id) {
      const { error } = await supabase.from('warehouse_stock')
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq('id', item.id)
      if (error) { showToast('Update failed: ' + error.message, false); return }
      setData(d => d.map(x => x.id === item.id ? item : x))
      if (selected?.id === item.id) setSelected(item)
      showToast('Item updated ✓')
    } else {
      const { data: inserted, error } = await supabase.from('warehouse_stock')
        .insert(payload).select().single()
      if (error) { showToast('Insert failed: ' + error.message, false); return }
      setData(d => [inserted, ...d])
      showToast('Item added ✓')
    }
    setStockModal(null)
  }

  // ── Delete stock item ────────────────────────────────────
  const handleDeleteStock = async (id: string, model: string) => {
    if (!confirm(`Delete "${model}"?`)) return
    const { error } = await supabase.from('warehouse_stock').delete().eq('id', id)
    if (error) { showToast('Delete failed', false); return }
    setData(d => d.filter(x => x.id !== id))
    if (selected?.id === id) setSelected(null)
    showToast('Item deleted')
  }

  // ── Save warehouse ───────────────────────────────────────
  const handleSaveWarehouse = async (wh: Omit<Warehouse,'id'> & { id?: string }) => {
    if (wh.id) {
      const { error } = await supabase.from('warehouses')
        .update({ name: wh.name, color: wh.color, date_columns: wh.date_columns })
        .eq('id', wh.id)
      if (error) { showToast('Update failed: ' + error.message, false); return }
      setWarehouses(ws => ws.map(w => w.id === wh.id ? { ...w, ...wh, id: w.id } : w))
      showToast('Warehouse updated ✓')
    } else {
      const { data: inserted, error } = await supabase.from('warehouses')
        .insert({ name: wh.name, color: wh.color, date_columns: wh.date_columns })
        .select().single()
      if (error) { showToast('Failed: ' + error.message, false); return }
      setWarehouses(ws => [...ws, inserted])
      showToast('Warehouse added ✓')
    }
    setWhModal(null)
  }

  // ── Delete warehouse ─────────────────────────────────────
  const handleDeleteWarehouse = async (wh: Warehouse) => {
    const count = data.filter(x => x.warehouse === wh.name).length
    if (!confirm(`Delete "${wh.name}"? This will also remove all ${count} stock items inside it.`)) return
    await supabase.from('warehouse_stock').delete().eq('warehouse', wh.name)
    const { error } = await supabase.from('warehouses').delete().eq('id', wh.id)
    if (error) { showToast('Delete failed', false); return }
    setWarehouses(ws => ws.filter(w => w.id !== wh.id))
    setData(d => d.filter(x => x.warehouse !== wh.name))
    if (warehouse === wh.name) setWarehouse('ALL')
    showToast('Warehouse deleted')
  }

  // ── Export to CSV ────────────────────────────────────────
  const handleExport = () => {
    const rows = warehouse === 'ALL' ? data : data.filter(x => x.warehouse === warehouse)
    const allDates = rows
      .flatMap(r => Object.keys(r.daily_taken))
      .filter((value, index, self) => self.indexOf(value) === index)
      .sort((a, b) => parseInt(a) - parseInt(b))
    const headers = [
      'Warehouse', 'Model / Product', 'Opening Stock',
      ...allDates.map(d => `Day ${d}`),
      'Total Taken', 'Closing Stock', 'Min Level', 'Stock Status',
    ]
    const csvRows = rows.map(item => [
      `"${item.warehouse}"`,
      `"${item.model.replace(/"/g, '""')}"`,
      item.opening_stock,
      ...allDates.map(d => item.daily_taken[d] || 0),
      item.total_taken,
      item.closing_stock,
      item.min_level ?? '',
      item.stock_status,
    ])
    const csv = [headers.join(','), ...csvRows.map(r => r.join(','))].join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url  = URL.createObjectURL(blob)
    const a    = document.createElement('a')
    a.href     = url
    const label = warehouse === 'ALL' ? 'ALL_WAREHOUSES' : warehouse.replace(/ /g, '_')
    a.download  = `Intelet_Stock_${label}_${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a); a.click(); document.body.removeChild(a)
    URL.revokeObjectURL(url)
    showToast(`Exported ${rows.length} items ✓`)
  }

  // ── Sort / filter ────────────────────────────────────────
  const handleSort = (key: keyof StockItem) => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const filtered = useMemo(() => {
    let d = [...data]
    if (warehouse !== 'ALL') d = d.filter(x => x.warehouse === warehouse)
    if (filter === 'low')  d = d.filter(x => x.stock_status === 'LOW' || x.closing_stock <= 0)
    if (filter === 'zero') d = d.filter(x => x.closing_stock <= 0)
    if (query) { const q = query.toLowerCase(); d = d.filter(x => x.model.toLowerCase().includes(q)) }
    d.sort((a, b) => {
      let va: any = a[sortKey], vb: any = b[sortKey]
      if (typeof va === 'string') va = va.toLowerCase()
      if (typeof vb === 'string') vb = vb.toLowerCase()
      if (va < vb) return sortDir === 'asc' ? -1 : 1
      if (va > vb) return sortDir === 'asc' ? 1 : -1
      return 0
    })
    return d
  }, [data, warehouse, filter, query, sortKey, sortDir])

  const pages     = Math.ceil(filtered.length / PER_PAGE)
  const pageItems = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const stats = useMemo(() => {
    const src = warehouse === 'ALL' ? data : data.filter(x => x.warehouse === warehouse)
    return {
      total: src.length,
      low:   src.filter(x => x.stock_status === 'LOW' || x.closing_stock <= 0).length,
      ok:    src.filter(x => x.stock_status === 'OK').length,
      taken: src.reduce((s, x) => s + x.total_taken, 0),
    }
  }, [data, warehouse])

  const activeDates = warehouse !== 'ALL' ? (warehouses.find(w => w.name === warehouse)?.date_columns || []) : []
  const wColor = (name: string) => warehouses.find(w => w.name === name)?.color || T.teal

  // ── Style helpers ────────────────────────────────────────
  const inp: React.CSSProperties = {
    padding: '10px 14px', borderRadius: '10px', fontSize: '16px',
    border: `1px solid ${T.inputBorder}`, background: T.input, color: T.text, outline: 'none',
  }
  const thStyle: React.CSSProperties = {
    color: T.sub, fontSize: '10px', fontWeight: 800, letterSpacing: '0.12em',
    cursor: 'pointer', userSelect: 'none', padding: '10px 12px', whiteSpace: 'nowrap',
    borderBottom: `1px solid ${T.border}`, background: T.headerBg,
  }
  const tdStyle: React.CSSProperties = {
    padding: '10px 12px', fontSize: '12px', borderBottom: `1px solid ${T.border}`,
    color: T.text, verticalAlign: 'middle',
  }
  const SortArrow = ({ k }: { k: keyof StockItem }) =>
    sortKey === k ? <span style={{ color: T.teal, marginLeft: 3 }}>{sortDir === 'asc' ? '↑' : '↓'}</span> : null

  // ── Loading screen ───────────────────────────────────────
  if (loading) return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '80px 0', gap: 16 }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <Spinner color={T.teal} />
      <p style={{ color: T.sub, fontFamily: 'monospace', fontSize: 13 }}>
        {seeding ? 'Setting up stock data in Supabase…' : 'Loading warehouse stock…'}
      </p>
    </div>
  )

  return (
    <div style={{ paddingBottom: 48, transition: 'all 0.3s ease' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>

      {/* Toast */}
      {toast && (
        <div style={{
          position: 'fixed', bottom: 24, right: 24, zIndex: 9999,
          padding: '12px 20px', borderRadius: 12,
          background: toast.ok ? T.teal : '#ef4444',
          color: '#fff', fontWeight: 700, fontSize: 13,
          boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
        }}>{toast.msg}</div>
      )}

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
        <div>
          <h2 style={{ color: T.text, fontWeight: 900, fontSize: 20, margin: 0 }}>📦 Warehouse Stock</h2>
          <p style={{ color: T.sub, fontSize: 12, fontFamily: 'monospace', margin: '4px 0 0' }}>
            Live inventory · {warehouses.map(w => w.name).join(' · ')}
          </p>
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Dark/Light toggle */}
          <button onClick={onToggleDark} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '8px 14px',
            borderRadius: 10, border: `1px solid ${T.inputBorder}`, background: T.input,
            color: T.text, cursor: 'pointer', fontSize: 12, fontWeight: 700, transition: 'all 0.3s',
          }}>
            <span style={{ fontSize: 16, display: 'inline-block', transition: 'transform 0.4s', transform: darkMode ? 'rotate(0deg)' : 'rotate(180deg)' }}>
              {darkMode ? '🌙' : '☀️'}
            </span>
            {darkMode ? 'Dark' : 'Light'}
          </button>

          {/* Manage warehouses */}
          <button onClick={() => setManageWh(v => !v)} style={{
            padding: '8px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700,
            border: `1px solid ${T.inputBorder}`,
            background: manageWh ? '#7c3aed' : T.input,
            color: manageWh ? '#fff' : T.text, cursor: 'pointer', transition: 'all 0.2s',
          }}>🏭 Warehouses</button>

          {/* Export CSV */}
          <button onClick={handleExport} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 14px', borderRadius: 10, fontSize: 12, fontWeight: 700,
            border: `1px solid ${T.inputBorder}`, background: T.input,
            color: T.text, cursor: 'pointer', transition: 'all 0.2s',
          }}>⬇ Export CSV</button>

          {/* Add item */}
          <button onClick={() => setStockModal({ warehouse: warehouse === 'ALL' ? (warehouses[0]?.name || '') : warehouse })} style={{
            padding: '9px 18px', borderRadius: 10, background: T.teal,
            color: '#fff', fontWeight: 900, fontSize: 12, border: 'none', cursor: 'pointer', letterSpacing: '0.08em',
          }}>+ ADD ITEM</button>
        </div>
      </div>

      {/* ── Warehouse management panel ── */}
      {manageWh && (
        <div style={{ marginBottom: 20, padding: 20, borderRadius: 14, border: '1px solid #7c3aed40', background: T.card, boxShadow: T.shadow }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <span style={{ color: T.text, fontWeight: 800, fontSize: 14 }}>🏭 Manage Warehouses</span>
            <button onClick={() => setWhModal({})} style={{
              padding: '7px 14px', borderRadius: 8, background: '#7c3aed',
              color: '#fff', fontWeight: 700, fontSize: 11, border: 'none', cursor: 'pointer',
            }}>+ NEW WAREHOUSE</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px,1fr))', gap: 10 }}>
            {warehouses.map(wh => (
              <div key={wh.id} style={{
                padding: '14px 16px', borderRadius: 12,
                border: `1px solid ${wh.color}30`,
                background: darkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.03)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div>
                  <Badge label={wh.name} color={wh.color} />
                  <div style={{ color: T.sub, fontSize: 10, marginTop: 6, fontFamily: 'monospace' }}>
                    {data.filter(x => x.warehouse === wh.name).length} items · {wh.date_columns.length} day columns
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button onClick={() => setWhModal(wh)} style={{
                    padding: '5px 10px', borderRadius: 6, background: `${T.teal}18`,
                    color: T.teal, fontSize: 11, fontWeight: 700, border: `1px solid ${T.teal}30`, cursor: 'pointer',
                  }}>Edit</button>
                  <button onClick={() => handleDeleteWarehouse(wh)} style={{
                    padding: '5px 10px', borderRadius: 6, background: 'rgba(239,68,68,0.1)',
                    color: '#ef4444', fontSize: 11, fontWeight: 700, border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer',
                  }}>Del</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Stats ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(120px,1fr))', gap: 10, marginBottom: 24 }}>
        {[
          { label: 'Total SKUs',   value: stats.total,                    color: T.teal },
          { label: 'Healthy',      value: stats.ok,                       color: '#34d399' },
          { label: 'Low / Empty',  value: stats.low,                      color: '#f87171' },
          { label: 'Units Moved',  value: stats.taken.toLocaleString(),    color: '#38bdf8' },
        ].map(s => (
          <div key={s.label} style={{ padding: 16, borderRadius: 12, border: `1px solid ${s.color}25`, background: T.card, boxShadow: T.shadow, transition: 'all 0.3s' }}>
            <div style={{ color: s.color, fontSize: 24, fontWeight: 900, lineHeight: 1 }}>{s.value}</div>
            <div style={{ color: T.sub, fontSize: 10, fontFamily: 'monospace', marginTop: 4, letterSpacing: '0.1em' }}>{s.label.toUpperCase()}</div>
          </div>
        ))}
      </div>

      {/* ── Warehouse pills + status filters ── */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 14, alignItems: 'center' }}>
        {['ALL', ...warehouses.map(w => w.name)].map(w => (
          <button key={w} onClick={() => { setWarehouse(w); setPage(1); setViewDates(false) }} style={{
            padding: '7px 14px', borderRadius: 8, fontSize: 11, fontWeight: 700,
            letterSpacing: '0.08em', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
            background: warehouse === w ? (wColor(w) || T.teal) : T.tag,
            color: warehouse === w ? '#060d1a' : T.sub,
            outline: warehouse === w ? 'none' : `1px solid ${T.border}`,
          }}>{w}</button>
        ))}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {([['all','ALL'],['low','⚠ LOW'],['zero','✕ EMPTY']] as const).map(([val, label]) => (
            <button key={val} onClick={() => { setFilter(val); setPage(1) }} style={{
              padding: '7px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700,
              letterSpacing: '0.06em', border: 'none', cursor: 'pointer', transition: 'all 0.2s',
              background: filter === val ? (val === 'zero' ? '#ef4444' : val === 'low' ? '#f59e0b' : T.teal) : T.tag,
              color: filter === val ? '#060d1a' : T.sub,
              outline: filter === val ? 'none' : `1px solid ${T.border}`,
            }}>{label}</button>
          ))}
          {warehouse !== 'ALL' && (
            <button onClick={() => setViewDates(d => !d)} style={{
              padding: '7px 12px', borderRadius: 8, fontSize: 11, fontWeight: 700,
              border: 'none', cursor: 'pointer', transition: 'all 0.2s',
              background: viewDates ? '#7c3aed' : T.tag,
              color: viewDates ? '#fff' : T.sub,
              outline: viewDates ? 'none' : `1px solid ${T.border}`,
            }}>📅 {viewDates ? 'HIDE DATES' : 'SHOW DATES'}</button>
          )}
        </div>
      </div>

      {/* ── Search ── */}
      <div style={{ position: 'relative', maxWidth: 480, marginBottom: 20 }}>
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: T.sub, pointerEvents: 'none' }}>⌕</span>
        <input value={query} onChange={e => { setQuery(e.target.value); setPage(1) }}
          placeholder="Search model / product name…"
          style={{ ...inp, width: '100%', paddingLeft: 32, paddingRight: query ? 32 : 14, boxSizing: 'border-box' }} />
        {query && (
          <button onClick={() => setQuery('')} style={{ position: 'absolute', right: 10, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: T.sub, cursor: 'pointer', fontSize: 14 }}>✕</button>
        )}
      </div>

      {/* ── Selected item detail card ── */}
      {selected && (
        <div style={{ marginBottom: 20, padding: 20, borderRadius: 14, border: `1px solid ${statusColor(selected, T.teal)}40`, background: T.card, boxShadow: T.shadow, transition: 'all 0.3s' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <div style={{ fontFamily: 'monospace', fontWeight: 900, color: T.text, fontSize: 15, marginBottom: 6 }}>{selected.model}</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <Badge label={selected.warehouse} color={wColor(selected.warehouse)} />
                <Badge label={statusLabel(selected)} color={statusColor(selected, T.teal)} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => { setStockModal({ ...selected }); setSelected(null) }}
                style={{ padding: '7px 14px', borderRadius: 8, background: T.teal, color: '#fff', fontSize: 11, fontWeight: 700, border: 'none', cursor: 'pointer' }}>✏️ Edit</button>
              <button onClick={() => setSelected(null)}
                style={{ background: 'none', border: 'none', color: T.sub, cursor: 'pointer', fontSize: 18 }}>✕</button>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(110px,1fr))', gap: 10, marginTop: 16 }}>
            {[
              { label: 'Opening',    value: selected.opening_stock, color: T.sub },
              { label: 'Total Taken',value: selected.total_taken,   color: '#f59e0b' },
              { label: 'Closing',    value: selected.closing_stock, color: statusColor(selected, T.teal) },
              { label: 'Min Level',  value: selected.min_level ?? '—', color: T.muted },
            ].map(f => (
              <div key={f.label} style={{ padding: 12, background: darkMode ? 'rgba(0,0,0,0.2)' : 'rgba(0,0,0,0.04)', borderRadius: 10 }}>
                <div style={{ color: T.sub, fontSize: 10, letterSpacing: '0.1em', marginBottom: 4 }}>{f.label.toUpperCase()}</div>
                <div style={{ color: f.color, fontWeight: 900, fontSize: 20, fontFamily: 'monospace' }}>
                  {typeof f.value === 'number' ? f.value.toLocaleString() : f.value}
                </div>
              </div>
            ))}
          </div>
          {Object.keys(selected.daily_taken).length > 0 && (
            <div style={{ marginTop: 14 }}>
              <div style={{ color: T.sub, fontSize: 10, letterSpacing: '0.1em', marginBottom: 8 }}>DAILY BREAKDOWN</div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {Object.entries(selected.daily_taken)
                  .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
                  .map(([day, qty]) => (
                  <div key={day} style={{ padding: '6px 10px', borderRadius: 8, textAlign: 'center', background: `${T.teal}15`, border: `1px solid ${T.teal}30` }}>
                    <div style={{ color: T.sub, fontSize: 9, letterSpacing: '0.1em' }}>DAY {day}</div>
                    <div style={{ color: T.teal, fontWeight: 900, fontSize: 14, fontFamily: 'monospace' }}>{qty}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {selected.opening_stock > 0 && (
            <div style={{ marginTop: 14 }}>
              <div style={{ color: T.sub, fontSize: 10, marginBottom: 6, letterSpacing: '0.1em' }}>
                STOCK LEVEL — {Math.round((selected.closing_stock / selected.opening_stock) * 100)}% remaining
              </div>
              <StockBar pct={(selected.closing_stock / selected.opening_stock) * 100} color={statusColor(selected, T.teal)} />
            </div>
          )}
        </div>
      )}

      {/* ── Table ── */}
      <div style={{ borderRadius: 14, border: `1px solid ${T.border}`, overflow: 'auto', background: T.card, boxShadow: T.shadow, transition: 'all 0.3s' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: viewDates ? '900px' : '600px' }}>
          <thead>
            <tr>
              <th onClick={() => handleSort('model')}         style={{ ...thStyle, textAlign: 'left', minWidth: 220 }}>MODEL / PRODUCT <SortArrow k="model" /></th>
              <th onClick={() => handleSort('warehouse')}     style={{ ...thStyle, textAlign: 'center' }}>WAREHOUSE <SortArrow k="warehouse" /></th>
              <th onClick={() => handleSort('opening_stock')} style={{ ...thStyle, textAlign: 'right'  }}>OPENING <SortArrow k="opening_stock" /></th>
              {viewDates && activeDates.map(day => (
                <th key={day} style={{ ...thStyle, textAlign: 'center', minWidth: 44, color: '#7c3aed', fontWeight: 900 }}>{day}</th>
              ))}
              <th onClick={() => handleSort('total_taken')}   style={{ ...thStyle, textAlign: 'right'  }}>TAKEN <SortArrow k="total_taken" /></th>
              <th onClick={() => handleSort('closing_stock')} style={{ ...thStyle, textAlign: 'right'  }}>CLOSING <SortArrow k="closing_stock" /></th>
              <th style={{ ...thStyle, textAlign: 'center', cursor: 'default' }}>STATUS</th>
              <th style={{ ...thStyle, textAlign: 'center', cursor: 'default' }}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {pageItems.length === 0 ? (
              <tr>
                <td colSpan={8 + (viewDates ? activeDates.length : 0)}
                  style={{ ...tdStyle, textAlign: 'center', padding: 56, color: T.muted, fontFamily: 'monospace' }}>
                  No items match your filters
                </td>
              </tr>
            ) : pageItems.map(item => {
              const sc  = statusColor(item, T.teal)
              const pct = item.opening_stock > 0 ? (item.closing_stock / item.opening_stock) * 100 : 0
              return (
                <tr key={item.id}
                  onClick={() => setSelected(s => s?.id === item.id ? null : item)}
                  style={{ cursor: 'pointer', transition: 'background 0.1s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = T.rowHover)}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={tdStyle}>
                    <div style={{ fontFamily: 'monospace', fontSize: 12, fontWeight: 600, marginBottom: 4, color: T.text }}>{item.model}</div>
                    <StockBar pct={pct} color={sc} />
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}>
                    <Badge label={item.warehouse} color={wColor(item.warehouse)} />
                  </td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'monospace', color: T.sub }}>{item.opening_stock.toLocaleString()}</td>
                  {viewDates && activeDates.map(day => (
                    <td key={day} style={{ ...tdStyle, textAlign: 'center', fontFamily: 'monospace', padding: '10px 4px' }}>
                      {item.daily_taken[day]
                        ? <span style={{ color: '#f59e0b', fontWeight: 700, fontSize: 11 }}>{item.daily_taken[day]}</span>
                        : <span style={{ color: T.border, fontSize: 11 }}>·</span>}
                    </td>
                  ))}
                  <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'monospace', color: '#f59e0b', fontWeight: 700 }}>{item.total_taken.toLocaleString()}</td>
                  <td style={{ ...tdStyle, textAlign: 'right', fontFamily: 'monospace', fontWeight: 900, color: sc, fontSize: 13 }}>{item.closing_stock.toLocaleString()}</td>
                  <td style={{ ...tdStyle, textAlign: 'center' }}><Badge label={statusLabel(item)} color={sc} /></td>
                  <td style={{ ...tdStyle, textAlign: 'center' }} onClick={e => e.stopPropagation()}>
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                      <button onClick={() => setStockModal({ ...item })} style={{
                        padding: '5px 10px', borderRadius: 6, background: `${T.teal}18`,
                        color: T.teal, fontSize: 11, fontWeight: 700, border: `1px solid ${T.teal}30`, cursor: 'pointer',
                      }}>Edit</button>
                      <button onClick={() => handleDeleteStock(item.id, item.model)} style={{
                        padding: '5px 10px', borderRadius: 6, background: 'rgba(239,68,68,0.1)',
                        color: '#ef4444', fontSize: 11, fontWeight: 700, border: '1px solid rgba(239,68,68,0.2)', cursor: 'pointer',
                      }}>Del</button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {pages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, flexWrap: 'wrap', gap: 10 }}>
          <span style={{ color: T.sub, fontSize: 12, fontFamily: 'monospace' }}>{filtered.length} items · page {page}/{pages}</span>
          <div style={{ display: 'flex', gap: 4 }}>
            <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1} style={{
              padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, border: 'none',
              cursor: page===1 ? 'not-allowed' : 'pointer', background: T.tag, color: page===1 ? T.muted : T.text,
            }}>← Prev</button>
            {Array.from({ length: Math.min(5, pages) }, (_, idx) => {
              const pg = page <= 3 ? idx+1 : page >= pages-2 ? pages-4+idx : page-2+idx
              if (pg < 1 || pg > pages) return null
              return (
                <button key={pg} onClick={() => setPage(pg)} style={{
                  padding: '7px 12px', borderRadius: 8, fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer',
                  background: page===pg ? T.teal : T.tag, color: page===pg ? '#060d1a' : T.text,
                }}>{pg}</button>
              )
            })}
            <button onClick={() => setPage(p => Math.min(pages, p+1))} disabled={page===pages} style={{
              padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 700, border: 'none',
              cursor: page===pages ? 'not-allowed' : 'pointer', background: T.tag, color: page===pages ? T.muted : T.text,
            }}>Next →</button>
          </div>
        </div>
      )}

      {/* ── Modals ── */}
      {stockModal && (
        <StockModal item={stockModal} warehouses={warehouses} T={T} dark={darkMode}
          onClose={() => setStockModal(null)} onSave={handleSaveStock} />
      )}
      {whModal && (
        <WarehouseModal wh={whModal} T={T} dark={darkMode}
          onClose={() => setWhModal(null)} onSave={handleSaveWarehouse} />
      )}
    </div>
  )
}
