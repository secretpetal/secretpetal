import React from 'react';

export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-rose-100 p-2.5 sm:p-3 flex flex-col justify-between overflow-hidden shadow-sm animate-pulse">
      <div className="w-full aspect-square bg-rose-50/70 rounded-lg mb-2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      </div>
      <div className="space-y-2">
        <div className="h-3 bg-rose-100/60 rounded w-3/4" />
        <div className="h-3 bg-rose-100/40 rounded w-1/2" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-4 bg-rose-200/60 rounded w-1/3" />
          <div className="h-6 w-6 bg-rose-100 rounded-full" />
        </div>
      </div>
    </div>
  );
}

export function CategoryPillSkeleton() {
  return (
    <div className="flex flex-col items-center flex-shrink-0 w-24 sm:w-28 animate-pulse">
      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-rose-100/60 mb-2" />
      <div className="h-3 bg-rose-100/40 rounded w-16" />
    </div>
  );
}
