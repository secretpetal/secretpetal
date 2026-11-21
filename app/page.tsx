'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Sparkles, ArrowRight, ShieldCheck, Zap, Heart, CheckCircle2 } from 'lucide-react';
import HeroBanners from '@/components/HeroBanners';
import TopCategoriesTicker from '@/components/TopCategoriesTicker';
import BrandTicker from '@/components/BrandTicker';
import ProductCard from '@/components/ProductCard';
import { ProductCardSkeleton } from '@/components/FlashSkeleton';
import { Product } from '@/lib/types';
import { getProducts } from '@/lib/db';

export default function HomePage() {
  const [flashDeals, setFlashDeals] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [flash, prods] = await Promise.all([
          getProducts({ isFlashDeal: true, limit: 4 }),
          getProducts({ limit: 8 }),
        ]);
        setFlashDeals(flash);
        setFeaturedProducts(prods);
      } catch (e) {
        console.error('Error loading products:', e);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Banners (Pure Responsive Images) */}
      <HeroBanners />

      {/* 2. Top Categories Marquee (2.5 items mobile view) */}
      <TopCategoriesTicker />

      {/* 3. Flash Deals Section (Strictly 4 top products in 2-column mobile grid) */}
      <section className="py-6 sm:py-10 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
                <Zap className="w-5 h-5 fill-amber-500 stroke-amber-500" />
              </div>
              <div>
                <span className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-amber-600">
                  Limited Time Offers
                </span>
                <h2 className="font-serif font-bold text-lg sm:text-2xl text-gray-900">
                  ⚡ Flash Deals
                </h2>
              </div>
            </div>

            <Link
              href="/flash-deals"
              className="flex items-center gap-1 text-xs sm:text-sm font-semibold text-burgundy hover:text-burgundy-900 transition-colors bg-blush-50 px-3 py-1.5 rounded-lg border border-rose-200"
            >
              <span>View All (4)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
              {[1, 2, 3, 4].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
              {flashDeals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. Brand Guarantees Ticker */}
      <BrandTicker />

      {/* 5. Featured Collection (Strictly 8 products on Homepage) */}
      <section className="py-6 sm:py-10 bg-blush-50/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-4 sm:mb-6 gap-2">
            <div>
              <span className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-burgundy">
                Handpicked Favorites
              </span>
              <h2 className="font-serif font-bold text-lg sm:text-2xl text-gray-900">
                Trending Intimate Wear
              </h2>
            </div>
            <p className="text-xs text-gray-500 max-w-sm">
              Explore our best-rated wireless posture bras, everyday cotton comfort, and cozy loungewear sets.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
              {featuredProducts.slice(0, 8).map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {/* Redirect to All Products page */}
          <div className="mt-8 text-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 px-6 py-3 bg-burgundy hover:bg-burgundy-900 text-white font-medium text-xs sm:text-sm rounded-xl transition-all shadow-md hover:shadow-lg"
            >
              <span>Explore All Products in Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Discreet Packaging & Privacy Assurance Box */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="bg-gradient-to-br from-burgundy-900 to-burgundy p-6 sm:p-8 rounded-2xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl text-center md:text-left">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/10 rounded-full text-xs font-semibold text-rose-200 border border-white/15">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                100% Privacy Protection
              </span>
              <h3 className="font-serif font-bold text-xl sm:text-3xl leading-tight">
                Discreet Delivery to Your Doorstep
              </h3>
              <p className="text-xs sm:text-sm text-rose-100/90 leading-relaxed">
                We understand that privacy is paramount. Every Secret Petal order is shipped in a completely sealed, plain brown box or opaque flyer with <strong>zero mention of underwear, lingerie, or intimate garments</strong> on the courier label.
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2 text-xs text-rose-200">
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Plain sealed packaging</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>No lingerie label outside</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Cash on Delivery everywhere</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>7-Day size replacement</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row md:flex-col gap-3 shrink-0 w-full sm:w-auto">
              <a
                href="https://wa.me/923266228304"
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm rounded-xl text-center transition-colors shadow-sm"
              >
                Chat Discreetly on WhatsApp
              </a>
              <Link
                href="/shop"
                className="px-6 py-3 bg-white text-burgundy hover:bg-blush font-semibold text-xs sm:text-sm rounded-xl text-center transition-colors shadow-sm"
              >
                Shop Confidently
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
