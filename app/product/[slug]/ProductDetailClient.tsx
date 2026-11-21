'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Star,
  ShoppingBag,
  Zap,
  ShieldCheck,
  Truck,
  RefreshCw,
  Ruler,
  Check,
  ChevronRight,
  Heart
} from 'lucide-react';
import { Product } from '@/lib/types';
import { getProductBySlug, getProducts } from '@/lib/db';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';
import BraSizeCalculatorModal from '@/components/BraSizeCalculatorModal';

export default function ProductDetailClient({ initialSlug }: { initialSlug: string }) {
  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const item = await getProductBySlug(initialSlug);
      if (item) {
        setProduct(item);
        setSelectedImage(item.thumbnail_url);
        if (item.sizes && item.sizes.length > 0) setSelectedSize(item.sizes[0]);
        if (item.colors && item.colors.length > 0) setSelectedColor(item.colors[0]);

        // Load related items in same category
        const related = await getProducts({ categoryId: item.category_id, limit: 4 });
        setRelatedProducts(related.filter((r) => r.id !== item.id));
      }
      setLoading(false);
    }
    loadData();
  }, [initialSlug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-4 border-burgundy border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <h1 className="font-serif font-bold text-2xl text-gray-800 mb-2">Product Not Found</h1>
        <p className="text-xs text-gray-500 mb-6">This item may be temporarily unavailable or discontinued.</p>
        <Link href="/shop" className="px-5 py-2.5 bg-burgundy text-white text-xs font-semibold rounded-lg">
          Browse All Products
        </Link>
      </div>
    );
  }

  const allImages = [product.thumbnail_url, ...(product.gallery_urls || [])];
  const hasDiscount = product.sale_price && product.sale_price < product.price;
  const currentPrice = hasDiscount ? product.sale_price! : product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.sale_price!) / product.price) * 100)
    : 0;

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity);
    router.push('/checkout');
  };

  return (
    <div className="bg-white min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-gray-400 mb-6 flex-wrap">
          <Link href="/" className="hover:text-burgundy">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <Link href="/shop" className="hover:text-burgundy">Shop</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-gray-700 font-medium truncate max-w-xs">{product.title}</span>
        </nav>

        {/* Product Layout Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
          {/* Left: Image Gallery */}
          <div className="space-y-3">
            {/* Main Featured Image */}
            <div className="relative aspect-square w-full rounded-2xl overflow-hidden bg-blush-50 border border-rose-100 shadow-xs">
              <Image
                src={selectedImage || product.thumbnail_url}
                alt={product.title}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
                unoptimized
              />
              {hasDiscount && (
                <span className="absolute top-3 left-3 bg-burgundy text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                  -{discountPercent}% OFF
                </span>
              )}
            </div>

            {/* Thumbnail Row */}
            {allImages.length > 1 && (
              <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImage(img)}
                    className={`relative w-18 h-18 sm:w-20 sm:h-20 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      selectedImage === img ? 'border-burgundy scale-95 shadow-xs' : 'border-rose-100 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image src={img} alt={`View ${idx}`} fill sizes="80px" className="object-cover" unoptimized />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Product Details & Actions */}
          <div className="flex flex-col justify-between">
            <div>
              {/* SKU & Category */}
              <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                <span>SKU: <strong className="text-gray-700">{product.sku || 'SP-GEN'}</strong></span>
                <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold text-[11px]">
                  In Stock ({product.stock} left)
                </span>
              </div>

              {/* Title */}
              <h1 className="font-serif font-bold text-xl sm:text-3xl text-gray-900 leading-snug mb-2">
                {product.title}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 stroke-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-semibold text-gray-700">4.9 / 5.0</span>
                <span className="text-xs text-gray-400">(24 verified reviews)</span>
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-3 p-3 bg-blush-50/60 rounded-xl border border-rose-100 mb-6">
                <span className="font-serif font-bold text-2xl sm:text-3xl text-burgundy">
                  Rs. {currentPrice.toLocaleString()}
                </span>
                {hasDiscount && (
                  <span className="text-sm sm:text-base text-gray-400 line-through">
                    Rs. {product.price.toLocaleString()}
                  </span>
                )}
                <span className="text-[11px] text-emerald-700 font-semibold ml-auto">
                  Cash on Delivery Available
                </span>
              </div>

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-gray-800">
                      Select Size: <span className="text-burgundy font-normal">{selectedSize}</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => setIsCalculatorOpen(true)}
                      className="text-xs font-semibold text-burgundy hover:underline flex items-center gap-1"
                    >
                      <Ruler className="w-3.5 h-3.5" />
                      Size Guide Calculator
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`min-w-12 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          selectedSize === size
                            ? 'bg-burgundy text-white border-burgundy shadow-xs'
                            : 'bg-white text-gray-700 border-gray-200 hover:border-burgundy'
                        }`}
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-800 mb-2">
                    Available Colors: <span className="text-burgundy font-normal">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setSelectedColor(color)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                          selectedColor === color
                            ? 'bg-rose-100/70 border-burgundy text-burgundy font-bold'
                            : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity Selector & Action Buttons */}
              <div className="space-y-3 mb-8">
                <div className="flex gap-3">
                  <div className="flex items-center border border-gray-200 rounded-xl px-2">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 text-gray-500 hover:text-burgundy"
                    >
                      -
                    </button>
                    <span className="px-3 text-sm font-bold text-gray-800">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="p-2 text-gray-500 hover:text-burgundy"
                    >
                      +
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => addToCart(product, selectedSize, selectedColor, quantity)}
                    className="flex-1 py-3 px-4 bg-blush-100 hover:bg-blush text-burgundy font-bold text-xs sm:text-sm rounded-xl transition-colors border border-burgundy/20 flex items-center justify-center gap-2 shadow-xs"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="w-full py-3.5 px-4 bg-burgundy hover:bg-burgundy-900 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4 fill-rose-300 stroke-rose-300" />
                  <span>Buy Now — Cash on Delivery</span>
                </button>
              </div>

              {/* Discreet Delivery Guarantee Card */}
              <div className="p-4 bg-blush-50/70 rounded-xl border border-rose-100 space-y-2 mb-6">
                <div className="flex items-center gap-2 text-xs font-bold text-gray-900">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>100% Discreet Packaging Guaranteed</span>
                </div>
                <p className="text-[11px] text-gray-600 leading-relaxed">
                  Shipped in a completely sealed, plain box with zero intimate or lingerie mention on the shipping label. Complete privacy guaranteed to your home.
                </p>
                <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-gray-600">
                  <span className="flex items-center gap-1">
                    <Truck className="w-3.5 h-3.5 text-burgundy" /> Dispatch from Gujranwala
                  </span>
                  <span className="flex items-center gap-1">
                    <RefreshCw className="w-3.5 h-3.5 text-burgundy" /> 7-Day Size Exchange
                  </span>
                </div>
              </div>

              {/* Rich Description */}
              <div className="border-t border-rose-100 pt-6">
                <h3 className="font-serif font-bold text-base text-gray-900 mb-2">Description &amp; Fabric</h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-4">
                  {product.description}
                </p>

                {product.features && product.features.length > 0 && (
                  <ul className="space-y-1.5 text-xs text-gray-700">
                    {product.features.map((feat, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="border-t border-rose-100 pt-10">
            <h3 className="font-serif font-bold text-xl text-gray-900 mb-6">
              You May Also Like
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      <BraSizeCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />
    </div>
  );
}
