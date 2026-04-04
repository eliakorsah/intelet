export type Brand = 
  | 'Hikvision' 
  | 'Dahua' 
  | 'TP-Link' 
  | 'D-Link' 
  | 'Panasonic'
  | 'Hi-Look'
  | 'Grandstream'
  | 'Alfama'
  | 'Addressable Fire Alarm'
  | 'Conventional Fire Alarm'
  | 'Solar 4G PTZ Cameras'
  | 'WiFi Cameras'
  | 'Analogue Cameras'
  | 'Networking Accessories'
  | 'CCTV Accessories'
  | 'Analogue Speakers'
  | 'IP Speakers'

export const BRANDS: Brand[] = [
  'Hikvision', 'Dahua', 'TP-Link', 'D-Link', 'Panasonic', 'Hi-Look',
'Grandstream',
'Alfama',
'Addressable Fire Alarm',
'Conventional Fire Alarm',
'Solar 4G PTZ Cameras',
'WiFi Cameras',
'Analogue Cameras',
'Networking Accessories',
'CCTV Accessories',
'Analogue Speakers',
'IP Speakers',
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
