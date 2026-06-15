import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'
import { COMPANY } from '@/lib/brand'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: `Get in touch with ${COMPANY.name}. Call ${COMPANY.phones.primaryFmt}, WhatsApp us, or visit either branch — Akweteyman (next to MTN on the N1 Highway) or Fise (Amasaman, adjacent to GCB Amasaman / Puma Filling Station), ${COMPANY.address.city}.`,
  keywords: [
    'contact Intelet Enterprise', 'Intelet Ghana contact',
    'home appliances Lapaz Akweteyman', 'appliance showroom Accra',
    'Intelet phone', 'Intelet WhatsApp',
  ],
  openGraph: {
    title: `Contact ${COMPANY.name}`,
    description: `Reach us by phone or WhatsApp, or visit either branch — Akweteyman (next to MTN on the N1 Highway) or Fise (Amasaman, adjacent to GCB Amasaman / Puma Filling Station), ${COMPANY.address.city}.`,
    url: `${COMPANY.baseUrl}/contact`,
    images: [{ url: '/preview.jpg', width: 1200, height: 630 }],
  },
  alternates: { canonical: `${COMPANY.baseUrl}/contact` },
}

export default function ContactPage() {
  return <ContactForm />
}
