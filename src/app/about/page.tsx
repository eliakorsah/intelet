import type { Metadata } from 'next'
import { Shield, Clock, Truck, HeadphonesIcon, Award, Users } from 'lucide-react'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Tritech Technologies Ghana Limited — over 20 years delivering quality IT equipment, CCTV systems, access control and security solutions across Ghana. Authorized dealer for Hikvision, Dahua, TP-Link and more.',
  keywords: ['about Tritech Technologies', 'IT company Ghana', 'security solutions company Accra', 'Hikvision authorized dealer Ghana', '20 years IT Ghana'],
  openGraph: {
    title: 'About Tritech Technologies Ghana Limited',
    description: 'Over 20 years delivering quality IT equipment and security solutions across Ghana. Your trusted authorized dealer.',
    url: 'https://www.tritechtechnologiesltd.com/about',
    images: [{ url: '/preview.jpg', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://www.tritechtechnologiesltd.com/about' },
}

const values = [
  { icon: Shield, title: 'Quality Products', desc: 'Only genuine, authorized products from trusted global brands.' },
  { icon: Clock, title: '20+ Years Experience', desc: 'Two decades of serving Ghana\'s IT and security needs.' },
  { icon: Truck, title: 'Fast Delivery', desc: 'Efficient delivery services throughout Ghana and beyond.' },
  { icon: HeadphonesIcon, title: '24/7 Support', desc: 'Our team is always ready to assist with any technical issues.' },
  { icon: Award, title: 'Authorized Dealer', desc: 'Officially authorized by Hikvision, Dahua, CISCO, and more.' },
  { icon: Users, title: 'Trusted by Thousands', desc: 'Serving businesses, institutions, and individuals across Ghana.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#060d1a] bg-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        {/* Hero */}
        <div className="text-center mb-12 sm:mb-20">
          <span className="text-[#00d4aa] font-mono text-xs tracking-widest">WHO WE ARE</span>
          <h1 className="section-title text-3xl sm:text-5xl text-white mt-2 mb-6">ABOUT TRITECH</h1>
          <p className="text-slate-300 text-lg max-w-3xl mx-auto leading-relaxed">
            Welcome to <strong className="text-[#00d4aa]">Tritech Technologies Ghana Limited</strong> — your one-stop shop for all your 
            information technology needs. We have been in the industry for over <strong className="text-white">20 years</strong>, 
            providing quality IT equipment and accessories at affordable prices to our customers.
          </p>
        </div>

        {/* Mission */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          <div className="p-8 rounded-2xl border border-[rgba(0,212,170,0.2)] bg-[rgba(13,31,60,0.7)]">
            <h2 className="font-heading font-700 text-2xl text-[#00d4aa] mb-4 tracking-wide">OUR MISSION</h2>
            <p className="text-slate-300 leading-relaxed">
              To provide quality IT products and services at the lowest possible price, with efficient delivery 
              services to customers throughout Ghana and beyond. We understand the importance of timely delivery 
              and reliable technology in today&apos;s fast-paced world.
            </p>
          </div>
          <div className="p-8 rounded-2xl border border-[rgba(0,212,170,0.2)] bg-[rgba(13,31,60,0.7)]">
            <h2 className="font-heading font-700 text-2xl text-[#00d4aa] mb-4 tracking-wide">SECURITY EXPERTISE</h2>
            <p className="text-slate-300 leading-relaxed">
              We are a leading security solutions company. Whether you need security solutions for residential 
              buildings, offices, retail spaces, or public venues — we&apos;ve got you covered! We cater to commercial, 
              educational, healthcare, hospitality, and many more industries.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="section-title text-3xl text-white">WHY CHOOSE US</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-xl border border-[rgba(0,212,170,0.1)] bg-[rgba(13,31,60,0.6)] hover:border-[rgba(0,212,170,0.3)] transition-all">
                <Icon size={28} className="text-[#00d4aa] mb-4" />
                <h3 className="font-heading font-700 text-white text-lg mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center p-12 rounded-2xl border border-[rgba(0,212,170,0.2)] bg-[rgba(13,31,60,0.5)]">
          <h2 className="section-title text-3xl text-white mb-4">READY TO GET STARTED?</h2>
          <p className="text-slate-400 mb-8 max-w-xl mx-auto">
            Contact us today for a free consultation and let our expert team design 
            a tailored solution that fits your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="https://wa.me/233555517658" target="_blank" rel="noopener noreferrer"
              className="btn-primary px-8 py-4 rounded-lg font-heading font-700 tracking-wide">
              WhatsApp Us
            </a>
            <Link href="/products" className="btn-outline px-8 py-4 rounded-lg font-heading">
              Browse Products
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
