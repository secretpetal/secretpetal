'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingBag, Plus, Minus, Trash2, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function CartDrawer() {
  const { isCartOpen, closeCart, items, subtotal, updateQuantity, removeFromCart } = useCart();

  if (!isCartOpen) return null;

  const freeShippingThreshold = 2500;
  const amountToFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300">
        {/* Header */}
        <div className="p-4 border-b border-rose-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-burgundy" />
            <h2 className="font-serif font-bold text-lg text-gray-900">Your Shopping Bag</h2>
            <span className="text-xs bg-blush-200 text-burgundy font-bold px-2 py-0.5 rounded-full">
              {items.reduce((acc, i) => acc + i.quantity, 0)}
            </span>
          </div>
          <button
            type="button"
            onClick={closeCart}
            className="p-1 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Shipping Progress */}
        <div className="px-4 py-3 bg-blush-50 border-b border-rose-100/70">
          <div className="flex justify-between text-xs font-medium text-gray-700 mb-1.5">
            {amountToFreeShipping > 0 ? (
              <span>Add <strong className="text-burgundy">Rs. {amountToFreeShipping.toLocaleString()}</strong> for <strong>FREE Delivery</strong></span>
            ) : (
              <span className="text-emerald-700 font-bold flex items-center gap-1">
                🎉 Congratulations! You unlocked FREE Delivery!
              </span>
            )}
            <span className="text-gray-400">{progressPercent}%</span>
          </div>
          <div className="w-full bg-rose-200/50 h-2 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-rose-400 to-burgundy h-full rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-gray-400">
              <ShoppingBag className="w-16 h-16 stroke-1 text-rose-200 mb-3" />
              <p className="font-serif text-lg text-gray-700 font-semibold mb-1">Your bag is empty</p>
              <p className="text-xs text-gray-500 mb-4 max-w-xs">
                Explore our collection of comfort posture bras, plush cozy sets, and luxury intimate wear.
              </p>
              <button
                type="button"
                onClick={closeCart}
                className="px-5 py-2 bg-burgundy text-white text-xs font-semibold rounded-lg hover:bg-burgundy-900 transition-colors shadow-sm"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            items.map((item, idx) => (
              <div
                key={`${item.product_id}-${item.size}-${item.color}-${idx}`}
                className="flex gap-3 p-2.5 bg-white border border-rose-100/80 rounded-xl relative group"
              >
                <div className="relative w-18 h-18 rounded-lg overflow-hidden bg-blush-50 shrink-0">
                  <Image
                    src={item.thumbnail_url}
                    alt={item.title}
                    fill
                    sizes="80px"
                    className="object-cover"
                    unoptimized
                  />
                </div>

                <div className="flex-1 flex flex-col justify-between">
                  <div className="pr-6">
                    <h4 className="text-xs font-medium text-gray-800 line-clamp-1">{item.title}</h4>
                    <div className="text-[11px] text-gray-500 mt-0.5 flex flex-wrap gap-x-2">
                      {item.size && item.size !== 'Standard' && (
                        <span>Size: <strong className="text-gray-700">{item.size}</strong></span>
                      )}
                      {item.color && item.color !== 'Default' && (
                        <span>Color: <strong className="text-gray-700">{item.color}</strong></span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-bold text-burgundy">
                      Rs. {(item.price * item.quantity).toLocaleString()}
                    </span>

                    <div className="flex items-center border border-gray-200 rounded-md">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product_id, item.quantity - 1, item.size, item.color)}
                        className="p-1 text-gray-500 hover:text-burgundy"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 text-xs font-semibold text-gray-700">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.product_id, item.quantity + 1, item.size, item.color)}
                        className="p-1 text-gray-500 hover:text-burgundy"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => removeFromCart(item.product_id, item.size, item.color)}
                  className="absolute top-2 right-2 text-gray-300 hover:text-rose-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-rose-100 bg-white space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-500">Subtotal:</span>
              <span className="font-serif font-bold text-lg text-burgundy">
                Rs. {subtotal.toLocaleString()}
              </span>
            </div>

            <p className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% Discreet Packaging Guaranteed
            </p>

            <Link
              href="/checkout"
              onClick={closeCart}
              className="w-full py-3 bg-burgundy hover:bg-burgundy-900 text-white font-medium text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
