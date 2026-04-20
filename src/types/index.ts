export type Brand =
  | 'Samsung'
  | 'Midea'
  | 'Bruhm'
  | 'Tamashi'
  | 'TCL'
  | 'NASCO'
  | 'Haier'
  | 'Refrigerators'
  | 'Chest Freezers'
  | 'Washing Machines'
  | 'Air Conditioners'
  | 'Televisions'
  | 'Small Appliances'

export const BRANDS: Brand[] = [
  'Samsung',
  'Midea',
  'Bruhm',
  'Tamashi',
  'TCL',
  'NASCO',
  'Haier',
  'Refrigerators',
  'Chest Freezers',
  'Washing Machines',
  'Air Conditioners',
  'Televisions',
  'Small Appliances',
]

export interface Product {
  id: string
  title: string
  model_number: string
  brand: Brand
  description: string
  price: number | null
  images: string[]
  in_stock: boolean
  featured: boolean
  category: string
  slug: string
  specifications: Record<string, string>
  created_at: string
  updated_at: string
}

export interface Order {
  id: string
  product_id: string
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  quantity: number
  message: string | null
  status: 'pending' | 'confirmed' | 'delivered' | 'cancelled'
  created_at: string
}
