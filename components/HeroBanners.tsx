'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Banner } from '@/lib/types';
import { getBanners } from '@/lib/db';

export default function HeroBanners() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    getBanners().then((res) => {
      if (res && res.length > 0) setBanners(res);
    });
  }, []);

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (banners.length === 0) return null;

  const currentBanner = banners[currentIndex];

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  return (
    <div className="relative w-full overflow-hidden bg-rose-950 group">
      {/* Banner Container: Pure responsive image without overlaid text or button clutter */}
      <Link href={currentBanner.link_url || '/shop'} className="block w-full">
        {/* Desktop View (aspect ratio 1920/600 ~ 3.2 : 1) */}
        <div className="hidden sm:block relative w-full aspect-[1920/600] max-h-[500px]">
          <Image
            src={currentBanner.image_url}
            alt={currentBanner.title || 'Secret Petal Banner'}
            fill
            sizes="100vw"
            priority
            className="object-cover object-center transition-opacity duration-500"
            unoptimized
          />
        </div>

        {/* Mobile View (aspect ratio 800/600 ~ 4 : 3) */}
        <div className="sm:hidden relative w-full aspect-[800/600]">
          <Image
            src={currentBanner.mobile_image_url || currentBanner.image_url}
            alt={currentBanner.title || 'Secret Petal Mobile Banner'}
            fill
            sizes="100vw"
            priority
            className="object-cover object-center transition-opacity duration-500"
            unoptimized
          />
        </div>
      </Link>

      {/* Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              prevSlide();
            }}
            className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded-full bg-white/70 hover:bg-white text-burgundy shadow-md transition-all opacity-0 group-hover:opacity-100"
            aria-label="Previous Banner"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              nextSlide();
            }}
            className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-1.5 sm:p-2 rounded-full bg-white/70 hover:bg-white text-burgundy shadow-md transition-all opacity-0 group-hover:opacity-100"
            aria-label="Next Banner"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots Indicator */}
          <div className="absolute bottom-2 sm:bottom-4 inset-x-0 flex justify-center gap-1.5 sm:gap-2 z-10">
            {banners.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'w-6 bg-burgundy-700' : 'w-2 bg-white/60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
