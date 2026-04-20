'use client'

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import BrandsTicker from '@/components/BrandsTicker'
import Footer from '@/components/Footer'

export function SiteHeader() {
  const pathname = usePathname() || ''
  if (pathname.startsWith('/admin')) return null
  return (
    <>
      <Navbar />
      <BrandsTicker />
    </>
  )
}

export function SiteFooter() {
  const pathname = usePathname() || ''
  if (pathname.startsWith('/admin')) return null
  return <Footer />
}
