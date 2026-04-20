'use client'

import { useState } from 'react'
import { Phone, Mail, MapPin, MessageCircle, Send } from 'lucide-react'
import toast from 'react-hot-toast'
import { COMPANY, COLORS, whatsappLink } from '@/lib/brand'

const RED      = COLORS.red
const RED_DEEP = COLORS.redDeep

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 900))
    toast.success('Message sent! We will respond shortly.')
    setForm({ name: '', email: '', phone: '', message: '' })
    setLoading(false)
  }

  const contacts = [
    { icon: Phone,         label: 'Primary Phone',   value: COMPANY.phones.primaryFmt,   href: `tel:${COMPANY.phones.primary}` },
    { icon: Phone,         label: 'Secondary Phone', value: COMPANY.phones.secondaryFmt, href: `tel:${COMPANY.phones.secondary}` },
    { icon: MessageCircle, label: 'WhatsApp',        value: COMPANY.phones.primaryFmt,   href: whatsappLink() },
    { icon: Mail,          label: 'Email',           value: COMPANY.email,               href: `mailto:${COMPANY.email}` },
    { icon: MapPin,        label: 'Showroom',        value: COMPANY.address.full,        href: null },
  ]

  return (
    <div className="min-h-screen" style={{ background: COLORS.ash }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <span className="font-mono text-xs tracking-widest" style={{ color: RED }}>GET IN TOUCH</span>
          <h1
            className="font-heading font-black mt-2"
            style={{ color: COLORS.ink, fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}
          >
            CONTACT <span style={{ color: RED }}>US</span>
          </h1>
          <p className="mt-3 max-w-xl mx-auto text-sm sm:text-base px-4" style={{ color: COLORS.inkSoft }}>
            Reach us on WhatsApp, phone, or walk into our showroom at{' '}
            <strong style={{ color: COLORS.ink }}>{COMPANY.address.line1}</strong>, next to MTN on the N1 Highway.
          </p>
          <div
            className="inline-flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full"
            style={{ background: RED, color: COLORS.white }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
            <span className="font-mono text-[11px] tracking-widest">
              {COMPANY.grandOpening.headline} · {COMPANY.grandOpening.label}
            </span>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Info */}
          <div className="space-y-4">
            <h2
              className="font-heading font-bold text-xl tracking-wide mb-6"
              style={{ color: COLORS.ink }}
            >
              REACH US DIRECTLY
            </h2>
            {contacts.map(({ icon: Icon, label, value, href }) => (
              <div
                key={label}
                className="flex items-start gap-4 p-4 sm:p-5 rounded-xl transition-all group"
                style={{ background: COLORS.white, border: `1px solid ${COLORS.ashLine}` }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                  style={{ background: COLORS.redSoft }}
                >
                  <Icon size={18} style={{ color: RED }} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-mono tracking-widest mb-1" style={{ color: COLORS.inkMuted }}>
                    {label.toUpperCase()}
                  </div>
                  {href ? (
                    <a
                      href={href}
                      target={href.startsWith('http') ? '_blank' : undefined}
                      rel="noopener noreferrer"
                      className="text-sm break-all hover:underline"
                      style={{ color: COLORS.ink }}
                    >
                      {value}
                    </a>
                  ) : (
                    <span className="text-sm" style={{ color: COLORS.ink }}>{value}</span>
                  )}
                </div>
              </div>
            ))}

            <div
              className="p-4 sm:p-5 rounded-xl"
              style={{ background: COLORS.white, border: `1px solid ${COLORS.ashLine}` }}
            >
              <h3
                className="font-heading font-semibold text-sm tracking-widest mb-3"
                style={{ color: RED }}
              >
                BUSINESS HOURS
              </h3>
              <div className="space-y-1.5 text-sm" style={{ color: COLORS.inkSoft }}>
                <div className="flex justify-between"><span>Monday – Friday</span><span>8:00 AM – 6:00 PM</span></div>
                <div className="flex justify-between"><span>Saturday</span><span>9:00 AM – 4:00 PM</span></div>
                <div className="flex justify-between" style={{ color: COLORS.inkMuted }}>
                  <span>Sunday</span><span>Closed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div
            className="p-6 sm:p-8 rounded-2xl"
            style={{ background: COLORS.white, border: `1px solid ${COLORS.ashLine}` }}
          >
            <h2 className="font-heading font-bold text-xl tracking-wide mb-6" style={{ color: COLORS.ink }}>
              SEND A MESSAGE
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-mono tracking-widest block mb-2" style={{ color: RED }}>YOUR NAME</label>
                <input
                  required
                  value={form.name}
                  onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Full name"
                  className="cyber-input w-full px-4 py-3 rounded-lg text-sm"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono tracking-widest block mb-2" style={{ color: RED }}>EMAIL</label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="your@email.com"
                    className="cyber-input w-full px-4 py-3 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-mono tracking-widest block mb-2" style={{ color: RED }}>PHONE</label>
                  <input
                    value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+233 XX..."
                    className="cyber-input w-full px-4 py-3 rounded-lg text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-mono tracking-widest block mb-2" style={{ color: RED }}>MESSAGE</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  placeholder="Which appliance are you interested in?"
                  className="cyber-input w-full px-4 py-3 rounded-lg text-sm resize-none"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-lg font-heading font-bold tracking-wide flex items-center justify-center gap-2 disabled:opacity-50 text-white transition-transform active:scale-95"
                style={{ background: `linear-gradient(90deg, ${RED} 0%, ${RED_DEEP} 100%)` }}
              >
                {loading ? <div className="cyber-spinner w-5 h-5" /> : <><Send size={18} />SEND MESSAGE</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
