-- ==============================================================================
-- SECRET PETAL (secretpetal.store) - MASTER PRODUCTION SUPABASE SCHEMA
-- ==============================================================================
-- Run in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/abptftyzsxbnhkfqqtju/sql
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY DEFAULT ('CAT-' || floor(extract(epoch from now())*1000)::text),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image_url TEXT,
  show_in_top_categories BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_top ON public.categories(show_in_top_categories);
CREATE INDEX IF NOT EXISTS idx_categories_order ON public.categories(display_order ASC);

-- 2. SUBCATEGORIES TABLE (DARAZ-STYLE MULTI-TIER)
CREATE TABLE IF NOT EXISTS public.subcategories (
  id TEXT PRIMARY KEY DEFAULT ('SUB-' || floor(extract(epoch from now())*1000)::text),
  category_id TEXT NOT NULL REFERENCES public.categories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_subcategories_cat ON public.subcategories(category_id);
CREATE INDEX IF NOT EXISTS idx_subcategories_slug ON public.subcategories(slug);

-- 3. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS public.products (
  id TEXT PRIMARY KEY DEFAULT ('PROD-' || floor(extract(epoch from now())*1000)::text),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  sku TEXT,
  category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
  subcategory_id TEXT REFERENCES public.subcategories(id) ON DELETE SET NULL,
  price NUMERIC NOT NULL,
  sale_price NUMERIC,
  stock INT DEFAULT 15,
  thumbnail_url TEXT NOT NULL,
  gallery_urls JSONB DEFAULT '[]'::jsonb,
  sizes JSONB DEFAULT '["32B", "34B", "36B", "38B", "40B"]'::jsonb,
  colors JSONB DEFAULT '["Blush Pink", "Black", "Nude Beige", "Sage Green"]'::jsonb,
  description TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  is_featured BOOLEAN DEFAULT TRUE,
  is_flash_deal BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_category ON public.products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_subcategory ON public.products(subcategory_id);
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_flash ON public.products(is_flash_deal);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_created ON public.products(created_at DESC);

-- 4. BANNERS TABLE (PURE IMAGES, ZERO OVERLAY CLUTTER)
CREATE TABLE IF NOT EXISTS public.banners (
  id TEXT PRIMARY KEY DEFAULT ('BAN-' || floor(extract(epoch from now())*1000)::text),
  title TEXT DEFAULT 'Hero Banner',
  image_url TEXT NOT NULL,
  mobile_image_url TEXT,
  link_url TEXT DEFAULT '/shop',
  display_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_banners_active ON public.banners(is_active);
CREATE INDEX IF NOT EXISTS idx_banners_order ON public.banners(display_order ASC);

-- 5. ORDERS TABLE (CASH ON DELIVERY & PAKISTANI DIGITAL WALLETS)
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY DEFAULT ('ORD-' || floor(extract(epoch from now())*1000)::text),
  order_number TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  whatsapp TEXT,
  province TEXT,
  city TEXT NOT NULL,
  delivery_address TEXT NOT NULL,
  order_notes TEXT,
  items JSONB NOT NULL,
  subtotal NUMERIC NOT NULL,
  delivery_charges NUMERIC NOT NULL DEFAULT 200,
  discount_amount NUMERIC NOT NULL DEFAULT 0,
  grand_total NUMERIC NOT NULL,
  payment_method TEXT DEFAULT 'cod', -- 'cod', 'jazzcash', 'easypaisa', 'bank'
  payment_status TEXT DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
  payment_screenshot_url TEXT,
  order_status TEXT DEFAULT 'Pending', -- 'Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_phone ON public.orders(phone);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);

-- 6. COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
  id TEXT PRIMARY KEY DEFAULT ('CPN-' || floor(extract(epoch from now())*1000)::text),
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL DEFAULT 'fixed', -- 'fixed' or 'percentage'
  discount_value NUMERIC NOT NULL DEFAULT 300,
  min_spend NUMERIC DEFAULT 1500,
  free_shipping BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. STORE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.site_settings (
  id TEXT PRIMARY KEY DEFAULT 'current',
  store_name TEXT DEFAULT 'Secret Petal',
  tagline TEXT DEFAULT 'Inner Beauty, Every Day',
  helpline_phone TEXT DEFAULT '0326-6228304',
  whatsapp_number TEXT DEFAULT '0326-6228304',
  email TEXT DEFAULT 'secretpetal62@gmail.com',
  warehouse_address TEXT DEFAULT 'Shahzada Shaheed Chuman Shah Road, Street No. 7, Gujranwala',
  base_shipping_rate NUMERIC DEFAULT 200,
  free_shipping_threshold NUMERIC DEFAULT 2500,
  cod_enabled BOOLEAN DEFAULT TRUE,
  jazzcash_title TEXT DEFAULT 'Secret Petal Official',
  jazzcash_number TEXT DEFAULT '0326-6228304',
  easypaisa_title TEXT DEFAULT 'Secret Petal Official',
  easypaisa_number TEXT DEFAULT '0326-6228304',
  bank_name TEXT DEFAULT 'Meezan Bank',
  bank_title TEXT DEFAULT 'Secret Petal',
  bank_iban TEXT DEFAULT 'PK00MEZN0000000000000000',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- POST-OCTOBER 30 MANDATORY PERMISSION GRANTS & RLS POLICIES
-- ==============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Category Policies
DROP POLICY IF EXISTS "Public read categories" ON public.categories;
DROP POLICY IF EXISTS "Admin manage categories" ON public.categories;
CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Admin manage categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

-- Subcategory Policies
DROP POLICY IF EXISTS "Public read subcategories" ON public.subcategories;
DROP POLICY IF EXISTS "Admin manage subcategories" ON public.subcategories;
CREATE POLICY "Public read subcategories" ON public.subcategories FOR SELECT USING (true);
CREATE POLICY "Admin manage subcategories" ON public.subcategories FOR ALL USING (true) WITH CHECK (true);

-- Product Policies
DROP POLICY IF EXISTS "Public read active products" ON public.products;
DROP POLICY IF EXISTS "Admin manage products" ON public.products;
CREATE POLICY "Public read active products" ON public.products FOR SELECT USING (true);
CREATE POLICY "Admin manage products" ON public.products FOR ALL USING (true) WITH CHECK (true);

-- Banner Policies
DROP POLICY IF EXISTS "Public read banners" ON public.banners;
DROP POLICY IF EXISTS "Admin manage banners" ON public.banners;
CREATE POLICY "Public read banners" ON public.banners FOR SELECT USING (true);
CREATE POLICY "Admin manage banners" ON public.banners FOR ALL USING (true) WITH CHECK (true);

-- Order Policies
DROP POLICY IF EXISTS "Public insert orders" ON public.orders;
DROP POLICY IF EXISTS "Public read orders" ON public.orders;
DROP POLICY IF EXISTS "Admin manage orders" ON public.orders;
CREATE POLICY "Public insert orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public read orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Admin manage orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);

-- Coupon Policies
DROP POLICY IF EXISTS "Public read coupons" ON public.coupons;
DROP POLICY IF EXISTS "Admin manage coupons" ON public.coupons;
CREATE POLICY "Public read coupons" ON public.coupons FOR SELECT USING (true);
CREATE POLICY "Admin manage coupons" ON public.coupons FOR ALL USING (true) WITH CHECK (true);

-- Site Settings Policies
DROP POLICY IF EXISTS "Public read settings" ON public.site_settings;
DROP POLICY IF EXISTS "Admin manage settings" ON public.site_settings;
CREATE POLICY "Public read settings" ON public.site_settings FOR SELECT USING (true);
CREATE POLICY "Admin manage settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);

-- ==============================================================================
-- STORAGE BUCKET CREATION FOR SECRET PETAL MEDIA
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('secretpetal-media', 'secretpetal-media', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DROP POLICY IF EXISTS "Public can view media" ON storage.objects;
DROP POLICY IF EXISTS "Public can upload media" ON storage.objects;
CREATE POLICY "Public can view media" ON storage.objects FOR SELECT USING (bucket_id = 'secretpetal-media');
CREATE POLICY "Public can upload media" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'secretpetal-media');
CREATE POLICY "Public can update media" ON storage.objects FOR UPDATE USING (bucket_id = 'secretpetal-media');
CREATE POLICY "Public can delete media" ON storage.objects FOR DELETE USING (bucket_id = 'secretpetal-media');

-- ==============================================================================
-- SEED DATA (CATEGORIES, BANNERS, SITE SETTINGS, PRODUCTS)
-- ==============================================================================

-- 1. Categories
INSERT INTO public.categories (id, name, slug, image_url, show_in_top_categories, display_order)
VALUES
  ('CAT-1', 'Comfort & Posture Bras', 'comfort-posture-bras', '/images/products/item_2026-10-09_at_1.39.46_am.webp', true, 1),
  ('CAT-2', 'Plush & Cozy Sets', 'plush-cozy-sets', '/images/products/item_2026-08-27_at_4.55.32_pm_1.webp', true, 2),
  ('CAT-3', 'Daily Cotton Bras', 'daily-cotton-bras', '/images/products/c355ef86a15549c03989a4d67a7b406a.jpg.webp', true, 3),
  ('CAT-4', 'Everyday Panties', 'everyday-panties', '/images/products/item_2026-08-27_at_5.38.10_pm.webp', true, 4),
  ('CAT-5', 'Bridal & Luxury Lace', 'bridal-luxury-lace', '/images/products/item_2026-10-03_at_12.32.52_am.webp', true, 5),
  ('CAT-6', 'Seamless Shapewear', 'seamless-shapewear', '/images/products/item_2026-10-09_at_1.39.49_am_1_.webp', true, 6)
ON CONFLICT (id) DO NOTHING;

-- 2. Subcategories
INSERT INTO public.subcategories (id, category_id, name, slug, display_order)
VALUES
  ('SUB-1', 'CAT-1', 'Butterfly Front-Closure', 'butterfly-front-closure', 1),
  ('SUB-2', 'CAT-1', 'Wireless Posture Support', 'wireless-posture-support', 2),
  ('SUB-3', 'CAT-2', 'Bunny Furry Sets', 'bunny-furry-sets', 1),
  ('SUB-4', 'CAT-2', 'Velvet Lounge Sets', 'velvet-lounge-sets', 2),
  ('SUB-5', 'CAT-3', 'Breathable Net Bras', 'breathable-net-bras', 1),
  ('SUB-6', 'CAT-3', 'Teen & Starter Bras', 'teen-starter-bras', 2),
  ('SUB-7', 'CAT-4', 'Seamless Laser-Cut', 'seamless-laser-cut', 1),
  ('SUB-8', 'CAT-4', 'Pure Cotton Briefs (Pack of 3)', 'pure-cotton-briefs-pack-of-3', 2)
ON CONFLICT (id) DO NOTHING;

-- 3. Initial Products
INSERT INTO public.products (
  id, title, slug, sku, category_id, subcategory_id, price, sale_price, stock,
  thumbnail_url, gallery_urls, sizes, colors, description, features,
  is_featured, is_flash_deal, is_active
)
VALUES
  (
    'PROD-1',
    'Butterfly Lace Front-Closure Wireless Posture Bra',
    'butterfly-lace-front-closure-wireless-posture-bra',
    'SP-BRA-001',
    'CAT-1',
    'SUB-1',
    2450,
    1850,
    30,
    '/images/products/c355ef86a15549c03989a4d67a7b406a.jpg.webp',
    '["/images/products/item_2026-10-03_at_12.32.52_am.webp", "/images/products/item_2026-10-09_at_1.39.46_am.webp", "/images/products/item_2026-10-09_at_1.39.47_am.webp"]'::jsonb,
    '["32B", "34B", "36B", "38B", "40B", "42B"]'::jsonb,
    '["Blush Pink", "Sage Mint", "Soft Lavender", "Classic Black", "Nude Beige"]'::jsonb,
    'Engineered for maximum posture support and all-day wireless comfort. Features an exquisite butterfly lace back that smooths back bulges, paired with a convenient front-clasp design for effortless wearing.',
    '["Wireless all-day comfort", "Front hook-and-eye closure", "Butterfly posture support back", "Breathable stretch lace", "Discreet packaging guaranteed"]'::jsonb,
    true,
    true,
    true
  ),
  (
    'PROD-2',
    'Cute Plush Bunny Furry Intimate Lounge Set',
    'cute-plush-bunny-furry-intimate-lounge-set',
    'SP-SET-002',
    'CAT-2',
    'SUB-3',
    3200,
    2499,
    20,
    '/images/products/item_2026-08-27_at_4.55.32_pm_1.webp',
    '["/images/products/untitled-1_copy_b5f707fa-3087-4ff3-ae82-9672b38357be.webp", "/images/products/item_2026-08-27_at_4.55.32_pm_2.webp"]'::jsonb,
    '["Small", "Medium", "Large"]'::jsonb,
    '["Baby Pink", "Snow White"]'::jsonb,
    'Adorable and irresistibly soft plush bunny-themed bra and matching panty set. Crafted with ultra-plush faux fur detailing, embroidered bunny face, and soft elastic bands that do not bite into skin.',
    '["Ultra-soft plush fur texture", "Cute embroidered bunny ears", "Gentle non-pinch elastics", "Perfect cozy gift set"]'::jsonb,
    true,
    true,
    true
  ),
  (
    'PROD-3',
    'Seamless Wireless Daily Support Bra',
    'seamless-wireless-daily-support-bra',
    'SP-BRA-003',
    'CAT-1',
    'SUB-2',
    1950,
    1450,
    45,
    '/images/products/item_2026-10-09_at_1.39.46_am.webp',
    '["/images/products/item_2026-10-09_at_1.39.47_am_1_.webp", "/images/products/item_2026-10-09_at_1.39.48_am.webp"]'::jsonb,
    '["32B", "34B", "36B", "38B", "40B"]'::jsonb,
    '["Nude Beige", "Blush Pink", "Jet Black"]'::jsonb,
    'The everyday essential every Pakistani woman needs. Ultra-lightweight seamless construction disappears invisibly under shalwar kameez, kurtis, and t-shirts without any wire poke.',
    '["Invisible seamless edges", "No-underwire poke", "Wide comfort side-bands", "Breathable micro-fiber fabric"]'::jsonb,
    true,
    false,
    true
  ),
  (
    'PROD-4',
    'Luxe Butterfly Wing Posture Corrector Bra',
    'luxe-butterfly-wing-posture-corrector-bra',
    'SP-BRA-004',
    'CAT-1',
    'SUB-1',
    2650,
    1999,
    25,
    '/images/products/item_2026-10-03_at_12.32.52_am.webp',
    '["/images/products/item_2026-10-09_at_1.39.49_am_1_.webp"]'::jsonb,
    '["34B", "36B", "38B", "40B", "42B"]'::jsonb,
    '["Sage Green", "Blush Pink", "Midnight Black"]'::jsonb,
    'Dual-crossover back panel gently pulls shoulders into upright alignment while offering full breast support and preventing shoulder groove marks.',
    '["Wide shoulder straps", "Criss-cross back posture pull", "Front closure", "Gentle cup moulding"]'::jsonb,
    true,
    true,
    true
  ),
  (
    'PROD-5',
    'Pure Cotton Daily Comfort Briefs (Pack of 3)',
    'pure-cotton-daily-comfort-briefs-pack-of-3',
    'SP-PNT-005',
    'CAT-4',
    'SUB-8',
    1650,
    1250,
    50,
    '/images/products/item_2026-08-27_at_5.38.10_pm.webp',
    '["/images/products/item_2026-08-27_at_4.55.32_pm.webp"]'::jsonb,
    '["Small", "Medium", "Large", "XL"]'::jsonb,
    '["Multi-Pastel Assorted"]'::jsonb,
    '100% combed breathable cotton everyday panties. Keeps you cool, sweat-free, and comfortable throughout Pakistani summers and long workdays.',
    '["100% combed cotton", "Full rear coverage", "Anti-chafing soft waistband", "Pack of 3 assorted colors"]'::jsonb,
    true,
    false,
    true
  ),
  (
    'PROD-6',
    'High-Waist Tummy Control Shaping Brief',
    'high-waist-tummy-control-shaping-brief',
    'SP-SHP-006',
    'CAT-6',
    'SUB-7',
    2200,
    1650,
    30,
    '/images/products/item_2026-10-09_at_1.39.49_am_1_.webp',
    '[]'::jsonb,
    '["Medium", "Large", "XL", "2XL"]'::jsonb,
    '["Nude Beige", "Jet Black"]'::jsonb,
    'Discreetly flattens the tummy and sculpts the waistline for dresses, party wear, and lawn suits without rolling down.',
    '["Anti-roll silicone grip band", "Medium firm compression", "Cotton gusset lining", "Zero panty lines"]'::jsonb,
    true,
    false,
    true
  ),
  (
    'PROD-7',
    'Air-Net Breathable Summer Bra',
    'air-net-breathable-summer-bra',
    'SP-BRA-007',
    'CAT-3',
    'SUB-5',
    1850,
    1399,
    40,
    '/images/products/c355ef86a15549c03989a4d67a7b406a.jpg.webp',
    '[]'::jsonb,
    '["32B", "34B", "36B", "38B", "40B"]'::jsonb,
    '["Soft Lavender", "Ivory White", "Blush Pink"]'::jsonb,
    'Micro-pore mesh net design allows 360-degree airflow, making it the ultimate bra for hot humid weather.',
    '["Air-cooling net fabric", "Non-padded natural shape", "Sturdy side support"]'::jsonb,
    true,
    false,
    true
  ),
  (
    'PROD-8',
    'Velvet Romance Cozy Winter Lounge Set',
    'velvet-romance-cozy-winter-lounge-set',
    'SP-SET-008',
    'CAT-2',
    'SUB-4',
    3500,
    2750,
    15,
    '/images/products/item_2026-08-27_at_4.55.32_pm_2.webp',
    '[]'::jsonb,
    '["Small", "Medium", "Large"]'::jsonb,
    '["Rose Wine", "Emerald Night"]'::jsonb,
    'Plush crushed velvet cami top and matching sleep shorts with delicate lace trims.',
    '["Crushed stretch velvet", "Eyelash lace trim", "Adjustable satin straps"]'::jsonb,
    true,
    true,
    true
  )
ON CONFLICT (id) DO NOTHING;

-- 4. Banners
INSERT INTO public.banners (id, title, image_url, mobile_image_url, link_url, display_order, is_active)
VALUES
  (
    'BAN-1',
    'Butterfly Lace Comfort & Posture Support',
    '/images/banners/banner_butterfly_posture_desktop.webp',
    '/images/banners/banner_butterfly_posture_mobile.webp',
    '/shop',
    1,
    true
  ),
  (
    'BAN-2',
    'Winter Cozy Plush Bunny Lingerie Sets',
    '/images/banners/banner_plush_bunny_desktop.webp',
    '/images/banners/banner_plush_bunny_mobile.webp',
    '/shop',
    2,
    true
  ),
  (
    'BAN-3',
    '100% Discreet Packaging & Cash on Delivery',
    '/images/banners/banner_discreet_delivery_desktop.webp',
    '/images/banners/banner_discreet_delivery_mobile.webp',
    '/shop',
    3,
    true
  )
ON CONFLICT (id) DO NOTHING;

-- 5. Site Settings
INSERT INTO public.site_settings (
  id, store_name, tagline, helpline_phone, whatsapp_number, email, warehouse_address,
  base_shipping_rate, free_shipping_threshold, cod_enabled,
  jazzcash_title, jazzcash_number, easypaisa_title, easypaisa_number,
  bank_name, bank_title, bank_iban
)
VALUES (
  'current',
  'Secret Petal',
  'Inner Beauty, Every Day',
  '0326-6228304',
  '0326-6228304',
  'secretpetal62@gmail.com',
  'Shahzada Shaheed Chuman Shah Road, Street No. 7, Gujranwala',
  200,
  2500,
  true,
  'Secret Petal Official',
  '0326-6228304',
  'Secret Petal Official',
  '0326-6228304',
  'Meezan Bank',
  'Secret Petal',
  'PK00MEZN0000000000000000'
)
ON CONFLICT (id) DO NOTHING;

-- 6. Initial Coupons
INSERT INTO public.coupons (id, code, discount_type, discount_value, min_spend, free_shipping, is_active)
VALUES
  ('CPN-1', 'SECRET300', 'fixed', 300, 2000, false, true),
  ('CPN-2', 'FREESHIP', 'fixed', 200, 2500, true, true),
  ('CPN-3', 'WELCOME10', 'percentage', 10, 1500, false, true)
ON CONFLICT (id) DO NOTHING;
