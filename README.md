# 🌸 Secret Petal — Premium Women's Undergarments & Lingerie E-Commerce Store

[![Next.js](https://img.shields.io/badge/Next.js-14.2.24-black?logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.17-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![Cloudflare Pages](https://img.shields.io/badge/Cloudflare_Pages-Ready-orange?logo=cloudflare)](https://pages.cloudflare.com/)
[![Node.js](https://img.shields.io/badge/Node.js-22.x-green?logo=node.js)](https://nodejs.org/)

A high-performance, mobile-first e-commerce web platform and comprehensive administrative backoffice for **Secret Petal** — Pakistan's premium women's lingerie, sleepwear, and everyday intimates brand.

Designed with a **Zero-Cost, Zero-Serverless Execution, Dual-Tier Persistence Architecture** optimized for Cloudflare Pages (Static Export) and Cloud Database synchronization.

---

## ✨ Features

- **🛍️ Storefront & User Experience**:
  - 100% Mobile-first responsive layout tailored for all smartphone viewports.
  - Category, collection, and tag-filtered catalog browsing.
  - Real-time product search with keyword autocomplete.
  - Wishlist and Persistent Cart with slide-out drawer.
  - Dynamic interactive Product Detail views with variant selection (sizes, colors, multi-angle gallery with zoom).
  - Quick checkout with automatic promo coupon codes (`SECRET300`, `FREESHIP`, `WELCOME10`), free shipping thresholds, and Cash on Delivery (COD) order placement.
  - Live Order Tracking (`/track-order`) with milestone timeline updates.

- **⚡ Zero-Load Architecture**:
  - Full Next.js Static Export (`output: 'export'`) resulting in 0ms serverless execution overhead and 0 egress fees.
  - Client-side Canvas WebP image compression prior to uploads (< 80KB per high-res photo).
  - Sub-millisecond static page delivery via Cloudflare's global edge network.

- **🛡️ Secure Admin Control Backoffice (`/admin`)**:
  - Master PIN & Password protection with show/hide password toggle.
  - **Products Manager**: Full CRUD, automatic slug generator, multi-image upload chips, comma-separated variant tags with live previews, and stock status toggles.
  - **Orders Manager**: Real-time status pipeline (Pending, Confirmed, Shipped, Delivered, Cancelled), customer contact links (Direct WhatsApp & Tel), and deletion controls.
  - **Coupons & Deals Manager**: Percentage and fixed discount codes, minimum order value gates, expiration tracking, and one-click coupon toggling.
  - **Categories & Tags Manager**: Dynamic subcategory and taxonomy mapping.
  - **Hero Banners & Announcement Bar Manager**: Update homepage headlines, promotions, and banner creative in real-time.

---

## 🚀 Cloudflare Pages Deployment Setup

### 1. Build & Output Settings
- **Framework Preset**: `Next.js (Static HTML Export)`
- **Build Command**: `npm run build`
- **Build Output Directory**: `out`
- **Root Directory**: `/`

### 2. Environment Variables in Cloudflare Pages
Add the following in **Settings > Environment Variables**:

| Variable Name | Value / Description |
|---|---|
| `NODE_VERSION` | `22` |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://abptftyzsxbnhkfqqtju.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | *(Your anon public key)* |
| `SUPABASE_SERVICE_ROLE_KEY` | *(Your service role secret key)* |
| `NEXT_PUBLIC_ADMIN_PIN` | `secretpetal_SecureLingerie#2026!786` |
| `NEXT_PUBLIC_SITE_URL` | `https://secretpetal.store` |

---

## 🛠️ Local Development

### Prerequisites
- Node.js 22.x or later
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/Digizier/secretpetal.git
cd secretpetal

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local
# (Fill in your credentials in .env.local)

# Run development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the storefront and [http://localhost:3000/admin](http://localhost:3000/admin) to access the Admin Control Backoffice.

---

## 📦 Production Static Build
```bash
npm run build
```
The static HTML export is emitted to the `/out` directory, ready for immediate Cloudflare Pages or any static CDN deployment.
