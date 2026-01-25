"use client";

// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Marketplace Grid — Devnet-0                                   ┃
   ┃ File   : src/components/marketplace/MarketplaceGrid.tsx                ┃
   ┃ Role   : Seller-first responsive grid (breathing room, not clustered)  ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import * as React from "react";
import { ProductCard, type ProductCardProps } from "@/components/marketplace/ProductCard";

/* ======================================================
   Types
   ====================================================== */

export type MarketplaceProduct = {
  id: string;
  title: string;
  image?: string;
  href?: string;

  // Legacy fields (ignored by seller-first ProductCard)
  currentBid?: number;
  price?: number;
  viewers?: number;
  endsIn?: string;

  seller?: {
    name: string;
    avatar?: string;
    handle?: string;
    verified?: boolean;
  };

  isLive?: boolean;
};

export interface MarketplaceGridProps {
  products?: MarketplaceProduct[];
  className?: string;

  /**
   * Layout controls
   * - max: caps width so tiles breathe (reduces clustered feel)
   * - cols: desktop column target (3 recommended)
   */
  max?: "lg" | "xl" | "2xl" | "3xl" | "full";
  cols?: 3 | 4;

  /**
   * Spacing controls
   */
  gap?: "tight" | "md" | "wide";

  /**
   * NEW: density toggles overall grid spacing + outer card feel.
   * (Does NOT require ProductCard to accept `density`.)
   */
  density?: "default" | "compact";

  /**
   * Demo data (deterministic)
   */
  demoCount?: number;

  /**
   * Force seller-live tiles everywhere (removes any “listing” semantics).
   * Default: true (matches your request).
   */
  forceLive?: boolean;
}

/* ======================================================
   Helpers
   ====================================================== */

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function clampInt(n: number, min: number, max: number) {
  const v = Math.floor(n);
  return Math.max(min, Math.min(max, v));
}

/**
 * Deterministic demo data (NO Math.random)
 * - avoids hydration mismatch warnings
 * - keeps UI stable between renders
 */
function makeDemoProducts(count: number): MarketplaceProduct[] {
  return Array.from({ length: count }).map((_, i) => {
    const idx = i + 1;
    const coverIdx = (i % 2) + 1; // cover-01..02
    const avatarIdx = (i % 8) + 1; // avatar-01..08

    return {
      id: `seller-${idx}`,
      title: `Mystery Box #${idx}`,
      image: `/placeholder/covers/cover-${pad2(coverIdx)}.jpg`,
      href: `/live/seller-${idx}`,
      isLive: true,
      seller: {
        name: `Seller ${idx}`,
        handle: `@seller${idx}`,
        verified: idx % 5 === 0,
        avatar: `/placeholder/avatars/avatar-${pad2(avatarIdx)}.png`,
      },
    };
  });
}

/* ======================================================
   Component
   ====================================================== */

export function MarketplaceGrid({
  products,
  className,
  max = "2xl",
  cols = 3,
  gap = "wide",
  density = "default",
  demoCount = 12,
  forceLive = true,
}: MarketplaceGridProps) {
  const demoProducts = React.useMemo(
    () => makeDemoProducts(clampInt(demoCount, 0, 60)),
    [demoCount]
  );

  const items = products?.length ? products : demoProducts;

  const cap =
    max === "full"
      ? "max-w-none"
      : max === "lg"
        ? "max-w-[1100px]"
        : max === "xl"
          ? "max-w-[1280px]"
          : max === "3xl"
            ? "max-w-[1600px]"
            : "max-w-[1440px]";

  // anti-cluster: prefer 3-up; allow 4-up only on xl+
  const gridCols =
    cols === 4
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  // spacing presets (density modifies these)
  const baseGaps =
    gap === "tight"
      ? "gap-x-4 gap-y-6 sm:gap-x-5 sm:gap-y-7"
      : gap === "md"
        ? "gap-x-6 gap-y-8 sm:gap-x-7 sm:gap-y-9"
        : "gap-x-7 gap-y-9 sm:gap-x-8 sm:gap-y-10";

  const densityGaps =
    density === "compact"
      ? "gap-x-5 gap-y-7 sm:gap-x-6 sm:gap-y-8"
      : baseGaps;

  // optional outer card tweak (safe even if ProductCard ignores/overrides)
  const cardClass =
    density === "compact"
      ? "shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_10px_34px_rgba(0,0,0,0.36)]"
      : undefined;

  return (
    <div className={cx("mx-auto w-full", cap, className)}>
      <div
        className={cx(
          "grid",
          gridCols,
          densityGaps,
          "items-start auto-rows-max",
          "min-w-0 [&>*]:min-w-0"
        )}
      >
        {items.map((p) => {
          // IMPORTANT: seller-first ProductCard — do NOT pass legacy bid/price/viewers props.
          const cardProps: ProductCardProps = {
            id: p.id,
            title: p.title,
            image: p.image,
            href: p.href,
            isLive: forceLive ? true : Boolean(p.isLive),
            seller: p.seller,
            className: cardClass,
          };

          return (
            <div key={p.id} className="min-w-0">
              <ProductCard {...cardProps} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default MarketplaceGrid;
