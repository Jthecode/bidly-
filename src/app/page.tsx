// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Live Auctions Page — Devnet-0                                  ┃
   ┃ File   : src/app/page.tsx                                              ┃
   ┃ Role   : Elite live tiles grid (seller-first, no “Listing”)            ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃
   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ */

import * as React from "react";
import Container from "@/components/layout/Container";
import Backdrop from "@/components/layout/Backdrop";
import { ProductCard, type ProductCardProps } from "@/components/marketplace/ProductCard";

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function mkProducts(count = 12): ProductCardProps[] {
  return Array.from({ length: count }).map((_, i) => {
    const idx = i + 1;

    // You created cover-01..02 and avatar-01..08
    const coverIdx = (i % 2) + 1;
    const avatarIdx = (i % 8) + 1;

    return {
      id: `seller-${idx}`,
      title: `Mystery Box #${idx}`,
      image: `/placeholder/covers/cover-${pad2(coverIdx)}.jpg`,

      // ✅ ALWAYS LIVE (no Listing state anywhere)
      isLive: true,

      seller: {
        name: `Seller ${idx}`,
        handle: `@seller${idx}`,
        verified: idx % 5 === 0,
        avatar: `/placeholder/avatars/avatar-${pad2(avatarIdx)}.png`,
      },

      href: `/live/seller-${idx}`,
    };
  });
}

export default function Page() {
  const products = mkProducts(12);
  const liveCount = products.length;

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 28,
    alignItems: "start",
    width: "100%",
    maxWidth: 1440,
    margin: "0 auto",
  };

  const responsiveCss = `
    .bidly-page-shell { padding-inline: 18px; }
    @media (max-width: 1200px) {
      .bidly-live-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (max-width: 740px) {
      .bidly-live-grid { grid-template-columns: repeat(1, minmax(0, 1fr)); }
    }
    .bidly-live-grid > * { min-width: 0; }
  `;

  return (
    <div className="relative min-h-[100svh]">
      <Backdrop />
      <style>{responsiveCss}</style>

      <Container className="relative py-12 bidly-page-shell" size="full">
        <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl min-w-0">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
              Live Sellers
            </h1>
            <p className="mt-1 text-sm md:text-base text-[var(--color-text-muted)]">
              Seller-first tiles. Clean. Cyber-luxury.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-[var(--color-live)] animate-pulse" />
              <span className="tracking-wide">LIVE SELLERS</span>
            </span>
            <span className="hidden sm:inline text-white/20">•</span>
            <span className="hidden sm:inline">{liveCount} live sellers</span>
          </div>
        </header>

        <div className="mb-10 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <main className="bidly-live-grid" style={gridStyle}>
          {products.map((p) => (
            <div key={p.id} style={{ minWidth: 0 }}>
              <ProductCard {...p} />
            </div>
          ))}
        </main>
      </Container>
    </div>
  );
}
