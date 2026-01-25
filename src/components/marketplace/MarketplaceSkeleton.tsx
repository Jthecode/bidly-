/* ======================================================
   Bidly — MarketplaceSkeleton Component
   ======================================================
   File: components/marketplace/MarketplaceSkeleton.tsx
   Purpose: Loading placeholder for marketplace listings
   ====================================================== */

import * as React from "react";

interface MarketplaceSkeletonProps {
  count?: number; // number of skeleton cards to render
}

export const MarketplaceSkeleton: React.FC<MarketplaceSkeletonProps> = ({
  count = 8,
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="
            relative overflow-hidden
            rounded-xl border border-neutral-800
            bg-[var(--bg-surface)]
            p-4
            animate-pulse
          "
        >
          {/* Image placeholder */}
          <div className="w-full h-40 rounded-lg bg-neutral-800 mb-4" />

          {/* Title placeholder */}
          <div className="h-4 w-3/4 rounded bg-neutral-800 mb-2" />

          {/* Price placeholder */}
          <div className="h-4 w-1/3 rounded bg-neutral-800" />

          {/* Subtle shimmer overlay */}
          <div
            className="
              pointer-events-none
              absolute inset-0
              bg-gradient-to-r
              from-transparent
              via-white/5
              to-transparent
              animate-[shimmer_1.5s_infinite]
            "
          />
        </div>
      ))}
    </div>
  );
};
