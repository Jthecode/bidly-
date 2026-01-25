// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Category Page — Devnet-0                                      ┃
   ┃ File   : src/app/categories/[slug]/page.tsx                           ┃
   ┃ Role   : Seller-first category landing (no “listing” semantics)       ┃
   ┃ Status : Devnet-0 Ready                                               ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)      ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                       ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import * as React from "react";
import { notFound } from "next/navigation";

import Container from "@/components/layout/Container";
import Backdrop from "@/components/layout/Backdrop";

import MarketplaceGrid, {
  type MarketplaceProduct,
} from "@/components/marketplace/MarketplaceGrid";

import {
  getCategory,
  categoriesForNav,
  categoryHref,
  type Category,
} from "../category.data";

/* ======================================================
   Demo seller tiles for this category (deterministic)
   Replace with real data when backend exists.
   ====================================================== */

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function makeCategorySellers(category: Category, count = 12): MarketplaceProduct[] {
  return Array.from({ length: count }).map((_, i) => {
    const idx = i + 1;
    const coverIdx = (i % 2) + 1; // cover-01..02
    const avatarIdx = (i % 8) + 1; // avatar-01..08

    return {
      id: `${category.slug}-seller-${idx}`,
      title: `${category.label} • Seller ${idx}`,
      image: `/placeholder/covers/cover-${pad2(coverIdx)}.jpg`,
      href: `/live/${category.slug}-seller-${idx}`,
      isLive: true,
      seller: {
        name: `Seller ${idx}`,
        handle: `@${category.slug}${idx}`,
        verified: idx % 5 === 0,
        avatar: `/placeholder/avatars/avatar-${pad2(avatarIdx)}.png`,
      },
    };
  });
}

/* ======================================================
   Metadata (App Router)
   ====================================================== */

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const cat = getCategory(params.slug);
  if (!cat) return {};

  const title = `${cat.label} • Categories • Bidly`;
  const description = cat.description;

  return {
    title,
    description,
    alternates: { canonical: categoryHref(cat.slug) },
    openGraph: {
      title,
      description,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export async function generateStaticParams() {
  // Enables static generation for known categories
  return categoriesForNav().map((c) => ({ slug: c.slug }));
}

/* ======================================================
   Page
   ====================================================== */

export default function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const cat = getCategory(params.slug);
  if (!cat) notFound();

  const products = makeCategorySellers(cat, 12);

  return (
    <div className="relative min-h-[100svh]">
      <Backdrop />

      <Container className="relative py-12">
        <header className="mb-10 flex flex-col gap-3">
          <p className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
            Category
          </p>

          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
            {cat.label}
          </h1>

          <p className="max-w-2xl text-sm md:text-base text-[var(--color-text-muted)]">
            {cat.description}
          </p>

          {/* Simple nav chips (optional) */}
          <div className="mt-3 flex flex-wrap gap-2">
            {categoriesForNav().map((c) => {
              const active = c.slug === cat.slug;
              return (
                <a
                  key={c.slug}
                  href={categoryHref(c.slug)}
                  className={[
                    "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold",
                    "border border-white/10 backdrop-blur",
                    active
                      ? "bg-white/10 text-white"
                      : "bg-black/25 text-white/75 hover:bg-white/10 hover:text-white",
                  ].join(" ")}
                  aria-current={active ? "page" : undefined}
                >
                  {c.label}
                </a>
              );
            })}
          </div>
        </header>

        <MarketplaceGrid
          products={products}
          cols={3}
          max="2xl"
          gap="wide"
          density="default"
          forceLive
        />
      </Container>
    </div>
  );
}
