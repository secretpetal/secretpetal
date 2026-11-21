'use client';

import React from 'react';
import { ShieldCheck, Truck, RefreshCw, Sparkles, Lock, HeartHandshake } from 'lucide-react';

export default function BrandTicker() {
  const trustPoints = [
    { title: '100% Discreet Packaging', subtitle: 'Plain box with zero intimate labeling', icon: ShieldCheck },
    { title: 'Cash on Delivery', subtitle: 'Pay when delivered to your door', icon: Truck },
    { title: '7-Day Size Exchange', subtitle: 'Easy domestic size replacement', icon: RefreshCw },
    { title: 'Premium Combed Fabrics', subtitle: 'Breathable, skin-friendly cotton & lace', icon: Sparkles },
    { title: 'Confidential & Private', subtitle: 'Discreet customer data protection', icon: Lock },
    { title: 'Customer Support', subtitle: 'WhatsApp consultation: 0326-6228304', icon: HeartHandshake }
  ];

  return (
    <section className="py-5 bg-white border-y border-rose-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 mb-3 text-center">
        <span className="text-[10px] sm:text-xs uppercase tracking-widest font-bold text-burgundy">
          Secret Petal Promise
        </span>
        <h3 className="font-serif font-bold text-base sm:text-lg text-gray-800">
          Our Privacy &amp; Genuine Quality Guarantees
        </h3>
      </div>

      <div className="relative w-full overflow-hidden">
        {/* Continuous single row marquee ticker with pause on hover */}
        <div className="flex gap-4 sm:gap-6 animate-marquee hover:[animation-play-state:paused] w-max">
          {trustPoints.concat(trustPoints).map((point, idx) => {
            const Icon = point.icon;
            return (
              <div
                key={idx}
                className="flex items-center gap-3 px-4 py-2.5 bg-blush-50/60 border border-rose-100 rounded-xl shrink-0 transition-colors hover:bg-blush-100/60"
              >
                <div className="w-8 h-8 rounded-lg bg-burgundy/10 text-burgundy flex items-center justify-center shrink-0">
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-gray-900">{point.title}</h4>
                  <p className="text-[10px] text-gray-500">{point.subtitle}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
