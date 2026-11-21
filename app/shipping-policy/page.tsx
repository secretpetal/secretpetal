import React from 'react';
import { Truck, Clock, ShieldCheck, MapPin } from 'lucide-react';

export default function ShippingPolicyPage() {
  return (
    <div className="bg-white min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center pb-6 border-b border-rose-100">
          <span className="text-[11px] uppercase tracking-wider font-bold text-burgundy">Nationwide Delivery</span>
          <h1 className="font-serif font-bold text-2xl sm:text-4xl text-gray-900 mt-1">
            Shipping &amp; Delivery Policy
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Dispatched safely from Shahzada Shaheed Chuman Shah Road, Street No. 7, Gujranwala.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 bg-blush-50 rounded-xl border border-rose-100 text-center space-y-1.5">
            <Truck className="w-6 h-6 text-burgundy mx-auto" />
            <h4 className="font-bold text-xs text-gray-900">Standard Delivery</h4>
            <p className="text-[11px] text-gray-500">Rs. 200 flat delivery rate across Pakistan.</p>
          </div>

          <div className="p-4 bg-blush-50 rounded-xl border border-rose-100 text-center space-y-1.5">
            <Clock className="w-6 h-6 text-burgundy mx-auto" />
            <h4 className="font-bold text-xs text-gray-900">Delivery Timelines</h4>
            <p className="text-[11px] text-gray-500">2 to 4 working days for major cities (Lahore, Karachi, Islamabad).</p>
          </div>

          <div className="p-4 bg-blush-50 rounded-xl border border-rose-100 text-center space-y-1.5">
            <ShieldCheck className="w-6 h-6 text-emerald-600 mx-auto" />
            <h4 className="font-bold text-xs text-gray-900">Free Delivery</h4>
            <p className="text-[11px] text-gray-500">Free shipping on all orders above Rs. 2,500.</p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed pt-4">
          <h2 className="font-serif font-bold text-lg text-gray-900">1. Order Processing &amp; Dispatch</h2>
          <p>
            Orders placed before 4:00 PM (Monday through Saturday) are verified via Call or WhatsApp and dispatched on the same business day from our warehouse in Gujranwala.
          </p>

          <h2 className="font-serif font-bold text-lg text-gray-900">2. Cash on Delivery (COD) Rules</h2>
          <p>
            Cash on Delivery is available across all major and secondary cities of Pakistan. Please ensure the exact cash amount is ready for the courier rider at the time of delivery.
          </p>

          <h2 className="font-serif font-bold text-lg text-gray-900">3. 7-Day Size Exchange Support</h2>
          <p>
            If a purchased bra or intimate set does not fit as expected, we offer a hassle-free 7-day size exchange guarantee. Contact our WhatsApp helpline at <strong>0326-6228304</strong> to request a replacement size.
          </p>
        </div>
      </div>
    </div>
  );
}
