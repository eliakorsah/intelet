import type { Metadata } from 'next'
import './globals.css'
import { Toaster } from 'react-hot-toast'
import Navbar from '@/components/Navbar'
import BrandsTicker from '@/components/BrandsTicker'
import Footer from '@/components/Footer'

const BASE = 'https://www.tritechtechnologiesltd.com'

export const metadata: Metadata = {
  metadataBase: new URL(BASE),

  title: {
    default: 'Tritech Technologies Ltd | CCTV, Security & IT Solutions Ghana',
    template: '%s | Tritech Technologies Ghana',
  },
  description: 'Ghana\'s trusted IT & security solutions provider since 2003. Authorized dealer for Hikvision, Dahua, TP-Link, D-Link & more. CCTV cameras, access control, networking, fire alarms — wholesale & retail with nationwide delivery.',
  keywords: [
    'CCTV cameras Ghana', 'Hikvision Ghana', 'Dahua Ghana', 'security cameras Accra',
    'IT equipment Ghana', 'access control Ghana', 'networking equipment Accra',
    'fire alarm Ghana', 'TP-Link Ghana', 'D-Link Ghana', 'Grandstream Ghana',
    'security solutions Ghana', 'Tritech Technologies', 'tritechtechnologiesltd',
    'surveillance cameras Ghana', 'NVR DVR Ghana', 'IP cameras Accra',
    'authorized Hikvision dealer Ghana', 'IT distributor Ghana',
  ],

  authors: [{ name: 'Tritech Technologies Ghana Limited', url: BASE }],
  creator: 'Tritech Technologies Ghana Limited',
  publisher: 'Tritech Technologies Ghana Limited',

  icons: {
    icon: [{ url: '/fav.jpg', type: 'image/jpeg' }],
    apple: '/fav.jpg',
    shortcut: '/fav.jpg',
  },

  openGraph: {
    type: 'website',
    locale: 'en_GH',
    url: BASE,
    siteName: 'Tritech Technologies Ghana Limited',
    title: 'Tritech Technologies Ltd | CCTV, Security & IT Solutions Ghana',
    description: 'Ghana\'s trusted IT & security solutions provider since 2003. Authorized dealer for Hikvision, Dahua, TP-Link & more. Nationwide delivery.',
    images: [{ url: '/preview.jpg', width: 1200, height: 630, alt: 'Tritech Technologies Ghana - IT & Security Solutions' }],
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Tritech Technologies Ltd | IT & Security Solutions Ghana',
    description: 'Authorized dealer for Hikvision, Dahua, TP-Link & more. CCTV, access control, networking & IT equipment across Ghana.',
    images: ['/preview.jpg'],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-image-preview': 'large', 'max-snippet': -1 },
  },

  alternates: { canonical: BASE },

  category: 'technology',
  classification: 'IT & Security Equipment',
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
      <body className="bg-[#060d1a] text-slate-100 font-body antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'LocalBusiness',
            name: 'Tritech Technologies Ghana Limited',
            url: 'https://www.tritechtechnologiesltd.com',
            logo: 'https://www.tritechtechnologiesltd.com/logo.jpg',
            image: 'https://www.tritechtechnologiesltd.com/preview.jpg',
            description: 'Ghana\'s trusted IT & security solutions provider since 2003. Authorized dealer for Hikvision, Dahua, TP-Link, D-Link and more.',
            telephone: ['+233555517658', '+233241050163'],
            email: 'tritechtecnologies2023@gmail.com',
            address: { '@type': 'PostalAddress', addressLocality: 'Accra', addressCountry: 'GH' },
            geo: { '@type': 'GeoCoordinates', latitude: 5.6037, longitude: -0.1870 },
            openingHoursSpecification: [
              { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday','Tuesday','Wednesday','Thursday','Friday'], opens: '08:00', closes: '18:00' },
              { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Saturday'], opens: '09:00', closes: '16:00' },
            ],
            sameAs: ['https://wa.me/233555517658'],
            priceRange: '₵₵',
            currenciesAccepted: 'GHS',
            paymentAccepted: 'Cash, Mobile Money',
            areaServed: { '@type': 'Country', name: 'Ghana' },
          })}}
        />
        <div className="" />
        <Navbar />
        <BrandsTicker />
        <main className="animate-page-enter">{children}</main>
        <Footer />
        <Toaster 
          position="top-right"
          toastOptions={{
            style: {
              background: '#0a1628',
              color: '#e2e8f0',
              border: '1px solid rgba(0,212,170,0.3)',
              fontFamily: "'Exo 2', sans-serif",
            },
            success: { iconTheme: { primary: '#00d4aa', secondary: '#060d1a' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#060d1a' } },
          }}
        />
      </body>
    </html>
  )
}
