import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import { SiteHeader, SiteFooter } from '@/components/SiteChrome'
import { COMPANY, COLORS } from '@/lib/brand'

const BASE = COMPANY.baseUrl

export const metadata: Metadata = {
  metadataBase: new URL(BASE),

  title: {
    default: `${COMPANY.name} | Home Appliances Ghana`,
    template: `%s | ${COMPANY.name} Ghana`,
  },
  description: `${COMPANY.name} is Ghana's trusted home-appliance retailer — Samsung, Midea, Bruhm, Tamashi, TCL, NASCO and Haier fridges, freezers, washing machines, ACs and TVs. Two branches: Akweteyman (next to MTN on the N1 Highway) and Fise (Amasaman, adjacent to GCB Amasaman / Puma Filling Station).`,
  keywords: [
    'home appliances Ghana', 'fridges Ghana', 'washing machines Accra',
    'air conditioners Ghana', 'chest freezer Ghana', 'televisions Accra',
    'Samsung Ghana', 'Midea Ghana', 'Bruhm Ghana', 'Tamashi Ghana',
    'TCL Ghana', 'NASCO Ghana', 'Haier Ghana',
    'Intelet Enterprise', 'Intelet Ghana', 'Lapaz Akweteyman appliances',
    'appliance discounts Ghana',
  ],

  authors: [{ name: COMPANY.name, url: BASE }],
  creator: COMPANY.name,
  publisher: COMPANY.name,

  icons: {
    icon: [{ url: '/intelet-logo.png', type: 'image/png' }],
    apple: '/intelet-logo.png',
    shortcut: '/intelet-logo.png',
  },

  openGraph: {
    type: 'website',
    locale: 'en_GH',
    url: BASE,
    siteName: COMPANY.name,
    title: `${COMPANY.name} | Home Appliances Ghana`,
    description: `Ghana's home of quality appliances. Samsung, Midea, Bruhm, Tamashi, TCL, NASCO, Haier — best prices at Lapaz-Akweteyman, Accra.`,
    images: [{ url: '/preview.jpg', width: 1200, height: 630, alt: `${COMPANY.name} — Home Appliances Ghana` }],
  },

  twitter: {
    card: 'summary_large_image',
    title: `${COMPANY.name} | Home Appliances Ghana`,
    description: `Fridges, freezers, washers, ACs and TVs from the brands you trust — best prices in Accra with a 12-month warranty.`,
    images: ['/preview.jpg'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },

  alternates: { canonical: BASE },

  category: 'retail',
  classification: 'Home Appliances',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@300;400;500;600;700&family=Exo+2:ital,wght@0,100..900;1,100..900&family=Share+Tech+Mono&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="bg-[#F5F4F2] text-[#1a1a1a] font-body antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HomeGoodsStore',
            name: COMPANY.name,
            url: BASE,
            logo: `${BASE}/intelet-logo.png`,
            image: `${BASE}/preview.jpg`,
            description: `${COMPANY.name} — home appliances retailer in Ghana. Authorized dealer for Samsung, Midea, Bruhm, Tamashi, TCL, NASCO and Haier.`,
            telephone: [COMPANY.phones.primary, COMPANY.phones.secondary],
            email: COMPANY.email,
            address: [
              {
                '@type': 'PostalAddress',
                streetAddress: `${COMPANY.address.line1}, ${COMPANY.address.line2}`,
                addressLocality: COMPANY.address.city,
                addressCountry: 'GH',
              },
              {
                '@type': 'PostalAddress',
                streetAddress: 'Fise, Amasaman — adjacent to GCB Amasaman Branch / Puma Filling Station',
                addressLocality: 'Amasaman',
                addressCountry: 'GH',
              },
            ],
            geo: { '@type': 'GeoCoordinates', latitude: 5.6037, longitude: -0.1870 },
            openingHoursSpecification: [
              { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '08:00', closes: '18:00' },
              { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '09:00', closes: '16:00' },
            ],
            sameAs: [`https://wa.me/${COMPANY.whatsapp.number}`],
            priceRange: '₵₵',
            currenciesAccepted: 'GHS',
            paymentAccepted: 'Cash, Mobile Money',
            areaServed: { '@type': 'Country', name: 'Ghana' },
          })}}
        />
        <div className="" />
        <SiteHeader />
        <main className="animate-page-enter">{children}</main>
        <SiteFooter />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: COLORS.white,
              color: COLORS.ink,
              border: `1px solid ${COLORS.ashLine}`,
              fontFamily: "'Exo 2', sans-serif",
            },
            success: { iconTheme: { primary: COLORS.red, secondary: COLORS.white } },
            error: { iconTheme: { primary: '#ef4444', secondary: COLORS.white } },
          }}
        />
      </body>
    </html>
  )
}
