// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Category Page — Devnet-0                                      ┃
   ┃ File   : src/app/categories/[slug]/page.tsx                           ┃
   ┃ Role   : Seller-first category landing (real rooms + elite empty state)┃
   ┃ Status : Devnet-0 Ready                                               ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)      ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                       ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import * as React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import Container from "@/components/layout/Container";
import Backdrop from "@/components/layout/Backdrop";

import MarketplaceGrid, {
  type MarketplaceProduct,
} from "@/components/marketplace/MarketplaceGrid";

import { isDbConfigured } from "@/lib/live/db";
import { listRooms } from "@/lib/live/rooms";
import type { LiveRoom } from "@/lib/live/types";

import {
  getCategory,
  categoriesForNav,
  categoryHref,
  type Category,
} from "../category.data";

/**
 * This page should reflect “now” (rooms coming/going live).
 * Server-rendered on demand.
 */
export const dynamic = "force-dynamic";

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

function safeText(v: unknown, fallback: string) {
  const s = typeof v === "string" ? v.trim() : "";
  return s.length ? s : fallback;
}

function roomToMarketplaceProduct(room: LiveRoom): MarketplaceProduct {
  const title = safeText(room.title, "Live Seller");
  const sellerName = safeText(room.seller?.name, "Seller");

  const image =
    room.coverUrl ||
    room.playback?.posterUrl ||
    "/placeholder/covers/cover-01.jpg";

  return {
    id: room.id,
    title,
    image,
    href: `/live/${room.id}`,
    isLive: room.status === "live" || room.status === "starting",
    seller: {
      name: sellerName,
      handle: room.seller?.handle,
      verified: Boolean(room.seller?.verified),
      avatar: room.seller?.avatarUrl,
    },
  };
}

function EmptyState({
  title,
  detail,
  hint,
}: {
  title: string;
  detail?: string;
  hint?: string;
}) {
  return (
    <div className="mx-auto max-w-[980px]">
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-6 py-8 sm:px-8">
        <div className="flex flex-col gap-3">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
            {title}
          </h2>
          {detail ? (
            <p className="text-sm sm:text-base text-[var(--color-text-muted)]">
              {detail}
            </p>
          ) : null}
          {hint ? (
            <div className="mt-2 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs sm:text-sm text-white/80">
              <span className="font-semibold text-white/90">Hint:</span> {hint}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

/* ======================================================
   Metadata (App Router)
   ====================================================== */

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
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
  // Keeping this is fine (helps local/dev + pre-known paths),
  // but the page still renders dynamically for “live” behavior.
  return categoriesForNav().map((c) => ({ slug: c.slug }));
}

/* ======================================================
   Page
   ====================================================== */

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const cat = getCategory(params.slug);
  if (!cat) notFound();

  // DB not configured: show a clean setup state (no demo sellers).
  if (!isDbConfigured()) {
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

            <div className="mt-3 flex flex-wrap gap-2">
              {categoriesForNav().map((c) => {
                const active = c.slug === cat.slug;
                return (
                  <Link
                    key={c.slug}
                    href={categoryHref(c.slug)}
                    className={cx(
                      "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold",
                      "border border-white/10 backdrop-blur",
                      active
                        ? "bg-white/10 text-white"
                        : "bg-black/25 text-white/75 hover:bg-white/10 hover:text-white"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    {c.label}
                  </Link>
                );
              })}
            </div>
          </header>

          <div className="mb-10 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <EmptyState
            title={`Connect Neon to show live ${cat.label} sellers.`}
            detail="This category page is wired for real rooms. Once Neon is connected, sellers appear here instantly."
            hint='Set DATABASE_URL in .env.local + Vercel, keep BIDLY_DB_MODE="neon", then create rooms with category set to this slug.'
          />
        </Container>
      </div>
    );
  }

  // Fetch real rooms for this category
  let rooms: LiveRoom[] = [];
  let hadError = false;

  try {
    rooms = await listRooms({
      limit: 48,
      // Category values are your slugs (electronics, fashion, etc.)
      category: cat.slug as any,
      visibility: "public",
    });
  } catch {
    hadError = true;
    rooms = [];
  }

  const products: MarketplaceProduct[] = rooms.map(roomToMarketplaceProduct);

  const liveCount = rooms.filter((r) => r.status === "live").length;
  const totalCount = rooms.length;

  return (
    <div className="relative min-h-[100svh]">
      <Backdrop />

      <Container className="relative py-12">
        <header className="mb-10 flex flex-col gap-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <p className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
                Category
              </p>

              <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
                {cat.label}
              </h1>

              <p className="mt-2 max-w-2xl text-sm md:text-base text-[var(--color-text-muted)]">
                {cat.description}
              </p>
            </div>

            <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-[var(--color-live)] animate-pulse" />
                <span className="tracking-wide">LIVE</span>
              </span>
              <span className="hidden sm:inline text-white/20">•</span>
              <span className="hidden sm:inline">
                {liveCount} live • {totalCount} total
              </span>
            </div>
          </div>

          {/* Nav chips */}
          <div className="mt-3 flex flex-wrap gap-2">
            {categoriesForNav().map((c) => {
              const active = c.slug === cat.slug;
              return (
                <Link
                  key={c.slug}
                  href={categoryHref(c.slug)}
                  className={cx(
                    "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold",
                    "border border-white/10 backdrop-blur",
                    active
                      ? "bg-white/10 text-white"
                      : "bg-black/25 text-white/75 hover:bg-white/10 hover:text-white"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  {c.label}
                </Link>
              );
            })}
          </div>
        </header>

        <div className="mb-10 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {hadError ? (
          <EmptyState
            title="Rooms failed to load."
            detail="The DB is configured, but the category query failed. This is usually a missing table/migration."
            hint="Make sure `live_rooms` exists in Neon, then refresh."
          />
        ) : products.length === 0 ? (
          <EmptyState
            title={`No ${cat.label} sellers live yet.`}
            detail="Create your first room in this category and it will show here immediately."
            hint={`POST /api/live/rooms with { title, category: "${cat.slug}", seller: { id, name, handle?, avatarUrl?, verified? } }`}
          />
        ) : (
          <MarketplaceGrid
            products={products}
            cols={3}
            max="2xl"
            gap="wide"
            density="default"
            forceLive
          />
        )}
      </Container>
    </div>
  );
}
