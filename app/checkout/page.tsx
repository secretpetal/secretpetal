'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  Truck,
  CheckCircle2,
  Upload,
  ArrowRight,
  Phone,
  AlertCircle,
  Copy,
  Check,
  ShoppingBag
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { getSiteSettings, createOrder, uploadMedia, validateCoupon } from '@/lib/db';
import { SiteSettings, Order, Coupon } from '@/lib/types';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, subtotal, clearCart } = useCart();

  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  // Form Fields
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [city, setCity] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [orderNotes, setOrderNotes] = useState('');
  const [deliveryType, setDeliveryType] = useState<'home' | 'commercial'>('home');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'jazzcash' | 'easypaisa' | 'bank'>('cod');
  const [paymentProofFile, setPaymentProofFile] = useState<File | null>(null);
  const [paymentProofPreview, setPaymentProofPreview] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedOrder, setSubmittedOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Coupon State
  const [couponCodeInput, setCouponCodeInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponFeedback, setCouponFeedback] = useState<{ message: string; isError: boolean } | null>(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  useEffect(() => {
    getSiteSettings().then(setSettings);
  }, []);

  const baseDeliveryCharge = settings?.base_shipping_rate || 200;
  const freeThreshold = settings?.free_shipping_threshold || 2500;
  const isFreeDelivery = subtotal >= freeThreshold || appliedCoupon?.free_shipping === true;
  const deliveryCharges = isFreeDelivery ? 0 : baseDeliveryCharge;
  const grandTotal = Math.max(0, subtotal - discountAmount + deliveryCharges);

  const handleApplyCoupon = async () => {
    if (!couponCodeInput.trim()) return;
    setIsValidatingCoupon(true);
    setCouponFeedback(null);
    try {
      const res = await validateCoupon(couponCodeInput, subtotal);
      if (res.isValid && res.coupon) {
        setAppliedCoupon(res.coupon);
        setDiscountAmount(res.discountAmount);
        setCouponFeedback({ message: res.message, isError: false });
      } else {
        setAppliedCoupon(null);
        setDiscountAmount(0);
        setCouponFeedback({ message: res.message, isError: true });
      }
    } catch (err: any) {
      setCouponFeedback({ message: 'Failed to apply coupon', isError: true });
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponCodeInput('');
    setCouponFeedback(null);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedAccount(label);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setPaymentProofFile(file);
      setPaymentProofPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (items.length === 0) {
      setErrorMsg('Your shopping cart is empty.');
      return;
    }

    if (!customerName.trim() || !phone.trim() || !city.trim() || !deliveryAddress.trim()) {
      setErrorMsg('Please fill in all mandatory delivery details.');
      return;
    }

    if (paymentMethod !== 'cod' && !paymentProofFile) {
      setErrorMsg('Please attach a screenshot of your payment transfer for verification.');
      return;
    }

    setIsSubmitting(true);

    try {
      let proofUrl = '';
      if (paymentProofFile) {
        proofUrl = await uploadMedia(paymentProofFile, 'payment_proofs');
      }

      const orderData = {
        customer_name: customerName.trim(),
        phone: phone.trim(),
        whatsapp: whatsapp.trim() || phone.trim(),
        city: city.trim(),
        delivery_address: `${deliveryAddress.trim()} (${deliveryType === 'home' ? 'Home Delivery' : 'Office/Commercial Delivery'})`,
        order_notes: orderNotes.trim(),
        items: items.map(i => ({
          product_id: i.product_id,
          title: i.title,
          price: i.price,
          quantity: i.quantity,
          size: i.size,
          color: i.color,
          thumbnail_url: i.thumbnail_url
        })),
        subtotal,
        delivery_charges: deliveryCharges,
        discount_amount: discountAmount,
        grand_total: grandTotal,
        payment_method: paymentMethod,
        payment_status: (paymentMethod === 'cod' ? 'pending' : 'pending') as 'pending',
        payment_screenshot_url: proofUrl,
      };

      const { data, error } = await createOrder(orderData);

      if (error || !data) {
        throw error || new Error('Could not record order');
      }

      // Success!
      setSubmittedOrder(data);
      clearCart();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Order submission error:', err);
      setErrorMsg(err.message || 'Failed to place order. Please check connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // 1. Order Placed Confirmation Screen
  if (submittedOrder) {
    return (
      <div className="bg-blush-50/50 min-h-screen py-10 px-4">
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl border border-rose-100 p-6 sm:p-8 text-center animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">
            Order Confirmed
          </span>

          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-gray-900 mt-2 mb-1">
            Thank You, {submittedOrder.customer_name}!
          </h1>

          <p className="text-xs sm:text-sm text-gray-600 mb-6">
            Your intimate wear order has been safely placed. We are preparing it for <strong>100% discreet dispatch</strong> from Gujranwala.
          </p>

          <div className="bg-blush-50 p-4 rounded-xl border border-rose-200 text-left space-y-2 mb-6">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Order Number:</span>
              <strong className="font-serif text-burgundy text-sm">{submittedOrder.order_number}</strong>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Payment Method:</span>
              <span className="font-bold text-gray-800 uppercase">{submittedOrder.payment_method}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Delivery To:</span>
              <span className="text-gray-700 truncate max-w-xs">{submittedOrder.city}</span>
            </div>
            <div className="flex justify-between text-xs pt-2 border-t border-rose-200">
              <span className="font-bold text-gray-800">Total Payable:</span>
              <strong className="font-bold text-burgundy text-base">Rs. {submittedOrder.grand_total.toLocaleString()}</strong>
            </div>
          </div>

          <div className="space-y-3">
            <a
              href={`https://wa.me/923266228304?text=Hello%20Secret%20Petal,%20I%20just%20placed%20order%20${submittedOrder.order_number}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Phone className="w-4 h-4" />
              <span>Confirm on WhatsApp: 0326-6228304</span>
            </a>

            <Link
              href="/shop"
              className="block w-full py-2.5 bg-white border border-rose-200 text-burgundy hover:bg-blush font-semibold text-xs rounded-xl transition-colors"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 2. Main Checkout Form Screen
  return (
    <div className="bg-gray-50/50 min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-serif font-bold text-2xl sm:text-3xl text-gray-900 mb-2">
          Secure Checkout
        </h1>
        <p className="text-xs text-gray-500 mb-8 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>100% Confidential &amp; Discreet Packaging Guaranteed on All Orders</span>
        </p>

        {items.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-rose-100 max-w-md mx-auto">
            <ShoppingBag className="w-12 h-12 text-rose-300 mx-auto mb-2" />
            <h2 className="font-serif font-bold text-lg text-gray-800 mb-1">Your bag is empty</h2>
            <p className="text-xs text-gray-500 mb-4">Add products before proceeding to checkout.</p>
            <Link href="/shop" className="px-5 py-2 bg-burgundy text-white text-xs font-semibold rounded-lg">
              Explore Products
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Col: Customer & Payment Details (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              {/* Delivery Address Card */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-rose-100 shadow-xs space-y-4">
                <h3 className="font-serif font-bold text-base text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-burgundy text-white text-xs flex items-center justify-center">1</span>
                  Delivery Information
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      placeholder="e.g. Ayesha Khan"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-burgundy"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">Phone Number (Call/SMS) *</label>
                    <input
                      type="tel"
                      placeholder="03001234567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-burgundy"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">WhatsApp Number (Optional)</label>
                    <input
                      type="tel"
                      placeholder="If different from phone"
                      value={whatsapp}
                      onChange={(e) => setWhatsapp(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-burgundy"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">City *</label>
                    <input
                      type="text"
                      placeholder="e.g. Lahore, Karachi, Gujranwala"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      required
                      className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-burgundy"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Complete Delivery Address *</label>
                  <textarea
                    rows={2}
                    placeholder="House/Apartment #, Street, Colony, Nearest Landmark"
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-burgundy"
                  />
                </div>

                {/* Delivery Location Type */}
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Delivery Destination Type:</label>
                  <div className="grid grid-cols-2 gap-3">
                    <label
                      className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2 text-xs transition-all ${
                        deliveryType === 'home'
                          ? 'border-burgundy bg-blush-50/60 font-semibold text-burgundy'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryType"
                        checked={deliveryType === 'home'}
                        onChange={() => setDeliveryType('home')}
                        className="accent-burgundy"
                      />
                      <span>Home Delivery (All day)</span>
                    </label>

                    <label
                      className={`p-3 rounded-xl border cursor-pointer flex items-center gap-2 text-xs transition-all ${
                        deliveryType === 'commercial'
                          ? 'border-burgundy bg-blush-50/60 font-semibold text-burgundy'
                          : 'border-gray-200 text-gray-600'
                      }`}
                    >
                      <input
                        type="radio"
                        name="deliveryType"
                        checked={deliveryType === 'commercial'}
                        onChange={() => setDeliveryType('commercial')}
                        className="accent-burgundy"
                      />
                      <span>Office / Work (9 AM - 6 PM)</span>
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">Order Notes (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Call before delivery, ring specific bell"
                    value={orderNotes}
                    onChange={(e) => setOrderNotes(e.target.value)}
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-lg focus:outline-none focus:border-burgundy"
                  />
                </div>
              </div>

              {/* Payment Methods Card */}
              <div className="bg-white rounded-2xl p-5 sm:p-6 border border-rose-100 shadow-xs space-y-4">
                <h3 className="font-serif font-bold text-base text-gray-900 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-burgundy text-white text-xs flex items-center justify-center">2</span>
                  Select Payment Method
                </h3>

                <div className="space-y-2.5">
                  {/* COD */}
                  <label
                    className={`block p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'cod'
                        ? 'border-burgundy bg-blush-50/80 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="accent-burgundy"
                      />
                      <div className="flex-1">
                        <span className="text-xs font-bold text-gray-900 block">
                          Cash on Delivery (COD)
                        </span>
                        <span className="text-[11px] text-gray-500">
                          Pay cash to rider upon private doorstep delivery.
                        </span>
                      </div>
                      <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                        Most Popular
                      </span>
                    </div>
                  </label>

                  {/* JazzCash */}
                  <label
                    className={`block p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'jazzcash'
                        ? 'border-burgundy bg-blush-50/80 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'jazzcash'}
                        onChange={() => setPaymentMethod('jazzcash')}
                        className="accent-burgundy"
                      />
                      <div className="flex-1">
                        <span className="text-xs font-bold text-gray-900 block">
                          JazzCash Digital Transfer
                        </span>
                        <span className="text-[11px] text-gray-500">
                          Direct transfer to official JazzCash account.
                        </span>
                      </div>
                    </div>
                  </label>

                  {/* EasyPaisa */}
                  <label
                    className={`block p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'easypaisa'
                        ? 'border-burgundy bg-blush-50/80 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'easypaisa'}
                        onChange={() => setPaymentMethod('easypaisa')}
                        className="accent-burgundy"
                      />
                      <div className="flex-1">
                        <span className="text-xs font-bold text-gray-900 block">
                          EasyPaisa Digital Transfer
                        </span>
                        <span className="text-[11px] text-gray-500">
                          Direct transfer to official EasyPaisa account.
                        </span>
                      </div>
                    </div>
                  </label>

                  {/* Bank Transfer */}
                  <label
                    className={`block p-3.5 rounded-xl border cursor-pointer transition-all ${
                      paymentMethod === 'bank'
                        ? 'border-burgundy bg-blush-50/80 shadow-xs'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === 'bank'}
                        onChange={() => setPaymentMethod('bank')}
                        className="accent-burgundy"
                      />
                      <div className="flex-1">
                        <span className="text-xs font-bold text-gray-900 block">
                          Bank Transfer (IBAN / Online)
                        </span>
                        <span className="text-[11px] text-gray-500">
                          Transfer directly to our Meezan Bank corporate account.
                        </span>
                      </div>
                    </div>
                  </label>
                </div>

                {/* Account Details & Screenshot Upload Slot (When Digital Payment selected) */}
                {paymentMethod !== 'cod' && (
                  <div className="p-4 bg-blush-50/80 rounded-xl border border-rose-200 space-y-3 mt-3 animate-in fade-in duration-200">
                    <h4 className="text-xs font-bold text-burgundy">
                      {paymentMethod === 'jazzcash' && 'JazzCash Account Details:'}
                      {paymentMethod === 'easypaisa' && 'EasyPaisa Account Details:'}
                      {paymentMethod === 'bank' && 'Bank Account Details:'}
                    </h4>

                    {paymentMethod === 'jazzcash' && (
                      <div className="bg-white p-3 rounded-lg border border-rose-100 flex items-center justify-between text-xs">
                        <div>
                          <p className="text-gray-500 text-[10px]">Title: <strong>{settings?.jazzcash_title || 'Secret Petal'}</strong></p>
                          <p className="text-burgundy font-bold text-sm">{settings?.jazzcash_number || '0326-6228304'}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(settings?.jazzcash_number || '03266228304', 'jazzcash')}
                          className="px-2.5 py-1 bg-blush text-burgundy rounded text-xs font-semibold flex items-center gap-1"
                        >
                          {copiedAccount === 'jazzcash' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedAccount === 'jazzcash' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    )}

                    {paymentMethod === 'easypaisa' && (
                      <div className="bg-white p-3 rounded-lg border border-rose-100 flex items-center justify-between text-xs">
                        <div>
                          <p className="text-gray-500 text-[10px]">Title: <strong>{settings?.easypaisa_title || 'Secret Petal'}</strong></p>
                          <p className="text-burgundy font-bold text-sm">{settings?.easypaisa_number || '0326-6228304'}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleCopy(settings?.easypaisa_number || '03266228304', 'easypaisa')}
                          className="px-2.5 py-1 bg-blush text-burgundy rounded text-xs font-semibold flex items-center gap-1"
                        >
                          {copiedAccount === 'easypaisa' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedAccount === 'easypaisa' ? 'Copied' : 'Copy'}</span>
                        </button>
                      </div>
                    )}

                    {paymentMethod === 'bank' && (
                      <div className="bg-white p-3 rounded-lg border border-rose-100 space-y-1 text-xs">
                        <p className="text-gray-700">Bank: <strong>{settings?.bank_name || 'Meezan Bank'}</strong></p>
                        <p className="text-gray-700">Title: <strong>{settings?.bank_title || 'Secret Petal'}</strong></p>
                        <div className="flex items-center justify-between pt-1">
                          <span className="font-mono text-burgundy font-bold">{settings?.bank_iban || 'PK00MEZN0000000000000000'}</span>
                          <button
                            type="button"
                            onClick={() => handleCopy(settings?.bank_iban || 'PK00MEZN0000000000000000', 'bank')}
                            className="px-2.5 py-1 bg-blush text-burgundy rounded text-xs font-semibold flex items-center gap-1"
                          >
                            {copiedAccount === 'bank' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                            <span>{copiedAccount === 'bank' ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Screenshot Upload Input */}
                    <div>
                      <label className="block text-xs font-bold text-gray-800 mb-1">
                        Upload Payment Screenshot / Transfer Receipt *
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full text-xs text-gray-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-burgundy file:text-white hover:file:bg-burgundy-900"
                        required={paymentMethod !== 'cod'}
                      />
                      {paymentProofPreview && (
                        <div className="mt-2 relative w-24 h-24 rounded-lg overflow-hidden border border-rose-200">
                          <Image src={paymentProofPreview} alt="Payment Proof" fill className="object-cover" unoptimized />
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Col: Order Summary (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-white rounded-2xl p-5 border border-rose-100 shadow-xs space-y-4 sticky top-24">
                <h3 className="font-serif font-bold text-base text-gray-900 pb-3 border-b border-rose-100">
                  Order Summary ({items.reduce((acc, i) => acc + i.quantity, 0)} Items)
                </h3>

                {/* Items preview list */}
                <div className="divide-y divide-rose-50 max-h-60 overflow-y-auto space-y-2 pr-1">
                  {items.map((item, idx) => (
                    <div key={idx} className="flex gap-2.5 pt-2">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-rose-50 shrink-0">
                        <Image src={item.thumbnail_url} alt={item.title} fill sizes="48px" className="object-cover" unoptimized />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-gray-800 truncate">{item.title}</p>
                        <p className="text-[11px] text-gray-400">Qty: {item.quantity} {item.size ? `• Size: ${item.size}` : ''}</p>
                      </div>
                      <span className="text-xs font-bold text-burgundy">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Promo Coupon Box */}
                <div className="pt-3 border-t border-rose-100">
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Have a Promo / Coupon Code?
                  </label>
                  {!appliedCoupon ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="e.g. SECRET300"
                        value={couponCodeInput}
                        onChange={(e) => setCouponCodeInput(e.target.value.toUpperCase())}
                        className="flex-1 px-3 py-1.5 text-xs border border-rose-200 rounded-lg focus:outline-none focus:border-burgundy uppercase font-mono tracking-wider"
                      />
                      <button
                        type="button"
                        onClick={handleApplyCoupon}
                        disabled={isValidatingCoupon || !couponCodeInput.trim()}
                        className="px-3.5 py-1.5 bg-burgundy hover:bg-burgundy-900 text-white font-bold text-xs rounded-lg transition-colors disabled:opacity-50"
                      >
                        {isValidatingCoupon ? 'Checking...' : 'Apply'}
                      </button>
                    </div>
                  ) : (
                    <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-800">
                      <div>
                        <span className="font-bold font-mono">{appliedCoupon.code}</span>
                        <span className="text-[11px] block text-emerald-700">
                          {appliedCoupon.free_shipping
                            ? 'Free Delivery Unlocked'
                            : `- Rs. ${discountAmount.toLocaleString()} Discount Applied`}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveCoupon}
                        className="text-xs text-red-600 hover:underline font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  )}

                  {couponFeedback && !appliedCoupon && (
                    <p className={`text-[11px] mt-1.5 ${couponFeedback.isError ? 'text-red-600' : 'text-emerald-700'}`}>
                      {couponFeedback.message}
                    </p>
                  )}
                </div>

                {/* Charges Calculation */}
                <div className="space-y-2 pt-3 border-t border-rose-100 text-xs">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-700 font-bold">
                      <span>Discount ({appliedCoupon?.code}):</span>
                      <span>- Rs. {discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-600">
                    <span>Delivery Charges:</span>
                    {isFreeDelivery ? (
                      <span className="text-emerald-700 font-bold">FREE (Unlocked)</span>
                    ) : (
                      <span>Rs. {deliveryCharges}</span>
                    )}
                  </div>
                  <div className="flex justify-between text-base font-serif font-bold text-gray-900 pt-2 border-t border-rose-100">
                    <span>Total Amount:</span>
                    <span className="text-burgundy">Rs. {grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                {errorMsg && (
                  <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 bg-burgundy hover:bg-burgundy-900 text-white font-bold text-sm rounded-xl transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <span>Placing Your Order...</span>
                  ) : (
                    <>
                      <span>Complete Order (Rs. {grandTotal.toLocaleString()})</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                <p className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Plain sealed box delivery guaranteed
                </p>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
