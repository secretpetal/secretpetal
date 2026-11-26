import { supabase } from './supabase';
import { Product, Category, Subcategory, Banner, Order, SiteSettings, Coupon, CartItem } from './types';

// ==========================================
// 1. EVENT NOTIFICATIONS & CROSS-TAB SYNC
// ==========================================
export function notifyUpdate(eventName: string) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(eventName));
    try {
      localStorage.setItem(`__trigger_${eventName}`, Date.now().toString());
    } catch (e) {}
  }
}

// Subscribe to Supabase Realtime Postgres Changes
export function subscribeToStoreChanges(table: string, callback: () => void) {
  if (typeof window === 'undefined') return () => {};
  try {
    const channel = supabase
      .channel(`realtime_${table}_${Date.now()}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table },
        () => {
          callback();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  } catch (e) {
    return () => {};
  }
}

// ==========================================
// 2. SEED FALLBACK DATA
// ==========================================
export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  store_name: 'Secret Petal',
  tagline: 'Inner Beauty, Every Day',
  announcement_text: 'FREE Shipping across Pakistan on orders above Rs. 2,500',
  helpline_phone: '0326-6228304',
  whatsapp_number: '0326-6228304',
  email: 'secretpetal62@gmail.com',
  warehouse_address: 'Shahzada Shaheed Chuman Shah Road, Street No. 7, Gujranwala',
  base_shipping_rate: 200,
  free_shipping_threshold: 2500,
  cod_enabled: true,
  jazzcash_title: 'Secret Petal Official',
  jazzcash_number: '0326-6228304',
  easypaisa_title: 'Secret Petal Official',
  easypaisa_number: '0326-6228304',
  bank_name: 'Meezan Bank',
  bank_title: 'Secret Petal',
  bank_iban: 'PK00MEZN0000000000000000'
};

export const DEFAULT_CATEGORIES: Category[] = [
  {
    id: 'CAT-1',
    name: 'Comfort & Posture Bras',
    slug: 'comfort-posture-bras',
    image_url: '/images/products/c355ef86a15549c03989a4d67a7b406a.jpg.webp',
    show_in_top_categories: true,
    display_order: 1
  },
  {
    id: 'CAT-2',
    name: 'Plush & Cozy Sets',
    slug: 'plush-cozy-sets',
    image_url: '/images/products/item_2026-08-27_at_4.55.32_pm_1.webp',
    show_in_top_categories: true,
    display_order: 2
  },
  {
    id: 'CAT-3',
    name: 'Daily Cotton Bras',
    slug: 'daily-cotton-bras',
    image_url: '/images/products/item_2026-10-09_at_1.39.46_am.webp',
    show_in_top_categories: true,
    display_order: 3
  },
  {
    id: 'CAT-4',
    name: 'Everyday Panties',
    slug: 'everyday-panties',
    image_url: '/images/products/item_2026-08-27_at_5.38.10_pm.webp',
    show_in_top_categories: true,
    display_order: 4
  },
  {
    id: 'CAT-5',
    name: 'Bridal & Luxury Lace',
    slug: 'bridal-luxury-lace',
    image_url: '/images/products/item_2026-10-03_at_12.32.52_am.webp',
    show_in_top_categories: true,
    display_order: 5
  },
  {
    id: 'CAT-6',
    name: 'Seamless Shapewear',
    slug: 'seamless-shapewear',
    image_url: '/images/products/item_2026-10-09_at_1.39.49_am_1_.webp',
    show_in_top_categories: true,
    display_order: 6
  }
];

export const DEFAULT_SUBCATEGORIES: Subcategory[] = [
  { id: 'SUB-1', category_id: 'CAT-1', name: 'Butterfly Front-Closure', slug: 'butterfly-front-closure', display_order: 1 },
  { id: 'SUB-2', category_id: 'CAT-1', name: 'Wireless Posture Support', slug: 'wireless-posture-support', display_order: 2 },
  { id: 'SUB-3', category_id: 'CAT-2', name: 'Bunny Furry Sets', slug: 'bunny-furry-sets', display_order: 1 },
  { id: 'SUB-4', category_id: 'CAT-2', name: 'Velvet Lounge Sets', slug: 'velvet-lounge-sets', display_order: 2 },
  { id: 'SUB-5', category_id: 'CAT-3', name: 'Breathable Net Bras', slug: 'breathable-net-bras', display_order: 1 },
  { id: 'SUB-6', category_id: 'CAT-3', name: 'Teen & Starter Bras', slug: 'teen-starter-bras', display_order: 2 },
  { id: 'SUB-7', category_id: 'CAT-4', name: 'Seamless Laser-Cut', slug: 'seamless-laser-cut', display_order: 1 },
  { id: 'SUB-8', category_id: 'CAT-4', name: 'Pure Cotton Briefs (Pack of 3)', slug: 'pure-cotton-briefs-pack-of-3', display_order: 2 }
];

export const DEFAULT_PRODUCTS: Product[] = [
  {
    id: 'PROD-1',
    title: 'Butterfly Lace Front-Closure Wireless Posture Bra',
    slug: 'butterfly-lace-front-closure-wireless-posture-bra',
    sku: 'SP-BRA-001',
    category_id: 'CAT-1',
    subcategory_id: 'SUB-1',
    price: 2450,
    sale_price: 1850,
    stock: 30,
    thumbnail_url: '/images/products/item_2026-10-09_at_1.39.46_am.webp',
    gallery_urls: [
      '/images/products/item_2026-10-09_at_1.39.46_am.webp',
      '/images/products/item_2026-10-09_at_1.39.48_am.webp',
      '/images/products/item_2026-10-09_at_1.39.48_am_2_.webp'
    ],
    sizes: ['34B', '36B', '38B', '40B', '42B'],
    colors: ['Dusty Rose', 'Classic Black', 'Nude Skin', 'Teal Green'],
    description: 'Designed with reinforced criss-cross back posture corrective bands and convenient front snap-buckles. Seamless, wire-free comfort that prevents shoulder grooving and eases back tension all day.',
    features: [
      'Criss-cross back posture support',
      'Instant front clasp closure (no reaching behind)',
      '100% Wireless zero-pinch cup design',
      'Breathable honeycomb inner lining'
    ],
    is_featured: true,
    is_flash_deal: true,
    is_active: true,
    created_at: '2026-11-20T10:00:00.000Z'
  },
  {
    id: 'PROD-2',
    title: 'Cute Plush Bunny Furry Intimate Lounge Set',
    slug: 'cute-plush-bunny-furry-intimate-lounge-set',
    sku: 'SP-SET-002',
    category_id: 'CAT-2',
    subcategory_id: 'SUB-3',
    price: 3200,
    sale_price: 2499,
    stock: 20,
    thumbnail_url: '/images/products/item_2026-08-27_at_4.55.32_pm_1.webp',
    gallery_urls: [
      '/images/products/item_2026-08-27_at_4.55.32_pm_1.webp',
      '/images/products/item_2026-08-27_at_4.55.32_pm_2.webp'
    ],
    sizes: ['Small', 'Medium', 'Large'],
    colors: ['Baby Pink', 'Snow White'],
    description: 'Ultra-soft plush fleece lingerie and sleepwear set with darling embroidered bunny face and soft elastic bands. Keeps you warm, cute, and delightfully comfortable indoors.',
    features: [
      'Plush faux-fur velvet touch',
      'Comfort-stretch gentle waistband',
      'Adorable embroidered ears and carrot accents',
      'Double lined cotton crotch gusset'
    ],
    is_featured: true,
    is_flash_deal: true,
    is_active: true,
    created_at: '2026-11-20T09:00:00.000Z'
  },
  {
    id: 'PROD-3',
    title: 'Seamless Wireless Daily Support Bra',
    slug: 'seamless-wireless-daily-support-bra',
    sku: 'SP-BRA-003',
    category_id: 'CAT-1',
    subcategory_id: 'SUB-2',
    price: 1950,
    sale_price: 1450,
    stock: 45,
    thumbnail_url: '/images/products/item_2026-10-09_at_1.39.48_am.webp',
    gallery_urls: [
      '/images/products/item_2026-10-09_at_1.39.48_am.webp',
      '/images/products/c355ef86a15549c03989a4d67a7b406a.jpg.webp'
    ],
    sizes: ['32B', '34B', '36B', '38B', '40B'],
    colors: ['Soft Pink', 'Nude Skin', 'Lavender Grey'],
    description: 'Your everyday go-to seamless bra. Zero seams, buttery soft microfibre fabric that leaves no lines under eastern lawn kurtas or western tees.',
    features: [
      'Invisible under tight clothes',
      'Molded wireless foam cups',
      'Non-slip wide adjustable shoulder straps',
      'Sweat-wicking cooling fabric'
    ],
    is_featured: true,
    is_flash_deal: false,
    is_active: true,
    created_at: '2026-11-19T10:00:00.000Z'
  },
  {
    id: 'PROD-4',
    title: 'Luxe Butterfly Wing Posture Corrector Bra',
    slug: 'luxe-butterfly-wing-posture-corrector-bra',
    sku: 'SP-BRA-004',
    category_id: 'CAT-1',
    subcategory_id: 'SUB-2',
    price: 2650,
    sale_price: 1999,
    stock: 25,
    thumbnail_url: '/images/products/item_2026-10-09_at_1.39.48_am_2_.webp',
    gallery_urls: [
      '/images/products/item_2026-10-09_at_1.39.48_am_2_.webp',
      '/images/products/item_2026-10-09_at_1.39.46_am.webp'
    ],
    sizes: ['34C', '36C', '38C', '40C', '42C'],
    colors: ['Mint Green', 'Rose Coral', 'Midnight Black'],
    description: 'Butterfly winged back panels provide gentle compression across the upper back and shoulder blades to naturally align spine posture.',
    features: [
      'X-cross reinforced back posture bands',
      'Wide supportive side wings (smooths side bulge)',
      'Front hook closure with 3 adjustment levels',
      'Lace trim feminine finish'
    ],
    is_featured: true,
    is_flash_deal: true,
    is_active: true,
    created_at: '2026-11-19T09:00:00.000Z'
  },
  {
    id: 'PROD-5',
    title: 'Pure Cotton Daily Comfort Briefs (Pack of 3)',
    slug: 'pure-cotton-daily-comfort-briefs-pack-of-3',
    sku: 'SP-PNT-005',
    category_id: 'CAT-4',
    subcategory_id: 'SUB-8',
    price: 1650,
    sale_price: 1250,
    stock: 50,
    thumbnail_url: '/images/products/item_2026-08-27_at_5.38.10_pm.webp',
    gallery_urls: [
      '/images/products/item_2026-08-27_at_5.38.10_pm.webp'
    ],
    sizes: ['Small', 'Medium', 'Large', 'XL'],
    colors: ['Multi Pastel Pack', 'All Nude Pack'],
    description: 'Made from 95% combed cotton and 5% elastane for complete breathability during humid weather. Soft lace waistband that won’t dig into skin.',
    features: [
      '95% Combed organic cotton',
      'Full rear coverage fit',
      'Anti-chafing flatlock seams',
      'Breathable natural hygiene'
    ],
    is_featured: true,
    is_flash_deal: false,
    is_active: true,
    created_at: '2026-11-18T10:00:00.000Z'
  },
  {
    id: 'PROD-6',
    title: 'High-Waist Tummy Control Shaping Brief',
    slug: 'high-waist-tummy-control-shaping-brief',
    sku: 'SP-SHP-006',
    category_id: 'CAT-6',
    subcategory_id: 'SUB-7',
    price: 2200,
    sale_price: 1650,
    stock: 30,
    thumbnail_url: '/images/products/item_2026-10-09_at_1.39.49_am_1_.webp',
    gallery_urls: [
      '/images/products/item_2026-10-09_at_1.39.49_am_1_.webp'
    ],
    sizes: ['Medium', 'Large', 'XL', '2XL'],
    colors: ['Nude Beige', 'Jet Black'],
    description: 'Discreetly flattens the tummy and sculpts the waistline for dresses, party wear, and lawn suits without rolling down.',
    features: [
      'Anti-roll silicone grip band',
      'Medium firm compression',
      'Cotton gusset lining',
      'Zero panty lines'
    ],
    is_featured: true,
    is_flash_deal: false,
    is_active: true,
    created_at: '2026-11-18T09:00:00.000Z'
  },
  {
    id: 'PROD-7',
    title: 'Air-Net Breathable Summer Bra',
    slug: 'air-net-breathable-summer-bra',
    sku: 'SP-BRA-007',
    category_id: 'CAT-3',
    subcategory_id: 'SUB-5',
    price: 1850,
    sale_price: 1399,
    stock: 40,
    thumbnail_url: '/images/products/c355ef86a15549c03989a4d67a7b406a.jpg.webp',
    gallery_urls: [
      '/images/products/c355ef86a15549c03989a4d67a7b406a.jpg.webp'
    ],
    sizes: ['32B', '34B', '36B', '38B', '40B'],
    colors: ['Soft Lavender', 'Ivory White', 'Blush Pink'],
    description: 'Micro-pore mesh net design allows 360-degree airflow, making it the ultimate bra for hot humid weather.',
    features: [
      'Air-cooling net fabric',
      'Non-padded natural shape',
      'Sturdy side support'
    ],
    is_featured: true,
    is_flash_deal: false,
    is_active: true,
    created_at: '2026-11-17T10:00:00.000Z'
  },
  {
    id: 'PROD-8',
    title: 'Velvet Romance Cozy Winter Lounge Set',
    slug: 'velvet-romance-cozy-winter-lounge-set',
    sku: 'SP-SET-008',
    category_id: 'CAT-2',
    subcategory_id: 'SUB-4',
    price: 3500,
    sale_price: 2750,
    stock: 15,
    thumbnail_url: '/images/products/item_2026-08-27_at_4.55.32_pm_2.webp',
    gallery_urls: [
      '/images/products/item_2026-08-27_at_4.55.32_pm_2.webp'
    ],
    sizes: ['Small', 'Medium', 'Large'],
    colors: ['Rose Wine', 'Emerald Night'],
    description: 'Plush crushed velvet cami top and matching sleep shorts with delicate lace trims.',
    features: [
      'Crushed stretch velvet',
      'Eyelash lace trim',
      'Adjustable satin straps'
    ],
    is_featured: true,
    is_flash_deal: true,
    is_active: true,
    created_at: '2026-11-17T09:00:00.000Z'
  }
];

export const DEFAULT_BANNERS: Banner[] = [
  {
    id: 'BAN-1',
    title: 'Butterfly Lace Comfort & Posture Support',
    image_url: '/images/banners/banner_butterfly_posture_desktop.webp',
    mobile_image_url: '/images/banners/banner_butterfly_posture_mobile.webp',
    link_url: '/shop',
    display_order: 1,
    is_active: true
  },
  {
    id: 'BAN-2',
    title: 'Winter Cozy Plush Bunny Lingerie Sets',
    image_url: '/images/banners/banner_plush_bunny_desktop.webp',
    mobile_image_url: '/images/banners/banner_plush_bunny_mobile.webp',
    link_url: '/shop',
    display_order: 2,
    is_active: true
  },
  {
    id: 'BAN-3',
    title: '100% Discreet Packaging & Cash on Delivery',
    image_url: '/images/banners/banner_discreet_delivery_desktop.webp',
    mobile_image_url: '/images/banners/banner_discreet_delivery_mobile.webp',
    link_url: '/shop',
    display_order: 3,
    is_active: true
  }
];

export const DEFAULT_COUPONS: Coupon[] = [
  { id: 'CPN-1', code: 'SECRET300', discount_type: 'fixed', discount_value: 300, min_spend: 2000, free_shipping: false, is_active: true },
  { id: 'CPN-2', code: 'FREESHIP', discount_type: 'fixed', discount_value: 200, min_spend: 2500, free_shipping: true, is_active: true },
  { id: 'CPN-3', code: 'WELCOME10', discount_type: 'percentage', discount_value: 10, min_spend: 1500, free_shipping: false, is_active: true }
];

// Projection Fields
const PRODUCT_FIELDS = 'id, title, slug, sku, category_id, subcategory_id, price, sale_price, stock, thumbnail_url, gallery_urls, sizes, colors, description, features, is_featured, is_flash_deal, is_active, created_at, updated_at';
const CATEGORY_FIELDS = 'id, name, slug, image_url, show_in_top_categories, show_in_header, display_order, created_at';
const SUBCATEGORY_FIELDS = 'id, category_id, name, slug, display_order, created_at';
const BANNER_FIELDS = 'id, title, image_url, mobile_image_url, link_url, display_order, is_active, created_at';
const ORDER_FIELDS = 'id, order_number, customer_name, phone, whatsapp, province, city, delivery_address, order_notes, items, subtotal, delivery_charges, discount_amount, grand_total, payment_method, payment_status, payment_screenshot_url, order_status, created_at';
const SETTINGS_FIELDS = 'id, store_name, tagline, announcement_text, helpline_phone, whatsapp_number, email, warehouse_address, base_shipping_rate, free_shipping_threshold, cod_enabled, jazzcash_title, jazzcash_number, easypaisa_title, easypaisa_number, bank_name, bank_title, bank_iban';
const COUPON_FIELDS = 'id, code, discount_type, discount_value, min_spend, free_shipping, is_active, created_at';

// ==========================================
// 3. PRODUCTS CRUD (DUAL-TIER HYBRID PERSISTENCE)
// ==========================================
export async function getProducts(options?: {
  categoryId?: string;
  subcategoryId?: string;
  isFeatured?: boolean;
  isFlashDeal?: boolean;
  includeInactive?: boolean;
  limit?: number;
  offset?: number;
  search?: string;
}): Promise<Product[]> {
  let fullList: Product[] = [];

  // Try fetching fresh products from Supabase
  try {
    let query = supabase
      .from('products')
      .select(PRODUCT_FIELDS)
      .order('created_at', { ascending: false });

    if (!options?.includeInactive) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (!error && Array.isArray(data)) {
      fullList = data as Product[];
      if (typeof window !== 'undefined' && !options?.includeInactive) {
        localStorage.setItem('sp_cached_products', JSON.stringify(fullList));
      }
    }
  } catch (e) {}

  // Fallback to local storage or defaults if remote errored or was empty
  if (fullList.length === 0) {
    if (typeof window !== 'undefined') {
      const cached = localStorage.getItem('sp_cached_products');
      if (cached) {
        try {
          const parsed = JSON.parse(cached);
          if (Array.isArray(parsed) && parsed.length > 0) {
            fullList = parsed;
          }
        } catch (_) {}
      }
    }
    if (fullList.length === 0) {
      fullList = DEFAULT_PRODUCTS;
      if (typeof window !== 'undefined') {
        localStorage.setItem('sp_cached_products', JSON.stringify(fullList));
      }
    }
  }

  // Ensure newest first
  fullList.sort((a, b) => {
    const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
    const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
    return dateB - dateA;
  });

  let filtered = [...fullList];

  if (options?.categoryId) {
    filtered = filtered.filter(p => p.category_id === options.categoryId);
  }
  if (options?.subcategoryId) {
    filtered = filtered.filter(p => p.subcategory_id === options.subcategoryId);
  }
  if (options?.isFeatured !== undefined) {
    filtered = filtered.filter(p => p.is_featured === options.isFeatured);
  }
  if (options?.isFlashDeal !== undefined) {
    filtered = filtered.filter(p => p.is_flash_deal === options.isFlashDeal);
  }
  if (options?.search) {
    const q = options.search.toLowerCase().trim();
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(q) ||
      (p.sku && p.sku.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q))
    );
  }

  if (options?.limit) {
    const from = options.offset || 0;
    return filtered.slice(from, from + options.limit);
  }

  return filtered;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const cleanSlug = slug.trim().toLowerCase();
  try {
    const { data, error } = await supabase
      .from('products')
      .select(PRODUCT_FIELDS)
      .eq('slug', cleanSlug)
      .single();
    if (!error && data) return data as Product;
  } catch (e) {}

  const all = await getProducts();
  return all.find(p => p.slug.toLowerCase() === cleanSlug) || null;
}

export async function saveProduct(product: Partial<Product>): Promise<{ data: Product; error: any }> {
  const existingList = await getProducts({ includeInactive: true });
  const id = product.id || `PROD-${Date.now()}`;
  const title = (product.title || 'Untitled Product').trim();
  const slug = (product.slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')).trim();

  const hasSizes = product.has_sizes ?? (product.sizes ? product.sizes.length > 0 : true);
  const hasColors = product.has_colors ?? (product.colors ? product.colors.length > 0 : true);

  const categoryId = product.category_id && product.category_id.trim() ? product.category_id.trim() : null;
  const subcategoryId = product.subcategory_id && product.subcategory_id.trim() ? product.subcategory_id.trim() : null;

  const completeProduct: Product = {
    id,
    title,
    slug,
    sku: product.sku || `SP-PROD-${Math.floor(100 + Math.random() * 900)}`,
    category_id: categoryId as any,
    subcategory_id: subcategoryId as any,
    price: Number(product.price) || 0,
    sale_price: product.sale_price !== undefined && product.sale_price !== null && (product.sale_price as any) !== '' ? Number(product.sale_price) : undefined,
    stock: product.stock !== undefined ? Number(product.stock) : 20,
    thumbnail_url: product.thumbnail_url || '/images/products/c355ef86a15549c03989a4d67a7b406a.jpg.webp',
    gallery_urls: product.gallery_urls || [],
    has_sizes: hasSizes,
    sizes: hasSizes ? (product.sizes || []) : [],
    has_colors: hasColors,
    colors: hasColors ? (product.colors || []) : [],
    description: product.description || '',
    features: product.features || [],
    is_featured: product.is_featured ?? true,
    is_flash_deal: product.is_flash_deal ?? false,
    is_active: product.is_active ?? true,
    created_at: product.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  // 1. Optimistic Local Persistence (Instant zero-loss guarantee)
  const existingIdx = existingList.findIndex(p => p.id === id);
  let updatedList: Product[];
  if (existingIdx >= 0) {
    updatedList = [...existingList];
    updatedList[existingIdx] = completeProduct;
  } else {
    updatedList = [completeProduct, ...existingList];
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('sp_cached_products', JSON.stringify(updatedList));
  }
  notifyUpdate('sp_products_updated');

  // 2. Remote Database Sync
  try {
    const { data, error } = await supabase
      .from('products')
      .upsert(completeProduct)
      .select(PRODUCT_FIELDS)
      .single();

    if (!error && data) {
      return { data: data as Product, error: null };
    } else if (error) {
      console.error('Supabase saveProduct error:', error);
      return { data: completeProduct, error };
    }
  } catch (err: any) {
    console.error('Supabase saveProduct exception:', err);
    return { data: completeProduct, error: err };
  }

  return { data: completeProduct, error: null };
}

export async function deleteProduct(id: string): Promise<boolean> {
  // 1. Remote Database Delete first
  try {
    await supabase.from('products').delete().eq('id', id);
  } catch (e) {}

  // 2. Update local storage cache
  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('sp_cached_products');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          const updated = parsed.filter(p => p.id !== id);
          localStorage.setItem('sp_cached_products', JSON.stringify(updated));
        }
      }
    } catch (_) {}
  }
  notifyUpdate('sp_products_updated');

  return true;
}

// ==========================================
// 4. CATEGORIES & SUBCATEGORIES CRUD
// ==========================================
export async function getCategories(): Promise<Category[]> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select(CATEGORY_FIELDS)
      .order('display_order', { ascending: true });

    if (!error && Array.isArray(data) && data.length > 0) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('sp_cached_categories', JSON.stringify(data));
      }
      return data as Category[];
    }
  } catch (e) {}

  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem('sp_cached_categories');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (_) {}
    }
  }
  return DEFAULT_CATEGORIES;
}

export async function saveCategory(category: Partial<Category>): Promise<Category> {
  const list = await getCategories();
  const id = category.id || `CAT-${Date.now()}`;
  const name = (category.name || 'Category').trim();
  const slug = (category.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')).trim();

  const item: Category = {
    id,
    name,
    slug,
    image_url: category.image_url || '/images/products/c355ef86a15549c03989a4d67a7b406a.jpg.webp',
    show_in_top_categories: category.show_in_top_categories ?? true,
    show_in_header: category.show_in_header ?? true,
    display_order: category.display_order || list.length + 1,
    created_at: category.created_at || new Date().toISOString()
  };

  const idx = list.findIndex(c => c.id === id);
  const updated = idx >= 0 ? list.map(c => c.id === id ? item : c) : [...list, item];

  try {
    const { error } = await supabase.from('categories').upsert(item);
    if (error) console.error('Supabase saveCategory error:', error);
  } catch (e) {}

  if (typeof window !== 'undefined') {
    localStorage.setItem('sp_cached_categories', JSON.stringify(updated));
  }
  notifyUpdate('sp_categories_updated');

  return item;
}

export async function deleteCategory(id: string): Promise<boolean> {
  try {
    await supabase.from('categories').delete().eq('id', id);
  } catch (e) {}

  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('sp_cached_categories');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          const updated = parsed.filter(c => c.id !== id);
          localStorage.setItem('sp_cached_categories', JSON.stringify(updated));
        }
      }
    } catch (_) {}
  }
  notifyUpdate('sp_categories_updated');

  return true;
}

export async function getSubcategories(categoryId?: string): Promise<Subcategory[]> {
  try {
    let q = supabase
      .from('subcategories')
      .select(SUBCATEGORY_FIELDS)
      .order('display_order', { ascending: true });
    if (categoryId) q = q.eq('category_id', categoryId);

    const { data, error } = await q;
    if (!error && Array.isArray(data)) {
      if (typeof window !== 'undefined' && !categoryId) {
        localStorage.setItem('sp_cached_subcategories', JSON.stringify(data));
      }
      return data as Subcategory[];
    }
  } catch (e) {}

  let list = DEFAULT_SUBCATEGORIES;
  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem('sp_cached_subcategories');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) list = parsed;
      } catch (_) {}
    }
  }

  if (categoryId) return list.filter(s => s.category_id === categoryId);
  return list;
}

export async function saveSubcategory(sub: Partial<Subcategory>): Promise<Subcategory> {
  const list = await getSubcategories();
  const id = sub.id || `SUB-${Date.now()}`;
  const name = (sub.name || 'Subcategory').trim();
  const slug = (sub.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')).trim();

  const item: Subcategory = {
    id,
    category_id: sub.category_id || '',
    name,
    slug,
    display_order: sub.display_order || list.length + 1,
    created_at: sub.created_at || new Date().toISOString()
  };

  const idx = list.findIndex(s => s.id === id);
  const updated = idx >= 0 ? list.map(s => s.id === id ? item : s) : [...list, item];

  try {
    const { error } = await supabase.from('subcategories').upsert(item);
    if (error) console.error('Supabase saveSubcategory error:', error);
  } catch (e) {}

  if (typeof window !== 'undefined') {
    localStorage.setItem('sp_cached_subcategories', JSON.stringify(updated));
  }
  notifyUpdate('sp_categories_updated');

  return item;
}

export async function deleteSubcategory(id: string): Promise<boolean> {
  try {
    await supabase.from('subcategories').delete().eq('id', id);
  } catch (e) {}

  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('sp_cached_subcategories');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          const updated = parsed.filter(s => s.id !== id);
          localStorage.setItem('sp_cached_subcategories', JSON.stringify(updated));
        }
      }
    } catch (_) {}
  }
  notifyUpdate('sp_categories_updated');

  return true;
}

// ==========================================
// 5. BANNERS CRUD
// ==========================================
export async function getBanners(options?: { includeInactive?: boolean }): Promise<Banner[]> {
  try {
    let query = supabase
      .from('banners')
      .select(BANNER_FIELDS)
      .order('display_order', { ascending: true });

    if (!options?.includeInactive) {
      query = query.eq('is_active', true);
    }

    const { data, error } = await query;

    if (!error && Array.isArray(data) && data.length > 0) {
      if (typeof window !== 'undefined' && !options?.includeInactive) {
        localStorage.setItem('sp_cached_banners', JSON.stringify(data));
      }
      return data as Banner[];
    }
  } catch (e) {}

  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem('sp_cached_banners');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          if (options?.includeInactive) return parsed;
          return parsed.filter(b => b.is_active);
        }
      } catch (_) {}
    }
  }

  if (options?.includeInactive) return DEFAULT_BANNERS;
  return DEFAULT_BANNERS.filter(b => b.is_active);
}

export async function saveBanner(banner: Partial<Banner>): Promise<Banner> {
  const list = await getBanners({ includeInactive: true });
  const id = banner.id || `BAN-${Date.now()}`;

  const item: Banner = {
    id,
    title: banner.title || 'Promotional Banner',
    image_url: banner.image_url || '/images/banners/banner_butterfly_posture_desktop.webp',
    mobile_image_url: banner.mobile_image_url || banner.image_url || '/images/banners/banner_butterfly_posture_mobile.webp',
    link_url: banner.link_url || '/shop',
    display_order: banner.display_order || (banner.id ? list.find(b => b.id === banner.id)?.display_order || 1 : list.length + 1),
    is_active: banner.is_active ?? true,
    created_at: banner.created_at || new Date().toISOString()
  };

  const idx = list.findIndex(b => b.id === id);
  const updated = idx >= 0 ? list.map(b => b.id === id ? item : b) : [...list, item];

  if (typeof window !== 'undefined') {
    localStorage.setItem('sp_cached_banners', JSON.stringify(updated));
  }
  notifyUpdate('sp_banners_updated');

  try {
    const { error } = await supabase.from('banners').upsert(item);
    if (error) console.error('Supabase saveBanner error:', error);
  } catch (e) {}

  return item;
}

export async function deleteBanner(id: string): Promise<boolean> {
  try {
    await supabase.from('banners').delete().eq('id', id);
  } catch (e) {}

  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('sp_cached_banners');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          const updated = parsed.filter(b => b.id !== id);
          localStorage.setItem('sp_cached_banners', JSON.stringify(updated));
        }
      }
    } catch (_) {}
  }
  notifyUpdate('sp_banners_updated');

  return true;
}

// ==========================================
// 6. ORDERS CRUD
// ==========================================
export async function getOrders(): Promise<Order[]> {
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(ORDER_FIELDS)
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data)) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('sp_cached_orders', JSON.stringify(data));
      }
      return data as Order[];
    }
  } catch (e) {}

  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem('sp_cached_orders');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return parsed;
      } catch (_) {}
    }
  }
  return [];
}

export async function getOrderByNumber(orderNumber: string): Promise<Order | null> {
  const clean = orderNumber.trim().toUpperCase();
  try {
    const { data, error } = await supabase
      .from('orders')
      .select(ORDER_FIELDS)
      .eq('order_number', clean)
      .single();
    if (!error && data) return data as Order;
  } catch (e) {}

  const orders = await getOrders();
  return orders.find(o => o.order_number.toUpperCase() === clean) || null;
}

export async function createOrder(order: Omit<Order, 'id' | 'order_number' | 'created_at'>): Promise<{ data: Order; error: any }> {
  const orderNumber = 'SP-' + Math.floor(100000 + Math.random() * 900000);
  const id = `ORD-${Date.now()}`;
  const fullOrder: Order = {
    ...order,
    id,
    order_number: orderNumber,
    order_status: 'Pending',
    payment_status: order.payment_status || 'pending',
    created_at: new Date().toISOString()
  };

  // 1. Optimistic Local Persistence
  if (typeof window !== 'undefined') {
    const existing = await getOrders();
    localStorage.setItem('sp_cached_orders', JSON.stringify([fullOrder, ...existing]));
  }
  notifyUpdate('sp_orders_updated');

  // 2. Supabase Sync
  try {
    const { data, error } = await supabase
      .from('orders')
      .insert(fullOrder)
      .select(ORDER_FIELDS)
      .single();

    if (!error && data) {
      return { data: data as Order, error: null };
    } else if (error) {
      console.error('Supabase createOrder error:', error);
      return { data: fullOrder, error };
    }
  } catch (err: any) {
    console.error('Supabase createOrder exception:', err);
    return { data: fullOrder, error: err };
  }

  return { data: fullOrder, error: null };
}

export async function updateOrder(order: Partial<Order> & { id: string }): Promise<{ data: Order; error: any }> {
  const orders = await getOrders();
  const existing = orders.find(o => o.id === order.id || o.order_number === order.id || (order.order_number && o.order_number === order.order_number));
  const updatedOrder: Order = {
    ...(existing || {} as Order),
    ...order
  };

  // 1. Optimistic Local Persistence
  const updatedList = orders.map(o => (o.id === order.id || o.order_number === order.id || (order.order_number && o.order_number === order.order_number)) ? updatedOrder : o);
  if (typeof window !== 'undefined') {
    localStorage.setItem('sp_cached_orders', JSON.stringify(updatedList));
  }
  notifyUpdate('sp_orders_updated');

  // 2. Supabase Sync
  try {
    const { data, error } = await supabase
      .from('orders')
      .upsert(updatedOrder)
      .select(ORDER_FIELDS)
      .single();

    if (!error && data) {
      return { data: data as Order, error: null };
    } else if (error) {
      console.error('Supabase updateOrder error:', error);
      return { data: updatedOrder, error };
    }
  } catch (err: any) {
    console.error('Supabase updateOrder exception:', err);
    return { data: updatedOrder, error: err };
  }

  return { data: updatedOrder, error: null };
}

export async function updateOrderStatus(id: string, status: Order['order_status'], paymentStatus?: Order['payment_status']): Promise<boolean> {
  const payload: any = { order_status: status };
  if (paymentStatus) payload.payment_status = paymentStatus;

  try {
    await supabase.from('orders').update(payload).eq('id', id);
  } catch (e) {}
  try {
    await supabase.from('orders').update(payload).eq('order_number', id);
  } catch (e) {}

  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('sp_cached_orders');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          const updated = parsed.map((o: any) => {
            if (o.id === id || o.order_number === id) {
              return {
                ...o,
                order_status: status,
                payment_status: paymentStatus || o.payment_status
              };
            }
            return o;
          });
          localStorage.setItem('sp_cached_orders', JSON.stringify(updated));
        }
      }
    } catch (_) {}
  }
  notifyUpdate('sp_orders_updated');

  return true;
}

export async function deleteOrder(id: string): Promise<boolean> {
  try {
    await supabase.from('orders').delete().eq('id', id);
  } catch (e) {}
  try {
    await supabase.from('orders').delete().eq('order_number', id);
  } catch (e) {}

  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('sp_cached_orders');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          const updated = parsed.filter((o: any) => o.id !== id && o.order_number !== id);
          localStorage.setItem('sp_cached_orders', JSON.stringify(updated));
        }
      }
    } catch (_) {}
  }
  notifyUpdate('sp_orders_updated');

  return true;
}

// ==========================================
// 7. COUPONS CRUD & VALIDATION
// ==========================================
export async function getCoupons(): Promise<Coupon[]> {
  try {
    const { data, error } = await supabase
      .from('coupons')
      .select(COUPON_FIELDS)
      .order('created_at', { ascending: false });

    if (!error && Array.isArray(data) && data.length > 0) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('sp_cached_coupons', JSON.stringify(data));
      }
      return data as Coupon[];
    }
  } catch (e) {}

  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem('sp_cached_coupons');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (_) {}
    }
  }

  return DEFAULT_COUPONS;
}

export async function saveCoupon(coupon: Partial<Coupon>): Promise<Coupon> {
  const list = await getCoupons();
  const id = coupon.id || `CPN-${Date.now()}`;
  const code = (coupon.code || 'COUPON').trim().toUpperCase();

  const item: Coupon = {
    id,
    code,
    discount_type: coupon.discount_type || 'fixed',
    discount_value: coupon.discount_value || 100,
    min_spend: coupon.min_spend || 1000,
    free_shipping: coupon.free_shipping ?? false,
    is_active: coupon.is_active ?? true,
    created_at: coupon.created_at || new Date().toISOString()
  };

  const idx = list.findIndex(c => c.id === id || c.code === code);
  const updated = idx >= 0 ? list.map(c => (c.id === id || c.code === code) ? item : c) : [item, ...list];

  if (typeof window !== 'undefined') {
    localStorage.setItem('sp_cached_coupons', JSON.stringify(updated));
  }
  notifyUpdate('sp_coupons_updated');

  try {
    const { error } = await supabase.from('coupons').upsert(item);
    if (error) console.error('Supabase saveCoupon error:', error);
  } catch (e) {}

  return item;
}

export async function deleteCoupon(id: string): Promise<boolean> {
  try {
    await supabase.from('coupons').delete().eq('id', id);
  } catch (e) {}
  try {
    await supabase.from('coupons').delete().eq('code', id);
  } catch (e) {}

  if (typeof window !== 'undefined') {
    try {
      const cached = localStorage.getItem('sp_cached_coupons');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) {
          const updated = parsed.filter((c: any) => c.id !== id && c.code !== id);
          localStorage.setItem('sp_cached_coupons', JSON.stringify(updated));
        }
      }
    } catch (_) {}
  }
  notifyUpdate('sp_coupons_updated');

  return true;
}

export async function validateCoupon(code: string, subtotal: number): Promise<{
  isValid: boolean;
  message: string;
  discountAmount: number;
  freeShipping: boolean;
  coupon?: Coupon;
}> {
  const cleanCode = code.trim().toUpperCase();
  const coupons = await getCoupons();
  const found = coupons.find(c => c.code === cleanCode && c.is_active);

  if (!found) {
    return { isValid: false, message: 'Invalid or expired coupon code', discountAmount: 0, freeShipping: false };
  }

  if (subtotal < found.min_spend) {
    return {
      isValid: false,
      message: `Minimum order value for ${found.code} is Rs. ${found.min_spend.toLocaleString()}`,
      discountAmount: 0,
      freeShipping: false
    };
  }

  let discount = 0;
  if (found.discount_type === 'percentage') {
    discount = Math.round((subtotal * found.discount_value) / 100);
  } else {
    discount = Math.min(found.discount_value, subtotal);
  }

  return {
    isValid: true,
    message: `Coupon "${found.code}" applied successfully!`,
    discountAmount: discount,
    freeShipping: found.free_shipping,
    coupon: found
  };
}

// ==========================================
// 8. SITE SETTINGS CRUD
// ==========================================
export async function getSiteSettings(): Promise<SiteSettings> {
  try {
    const { data, error } = await supabase
      .from('site_settings')
      .select(SETTINGS_FIELDS)
      .eq('id', 'current')
      .single();

    if (!error && data) {
      if (typeof window !== 'undefined') {
        localStorage.setItem('sp_cached_settings', JSON.stringify(data));
      }
      return data as SiteSettings;
    }
  } catch (e) {}

  if (typeof window !== 'undefined') {
    const cached = localStorage.getItem('sp_cached_settings');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.store_name) return parsed;
      } catch (_) {}
    }
  }
  return DEFAULT_SITE_SETTINGS;
}

export async function saveSiteSettings(settings: Partial<SiteSettings>): Promise<{ data: SiteSettings; error: any }> {
  const current = await getSiteSettings();
  const baseShipping = settings.base_shipping_rate !== undefined
    ? Number(settings.base_shipping_rate)
    : Number(current.base_shipping_rate ?? 200);
  const freeThreshold = settings.free_shipping_threshold !== undefined
    ? Number(settings.free_shipping_threshold)
    : Number(current.free_shipping_threshold ?? 2500);

  const payload: SiteSettings = {
    ...current,
    ...settings,
    id: 'current',
    base_shipping_rate: Number.isFinite(baseShipping) ? Math.max(0, baseShipping) : 200,
    free_shipping_threshold: Number.isFinite(freeThreshold) ? Math.max(0, freeThreshold) : 2500,
  };

  try {
    const { data, error } = await supabase.from('site_settings').upsert({
      ...payload,
      updated_at: new Date().toISOString()
    }).select(SETTINGS_FIELDS).single();

    if (error) {
      console.error('Supabase saveSiteSettings error:', error);
      return { data: payload, error };
    }

    const saved = (data as SiteSettings) || payload;
    if (typeof window !== 'undefined') {
      localStorage.setItem('sp_cached_settings', JSON.stringify(saved));
    }
    notifyUpdate('sp_settings_updated');
    return { data: saved, error: null };
  } catch (e: any) {
    console.error('Supabase saveSiteSettings exception:', e);
    if (typeof window !== 'undefined') {
      localStorage.setItem('sp_cached_settings', JSON.stringify(payload));
    }
    notifyUpdate('sp_settings_updated');
    return { data: payload, error: e };
  }
}

// ==========================================
// 9. CLIENT-SIDE WEBP MEDIA UPLOAD
// ==========================================
export async function uploadMedia(file: File, folder: string = 'uploads'): Promise<string> {
  return new Promise<string>((resolve) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const img = new Image();
      img.onload = async () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 1200;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
        }

        canvas.toBlob(
          async (blob) => {
            if (!blob) {
              resolve(e.target?.result as string || '');
              return;
            }

            const fileName = `${folder}/${Date.now()}_${Math.random().toString(36).substring(7)}.webp`;

            try {
              const { error } = await supabase.storage
                .from('secretpetal-media')
                .upload(fileName, blob, {
                  contentType: 'image/webp',
                  cacheControl: '31536000',
                  upsert: true
                });

              if (!error) {
                const { data: publicUrlData } = supabase.storage
                  .from('secretpetal-media')
                  .getPublicUrl(fileName);

                if (publicUrlData?.publicUrl) {
                  resolve(publicUrlData.publicUrl);
                  return;
                }
              }
            } catch (err) {}

            // Fallback to high-quality compressed WebP data URL
            const webpDataUrl = canvas.toDataURL('image/webp', 0.82);
            resolve(webpDataUrl);
          },
          'image/webp',
          0.82
        );
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}
