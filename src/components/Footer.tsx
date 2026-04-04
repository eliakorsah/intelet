import Link from 'next/link'
import Image from 'next/image'
import { Phone, Mail, MapPin, Instagram, Facebook, Twitter } from 'lucide-react'
import { BRANDS } from '@/types'

export default function Footer() {
  return (
    <footer className="bg-[#060d1a] border-t border-[rgba(0,212,170,0.1)]">
      {/* CTA Banner */}
      <div className="bg-gradient-to-r from-[#0d1f3c] via-[#102547] to-[#0d1f3c] border-b border-[rgba(0,212,170,0.1)] py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="font-heading font-700 text-3xl text-white mb-3">
            GET A <span className="text-[#00d4aa] text-glow">FREE</span> SECURITY CONSULTATION
          </h2>
          <p className="text-slate-400 mb-6 max-w-xl mx-auto">
            Our expert team will design a tailored security solution that fits your needs perfectly. 
            Contact us today!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/233555517658" target="_blank" rel="noopener noreferrer"
              className="btn-primary px-8 py-3 rounded-lg font-heading font-700 tracking-wide">
              WhatsApp: 055 551 7658
            </a>
            <a href="tel:+233241050163" className="btn-outline px-8 py-3 rounded-lg">
              Call: 024 105 0163
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
              <div className="relative w-10 h-10">
                <Image src="/logo.jpg" alt="Tritech" fill className="object-contain" sizes="40px" />
              </div>
              <div>
                <div className="font-heading font-700 text-white text-lg leading-none">TRITECH</div>
                <div className="text-[10px] text-[#00d4aa] font-mono tracking-[0.2em]">TECHNOLOGIES LTD</div>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Ghana&apos;s one-stop shop for IT needs. Over 20 years of excellence in IT equipment, 
              security solutions, and networking infrastructure.
            </p>
            <div className="flex gap-3">
              {[
                { href: 'https://facebook.com', Icon: Facebook },
                { href: 'https://instagram.com', Icon: Instagram },
                { href: 'https://twitter.com', Icon: Twitter },
              ].map(({ href, Icon }) => (
                <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg border border-[rgba(0,212,170,0.2)] flex items-center justify-center text-slate-400 hover:text-[#00d4aa] hover:border-[#00d4aa] transition-all">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Brands */}
          <div>
            <h3 className="font-heading font-700 text-white text-sm tracking-widest mb-4 uppercase">
              Our Brands
            </h3>
            <div className="space-y-2">
              {BRANDS.map(brand => (
                <Link key={brand} href={`/products?brand=${brand}`}
                  className="block text-slate-400 hover:text-[#00d4aa] transition-colors text-sm font-mono tracking-wide">
                  → {brand}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-heading font-700 text-white text-sm tracking-widest mb-4 uppercase">
              Quick Links
            </h3>
            <div className="space-y-2">
              {[
                { href: '/', label: 'Home' },
                { href: '/products', label: 'All Products' },
                { href: '/about', label: 'About Us' },
                { href: '/contact', label: 'Contact' },
                { href: '/admin', label: 'Manager Portal' },
              ].map(({ href, label }) => (
                <Link key={href} href={href}
                  className="block text-slate-400 hover:text-[#00d4aa] transition-colors text-sm font-mono tracking-wide">
                  → {label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-heading font-700 text-white text-sm tracking-widest mb-4 uppercase">
              Contact Us
            </h3>
            <div className="space-y-3">
              <a href="tel:+233555517658" className="flex items-start gap-3 text-slate-400 hover:text-[#00d4aa] transition-colors group">
                <Phone size={16} className="mt-0.5 shrink-0 group-hover:text-[#00d4aa]" />
                <span className="text-sm">+233 55 551 7658</span>
              </a>
              <a href="tel:+233241050163" className="flex items-start gap-3 text-slate-400 hover:text-[#00d4aa] transition-colors group">
                <Phone size={16} className="mt-0.5 shrink-0 group-hover:text-[#00d4aa]" />
                <span className="text-sm">+233 24 105 0163</span>
              </a>
              <a href="mailto:tritechtecnologies2023@gmail.com" className="flex items-start gap-3 text-slate-400 hover:text-[#00d4aa] transition-colors group">
                <Mail size={16} className="mt-0.5 shrink-0 group-hover:text-[#00d4aa]" />
                <span className="text-sm break-all">tritechtecnologies2023@gmail.com</span>
              </a>
              <div className="flex items-start gap-3 text-slate-400">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                <span className="text-sm">Accra, Ghana</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-[rgba(0,212,170,0.08)] py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-slate-600 text-xs font-mono">
            © {new Date().getFullYear()} Tritech Technologies Limited. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-600">
            <span className="w-2 h-2 rounded-full bg-[#00d4aa] animate-pulse" />
            Systems Operational
          </div>
        </div>
      </div>
    </footer>
  )
}
