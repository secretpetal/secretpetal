'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
import { Product, normalizeVariationOptions } from '@/lib/types';
import { getProductBySlug, getProducts } from '@/lib/db';
import { useCart } from '@/context/CartContext';
import ProductCard from '@/components/ProductCard';
import BraSizeCalculatorModal from '@/components/BraSizeCalculatorModal';

function WhatsAppIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
    </svg>
  );
}

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
        
        const normSizes = item.has_sizes !== false ? normalizeVariationOptions(item.sizes) : [];
        if (normSizes.length > 0) setSelectedSize(normSizes[0].name);
        else setSelectedSize('');

        const normColors = item.has_colors !== false ? normalizeVariationOptions(item.colors) : [];
        if (normColors.length > 0) setSelectedColor(normColors[0].name);
        else setSelectedColor('');

        // Load related items in same category
        const related = await getProducts({ categoryId: item.category_id, limit: 4 });
        setRelatedProducts(related.filter((r) => r.id !== item.id));
      }
      setLoading(false);
    }
    loadData();
  }, [initialSlug]);

  const sizeOptions = useMemo(() => {
    if (!product || product.has_sizes === false) return [];
    return normalizeVariationOptions(product.sizes);
  }, [product]);

  const colorOptions = useMemo(() => {
    if (!product || product.has_colors === false) return [];
    return normalizeVariationOptions(product.colors);
  }, [product]);

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
  const hasDiscount = Boolean(product.sale_price && product.sale_price < product.price);

  // Real-Time Price Calculation Formula:
  // Final Active Price = Base Price + Selected Size Additional Price + Selected Color Additional Price
  const selectedSizeObj = sizeOptions.find((s) => s.name === selectedSize);
  const selectedColorObj = colorOptions.find((c) => c.name === selectedColor);
  const sizeAddon = selectedSizeObj ? (selectedSizeObj.price || 0) : 0;
  const colorAddon = selectedColorObj ? (selectedColorObj.price || 0) : 0;

  const currentBasePrice = hasDiscount ? product.sale_price! : product.price;
  const activeFinalPrice = currentBasePrice + sizeAddon + colorAddon;
  const activeOriginalPrice = product.price + sizeAddon + colorAddon;

  const discountPercent = hasDiscount
    ? Math.round(((product.price - product.sale_price!) / product.price) * 100)
    : 0;

  const handleBuyNow = () => {
    addToCart(product, selectedSize, selectedColor, quantity, activeFinalPrice, false);
    router.push('/checkout');
  };

  const handleWhatsAppOrder = () => {
    if (!product) return;
    const effectivePrice = activeFinalPrice;
    const totalAmount = effectivePrice * quantity;
    const siteUrl = typeof window !== 'undefined' ? window.location.origin : 'https://secretpetal.store';
    const productUrl = `${siteUrl}/product?slug=${product.slug}`;

    const lines = [
      '🌸 *SECRET PETAL — NEW ORDER INQUIRY*',
      '━━━━━━━━━━━━━━━━━━━━━',
      `🛍️ *Product:* ${product.title}`,
      `💰 *Price:* Rs. ${effectivePrice.toLocaleString()}`,
      selectedSize ? `📏 *Size:* ${selectedSize}${sizeAddon > 0 ? ` (+Rs. ${sizeAddon.toLocaleString()})` : ''}` : null,
      selectedColor ? `🎨 *Color:* ${selectedColor}${colorAddon > 0 ? ` (+Rs. ${colorAddon.toLocaleString()})` : ''}` : null,
      `🔢 *Quantity:* ${quantity}`,
      `💵 *Estimated Total:* Rs. ${totalAmount.toLocaleString()}`,
      '━━━━━━━━━━━━━━━━━━━━━',
      `🔗 *Product Link:* ${productUrl}`,
      '',
      '> 📦 *Packaging:* 100% Plain sealed box, zero brand mention on outer package.',
      '> 🚚 *Payment:* Cash on Delivery (COD) across Pakistan.',
      '',
      '_Hi Secret Petal, I would like to place an order for this item. Please confirm availability and shipping details!_'
    ].filter(Boolean);

    const message = lines.join('\n');
    const waUrl = `https://wa.me/923266228304?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
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
                  Rs. {activeFinalPrice.toLocaleString()}
                </span>
                {hasDiscount && (
                  <span className="text-sm sm:text-base text-gray-400 line-through">
                    Rs. {activeOriginalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-[11px] text-emerald-700 font-semibold ml-auto">
                  Cash on Delivery Available
                </span>
              </div>

              {/* Size Selector */}
              {sizeOptions.length > 0 && (
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
                    {sizeOptions.map((opt) => {
                      const isSelected = selectedSize === opt.name;
                      return (
                        <button
                          key={opt.name}
                          type="button"
                          onClick={() => setSelectedSize(opt.name)}
                          className={`min-w-12 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-burgundy text-white border-burgundy shadow-xs'
                              : 'bg-white text-gray-700 border-gray-200 hover:border-burgundy'
                          }`}
                        >
                          <span>{opt.name}</span>
                          {opt.price > 0 && (
                            <span
                              className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                                isSelected ? 'bg-white/20 text-white' : 'bg-rose-100 text-burgundy'
                              }`}
                            >
                              +Rs. {opt.price.toLocaleString()}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Color Selector */}
              {colorOptions.length > 0 && (
                <div className="mb-6">
                  <label className="block text-xs font-bold text-gray-800 mb-2">
                    Available Colors: <span className="text-burgundy font-normal">{selectedColor}</span>
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {colorOptions.map((opt) => {
                      const isSelected = selectedColor === opt.name;
                      return (
                        <button
                          key={opt.name}
                          type="button"
                          onClick={() => setSelectedColor(opt.name)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-rose-100/70 border-burgundy text-burgundy font-bold'
                              : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <span>{opt.name}</span>
                          {opt.price > 0 && (
                            <span
                              className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                                isSelected ? 'bg-burgundy text-white' : 'bg-rose-100 text-burgundy'
                              }`}
                            >
                              +Rs. {opt.price.toLocaleString()}
                            </span>
                          )}
                        </button>
                      );
                    })}
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
                    onClick={() => addToCart(product, selectedSize, selectedColor, quantity, activeFinalPrice, true)}
                    className="flex-1 py-3 px-4 bg-blush-100 hover:bg-blush text-burgundy font-bold text-xs sm:text-sm rounded-xl transition-colors border border-burgundy/20 flex items-center justify-center gap-2 shadow-xs"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add to Bag • Rs. {(activeFinalPrice * quantity).toLocaleString()}</span>
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

                {/* WhatsApp Direct Order CTA */}
                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="w-full py-3.5 px-4 bg-[#25D366] hover:bg-[#20ba59] active:scale-[0.99] text-white font-bold text-sm rounded-xl transition-all shadow-sm hover:shadow-md flex items-center justify-center gap-2.5 group"
                >
                  <WhatsAppIcon className="w-5 h-5 fill-white shrink-0 group-hover:scale-110 transition-transform" />
                  <span>Order via WhatsApp — Instant Confirmation</span>
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
