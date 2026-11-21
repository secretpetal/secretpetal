import React from 'react';
import { ShieldCheck, Lock, EyeOff, Truck } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-white min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-6">
        <div className="text-center pb-6 border-b border-rose-100">
          <span className="text-[11px] uppercase tracking-wider font-bold text-burgundy">Our Strict Guarantee</span>
          <h1 className="font-serif font-bold text-2xl sm:text-4xl text-gray-900 mt-1">
            Privacy &amp; Discreet Packaging Policy
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-2">
            Secret Petal is committed to protecting your privacy with the highest standards in Pakistan.
          </p>
        </div>

        <div className="bg-blush-50 p-5 rounded-2xl border border-rose-200 flex items-start gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-gray-700 space-y-1">
            <h3 className="font-bold text-burgundy">100% Plain Exterior Packaging Guarantee</h3>
            <p>
              Every parcel leaves our Gujranwala warehouse in an opaque, unbranded carton box or tamper-evident sealed flyer. There is <strong>ZERO mention of undergarments, lingerie, bras, or intimate items</strong> anywhere on the exterior shipping label or courier manifest.
            </p>
          </div>
        </div>

        <div className="space-y-4 text-xs sm:text-sm text-gray-700 leading-relaxed">
          <h2 className="font-serif font-bold text-lg text-gray-900">1. Information We Collect</h2>
          <p>
            When you place an order on Secret Petal, we collect only necessary delivery information: your name, contact phone number, shipping address, and city. We do not sell, rent, or trade your personal details with any third parties.
          </p>

          <h2 className="font-serif font-bold text-lg text-gray-900">2. Discreet Courier Handling</h2>
          <p>
            The courier delivery agent delivers the package as general merchandise or retail parcel. The courier rider has no access to the contents of your order, ensuring full peace of mind at your doorstep.
          </p>

          <h2 className="font-serif font-bold text-lg text-gray-900">3. Contact &amp; Questions</h2>
          <p>
            For any confidentiality inquiries or to request data removal, contact our female-led customer service team directly on WhatsApp at <strong>0326-6228304</strong> or email <strong>secretpetal62@gmail.com</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}
