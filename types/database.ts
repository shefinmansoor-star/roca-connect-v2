export type Role = 'customer' | 'salesman' | 'admin'
export type StockStatus = 'in_stock' | 'out_of_stock' | 'limited_stock'
export type OrderStatus =
  | 'new_order' | 'under_review' | 'confirmed'
  | 'quotation_sent' | 'payment_pending'
  | 'ready_for_delivery' | 'delivered' | 'cancelled'

export interface Profile {
  id: string
  email: string
  full_name: string | null
  company_name: string | null
  phone: string | null
  city: string | null
  role: Role
  is_active: boolean
  created_at: string
}

export interface Brand {
  id: string
  name: string
  name_ar: string | null
  slug: string
  description: string | null
  logo_url: string | null
  is_active: boolean
  sort_order: number
}

export interface Category {
  id: string
  name: string
  name_ar: string | null
  slug: string
  description: string | null
  is_active: boolean
  sort_order: number
}

export interface Product {
  id: string
  product_code: string
  name: string
  name_ar: string | null
  slug: string
  brand_id: string | null
  category_id: string | null
  description: string | null
  usage: string | null
  dilution: string | null
  packing: string | null
  price: number | null
  stock_status: StockStatus
  moq: number
  barcode: string | null
  image_url: string | null
  is_active: boolean
  is_featured: boolean
  created_at: string
  brand?: Brand
  category?: Category
}

export interface Order {
  id: string
  order_number: string
  customer_id: string
  salesman_id: string | null
  status: OrderStatus
  notes: string | null
  total_amount: number | null
  created_at: string
  updated_at: string
  customer?: Profile
  salesman?: Profile
  order_items?: OrderItem[]
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string | null
  product_code: string
  product_name: string
  quantity: number
  unit_price: number | null
  total_price: number | null
  product?: Product
}

export interface OrderFollowup {
  id: string
  order_id: string
  author_id: string
  message: string
  created_at: string
  author?: Profile
}
