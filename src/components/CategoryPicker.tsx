'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import type { Category } from '@/lib/categories'
import { getChildren } from '@/lib/categories'

import { COLORS } from '@/lib/brand'

const RED = COLORS.red

const IconPlus = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 5v14M5 12h14"/>
  </svg>
)

interface Props {
  value: string        // category_id
  onChange: (id: string, name: string) => void
}

export default function CategoryPicker({ value, onChange }: Props) {
  const [all,     setAll]     = useState<Category[]>([])
  const [level1,  setLevel1]  = useState('')   // selected top-level id
  const [level2,  setLevel2]  = useState('')   // selected sub id
  const [level3,  setLevel3]  = useState('')   // selected sub-sub id
  const [adding,  setAdding]  = useState<null | 'l1' | 'l2' | 'l3'>(null)
  const [newName, setNewName] = useState('')
  const [saving,  setSaving]  = useState(false)

  useEffect(() => { loadAll() }, [])

  // Set pickers from incoming value
  useEffect(() => {
    if (!value || all.length === 0) return
    const found = all.find(c => c.id === value)
    if (!found) return
    if (!found.parent_id) {
      setLevel1(found.id); setLevel2(''); setLevel3('')
    } else {
      const parent = all.find(c => c.id === found.parent_id)
      if (!parent) return
      if (!parent.parent_id) {
        setLevel1(parent.id); setLevel2(found.id); setLevel3('')
      } else {
        setLevel1(parent.parent_id); setLevel2(parent.id); setLevel3(found.id)
      }
    }
  }, [value, all])

  async function loadAll() {
    const { data } = await supabase.from('categories').select('*').order('sort_order')
    setAll(data || [])
  }

  function slugify(s: string) {
    return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }

  async function addCategory(parentId: string | null) {
    if (!newName.trim()) return
    setSaving(true)
    const baseSlug = slugify(newName)
    const slug     = parentId ? `${slugify(all.find(c=>c.id===parentId)?.name||'')}-${baseSlug}` : baseSlug
    const maxOrder = Math.max(0, ...all.filter(c => c.parent_id === parentId).map(c => c.sort_order))
    await supabase.from('categories').insert({ name: newName.trim(), slug, parent_id: parentId, sort_order: maxOrder + 1 })
    setNewName(''); setAdding(null); setSaving(false)
    await loadAll()
  }

  function select(id: string, level: 1 | 2 | 3) {
    if (level === 1) { setLevel1(id); setLevel2(''); setLevel3(''); onChange(id, all.find(c=>c.id===id)?.name||'') }
    if (level === 2) { setLevel2(id); setLevel3(''); onChange(id, all.find(c=>c.id===id)?.name||'') }
    if (level === 3) { setLevel3(id); onChange(id, all.find(c=>c.id===id)?.name||'') }
  }

  const roots = getChildren(all, null)
  const subs  = level1 ? getChildren(all, level1) : []
  const subs2 = level2 ? getChildren(all, level2) : []

  const selectStyle = {
    width: '100%', padding: '8px 12px', borderRadius: '10px',
    border: '1px solid #e5e7eb', fontSize: '13px', outline: 'none',
    background: '#fff', color: '#0d1117',
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>

      {/* Level 1 */}
      <div>
        <label style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
          Category
        </label>
        <div style={{ display: 'flex', gap: '6px' }}>
          <select value={level1} onChange={e => select(e.target.value, 1)} style={selectStyle}>
            <option value="">Select category…</option>
            {roots.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
          <button type="button" onClick={() => { setAdding('l1'); setNewName('') }}
            style={{ padding: '8px 10px', borderRadius: '10px', border: '1px solid #e5e7eb', background: '#f7f8fc', cursor: 'pointer', color: RED, flexShrink: 0 }}>
            <IconPlus />
          </button>
        </div>
        {adding === 'l1' && (
          <AddRow name={newName} onChange={setNewName} onSave={() => addCategory(null)} onCancel={() => setAdding(null)} saving={saving} />
        )}
      </div>

      {/* Level 2 */}
      {level1 && (
        <div>
          <label style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
            Subcategory
          </label>
          <div style={{ display: 'flex', gap: '6px' }}>
            <select value={level2} onChange={e => select(e.target.value, 2)} style={selectStyle}>
              <option value="">None (use category only)</option>
              {subs.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <button type="button" onClick={() => { setAdding('l2'); setNewName('') }}
              style={{ padding: '8px 10px', borderRadius: '10px', border: '1px solid #e5e7eb', background: '#f7f8fc', cursor: 'pointer', color: RED, flexShrink: 0 }}>
              <IconPlus />
            </button>
          </div>
          {adding === 'l2' && (
            <AddRow name={newName} onChange={setNewName} onSave={() => addCategory(level1)} onCancel={() => setAdding(null)} saving={saving} />
          )}
        </div>
      )}

      {/* Level 3 */}
      {level2 && (
        <div>
          <label style={{ fontSize: '11px', fontWeight: 700, color: '#6b7280', letterSpacing: '0.1em', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
            Sub-subcategory
          </label>
          <div style={{ display: 'flex', gap: '6px' }}>
            <select value={level3} onChange={e => select(e.target.value, 3)} style={selectStyle}>
              <option value="">None (use subcategory only)</option>
              {subs2.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <button type="button" onClick={() => { setAdding('l3'); setNewName('') }}
              style={{ padding: '8px 10px', borderRadius: '10px', border: '1px solid #e5e7eb', background: '#f7f8fc', cursor: 'pointer', color: RED, flexShrink: 0 }}>
              <IconPlus />
            </button>
          </div>
          {adding === 'l3' && (
            <AddRow name={newName} onChange={setNewName} onSave={() => addCategory(level2)} onCancel={() => setAdding(null)} saving={saving} />
          )}
        </div>
      )}

      {/* Selected path display */}
      {level1 && (
        <div style={{ fontSize: '11px', color: '#9ca3af', padding: '6px 10px', background: '#f7f8fc', borderRadius: '8px', fontFamily: 'monospace' }}>
          {[level1, level2, level3].filter(Boolean).map(id => all.find(c=>c.id===id)?.name).join(' → ')}
        </div>
      )}
    </div>
  )
}

function AddRow({ name, onChange, onSave, onCancel, saving }: {
  name: string; onChange: (v: string) => void
  onSave: () => void; onCancel: () => void; saving: boolean
}) {
  return (
    <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
      <input autoFocus value={name} onChange={e => onChange(e.target.value)}
        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); onSave() } if (e.key === 'Escape') onCancel() }}
        placeholder="New category name…"
        style={{ flex: 1, padding: '7px 10px', borderRadius: '8px', border: '1px solid #C8102E', fontSize: '12px', outline: 'none' }} />
      <button type="button" onClick={onSave} disabled={saving}
        style={{ padding: '7px 14px', borderRadius: '8px', background: '#C8102E', color: '#fff', fontSize: '12px', fontWeight: 700, cursor: 'pointer', border: 'none' }}>
        {saving ? '…' : 'Add'}
      </button>
      <button type="button" onClick={onCancel}
        style={{ padding: '7px 10px', borderRadius: '8px', background: '#f1f1f1', fontSize: '12px', cursor: 'pointer', border: 'none', color: '#6b7280' }}>
        Cancel
      </button>
    </div>
  )
}
