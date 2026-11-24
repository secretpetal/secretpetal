const { Client } = require('pg');
const { createClient } = require('@supabase/supabase-js');

const pw = encodeURIComponent('2sVigRgE-k.uMzK');
const connStr = `postgres://postgres.abptftyzsxbnhkfqqtju:${pw}@aws-1-ap-southeast-1.pooler.supabase.com:5432/postgres`;

const SCHEMA_SQL = `
-- 1. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  image_url TEXT,
  show_in_top_categories BOOLEAN DEFAULT TRUE,
  show_in_header BOOLEAN DEFAULT TRUE,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure show_in_header column exists if table already existed
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name='categories' AND column_name='show_in_header') THEN
    ALTER TABLE public.categories ADD COLUMN show_in_header BOOLEAN DEFAULT TRUE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_categories_slug ON public.categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_top ON public.categories(show_in_top_categories);
CREATE INDEX IF NOT EXISTS idx_categories_order ON public.categories(display_order ASC);

-- 2. SUBCATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.subcategories (
  id TEXT PRIMARY KEY,
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
  id TEXT PRIMARY KEY,
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
  has_sizes BOOLEAN DEFAULT TRUE,
  sizes JSONB DEFAULT '[]'::jsonb,
  has_colors BOOLEAN DEFAULT TRUE,
  colors JSONB DEFAULT '[]'::jsonb,
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
CREATE INDEX IF NOT EXISTS idx_products_featured ON public.products(is_featured);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active);

-- 4. BANNERS TABLE
CREATE TABLE IF NOT EXISTS public.banners (
  id TEXT PRIMARY KEY,
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

-- 5. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
  id TEXT PRIMARY KEY,
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
  payment_method TEXT DEFAULT 'cod',
  payment_status TEXT DEFAULT 'pending',
  payment_screenshot_url TEXT,
  order_status TEXT DEFAULT 'Pending',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_number ON public.orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created ON public.orders(created_at DESC);

-- 6. COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  discount_type TEXT NOT NULL DEFAULT 'fixed',
  discount_value NUMERIC NOT NULL DEFAULT 300,
  min_spend NUMERIC DEFAULT 1500,
  free_shipping BOOLEAN DEFAULT FALSE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_coupons_code ON public.coupons(code);

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

-- PERMISSIONS & RLS
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subcategories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Clean recreate policies
DO $$
BEGIN
  -- categories
  DROP POLICY IF EXISTS "Public read categories" ON public.categories;
  DROP POLICY IF EXISTS "Admin manage categories" ON public.categories;
  CREATE POLICY "Public read categories" ON public.categories FOR SELECT USING (true);
  CREATE POLICY "Admin manage categories" ON public.categories FOR ALL USING (true) WITH CHECK (true);

  -- subcategories
  DROP POLICY IF EXISTS "Public read subcategories" ON public.subcategories;
  DROP POLICY IF EXISTS "Admin manage subcategories" ON public.subcategories;
  CREATE POLICY "Public read subcategories" ON public.subcategories FOR SELECT USING (true);
  CREATE POLICY "Admin manage subcategories" ON public.subcategories FOR ALL USING (true) WITH CHECK (true);

  -- products
  DROP POLICY IF EXISTS "Public read active products" ON public.products;
  DROP POLICY IF EXISTS "Admin manage products" ON public.products;
  CREATE POLICY "Public read active products" ON public.products FOR SELECT USING (true);
  CREATE POLICY "Admin manage products" ON public.products FOR ALL USING (true) WITH CHECK (true);

  -- banners
  DROP POLICY IF EXISTS "Public read banners" ON public.banners;
  DROP POLICY IF EXISTS "Admin manage banners" ON public.banners;
  CREATE POLICY "Public read banners" ON public.banners FOR SELECT USING (true);
  CREATE POLICY "Admin manage banners" ON public.banners FOR ALL USING (true) WITH CHECK (true);

  -- orders
  DROP POLICY IF EXISTS "Public read orders" ON public.orders;
  DROP POLICY IF EXISTS "Admin manage orders" ON public.orders;
  CREATE POLICY "Public read orders" ON public.orders FOR SELECT USING (true);
  CREATE POLICY "Admin manage orders" ON public.orders FOR ALL USING (true) WITH CHECK (true);

  -- coupons
  DROP POLICY IF EXISTS "Public read coupons" ON public.coupons;
  DROP POLICY IF EXISTS "Admin manage coupons" ON public.coupons;
  CREATE POLICY "Public read coupons" ON public.coupons FOR SELECT USING (true);
  CREATE POLICY "Admin manage coupons" ON public.coupons FOR ALL USING (true) WITH CHECK (true);

  -- site_settings
  DROP POLICY IF EXISTS "Public read settings" ON public.site_settings;
  DROP POLICY IF EXISTS "Admin manage settings" ON public.site_settings;
  CREATE POLICY "Public read settings" ON public.site_settings FOR SELECT USING (true);
  CREATE POLICY "Admin manage settings" ON public.site_settings FOR ALL USING (true) WITH CHECK (true);
END $$;

-- Enable Realtime
DO $$
BEGIN
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
  EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
  EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.subcategories;
  EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.banners;
  EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.coupons;
  EXCEPTION WHEN OTHERS THEN NULL; END;
  BEGIN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.site_settings;
  EXCEPTION WHEN OTHERS THEN NULL; END;
END $$;
`;

async function run() {
  console.log('Connecting to PostgreSQL...');
  const pgClient = new Client({ connectionString: connStr, ssl: { rejectUnauthorized: false } });
  await pgClient.connect();
  console.log('Connected! Executing schema DDL...');

  await pgClient.query(SCHEMA_SQL);
  console.log('Schema DDL executed successfully!');

  await pgClient.end();

  // Test PostgREST
  console.log('Checking PostgREST visibility with Anon key...');
  const supabase = createClient(
    'https://abptftyzsxbnhkfqqtju.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFicHRmdHl6c3hibmhrZnFxdGp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUyNDI5NzcsImV4cCI6MjExMDgxODk3N30.-6H2R_4BlTksGnjRjRI_QrZ6X5j_K5rMr7le4-idF6M'
  );

  for (const tbl of ['categories', 'subcategories', 'products', 'banners', 'orders', 'coupons', 'site_settings']) {
    const { data, error } = await supabase.from(tbl).select('*');
    if (error) {
      console.error(`PostgREST error on ${tbl}:`, error.message);
    } else {
      console.log(`PostgREST ${tbl} OK (row count: ${data.length})`);
    }
  }
}

run().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});

// Reload and re-check categories
async function reloadPostgrest() {
  const pgClient = new Client({ connectionString: connStr, ssl: { rejectUnauthorized: false } });
  await pgClient.connect();
  await pgClient.query("NOTIFY pgrst, 'reload schema';");
  await pgClient.query("NOTIFY pgrst, 'reload config';");
  console.log('PostgREST cache reload notified!');
  await pgClient.end();

  await new Promise(r => setTimeout(r, 2000));
  const supabase = createClient(
    'https://abptftyzsxbnhkfqqtju.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFicHRmdHl6c3hibmhrZnFxdGp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUyNDI5NzcsImV4cCI6MjExMDgxODk3N30.-6H2R_4BlTksGnjRjRI_QrZ6X5j_K5rMr7le4-idF6M'
  );

  const { data, error } = await supabase.from('categories').select('*');
  if (error) {
    console.log('Categories re-check error:', error.message);
  } else {
    console.log('Categories re-check OK, count:', data.length);
  }
}
reloadPostgrest();
