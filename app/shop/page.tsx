'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { SlidersHorizontal, ChevronLeft, ChevronRight, X } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { ProductCardSkeleton } from '@/components/FlashSkeleton';
import { Product, Category, Subcategory } from '@/lib/types';
import { getProducts, getCategories, getSubcategories } from '@/lib/db';

const ITEMS_PER_PAGE = 8;

function ShopContent() {
  const searchParams = useSearchParams();
  const initialCategorySlug = searchParams.get('cat') || '';

  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);

  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategorySlug);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load Categories & Subcategories
  useEffect(() => {
    async function loadMeta() {
      const [cats, subs] = await Promise.all([getCategories(), getSubcategories()]);
      setCategories(cats);
      setSubcategories(subs);
    }
    loadMeta();
  }, []);

  // Update selectedCategory if URL param changes
  useEffect(() => {
    if (initialCategorySlug) {
      setSelectedCategory(initialCategorySlug);
      setCurrentPage(1);
    }
  }, [initialCategorySlug]);

  // Load Products
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        let catId: string | undefined;
        let subId: string | undefined;

        if (selectedCategory) {
          const matchCat = categories.find((c) => c.slug === selectedCategory);
          if (matchCat) catId = matchCat.id;
        }

        if (selectedSubcategory) {
          const matchSub = subcategories.find((s) => s.slug === selectedSubcategory);
          if (matchSub) subId = matchSub.id;
        }

        const prods = await getProducts({
          categoryId: catId,
          subcategoryId: subId,
        });

        // Sort items
        let sorted = [...prods];
        if (sortBy === 'price-low') {
          sorted.sort((a, b) => (a.sale_price || a.price) - (b.sale_price || b.price));
        } else if (sortBy === 'price-high') {
          sorted.sort((a, b) => (b.sale_price || b.price) - (a.sale_price || a.price));
        } else {
          // newest
          sorted.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
        }

        setProducts(sorted);
      } catch (e) {
        console.error('Failed to load shop products:', e);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [selectedCategory, selectedSubcategory, sortBy, categories, subcategories]);

  // Available subcategories for currently selected category
  const activeCategoryId = categories.find((c) => c.slug === selectedCategory)?.id;
  const filteredSubcategories = activeCategoryId
    ? subcategories.filter((s) => s.category_id === activeCategoryId)
    : [];

  // Pagination Logic (Strictly 8 products per page)
  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const currentProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-gray-50/50 min-h-screen py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Title & Breadcrumb */}
        <div className="mb-6">
          <span className="text-[11px] uppercase tracking-wider font-bold text-burgundy">Catalog</span>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-gray-900">
            {selectedCategory
              ? categories.find((c) => c.slug === selectedCategory)?.name || 'Products'
              : 'All Women\'s Intimate Wear'}
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Showing <strong>{currentProducts.length}</strong> of <strong>{products.length}</strong> available items
          </p>
        </div>

        {/* Filter & Sorting Bar */}
        <div className="bg-white rounded-xl p-3 border border-rose-100 mb-6 flex flex-wrap items-center justify-between gap-3 shadow-xs">
          {/* Category Tabs (Desktop) */}
          <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('');
                setSelectedSubcategory('');
                setCurrentPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                !selectedCategory ? 'bg-burgundy text-white shadow-xs' : 'bg-blush-50 text-gray-700 hover:bg-blush'
              }`}
            >
              All
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat.slug);
                  setSelectedSubcategory('');
                  setCurrentPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedCategory === cat.slug
                    ? 'bg-burgundy text-white shadow-xs'
                    : 'bg-blush-50 text-gray-700 hover:bg-blush'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Mobile Filter Button */}
          <button
            type="button"
            onClick={() => setIsFilterModalOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-1.5 bg-blush-50 text-burgundy text-xs font-semibold rounded-lg border border-rose-200"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filter Categories {selectedCategory ? '(1)' : ''}</span>
          </button>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500 hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs text-gray-800 focus:outline-none focus:border-burgundy"
            >
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Subcategories Pills (When category is selected) */}
        {filteredSubcategories.length > 0 && (
          <div className="flex items-center gap-2 mb-6 overflow-x-auto no-scrollbar pb-1">
            <span className="text-xs font-bold text-gray-500 shrink-0">Sub-Types:</span>
            <button
              type="button"
              onClick={() => {
                setSelectedSubcategory('');
                setCurrentPage(1);
              }}
              className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 transition-colors ${
                !selectedSubcategory ? 'bg-burgundy text-white' : 'bg-white border border-rose-200 text-gray-700'
              }`}
            >
              All
            </button>
            {filteredSubcategories.map((sub) => (
              <button
                key={sub.id}
                type="button"
                onClick={() => {
                  setSelectedSubcategory(sub.slug);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded-full text-xs font-medium shrink-0 transition-colors whitespace-nowrap ${
                  selectedSubcategory === sub.slug
                    ? 'bg-burgundy text-white'
                    : 'bg-white border border-rose-200 text-gray-700 hover:border-burgundy'
                }`}
              >
                {sub.name}
              </button>
            ))}
          </div>
        )}

        {/* Product Grid (2 columns on mobile, 4 on desktop) */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        ) : currentProducts.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-rose-100 max-w-md mx-auto my-8">
            <p className="font-serif font-bold text-lg text-gray-800 mb-1">No products found</p>
            <p className="text-xs text-gray-500 mb-4">Try clearing category filters to view more items.</p>
            <button
              type="button"
              onClick={() => {
                setSelectedCategory('');
                setSelectedSubcategory('');
              }}
              className="px-4 py-2 bg-burgundy text-white text-xs font-semibold rounded-lg hover:bg-burgundy-900"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2.5 sm:gap-4">
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Pagination Bar (Page 1, 2, 3, 4...) */}
        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-1.5 sm:gap-2">
            <button
              type="button"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-rose-200 text-gray-600 hover:bg-blush-50 disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => handlePageChange(pageNum)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all ${
                  currentPage === pageNum
                    ? 'bg-burgundy text-white shadow-xs'
                    : 'bg-white border border-rose-200 text-gray-700 hover:bg-blush-50'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              type="button"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-rose-200 text-gray-600 hover:bg-blush-50 disabled:opacity-40 disabled:hover:bg-transparent"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Mobile Filter Drawer Modal */}
      {isFilterModalOpen && (
        <div className="fixed inset-0 z-50 flex justify-end lg:hidden animate-in fade-in duration-200">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsFilterModalOpen(false)} />
          <div className="relative w-4/5 max-w-xs bg-white h-full shadow-2xl p-5 z-10 flex flex-col justify-between animate-in slide-in-from-right duration-300">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-rose-100">
                <h3 className="font-serif font-bold text-base text-gray-900">Filter by Category</h3>
                <button
                  type="button"
                  onClick={() => setIsFilterModalOpen(false)}
                  className="p-1 rounded-full text-gray-400 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('');
                    setSelectedSubcategory('');
                  }}
                  className={`w-full text-left py-2 px-3 rounded-lg text-xs font-semibold ${
                    !selectedCategory ? 'bg-burgundy text-white' : 'hover:bg-blush-50 text-gray-800'
                  }`}
                >
                  All Categories
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat.slug);
                      setSelectedSubcategory('');
                    }}
                    className={`w-full text-left py-2 px-3 rounded-lg text-xs font-medium ${
                      selectedCategory === cat.slug ? 'bg-burgundy text-white font-bold' : 'hover:bg-blush-50 text-gray-700'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-rose-100">
              <button
                type="button"
                onClick={() => {
                  setCurrentPage(1);
                  setIsFilterModalOpen(false);
                }}
                className="w-full py-2.5 bg-burgundy text-white font-semibold text-xs rounded-xl shadow-xs"
              >
                Apply Filters ({products.length} Products)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="h-8 w-48 bg-rose-100 rounded mb-6 animate-pulse" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
