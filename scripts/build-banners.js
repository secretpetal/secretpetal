const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const AI_BANNER_IMG = 'C:/Users/NB LAPTOP/.gemini/antigravity/brain/753b717b-4710-48a8-9833-915a85b940a2/butterfly_lace_bra_banner_1795274858350.jpg';
const BUNNY_IMG = 'Reference Data/c355ef86a15549c03989a4d67a7b406a.jpg.jpeg';
const LOGO_PNG = 'Reference Data/secretpetal_logo_transparent.png';
const OUT_DIR = 'public/images/banners';

if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// Helper: Create rounded rectangle mask for compositing
function getRoundedMask(width, height, radius = 24) {
  return Buffer.from(`
    <svg width="${width}" height="${height}">
      <rect x="0" y="0" width="${width}" height="${height}" rx="${radius}" ry="${radius}" fill="#fff" />
    </svg>
  `);
}

async function createBanners() {
  console.log('Building high-quality banners for Secret Petal...');

  // ========================================================
  // BANNER 1: Butterfly Lace Comfort & Posture Bra
  // ========================================================
  console.log('Generating Banner 1 (Butterfly Lace Posture Bra)...');
  
  // 1A. Desktop (1920x600)
  const b1PhotoW = 760;
  const b1PhotoH = 500;
  const b1Mask = getRoundedMask(b1PhotoW, b1PhotoH, 28);

  const b1Cutout = await sharp(AI_BANNER_IMG)
    .resize(b1PhotoW, b1PhotoH, { fit: 'cover', position: 'center' })
    .composite([{ input: b1Mask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const b1DesktopSvg = `
    <svg width="1920" height="600" viewBox="0 0 1920 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="b1Grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#4A0E17"/>
          <stop offset="50%" stop-color="#33070E"/>
          <stop offset="100%" stop-color="#1F0408"/>
        </linearGradient>
        <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#FCD34D"/>
          <stop offset="100%" stop-color="#FBCFE8"/>
        </linearGradient>
        <filter id="shadow" x="-5%" y="-5%" width="115%" height="115%">
          <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000" flood-opacity="0.45"/>
        </filter>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="60" result="blur" />
        </filter>
      </defs>

      <!-- Base Gradient -->
      <rect width="1920" height="600" fill="url(#b1Grad)"/>

      <!-- Ambient Glow Circles -->
      <circle cx="1400" cy="300" r="280" fill="#E11D48" opacity="0.18" filter="url(#glow)"/>
      <circle cx="200" cy="150" r="220" fill="#BE123C" opacity="0.15" filter="url(#glow)"/>
      
      <!-- Decorative Petal Curve -->
      <path d="M0,600 C600,550 800,200 1200,600 Z" fill="#ffffff" opacity="0.02"/>

      <!-- Left Content Column -->
      <g transform="translate(140, 0)">
        <!-- Tag Pill -->
        <rect x="0" y="115" width="260" height="36" rx="18" fill="rgba(244, 63, 94, 0.2)" stroke="#F43F5E" stroke-width="1.5"/>
        <text x="22" y="138" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="700" fill="#FECDD3" letter-spacing="2">
          🌸 SECRET PETAL EXCLUSIVE
        </text>

        <!-- Main Title -->
        <text x="0" y="225" font-family="'Playfair Display', Georgia, serif" font-size="48" font-weight="700" fill="#FFFFFF">
          Butterfly Lace Comfort &amp;
        </text>
        <text x="0" y="285" font-family="'Playfair Display', Georgia, serif" font-size="48" font-weight="700" fill="url(#goldGrad)">
          Posture Support Bra
        </text>

        <!-- Subtitle Points -->
        <text x="0" y="340" font-family="'Plus Jakarta Sans', sans-serif" font-size="18" font-weight="400" fill="#FCE7F3" opacity="0.9">
          Wireless Ease • Criss-Cross Posture Back • Elegant Wing Embroidery
        </text>

        <!-- Guarantee Pill & Price -->
        <g transform="translate(0, 380)">
          <rect x="0" y="0" width="140" height="38" rx="8" fill="#E11D48"/>
          <text x="18" y="24" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="700" fill="#FFFFFF">
            Rs. 1,650
          </text>
          <text x="155" y="24" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" text-decoration="line-through" fill="#FDA4AF" opacity="0.75">
            Rs. 2,400
          </text>
          <rect x="245" y="2" width="75" height="32" rx="6" fill="rgba(255,255,255,0.15)"/>
          <text x="257" y="22" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="700" fill="#FEE2E2">
            -31% OFF
          </text>
        </g>

        <!-- Call to Action Button Pill -->
        <g transform="translate(0, 450)">
          <rect x="0" y="0" width="220" height="52" rx="26" fill="#FFFFFF" filter="url(#shadow)"/>
          <text x="42" y="33" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="700" fill="#881337">
            Shop Collection  →
          </text>
        </g>
      </g>

      <!-- Right Photo Frame Border & Outer Rim -->
      <rect x="1036" y="46" width="${b1PhotoW + 8}" height="${b1PhotoH + 8}" rx="32" fill="none" stroke="rgba(255, 255, 255, 0.25)" stroke-width="2"/>
    </svg>
  `;

  await sharp(Buffer.from(b1DesktopSvg))
    .composite([
      {
        input: b1Cutout,
        top: 50,
        left: 1040
      }
    ])
    .webp({ quality: 85 })
    .toFile(path.join(OUT_DIR, 'banner_butterfly_posture_desktop.webp'));

  // 1B. Mobile (800x600)
  const b1MobPhotoW = 720;
  const b1MobPhotoH = 340;
  const b1MobMask = getRoundedMask(b1MobPhotoW, b1MobPhotoH, 20);

  const b1MobCutout = await sharp(AI_BANNER_IMG)
    .resize(b1MobPhotoW, b1MobPhotoH, { fit: 'cover', position: 'center' })
    .composite([{ input: b1MobMask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const b1MobileSvg = `
    <svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="b1MobGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#4A0E17"/>
          <stop offset="60%" stop-color="#2D080E"/>
          <stop offset="100%" stop-color="#1A0307"/>
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#b1MobGrad)"/>

      <!-- Top Text -->
      <g transform="translate(40, 25)">
        <rect x="0" y="0" width="220" height="28" rx="14" fill="rgba(244, 63, 94, 0.25)" stroke="#F43F5E"/>
        <text x="14" y="18" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="700" fill="#FECDD3" letter-spacing="1">
          🌸 SECRET PETAL EXCLUSIVE
        </text>
      </g>

      <!-- Bottom Content Area -->
      <g transform="translate(40, 430)">
        <text x="0" y="32" font-family="'Playfair Display', Georgia, serif" font-size="30" font-weight="700" fill="#FFFFFF">
          Butterfly Lace Posture Bra
        </text>
        <text x="0" y="65" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="400" fill="#FDA4AF">
          Wireless Ease • Criss-Cross Posture Support • Rs. 1,650
        </text>

        <!-- CTA Button -->
        <g transform="translate(0, 85)">
          <rect x="0" y="0" width="720" height="48" rx="14" fill="#FFFFFF"/>
          <text x="290" y="30" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="700" fill="#881337">
            Shop Collection  →
          </text>
        </g>
      </g>
    </svg>
  `;

  await sharp(Buffer.from(b1MobileSvg))
    .composite([
      {
        input: b1MobCutout,
        top: 70,
        left: 40
      }
    ])
    .webp({ quality: 85 })
    .toFile(path.join(OUT_DIR, 'banner_butterfly_posture_mobile.webp'));

  // ========================================================
  // BANNER 2: Winter Cozy Plush Bunny Intimates
  // ========================================================
  console.log('Generating Banner 2 (Winter Cozy Plush Bunny)...');
  const b2PhotoW = 760;
  const b2PhotoH = 500;
  const b2Mask = getRoundedMask(b2PhotoW, b2PhotoH, 28);

  const b2Cutout = await sharp(BUNNY_IMG)
    .resize(b2PhotoW, b2PhotoH, { fit: 'cover', position: 'center' })
    .composite([{ input: b2Mask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const b2DesktopSvg = `
    <svg width="1920" height="600" viewBox="0 0 1920 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="b2Grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#3B0818"/>
          <stop offset="50%" stop-color="#24050F"/>
          <stop offset="100%" stop-color="#140208"/>
        </linearGradient>
        <linearGradient id="roseGlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#FDA4AF"/>
          <stop offset="100%" stop-color="#FFE4E6"/>
        </linearGradient>
      </defs>

      <rect width="1920" height="600" fill="url(#b2Grad)"/>
      <circle cx="1450" cy="300" r="300" fill="#F43F5E" opacity="0.14"/>

      <g transform="translate(140, 0)">
        <rect x="0" y="115" width="240" height="36" rx="18" fill="rgba(251, 113, 133, 0.2)" stroke="#FB7185" stroke-width="1.5"/>
        <text x="20" y="138" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="700" fill="#FFE4E6" letter-spacing="2">
          🐰 WINTER COZY DROP
        </text>

        <text x="0" y="225" font-family="'Playfair Display', Georgia, serif" font-size="48" font-weight="700" fill="#FFFFFF">
          Cute Plush Bunny &amp; Bear
        </text>
        <text x="0" y="285" font-family="'Playfair Display', Georgia, serif" font-size="48" font-weight="700" fill="url(#roseGlow)">
          Furry Intimate Lounge Sets
        </text>

        <text x="0" y="340" font-family="'Plus Jakarta Sans', sans-serif" font-size="18" font-weight="400" fill="#FFE4E6" opacity="0.9">
          Ultra-Soft Furry Velvet Touch • Playful Ears Detail • Cozy Nights
        </text>

        <g transform="translate(0, 380)">
          <rect x="0" y="0" width="140" height="38" rx="8" fill="#BE123C"/>
          <text x="18" y="24" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="700" fill="#FFFFFF">
            Rs. 2,750
          </text>
          <text x="155" y="24" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" text-decoration="line-through" fill="#FDA4AF" opacity="0.75">
            Rs. 3,500
          </text>
          <rect x="245" y="2" width="75" height="32" rx="6" fill="rgba(255,255,255,0.15)"/>
          <text x="257" y="22" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="700" fill="#FEE2E2">
            -21% OFF
          </text>
        </g>

        <g transform="translate(0, 450)">
          <rect x="0" y="0" width="220" height="52" rx="26" fill="#FFFFFF"/>
          <text x="44" y="33" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="700" fill="#881337">
            Explore Sets  →
          </text>
        </g>
      </g>

      <rect x="1036" y="46" width="${b2PhotoW + 8}" height="${b2PhotoH + 8}" rx="32" fill="none" stroke="rgba(255, 255, 255, 0.2)" stroke-width="2"/>
    </svg>
  `;

  await sharp(Buffer.from(b2DesktopSvg))
    .composite([
      {
        input: b2Cutout,
        top: 50,
        left: 1040
      }
    ])
    .webp({ quality: 85 })
    .toFile(path.join(OUT_DIR, 'banner_plush_bunny_desktop.webp'));

  // 2B. Mobile
  const b2MobPhotoW = 720;
  const b2MobPhotoH = 340;
  const b2MobMask = getRoundedMask(b2MobPhotoW, b2MobPhotoH, 20);

  const b2MobCutout = await sharp(BUNNY_IMG)
    .resize(b2MobPhotoW, b2MobPhotoH, { fit: 'cover', position: 'center' })
    .composite([{ input: b2MobMask, blend: 'dest-in' }])
    .png()
    .toBuffer();

  const b2MobileSvg = `
    <svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="b2MobGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#3B0818"/>
          <stop offset="60%" stop-color="#24050F"/>
          <stop offset="100%" stop-color="#140208"/>
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#b2MobGrad)"/>

      <g transform="translate(40, 25)">
        <rect x="0" y="0" width="200" height="28" rx="14" fill="rgba(251, 113, 133, 0.25)" stroke="#FB7185"/>
        <text x="14" y="18" font-family="'Plus Jakarta Sans', sans-serif" font-size="11" font-weight="700" fill="#FFE4E6" letter-spacing="1">
          🐰 WINTER COZY DROP
        </text>
      </g>

      <g transform="translate(40, 430)">
        <text x="0" y="32" font-family="'Playfair Display', Georgia, serif" font-size="30" font-weight="700" fill="#FFFFFF">
          Cute Plush Bunny Lounge Set
        </text>
        <text x="0" y="65" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="400" fill="#FDA4AF">
          Ultra-Soft Furry Velvet • Rs. 2,750 (21% OFF)
        </text>

        <g transform="translate(0, 85)">
          <rect x="0" y="0" width="720" height="48" rx="14" fill="#FFFFFF"/>
          <text x="300" y="30" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="700" fill="#881337">
            Explore Sets  →
          </text>
        </g>
      </g>
    </svg>
  `;

  await sharp(Buffer.from(b2MobileSvg))
    .composite([
      {
        input: b2MobCutout,
        top: 70,
        left: 40
      }
    ])
    .webp({ quality: 85 })
    .toFile(path.join(OUT_DIR, 'banner_plush_bunny_mobile.webp'));

  // ========================================================
  // BANNER 3: 100% Discreet Packaging & Cash on Delivery
  // ========================================================
  console.log('Generating Banner 3 (Discreet Packaging)...');
  const b3DesktopSvg = `
    <svg width="1920" height="600" viewBox="0 0 1920 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="b3Grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#2D0814"/>
          <stop offset="50%" stop-color="#1F040C"/>
          <stop offset="100%" stop-color="#120106"/>
        </linearGradient>
      </defs>

      <rect width="1920" height="600" fill="url(#b3Grad)"/>

      <!-- Center-Aligned Luxury Content -->
      <g transform="translate(960, 0)" text-anchor="middle">
        <rect x="-140" y="90" width="280" height="38" rx="19" fill="rgba(16, 185, 129, 0.15)" stroke="#10B981" stroke-width="1.5"/>
        <text x="0" y="114" font-family="'Plus Jakarta Sans', sans-serif" font-size="13" font-weight="700" fill="#6EE7B7" letter-spacing="2">
          🛡️ 100% PRIVACY GUARANTEED
        </text>

        <text x="0" y="200" font-family="'Playfair Display', Georgia, serif" font-size="52" font-weight="700" fill="#FFFFFF">
          100% Discreet Packaging
        </text>
        <text x="0" y="260" font-family="'Playfair Display', Georgia, serif" font-size="44" font-weight="700" fill="#FDA4AF">
          &amp; Cash on Delivery Across Pakistan
        </text>

        <text x="0" y="315" font-family="'Plus Jakarta Sans', sans-serif" font-size="18" font-weight="400" fill="#E2E8F0" opacity="0.9">
          Completely sealed plain box • Zero intimate mention on outer label • Total peace of mind
        </text>

        <!-- 3 Feature Chips -->
        <g transform="translate(-450, 360)" text-anchor="start">
          <!-- Chip 1 -->
          <g transform="translate(0, 0)">
            <rect x="0" y="0" width="280" height="54" rx="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)"/>
            <text x="20" y="32" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="600" fill="#FFFFFF">
              📦 Sealed Plain Carton Box
            </text>
          </g>
          <!-- Chip 2 -->
          <g transform="translate(310, 0)">
            <rect x="0" y="0" width="280" height="54" rx="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)"/>
            <text x="20" y="32" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="600" fill="#FFFFFF">
              💵 Cash on Delivery (COD)
            </text>
          </g>
          <!-- Chip 3 -->
          <g transform="translate(620, 0)">
            <rect x="0" y="0" width="280" height="54" rx="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)"/>
            <text x="20" y="32" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="600" fill="#FFFFFF">
              🔄 7-Day Hassle-Free Exchange
            </text>
          </g>
        </g>

        <!-- CTA Button -->
        <g transform="translate(0, 460)">
          <rect x="-110" y="0" width="220" height="50" rx="25" fill="#FFFFFF"/>
          <text x="0" y="31" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="700" fill="#881337">
            Shop with Privacy  →
          </text>
        </g>
      </g>
    </svg>
  `;

  await sharp(Buffer.from(b3DesktopSvg))
    .webp({ quality: 85 })
    .toFile(path.join(OUT_DIR, 'banner_discreet_delivery_desktop.webp'));

  // 3B. Mobile
  const b3MobileSvg = `
    <svg width="800" height="600" viewBox="0 0 800 600" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="b3MobGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#2D0814"/>
          <stop offset="100%" stop-color="#120106"/>
        </linearGradient>
      </defs>
      <rect width="800" height="600" fill="url(#b3MobGrad)"/>

      <g transform="translate(400, 40)" text-anchor="middle">
        <rect x="-130" y="0" width="260" height="32" rx="16" fill="rgba(16, 185, 129, 0.15)" stroke="#10B981"/>
        <text x="0" y="21" font-family="'Plus Jakarta Sans', sans-serif" font-size="12" font-weight="700" fill="#6EE7B7" letter-spacing="1">
          🛡️ 100% PRIVACY GUARANTEED
        </text>

        <text x="0" y="110" font-family="'Playfair Display', Georgia, serif" font-size="34" font-weight="700" fill="#FFFFFF">
          100% Discreet Packaging
        </text>
        <text x="0" y="155" font-family="'Playfair Display', Georgia, serif" font-size="28" font-weight="700" fill="#FDA4AF">
          &amp; Cash on Delivery
        </text>

        <text x="0" y="210" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="400" fill="#E2E8F0" opacity="0.9">
          Plain sealed box with zero intimate words on label.
        </text>
      </g>

      <g transform="translate(60, 270)">
        <rect x="0" y="0" width="680" height="52" rx="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)"/>
        <text x="25" y="32" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="600" fill="#FFFFFF">
          📦 Sealed Plain Box (Zero Intimate Mention)
        </text>

        <rect x="0" y="68" width="680" height="52" rx="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)"/>
        <text x="25" y="100" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="600" fill="#FFFFFF">
          💵 Cash on Delivery Across Pakistan
        </text>

        <rect x="0" y="136" width="680" height="52" rx="14" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.15)"/>
        <text x="25" y="168" font-family="'Plus Jakarta Sans', sans-serif" font-size="14" font-weight="600" fill="#FFFFFF">
          🔄 7-Day Size Exchange Guarantee
        </text>
      </g>

      <g transform="translate(60, 500)">
        <rect x="0" y="0" width="680" height="52" rx="14" fill="#FFFFFF"/>
        <text x="260" y="32" font-family="'Plus Jakarta Sans', sans-serif" font-size="15" font-weight="700" fill="#881337">
          Shop with Privacy  →
        </text>
      </g>
    </svg>
  `;

  await sharp(Buffer.from(b3MobileSvg))
    .webp({ quality: 85 })
    .toFile(path.join(OUT_DIR, 'banner_discreet_delivery_mobile.webp'));

  console.log('All banners successfully created in WebP format!');
}

createBanners().catch(console.error);
