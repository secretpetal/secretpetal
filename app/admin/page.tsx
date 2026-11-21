'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  ShoppingCart,
  Image as ImageIcon,
  Tag,
  Settings,
  Eye,
  EyeOff,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Download,
  RefreshCw,
  Printer,
  Check,
  X,
  AlertTriangle,
  Upload,
  CheckCircle2,
  Clock,
  Truck,
  ShieldCheck,
  Search,
  ExternalLink,
  Lock,
  Ticket
} from 'lucide-react';
import {
  Product,
  Category,
  Subcategory,
  Banner,
  Order,
  SiteSettings,
  Coupon
} from '@/lib/types';
import {
  getProducts,
  saveProduct,
  deleteProduct,
  getCategories,
  saveCategory,
  deleteCategory,
  getSubcategories,
  saveSubcategory,
  deleteSubcategory,
  getBanners,
  saveBanner,
  deleteBanner,
  getOrders,
  updateOrderStatus,
  deleteOrder,
  getCoupons,
  saveCoupon,
  deleteCoupon,
  getSiteSettings,
  saveSiteSettings,
  uploadMedia,
  DEFAULT_PRODUCTS,
  DEFAULT_CATEGORIES,
  DEFAULT_SUBCATEGORIES,
  DEFAULT_BANNERS,
  DEFAULT_SITE_SETTINGS
} from '@/lib/db';

const MASTER_ADMIN_PIN = process.env.NEXT_PUBLIC_ADMIN_PIN || 'secretpetal_SecureLingerie#2026!786';

type AdminTab = 'dashboard' | 'products' | 'categories' | 'orders' | 'banners' | 'coupons' | 'settings';

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState('');
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutSeconds, setLockoutSeconds] = useState(0);

  // Security Lockout Countdown Timer
  useEffect(() => {
    if (lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockoutSeconds((prev) => (prev > 1 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Data states
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SITE_SETTINGS);

  // Search & Filters in Admin
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState('all');

  // Modals state
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);

  const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState(false);
  const [editingSubcategory, setEditingSubcategory] = useState<Partial<Subcategory> | null>(null);

  const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Partial<Banner> | null>(null);

  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<Partial<Coupon> | null>(null);

  const [selectedProofUrl, setSelectedProofUrl] = useState<string | null>(null);
  const [printInvoiceOrder, setPrintInvoiceOrder] = useState<Order | null>(null);

  // Custom Confirmation Dialog (Replaces localhost popups)
  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({ isOpen: false, title: '', message: '', onConfirm: () => {} });

  // Auto-Sync 30s status
  const [lastSyncedTime, setLastSyncedTime] = useState<string>('Just now');
  const [isSyncing, setIsSyncing] = useState(false);

  // Check Session Login on Mount
  useEffect(() => {
    const session = sessionStorage.getItem('sp_admin_auth');
    if (session === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Load All Admin Data
  const loadAllData = async (silent: boolean = false) => {
    if (!silent) setIsSyncing(true);
    try {
      const [prods, cats, subs, bans, ords, sttngs, cpns] = await Promise.all([
        getProducts(),
        getCategories(),
        getSubcategories(),
        getBanners({ includeInactive: true }),
        getOrders(),
        getSiteSettings(),
        getCoupons(),
      ]);
      setProducts(prods);
      setCategories(cats);
      setSubcategories(subs);
      setBanners(bans);
      setOrders(ords);
      if (sttngs) setSettings(sttngs);
      if (cpns) setCoupons(cpns);
      setLastSyncedTime(new Date().toLocaleTimeString());
    } catch (err) {
      console.error('Data sync error:', err);
    } finally {
      setIsSyncing(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      loadAllData();
      // Real-time custom event listeners for instant multi-tab sync
      const handleStoreUpdate = () => loadAllData(true);
      window.addEventListener('sp_products_updated', handleStoreUpdate);
      window.addEventListener('sp_categories_updated', handleStoreUpdate);
      window.addEventListener('sp_orders_updated', handleStoreUpdate);
      window.addEventListener('sp_banners_updated', handleStoreUpdate);
      window.addEventListener('sp_coupons_updated', handleStoreUpdate);
      window.addEventListener('sp_settings_updated', handleStoreUpdate);

      // 30-Second Silent Auto-Sync
      const interval = setInterval(() => {
        loadAllData(true);
      }, 30000);

      return () => {
        window.removeEventListener('sp_products_updated', handleStoreUpdate);
        window.removeEventListener('sp_categories_updated', handleStoreUpdate);
        window.removeEventListener('sp_orders_updated', handleStoreUpdate);
        window.removeEventListener('sp_banners_updated', handleStoreUpdate);
        window.removeEventListener('sp_coupons_updated', handleStoreUpdate);
        window.removeEventListener('sp_settings_updated', handleStoreUpdate);
        clearInterval(interval);
      };
    }
  }, [isAuthenticated]);

  // Handle Authentication with Rate-Limiting Protection
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds > 0) return;

    if (passwordInput.trim() === MASTER_ADMIN_PIN) {
      setIsAuthenticated(true);
      sessionStorage.setItem('sp_admin_auth', 'true');
      setAuthError('');
      setFailedAttempts(0);
    } else {
      const nextFailed = failedAttempts + 1;
      setFailedAttempts(nextFailed);
      if (nextFailed >= 5) {
        setLockoutSeconds(60);
        setAuthError('Too many failed attempts. Security cooldown active for 60 seconds.');
      } else {
        setAuthError(`Invalid Security Key. (${5 - nextFailed} attempts remaining before cooldown).`);
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('sp_admin_auth');
  };

  // 1-Click CSV Export for Products
  const handleExportCSV = () => {
    if (products.length === 0) {
      triggerToast('No products available to export.');
      return;
    }

    const headers = [
      'ID',
      'Title',
      'Slug',
      'SKU',
      'Price',
      'Sale Price',
      'Stock',
      'Category ID',
      'Subcategory ID',
      'Thumbnail URL',
      'Gallery URLs',
      'Sizes',
      'Colors',
      'Is Featured',
      'Is Flash Deal'
    ];

    const rows = products.map((p) => [
      p.id,
      `"${p.title.replace(/"/g, '""')}"`,
      p.slug,
      p.sku || '',
      p.price,
      p.sale_price || '',
      p.stock,
      p.category_id || '',
      p.subcategory_id || '',
      p.thumbnail_url,
      `"${(p.gallery_urls || []).join(';')}"`,
      `"${(p.sizes || []).join(';')}"`,
      `"${(p.colors || []).join(';')}"`,
      p.is_featured ? 'Yes' : 'No',
      p.is_flash_deal ? 'Yes' : 'No'
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `secretpetal_products_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    triggerToast('Product catalog exported successfully to CSV!');
  };

  // ==========================================
  // AUTHENTICATION VIEW
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-burgundy-950 via-burgundy to-rose-900 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-white/20 text-center animate-in zoom-in-95 duration-200">
          <div className="relative w-44 h-14 mx-auto mb-4">
            <Image
              src="/images/logo.png"
              alt="Secret Petal"
              fill
              className="object-contain"
              priority
              unoptimized
            />
          </div>

          <div className="w-12 h-12 bg-blush-100 text-burgundy rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Lock className="w-6 h-6" />
          </div>

          <h1 className="font-serif font-bold text-xl sm:text-2xl text-gray-900 mb-1">
            Admin Management Gate
          </h1>
          <p className="text-xs text-gray-500 mb-6">
            Enter your secret master credential to access store controls.
          </p>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Master Security Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="secretpetal_..."
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  required
                  className="w-full pl-3 pr-10 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-burgundy font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-burgundy"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <p className="text-xs text-red-600 bg-red-50 p-2.5 rounded-lg border border-red-100">
                {authError}
              </p>
            )}

            <button
              type="submit"
              disabled={lockoutSeconds > 0}
              className={`w-full py-3 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md ${
                lockoutSeconds > 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-burgundy hover:bg-burgundy-900 active:scale-[0.99]'
              }`}
            >
              {lockoutSeconds > 0 ? `Locked (${lockoutSeconds}s cooldown)` : 'Unlock Admin Portal'}
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-gray-100 text-[11px] text-gray-400">
            <span>Live Cloud Database • Encrypted Session Gate</span>
          </div>
        </div>
      </div>
    );
  }

  // Calculate Dashboard Metrics
  const totalRevenue = orders.reduce((acc, o) => acc + (o.grand_total || 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.order_status === 'Pending').length;
  const outOfStockCount = products.filter((p) => p.stock <= 0).length;

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 text-gray-900 font-sans">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 bg-burgundy text-white px-4 py-2.5 rounded-xl shadow-lg text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-top-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ======================================================== */}
      {/* 1. FIXED/STICKY LEFT SIDEBAR (NEVER SCROLLS WITH CONTENT) */}
      {/* ======================================================== */}
      <aside className="w-64 bg-white border-r border-rose-100 flex flex-col justify-between shrink-0 h-screen sticky top-0 z-30 select-none">
        <div>
          {/* Logo Brand Header */}
          <div className="p-4 border-b border-rose-100 flex items-center justify-between">
            <div className="relative h-10 w-36">
              <Image src="/images/logo.png" alt="Secret Petal" fill sizes="144px" className="object-contain" unoptimized />
            </div>
            <span className="text-[10px] font-bold bg-blush-100 text-burgundy px-1.5 py-0.5 rounded">
              v2.0
            </span>
          </div>

          {/* Navigation Hubs */}
          <nav className="p-3 space-y-1 overflow-y-auto">
            <button
              type="button"
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'dashboard' ? 'bg-burgundy text-white shadow-xs' : 'text-gray-600 hover:bg-blush-50'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('products')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'products' ? 'bg-burgundy text-white shadow-xs' : 'text-gray-600 hover:bg-blush-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Package className="w-4 h-4" />
                <span>Product Manager</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'products' ? 'bg-white/20' : 'bg-rose-100 text-burgundy'}`}>
                {products.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('categories')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'categories' ? 'bg-burgundy text-white shadow-xs' : 'text-gray-600 hover:bg-blush-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <FolderTree className="w-4 h-4" />
                <span>Categories &amp; Tags</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'categories' ? 'bg-white/20' : 'bg-rose-100 text-burgundy'}`}>
                {categories.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('orders')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'orders' ? 'bg-burgundy text-white shadow-xs' : 'text-gray-600 hover:bg-blush-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <ShoppingCart className="w-4 h-4" />
                <span>Order Manager</span>
              </div>
              {pendingOrdersCount > 0 && (
                <span className="text-[10px] bg-amber-500 text-white font-bold px-1.5 py-0.2 rounded-full">
                  {pendingOrdersCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('banners')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'banners' ? 'bg-burgundy text-white shadow-xs' : 'text-gray-600 hover:bg-blush-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <ImageIcon className="w-4 h-4" />
                <span>Banners Hub</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'banners' ? 'bg-white/20' : 'bg-rose-100 text-burgundy'}`}>
                {banners.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('coupons')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'coupons' ? 'bg-burgundy text-white shadow-xs' : 'text-gray-600 hover:bg-blush-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Ticket className="w-4 h-4" />
                <span>Coupons &amp; Deals</span>
              </div>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${activeTab === 'coupons' ? 'bg-white/20' : 'bg-rose-100 text-burgundy'}`}>
                {coupons.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'settings' ? 'bg-burgundy text-white shadow-xs' : 'text-gray-600 hover:bg-blush-50'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Store &amp; Payment Accounts</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-3 border-t border-rose-100 space-y-2">
          {/* 30s Auto Sync Indicator */}
          <div className="p-2 bg-blush-50/70 rounded-lg text-[10px] flex items-center justify-between text-gray-500">
            <span className="flex items-center gap-1">
              <span className={`w-2 h-2 rounded-full ${isSyncing ? 'bg-amber-500 animate-ping' : 'bg-emerald-500'}`} />
              Cloud Sync: Active
            </span>
            <span>{lastSyncedTime}</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[11px] font-semibold text-gray-500 hover:text-burgundy flex items-center gap-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>View Storefront</span>
            </Link>

            <button
              type="button"
              onClick={handleLogout}
              className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* ======================================================== */}
      {/* 2. RIGHT-SIDE SCROLLABLE CONTENT AREA                    */}
      {/* ======================================================== */}
      <main className="flex-1 h-screen overflow-y-auto p-4 sm:p-6 lg:p-8">
        {/* ======================================================== */}
        {/* TAB 1: DASHBOARD OVERVIEW                                */}
        {/* ======================================================== */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6 max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-gray-200">
              <div>
                <h1 className="font-serif font-bold text-2xl text-gray-900">Store Dashboard Overview</h1>
                <p className="text-xs text-gray-500">Real-time metrics, order alerts, and quick actions.</p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => loadAllData()}
                  className="px-3 py-1.5 bg-white border border-gray-200 text-xs font-semibold rounded-lg hover:bg-gray-50 flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>Sync Now</span>
                </button>
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 bg-burgundy text-white text-xs font-semibold rounded-lg hover:bg-burgundy-900 flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Catalog (CSV)</span>
                </button>
              </div>
            </div>

            {/* Stat Cards Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-xs">
                <span className="text-[11px] font-semibold text-gray-400 uppercase">Total Revenue</span>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-burgundy mt-1">
                  Rs. {totalRevenue.toLocaleString()}
                </h3>
                <span className="text-[10px] text-emerald-600 font-medium">All recorded sales</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-xs">
                <span className="text-[11px] font-semibold text-gray-400 uppercase">Total Orders</span>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-gray-900 mt-1">
                  {orders.length}
                </h3>
                <span className="text-[10px] text-amber-600 font-bold">{pendingOrdersCount} Pending dispatch</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-xs">
                <span className="text-[11px] font-semibold text-gray-400 uppercase">Active Products</span>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-gray-900 mt-1">
                  {products.length}
                </h3>
                <span className="text-[10px] text-gray-500">{categories.length} Categories</span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-rose-100 shadow-xs">
                <span className="text-[11px] font-semibold text-gray-400 uppercase">Inventory Health</span>
                <h3 className="font-serif font-bold text-xl sm:text-2xl text-gray-900 mt-1">
                  {outOfStockCount === 0 ? 'Optimal' : `${outOfStockCount} Low`}
                </h3>
                <span className="text-[10px] text-emerald-600">Discreet Gujranwala stock</span>
              </div>
            </div>

            {/* Recent Orders Preview */}
            <div className="bg-white rounded-2xl border border-rose-100 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-base text-gray-900">Recent Customer Orders</h3>
                <button
                  type="button"
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-semibold text-burgundy hover:underline"
                >
                  View All Orders →
                </button>
              </div>

              {orders.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-6">No orders placed yet.</p>
              ) : (
                <div className="divide-y divide-rose-50 overflow-x-auto">
                  {orders.slice(0, 5).map((ord) => (
                    <div key={ord.id} className="py-2.5 flex items-center justify-between text-xs gap-4">
                      <div>
                        <strong className="font-serif text-burgundy">{ord.order_number}</strong>
                        <p className="text-gray-700 font-medium">{ord.customer_name} • {ord.city}</p>
                      </div>
                      <div className="text-right">
                        <strong className="block text-gray-900">Rs. {ord.grand_total.toLocaleString()}</strong>
                        <span className="text-[10px] px-2 py-0.5 rounded-full font-bold uppercase bg-amber-100 text-amber-800">
                          {ord.order_status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 2: PRODUCT MANAGER (CRUD, MULTI-IMAGE, CSV EXPORT)   */}
        {/* ======================================================== */}
        {activeTab === 'products' && (
          <div className="space-y-6 max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-200">
              <div>
                <h1 className="font-serif font-bold text-2xl text-gray-900">Product Manager</h1>
                <p className="text-xs text-gray-500">Add, edit, or delete catalog items with WebP image uploads.</p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="px-3 py-1.5 bg-white border border-rose-200 text-burgundy text-xs font-semibold rounded-lg hover:bg-blush-50 flex items-center gap-1.5"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download CSV</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingProduct({
                      title: '',
                      slug: '',
                      sku: 'SP-BRA-',
                      price: 2000,
                      sale_price: 1500,
                      stock: 20,
                      sizes: ['32B', '34B', '36B', '38B'],
                      colors: ['Blush Pink', 'Black', 'Nude'],
                      thumbnail_url: '',
                      gallery_urls: [],
                      description: '',
                      features: ['100% Cotton & Lace', 'Wireless Comfort'],
                      is_featured: true,
                      is_flash_deal: false,
                      is_active: true
                    });
                    setIsProductModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 bg-burgundy hover:bg-burgundy-900 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Product</span>
                </button>
              </div>
            </div>

            {/* Search Filter */}
            <div className="relative max-w-sm">
              <input
                type="text"
                placeholder="Search products by title, SKU..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl focus:outline-none focus:border-burgundy"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-2xl border border-rose-100 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-blush-50/70 border-b border-rose-100 text-gray-500 font-bold uppercase text-[10px]">
                      <th className="p-3">Product</th>
                      <th className="p-3">SKU</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Stock</th>
                      <th className="p-3">Flash</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rose-50">
                    {products
                      .filter((p) =>
                        p.title.toLowerCase().includes(productSearch.toLowerCase()) ||
                        (p.sku && p.sku.toLowerCase().includes(productSearch.toLowerCase()))
                      )
                      .map((p) => (
                        <tr key={p.id} className="hover:bg-blush-50/40 transition-colors">
                          <td className="p-3 flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-rose-50 shrink-0">
                              <Image src={p.thumbnail_url} alt={p.title} fill sizes="48px" className="object-cover" unoptimized />
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-900 truncate max-w-xs">{p.title}</p>
                              <span className="text-[10px] text-gray-400">{p.slug}</span>
                            </div>
                          </td>
                          <td className="p-3 font-mono text-gray-700">{p.sku || '-'}</td>
                          <td className="p-3">
                            <strong className="text-burgundy">Rs. {p.sale_price || p.price}</strong>
                            {p.sale_price && (
                              <span className="text-[10px] text-gray-400 line-through block">
                                Rs. {p.price}
                              </span>
                            )}
                          </td>
                          <td className="p-3">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${p.stock > 5 ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
                              {p.stock} units
                            </span>
                          </td>
                          <td className="p-3">
                            {p.is_flash_deal ? (
                              <span className="text-amber-600 font-bold text-[10px]">⚡ Active</span>
                            ) : (
                              <span className="text-gray-300 text-[10px]">No</span>
                            )}
                          </td>
                          <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                            <a
                              href={`/product?slug=${p.slug}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-gray-500 hover:text-burgundy bg-gray-50 hover:bg-blush-50 rounded-lg transition-colors inline-block align-middle"
                              title="View on Live Website"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingProduct(p);
                                setIsProductModalOpen(true);
                              }}
                              className="p-1.5 text-gray-600 hover:text-burgundy bg-gray-50 hover:bg-blush-50 rounded-lg transition-colors align-middle"
                              title="Edit Product"
                            >
                              <Edit className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setConfirmDialog({
                                  isOpen: true,
                                  title: 'Delete Product',
                                  message: `Are you sure you want to permanently delete "${p.title}"?`,
                                  onConfirm: async () => {
                                    await deleteProduct(p.id);
                                    await loadAllData();
                                    triggerToast('Product deleted successfully');
                                  }
                                });
                              }}
                              className="p-1.5 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 3: CATEGORIES & SUBCATEGORIES (DARAZ-STYLE)          */}
        {/* ======================================================== */}
        {activeTab === 'categories' && (
          <div className="space-y-6 max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-200">
              <div>
                <h1 className="font-serif font-bold text-2xl text-gray-900">Categories &amp; Subcategories</h1>
                <p className="text-xs text-gray-500">Multi-tier hierarchy with &apos;Show on Homepage Top Categories&apos; toggle.</p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setEditingSubcategory({ name: '', slug: '', category_id: categories[0]?.id || '' });
                    setIsSubcategoryModalOpen(true);
                  }}
                  className="px-3 py-1.5 bg-white border border-rose-200 text-burgundy text-xs font-semibold rounded-lg hover:bg-blush-50 flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Subcategory</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingCategory({ name: '', slug: '', image_url: '', show_in_top_categories: true });
                    setIsCategoryModalOpen(true);
                  }}
                  className="px-3.5 py-1.5 bg-burgundy hover:bg-burgundy-900 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Main Category</span>
                </button>
              </div>
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((cat) => {
                const childSubs = subcategories.filter((s) => s.category_id === cat.id);
                return (
                  <div key={cat.id} className="bg-white rounded-2xl border border-rose-100 p-4 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-3">
                        <div className="relative w-12 h-12 rounded-full overflow-hidden bg-rose-50 shrink-0 border border-rose-200">
                          <Image src={cat.image_url} alt={cat.name} fill sizes="48px" className="object-cover" unoptimized />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-serif font-bold text-sm text-gray-900 truncate">{cat.name}</h3>
                          <span className="text-[10px] text-gray-400">{cat.slug}</span>
                        </div>
                      </div>

                      {/* Homepage Top Categories Toggle Switch */}
                      <label className="flex items-center justify-between p-2 bg-blush-50 rounded-lg text-xs cursor-pointer mb-3">
                        <span className="text-[11px] font-semibold text-gray-700">Show in Top Categories:</span>
                        <input
                          type="checkbox"
                          checked={cat.show_in_top_categories !== false}
                          onChange={async (e) => {
                            await saveCategory({ ...cat, show_in_top_categories: e.target.checked });
                            await loadAllData();
                            triggerToast(`Updated top categories display for ${cat.name}`);
                          }}
                          className="accent-burgundy w-4 h-4"
                        />
                      </label>

                      {/* Subcategories Tags List */}
                      <div>
                        <span className="text-[10px] uppercase font-bold text-gray-400 block mb-1">
                          Sub-Categories ({childSubs.length}):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {childSubs.length === 0 ? (
                            <span className="text-[10px] text-gray-400 italic">No subcategories</span>
                          ) : (
                            childSubs.map((sub) => (
                              <span
                                key={sub.id}
                                className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 rounded-md text-[10px] font-medium group"
                              >
                                {sub.name}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setConfirmDialog({
                                      isOpen: true,
                                      title: 'Delete Subcategory',
                                      message: `Delete subcategory "${sub.name}"?`,
                                      onConfirm: async () => {
                                        await deleteSubcategory(sub.id);
                                        await loadAllData();
                                        triggerToast('Subcategory removed');
                                      }
                                    });
                                  }}
                                  className="text-gray-400 hover:text-red-600"
                                >
                                  ×
                                </button>
                              </span>
                            ))
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Card Actions */}
                    <div className="mt-4 pt-3 border-t border-rose-50 flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingSubcategory({ name: '', slug: '', category_id: cat.id });
                          setIsSubcategoryModalOpen(true);
                        }}
                        className="text-[11px] font-semibold text-burgundy hover:underline flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Add Sub
                      </button>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingCategory(cat);
                            setIsCategoryModalOpen(true);
                          }}
                          className="p-1.5 text-gray-500 hover:text-burgundy rounded-lg hover:bg-blush-50"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setConfirmDialog({
                              isOpen: true,
                              title: 'Delete Category',
                              message: `Delete category "${cat.name}" and its subcategories?`,
                              onConfirm: async () => {
                                await deleteCategory(cat.id);
                                await loadAllData();
                                triggerToast('Category permanently removed');
                              }
                            });
                          }}
                          className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 4: ORDER MANAGER (STATUS, PAYMENT PROOF EYE, PRINT)  */}
        {/* ======================================================== */}
        {activeTab === 'orders' && (
          <div className="space-y-6 max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-200">
              <div>
                <h1 className="font-serif font-bold text-2xl text-gray-900">Customer Order Manager</h1>
                <p className="text-xs text-gray-500">Track shipments, verify payment screenshots, and print invoices.</p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2 text-xs">
                <span className="text-gray-500">Filter Status:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="px-2.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs"
                >
                  <option value="all">All Orders ({orders.length})</option>
                  <option value="Pending">Pending ({orders.filter(o => o.order_status === 'Pending').length})</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-2xl border border-rose-100 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-blush-50/70 border-b border-rose-100 text-gray-500 font-bold uppercase text-[10px]">
                      <th className="p-3">Order #</th>
                      <th className="p-3">Customer &amp; City</th>
                      <th className="p-3">Total Amount</th>
                      <th className="p-3">Payment Method</th>
                      <th className="p-3">Payment Proof</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rose-50">
                    {orders
                      .filter((o) => (orderStatusFilter === 'all' ? true : o.order_status === orderStatusFilter))
                      .map((ord) => (
                        <tr key={ord.id} className="hover:bg-blush-50/40 transition-colors">
                          <td className="p-3 font-serif font-bold text-burgundy whitespace-nowrap">
                            {ord.order_number}
                          </td>
                          <td className="p-3">
                            <strong className="text-gray-900 block">{ord.customer_name}</strong>
                            <span className="text-[11px] text-gray-500">{ord.phone} • {ord.city}</span>
                          </td>
                          <td className="p-3 font-bold text-gray-900 whitespace-nowrap">
                            Rs. {ord.grand_total.toLocaleString()}
                          </td>
                          <td className="p-3">
                            <span className="uppercase font-bold text-[10px] bg-gray-100 px-2 py-0.5 rounded text-gray-800">
                              {ord.payment_method}
                            </span>
                          </td>

                          {/* PAYMENT PROOF EYE OPTION */}
                          <td className="p-3">
                            {ord.payment_screenshot_url ? (
                              <button
                                type="button"
                                onClick={() => setSelectedProofUrl(ord.payment_screenshot_url!)}
                                className="inline-flex items-center gap-1 px-2 py-1 bg-burgundy/10 text-burgundy hover:bg-burgundy hover:text-white rounded-lg text-[10px] font-bold transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                <span>Inspect Proof</span>
                              </button>
                            ) : (
                              <span className="text-gray-300 text-[10px]">N/A (COD)</span>
                            )}
                          </td>

                          {/* Order Status Select */}
                          <td className="p-3">
                            <select
                              value={ord.order_status}
                              onChange={async (e) => {
                                const newStatus = e.target.value as Order['order_status'];
                                await updateOrderStatus(ord.id, newStatus);
                                await loadAllData();
                                triggerToast(`Order ${ord.order_number} marked as ${newStatus}`);
                              }}
                              className="px-2 py-1 bg-white border border-gray-200 rounded text-xs font-semibold"
                            >
                              <option value="Pending">Pending</option>
                              <option value="Confirmed">Confirmed</option>
                              <option value="Processing">Processing</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                              <option value="Cancelled">Cancelled</option>
                            </select>
                          </td>

                          {/* Actions */}
                          <td className="p-3 text-right whitespace-nowrap space-x-1.5">
                            <button
                              type="button"
                              onClick={() => setPrintInvoiceOrder(ord)}
                              className="p-1.5 text-gray-600 hover:text-burgundy bg-gray-50 hover:bg-blush-50 rounded-lg transition-colors inline-flex items-center gap-1 text-[11px] font-medium"
                              title="Print Invoice"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Invoice</span>
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setConfirmDialog({
                                  isOpen: true,
                                  title: 'Delete Order Record',
                                  message: `Permanently delete order ${ord.order_number} for customer "${ord.customer_name}"?`,
                                  onConfirm: async () => {
                                    await deleteOrder(ord.id);
                                    await loadAllData();
                                    triggerToast(`Order ${ord.order_number} deleted`);
                                  }
                                });
                              }}
                              className="p-1.5 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center"
                              title="Delete Order"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 5: BANNERS HUB (PURE IMAGES, SIZES CLEARLY MENTIONED) */}
        {/* ======================================================== */}
        {activeTab === 'banners' && (
          <div className="space-y-6 max-w-6xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-200">
              <div>
                <h1 className="font-serif font-bold text-2xl text-gray-900">Banners Hub</h1>
                <p className="text-xs text-gray-500">Pure visual banners with no overlaid text clutter.</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingBanner({
                    title: 'New Promo Banner',
                    image_url: '',
                    mobile_image_url: '',
                    link_url: '/shop',
                    is_active: true
                  });
                  setIsBannerModalOpen(true);
                }}
                className="px-3.5 py-1.5 bg-burgundy hover:bg-burgundy-900 text-white text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Upload Banner</span>
              </button>
            </div>

            {/* Banner Size Guidelines Alert */}
            <div className="p-4 bg-blush-50 rounded-2xl border border-rose-200 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-burgundy shrink-0 mt-0.5" />
              <div className="text-xs text-gray-700 space-y-1">
                <h4 className="font-bold text-burgundy">Recommended Image Dimensions for Seamless Display:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  <p>• <strong>Desktop Banner:</strong> 1920 × 600 px (3.2 : 1 aspect ratio)</p>
                  <p>• <strong>Mobile Banner:</strong> 800 × 600 px (4 : 3 aspect ratio)</p>
                </div>
                <p className="text-[10px] text-gray-500">
                  All uploads are automatically compressed into ultra-lightweight WebP in tiny KBs.
                </p>
              </div>
            </div>

            {/* Banners List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {banners.map((ban, idx) => (
                <div key={ban.id} className="bg-white rounded-2xl border border-rose-100 p-4 shadow-xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-xs text-gray-900">
                      Banner #{idx + 1}: {ban.title}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${ban.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'}`}>
                      {ban.is_active ? 'Active' : 'Hidden'}
                    </span>
                  </div>

                  <div className="relative aspect-[1920/600] w-full rounded-xl overflow-hidden bg-rose-50 border border-rose-200">
                    <Image src={ban.image_url} alt={ban.title || 'Banner'} fill sizes="500px" className="object-cover" unoptimized />
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-rose-50 text-xs">
                    <span className="text-[11px] text-gray-400 truncate max-w-xs">{ban.link_url}</span>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingBanner(ban);
                          setIsBannerModalOpen(true);
                        }}
                        className="p-1.5 text-gray-500 hover:text-burgundy rounded-lg hover:bg-blush-50"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setConfirmDialog({
                            isOpen: true,
                            title: 'Delete Banner',
                            message: `Permanently delete this banner?`,
                            onConfirm: async () => {
                              await deleteBanner(ban.id);
                              await loadAllData();
                              triggerToast('Banner deleted');
                            }
                          });
                        }}
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg hover:bg-red-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 6: STORE & PAYMENT SETTINGS (DYNAMIC LIVE CONTROLS)  */}
        {/* ======================================================== */}
        {activeTab === 'settings' && (
          <div className="space-y-6 max-w-4xl">
            <div className="pb-4 border-b border-gray-200">
              <h1 className="font-serif font-bold text-2xl text-gray-900">Store &amp; Payment Accounts</h1>
              <p className="text-xs text-gray-500">Configure customer helpline, shipping fees, and receiving payment accounts.</p>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await saveSiteSettings(settings);
                await loadAllData();
                triggerToast('Store & payment settings saved successfully!');
              }}
              className="bg-white rounded-2xl p-6 border border-rose-100 shadow-xs space-y-6"
            >
              {/* Store Identity */}
              <div>
                <h3 className="font-serif font-bold text-sm text-gray-900 mb-3">Store Contact &amp; Dispatch</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Store Name</label>
                    <input
                      type="text"
                      value={settings.store_name}
                      onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-burgundy"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Tagline</label>
                    <input
                      type="text"
                      value={settings.tagline}
                      onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-burgundy"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">WhatsApp &amp; Helpline</label>
                    <input
                      type="text"
                      value={settings.helpline_phone}
                      onChange={(e) => setSettings({ ...settings, helpline_phone: e.target.value, whatsapp_number: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-burgundy"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Official Email</label>
                    <input
                      type="email"
                      value={settings.email}
                      onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-burgundy"
                    />
                  </div>
                </div>

                <div className="mt-3">
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Warehouse Address (Gujranwala)</label>
                  <input
                    type="text"
                    value={settings.warehouse_address}
                    onChange={(e) => setSettings({ ...settings, warehouse_address: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-burgundy"
                  />
                </div>
              </div>

              {/* Shipping Rules */}
              <div className="pt-4 border-t border-rose-100">
                <h3 className="font-serif font-bold text-sm text-gray-900 mb-3">Shipping Rates</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Flat Delivery Charge (PKR)</label>
                    <input
                      type="number"
                      value={settings.base_shipping_rate}
                      onChange={(e) => setSettings({ ...settings, base_shipping_rate: parseFloat(e.target.value) || 200 })}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-burgundy"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Free Shipping Spend Threshold (PKR)</label>
                    <input
                      type="number"
                      value={settings.free_shipping_threshold}
                      onChange={(e) => setSettings({ ...settings, free_shipping_threshold: parseFloat(e.target.value) || 2500 })}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-burgundy"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Receiving Accounts */}
              <div className="pt-4 border-t border-rose-100 space-y-4">
                <h3 className="font-serif font-bold text-sm text-gray-900">Payment Receiving Accounts</h3>

                {/* JazzCash */}
                <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-amber-900 mb-1">JazzCash Account Title</label>
                    <input
                      type="text"
                      value={settings.jazzcash_title}
                      onChange={(e) => setSettings({ ...settings, jazzcash_title: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-amber-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-amber-900 mb-1">JazzCash Account Number</label>
                    <input
                      type="text"
                      value={settings.jazzcash_number}
                      onChange={(e) => setSettings({ ...settings, jazzcash_number: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-amber-300 rounded-lg"
                    />
                  </div>
                </div>

                {/* EasyPaisa */}
                <div className="p-3.5 bg-emerald-50/50 rounded-xl border border-emerald-200 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-900 mb-1">EasyPaisa Account Title</label>
                    <input
                      type="text"
                      value={settings.easypaisa_title}
                      onChange={(e) => setSettings({ ...settings, easypaisa_title: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-emerald-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-emerald-900 mb-1">EasyPaisa Account Number</label>
                    <input
                      type="text"
                      value={settings.easypaisa_number}
                      onChange={(e) => setSettings({ ...settings, easypaisa_number: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-emerald-300 rounded-lg"
                    />
                  </div>
                </div>

                {/* Bank */}
                <div className="p-3.5 bg-blue-50/50 rounded-xl border border-blue-200 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-bold text-blue-900 mb-1">Bank Name</label>
                    <input
                      type="text"
                      value={settings.bank_name}
                      onChange={(e) => setSettings({ ...settings, bank_name: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-blue-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-blue-900 mb-1">Account Title</label>
                    <input
                      type="text"
                      value={settings.bank_title}
                      onChange={(e) => setSettings({ ...settings, bank_title: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-blue-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-blue-900 mb-1">IBAN / Account #</label>
                    <input
                      type="text"
                      value={settings.bank_iban}
                      onChange={(e) => setSettings({ ...settings, bank_iban: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs bg-white border border-blue-300 rounded-lg font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-rose-100 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-burgundy hover:bg-burgundy-900 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  Save Store &amp; Payment Settings
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ======================================================== */}
        {/* TAB 7: COUPONS & DISCOUNTS                               */}
        {/* ======================================================== */}
        {activeTab === 'coupons' && (
          <div className="space-y-6 max-w-5xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-gray-200">
              <div>
                <h1 className="font-serif font-bold text-2xl text-gray-900">Coupons &amp; Deals Manager</h1>
                <p className="text-xs text-gray-500">Create discount promo codes, free shipping triggers, and minimum spend limits.</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditingCoupon({
                    code: '',
                    discount_type: 'fixed',
                    discount_value: 300,
                    min_spend: 1500,
                    free_shipping: false,
                    is_active: true
                  });
                  setIsCouponModalOpen(true);
                }}
                className="px-4 py-2 bg-burgundy hover:bg-burgundy-900 text-white font-semibold text-xs rounded-xl flex items-center gap-1.5 shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Create Coupon</span>
              </button>
            </div>

            {/* Coupons Table */}
            <div className="bg-white rounded-2xl border border-rose-100 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-blush-50/70 border-b border-rose-100 text-gray-500 font-bold uppercase text-[10px]">
                      <th className="p-3">Coupon Code</th>
                      <th className="p-3">Discount Type</th>
                      <th className="p-3">Discount Value</th>
                      <th className="p-3">Min Spend</th>
                      <th className="p-3">Free Delivery</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-rose-50">
                    {coupons.map((c) => (
                      <tr key={c.id} className="hover:bg-blush-50/40 transition-colors">
                        <td className="p-3 font-mono font-bold text-burgundy text-sm">
                          {c.code}
                        </td>
                        <td className="p-3 capitalize text-gray-700">
                          {c.discount_type === 'percentage' ? 'Percentage (%)' : 'Fixed Cash (PKR)'}
                        </td>
                        <td className="p-3 font-bold text-gray-900">
                          {c.discount_type === 'percentage' ? `${c.discount_value}% OFF` : `Rs. ${c.discount_value.toLocaleString()}`}
                        </td>
                        <td className="p-3 text-gray-600">
                          Rs. {c.min_spend.toLocaleString()}
                        </td>
                        <td className="p-3">
                          {c.free_shipping ? (
                            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                              ✓ Free Shipping
                            </span>
                          ) : (
                            <span className="text-gray-400 text-[10px]">Standard</span>
                          )}
                        </td>
                        <td className="p-3">
                          <button
                            type="button"
                            onClick={async () => {
                              await saveCoupon({ ...c, is_active: !c.is_active });
                              await loadAllData();
                              triggerToast(`Coupon ${c.code} is now ${!c.is_active ? 'Active' : 'Disabled'}`);
                            }}
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              c.is_active ? 'bg-emerald-100 text-emerald-800' : 'bg-gray-100 text-gray-500'
                            }`}
                          >
                            {c.is_active ? 'Active' : 'Disabled'}
                          </button>
                        </td>
                        <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingCoupon(c);
                              setIsCouponModalOpen(true);
                            }}
                            className="p-1.5 text-gray-600 hover:text-burgundy bg-gray-50 hover:bg-blush-50 rounded-lg transition-colors"
                            title="Edit Coupon"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              setConfirmDialog({
                                isOpen: true,
                                title: 'Delete Coupon',
                                message: `Are you sure you want to delete coupon code "${c.code}"?`,
                                onConfirm: async () => {
                                  await deleteCoupon(c.id);
                                  await loadAllData();
                                  triggerToast('Coupon deleted');
                                }
                              });
                            }}
                            className="p-1.5 text-gray-400 hover:text-red-600 bg-gray-50 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Coupon"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                    {coupons.length === 0 && (
                      <tr>
                        <td colSpan={7} className="p-6 text-center text-gray-400 italic">
                          No coupons configured yet. Click &quot;Create Coupon&quot; to add your first promotional voucher.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* 3. MODALS & LIGHTBOXES                                   */}
      {/* ======================================================== */}

      {/* MODAL: Payment Proof Screenshot Lightbox ("Eye" option) */}
      {selectedProofUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="relative max-w-xl w-full bg-white rounded-2xl overflow-hidden p-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-3">
              <h3 className="font-serif font-bold text-sm text-gray-900">Customer Transfer Payment Proof</h3>
              <button
                type="button"
                onClick={() => setSelectedProofUrl(null)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="relative max-h-[70vh] aspect-auto flex items-center justify-center overflow-auto rounded-xl bg-gray-50 border border-gray-200">
              <Image
                src={selectedProofUrl}
                alt="Payment Proof"
                width={600}
                height={800}
                className="object-contain max-h-[65vh] w-auto mx-auto"
                unoptimized
              />
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Clean White Printable PDF Invoice */}
      {printInvoiceOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex justify-between items-center no-print pb-3 border-b border-gray-100">
              <span className="text-xs font-semibold text-gray-500">Order Invoice Preview</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-burgundy text-white text-xs font-semibold rounded-lg flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print Invoice</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPrintInvoiceOrder(null)}
                  className="p-1.5 text-gray-400 hover:text-gray-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Printable Container: Pure White, High-Contrast Typography */}
            <div id="printable-invoice" className="bg-white text-black p-4 space-y-4">
              <div className="flex justify-between items-start border-b border-gray-300 pb-4">
                <div>
                  <h2 className="font-serif font-bold text-2xl text-black">SECRET PETAL</h2>
                  <p className="text-xs text-gray-600">Inner Beauty, Every Day • Women&apos;s Undergarments</p>
                  <p className="text-[11px] text-gray-600 mt-1">
                    Shahzada Shaheed Chuman Shah Road, Street No. 7, Gujranwala<br />
                    Helpline: 0326-6228304 • secretpetal62@gmail.com
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-xs uppercase text-gray-500 block">Official Dispatch Invoice</span>
                  <strong className="text-base font-serif font-bold text-black block">{printInvoiceOrder.order_number}</strong>
                  <span className="text-xs text-gray-500">{new Date(printInvoiceOrder.created_at || Date.now()).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Customer Delivery Details */}
              <div className="grid grid-cols-2 gap-4 text-xs bg-gray-50 p-3 rounded-lg border border-gray-200">
                <div>
                  <span className="text-gray-500 block font-bold">SHIP TO:</span>
                  <p className="font-bold text-gray-900">{printInvoiceOrder.customer_name}</p>
                  <p>{printInvoiceOrder.delivery_address}</p>
                  <p>{printInvoiceOrder.city}</p>
                  <p>Phone: {printInvoiceOrder.phone}</p>
                </div>
                <div className="text-right">
                  <span className="text-gray-500 block font-bold">PAYMENT DETAILS:</span>
                  <p>Method: <strong className="uppercase">{printInvoiceOrder.payment_method}</strong></p>
                  <p>Status: <strong className="capitalize">{printInvoiceOrder.payment_status}</strong></p>
                  <p className="text-[10px] text-gray-500 mt-2">100% Discreet Packaging Verified</p>
                </div>
              </div>

              {/* Items Table */}
              <table className="w-full text-left text-xs border-collapse border border-gray-200 mt-4">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-300 text-gray-700">
                    <th className="p-2">Item Description</th>
                    <th className="p-2">Size</th>
                    <th className="p-2 text-center">Qty</th>
                    <th className="p-2 text-right">Price</th>
                    <th className="p-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {printInvoiceOrder.items.map((item, idx) => (
                    <tr key={idx}>
                      <td className="p-2">{item.title}</td>
                      <td className="p-2">{item.size || 'Standard'}</td>
                      <td className="p-2 text-center">{item.quantity}</td>
                      <td className="p-2 text-right">Rs. {item.price.toLocaleString()}</td>
                      <td className="p-2 text-right font-bold">Rs. {(item.price * item.quantity).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Totals */}
              <div className="border-t border-gray-300 pt-3 flex justify-end">
                <div className="w-56 space-y-1 text-xs text-right">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>Rs. {printInvoiceOrder.subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Charges:</span>
                    <span>Rs. {printInvoiceOrder.delivery_charges}</span>
                  </div>
                  <div className="flex justify-between text-sm font-bold text-black pt-1 border-t border-gray-300">
                    <span>Grand Total:</span>
                    <span>Rs. {printInvoiceOrder.grand_total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="text-[10px] text-gray-500 text-center pt-6 border-t border-gray-200">
                Thank you for choosing Secret Petal. For 7-day size replacements, contact WhatsApp: 0326-6228304.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL: Add/Edit Product */}
      {isProductModalOpen && editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 shadow-2xl space-y-4">
            <div className="flex justify-between items-center pb-3 border-b border-rose-100">
              <h3 className="font-serif font-bold text-base text-gray-900">
                {editingProduct.id ? 'Edit Product' : 'Add New Product'}
              </h3>
              <button
                type="button"
                onClick={() => setIsProductModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await saveProduct(editingProduct);
                await loadAllData();
                setIsProductModalOpen(false);
                triggerToast('Product saved successfully');
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold mb-1">Product Title *</label>
                <input
                  type="text"
                  placeholder="e.g. Butterfly Lace Wireless Posture Bra"
                  value={editingProduct.title || ''}
                  onChange={(e) => {
                    const title = e.target.value;
                    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                    setEditingProduct({ ...editingProduct, title, slug });
                  }}
                  required
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">SKU / Product Code</label>
                  <input
                    type="text"
                    placeholder="e.g. SP-BRA-009"
                    value={editingProduct.sku || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sku: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Available Stock Quantity *</label>
                  <input
                    type="number"
                    min="0"
                    value={editingProduct.stock || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, stock: parseInt(e.target.value) || 0 })}
                    required
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Regular Price (PKR) *</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="2500"
                    value={editingProduct.price || 0}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                    required
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>
                <div>
                  <label className="block font-semibold mb-1">Sale / Discounted Price (PKR)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="1850 (Leave blank if no sale)"
                    value={editingProduct.sale_price || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, sale_price: parseFloat(e.target.value) || undefined })}
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Category</label>
                  <select
                    value={editingProduct.category_id || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category_id: e.target.value, subcategory_id: '' })}
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  >
                    <option value="">Select Category</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Subcategory</label>
                  <select
                    value={editingProduct.subcategory_id || ''}
                    onChange={(e) => setEditingProduct({ ...editingProduct, subcategory_id: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg text-xs"
                  >
                    <option value="">Select Subcategory</option>
                    {subcategories
                      .filter((s) => s.category_id === editingProduct.category_id)
                      .map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                      ))}
                  </select>
                </div>
              </div>

              {/* Main Featured Thumbnail Image */}
              <div className="p-3 bg-blush-50/50 rounded-xl border border-rose-100">
                <label className="block font-semibold mb-1">Main Featured Thumbnail Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    if (e.target.files && e.target.files[0]) {
                      const url = await uploadMedia(e.target.files[0], 'products');
                      setEditingProduct({ ...editingProduct, thumbnail_url: url });
                      triggerToast('Main thumbnail uploaded & WebP compressed');
                    }
                  }}
                  className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-burgundy file:text-white"
                />
                {editingProduct.thumbnail_url && (
                  <div className="mt-2 relative w-16 h-16 rounded-lg overflow-hidden border border-rose-200">
                    <Image src={editingProduct.thumbnail_url} alt="Thumb" fill className="object-cover" unoptimized />
                  </div>
                )}
              </div>

              {/* Additional Gallery Images (Multiple) */}
              <div className="p-3 bg-blush-50/50 rounded-xl border border-rose-100">
                <label className="block font-semibold mb-1">
                  Additional Gallery Images (Multi-Image Upload)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={async (e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      const fileArray = Array.from(e.target.files);
                      const uploadedUrls: string[] = [];
                      for (const file of fileArray) {
                        const url = await uploadMedia(file, 'products/gallery');
                        uploadedUrls.push(url);
                      }
                      const existingGallery = editingProduct.gallery_urls || [];
                      setEditingProduct({
                        ...editingProduct,
                        gallery_urls: [...existingGallery, ...uploadedUrls]
                      });
                      triggerToast(`Uploaded ${uploadedUrls.length} gallery image(s)`);
                    }
                  }}
                  className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-burgundy file:text-white"
                />
                {editingProduct.gallery_urls && editingProduct.gallery_urls.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {editingProduct.gallery_urls.map((gUrl, gIdx) => (
                      <div key={gIdx} className="relative w-14 h-14 rounded-lg overflow-hidden border border-gray-200 group">
                        <Image src={gUrl} alt={`Gallery ${gIdx}`} fill className="object-cover" unoptimized />
                        <button
                          type="button"
                          onClick={() => {
                            const newGallery = (editingProduct.gallery_urls || []).filter((_, idx) => idx !== gIdx);
                            setEditingProduct({ ...editingProduct, gallery_urls: newGallery });
                          }}
                          className="absolute top-0.5 right-0.5 bg-red-600 text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] opacity-80 group-hover:opacity-100"
                          title="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sizes (Comma Separated) with Live Pill Preview */}
              <div>
                <label className="block font-semibold mb-1">
                  Available Sizes (Separate with commas, e.g. 34B, 36B, 38B, 40B or Small, Medium, Large)
                </label>
                <input
                  type="text"
                  placeholder="34B, 36B, 38B, 40B, 42B"
                  value={Array.isArray(editingProduct.sizes) ? editingProduct.sizes.join(', ') : (editingProduct.sizes || '')}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const parsed = raw.split(',').map(s => s.trim()).filter(Boolean);
                    setEditingProduct({ ...editingProduct, sizes: parsed });
                  }}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
                {editingProduct.sizes && editingProduct.sizes.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {editingProduct.sizes.map((sz, szIdx) => (
                      <span key={szIdx} className="px-2 py-0.5 bg-burgundy/10 text-burgundy font-semibold rounded text-[11px]">
                        {sz}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Colors (Comma Separated) with Live Preview */}
              <div>
                <label className="block font-semibold mb-1">
                  Available Colors (Separate with commas, e.g. Baby Pink, Snow White, Jet Black)
                </label>
                <input
                  type="text"
                  placeholder="Baby Pink, Snow White, Classic Black"
                  value={Array.isArray(editingProduct.colors) ? editingProduct.colors.join(', ') : (editingProduct.colors || '')}
                  onChange={(e) => {
                    const raw = e.target.value;
                    const parsed = raw.split(',').map(c => c.trim()).filter(Boolean);
                    setEditingProduct({ ...editingProduct, colors: parsed });
                  }}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
                {editingProduct.colors && editingProduct.colors.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {editingProduct.colors.map((col, cIdx) => (
                      <span key={cIdx} className="px-2 py-0.5 bg-gray-100 text-gray-800 rounded text-[11px] flex items-center gap-1 font-medium">
                        <span className="w-2 h-2 rounded-full bg-burgundy/60" />
                        {col}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Key Features / Bullet points */}
              <div>
                <label className="block font-semibold mb-1">
                  Key Features / Bullets (One per line or comma-separated)
                </label>
                <textarea
                  rows={2}
                  placeholder="Criss-cross back posture support&#10;Instant front snap closure&#10;100% Wireless comfort"
                  value={Array.isArray(editingProduct.features) ? editingProduct.features.join('\n') : (editingProduct.features || '')}
                  onChange={(e) => {
                    const lines = e.target.value.split('\n').map(l => l.trim()).filter(Boolean);
                    setEditingProduct({ ...editingProduct, features: lines });
                  }}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Full Description</label>
                <textarea
                  rows={3}
                  value={editingProduct.description || ''}
                  onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg text-xs"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_featured ?? true}
                    onChange={(e) => setEditingProduct({ ...editingProduct, is_featured: e.target.checked })}
                    className="accent-burgundy"
                  />
                  <span>Featured Product</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingProduct.is_flash_deal ?? false}
                    onChange={(e) => setEditingProduct({ ...editingProduct, is_flash_deal: e.target.checked })}
                    className="accent-burgundy"
                  />
                  <span>⚡ Flash Deal</span>
                </label>
              </div>

              <div className="pt-4 border-t flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-4 py-2 border rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-burgundy text-white font-bold rounded-lg"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add/Edit Main Category */}
      {isCategoryModalOpen && editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-base text-gray-900">
              {editingCategory.id ? 'Edit Category' : 'Add Main Category'}
            </h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await saveCategory(editingCategory);
                await loadAllData();
                setIsCategoryModalOpen(false);
                triggerToast('Category saved');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold mb-1">Category Name *</label>
                <input
                  type="text"
                  value={editingCategory.name || ''}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                    setEditingCategory({ ...editingCategory, name, slug });
                  }}
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Category Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    if (e.target.files && e.target.files[0]) {
                      const url = await uploadMedia(e.target.files[0], 'categories');
                      setEditingCategory({ ...editingCategory, image_url: url });
                      triggerToast('Category image uploaded');
                    }
                  }}
                  className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-burgundy file:text-white"
                />
                {editingCategory.image_url && (
                  <div className="mt-2 relative w-16 h-16 rounded-full overflow-hidden border">
                    <Image src={editingCategory.image_url} alt="Cat" fill className="object-cover" unoptimized />
                  </div>
                )}
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-2">
                <input
                  type="checkbox"
                  checked={editingCategory.show_in_top_categories ?? true}
                  onChange={(e) => setEditingCategory({ ...editingCategory, show_in_top_categories: e.target.checked })}
                  className="accent-burgundy"
                />
                <span>Show in Homepage Top Categories</span>
              </label>

              <div className="pt-4 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setIsCategoryModalOpen(false)} className="px-3 py-1.5 border rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-burgundy text-white font-bold rounded-lg">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add/Edit Subcategory */}
      {isSubcategoryModalOpen && editingSubcategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-base text-gray-900">
              {editingSubcategory.id ? 'Edit Subcategory' : 'Add Subcategory (Text Only)'}
            </h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await saveSubcategory(editingSubcategory);
                await loadAllData();
                setIsSubcategoryModalOpen(false);
                triggerToast('Subcategory saved');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold mb-1">Parent Category *</label>
                <select
                  value={editingSubcategory.category_id}
                  onChange={(e) => setEditingSubcategory({ ...editingSubcategory, category_id: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  required
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Subcategory Name *</label>
                <input
                  type="text"
                  value={editingSubcategory.name || ''}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                    setEditingSubcategory({ ...editingSubcategory, name, slug });
                  }}
                  required
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="pt-4 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setIsSubcategoryModalOpen(false)} className="px-3 py-1.5 border rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-burgundy text-white font-bold rounded-lg">Save Sub</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Upload / Edit Banner */}
      {isBannerModalOpen && editingBanner && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-base text-gray-900">Upload Pure Image Banner</h3>
            <p className="text-[11px] text-gray-500">
              Mention dimensions: Desktop 1920x600, Mobile 800x600.
            </p>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await saveBanner(editingBanner);
                await loadAllData();
                setIsBannerModalOpen(false);
                triggerToast('Banner updated');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold mb-1">Banner Title (For Admin Reference)</label>
                <input
                  type="text"
                  value={editingBanner.title || ''}
                  onChange={(e) => setEditingBanner({ ...editingBanner, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Desktop Banner Image (1920x600)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    if (e.target.files && e.target.files[0]) {
                      const url = await uploadMedia(e.target.files[0], 'banners');
                      setEditingBanner({ ...editingBanner, image_url: url });
                      triggerToast('Desktop banner uploaded');
                    }
                  }}
                  className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-burgundy file:text-white"
                />
                {editingBanner.image_url && (
                  <div className="mt-2 relative aspect-[1920/600] w-full rounded-lg overflow-hidden border">
                    <Image src={editingBanner.image_url} alt="Desk" fill className="object-cover" unoptimized />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold mb-1">Mobile Banner Image (800x600 Optional)</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    if (e.target.files && e.target.files[0]) {
                      const url = await uploadMedia(e.target.files[0], 'banners');
                      setEditingBanner({ ...editingBanner, mobile_image_url: url });
                      triggerToast('Mobile banner uploaded');
                    }
                  }}
                  className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-burgundy file:text-white"
                />
                {editingBanner.mobile_image_url && (
                  <div className="mt-2 relative aspect-[800/600] max-h-32 w-auto rounded-lg overflow-hidden border">
                    <Image src={editingBanner.mobile_image_url} alt="Mobile" fill className="object-cover" unoptimized />
                  </div>
                )}
              </div>

              <div>
                <label className="block font-semibold mb-1">Target Click URL</label>
                <input
                  type="text"
                  value={editingBanner.link_url || '/shop'}
                  onChange={(e) => setEditingBanner({ ...editingBanner, link_url: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="banner_is_active"
                  checked={editingBanner.is_active ?? true}
                  onChange={(e) => setEditingBanner({ ...editingBanner, is_active: e.target.checked })}
                  className="rounded text-burgundy w-4 h-4"
                />
                <label htmlFor="banner_is_active" className="font-semibold text-gray-700 cursor-pointer">
                  Display this banner on homepage (Active)
                </label>
              </div>

              <div className="pt-4 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setIsBannerModalOpen(false)} className="px-3 py-1.5 border rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-burgundy text-white font-bold rounded-lg">Save Banner</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Add/Edit Coupon */}
      {isCouponModalOpen && editingCoupon && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-base text-gray-900">
              {editingCoupon.id ? 'Edit Coupon' : 'Create New Coupon'}
            </h3>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                await saveCoupon(editingCoupon);
                await loadAllData();
                setIsCouponModalOpen(false);
                triggerToast('Coupon saved successfully');
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="block font-semibold mb-1">Coupon Promo Code *</label>
                <input
                  type="text"
                  placeholder="e.g. SECRET300"
                  value={editingCoupon.code || ''}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, code: e.target.value.toUpperCase() })}
                  required
                  className="w-full px-3 py-2 border rounded-lg font-mono uppercase font-bold text-burgundy"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Discount Type</label>
                  <select
                    value={editingCoupon.discount_type || 'fixed'}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, discount_type: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-lg"
                  >
                    <option value="fixed">Fixed Cash (PKR)</option>
                    <option value="percentage">Percentage (%)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Discount Value *</label>
                  <input
                    type="number"
                    min="1"
                    placeholder="e.g. 300 or 15"
                    value={editingCoupon.discount_value || 0}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, discount_value: parseFloat(e.target.value) || 0 })}
                    required
                    className="w-full px-3 py-2 border rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Minimum Spend Required (PKR)</label>
                <input
                  type="number"
                  min="0"
                  placeholder="1500"
                  value={editingCoupon.min_spend || 0}
                  onChange={(e) => setEditingCoupon({ ...editingCoupon, min_spend: parseFloat(e.target.value) || 0 })}
                  className="w-full px-3 py-2 border rounded-lg"
                />
              </div>

              <div className="space-y-2 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCoupon.free_shipping ?? false}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, free_shipping: e.target.checked })}
                    className="accent-burgundy"
                  />
                  <span className="font-medium text-gray-700">Grant 100% Free Shipping</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={editingCoupon.is_active ?? true}
                    onChange={(e) => setEditingCoupon({ ...editingCoupon, is_active: e.target.checked })}
                    className="accent-burgundy"
                  />
                  <span className="font-medium text-gray-700">Coupon Active</span>
                </label>
              </div>

              <div className="pt-4 border-t flex justify-end gap-2">
                <button type="button" onClick={() => setIsCouponModalOpen(false)} className="px-3 py-1.5 border rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-1.5 bg-burgundy text-white font-bold rounded-lg">Save Coupon</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL: Custom Confirmation Dialog (Replaces localhost popups) */}
      {confirmDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-5 shadow-2xl text-center space-y-3">
            <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-base text-gray-900">{confirmDialog.title}</h4>
            <p className="text-xs text-gray-500">{confirmDialog.message}</p>
            <div className="flex gap-2 justify-center pt-2">
              <button
                type="button"
                onClick={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
                className="px-4 py-2 border rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  confirmDialog.onConfirm();
                  setConfirmDialog({ ...confirmDialog, isOpen: false });
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-bold"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
