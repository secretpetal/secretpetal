'use client';

import React, { useState } from 'react';
import { X, Ruler, Sparkles, CheckCircle2 } from 'lucide-react';

interface BraSizeCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function BraSizeCalculatorModal({ isOpen, onClose }: BraSizeCalculatorModalProps) {
  const [underbust, setUnderbust] = useState<number>(32);
  const [bust, setBust] = useState<number>(34);
  const [calculatedSize, setCalculatedSize] = useState<string | null>(null);

  if (!isOpen) return null;

  const calculateSize = (e: React.FormEvent) => {
    e.preventDefault();
    // Standard Bra Sizing Formula (Inches)
    // Band Size: Underbust rounded to nearest even number + 2 if odd
    let band = Math.round(underbust);
    if (band % 2 !== 0) band += 1;

    // Cup Size: Difference between Bust and Band
    const diff = Math.round(bust - underbust);
    let cup = 'A';
    if (diff <= 1) cup = 'A';
    else if (diff === 2) cup = 'B';
    else if (diff === 3) cup = 'C';
    else if (diff === 4) cup = 'D';
    else if (diff >= 5) cup = 'DD / E';

    setCalculatedSize(`${band}${cup}`);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-rose-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-burgundy to-rose-700 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ruler className="w-5 h-5 text-rose-200" />
            <h3 className="font-serif font-bold text-lg">Find Your Perfect Size</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5">
          <p className="text-xs sm:text-sm text-gray-600 mb-4 leading-relaxed">
            Measuring correctly ensures maximum comfort and support. Enter your measurements in <strong>inches</strong>:
          </p>

          <form onSubmit={calculateSize} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                1. Underbust / Ribcage Measurement (Inches)
              </label>
              <input
                type="number"
                min="26"
                max="48"
                step="0.5"
                value={underbust}
                onChange={(e) => setUnderbust(parseFloat(e.target.value) || 30)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-burgundy"
                required
              />
              <span className="text-[11px] text-gray-400">Measure snug around ribs, directly under your bust.</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                2. Overbust / Fullest Part of Bust (Inches)
              </label>
              <input
                type="number"
                min="28"
                max="54"
                step="0.5"
                value={bust}
                onChange={(e) => setBust(parseFloat(e.target.value) || 32)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-burgundy"
                required
              />
              <span className="text-[11px] text-gray-400">Measure around the fullest part of your bust while breathing normally.</span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-burgundy hover:bg-burgundy-900 text-white font-medium text-sm rounded-lg transition-colors shadow-sm flex items-center justify-center gap-1.5"
            >
              <Sparkles className="w-4 h-4 text-rose-300" />
              Calculate My Size
            </button>
          </form>

          {/* Result */}
          {calculatedSize && (
            <div className="mt-5 p-4 bg-blush-50 rounded-xl border border-rose-200 text-center animate-in zoom-in-95 duration-200">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
              <p className="text-xs text-gray-600 font-medium">Your Recommended Secret Petal Size:</p>
              <div className="text-2xl font-serif font-bold text-burgundy my-1">
                {calculatedSize}
              </div>
              <p className="text-[11px] text-gray-500">
                All Secret Petal bras are crafted true to standard sizing with discreet domestic exchange support.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
