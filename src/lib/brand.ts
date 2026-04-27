// ─────────────────────────────────────────────────────────────
// Intelet Enterprise — single source of truth for branding.
// Import from here instead of hardcoding company info.
// ─────────────────────────────────────────────────────────────

export const COMPANY = {
  name: 'Intelet Enterprise',
  short: 'INTELET',
  tagline: "Ghana's Home of Quality Appliances",
  address: {
    line1:   'Lapaz-Akweteyman',
    line2:   'Next to MTN on the N1 Highway',
    city:    'Accra',
    country: 'Ghana',
    full:    'LAPAZ-AKWETEYMAN, NEXT TO MTN ON THE N1 HIGHWAY, ACCRA',
  },
  phones: {
    primary:   '+233246549409',
    primaryFmt:   '+233 24 654 9409',
    secondary: '+233541407551',
    secondaryFmt: '+233 54 140 7551',
  },
  email: 'info@intelet.com.gh',  // placeholder — confirm with client
  baseUrl: 'https://www.intelet.com.gh',
  whatsapp: {
    number: '233246549409',
    defaultMsg: 'Hello%20Intelet%2C%20I%20would%20like%20more%20info%20about%20the%20Grand%20Opening%20promo',
  },
} as const

export const whatsappLink = (msg: string = COMPANY.whatsapp.defaultMsg) =>
  `https://wa.me/${COMPANY.whatsapp.number}?text=${msg}`

// ── Color palette: ash + white with red blend ───────────────
export const COLORS = {
  // Primary — warm retail red
  red:       '#C8102E',
  redDeep:   '#8B0E24',
  redSoft:   '#F5E1E5',
  // Intelet logo blue (accent for trust / tech cues)
  blue:      '#1D4FAD',
  blueDeep:  '#0F3478',
  // Neutrals
  ash:       '#F5F4F2',   // page background
  ashDeep:   '#E8E6E1',   // surface elevated
  ashLine:   '#D9D6D0',   // borders
  white:     '#FFFFFF',
  ink:       '#1A1A1A',   // primary text
  inkSoft:   '#4A4A4A',   // secondary text
  inkMuted:  '#8A8A8A',
  // Per-brand accent — TCL must render red
  tclRed:    '#E60012',
} as const

// Back-compat alias: legacy files imported a single accent color
// named TEAL. Point it at red so the rebrand propagates everywhere
// without touching every constant site.
export const TEAL = COLORS.red

// ── Brand partners shown on site ────────────────────────────
// Drop the logo files into /public with these names.
export type PartnerBrand = {
  name:  string
  slug:  string
  logo:  string          // path under /public
  accent?: string        // optional override (e.g. TCL red)
}

export const PARTNER_BRANDS: PartnerBrand[] = [
  { name: 'Samsung',  slug: 'samsung',  logo: '/samsung.png' },
  { name: 'Midea',    slug: 'midea',    logo: '/Midea.png' },
  { name: 'Bruhm',    slug: 'bruhm',    logo: '/bruhm_brand.jpg' },
  { name: 'Tamashi',  slug: 'tamashi',  logo: '/TAMASHI.jpg' },
  { name: 'NASCO',    slug: 'nasco',    logo: '/nasco.png' },
  { name: 'Philips',  slug: 'philips',  logo: '/philips.svg' },
  { name: 'Haier',    slug: 'haier',    logo: '/haier.svg' },
  { name: 'Panasonic',slug: 'panasonic',logo: '/panasonic.svg' },
  { name: 'Beko',     slug: 'beko',     logo: '/beko.svg' },
]

// ── Appliance categories ────────────────────────────────────
export type ApplianceCategory = {
  name: string
  slug: string
  blurb: string
  image: string
}

export const APPLIANCE_CATEGORIES: ApplianceCategory[] = [
  { name: 'Refrigerators',     slug: 'refrigerators',     blurb: 'Double-door, single-door and side-by-side fridges.',     image: '/categories/fridges.jpg' },
  { name: 'Chest Freezers',    slug: 'chest-freezers',    blurb: 'Large-capacity freezers for home and business.',          image: '/categories/freezers.jpg' },
  { name: 'Washing Machines',  slug: 'washing-machines',  blurb: 'Top-load, front-load, fully & semi-automatic.',           image: '/categories/washers.jpg' },
  { name: 'Air Conditioners',  slug: 'air-conditioners',  blurb: 'Split units — R410 & R32 refrigerant, 1HP up to 3HP.',    image: '/categories/acs.jpg' },
  { name: 'Televisions',       slug: 'televisions',       blurb: 'Smart, 4K, HD LED TVs from the brands you trust.',        image: '/categories/tvs.jpg' },
  { name: 'Small Appliances',  slug: 'small-appliances',  blurb: 'Fans, blenders, microwaves, rice cookers and more.',      image: '/categories/small.jpg' },
]

// ── Featured Grand-Opening promo products (placeholder prices)
// Replace old_price / promo_price with real GH₵ values when available.
export type PromoProduct = {
  id: string
  name: string
  brand: string
  image: string
  oldPrice: number | null
  promoPrice: number | null
  discountPct: number | null   // computed or hand-set
  warrantyMonths: number
}

export const FEATURED_PROMO: PromoProduct[] = [
  {
    id: 'bruhm-283l-chest-freezer',
    name: 'Bruhm 283L Chest Freezer (BCS-310MR)',
    brand: 'Bruhm',
    image: '/promos/bruhm-508-freezer.png',
    oldPrice: null, promoPrice: null, discountPct: null,
    warrantyMonths: 12,
  },
  {
    id: 'bruhm-12kg-top-load-washer',
    name: 'Bruhm 12kg Fully-Automatic Top-Load Washer',
    brand: 'Bruhm',
    image: '/promos/bruhm-12kg-washer.png',
    oldPrice: null, promoPrice: null, discountPct: null,
    warrantyMonths: 12,
  },
  {
    id: 'tamashi-13kg-twin-tub-washer',
    name: 'Tamashi 13kg Twin-Tub Semi-Automatic Washing Machine (NWX130K)',
    brand: 'Tamashi',
    image: '/promos/tamashi-10kg-washer.png',
    oldPrice: null, promoPrice: null, discountPct: null,
    warrantyMonths: 12,
  },
  {
    id: 'bruhm-1.5hp-r410-ac',
    name: 'Bruhm 1.5HP R410 Split Air Conditioner',
    brand: 'Bruhm',
    image: '/promos/bruhm-1.5hp-ac.png',
    oldPrice: null, promoPrice: null, discountPct: null,
    warrantyMonths: 12,
  },
]

// Helper to format GH₵ or show placeholder
export const formatPrice = (n: number | null) =>
  n == null ? 'GH₵ —' : `GH₵ ${n.toLocaleString('en-GH', { minimumFractionDigits: 0 })}`
