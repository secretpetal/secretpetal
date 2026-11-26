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
  Sparkles,
  ChevronRight,
  ChevronDown,
  Lock,
  LayoutGrid
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Product, Category, Subcategory, SiteSettings } from '@/lib/types';
import {
  DEFAULT_SITE_SETTINGS,
  getProducts,
  getCategories,
  getSubcategories,
  getSiteSettings,
  subscribeToStoreChanges
} from '@/lib/db';
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
  const [isAllCatsOpen, setIsAllCatsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [hoveredCatId, setHoveredCatId] = useState<string | null>(null);
  const [mobileExpandedCat, setMobileExpandedCat] = useState<string | null>(null);

  const searchRef = useRef<HTMLDivElement>(null);
  const megaMenuRef = useRef<HTMLDivElement>(null);
  const megaHoverAtRef = useRef<number>(0);

  useEffect(() => {
    getProducts().then(setAllProducts);
    const loadCategories = () => {
      getCategories().then(setCategories);
      getSubcategories().then(setSubcategories);
    };
    loadCategories();

    const loadSettings = () => {
      getSiteSettings().then(setSettings);
    };
    loadSettings();

    const unsubSettings = subscribeToStoreChanges('site_settings', loadSettings);
    const unsubCategories = subscribeToStoreChanges('categories', loadCategories);
    const unsubSubcategories = subscribeToStoreChanges('subcategories', loadCategories);

    if (typeof window !== 'undefined') {
      const handleStorage = (e: StorageEvent) => {
        if (e.key === '__trigger_sp_categories_updated' || e.key === 'sp_cached_categories' || e.key === 'sp_cached_subcategories') {
          loadCategories();
        }
        if (e.key === '__trigger_sp_settings_updated' || e.key === 'sp_cached_settings') {
          loadSettings();
        }
      };
      window.addEventListener('sp_categories_updated', loadCategories);
      window.addEventListener('sp_settings_updated', loadSettings);
      window.addEventListener('storage', handleStorage);
      return () => {
        unsubSettings();
        unsubCategories();
        unsubSubcategories();
        window.removeEventListener('sp_categories_updated', loadCategories);
        window.removeEventListener('sp_settings_updated', loadSettings);
        window.removeEventListener('storage', handleStorage);
      };
    }

    return () => {
      unsubSettings();
      unsubCategories();
      unsubSubcategories();
    };
  }, []);

  const headerCategories = categories.filter((c) => c.show_in_header !== false);
  const visibleInlineCategories = headerCategories.slice(0, 6);

  // Flatten newlines so marquee always runs in a single horizontal row
  const announcementText = settings
    ? (settings.announcement_text || DEFAULT_SITE_SETTINGS.announcement_text || '').replace(/[\r\n]+/g, '   ').trim()
    : '';
  const marqueeDurationSec = Math.max(22, Math.min(48, Math.round(announcementText.length * 0.24) + 16));

  // Update mobile menu state to hide bottom nav
  const setMobileMenu = (open: boolean) => {
    setIsMobileMenuOpen(open);
    if (onMobileMenuToggle) onMobileMenuToggle(open);
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('sp_mobile_menu_toggle', { detail: { open } }));
    }
  };

  // Close menus on route change
  useEffect(() => {
    setMobileMenu(false);
    setIsSearchOpen(false);
    setIsAllCatsOpen(false);
    setHoveredCatId(null);
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

  // Close search & mega-menu dropdowns on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
      if (megaMenuRef.current && !megaMenuRef.current.contains(event.target as Node)) {
        setIsAllCatsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-rose-100 transition-all">
        {/* 1. Full-Width Single-Row Moving Announcement Marquee */}
        <div className="bg-gradient-to-r from-burgundy via-burgundy-800 to-rose-900 text-white text-[11px] sm:text-xs h-7 sm:h-8 flex items-center overflow-hidden border-b border-burgundy-950/20">
          {announcementText ? (
            <div className="w-full overflow-hidden whitespace-nowrap select-none">
              <div
                className="flex w-max items-center animate-marquee hover:[animation-play-state:paused]"
                style={{ animationDuration: `${marqueeDurationSec}s` }}
              >
                {/* Track Half 1 (4 repeats ensure even short promos exceed 2560px screens without gaps) */}
                <div className="flex items-center shrink-0">
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={`marquee-a-${i}`}
                      className="inline-flex items-center gap-5 sm:gap-8 px-4 sm:px-6 font-medium tracking-wide"
                    >
                      <span className="whitespace-pre">{announcementText}</span>
                      <span className="text-rose-300/70 text-[10px]" aria-hidden="true">✦</span>
                    </span>
                  ))}
                </div>
                {/* Track Half 2 (Exact duplicate for seamless -50% loop) */}
                <div className="flex items-center shrink-0" aria-hidden="true">
                  {[0, 1, 2, 3].map((i) => (
                    <span
                      key={`marquee-b-${i}`}
                      className="inline-flex items-center gap-5 sm:gap-8 px-4 sm:px-6 font-medium tracking-wide"
                    >
                      <span className="whitespace-pre">{announcementText}</span>
                      <span className="text-rose-300/70 text-[10px]">✦</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full" />
          )}
        </div>

        {/* 2. Main Navigation Bar (Clean Single-Line Core Navigation) */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-[70px] gap-2 sm:gap-4">
            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenu(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-700 hover:text-burgundy hover:bg-blush-50 transition-colors shrink-0"
              aria-label="Toggle Navigation Menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0">
              <div className="relative h-12 w-36 sm:h-14 sm:w-44">
                <Image
                  src="/images/logo.png"
                  alt="Secret Petal Store Logo"
                  fill
                  sizes="(max-width: 640px) 144px, 176px"
                  className="object-contain object-left sm:object-center"
                  priority
                  unoptimized
                />
              </div>
            </Link>

            {/* Desktop Core Navigation Links (Always Single-Line) */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium text-gray-700 whitespace-nowrap">
              <Link
                href="/"
                className={`transition-colors hover:text-burgundy py-1.5 relative whitespace-nowrap ${
                  pathname === '/' ? 'text-burgundy font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-burgundy' : ''
                }`}
              >
                Home
              </Link>
              <Link
                href="/shop"
                className={`transition-colors hover:text-burgundy py-1.5 relative whitespace-nowrap ${
                  pathname === '/shop' ? 'text-burgundy font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-burgundy' : ''
                }`}
              >
                All Products
              </Link>
              <Link
                href="/flash-deals"
                className={`transition-colors hover:text-burgundy py-1.5 relative whitespace-nowrap ${
                  pathname === '/flash-deals' ? 'text-burgundy font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-burgundy' : ''
                }`}
              >
                Flash Deals
              </Link>
              <Link
                href="/track-order"
                className={`transition-colors hover:text-burgundy py-1.5 relative whitespace-nowrap ${
                  pathname === '/track-order' ? 'text-burgundy font-bold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-burgundy' : ''
                }`}
              >
                Track Order
              </Link>
              <button
                type="button"
                onClick={() => setIsCalculatorOpen(true)}
                className="flex items-center gap-1.5 text-xs font-semibold text-burgundy bg-blush-50 hover:bg-rose-100/80 border border-rose-200/80 px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
              >
                <Ruler className="w-3.5 h-3.5 text-burgundy" />
                <span>Bra Size Calculator</span>
              </button>
            </nav>

            {/* Right Action Icons & Search */}
            <div className="flex items-center gap-1 sm:gap-2.5 shrink-0">
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

        {/* 2.5 Desktop Categories Strip (Single-Row + Responsive Multi-Column Mega Menu) */}
        {headerCategories.length > 0 && (
          <div className="hidden lg:block border-t border-rose-100/80 bg-gradient-to-r from-blush-50/70 via-white to-blush-50/70">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-center gap-2 xl:gap-4 py-1.5 relative">
                {visibleInlineCategories.map((cat, idx) => {
                  const catSubs = subcategories.filter((s) => s.category_id === cat.id);
                  const isHovered = hoveredCatId === cat.id;

                  return (
                    <div
                      key={cat.id}
                      className={`relative shrink-0 ${idx >= 5 ? 'hidden xl:block' : ''}`}
                      onMouseEnter={() => {
                        setHoveredCatId(cat.id);
                        setIsAllCatsOpen(false);
                      }}
                      onMouseLeave={() => setHoveredCatId(null)}
                    >
                      <Link
                        href={`/shop?cat=${cat.slug}`}
                        className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-gray-700 hover:text-burgundy hover:bg-rose-50/80 transition-colors whitespace-nowrap"
                      >
                        <span>{cat.name}</span>
                        {catSubs.length > 0 && (
                          <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-150 ${isHovered ? 'rotate-180 text-burgundy' : ''}`} />
                        )}
                      </Link>

                      {/* Subcategories Dropdown */}
                      {catSubs.length > 0 && isHovered && (
                        <div className="absolute top-full left-0 pt-1 z-50">
                          <div className="w-56 bg-white rounded-xl shadow-xl border border-rose-100 py-2 animate-in fade-in zoom-in-95 duration-150">
                            <Link
                              href={`/shop?cat=${cat.slug}`}
                              className="block px-3.5 py-1.5 text-xs font-bold text-burgundy hover:bg-blush-50"
                            >
                              All {cat.name}
                            </Link>
                            <div className="my-1 border-t border-rose-50" />
                            {catSubs.map((sub) => (
                              <Link
                                key={sub.id}
                                href={`/shop?cat=${cat.slug}&sub=${sub.slug}`}
                                className="block px-3.5 py-1.5 text-xs text-gray-700 hover:text-burgundy hover:bg-blush-50 transition-colors"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* All / More Categories Mega-Menu Trigger */}
                {headerCategories.length > 5 && (
                  <div
                    ref={megaMenuRef}
                    className={`relative shrink-0 ${headerCategories.length === 6 ? 'xl:hidden' : ''}`}
                    onMouseEnter={() => {
                      megaHoverAtRef.current = Date.now();
                      setIsAllCatsOpen(true);
                      setHoveredCatId(null);
                    }}
                    onMouseLeave={() => setIsAllCatsOpen(false)}
                  >
                    <button
                      type="button"
                      onClick={() => {
                        if (Date.now() - megaHoverAtRef.current < 300) {
                          setIsAllCatsOpen(true);
                        } else {
                          setIsAllCatsOpen((prev) => !prev);
                        }
                      }}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all whitespace-nowrap ${
                        isAllCatsOpen
                          ? 'bg-burgundy !text-white border-burgundy shadow-xs'
                          : 'bg-rose-50/90 text-burgundy border-rose-200 hover:bg-rose-100'
                      }`}
                    >
                      <LayoutGrid className="w-3.5 h-3.5 shrink-0" />
                      <span>All Categories ({headerCategories.length})</span>
                      <ChevronDown className={`w-3 h-3 shrink-0 transition-transform duration-150 ${isAllCatsOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Responsive Multi-Column Category Mega-Menu */}
                    {isAllCatsOpen && (
                      <div className="fixed left-1/2 -translate-x-1/2 mt-0 pt-2 z-50 w-[min(92vw,860px)]">
                        <div className="bg-white rounded-2xl shadow-2xl border border-rose-100 p-5 max-h-[72vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                          <div className="flex items-center justify-between pb-3 mb-3 border-b border-rose-100">
                            <div>
                              <h3 className="font-serif font-bold text-sm text-gray-900">
                                Browse All Collections
                              </h3>
                              <p className="text-[11px] text-gray-500">
                                Select any category or subcategory to filter products
                              </p>
                            </div>
                            <Link
                              href="/shop"
                              onClick={() => setIsAllCatsOpen(false)}
                              className="text-xs font-bold text-burgundy hover:underline whitespace-nowrap"
                            >
                              View Entire Shop →
                            </Link>
                          </div>

                          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                            {headerCategories.map((cat) => {
                              const catSubs = subcategories.filter((s) => s.category_id === cat.id);
                              return (
                                <div
                                  key={`mega-${cat.id}`}
                                  className="p-2.5 rounded-xl border border-rose-100/70 hover:border-rose-200 hover:bg-blush-50/50 transition-colors"
                                >
                                  <Link
                                    href={`/shop?cat=${cat.slug}`}
                                    onClick={() => setIsAllCatsOpen(false)}
                                    className="flex items-center gap-2.5 group"
                                  >
                                    <div className="relative w-9 h-9 rounded-full overflow-hidden border border-rose-200 bg-rose-50 shrink-0">
                                      <Image
                                        src={cat.image_url}
                                        alt={cat.name}
                                        fill
                                        sizes="36px"
                                        className="object-cover"
                                        unoptimized
                                      />
                                    </div>
                                    <span className="text-xs font-bold text-gray-800 group-hover:text-burgundy leading-snug">
                                      {cat.name}
                                    </span>
                                  </Link>

                                  {catSubs.length > 0 && (
                                    <div className="mt-2 pl-11 flex flex-wrap gap-1.5">
                                      {catSubs.map((sub) => (
                                        <Link
                                          key={`mega-sub-${sub.id}`}
                                          href={`/shop?cat=${cat.slug}&sub=${sub.slug}`}
                                          onClick={() => setIsAllCatsOpen(false)}
                                          className="text-[11px] px-2 py-0.5 rounded-md bg-white border border-rose-100 text-gray-600 hover:text-burgundy hover:border-burgundy/40 transition-colors"
                                        >
                                          {sub.name}
                                        </Link>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
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
              <div className="mt-4 space-y-1 overflow-y-auto max-h-[calc(100vh-230px)] pr-1">
                <Link
                  href="/"
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-medium text-gray-800 hover:bg-blush-50 hover:text-burgundy transition-colors"
                >
                  <span>Home</span>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </Link>

                <Link
                  href="/shop"
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-medium text-gray-800 hover:bg-blush-50 hover:text-burgundy transition-colors"
                >
                  <span>All Products</span>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </Link>

                {/* Categories with Subcategories Accordion */}
                {headerCategories.map((cat) => {
                  const catSubs = subcategories.filter((s) => s.category_id === cat.id);
                  const isExpanded = mobileExpandedCat === cat.id;

                  return (
                    <div key={cat.id} className="rounded-lg overflow-hidden">
                      <div className="flex items-center justify-between py-2 px-3 rounded-lg text-sm font-medium text-gray-800 hover:bg-blush-50 hover:text-burgundy transition-colors">
                        <Link
                          href={`/shop?cat=${cat.slug}`}
                          onClick={() => setMobileMenu(false)}
                          className="flex-1"
                        >
                          {cat.name}
                        </Link>
                        {catSubs.length > 0 && (
                          <button
                            type="button"
                            onClick={() => setMobileExpandedCat(isExpanded ? null : cat.id)}
                            className="p-1 text-gray-400 hover:text-burgundy"
                          >
                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180 text-burgundy' : ''}`} />
                          </button>
                        )}
                      </div>

                      {/* Subcategories list */}
                      {catSubs.length > 0 && isExpanded && (
                        <div className="pl-4 pr-2 py-1 space-y-1 bg-blush-50/50 rounded-lg ml-2 border-l-2 border-rose-200">
                          <Link
                            href={`/shop?cat=${cat.slug}`}
                            onClick={() => setMobileMenu(false)}
                            className="block py-1 px-2 text-xs font-bold text-burgundy"
                          >
                            All {cat.name}
                          </Link>
                          {catSubs.map((sub) => (
                            <Link
                              key={sub.id}
                              href={`/shop?cat=${cat.slug}&sub=${sub.slug}`}
                              onClick={() => setMobileMenu(false)}
                              className="block py-1 px-2 text-xs text-gray-600 hover:text-burgundy"
                            >
                              {sub.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}

                <Link
                  href="/flash-deals"
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-medium text-gray-800 hover:bg-blush-50 hover:text-burgundy transition-colors"
                >
                  <span>Flash Deals</span>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </Link>

                <Link
                  href="/track-order"
                  onClick={() => setMobileMenu(false)}
                  className="flex items-center justify-between py-2.5 px-3 rounded-lg text-sm font-medium text-gray-800 hover:bg-blush-50 hover:text-burgundy transition-colors"
                >
                  <span>Track Order</span>
                  <ChevronRight className="w-4 h-4 text-gray-300" />
                </Link>

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
