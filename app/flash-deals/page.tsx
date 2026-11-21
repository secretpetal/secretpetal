'use client';

import React, { useState, useEffect } from 'react';
import { Zap, Clock, ShieldCheck } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { ProductCardSkeleton } from '@/components/FlashSkeleton';
import { Product } from '@/lib/types';
import { getProducts } from '@/lib/db';

export default function FlashDealsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Live countdown timer simulation
  const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 32, seconds: 48 });

  useEffect(() => {
    getProducts({ isFlashDeal: true }).then((data) => {
      setProducts(data);
      setLoading(false);
    });

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 24, minutes: 0, seconds: 0 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="bg-gray-50/50 min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Banner Card */}
        <div className="bg-gradient-to-r from-amber-600 via-rose-700 to-burgundy text-white rounded-2xl p-6 sm:p-8 mb-8 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-2 text-center sm:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 rounded-full text-xs font-bold uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-amber-300 stroke-amber-300" />
              Limited Stock Flash Sale
            </span>
            <h1 className="font-serif font-bold text-2xl sm:text-4xl">
              Special Flash Discounts
            </h1>
            <p className="text-xs sm:text-sm text-rose-100 max-w-md">
              Grab premium butterfly lace posture bras and cute plush sets at deep promotional discounts before stock runs out!
            </p>
          </div>

          {/* Countdown Clock */}
          <div className="bg-black/30 backdrop-blur-xs px-5 py-3 rounded-2xl border border-white/20 flex items-center gap-3 text-center">
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold block">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-[10px] text-rose-200 uppercase">Hours</span>
            </div>
            <span className="text-xl font-bold">:</span>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold block">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-[10px] text-rose-200 uppercase">Mins</span>
            </div>
            <span className="text-xl font-bold">:</span>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold block">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="text-[10px] text-rose-200 uppercase">Secs</span>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {[1, 2, 3, 4].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-rose-100 max-w-md mx-auto">
            <Clock className="w-12 h-12 text-amber-500 mx-auto mb-2" />
            <p className="font-serif font-bold text-lg text-gray-800">Check back soon</p>
            <p className="text-xs text-gray-500">New flash deals are added every week.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
