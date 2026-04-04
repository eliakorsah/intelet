'use client'

import { useState } from 'react'
import { ShoppingCart, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { supabase } from '@/lib/supabase'
import type { Product } from '@/types'

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

  return (
    <div className="rounded-2xl border border-[rgba(0,212,170,0.2)] bg-[rgba(10,22,40,0.8)] overflow-hidden">
      {/* Header */}
      <div className="px-8 py-6 border-b border-[rgba(0,212,170,0.1)] bg-[rgba(13,31,60,0.5)]">
        <div className="flex items-center gap-3">
          <ShoppingCart size={22} className="text-[#00d4aa]" />
          <div>
            <h2 className="font-heading font-700 text-white text-xl tracking-wide">PLACE ORDER</h2>
            <p className="text-slate-400 text-sm">{product.title} — {product.model_number}</p>
          </div>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="p-8">
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="text-xs font-mono text-[#00d4aa] tracking-widest block mb-2">FULL NAME *</label>
            <input required name="customer_name" value={form.customer_name} onChange={handleChange}
              placeholder="Your full name" className="cyber-input w-full px-4 py-3 rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-xs font-mono text-[#00d4aa] tracking-widest block mb-2">PHONE NUMBER *</label>
            <input required name="customer_phone" value={form.customer_phone} onChange={handleChange}
              placeholder="+233 XX XXX XXXX" className="cyber-input w-full px-4 py-3 rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-xs font-mono text-[#00d4aa] tracking-widest block mb-2">EMAIL ADDRESS</label>
            <input type="email" name="customer_email" value={form.customer_email} onChange={handleChange}
              placeholder="your@email.com" className="cyber-input w-full px-4 py-3 rounded-lg text-sm" />
          </div>
          <div>
            <label className="text-xs font-mono text-[#00d4aa] tracking-widest block mb-2">QUANTITY</label>
            <input type="number" min="1" name="quantity" value={form.quantity} onChange={handleChange}
              className="cyber-input w-full px-4 py-3 rounded-lg text-sm" />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-mono text-[#00d4aa] tracking-widest block mb-2">DELIVERY ADDRESS</label>
            <input name="customer_address" value={form.customer_address} onChange={handleChange}
              placeholder="Where should we deliver?" className="cyber-input w-full px-4 py-3 rounded-lg text-sm" />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs font-mono text-[#00d4aa] tracking-widest block mb-2">ADDITIONAL MESSAGE</label>
            <textarea name="message" value={form.message} onChange={handleChange} rows={3}
              placeholder="Any special requests or questions..." 
              className="cyber-input w-full px-4 py-3 rounded-lg text-sm resize-none" />
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button type="submit" disabled={loading}
            className="flex-1 btn-primary flex items-center justify-center gap-2 py-4 rounded-lg font-heading font-700 tracking-wide disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? <div className="cyber-spinner w-5 h-5" /> : <><Send size={18} /> SUBMIT ORDER</>}
          </button>
          <a 
            href={`https://wa.me/233555517658?text=Hello%2C%20I%20want%20to%20order%20${encodeURIComponent(product.title)}%20(${product.model_number})`}
            target="_blank" rel="noopener noreferrer"
            className="flex-1 btn-outline flex items-center justify-center gap-2 py-4 rounded-lg font-heading"
          >
            ORDER VIA WHATSAPP
          </a>
        </div>
      </form>
    </div>
  )
}
