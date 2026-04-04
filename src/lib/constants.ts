export const BRANDS = [
  { name: 'Hikvision', slug: 'hikvision', logo: '/images/brands/hikvision.png', color: '#e31837' },
  { name: 'Dahua', slug: 'dahua', logo: '/images/brands/dahua.png', color: '#0066cc' },
  { name: 'TP-Link', slug: 'tp-link', logo: '/images/brands/tplink.png', color: '#4fcb2a' },
  { name: 'Tenda', slug: 'tenda', logo: '/images/brands/tenda.png', color: '#00a0e9' },
  { name: 'JDVISION', slug: 'jdvision', logo: '/images/brands/jdvision.png', color: '#14b8aa' },
  { name: 'CISCO', slug: 'cisco', logo: '/images/brands/cisco.png', color: '#1ba0d7' },
  { name: 'D-Link', slug: 'd-link', logo: '/images/brands/dlink.png', color: '#0033a0' },
  { name: 'Panasonic', slug: 'panasonic', logo: '/images/brands/panasonic.png', color: '#004b91' },
] as const

export type BrandName = typeof BRANDS[number]['name']

export const CATEGORIES = [
  'IP Cameras',
  'Analog Cameras',
  'Network Video Recorders (NVR)',
  'Digital Video Recorders (DVR)',
  'Network Switches',
  'Routers & Access Points',
  'Access Control',
  'Boom Barriers & Turnstiles',
  'Fire Alarm Systems',
  'PA Systems & Speakers',
  'Cables & Accessories',
  'Hard Drives & Storage',
  'Rack Cabinets',
  'Hotel Door Locks',
  'Other',
] as const

export const COMPANY_INFO = {
  name: 'Tritech Technologies Limited',
  tagline: 'Your One-Stop IT & Security Solutions Partner',
  description: 'Welcome to Tritech Technologies Ghana Limited, your one-stop-shop for all your information Technology needs. We have been in the industry for over 20 years, providing quality IT equipment and accessories at affordable prices.',
  phone: ['+233 55 551 7658', '+233 24 105 0163'],
  email: 'tritechtecnologies2023@gmail.com',
  social: {
    instagram: 'tritechtechnologiesltd',
  },
  address: 'Accra, Ghana',
  industries: [
    'Commercial', 'Educational', 'Healthcare',
    'Hospitality', 'Residential', 'Government',
  ],
}

export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Brands', href: '/brands' },
  { label: 'Solutions', href: '/#solutions' },
  { label: 'About', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
]
