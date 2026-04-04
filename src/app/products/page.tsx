import type { Metadata } from 'next'
import ProductsClientContent from '@/components/ProductsClientContent'

export const metadata: Metadata = {
  title: 'Products',
  description: 'Browse 1000+ genuine IT and security products — CCTV cameras, NVRs, DVRs, access control, networking equipment and more. Authorized dealer for Hikvision, Dahua, TP-Link, D-Link, Panasonic and more. Competitive wholesale & retail prices with delivery across Ghana.',
  keywords: [
    'buy CCTV Ghana', 'Hikvision camera price Ghana', 'Dahua NVR Ghana', 'TP-Link switch Ghana',
    'access control system Ghana', 'IP cameras Accra', 'security equipment Ghana wholesale',
    'networking equipment Ghana', 'fire alarm system Ghana', 'IT equipment Ghana price',
  ],
  openGraph: {
    title: 'IT & Security Products | Tritech Technologies Ghana',
    description: 'Browse 1000+ genuine CCTV, networking, access control and IT products from authorized brands. Best prices in Ghana.',
    url: 'https://www.tritechtechnologiesltd.com/products',
    images: [{ url: '/preview.jpg', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://www.tritechtechnologiesltd.com/products' },
}

export default function ProductsPage() {
  return <ProductsClientContent />
}
