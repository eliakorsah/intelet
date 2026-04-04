'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { BRANDS, type Product } from '@/types'
import StockTab from '@/components/StockTab'

const TEAL = '#00c49a'
const ADMIN_PASSWORD = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'tritech2024'

// ── Inline SVGs ──────────────────────────────────────────────
const IconPackage = () => (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>)
const IconBag    = () => (<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>)
const IconStar   = ({ filled }: { filled?: boolean }) => (<svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>)
const IconEdit   = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>)
const IconTrash  = () => (<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>)
const IconUpload = () => (<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>)
const IconX      = ({ size=14 }: { size?: number }) => (<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18M6 6l12 12"/></svg>)
const IconPlus   = () => (<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 5v14M5 12h14"/></svg>)
const IconChev   = ({ open }: { open: boolean }) => (<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transition:'transform 0.2s', transform: open?'rotate(180deg)':'none' }}><path d="m6 9 6 6 6-6"/></svg>)

// ── Category tree definition (mirrors Navbar + DB) ───────────
type SubSub = { name: string; slug: string }
type Sub    = { name: string; slug: string; subsubs?: SubSub[] }
type Cat    = { name: string; slug: string; subs: Sub[] }

const CATEGORY_TREE: Cat[] = [
  {
    name: 'Hikvision', slug: 'hikvision',
    subs: [
      { name: 'NVR',        slug: 'hikvision-nvr' },
      { name: 'EVR/EDVR',   slug: 'hikvision-evr' },
      { name: 'DVR',        slug: 'hikvision-dvr', subsubs: [{ name:'2MP', slug:'hikvision-dvr-2mp' }, { name:'5MP', slug:'hikvision-dvr-5mp' }] },
      { name: 'IP Cameras', slug: 'hikvision-ip' },
    ],
  },
  {
    name: 'Dahua', slug: 'dahua',
    subs: [
      { name: 'NVR',        slug: 'dahua-nvr' },
      { name: 'DVR',        slug: 'dahua-dvr', subsubs: [{ name:'4MP', slug:'dahua-dvr-4mp' }, { name:'8MP', slug:'dahua-dvr-8mp' }] },
      { name: 'IP Cameras', slug: 'dahua-ip' },
    ],
  },
  { name: 'Hi-Look',                 slug: 'hi-look',                 subs: [] },
  { name: 'Grandstream',             slug: 'grandstream',             subs: [] },
  { name: 'Alfama',                  slug: 'alfama',                  subs: [] },
  { name: 'Addressable Fire Alarm',  slug: 'addressable-fire-alarm',  subs: [] },
  { name: 'Conventional Fire Alarm', slug: 'conventional-fire-alarm', subs: [] },
  { name: 'Solar 4G PTZ Cameras',   slug: 'solar-4g-ptz',            subs: [] },
  { name: 'WiFi Cameras',           slug: 'wifi-cameras',            subs: [] },
  { name: 'Analogue Cameras',       slug: 'analogue-cameras',        subs: [] },
  { name: 'Networking Accessories', slug: 'networking-accessories',   subs: [] },
  { name: 'CCTV Accessories',       slug: 'cctv-accessories',        subs: [] },
  { name: 'Analogue Speakers',      slug: 'analogue-speakers',       subs: [] },
  { name: 'IP Speakers',            slug: 'ip-speakers',             subs: [] },
]

// ── Inline Category Picker ───────────────────────────────────
function CategoryPicker({ value, onChange }: { value: string; onChange: (slug: string, label: string) => void }) {
  const [l1, setL1] = useState('')
  const [l2, setL2] = useState('')
  const [l3, setL3] = useState('')

  useEffect(() => {
    if (!value) { setL1(''); setL2(''); setL3(''); return }
    for (const cat of CATEGORY_TREE) {
      if (cat.slug === value) { setL1(cat.slug); setL2(''); setL3(''); return }
      for (const sub of cat.subs) {
        if (sub.slug === value) { setL1(cat.slug); setL2(sub.slug); setL3(''); return }
        for (const ss of sub.subsubs || []) {
          if (ss.slug === value) { setL1(cat.slug); setL2(sub.slug); setL3(ss.slug); return }
        }
      }
    }
  }, [value])

  const selCat  = CATEGORY_TREE.find(c => c.slug === l1)
  const selSub  = selCat?.subs.find(s => s.slug === l2)
  const subsubs = selSub?.subsubs || []

  function pickL1(slug: string) {
    const cat = CATEGORY_TREE.find(c => c.slug === slug)
    setL1(slug); setL2(''); setL3('')
    onChange(slug, cat?.name || '')
  }
  function pickL2(slug: string) {
    const sub = selCat?.subs.find(s => s.slug === slug)
    setL2(slug); setL3('')
    onChange(slug, sub?.name || '')
  }
  function pickL3(slug: string) {
    const ss = subsubs.find(s => s.slug === slug)
    setL3(slug)
    onChange(slug, ss?.name || '')
  }

  const sel = (active: boolean) => ({
    width: '100%', padding: '9px 12px', borderRadius: '10px', fontSize: '16px', outline: 'none', cursor: 'pointer',
    border: `1px solid ${active ? TEAL : '#2a3a5c'}`, background: '#0d1f3c', color: '#e2e8f0',
  } as React.CSSProperties)

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
      <select value={l1} onChange={e => pickL1(e.target.value)} style={sel(!!l1)}>
        <option value="">Select category…</option>
        {CATEGORY_TREE.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}
      </select>

      {l1 && selCat && selCat.subs.length > 0 && (
        <select value={l2} onChange={e => pickL2(e.target.value)} style={sel(!!l2)}>
          <option value="">↳ No subcategory</option>
          {selCat.subs.map(s => <option key={s.slug} value={s.slug}>{s.name}</option>)}
        </select>
      )}

      {l2 && subsubs.length > 0 && (
        <select value={l3} onChange={e => pickL3(e.target.value)} style={sel(!!l3)}>
          <option value="">↳ No sub-subcategory</option>
          {subsubs.map(s => <option key={s.slug} value={s.slug}>{s.name}</option>)}
        </select>
      )}

      {l1 && (
        <div style={{ fontSize:'11px', color:'#64748b', fontFamily:'monospace', padding:'4px 8px', background:'rgba(0,196,154,0.06)', borderRadius:'6px', border:'1px solid rgba(0,196,154,0.15)' }}>
          {[l1,l2,l3].filter(Boolean).map(slug => {
            for (const c of CATEGORY_TREE) {
              if (c.slug===slug) return c.name
              for (const s of c.subs) {
                if (s.slug===slug) return s.name
                for (const ss of s.subsubs||[]) if(ss.slug===slug) return ss.name
              }
            }
            return slug
          }).join(' → ')}
        </div>
      )}
    </div>
  )
}

// ── Drag-sort image preview ──────────────────────────────────
function ImagePreview({ files, existing, onRemoveFile, onRemoveExisting, onReorderFiles }:{
  files: File[]; existing: string[]
  onRemoveFile: (i:number)=>void; onRemoveExisting:(i:number)=>void
  onReorderFiles: (files:File[])=>void
}) {
  const dragIdx = useRef<number|null>(null)
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginTop:'10px' }}>
      {existing.map((url, i) => (
        <div key={url} style={{ position:'relative', width:'72px', height:'72px', borderRadius:'10px', overflow:'hidden', border:'2px solid rgba(0,196,154,0.3)' }}>
          <Image src={url} alt="" fill className="object-cover" sizes="72px" />
          {i === 0 && <span style={{ position:'absolute', bottom:2, left:2, background:TEAL, color:'#fff', fontSize:'7px', fontWeight:800, padding:'1px 4px', borderRadius:'4px', letterSpacing:'0.1em' }}>COVER</span>}
          <button type="button" onClick={() => onRemoveExisting(i)}
            style={{ position:'absolute', top:2, right:2, background:'rgba(0,0,0,0.6)', border:'none', borderRadius:'50%', width:'18px', height:'18px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>
            <IconX size={10} />
          </button>
        </div>
      ))}
      {files.map((f, i) => (
        <div key={i} draggable
          onDragStart={() => { dragIdx.current = i }}
          onDragOver={e => e.preventDefault()}
          onDrop={() => {
            if (dragIdx.current === null || dragIdx.current === i) return
            const arr = [...files]
            const [moved] = arr.splice(dragIdx.current, 1)
            arr.splice(i, 0, moved)
            onReorderFiles(arr)
            dragIdx.current = null
          }}
          style={{ position:'relative', width:'72px', height:'72px', borderRadius:'10px', overflow:'hidden', border:'1px solid #2a3a5c', cursor:'grab' }}>
          <Image src={URL.createObjectURL(f)} alt="" fill className="object-cover" sizes="72px" />
          <button type="button" onClick={() => onRemoveFile(i)}
            style={{ position:'absolute', top:2, right:2, background:'rgba(0,0,0,0.6)', border:'none', borderRadius:'50%', width:'18px', height:'18px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff' }}>
            <IconX size={10} />
          </button>
        </div>
      ))}
    </div>
  )
}

// ── Toast helper ─────────────────────────────────────────────
function useToast() {
  const [msg, setMsg] = useState<{ text:string; type:'ok'|'err' }|null>(null)
  const show = useCallback((text:string, type:'ok'|'err'='ok') => {
    setMsg({ text, type })
    setTimeout(() => setMsg(null), 3000)
  }, [])
  const Toast = msg ? (
    <div style={{ position:'fixed', bottom:'24px', right:'24px', zIndex:9999, padding:'12px 20px', borderRadius:'12px', background: msg.type==='ok'?TEAL:'#ef4444', color:'#fff', fontWeight:700, fontSize:'13px', boxShadow:'0 8px 24px rgba(0,0,0,0.3)' }}>
      {msg.text}
    </div>
  ) : null
  return { show, Toast }
}

// ── Admin Page ───────────────────────────────────────────────
export default function AdminPage() {
  const { show, Toast } = useToast()
  const [authed,      setAuthed]      = useState(false)
  const [password,    setPassword]    = useState('')
  // ── ADDED: dark mode state ──
  const [darkMode,    setDarkMode]    = useState(true)
  const [tab,         setTab]         = useState<'products'|'orders'|'add'|'stock'>('products')
  const [products,    setProducts]    = useState<Product[]>([])
  const [orders,      setOrders]      = useState<any[]>([])
  const [loading,     setLoading]     = useState(false)
  const [editProduct, setEditProduct] = useState<Product|null>(null)
  const [search,      setSearch]      = useState('')

  const [form, setForm] = useState({
    title:'', model_number:'', brand: BRANDS[0] as string,
    description:'', price:'', category_slug:'', in_stock:true, featured:false,
    specifications:{} as Record<string,string>,
  })
  const [specKey,    setSpecKey]    = useState('')
  const [specVal,    setSpecVal]    = useState('')
  const [imageFiles, setImageFiles] = useState<File[]>([])
  const [existingImgs, setExistingImgs] = useState<string[]>([])
  const [dragging,   setDragging]   = useState(false)

  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession()
      if (data?.session) setAuthed(true)
    }

    checkAuth()
    const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {
      setAuthed(!!session)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (!authed) return
    fetchProducts(); fetchOrders()
  }, [authed])

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending:false })
    setProducts(data || [])
  }
  const fetchOrders = async () => {
    const { data } = await supabase.from('orders').select('*, products(title,model_number)').order('created_at', { ascending:false })
    setOrders(data || [])
  }

  const generateSlug = (title:string, model:string) =>
    `${title}-${model}`.toLowerCase().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').trim()

  const uploadImages = async (): Promise<string[]> => {
    const urls: string[] = []
    for (const file of imageFiles) {
      const ext  = file.name.split('.').pop()
      const name = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
      const { data, error } = await supabase.storage.from('product-images').upload(name, file, { cacheControl:'31536000', upsert:false })
      if (error) { show(`Upload failed: ${error.message}`, 'err'); continue }
      if (data) {
        const { data: u } = supabase.storage.from('product-images').getPublicUrl(data.path)
        urls.push(u.publicUrl)
      }
    }
    return urls
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title || !form.model_number) return show('Title and model number required', 'err')
    setLoading(true)
    try {
      const newUrls  = await uploadImages()
      const allImages = [...existingImgs, ...newUrls]
      const slug     = generateSlug(form.title, form.model_number)
      const payload  = {
        title:          form.title,
        model_number:   form.model_number,
        brand:          form.brand,
        description:    form.description,
        price:          form.price ? parseFloat(form.price) : null,
        category_id:    form.category_slug || null,
        in_stock:       form.in_stock,
        featured:       form.featured,
        specifications: form.specifications,
        images:         allImages,
        slug,
      }
      if (editProduct) {
        const { error } = await supabase.from('products').update({ ...payload, updated_at: new Date().toISOString() }).eq('id', editProduct.id)
        if (error) throw error
        show('Product updated!')
        setEditProduct(null)
      } else {
        const { error } = await supabase.from('products').insert(payload)
        if (error) throw error
        show('Product added!')
      }
      resetForm(); fetchProducts(); setTab('products')
    } catch (err: any) {
      show(err.message || 'Error saving product', 'err')
    } finally { setLoading(false) }
  }

  const resetForm = () => {
    setForm({ title:'', model_number:'', brand:BRANDS[0], description:'', price:'', category_slug:'', in_stock:true, featured:false, specifications:{} })
    setImageFiles([]); setExistingImgs([])
  }

  const startEdit = (p: Product) => {
    setEditProduct(p)
    setForm({ title:p.title, model_number:p.model_number, brand:p.brand, description:p.description||'', price:p.price?.toString()||'', category_slug:(p as any).category_id||'', in_stock:p.in_stock, featured:p.featured, specifications:p.specifications||{} })
    setExistingImgs(p.images||[])
    setImageFiles([])
    setTab('add')
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false)
    const dropped = Array.from(e.dataTransfer.files).filter(f => f.type.startsWith('image/'))
    setImageFiles(prev => [...prev, ...dropped].slice(0, 10 - existingImgs.length))
  }

  const addSpec = () => {
    if (specKey && specVal) {
      setForm(p => ({ ...p, specifications:{ ...p.specifications, [specKey]:specVal } }))
      setSpecKey(''); setSpecVal('')
    }
  }

  const filteredProducts = products.filter(p =>
    `${p.title} ${p.model_number} ${p.brand}`.toLowerCase().includes(search.toLowerCase())
  )

  const inputStyle: React.CSSProperties = {
    width:'100%', padding:'10px 14px', borderRadius:'10px', fontSize:'16px', outline:'none',
    border:'1px solid #2a3a5c', background:'#0d1f3c', color:'#e2e8f0',
  }
  const labelStyle: React.CSSProperties = {
    fontSize:'10px', fontWeight:800, color:TEAL, letterSpacing:'0.2em', textTransform:'uppercase', display:'block', marginBottom:'5px',
  }

  // ── ADDED: dark/light theme tokens ──────────────────────────
  const theme = {
    pageBg:  darkMode ? '#060d1a'              : '#f0f4f8',
    cardBg:  darkMode ? 'rgba(13,31,60,0.8)'   : '#ffffff',
    border:  darkMode ? 'rgba(0,196,154,0.12)' : 'rgba(0,180,140,0.2)',
    text:    darkMode ? '#e2e8f0'              : '#1a2535',
    sub:     darkMode ? '#64748b'              : '#64748b',
    muted:   darkMode ? '#475569'              : '#94a3b8',
  }

  // ── Login screen ─────────────────────────────────────────
  if (!authed) return (
    <div style={{
      minHeight:'100vh',
      background: theme.pageBg,
      display:'flex', alignItems:'center', justifyContent:'center', padding:'24px',
      transition:'background 0.35s ease',
    }}>
      {Toast}

      {/* ── ADDED: dark/light toggle on login screen ── */}
      <button
        onClick={() => setDarkMode(d => !d)}
        style={{
          position:'fixed', top:'20px', right:'20px',
          display:'flex', alignItems:'center', gap:'8px',
          padding:'8px 16px', borderRadius:'10px',
          border:`1px solid ${theme.border}`,
          background: theme.cardBg,
          color: theme.text,
          cursor:'pointer', fontSize:'12px', fontWeight:700,
          transition:'all 0.3s ease',
        }}
      >
        <span style={{ fontSize:'15px', display:'inline-block', transition:'transform 0.4s ease', transform: darkMode ? 'rotate(0deg)' : 'rotate(180deg)' }}>
          {darkMode ? '🌙' : '☀️'}
        </span>
        {darkMode ? 'Dark' : 'Light'}
      </button>

      <div style={{ width:'100%', maxWidth:'420px' }}>
        <div style={{ textAlign:'center', marginBottom:'32px' }}>
          <div style={{ width:'64px', height:'64px', borderRadius:'16px', background:'rgba(0,196,154,0.1)', border:'1px solid rgba(0,196,154,0.2)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 16px', color:TEAL }}>
            <IconPackage />
          </div>
          <h1 style={{ color: theme.text, fontWeight:900, fontSize:'28px', letterSpacing:'0.05em', transition:'color 0.35s' }}>MANAGER PORTAL</h1>
          <p style={{ color:'#64748b', fontSize:'13px', marginTop:'6px', fontFamily:'monospace' }}>Tritech Technologies Admin</p>
        </div>
        <form
          onSubmit={e => { e.preventDefault(); if (password===ADMIN_PASSWORD) { setAuthed(true) } else show('Wrong password','err') }}
          style={{ background: darkMode ? 'rgba(10,22,40,0.9)' : '#ffffff', border:`1px solid ${theme.border}`, borderRadius:'16px', padding:'32px', transition:'all 0.35s ease' }}
        >
          <label style={labelStyle}>Access Code</label>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password"
            style={{ ...inputStyle, marginBottom:'20px' }} />
          <button type="submit" style={{ width:'100%', padding:'12px', borderRadius:'10px', background:TEAL, color:'#fff', fontWeight:900, fontSize:'14px', border:'none', cursor:'pointer', letterSpacing:'0.1em' }}>
            ACCESS PORTAL
          </button>
        </form>
      </div>
    </div>
  )

  // ── Dashboard ────────────────────────────────────────────
  return (
    <div style={{
      minHeight:'100vh',
      background: theme.pageBg,
      padding:'20px 12px',
      transition:'background 0.35s ease',
    }}>
      {Toast}
      <div style={{ maxWidth:'1200px', margin:'0 auto' }}>

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'32px', flexWrap:'wrap', gap:'12px' }}>
          <div>
            <h1 style={{ color: theme.text, fontWeight:900, fontSize:'28px', letterSpacing:'0.05em', transition:'color 0.35s' }}>MANAGER PORTAL</h1>
            <p style={{ color:'#64748b', fontSize:'12px', fontFamily:'monospace', marginTop:'4px' }}>Tritech Technologies Admin</p>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            {/* ── ADDED: dark/light toggle in dashboard header ── */}
            <button
              onClick={() => setDarkMode(d => !d)}
              style={{
                display:'flex', alignItems:'center', gap:'8px',
                padding:'8px 16px', borderRadius:'10px',
                border:`1px solid ${theme.border}`,
                background: darkMode ? 'rgba(13,31,60,0.8)' : '#ffffff',
                color: theme.text,
                cursor:'pointer', fontSize:'12px', fontWeight:700,
                transition:'all 0.3s ease',
              }}
            >
              <span style={{ fontSize:'15px', display:'inline-block', transition:'transform 0.4s ease', transform: darkMode ? 'rotate(0deg)' : 'rotate(180deg)' }}>
                {darkMode ? '🌙' : '☀️'}
              </span>
              {darkMode ? 'Dark' : 'Light'}
            </button>

            <button onClick={() => { supabase.auth.signOut(); setAuthed(false); router.push('/admin/login') }}
              style={{ color:'#64748b', fontSize:'13px', background:'none', border:'none', cursor:'pointer' }}>
              Sign Out
            </button>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(140px,1fr))', gap:'12px', marginBottom:'28px' }}>
          {[
            { label:'Products',  value:products.length,                           icon:<IconPackage /> },
            { label:'Orders',    value:orders.length,                             icon:<IconBag /> },
            { label:'In Stock',  value:products.filter(p=>p.in_stock).length,     icon:<span style={{fontSize:'20px'}}>✓</span> },
            { label:'Featured',  value:products.filter(p=>p.featured).length,     icon:<IconStar filled /> },
          ].map(s => (
            <div key={s.label} style={{
              padding:'20px', borderRadius:'14px',
              border: `1px solid ${theme.border}`,
              background: theme.cardBg,
              transition:'all 0.35s ease',
            }}>
              <div style={{ color:TEAL, marginBottom:'10px' }}>{s.icon}</div>
              <div style={{ color: theme.text, fontWeight:900, fontSize:'28px', lineHeight:1, transition:'color 0.35s' }}>{s.value}</div>
              <div style={{ color:'#64748b', fontSize:'11px', fontFamily:'monospace', marginTop:'4px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{
          display:'flex', gap:'4px',
          background: darkMode ? 'rgba(13,31,60,0.6)' : 'rgba(255,255,255,0.8)',
          border:`1px solid ${theme.border}`,
          borderRadius:'12px', padding:'4px', width:'fit-content', maxWidth:'100%', overflowX:'auto', marginBottom:'28px',
          transition:'all 0.35s ease',
        }}>
          {(['products','orders','add','stock'] as const).map(t => (
            <button key={t} onClick={() => { setTab(t); if (t!=='add') { resetForm(); setEditProduct(null) } }}
              style={{ padding:'10px 20px', borderRadius:'8px', fontWeight:700, fontSize:'12px', letterSpacing:'0.1em', border:'none', cursor:'pointer', transition:'all 0.15s', background: tab===t ? TEAL : 'transparent', color: tab===t ? '#060d1a' : '#64748b' }}>
              {t==='add' ? (editProduct ? 'EDIT PRODUCT' : '+ ADD PRODUCT') : t==='stock' ? '📦 STOCK' : t.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Products tab */}
        {tab === 'products' && (
          <div>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search products…"
              style={{ ...inputStyle, maxWidth:'400px', marginBottom:'16px' }} />
            <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))', gap:'12px' }}>
              {filteredProducts.map(p => (
                <div key={p.id} style={{ display:'flex', gap:'14px', padding:'16px', borderRadius:'14px', border:`1px solid ${theme.border}`, background: theme.cardBg, transition:'all 0.35s ease' }}>
                  <div style={{ position:'relative', width:'76px', height:'76px', borderRadius:'10px', overflow:'hidden', background:'#0d1f3c', flexShrink:0 }}>
                    {p.images?.[0] ? <Image src={p.images[0]} alt={p.title} fill className="object-cover" sizes="76px" /> : <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'100%', color:'#334155' }}><IconPackage /></div>}
                  </div>
                  <div style={{ flex:1, minWidth:0 }}>
                    <div style={{ fontSize:'10px', color:'#475569', fontFamily:'monospace', marginBottom:'3px' }}>{p.brand} · {p.model_number}</div>
                    <div style={{ fontWeight:700, color: theme.text, fontSize:'13px', marginBottom:'8px', overflow:'hidden', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical' }}>{p.title}</div>
                    <div style={{ display:'flex', alignItems:'center', gap:'8px', flexWrap:'wrap' }}>
                      <span style={{ fontSize:'11px', padding:'2px 8px', borderRadius:'6px', background: p.in_stock?'rgba(0,196,154,0.12)':'rgba(239,68,68,0.1)', color: p.in_stock?TEAL:'#f87171' }}>
                        {p.in_stock ? 'In Stock' : 'Out of Stock'}
                      </span>
                      <div style={{ marginLeft:'auto', display:'flex', gap:'4px' }}>
                        <button onClick={async () => { await supabase.from('products').update({ featured:!p.featured }).eq('id',p.id); fetchProducts() }}
                          style={{ padding:'6px', borderRadius:'6px', background:'none', border:'none', cursor:'pointer', color: p.featured?'#fbbf24':'#475569' }}><IconStar filled={p.featured} /></button>
                        <button onClick={() => startEdit(p)} style={{ padding:'6px', borderRadius:'6px', background:'none', border:'none', cursor:'pointer', color:'#475569' }}><IconEdit /></button>
                        <button onClick={async () => { if (!confirm('Delete?')) return; await supabase.from('products').delete().eq('id',p.id); fetchProducts(); show('Deleted') }}
                          style={{ padding:'6px', borderRadius:'6px', background:'none', border:'none', cursor:'pointer', color:'#475569' }}><IconTrash /></button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Orders tab */}
        {tab === 'orders' && (
          <div style={{ display:'flex', flexDirection:'column', gap:'12px' }}>
            {orders.length === 0 && <div style={{ textAlign:'center', padding:'64px 0', color:'#475569', fontFamily:'monospace' }}>No orders yet</div>}
            {orders.map(order => (
              <div key={order.id} style={{ padding:'24px', borderRadius:'14px', border:`1px solid ${theme.border}`, background: theme.cardBg, transition:'all 0.35s ease' }}>
                <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'12px', marginBottom:'12px' }}>
                  <div>
                    <div style={{ fontWeight:700, color: theme.text, fontSize:'15px' }}>{order.customer_name}</div>
                    <div style={{ color:'#64748b', fontSize:'12px', fontFamily:'monospace' }}>{order.customer_phone} {order.customer_email && `· ${order.customer_email}`}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ color:'#475569', fontSize:'11px', fontFamily:'monospace' }}>{new Date(order.created_at).toLocaleDateString()}</div>
                    <div style={{ color:TEAL, fontFamily:'monospace', fontSize:'12px' }}>Qty: {order.quantity}</div>
                  </div>
                </div>
                <div style={{ color:'#94a3b8', fontSize:'13px', marginBottom:'12px' }}>
                  <strong style={{ color:'#64748b' }}>Product: </strong>{order.products?.title} — {order.products?.model_number}
                </div>
                <div style={{ display:'flex', gap:'6px', flexWrap:'wrap' }}>
                  {(['pending','confirmed','delivered','cancelled'] as const).map(status => (
                    <button key={status} onClick={async () => { await supabase.from('orders').update({ status }).eq('id',order.id); fetchOrders(); show(`Marked ${status}`) }}
                      style={{ padding:'6px 14px', borderRadius:'8px', fontSize:'11px', fontWeight:700, letterSpacing:'0.08em', border:'none', cursor:'pointer', transition:'all 0.15s',
                        background: order.status===status ? TEAL : 'rgba(0,196,154,0.08)',
                        color: order.status===status ? '#060d1a' : '#64748b',
                        outline: order.status===status ? 'none' : '1px solid rgba(0,196,154,0.2)',
                      }}>
                      {status.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add/Edit form */}
        {tab === 'add' && (
          <form onSubmit={handleSubmit} style={{ maxWidth:'760px' }}>
            <div style={{ display:'grid', gap:'18px' }}>

              <div>
                <label style={labelStyle}>Product Title *</label>
                <input required value={form.title} onChange={e => setForm(p=>({...p,title:e.target.value}))} placeholder="e.g. Hikvision 4MP ColorVu Fixed Bullet Camera" style={inputStyle} />
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))', gap:'14px' }}>
                <div>
                  <label style={labelStyle}>Model Number *</label>
                  <input required value={form.model_number} onChange={e => setForm(p=>({...p,model_number:e.target.value}))} placeholder="e.g. DS-2CD2T47G2-L" style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Brand *</label>
                  <select value={form.brand} onChange={e => setForm(p=>({...p,brand:e.target.value}))} style={inputStyle}>
                    {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label style={labelStyle}>Category</label>
                <CategoryPicker value={form.category_slug} onChange={(slug) => setForm(p=>({...p,category_slug:slug}))} />
              </div>

              <div style={{ maxWidth:'240px' }}>
                <label style={labelStyle}>Price (GH₵)</label>
                <input type="number" step="0.01" value={form.price} onChange={e => setForm(p=>({...p,price:e.target.value}))} placeholder="Leave blank to hide" style={inputStyle} />
              </div>

              <div>
                <label style={labelStyle}>Description</label>
                <textarea rows={4} value={form.description} onChange={e => setForm(p=>({...p,description:e.target.value}))} placeholder="Detailed product description…" style={{ ...inputStyle, resize:'vertical' }} />
              </div>

              <div>
                <label style={labelStyle}>Specifications</label>
                <div style={{ display:'flex', gap:'8px', marginBottom:'10px', flexWrap:'wrap' }}>
                  <input value={specKey} onChange={e => setSpecKey(e.target.value)} onKeyDown={e => { if(e.key==='Enter'){e.preventDefault();addSpec()} }} placeholder="Key (e.g. Resolution)" style={{ ...inputStyle, flex:'1 1 140px' }} />
                  <input value={specVal} onChange={e => setSpecVal(e.target.value)} onKeyDown={e => { if(e.key==='Enter'){e.preventDefault();addSpec()} }} placeholder="Value (e.g. 4MP)" style={{ ...inputStyle, flex:'1 1 140px' }} />
                  <button type="button" onClick={addSpec} style={{ padding:'10px 16px', borderRadius:'10px', background:TEAL, color:'#fff', fontWeight:700, border:'none', cursor:'pointer', flexShrink:0 }}>
                    <IconPlus />
                  </button>
                </div>
                {Object.entries(form.specifications).map(([k,v]) => (
                  <div key={k} style={{ display:'flex', alignItems:'center', padding:'8px 12px', borderRadius:'8px', background:'rgba(0,196,154,0.06)', border:'1px solid rgba(0,196,154,0.15)', marginBottom:'6px' }}>
                    <span style={{ color:TEAL, fontFamily:'monospace', fontSize:'12px', marginRight:'8px' }}>{k}:</span>
                    <span style={{ color:'#94a3b8', fontSize:'12px', flex:1 }}>{v}</span>
                    <button type="button" onClick={() => setForm(p=>{const s={...p.specifications};delete s[k];return{...p,specifications:s}})}
                      style={{ background:'none', border:'none', cursor:'pointer', color:'#475569', padding:'2px' }}><IconX /></button>
                  </div>
                ))}
              </div>

              <div>
                <label style={labelStyle}>Product Images {editProduct && '(existing shown below)'}</label>
                <div
                  onDragEnter={() => setDragging(true)}
                  onDragLeave={() => setDragging(false)}
                  onDragOver={e => e.preventDefault()}
                  onDrop={handleDrop}
                  style={{ border:`2px dashed ${dragging?TEAL:'rgba(0,196,154,0.25)'}`, borderRadius:'14px', padding:'32px', textAlign:'center', cursor:'pointer', transition:'border-color 0.2s', background: dragging?'rgba(0,196,154,0.05)':'transparent' }}
                  onClick={() => document.getElementById('img-upload')?.click()}>
                  <div style={{ color:'#334155', marginBottom:'8px', display:'flex', justifyContent:'center' }}><IconUpload /></div>
                  <p style={{ color:'#64748b', fontSize:'13px', marginBottom:'4px' }}>Drop images here or click to browse</p>
                  <p style={{ color:'#334155', fontSize:'11px', fontFamily:'monospace' }}>PNG, JPG, WEBP · Max 10 images</p>
                  <input type="file" accept="image/*" multiple id="img-upload" style={{ display:'none' }}
                    onChange={e => { const arr = Array.from(e.target.files||[]); setImageFiles(prev=>[...prev,...arr].slice(0,10-existingImgs.length)) }} />
                </div>
                <ImagePreview
                  files={imageFiles} existing={existingImgs}
                  onRemoveFile={i => setImageFiles(p=>{const a=[...p];a.splice(i,1);return a})}
                  onRemoveExisting={i => setExistingImgs(p=>{const a=[...p];a.splice(i,1);return a})}
                  onReorderFiles={setImageFiles} />
              </div>

              <div style={{ display:'flex', gap:'24px' }}>
                {[
                  { label:'In Stock',  key:'in_stock' as const,  color:TEAL },
                  { label:'Featured',  key:'featured' as const,  color:'#fbbf24' },
                ].map(({ label, key, color }) => (
                  <div key={key} style={{ display:'flex', alignItems:'center', gap:'10px', cursor:'pointer' }} onClick={() => setForm(p=>({...p,[key]:!p[key]}))}>
                    <div style={{ width:'44px', height:'24px', borderRadius:'12px', background: form[key]?color:'#1e293b', position:'relative', transition:'background 0.2s' }}>
                      <div style={{ position:'absolute', top:'4px', width:'16px', height:'16px', borderRadius:'50%', background:'#fff', boxShadow:'0 1px 3px rgba(0,0,0,0.3)', transition:'transform 0.2s', transform: form[key]?'translateX(24px)':'translateX(4px)' }} />
                    </div>
                    <span style={{ color:'#94a3b8', fontSize:'12px', fontWeight:700, letterSpacing:'0.08em' }}>{label.toUpperCase()}</span>
                  </div>
                ))}
              </div>

              <div style={{ display:'flex', gap:'12px', paddingTop:'8px' }}>
                <button type="submit" disabled={loading}
                  style={{ flex:1, padding:'14px', borderRadius:'12px', background: loading?'#1e293b':TEAL, color: loading?'#475569':'#fff', fontWeight:900, fontSize:'14px', letterSpacing:'0.1em', border:'none', cursor: loading?'not-allowed':'pointer', transition:'all 0.2s' }}>
                  {loading ? 'SAVING…' : (editProduct ? 'UPDATE PRODUCT' : 'ADD PRODUCT')}
                </button>
                {editProduct && (
                  <button type="button" onClick={() => { resetForm(); setEditProduct(null); setTab('products') }}
                    style={{ padding:'14px 24px', borderRadius:'12px', background:'#1e293b', color:'#94a3b8', fontWeight:700, border:'1px solid #2a3a5c', cursor:'pointer' }}>
                    CANCEL
                  </button>
                )}
              </div>
            </div>
          </form>
        )}

        {/* Stock tab */}
        {tab === 'stock' && (
          <StockTab darkMode={darkMode} onToggleDark={() => setDarkMode(d => !d)} />
        )}

      </div>
    </div>
  )
}