import { PARTNER_BRANDS, APPLIANCE_CATEGORIES, COMPANY } from '@/lib/brand'

// Re-export shape compatible with legacy imports so search/ProductCard/
// ProductFilters keep working after the Intelet rebrand.
export const BRANDS = PARTNER_BRANDS.map(b => ({
  name:  b.name,
  slug:  b.slug,
  logo:  b.logo,
  color: b.accent || '#C8102E',
})) as readonly { name: string; slug: string; logo: string; color: string }[]

export type BrandName = typeof PARTNER_BRANDS[number]['name']

export const CATEGORIES = APPLIANCE_CATEGORIES.map(c => c.name) as readonly string[]

export const COMPANY_INFO = {
  name: COMPANY.name,
  tagline: COMPANY.tagline,
  description:
    `${COMPANY.name} is Ghana's home of quality appliances. We stock refrigerators, ` +
    `freezers, washing machines, air conditioners, televisions and small appliances ` +
    `from trusted brands — backed by a 12-month manufacturer warranty.`,
  phone: [COMPANY.phones.primaryFmt, COMPANY.phones.secondaryFmt],
  email: COMPANY.email,
  social: {
    instagram: 'inteletenterprise',
  },
  address: COMPANY.address.full,
  industries: [
    'Home', 'Hospitality', 'Offices',
    'Restaurants', 'Retail', 'Institutions',
  ],
}

export const NAV_LINKS = [
  { label: 'Home',     href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Brands',   href: '/#brands' },
  { label: 'Promo',    href: '/#grand-opening' },
  { label: 'About',    href: '/about' },
  { label: 'Contact',  href: '/contact' },
]
