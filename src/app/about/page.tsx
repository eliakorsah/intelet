import type { Metadata } from 'next'
import { ShieldCheck, Clock, Truck, HeadphonesIcon, Award, Users } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { COMPANY, COLORS, PARTNER_BRANDS, whatsappLink } from '@/lib/brand'

const RED      = COLORS.red
const RED_DEEP = COLORS.redDeep

export const metadata: Metadata = {
  title: 'About Us',
  description: `${COMPANY.name} — Ghana's home of quality home appliances. Authorised dealer for Samsung, Midea, Bruhm, Tamashi, TCL, NASCO and Haier. Showroom at ${COMPANY.address.line1}, next to MTN on the N1 Highway.`,
  keywords: [
    'about Intelet Enterprise', 'home appliances company Ghana', 'appliance retailer Accra',
    'Samsung Ghana dealer', 'Midea Ghana dealer', 'Bruhm Ghana dealer', 'Tamashi Ghana dealer',
    'TCL Ghana dealer', 'NASCO Ghana dealer', 'Haier Ghana dealer',
    'Lapaz Akweteyman appliance store',
  ],
  openGraph: {
    title: `About ${COMPANY.name}`,
    description: `Ghana's home of quality home appliances. Grand Opening ${COMPANY.grandOpening.label} at ${COMPANY.address.line1}.`,
    url: `${COMPANY.baseUrl}/about`,
    images: [{ url: '/preview.jpg', width: 1200, height: 630 }],
  },
  alternates: { canonical: `${COMPANY.baseUrl}/about` },
}

const values = [
  { icon: ShieldCheck,    title: '12-Month Warranty',  desc: 'Every appliance is backed by a full-year manufacturer warranty.' },
  { icon: Award,          title: 'Authorised Dealer',  desc: 'Official partner for Samsung, Midea, Bruhm, Tamashi, TCL, NASCO and Haier.' },
  { icon: Truck,          title: 'Delivery Available', desc: 'Doorstep delivery across Accra and the regions — ask for a quote.' },
  { icon: HeadphonesIcon, title: 'Real Support',       desc: 'A walk-in showroom, WhatsApp and phone lines staffed by real people.' },
  { icon: Clock,          title: 'Grand Opening Prices', desc: `Save up to 40% during the Grand Opening, ${COMPANY.grandOpening.label}.` },
  { icon: Users,          title: 'Trusted Locally',    desc: 'Proudly based in Lapaz-Akweteyman, serving Ghanaian homes and businesses.' },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen" style={{ background: COLORS.ash }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-14 sm:py-20">
        {/* Hero */}
        <div className="text-center mb-12 sm:mb-20">
          <span className="font-mono text-xs tracking-widest" style={{ color: RED }}>WHO WE ARE</span>
          <h1
            className="font-heading font-black mt-2 mb-6"
            style={{ color: COLORS.ink, fontSize: 'clamp(2rem, 5vw, 3.2rem)' }}
          >
            ABOUT <span style={{ color: RED }}>{COMPANY.short}</span>
          </h1>
          <p className="text-lg max-w-3xl mx-auto leading-relaxed" style={{ color: COLORS.inkSoft }}>
            Welcome to <strong style={{ color: RED }}>{COMPANY.name}</strong> — Ghana&apos;s home of quality
            appliances. We supply genuine fridges, freezers, washing machines, air conditioners and televisions
            from the brands Ghanaians trust, with honest prices and a 12-month warranty on every unit.
          </p>
        </div>

        {/* Mission / Location */}
        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          <div
            className="p-8 rounded-2xl"
            style={{ background: COLORS.white, border: `1px solid ${COLORS.ashLine}` }}
          >
            <h2 className="font-heading font-bold text-2xl mb-4 tracking-wide" style={{ color: RED }}>
              OUR MISSION
            </h2>
            <p className="leading-relaxed" style={{ color: COLORS.inkSoft }}>
              To make quality home appliances affordable and accessible across Ghana — stocking only genuine
              products, pricing them fairly, and backing every sale with real after-sales support. We want
              every home we serve to feel the difference between a bargain and a good deal.
            </p>
          </div>
          <div
            className="p-8 rounded-2xl"
            style={{ background: COLORS.white, border: `1px solid ${COLORS.ashLine}` }}
          >
            <h2 className="font-heading font-bold text-2xl mb-4 tracking-wide" style={{ color: RED }}>
              VISIT OUR SHOWROOM
            </h2>
            <p className="leading-relaxed mb-4" style={{ color: COLORS.inkSoft }}>
              Our showroom is at <strong style={{ color: COLORS.ink }}>{COMPANY.address.line1}</strong>,
              next to MTN on the N1 Highway. Walk in to see the appliances in person, compare models, and
              lock in your Grand Opening price with cash or Mobile Money.
            </p>
            <p className="text-sm font-mono tracking-widest" style={{ color: RED }}>
              {COMPANY.grandOpening.headline} · {COMPANY.grandOpening.label}
            </p>
          </div>
        </div>

        {/* Partner brands */}
        <div className="mb-20">
          <div className="text-center mb-10">
            <h2 className="font-heading font-black" style={{ color: COLORS.ink, fontSize: 'clamp(1.8rem, 4vw, 2.4rem)' }}>
              OUR BRAND PARTNERS
            </h2>
            <p className="mt-3 text-sm max-w-xl mx-auto" style={{ color: COLORS.inkSoft }}>
              Every brand we stock is sourced through official channels — so you get a genuine product and a real warranty.
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-4">
            {PARTNER_BRANDS.map(b => (
              <div
                key={b.slug}
                className="p-5 rounded-2xl flex flex-col items-center justify-center gap-3"
                style={{ background: COLORS.white, border: `1px solid ${COLORS.ashLine}`, minHeight: '130px' }}
              >
                <div className="relative w-16 h-10">
                  <Image src={b.logo} alt={b.name} fill className="object-contain" sizes="64px" />
                </div>
                <span
                  className="font-heading font-bold text-xs tracking-widest uppercase"
                  style={{ color: b.accent ?? COLORS.ink }}
                >
                  {b.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="font-heading font-black" style={{ color: COLORS.ink, fontSize: 'clamp(1.8rem, 4vw, 2.4rem)' }}>
              WHY CHOOSE INTELET
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="p-6 rounded-xl transition-all"
                style={{ background: COLORS.white, border: `1px solid ${COLORS.ashLine}` }}
              >
                <Icon size={28} style={{ color: RED }} className="mb-4" />
                <h3 className="font-heading font-bold text-lg mb-2" style={{ color: COLORS.ink }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: COLORS.inkSoft }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div
          className="text-center p-12 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${RED_DEEP} 0%, ${RED} 100%)`,
            color: COLORS.white,
          }}
        >
          <h2 className="font-heading font-black text-3xl mb-4">READY TO SHOP?</h2>
          <p className="mb-8 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.85)' }}>
            WhatsApp us, call, or walk into the showroom for the Grand Opening price list.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href={whatsappLink()}
              target="_blank" rel="noopener noreferrer"
              className="px-8 py-4 rounded-lg font-heading font-bold tracking-wide"
              style={{ background: COLORS.white, color: RED }}
            >
              WhatsApp {COMPANY.phones.primaryFmt}
            </a>
            <Link
              href="/products"
              className="px-8 py-4 rounded-lg font-heading font-bold tracking-wide"
              style={{ border: `2px solid ${COLORS.white}`, color: COLORS.white }}
            >
              Browse Appliances
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
