'use client'

import { useState } from 'react'
import { Phone, Mail, MapPin, MessageCircle, Send } from 'lucide-react'
import toast from 'react-hot-toast'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(resolve => setTimeout(resolve, 1000))
    toast.success('Message sent! We will respond shortly.')
    setForm({ name: '', email: '', phone: '', message: '' })
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#060d1a] bg-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <span className="text-[#00d4aa] font-mono text-xs tracking-widest">GET IN TOUCH</span>
          <h1 className="section-title text-3xl sm:text-5xl text-white mt-2">CONTACT US</h1>
          <p className="text-slate-400 mt-3 max-w-xl mx-auto text-sm sm:text-base px-4">
            Have a question or need a consultation? We&apos;re here to help —
            reach out through any channel below.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Info */}
          <div className="space-y-4">
            <h2 className="font-heading font-700 text-xl text-white tracking-wide mb-6">REACH US DIRECTLY</h2>
            {[
              { icon: Phone, label: 'Primary Phone', value: '+233 55 551 7658', href: 'tel:+233555517658' },
              { icon: Phone, label: 'Secondary Phone', value: '+233 24 105 0163', href: 'tel:+233241050163' },
              { icon: MessageCircle, label: 'WhatsApp', value: '+233 55 551 7658', href: 'https://wa.me/233555517658' },
              { icon: Mail, label: 'Email', value: 'tritechtecnologies2023@gmail.com', href: 'mailto:tritechtecnologies2023@gmail.com' },
              { icon: MapPin, label: 'Location', value: 'Accra, Ghana', href: null },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-4 p-4 sm:p-5 rounded-xl border border-[rgba(0,212,170,0.1)] bg-[rgba(13,31,60,0.6)] hover:border-[rgba(0,212,170,0.3)] transition-all group">
                <div className="w-10 h-10 rounded-lg bg-[rgba(0,212,170,0.1)] flex items-center justify-center shrink-0 group-hover:bg-[rgba(0,212,170,0.2)] transition-colors">
                  <Icon size={18} className="text-[#00d4aa]" />
                </div>
                <div className="min-w-0">
                  <div className="text-xs text-slate-500 font-mono tracking-widest mb-1">{label.toUpperCase()}</div>
                  {href ? (
                    <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                      className="text-slate-200 hover:text-[#00d4aa] transition-colors text-sm break-all">
                      {value}
                    </a>
                  ) : (
                    <span className="text-slate-200 text-sm">{value}</span>
                  )}
                </div>
              </div>
            ))}

            <div className="p-4 sm:p-5 rounded-xl border border-[rgba(0,212,170,0.1)] bg-[rgba(13,31,60,0.6)]">
              <h3 className="font-heading font-600 text-[#00d4aa] text-sm tracking-widest mb-3">BUSINESS HOURS</h3>
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between text-slate-300"><span>Monday – Friday</span><span>8:00 AM – 6:00 PM</span></div>
                <div className="flex justify-between text-slate-300"><span>Saturday</span><span>9:00 AM – 4:00 PM</span></div>
                <div className="flex justify-between text-slate-500"><span>Sunday</span><span>Closed</span></div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="p-6 sm:p-8 rounded-2xl border border-[rgba(0,212,170,0.2)] bg-[rgba(10,22,40,0.9)]">
            <h2 className="font-heading font-700 text-xl text-white tracking-wide mb-6">SEND A MESSAGE</h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="text-xs font-mono text-[#00d4aa] tracking-widest block mb-2">YOUR NAME</label>
                <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="Full name" className="cyber-input w-full px-4 py-3 rounded-lg text-sm" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-mono text-[#00d4aa] tracking-widest block mb-2">EMAIL</label>
                  <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                    placeholder="your@email.com" className="cyber-input w-full px-4 py-3 rounded-lg text-sm" />
                </div>
                <div>
                  <label className="text-xs font-mono text-[#00d4aa] tracking-widest block mb-2">PHONE</label>
                  <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                    placeholder="+233 XX..." className="cyber-input w-full px-4 py-3 rounded-lg text-sm" />
                </div>
              </div>
              <div>
                <label className="text-xs font-mono text-[#00d4aa] tracking-widest block mb-2">MESSAGE</label>
                <textarea required rows={5} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))}
                  placeholder="Tell us about your project or inquiry..."
                  className="cyber-input w-full px-4 py-3 rounded-lg text-sm resize-none" />
              </div>
              <button type="submit" disabled={loading}
                className="w-full btn-primary py-4 rounded-lg font-heading font-700 tracking-wide flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? <div className="cyber-spinner w-5 h-5" /> : <><Send size={18} />SEND MESSAGE</>}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
