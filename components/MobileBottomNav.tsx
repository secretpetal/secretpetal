'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid, Zap, ShoppingBag, Phone } from 'lucide-react';
import { useCart } from '@/context/CartContext';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { cartCount, openCart } = useCart();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Listen to mobile menu drawer open/close events
  useEffect(() => {
    const handleMenuToggle = (e: any) => {
      setIsMenuOpen(e.detail?.open || false);
    };
    window.addEventListener('sp_mobile_menu_toggle', handleMenuToggle);
    return () => window.removeEventListener('sp_mobile_menu_toggle', handleMenuToggle);
  }, []);

  // Do not show on admin or checkout pages or when mobile menu drawer is open
  if (isMenuOpen || pathname.startsWith('/admin') || pathname === '/checkout') {
    return null;
  }

  const navItems = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Shop', href: '/shop', icon: Grid },
    { label: 'Flash', href: '/flash-deals', icon: Zap },
  ];

  return (
    <div className="fixed bottom-3 inset-x-0 z-40 lg:hidden flex justify-center px-4 pointer-events-none transition-all duration-300">
      <nav className="pointer-events-auto bg-white/85 backdrop-blur-md border border-rose-200/80 shadow-xl rounded-full px-3 py-1.5 flex items-center justify-between gap-1 sm:gap-3 max-w-sm w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-full text-[10px] font-medium transition-all ${
                isActive
                  ? 'text-burgundy font-bold bg-blush-100/80 shadow-xs'
                  : 'text-gray-600 hover:text-burgundy'
              }`}
            >
              <Icon className="w-4 h-4 mb-0.5" />
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* Cart Button */}
        <button
          type="button"
          onClick={openCart}
          className="flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-full text-[10px] font-medium text-gray-600 hover:text-burgundy relative transition-all"
        >
          <div className="relative">
            <ShoppingBag className="w-4 h-4 mb-0.5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-burgundy text-white text-[9px] font-bold h-3.5 w-3.5 rounded-full flex items-center justify-center shadow-xs">
                {cartCount}
              </span>
            )}
          </div>
          <span>Cart</span>
        </button>

        {/* WhatsApp Button */}
        <a
          href="https://wa.me/923266228304"
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 flex flex-col items-center justify-center py-1 px-1 rounded-full text-[10px] font-medium text-emerald-700 hover:text-emerald-800 transition-all"
        >
          <Phone className="w-4 h-4 mb-0.5 text-emerald-600" />
          <span>Support</span>
        </a>
      </nav>
    </div>
  );
}
