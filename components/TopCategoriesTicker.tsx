'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Category } from '@/lib/types';
import { getCategories } from '@/lib/db';
import { CategoryPillSkeleton } from './FlashSkeleton';

export default function TopCategoriesTicker() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then((cats) => {
      const topCats = cats.filter((c) => c.show_in_top_categories !== false);
      setCategories(topCats);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="py-6 px-4 max-w-7xl mx-auto">
        <div className="h-6 w-48 bg-rose-100/60 rounded mb-4" />
        <div className="flex gap-4 overflow-x-hidden">
          {[1, 2, 3, 4, 5].map((i) => (
            <CategoryPillSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (categories.length === 0) return null;

  const shouldScroll = categories.length > 4;

  return (
    <section className="py-6 sm:py-8 bg-blush-50/50 border-y border-rose-100/60 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-4 flex items-center justify-between">
        <div>
          <span className="text-[11px] uppercase tracking-widest font-bold text-burgundy">Categories</span>
          <h2 className="font-serif font-bold text-lg sm:text-2xl text-gray-900">Explore Main Categories</h2>
        </div>
        <Link
          href="/shop"
          className="text-xs sm:text-sm font-semibold text-burgundy hover:text-burgundy-900 transition-colors"
        >
          View All →
        </Link>
      </div>

      {/* Marquee / Scroll Container */}
      <div className="relative w-full overflow-x-auto no-scrollbar scroll-smooth">
        {/* On mobile: 2.5 items per screen width snapshot with finger touch scrolling */}
        <div
          className={`flex gap-4 sm:gap-6 px-4 sm:px-8 ${
            shouldScroll ? 'lg:animate-marquee hover:[animation-play-state:paused]' : 'justify-start lg:justify-center'
          } w-max`}
        >
          {/* First loop of categories */}
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?cat=${cat.slug}`}
              className="flex flex-col items-center flex-shrink-0 w-28 sm:w-36 group text-center transition-transform hover:-translate-y-1 duration-200"
            >
              <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-rose-200 group-hover:border-burgundy p-1 bg-white shadow-xs transition-colors">
                <div className="relative w-full h-full rounded-full overflow-hidden bg-rose-50">
                  <Image
                    src={cat.image_url}
                    alt={cat.name}
                    fill
                    sizes="(max-width: 640px) 80px, 112px"
                    className="object-cover object-center group-hover:scale-110 transition-transform duration-300"
                    unoptimized
                  />
                </div>
              </div>
              <span className="mt-2 text-xs sm:text-sm font-medium text-gray-800 group-hover:text-burgundy line-clamp-1">
                {cat.name}
              </span>
            </Link>
          ))}

          {/* Duplicate loop only if > 4 to enable infinite seamless marquee on desktop */}
          {shouldScroll &&
            categories.map((cat) => (
              <Link
                key={`dup-${cat.id}`}
                href={`/shop?cat=${cat.slug}`}
                className="hidden lg:flex flex-col items-center flex-shrink-0 w-28 sm:w-36 group text-center transition-transform hover:-translate-y-1 duration-200"
              >
                <div className="relative w-20 h-20 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-rose-200 group-hover:border-burgundy p-1 bg-white shadow-xs transition-colors">
                  <div className="relative w-full h-full rounded-full overflow-hidden bg-rose-50">
                    <Image
                      src={cat.image_url}
                      alt={cat.name}
                      fill
                      sizes="112px"
                      className="object-cover object-center group-hover:scale-110 transition-transform duration-300"
                      unoptimized
                    />
                  </div>
                </div>
                <span className="mt-2 text-xs sm:text-sm font-medium text-gray-800 group-hover:text-burgundy line-clamp-1">
                  {cat.name}
                </span>
              </Link>
            ))}
        </div>
      </div>
    </section>
  );
}
