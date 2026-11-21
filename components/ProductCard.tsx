'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingBag, Star, Eye } from 'lucide-react';
import { Product } from '@/lib/types';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const currentPrice = hasDiscount ? product.sale_price! : product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.sale_price!) / product.price) * 100)
    : 0;

  return (
    <div className="group bg-white rounded-xl border border-rose-100/80 hover:border-burgundy-300 p-2 sm:p-3 flex flex-col justify-between transition-all duration-200 hover:shadow-md relative overflow-hidden">
      {/* Badges */}
      <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
        {hasDiscount && (
          <span className="bg-burgundy text-white text-[10px] sm:text-xs font-bold px-1.5 py-0.5 rounded shadow-sm">
            -{discountPercent}% OFF
          </span>
        )}
        {product.is_flash_deal && (
          <span className="bg-amber-600 text-white text-[9px] sm:text-[10px] font-semibold px-1.5 py-0.5 rounded uppercase tracking-wider">
            ⚡ Flash Deal
          </span>
        )}
      </div>

      {/* Image Container */}
      <Link href={`/product?slug=${product.slug}`} className="block relative aspect-square w-full rounded-lg overflow-hidden bg-blush-50 mb-2">
        <Image
          src={product.thumbnail_url}
          alt={product.title}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
          unoptimized
        />
      </Link>

      {/* Product Info */}
      <div className="flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 mb-1 text-amber-500 text-[11px] font-medium">
            <Star className="w-3 h-3 fill-amber-400 stroke-amber-400" />
            <span>4.9</span>
            <span className="text-gray-400 text-[10px]">(18)</span>
          </div>

          {/* Title */}
          <Link href={`/product?slug=${product.slug}`} className="block">
            <h3 className="text-xs sm:text-sm font-medium text-gray-800 line-clamp-2 hover:text-burgundy transition-colors leading-tight min-h-[2rem]">
              {product.title}
            </h3>
          </Link>
        </div>

        {/* Price & Action */}
        <div className="mt-2 pt-2 border-t border-rose-50 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-bold text-burgundy">
              Rs. {currentPrice.toLocaleString()}
            </span>
            {hasDiscount && (
              <span className="text-[10px] sm:text-xs text-gray-400 line-through">
                Rs. {product.price.toLocaleString()}
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              addToCart(product);
            }}
            aria-label="Add to cart"
            className="p-1.5 sm:p-2 bg-blush text-burgundy hover:bg-burgundy hover:text-white rounded-lg transition-colors flex items-center justify-center shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
