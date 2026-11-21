export interface Category {
  id: string;
  name: string;
  slug: string;
  image_url: string;
  show_in_top_categories?: boolean;
  display_order?: number;
  created_at?: string;
}

export interface Subcategory {
  id: string;
  category_id: string;
  name: string;
  slug: string;
  display_order?: number;
  created_at?: string;
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  sku?: string;
  category_id?: string;
  subcategory_id?: string;
  price: number;
  sale_price?: number;
  stock: number;
  thumbnail_url: string;
  gallery_urls?: string[];
  sizes?: string[];
  colors?: string[];
  description?: string;
  features?: string[];
  is_featured?: boolean;
  is_flash_deal?: boolean;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Banner {
  id: string;
  title?: string;
  image_url: string;
  mobile_image_url?: string;
  link_url?: string;
  display_order?: number;
  is_active?: boolean;
  created_at?: string;
}

export interface OrderItem {
  product_id: string;
  title: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  thumbnail_url: string;
}

export interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  phone: string;
  whatsapp?: string;
  province?: string;
  city: string;
  delivery_address: string;
  order_notes?: string;
  items: OrderItem[];
  subtotal: number;
  delivery_charges: number;
  discount_amount: number;
  grand_total: number;
  payment_method: 'cod' | 'jazzcash' | 'easypaisa' | 'bank';
  payment_status: 'pending' | 'verified' | 'rejected';
  payment_screenshot_url?: string;
  order_status: 'Pending' | 'Confirmed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  created_at?: string;
}

export interface Coupon {
  id: string;
  code: string;
  discount_type: 'fixed' | 'percentage';
  discount_value: number;
  min_spend: number;
  free_shipping: boolean;
  is_active: boolean;
  created_at?: string;
}

export interface SiteSettings {
  id?: string;
  store_name: string;
  tagline: string;
  helpline_phone: string;
  whatsapp_number: string;
  email: string;
  warehouse_address: string;
  base_shipping_rate: number;
  free_shipping_threshold: number;
  cod_enabled: boolean;
  jazzcash_title: string;
  jazzcash_number: string;
  easypaisa_title: string;
  easypaisa_number: string;
  bank_name: string;
  bank_title: string;
  bank_iban: string;
  updated_at?: string;
}

export interface CartItem {
  product_id: string;
  title: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
  thumbnail_url: string;
  stock: number;
}
