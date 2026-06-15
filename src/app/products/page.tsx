import type { Metadata } from 'next'
import ProductsClientContent from '@/components/ProductsClientContent'
import { COMPANY } from '@/lib/brand'

export const metadata: Metadata = {
  title: 'Products',
  description: `Browse genuine home appliances at ${COMPANY.name} — fridges, chest freezers, washing machines, air conditioners and televisions from Samsung, Midea, Bruhm, Tamashi, TCL, NASCO and Haier. Best prices in Accra with a 12-month warranty.`,
  keywords: [
    'buy fridge Ghana', 'chest freezer Ghana', 'washing machine Ghana', 'air conditioner Ghana',
    'television Accra', 'Samsung fridge Ghana', 'Midea AC Ghana', 'Bruhm freezer Ghana',
    'Tamashi washing machine Ghana', 'TCL TV Ghana', 'NASCO appliances Ghana', 'Haier Ghana',
    'appliance discounts Ghana',
  ],
  openGraph: {
    title: `Home Appliances | ${COMPANY.name} Ghana`,
    description: `Fridges, freezers, washers, ACs and TVs — genuine brands with a 12-month warranty. Best prices at our Akweteyman (next to MTN on the N1 Highway) and Fise (Amasaman) branches, Accra.`,
    url: `${COMPANY.baseUrl}/products`,
    images: [{ url: '/preview.jpg', width: 1200, height: 630 }],
  },
  alternates: { canonical: `${COMPANY.baseUrl}/products` },
}

export default function ProductsPage() {
  return <ProductsClientContent />
}
