'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { formatPrice, getImageUrl } from '@/utils'
import Image from 'next/image'
import { Package, CheckCircle, ChevronRight } from 'lucide-react'
import toast from 'react-hot-toast'
import Link from 'next/link'

interface Product {
  id: string
  title: string
  model_number: string
  price: number | null
  images: string[]
  brand: string
  in_stock: boolean
}

export default function OrderClient() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const productId = searchParams.get('product')

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(!!productId)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    customer_address: '',
    quantity: 1,
    notes: '',
  })

  useEffect(() => {
    if (productId) {
      supabase
        .from('products')
        .select('id, title, model_number, price, images, brand, in_stock')
        .eq('id', productId)
        .single()
        .then(({ data }) => {
          setProduct(data)
          setLoading(false)
        })
    }
  }, [productId])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!product) return

    setSubmitting(true)
    try {
      const { error } = await supabase.from('orders').insert({
        product_id: product.id,
        product_title: product.title,
        product_model: product.model_number,
        ...form,
        status: 'pending',
      })

      if (error) throw error

      setSubmitted(true)
      toast.success('Order placed successfully!')
    } catch (err) {
      toast.error('Failed to place order. Please try calling us directly.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen pt-24 pb-20 flex items-center justify-center">
        <div className="cyber-card p-12 text-center max-w-lg mx-4">
          <div className="corner-decoration corner-tl" />
          <div className="corner-decoration corner-br" />
          <CheckCircle className="w-16 h-16 text-teal-400 mx-auto mb-5" />
          <h2 className="font-display font-800 text-3xl text-white mb-3">Order Received!</h2>
          <p className="text-slate-400 mb-6">
            Thank you for your order. Our team will contact you shortly to confirm details and arrange delivery.
          </p>
          <div className="flex flex-col gap-3">
            <a href="https://wa.me/233555517658" target="_blank" rel="noopener noreferrer" className="btn-primary py-3">
              💬 Follow Up on WhatsApp
            </a>
            <Link href="/products" className="btn-outline py-3">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10">
          <div className="font-mono text-xs text-teal-500 tracking-widest uppercase mb-2">
            Place an Order
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-800 text-white">Order Form</h1>
          <div className="section-divider" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="cyber-card p-6">
                <h3 className="font-display font-700 text-white mb-5 flex items-center gap-2">
                  <span className="w-1 h-4 bg-teal-500" />
                  Your Details
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block font-mono text-xs text-teal-500 tracking-wider mb-1.5 uppercase">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.customer_name}
                      onChange={e => setForm({ ...form, customer_name: e.target.value })}
                      className="cyber-input"
                      placeholder="Your full name"
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-mono text-xs text-teal-500 tracking-wider mb-1.5 uppercase">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={form.customer_phone}
                        onChange={e => setForm({ ...form, customer_phone: e.target.value })}
                        className="cyber-input"
                        placeholder="+233 XX XXX XXXX"
                      />
                    </div>
                    <div>
                      <label className="block font-mono text-xs text-teal-500 tracking-wider mb-1.5 uppercase">
                        Email
                      </label>
                      <input
                        type="email"
                        value={form.customer_email}
                        onChange={e => setForm({ ...form, customer_email: e.target.value })}
                        className="cyber-input"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-teal-500 tracking-wider mb-1.5 uppercase">
                      Delivery Address *
                    </label>
                    <textarea
                      required
                      rows={3}
                      value={form.customer_address}
                      onChange={e => setForm({ ...form, customer_address: e.target.value })}
                      className="cyber-input resize-none"
                      placeholder="Your delivery address"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-teal-500 tracking-wider mb-1.5 uppercase">
                      Quantity *
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="999"
                      required
                      value={form.quantity}
                      onChange={e => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })}
                      className="cyber-input w-28"
                    />
                  </div>
                  <div>
                    <label className="block font-mono text-xs text-teal-500 tracking-wider mb-1.5 uppercase">
                      Notes / Special Instructions
                    </label>
                    <textarea
                      rows={3}
                      value={form.notes}
                      onChange={e => setForm({ ...form, notes: e.target.value })}
                      className="cyber-input resize-none"
                      placeholder="Any special requirements..."
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting || !product}
                className="w-full btn-primary py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Placing Order...' : 'Place Order'}
              </button>
            </form>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="cyber-card p-6 sticky top-24">
              <h3 className="font-display font-700 text-white mb-4 flex items-center gap-2">
                <span className="w-1 h-4 bg-teal-500" />
                Order Summary
              </h3>

              {loading && (
                <div className="space-y-3">
                  <div className="aspect-square shimmer" />
                  <div className="h-4 shimmer" />
                  <div className="h-4 shimmer w-2/3" />
                </div>
              )}

              {!loading && product && (
                <div>
                  <div className="relative aspect-square bg-navy-800 mb-4 overflow-hidden">
                    {product.images[0] ? (
                      <Image
                        src={getImageUrl(product.images[0])}
                        alt={product.title}
                        fill
                        className="object-contain p-2"
                        sizes="300px"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Package className="w-12 h-12 text-teal-500/30" />
                      </div>
                    )}
                  </div>
                  <div className="font-display font-700 text-white text-sm mb-1 leading-tight">
                    {product.title}
                  </div>
                  <div className="font-mono text-xs text-teal-500 mb-3">{product.model_number}</div>
                  <div className="font-display font-800 text-xl text-gradient">
                    {formatPrice(product.price)}
                  </div>
                </div>
              )}

              {!loading && !product && (
                <p className="text-slate-400 text-sm">No product selected. You can still submit a general inquiry below.</p>
              )}

              <div className="mt-5 pt-4 border-t border-teal-500/10 space-y-2">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <ChevronRight className="w-3 h-3 text-teal-500" />
                  We&apos;ll confirm via phone/WhatsApp
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <ChevronRight className="w-3 h-3 text-teal-500" />
                  Nationwide delivery available
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <ChevronRight className="w-3 h-3 text-teal-500" />
                  Wholesale pricing on bulk orders
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
