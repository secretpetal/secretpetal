'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, Package, Clock, Truck, CheckCircle2, XCircle, ArrowRight, Phone } from 'lucide-react';
import { getOrders } from '@/lib/db';
import { Order } from '@/lib/types';

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState('');
  const [phone, setPhone] = useState('');
  const [order, setOrder] = useState<Order | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;

    setLoading(true);
    setHasSearched(true);
    try {
      const allOrders = await getOrders();
      const match = allOrders.find(
        (o) =>
          o.order_number.toLowerCase().trim() === orderNumber.toLowerCase().trim() &&
          (!phone.trim() || o.phone.includes(phone.trim()))
      );
      setOrder(match || null);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStep = (status: Order['order_status']) => {
    switch (status) {
      case 'Pending': return 1;
      case 'Confirmed': return 2;
      case 'Processing': return 3;
      case 'Shipped': return 4;
      case 'Delivered': return 5;
      case 'Cancelled': return -1;
      default: return 1;
    }
  };

  const step = order ? getStatusStep(order.order_status) : 1;

  return (
    <div className="bg-gray-50/50 min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <span className="text-[11px] uppercase tracking-wider font-bold text-burgundy">Real-Time Dispatch Tracking</span>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-gray-900 mt-1">
            Track Your Secret Petal Order
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1">
            Enter your order reference number to view courier status and delivery progress.
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm mb-8">
          <form onSubmit={handleTrack} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Order Number *
              </label>
              <input
                type="text"
                placeholder="e.g. SP-492104"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-burgundy"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Contact Phone (Optional verification)
              </label>
              <input
                type="tel"
                placeholder="03001234567"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-burgundy"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-burgundy hover:bg-burgundy-900 text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4" />
              <span>{loading ? 'Searching...' : 'Track Order Status'}</span>
            </button>
          </form>
        </div>

        {/* Results */}
        {hasSearched && !loading && (
          <div>
            {order ? (
              <div className="bg-white rounded-2xl p-6 border border-rose-100 shadow-sm space-y-6 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-4 border-b border-rose-100 flex-wrap gap-2">
                  <div>
                    <span className="text-xs text-gray-400">Order Reference:</span>
                    <h3 className="font-serif font-bold text-lg text-burgundy">{order.order_number}</h3>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                      order.order_status === 'Delivered'
                        ? 'bg-emerald-100 text-emerald-800'
                        : order.order_status === 'Cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    Status: {order.order_status}
                  </span>
                </div>

                {/* Progress Steps */}
                {step > 0 ? (
                  <div className="py-2">
                    <div className="grid grid-cols-5 text-center text-[10px] sm:text-xs font-semibold gap-1">
                      <div className={step >= 1 ? 'text-burgundy' : 'text-gray-300'}>Pending</div>
                      <div className={step >= 2 ? 'text-burgundy' : 'text-gray-300'}>Confirmed</div>
                      <div className={step >= 3 ? 'text-burgundy' : 'text-gray-300'}>Processing</div>
                      <div className={step >= 4 ? 'text-burgundy' : 'text-gray-300'}>Shipped</div>
                      <div className={step >= 5 ? 'text-emerald-600' : 'text-gray-300'}>Delivered</div>
                    </div>
                    <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden mt-2">
                      <div
                        className="bg-burgundy h-full rounded-full transition-all duration-500"
                        style={{ width: `${(step / 5) * 100}%` }}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-red-50 text-red-700 text-xs rounded-xl text-center">
                    This order was marked as cancelled. Contact our helpline for details.
                  </div>
                )}

                {/* Order Details */}
                <div className="bg-blush-50/60 p-4 rounded-xl border border-rose-100 space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Customer:</span>
                    <strong className="text-gray-800">{order.customer_name}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Destination:</span>
                    <span className="text-gray-700">{order.city}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Payment:</span>
                    <span className="font-bold uppercase text-gray-800">{order.payment_method}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-rose-200 font-bold">
                    <span>Total Amount:</span>
                    <span className="text-burgundy">Rs. {order.grand_total.toLocaleString()}</span>
                  </div>
                </div>

                <a
                  href={`https://wa.me/923266228304?text=Hi%20Secret%20Petal,%20inquiring%20about%20order%20${order.order_number}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-xs rounded-xl flex items-center justify-center gap-2 transition-colors shadow-xs"
                >
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp Inquiry for this Order</span>
                </a>
              </div>
            ) : (
              <div className="bg-white rounded-2xl p-8 text-center border border-rose-100">
                <XCircle className="w-10 h-10 text-rose-400 mx-auto mb-2" />
                <h4 className="font-serif font-bold text-base text-gray-800 mb-1">Order Not Found</h4>
                <p className="text-xs text-gray-500 max-w-sm mx-auto mb-4">
                  Please verify your order number (e.g. SP-XXXXXX) or message our team directly on WhatsApp.
                </p>
                <a
                  href="https://wa.me/923266228304"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>Contact WhatsApp Support</span>
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
