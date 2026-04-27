import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, ShieldCheck, Instagram, Facebook, Twitter } from 'lucide-react'
import { COMPANY, COLORS, PARTNER_BRANDS, APPLIANCE_CATEGORIES, whatsappLink } from '@/lib/brand'

export default function Footer() {
  return (
    <footer style={{ background: COLORS.ink, borderTop: `1px solid ${COLORS.red}` }}>
      {/* CTA Banner */}
      <div
        className="py-12"
        style={{
          background: `linear-gradient(90deg, ${COLORS.redDeep} 0%, ${COLORS.red} 50%, ${COLORS.redDeep} 100%)`,
        }}
      >
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-mono tracking-[0.2em] mb-3">
            <ShieldCheck size={14} /> 12-MONTH WARRANTY ON ALL APPLIANCES
          </div>
          <h2 className="font-heading font-700 text-3xl md:text-4xl text-white mb-3">
            UNBEATABLE PRICES ON <span className="underline decoration-white/40 decoration-4 underline-offset-4">QUALITY APPLIANCES</span>
          </h2>
          <p className="text-white/80 mb-6 max-w-xl mx-auto">
            Visit us at {COMPANY.address.line1}, next to MTN on the N1 Highway.
            Genuine fridges, freezers, washing machines, ACs and TVs — all with a 12-month warranty.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-3 rounded-lg font-heading font-700 tracking-wide bg-white text-[#C8102E] hover:bg-[#F5F4F2] transition"
            >
              WhatsApp {COMPANY.phones.primaryFmt}
            </a>
            <a
              href={`tel:${COMPANY.phones.secondary}`}
              className="px-8 py-3 rounded-lg font-heading font-700 tracking-wide border-2 border-white text-white hover:bg-white hover:text-[#C8102E] transition"
            >
              Call {COMPANY.phones.secondaryFmt}
            </a>
          </div>
        </div>
      </div>

      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="relative w-10 h-10 rounded-md bg-white p-1">
                <Image src="/intelet-logo.png" alt={COMPANY.name} fill className="object-contain p-1" sizes="40px" />
              </div>
              <div>
                <div className="font-heading font-700 text-white text-lg leading-none">{COMPANY.short}</div>
                <div className="text-[10px] text-[#C8102E] font-mono tracking-[0.2em]">ENTERPRISE · APPLIANCES</div>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              {COMPANY.tagline}. Authorised dealer for Samsung, Midea, Bruhm, Tamashi, TCL, NASCO and Haier —
              fridges, freezers, washing machines, ACs and TVs, backed by a 12-month warranty.
            </p>
            <div className="flex gap-3">
              {[
                { href: 'https://facebook.com', Icon: Facebook },
                { href: 'https://instagram.com', Icon: Instagram },
                { href: 'https://twitter.com', Icon: Twitter },
              ].map(({ href, Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg border border-white/15 flex items-center justify-center text-slate-400 hover:text-white hover:border-[#C8102E] hover:bg-[#C8102E] transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Brands we carry */}
          <div>
            <h3 className="font-heading font-700 text-white text-sm tracking-widest mb-4 uppercase">
              Brands We Carry
            </h3>
            <div className="space-y-2">
              {PARTNER_BRANDS.map(b => (
                <Link
                  key={b.slug}
                  href={`/products?brand=${encodeURIComponent(b.name)}`}
                  className="block text-slate-400 hover:text-white transition-colors text-sm font-mono tracking-wide"
                  style={{ '--hover': b.accent ?? COLORS.red } as React.CSSProperties}
                >
                  → <span style={{ color: b.accent ?? undefined }}>{b.name}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div>
            <h3 className="font-heading font-700 text-white text-sm tracking-widest mb-4 uppercase">
              Shop By Category
            </h3>
            <div className="space-y-2">
              {APPLIANCE_CATEGORIES.map(c => (
                <Link
                  key={c.slug}
                  href={`/products?category=${c.slug}`}
                  className="block text-slate-400 hover:text-white transition-colors text-sm font-mono tracking-wide"
                >
                  → {c.name}
                </Link>
              ))}
              <Link
                href="/admin"
                className="block text-slate-500 hover:text-white transition-colors text-sm font-mono tracking-wide pt-2"
              >
                → Manager Portal
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-700 text-white text-sm tracking-widest mb-4 uppercase">
              Visit / Contact
            </h3>
            <div className="space-y-3">
              <a
                href={`tel:${COMPANY.phones.primary}`}
                className="flex items-start gap-3 text-slate-400 hover:text-white transition-colors group"
              >
                <Phone size={16} className="mt-0.5 shrink-0 group-hover:text-[#C8102E]" />
                <span className="text-sm">{COMPANY.phones.primaryFmt}</span>
              </a>
              <a
                href={`tel:${COMPANY.phones.secondary}`}
                className="flex items-start gap-3 text-slate-400 hover:text-white transition-colors group"
              >
                <Phone size={16} className="mt-0.5 shrink-0 group-hover:text-[#C8102E]" />
                <span className="text-sm">{COMPANY.phones.secondaryFmt}</span>
              </a>
              <a
                href={`mailto:${COMPANY.email}`}
                className="flex items-start gap-3 text-slate-400 hover:text-white transition-colors group"
              >
                <Mail size={16} className="mt-0.5 shrink-0 group-hover:text-[#C8102E]" />
                <span className="text-sm break-all">{COMPANY.email}</span>
              </a>
              <div className="flex items-start gap-3 text-slate-400">
                <MapPin size={16} className="mt-0.5 shrink-0 text-[#C8102E]" />
                <span className="text-sm leading-relaxed">
                  {COMPANY.address.line1}<br />
                  {COMPANY.address.line2}<br />
                  {COMPANY.address.city}, {COMPANY.address.country}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-500 text-xs font-mono">
            © {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span className="w-2 h-2 rounded-full bg-[#C8102E] animate-pulse" />
            NOW OPEN · {COMPANY.address.line1}
          </div>
        </div>
      </div>
    </footer>
  )
}
