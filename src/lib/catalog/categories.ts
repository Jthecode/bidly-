// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Catalog (Categories) — Devnet-0                                ┃
   ┃ File   : src/lib/catalog/categories.ts                                 ┃
   ┃ Role   : Canonical category registry + helpers (nav + slugs + labels)  ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

export type CategorySlug =
  | "electronics"
  | "fashion"
  | "collectibles"
  | "beauty"
  | "home"
  | "luxury"
  | "sneakers"
  | "cards";

export type Category = {
  slug: CategorySlug;
  label: string;
  description: string;
  /**
   * Optional emoji or short mark for quick visual scanning in nav chips.
   * Keep it minimal; UI can choose whether to render it.
   */
  mark?: string;
  /**
   * Optional cover image used by category hero or cards.
   */
  coverUrl?: string;
};

const CATEGORIES: readonly Category[] = [
  {
    slug: "electronics",
    label: "Electronics",
    description: "Tech drops, gadgets, audio, gaming — seller-first live deals.",
    mark: "⚡",
    coverUrl: "/placeholder/categories/electronics.jpg",
  },
  {
    slug: "fashion",
    label: "Fashion",
    description: "Streetwear, essentials, designer finds — live, fast, curated.",
    mark: "✦",
    coverUrl: "/placeholder/categories/fashion.jpg",
  },
  {
    slug: "collectibles",
    label: "Collectibles",
    description: "Rare finds, grails, signed items — authenticity-first live rooms.",
    mark: "◇",
    coverUrl: "/placeholder/categories/collectibles.jpg",
  },
  {
    slug: "beauty",
    label: "Beauty",
    description: "Skincare, fragrance, cosmetics — premium live showcases.",
    mark: "✧",
    coverUrl: "/placeholder/categories/beauty.jpg",
  },
  {
    slug: "home",
    label: "Home",
    description: "Home upgrades, decor, kitchen — curated live shopping.",
    mark: "⌂",
    coverUrl: "/placeholder/categories/home.jpg",
  },
  {
    slug: "luxury",
    label: "Luxury",
    description: "High-end authenticated pieces — seller-led experiences.",
    mark: "♛",
    coverUrl: "/placeholder/categories/luxury.jpg",
  },
  {
    slug: "sneakers",
    label: "Sneakers",
    description: "Heat, deadstock, rare sizes — fast live auctions.",
    mark: "⟡",
    coverUrl: "/placeholder/categories/sneakers.jpg",
  },
  {
    slug: "cards",
    label: "Cards",
    description: "Sports + TCG breaks, slabs, pulls — live room energy.",
    mark: "🂡",
    coverUrl: "/placeholder/categories/cards.jpg",
  },
] as const;

export function categories(): readonly Category[] {
  return CATEGORIES;
}

export function categoriesForNav(): readonly Category[] {
  // You can customize nav ordering here without changing the canonical list.
  return CATEGORIES;
}

export function isCategorySlug(slug: string): slug is CategorySlug {
  return (CATEGORIES as readonly Category[]).some((c) => c.slug === slug);
}

export function getCategory(slug: string): Category | null {
  const s = (slug ?? "").trim().toLowerCase();
  const found = (CATEGORIES as readonly Category[]).find((c) => c.slug === (s as any));
  return found ?? null;
}

export function categoryHref(slug: CategorySlug | string) {
  const s = (slug ?? "").trim().toLowerCase();
  return `/categories/${encodeURIComponent(s)}`;
}

export function categoryLabel(slug: string, fallback = "Category") {
  return getCategory(slug)?.label ?? fallback;
}

export function categoryDescription(slug: string, fallback = "") {
  return getCategory(slug)?.description ?? fallback;
}

/**
 * Optional: map a room category string to a CategorySlug if you ever
 * receive input from DB or external sources.
 */
export function normalizeCategorySlug(input?: string | null): CategorySlug | null {
  const s = (input ?? "").trim().toLowerCase();
  return isCategorySlug(s) ? s : null;
}
