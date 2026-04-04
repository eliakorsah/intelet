import type { Metadata } from 'next'
import ContactForm from '@/components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Get in touch with Tritech Technologies Ghana. Call +233 55 551 7658, WhatsApp us, or send an email. Located in Accra, Ghana. Free consultation available.',
  keywords: ['contact Tritech Technologies', 'IT company Accra Ghana', 'CCTV supplier contact Ghana', 'security solutions consultation Ghana'],
  openGraph: {
    title: 'Contact Tritech Technologies Ghana',
    description: 'Reach us by phone, WhatsApp, or email for IT equipment, CCTV, security and networking solutions in Ghana.',
    url: 'https://www.tritechtechnologiesltd.com/contact',
    images: [{ url: '/preview.jpg', width: 1200, height: 630 }],
  },
  alternates: { canonical: 'https://www.tritechtechnologiesltd.com/contact' },
}

export default function ContactPage() {
  return <ContactForm />
}
