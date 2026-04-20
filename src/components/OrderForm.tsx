'use client'

import { useState } from 'react'
import { ShoppingCart, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/types'
import { COMPANY, COLORS, whatsappLink } from '@/lib/brand'

const RED      = COLORS.red
const RED_DEEP = COLORS.redDeep

export default function OrderForm({ product }: { product: Product }) {
  const [form, setForm] = useState({
    customer_name: '', customer_email: '',
    customer_phone: '', customer_address: '', quantity: '1', message: ''
  })
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.customer_name || !form.customer_phone) {
      toast.error('Please fill in required fields')
      return
    }
    setLoading(true)
    const { error } = await supabase.from('orders').insert({
      product_id: product.id,
      ...form,
      quantity: parseInt(form.quantity) || 1,
    })
    if (error) {
      toast.error('Order failed. Please try WhatsApp instead.')
    } else {
      toast.success('Order submitted! We will contact you shortly.')
      setForm({ customer_name: '', customer_email: '', customer_phone: '', customer_address: '', quantity: '1', message: '' })
    }
    setLoading(false)
  }

  const waMsg = `Hello ${COMPANY.name}, I want to order *${product.title}* (${product.model_number}). Please confirm availability and price.`
  const waUrl = whatsappLink(encodeURIComponent(waMsg))

  const labelClass = 'text-xs font-mono tracking-widest block mb-2'
  const labelStyle = { color: RED }

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: COLORS.white, border: `1px solid ${COLORS.ashLine}` }}
    >
      {/* Header */}
      <div
        className="px-8 py-6"
        style={{ background: COLORS.ash, borderBottom: `1px solid ${COLORS.ashLine}` }}
      >
        <div className="flex items-center gap-3">
          <ShoppingCart size={22} style={{ color: RED }} />
          <div>
            <h2 className="font-heading font-bold text-xl tracking-wide" style={{ color: COLORS.ink }}>
              PLACE ORDER
            </h2>
            <p className="text-sm" style={{ color: COLORS.inkSoft }}>
              {product.title} — {product.model_number}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="p-8">
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className={labelClass} style={labelStyle}>FULL NAME *</label>
            <input required name="customer_name" value={form.customer_name} onChange={handleChange}
              placeholder="Your full name" className="cyber-input w-full px-4 py-3 rounded-lg text-sm" />
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>PHONE NUMBER *</label>
            <input required name="customer_phone" value={form.customer_phone} onChange={handleChange}
              placeholder="+233 XX XXX XXXX" className="cyber-input w-full px-4 py-3 rounded-lg text-sm" />
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>EMAIL ADDRESS</label>
            <input type="email" name="customer_email" value={form.customer_email} onChange={handleChange}
              placeholder="your@email.com" className="cyber-input w-full px-4 py-3 rounded-lg text-sm" />
          </div>
          <div>
            <label className={labelClass} style={labelStyle}>QUANTITY</label>
            <input type="number" min="1" name="quantity" value={form.quantity} onChange={handleChange}
              className="cyber-input w-full px-4 py-3 rounded-lg text-sm" />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass} style={labelStyle}>DELIVERY ADDRESS</label>
            <input name="customer_address" value={form.customer_address} onChange={handleChange}
              placeholder="Where should we deliver?" className="cyber-input w-full px-4 py-3 rounded-lg text-sm" />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass} style={labelStyle}>ADDITIONAL MESSAGE</label>
            <textarea name="message" value={form.message} onChange={handleChange} rows={3}
              placeholder="Any special requests or questions…"
              className="cyber-input w-full px-4 py-3 rounded-lg text-sm resize-none" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <button
            type="submit"
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-lg font-heading font-bold tracking-wide text-white disabled:opacity-50 disabled:cursor-not-allowed transition-transform active:scale-95"
            style={{ background: `linear-gradient(90deg, ${RED} 0%, ${RED_DEEP} 100%)` }}
          >
            {loading ? <div className="cyber-spinner w-5 h-5" /> : <><Send size={18} /> SUBMIT ORDER</>}
          </button>
          <a
            href={waUrl}
            target="_blank" rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 py-4 rounded-lg font-heading font-bold tracking-wide transition-colors"
            style={{ border: `2px solid ${RED}`, color: RED, background: COLORS.white }}
          >
            ORDER VIA WHATSAPP
          </a>
        </div>
      </form>
    </div>
  )
}
