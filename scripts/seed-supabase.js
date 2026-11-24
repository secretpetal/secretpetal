const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://abptftyzsxbnhkfqqtju.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFicHRmdHl6c3hibmhrZnFxdGp1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTUyNDI5NzcsImV4cCI6MjExMDgxODk3N30.-6H2R_4BlTksGnjRjRI_QrZ6X5j_K5rMr7le4-idF6M'
);

const DEFAULT_SITE_SETTINGS = {
  id: 'current',
  store_name: 'Secret Petal',
  tagline: 'Inner Beauty, Every Day',
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

const DEFAULT_CATEGORIES = [
  { id: 'CAT-1', name: 'Comfort & Posture Bras', slug: 'comfort-posture-bras', image_url: '/images/products/c355ef86a15549c03989a4d67a7b406a.jpg.webp', show_in_top_categories: true, show_in_header: true, display_order: 1 },
  { id: 'CAT-2', name: 'Plush & Cozy Sets', slug: 'plush-cozy-sets', image_url: '/images/products/item_2026-08-27_at_4.55.32_pm_1.webp', show_in_top_categories: true, show_in_header: true, display_order: 2 },
  { id: 'CAT-3', name: 'Daily Cotton Bras', slug: 'daily-cotton-bras', image_url: '/images/products/item_2026-10-09_at_1.39.46_am.webp', show_in_top_categories: true, show_in_header: true, display_order: 3 },
  { id: 'CAT-4', name: 'Everyday Panties', slug: 'everyday-panties', image_url: '/images/products/item_2026-08-27_at_5.38.10_pm.webp', show_in_top_categories: true, show_in_header: true, display_order: 4 },
  { id: 'CAT-5', name: 'Bridal & Luxury Lace', slug: 'bridal-luxury-lace', image_url: '/images/products/item_2026-10-03_at_12.32.52_am.webp', show_in_top_categories: true, show_in_header: true, display_order: 5 },
  { id: 'CAT-6', name: 'Seamless Shapewear', slug: 'seamless-shapewear', image_url: '/images/products/item_2026-10-09_at_1.39.49_am_1_.webp', show_in_top_categories: true, show_in_header: true, display_order: 6 },
  { id: 'CAT-7', name: 'Flash Deals Clearance', slug: 'flash-deals-clearance', image_url: '/images/products/item_2026-10-09_at_1.39.48_am_2_.webp', show_in_top_categories: true, show_in_header: false, display_order: 7 }
];

const DEFAULT_SUBCATEGORIES = [
  { id: 'SUB-1', category_id: 'CAT-1', name: 'Butterfly Front-Closure', slug: 'butterfly-front-closure', display_order: 1 },
  { id: 'SUB-2', category_id: 'CAT-1', name: 'Wireless Posture Support', slug: 'wireless-posture-support', display_order: 2 },
  { id: 'SUB-3', category_id: 'CAT-2', name: 'Bunny Furry Sets', slug: 'bunny-furry-sets', display_order: 1 },
  { id: 'SUB-4', category_id: 'CAT-2', name: 'Velvet Lounge Sets', slug: 'velvet-lounge-sets', display_order: 2 },
  { id: 'SUB-5', category_id: 'CAT-3', name: 'Breathable Net Bras', slug: 'breathable-net-bras', display_order: 1 },
  { id: 'SUB-6', category_id: 'CAT-3', name: 'Teen & Starter Bras', slug: 'teen-starter-bras', display_order: 2 },
  { id: 'SUB-7', category_id: 'CAT-4', name: 'Seamless Laser-Cut', slug: 'seamless-laser-cut', display_order: 1 },
  { id: 'SUB-8', category_id: 'CAT-4', name: 'Pure Cotton Briefs', slug: 'pure-cotton-briefs', display_order: 2 }
];

const DEFAULT_BANNERS = [
  {
    id: 'BAN-1',
    title: 'Butterfly Lace Comfort & Posture Support',
    image_url: '/images/banners/banner_butterfly_posture_desktop.webp',
    mobile_image_url: '/images/banners/banner_butterfly_posture_mobile.webp',
    link_url: '/shop?cat=comfort-posture-bras',
    display_order: 1,
    is_active: true
  },
  {
    id: 'BAN-2',
    title: 'Winter Cozy Plush Bunny Lingerie Sets',
    image_url: '/images/banners/banner_plush_bunny_desktop.webp',
    mobile_image_url: '/images/banners/banner_plush_bunny_mobile.webp',
    link_url: '/shop?cat=plush-cozy-sets',
    display_order: 2,
    is_active: true
  },
  {
    id: 'BAN-3',
    title: '100% Discreet Packaging & Cash on Delivery',
    image_url: '/images/banners/banner_discreet_cod_desktop.webp',
    mobile_image_url: '/images/banners/banner_discreet_cod_mobile.webp',
    link_url: '/shop',
    display_order: 3,
    is_active: true
  }
];

const DEFAULT_COUPONS = [
  { id: 'CPN-1', code: 'SECRET300', discount_type: 'fixed', discount_value: 300, min_spend: 2000, free_shipping: false, is_active: true },
  { id: 'CPN-2', code: 'FREESHIP', discount_type: 'fixed', discount_value: 200, min_spend: 2500, free_shipping: true, is_active: true },
  { id: 'CPN-3', code: 'WELCOME10', discount_type: 'percentage', discount_value: 10, min_spend: 1500, free_shipping: false, is_active: true }
];

const DEFAULT_PRODUCTS = [
  {
    id: 'PROD-1',
    title: 'Butterfly Lace Front-Closure Wireless Posture Bra',
    slug: 'butterfly-lace-front-closure-wireless-posture-bra',
    sku: 'SP-BRA-001',
    category_id: 'CAT-1',
    subcategory_id: 'SUB-1',
    price: 2450,
    sale_price: 1850,
    stock: 35,
    thumbnail_url: '/images/products/c355ef86a15549c03989a4d67a7b406a.jpg.webp',
    gallery_urls: [
      '/images/products/c355ef86a15549c03989a4d67a7b406a.jpg.webp',
      '/images/products/item_2026-10-09_at_1.39.46_am.webp'
    ],
    has_sizes: true,
    sizes: [
      { name: '34B', price: 0 },
      { name: '36B', price: 0 },
      { name: '38B', price: 0 },
      { name: '40B', price: 100 },
      { name: '42B', price: 200 }
    ],
    has_colors: true,
    colors: [
      { name: 'Dusty Rose', price: 0 },
      { name: 'Classic Black', price: 0 },
      { name: 'Nude Skin', price: 0 }
    ],
    description: 'Experience effortless posture enhancement with our signature Butterfly Back design. Front clasp closure provides quick, painless wear without painful reaching behind.',
    features: [
      'Front-snap durable closure',
      'Posture correcting criss-cross back wing',
      'Wireless soft-cup comfort',
      'Breathable floral lace'
    ],
    is_featured: true,
    is_flash_deal: true,
    is_active: true
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
    has_sizes: true,
    sizes: [
      { name: 'Small', price: 0 },
      { name: 'Medium', price: 0 },
      { name: 'Large', price: 150 }
    ],
    has_colors: true,
    colors: [
      { name: 'Baby Pink', price: 0 },
      { name: 'Snow White', price: 0 }
    ],
    description: 'Ultra-soft plush fleece lingerie and sleepwear set with darling embroidered bunny face and soft elastic bands.',
    features: [
      'Plush faux-fur velvet touch',
      'Comfort-stretch gentle waistband',
      'Adorable embroidered ears and carrot accents',
      'Double lined cotton crotch gusset'
    ],
    is_featured: true,
    is_flash_deal: true,
    is_active: true
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
    has_sizes: true,
    sizes: [
      { name: '32B', price: 0 },
      { name: '34B', price: 0 },
      { name: '36B', price: 0 },
      { name: '38B', price: 0 },
      { name: '40B', price: 100 }
    ],
    has_colors: true,
    colors: [
      { name: 'Soft Pink', price: 0 },
      { name: 'Nude Skin', price: 0 },
      { name: 'Lavender Grey', price: 0 }
    ],
    description: 'Your everyday go-to seamless bra. Zero seams, buttery soft microfibre fabric that leaves no lines under eastern lawn kurtas or western tees.',
    features: [
      'Invisible under tight clothes',
      'Molded wireless foam cups',
      'Non-slip wide adjustable shoulder straps',
      'Sweat-wicking cooling fabric'
    ],
    is_featured: true,
    is_flash_deal: false,
    is_active: true
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
    has_sizes: true,
    sizes: [
      { name: '34C', price: 0 },
      { name: '36C', price: 0 },
      { name: '38C', price: 0 },
      { name: '40C', price: 100 },
      { name: '42C', price: 200 }
    ],
    has_colors: true,
    colors: [
      { name: 'Mint Green', price: 0 },
      { name: 'Rose Coral', price: 0 },
      { name: 'Midnight Black', price: 0 }
    ],
    description: 'Butterfly winged back panels provide gentle compression across the upper back and shoulder blades to naturally align spine posture.',
    features: [
      'X-cross reinforced back posture bands',
      'Wide supportive side wings',
      'Front hook closure with 3 adjustment levels',
      'Lace trim feminine finish'
    ],
    is_featured: true,
    is_flash_deal: true,
    is_active: true
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
    has_sizes: true,
    sizes: [
      { name: 'Small', price: 0 },
      { name: 'Medium', price: 0 },
      { name: 'Large', price: 0 },
      { name: 'XL', price: 100 }
    ],
    has_colors: true,
    colors: [
      { name: 'Multi Pastel Pack', price: 0 },
      { name: 'All Nude Pack', price: 0 }
    ],
    description: 'Made from 95% combed cotton and 5% elastane for complete breathability during humid weather.',
    features: [
      '95% Combed organic cotton',
      'Full rear coverage fit',
      'Anti-chafing flatlock seams',
      'Breathable natural hygiene'
    ],
    is_featured: true,
    is_flash_deal: false,
    is_active: true
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
    has_sizes: true,
    sizes: [
      { name: 'Medium', price: 0 },
      { name: 'Large', price: 0 },
      { name: 'XL', price: 100 },
      { name: '2XL', price: 200 }
    ],
    has_colors: true,
    colors: [
      { name: 'Nude Beige', price: 0 },
      { name: 'Jet Black', price: 0 }
    ],
    description: 'Discreetly flattens the tummy and sculpts the waistline for dresses, party wear, and lawn suits without rolling down.',
    features: [
      'Anti-roll silicone grip band',
      'Medium firm compression',
      'Cotton gusset lining',
      'Zero panty lines'
    ],
    is_featured: true,
    is_flash_deal: false,
    is_active: true
  },
  {
    id: 'PROD-7',
    title: 'Air-Net Breathable Summer Bra',
    slug: 'air-net-breathable-summer-bra',
    sku: 'SP-BRA-007',
    category_id: 'CAT-3',
    subcategory_id: 'SUB-5',
    price: 1750,
    sale_price: 1299,
    stock: 40,
    thumbnail_url: '/images/products/item_2026-10-09_at_1.39.46_am.webp',
    gallery_urls: [
      '/images/products/item_2026-10-09_at_1.39.46_am.webp'
    ],
    has_sizes: true,
    sizes: [
      { name: '32B', price: 0 },
      { name: '34B', price: 0 },
      { name: '36B', price: 0 },
      { name: '38B', price: 0 }
    ],
    has_colors: true,
    colors: [
      { name: 'White Cloud', price: 0 },
      { name: 'Baby Pink', price: 0 },
      { name: 'Sky Blue', price: 0 }
    ],
    description: 'Engineered for Pakistani hot summers. Micro-mesh ventilation holes allow continuous airflow, keeping underbust completely dry.',
    features: [
      'Micro-mesh ventilated cups',
      'Light non-padded double layer',
      'Gentle elastic underbust',
      'Anti-heat rash fabric'
    ],
    is_featured: true,
    is_flash_deal: false,
    is_active: true
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
    has_sizes: true,
    sizes: [
      { name: 'Small', price: 0 },
      { name: 'Medium', price: 0 },
      { name: 'Large', price: 150 }
    ],
    has_colors: true,
    colors: [
      { name: 'Rose Wine', price: 0 },
      { name: 'Emerald Night', price: 0 }
    ],
    description: 'Two-piece velvet cami and shorts intimate loungewear set. Trimmed with soft eyelash lace along neckline and leg hems.',
    features: [
      'Deep crushed velvet sheen',
      'French scalloped lace trims',
      'Adjustable satin spaghetti straps',
      'Flattering drape fit'
    ],
    is_featured: true,
    is_flash_deal: false,
    is_active: true
  }
];

async function seed() {
  console.log('Seeding site_settings...');
  const { error: setErr } = await supabase.from('site_settings').upsert(DEFAULT_SITE_SETTINGS);
  if (setErr) console.error('Settings error:', setErr.message);
  else console.log('Settings seeded successfully!');

  console.log('Seeding categories...');
  const { error: catErr } = await supabase.from('categories').upsert(DEFAULT_CATEGORIES);
  if (catErr) console.error('Categories error:', catErr.message);
  else console.log('Categories seeded successfully!');

  console.log('Seeding subcategories...');
  const { error: subErr } = await supabase.from('subcategories').upsert(DEFAULT_SUBCATEGORIES);
  if (subErr) console.error('Subcategories error:', subErr.message);
  else console.log('Subcategories seeded successfully!');

  console.log('Seeding banners...');
  const { error: banErr } = await supabase.from('banners').upsert(DEFAULT_BANNERS);
  if (banErr) console.error('Banners error:', banErr.message);
  else console.log('Banners seeded successfully!');

  console.log('Seeding coupons...');
  const { error: cpnErr } = await supabase.from('coupons').upsert(DEFAULT_COUPONS);
  if (cpnErr) console.error('Coupons error:', cpnErr.message);
  else console.log('Coupons seeded successfully!');

  console.log('Seeding products...');
  const { error: prodErr } = await supabase.from('products').upsert(DEFAULT_PRODUCTS);
  if (prodErr) console.error('Products error:', prodErr.message);
  else console.log('Products seeded successfully!');

  console.log('--- ALL SEEDING COMPLETE ---');
}

seed().catch(console.error);
