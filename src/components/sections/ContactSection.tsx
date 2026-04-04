import { Phone, Mail, Instagram, MapPin, MessageCircle } from 'lucide-react'
import { COMPANY_INFO } from '@/lib/constants'

export default function ContactSection() {
  return (
    <section id="contact" className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <div className="font-mono text-xs text-teal-500 tracking-widest uppercase mb-3">
            Get In Touch
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-800 text-white mb-4">
            Contact Us Today
          </h2>
          <div className="section-divider mx-auto" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {COMPANY_INFO.phone.map((phone, index) => (
            <a
              key={phone}
              href={`tel:${phone.replace(/\s/g, '')}`}
              className="cyber-card p-6 text-center group hover:border-teal-500/50"
            >
              <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-500/20 transition-colors">
                <Phone className="w-6 h-6 text-teal-400" />
              </div>
              <div className="font-mono text-xs text-teal-500 tracking-wider mb-1 uppercase">
                {index === 0 ? 'Primary' : 'Secondary'}
              </div>
              <div className="font-display font-700 text-white group-hover:text-teal-400 transition-colors">
                {phone}
              </div>
            </a>
          ))}

          <a
            href={`mailto:${COMPANY_INFO.email}`}
            className="cyber-card p-6 text-center group hover:border-teal-500/50"
          >
            <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/30 flex items-center justify-center mx-auto mb-4 group-hover:bg-teal-500/20 transition-colors">
              <Mail className="w-6 h-6 text-teal-400" />
            </div>
            <div className="font-mono text-xs text-teal-500 tracking-wider mb-1 uppercase">Email</div>
            <div className="font-display font-600 text-white group-hover:text-teal-400 transition-colors text-sm break-all">
              {COMPANY_INFO.email}
            </div>
          </a>

          <a
            href="https://wa.me/233555517658"
            target="_blank"
            rel="noopener noreferrer"
            className="cyber-card p-6 text-center group hover:border-green-500/50"
          >
            <div className="w-12 h-12 bg-green-500/10 border border-green-500/30 flex items-center justify-center mx-auto mb-4 group-hover:bg-green-500/20 transition-colors">
              <MessageCircle className="w-6 h-6 text-green-400" />
            </div>
            <div className="font-mono text-xs text-green-500 tracking-wider mb-1 uppercase">WhatsApp</div>
            <div className="font-display font-700 text-white group-hover:text-green-400 transition-colors">
              Chat With Us
            </div>
          </a>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <a
            href={`https://instagram.com/${COMPANY_INFO.social.instagram}`}
            target="_blank"
            rel="noopener noreferrer"
            className="cyber-card p-6 flex items-center gap-4 group"
          >
            <div className="w-12 h-12 bg-purple-500/10 border border-purple-500/30 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors flex-shrink-0">
              <Instagram className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <div className="font-mono text-xs text-purple-400 tracking-wider mb-0.5 uppercase">Instagram</div>
              <div className="font-display font-700 text-white group-hover:text-purple-400 transition-colors">
                @{COMPANY_INFO.social.instagram}
              </div>
            </div>
          </a>

          <div className="cyber-card p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-teal-500/10 border border-teal-500/30 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-teal-400" />
            </div>
            <div>
              <div className="font-mono text-xs text-teal-500 tracking-wider mb-0.5 uppercase">Location</div>
              <div className="font-display font-700 text-white">{COMPANY_INFO.address}</div>
              <div className="text-slate-400 text-sm">Delivery available nationwide</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
