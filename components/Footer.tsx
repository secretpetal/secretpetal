'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Phone, Mail, MapPin, ShieldCheck, Truck, Lock } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-b from-white to-blush-50 border-t border-rose-100 text-gray-700 pt-8 pb-20 lg:pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 pb-8 border-b border-rose-100">
          {/* Brand Col */}
          <div className="space-y-3">
            <Link href="/" className="inline-block">
              <div className="relative h-12 w-44">
                <Image
                  src="/images/logo.png"
                  alt="Secret Petal Store Logo"
                  fill
                  sizes="176px"
                  className="object-contain object-left"
                  unoptimized
                />
              </div>
            </Link>
            <p className="text-xs text-gray-600 leading-relaxed">
              Making shopping for women&apos;s intimate wear easy, convenient, and <strong>100% private</strong>. Quality products, affordable prices, and guaranteed discreet delivery right to your doorstep.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-100 p-2 rounded-lg font-medium">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>100% Discreet Packaging Guaranteed</span>
            </div>
          </div>

          {/* Quick Links (2 columns on mobile for tight spacing) */}
          <div>
            <h4 className="font-serif font-bold text-sm text-gray-900 mb-3 tracking-wide">
              Quick Links
            </h4>
            <ul className="grid grid-cols-2 gap-y-2 gap-x-4 text-xs">
              <li><Link href="/" className="hover:text-burgundy transition-colors">Home</Link></li>
              <li><Link href="/shop" className="hover:text-burgundy transition-colors">All Products</Link></li>
              <li><Link href="/shop?cat=comfort-posture-bras" className="hover:text-burgundy transition-colors">Comfort Bras</Link></li>
              <li><Link href="/shop?cat=plush-cozy-sets" className="hover:text-burgundy transition-colors">Plush Sets</Link></li>
              <li><Link href="/flash-deals" className="hover:text-burgundy transition-colors">Flash Deals</Link></li>
              <li><Link href="/track-order" className="hover:text-burgundy transition-colors">Track Order</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-burgundy transition-colors">Privacy Policy</Link></li>
              <li><Link href="/shipping-policy" className="hover:text-burgundy transition-colors">Shipping Policy</Link></li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-serif font-bold text-sm text-gray-900 mb-3 tracking-wide">
              Customer Support
            </h4>
            <ul className="space-y-2 text-xs text-gray-600">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-burgundy shrink-0 mt-0.5" />
                <a href="https://wa.me/923266228304" target="_blank" rel="noreferrer" className="hover:text-burgundy font-medium">
                  WhatsApp: 0326-6228304
                </a>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-burgundy shrink-0 mt-0.5" />
                <a href="mailto:secretpetal62@gmail.com" className="hover:text-burgundy">
                  secretpetal62@gmail.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-burgundy shrink-0 mt-0.5" />
                <span>Shahzada Shaheed Chuman Shah Road, Street No. 7, Gujranwala</span>
              </li>
            </ul>
          </div>

          {/* Payment & Social */}
          <div className="space-y-3">
            <h4 className="font-serif font-bold text-sm text-gray-900 mb-1 tracking-wide">
              Payment &amp; Delivery
            </h4>
            <p className="text-[11px] text-gray-500">
              Cash on Delivery (COD), JazzCash, EasyPaisa, &amp; Bank Transfer across all cities in Pakistan.
            </p>
            <div className="flex flex-wrap gap-1.5 text-[10px] font-bold">
              <span className="px-2 py-1 bg-white border border-gray-200 rounded text-gray-800">Cash on Delivery</span>
              <span className="px-2 py-1 bg-amber-50 border border-amber-200 rounded text-amber-800">JazzCash</span>
              <span className="px-2 py-1 bg-emerald-50 border border-emerald-200 rounded text-emerald-800">EasyPaisa</span>
              <span className="px-2 py-1 bg-blue-50 border border-blue-200 rounded text-blue-800">Bank Transfer</span>
            </div>

            {/* Social Links */}
            <div className="pt-2">
              <span className="text-xs font-semibold text-gray-800 block mb-1.5">Follow Us:</span>
              <div className="flex gap-2 text-xs">
                <a
                  href="https://www.facebook.com/secretpetal.pk"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2 py-1 bg-white border border-rose-200 rounded text-gray-700 hover:text-burgundy transition-colors"
                >
                  Facebook
                </a>
                <a
                  href="https://www.instagram.com/secretpetal.store"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2 py-1 bg-white border border-rose-200 rounded text-gray-700 hover:text-burgundy transition-colors"
                >
                  Instagram
                </a>
                <a
                  href="http://tiktok.com/@secretpetal.store"
                  target="_blank"
                  rel="noreferrer"
                  className="px-2 py-1 bg-white border border-rose-200 rounded text-gray-700 hover:text-burgundy transition-colors"
                >
                  TikTok
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between text-[11px] text-gray-400 gap-2 text-center sm:text-left">
          <p>© {new Date().getFullYear()} Secret Petal (secretpetal.store). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="hover:text-burgundy">Privacy</Link>
            <Link href="/shipping-policy" className="hover:text-burgundy">Shipping</Link>
            <Link href="/admin" prefetch={false} className="hover:text-burgundy flex items-center gap-1">
              <Lock className="w-3 h-3" /> Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
