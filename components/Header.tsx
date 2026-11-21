'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  ShoppingBag,
  Search,
  Ruler,
  Phone,
  Shield,
  Truck,
  Sparkles,
  ChevronRight,
  Lock
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product } from '@/lib/types';
import { getProducts } from '@/lib/db';
import BraSizeCalculatorModal from './BraSizeCalculatorModal';

interface HeaderProps {
  onMobileMenuToggle?: (isOpen: boolean) => void;
}

export default function Header({ onMobileMenuToggle }: HeaderProps) {
  const pathname = usePathname();
  const { cartCount, openCart } = useCart();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);

  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getProducts().then(setAllProducts);
  }, []);

  // Update mobile menu state to hide bottom nav
  const setMobileMenu = (open: boolean) => {
    setIsMobileMenuOpen(open);
    if (onMobileMenuToggle) onMobileMenuToggle(open);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sp_mobile_menu_toggle', { detail: { open } }));
    }
  };

  // Close menu on route change
  useEffect(() => {
    setMobileMenu(false);
    setIsSearchOpen(false);
  }, [pathname]);

  // Live search filtering
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const q = searchQuery.toLowerCase().trim();
    const matches = allProducts.filter(p =>
      p.title.toLowerCase().includes(q) ||
      (p.sku && p.sku.toLowerCase().includes(q)) ||
      (p.description && p.description.toLowerCase().includes(q))
    ).slice(0, 5);
    setSearchResults(matches);
  }, [searchQuery, allProducts]);

  // Close search dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'All Products', href: '/shop' },
    { label: 'Comfort Bras', href: '/shop?cat=comfort-posture-bras' },
    { label: 'Plush Sets', href: '/shop?cat=plush-cozy-sets' },
    { label: 'Flash Deals', href: '/flash-deals' },
    { label: 'Track Order', href: '/track-order' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 transition-all">
        {/* 1. Announcement Bar */}
        <div className="bg-gradient-to-r from-burgundy via-burgundy-800 to-rose-900 text-white text-[11px] sm:text-xs py-1.5 px-3 font-medium">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
              <Truck className="w-3.5 h-3.5 text-rose-300" />
              <span>
                <strong>FREE Shipping</strong> across Pakistan on orders above Rs. 2,500
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-4 text-rose-200 text-[11px]">
              <span className="flex items-center gap-1">
                <Shield className="w-3 h-3 text-emerald-400" />
                100% Discreet Packaging
              </span>
              <button
                type="button"
                onClick={() => setIsCalculatorOpen(true)}
                className="hover:text-white flex items-center gap-1 transition-colors"
              >
                <Ruler className="w-3 h-3 text-rose-300" />
                Bra Size Calculator
              </button>
            </div>
          </div>
        </div>

        {/* 2. Main Navigation Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20 gap-2 sm:gap-4">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenu(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:text-burgundy hover:bg-blush-50 transition-colors"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <div className="relative h-12 w-36 sm:h-16 sm:w-48">
                <Image
                  src="/images/logo.png"
                  alt="Secret Petal Store Logo"
                  fill
                  sizes="(max-width: 640px) 144px, 192px"
                  className="object-contain object-left sm:object-center"
                  priority
                  unoptimized
                />
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-xs sm:text-sm font-medium text-gray-700">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`transition-colors hover:text-burgundy py-1 relative ${
                    pathname === link.href ? 'text-burgundy font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-burgundy' : ''
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* Right Action Icons & Search */}
            <div className="flex items-center gap-1.5 sm:gap-3">
              {/* Search Box / Button */}
              <div className="relative" ref={searchRef}>
                <button
                  type="button"
                  onClick={() => setIsSearchOpen(!isSearchOpen)}
                  className="p-2 text-gray-700 hover:text-burgundy hover:bg-blush-50 rounded-full transition-colors"
                  aria-label="Search Products"
                >
                  <Search className="w-5 h-5" />
                </button>

                {/* Search Dropdown / Input Box */}
                {isSearchOpen && (
                  <div className="absolute right-0 mt-2 w-72 sm:w-88 bg-white rounded-2xl shadow-xl border border-rose-100 p-3 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search bras, plush sets, sizes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        autoFocus
                        className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm border border-rose-200 rounded-xl focus:outline-none focus:border-burgundy"
                      />
                      <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                    </div>

                    {/* Results dropdown */}
                    {searchResults.length > 0 && (
                      <div className="mt-2 divide-y divide-rose-50 max-h-60 overflow-y-auto">
                        {searchResults.map((item) => (
                          <Link
                            key={item.id}
                            href={`/product?slug=${item.slug}`}
                            onClick={() => setIsSearchOpen(false)}
                            className="flex items-center gap-2.5 py-2 px-1 hover:bg-blush-50 rounded-lg transition-colors"
                          >
                            <div className="relative w-10 h-10 rounded-md overflow-hidden bg-rose-50 shrink-0">
                              <Image src={item.thumbnail_url} alt={item.title} fill sizes="40px" className="object-cover" unoptimized />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-medium text-gray-800 truncate">{item.title}</p>
                              <p className="text-[11px] font-bold text-burgundy">Rs. {(item.sale_price || item.price).toLocaleString()}</p>
                            </div>
                          </Link>
                        ))}
                      </div>
                    )}
                    {searchQuery && searchResults.length === 0 && (
                      <p className="text-xs text-gray-400 text-center py-4">No matching products found.</p>
                    )}
                  </div>
                )}
              </div>

              {/* Bra Calculator Button (Mobile/Tablet quick icon) */}
              <button
                type="button"
                onClick={() => setIsCalculatorOpen(true)}
                className="lg:hidden p-2 text-gray-700 hover:text-burgundy hover:bg-blush-50 rounded-full transition-colors"
                title="Size Calculator"
              >
                <Ruler className="w-5 h-5" />
              </button>

              {/* Shopping Bag Button */}
              <button
                type="button"
                onClick={openCart}
                className="p-2 text-gray-700 hover:text-burgundy hover:bg-blush-50 rounded-full transition-colors relative"
                aria-label="Open Cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute top-1 right-1 bg-burgundy text-white text-[10px] font-bold h-4.5 w-4.5 rounded-full flex items-center justify-center shadow-xs">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Admin Lock Link */}
              <Link
                href="/admin"
                prefetch={false}
                className="p-2 text-gray-400 hover:text-burgundy rounded-full transition-colors hidden sm:block"
                title="Admin Control Panel"
              >
                <Lock className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* 3. Mobile Slide-out Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden animate-in fade-in duration-200">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xs" onClick={() => setMobileMenu(false)} />
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl flex flex-col justify-between p-5 z-10 animate-in slide-in-from-left duration-300">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-rose-100">
                <div className="relative h-10 w-32">
                  <Image src="/images/logo.png" alt="Secret Petal" fill sizes="128px" className="object-contain" unoptimized />
                </div>
                <button
                  type="button"
                  onClick={() => setMobileMenu(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation Links */}
              <div className="mt-4 space-y-1">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenu(false)}
                    className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-medium text-gray-800 hover:bg-blush-50 hover:text-burgundy transition-colors"
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </Link>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    setMobileMenu(false);
                    setIsCalculatorOpen(true);
                  }}
                  className="w-full flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-medium text-burgundy bg-blush-50/70 hover:bg-blush transition-colors mt-2"
                >
                  <span className="flex items-center gap-2">
                    <Ruler className="w-4 h-4" />
                    Bra Size Calculator
                  </span>
                  <Sparkles className="w-4 h-4 text-rose-400" />
                </button>
              </div>
            </div>

            {/* Mobile Footer Info */}
            <div className="pt-4 border-t border-rose-100 space-y-2">
              <a
                href="https://wa.me/923266228304"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs"
              >
                <Phone className="w-4 h-4" />
                WhatsApp: 0326-6228304
              </a>
              <div className="flex justify-between items-center text-[11px] text-gray-400 pt-1">
                <span>Discreet Nationwide Delivery</span>
                <Link href="/admin" prefetch={false} className="hover:text-burgundy flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Admin
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bra Size Calculator Modal */}
      <BraSizeCalculatorModal
        isOpen={isCalculatorOpen}
        onClose={() => setIsCalculatorOpen(false)}
      />
    </>
  );
}
