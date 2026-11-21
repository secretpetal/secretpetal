'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductDetailClient from './[slug]/ProductDetailClient';

function ProductQueryContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug') || '';

  if (!slug) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h1 className="font-serif font-bold text-2xl text-gray-800 mb-2">Product Not Found</h1>
        <p className="text-xs text-gray-500 mb-6">No product specified.</p>
        <a href="/shop" className="px-5 py-2.5 bg-burgundy text-white text-xs font-semibold rounded-lg">
          Browse All Products
        </a>
      </div>
    );
  }

  return <ProductDetailClient initialSlug={slug} />;
}

export default function ProductDynamicPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
          <div className="w-10 h-10 border-4 border-burgundy border-t-transparent rounded-full animate-spin" />
        </div>
      }
    >
      <ProductQueryContent />
    </Suspense>
  );
}
