// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Categories Data — Devnet-0                                    ┃
   ┃ File   : src/app/categories/category.data.ts                           ┃
   ┃ Role   : Single source of truth for category slugs + labels + routing  ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

/**
 * Categories (single source of truth)
 * - Used by:
 *   - /categories index grid
 *   - /categories/[slug] pages
 *   - Header nav dropdown / links
 *
 * Keep slugs stable — they become URLs.
 */

export type CategoryAccent = "cyan" | "purple" | "pink" | "gold";

export type Category = {
  slug: string;
  label: string;
  description: string;
  /** Optional: background image for tile/hero (safe to omit) */
  image?: string;
  /** Optional: neon accent token-ish (used for subtle UI accents) */
  accent?: CategoryAccent;
};

export const CATEGORIES: readonly Category[] = [
  {
    slug: "electronics",
    label: "Electronics",
    description: "Phones, gaming, audio, and premium tech drops.",
    image: "/placeholder/categories/electronics.jpg",
    accent: "cyan",
  },
  {
    slug: "fashion",
    label: "Fashion",
    description: "Streetwear, luxury, and rare pieces live.",
    image: "/placeholder/categories/fashion.jpg",
    accent: "pink",
  },
  {
    slug: "collectibles",
    label: "Collectibles",
    description: "Cards, figures, memorabilia, and limited editions.",
    image: "/placeholder/categories/collectibles.jpg",
    accent: "purple",
  },
  {
    slug: "beauty",
    label: "Beauty",
    description: "Skincare, fragrance, and elite essentials.",
    image: "/placeholder/categories/beauty.jpg",
    accent: "gold",
  },
  {
    slug: "home",
    label: "Home",
    description: "Home upgrades, decor, and curated finds.",
    image: "/placeholder/categories/home.jpg",
    accent: "cyan",
  },
  {
    slug: "auto",
    label: "Auto",
    description: "Auto accessories, detail kits, and upgrades.",
    image: "/placeholder/categories/auto.jpg",
    accent: "purple",
  },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

function normalizeSlug(slug: string) {
  return (slug ?? "").trim().toLowerCase();
}

/**
 * ✅ Needed by CategoryGrid.tsx (and general listing usage)
 * Returns a shallow copy so callers can’t mutate the registry.
 */
export function getCategories(): Category[] {
  return [...CATEGORIES];
}

export function getCategory(slug: string): Category | null {
  const s = normalizeSlug(slug);
  if (!s) return null;
  return (CATEGORIES as readonly Category[]).find((c) => c.slug === s) ?? null;
}

export function isCategorySlug(slug: string): slug is CategorySlug {
  return Boolean(getCategory(slug));
}

export function getCategorySlugs(): CategorySlug[] {
  return CATEGORIES.map((c) => c.slug);
}

/** Canonical href helper (safe encoding) */
export function categoryHref(slug: string) {
  const s = normalizeSlug(slug);
  return `/categories/${encodeURIComponent(s)}`;
}

/**
 * Header/Nav convenience
 * - later: sort by popularity, group by vertical, etc.
 */
export function categoriesForNav(): Category[] {
  return [...CATEGORIES];
}
