// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Live Auctions Page — Devnet-0                                  ┃
   ┃ File   : src/app/page.tsx                                              ┃
   ┃ Role   : Elite live tiles grid (seller-first, no “Listing”)            ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃
   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import * as React from "react";
import Container from "@/components/layout/Container";
import Backdrop from "@/components/layout/Backdrop";
import { ProductCard, type ProductCardProps } from "@/components/marketplace/ProductCard";
import { isDbConfigured } from "@/lib/live/db";
import { listRooms } from "@/lib/live/rooms";
import type { LiveRoom } from "@/lib/live/types";

/**
 * We want the homepage to reflect “now”, not cached demo data.
 * This page pulls directly from the DB repo (truth) on each request.
 */
export const dynamic = "force-dynamic";

function roomToCard(room: LiveRoom): ProductCardProps {
  return {
    id: room.id,
    title: room.title,
    image: room.coverUrl || room.playback?.posterUrl || undefined,

    // Seller-first tiles are always “Live Sellers” UX; we keep status in data layer.
    isLive: true,

    seller: {
      name: room.seller?.name ?? "Seller",
      handle: room.seller?.handle,
      verified: Boolean(room.seller?.verified),
      avatar: room.seller?.avatarUrl,
    },

    href: `/live/${room.id}`,
  };
}

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
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
            <p className="text-sm sm:text-base text-[var(--color-text-muted)]">{detail}</p>
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

export default async function Page() {
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

  const gridStyle: React.CSSProperties = {
    display: "grid",
    gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
    gap: 28,
    alignItems: "start",
    width: "100%",
    maxWidth: 1440,
    margin: "0 auto",
  };

  // If DB isn't configured, show a clean, explicit setup state (no demo generator).
  if (!isDbConfigured()) {
    return (
      <div className="relative min-h-[100svh]">
        <Backdrop />
        <style>{responsiveCss}</style>

        <Container className={cx("relative py-12 bidly-page-shell")} size="full">
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
                <span className="tracking-wide">DB NOT CONNECTED</span>
              </span>
            </div>
          </header>

          <div className="mb-10 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <EmptyState
            title="Connect Neon to go fully live."
            detail="Your homepage is now wired for real rooms. Once Neon is connected, this grid will show live sellers instantly."
            hint='Set DATABASE_URL in .env.local + Vercel, and keep BIDLY_DB_MODE="neon". Then create rooms via POST /api/live/rooms.'
          />
        </Container>
      </div>
    );
  }

  // Pull real rooms (truth). If none exist yet, show an elite empty state.
  let rooms: LiveRoom[] = [];
  let hadError = false;

  try {
    rooms = await listRooms({ limit: 48 });
  } catch {
    hadError = true;
    rooms = [];
  }

  const cards: ProductCardProps[] = rooms.map(roomToCard);

  const liveCount = rooms.filter((r) => r.status === "live").length;
  const totalCount = rooms.length;

  return (
    <div className="relative min-h-[100svh]">
      <Backdrop />
      <style>{responsiveCss}</style>

      <Container className={cx("relative py-12 bidly-page-shell")} size="full">
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
            <span className="hidden sm:inline">
              {liveCount} live • {totalCount} total
            </span>
          </div>
        </header>

        <div className="mb-10 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {hadError ? (
          <EmptyState
            title="Rooms failed to load."
            detail="The DB is configured, but the rooms query failed. This is usually a missing table/migration."
            hint="Make sure you created `live_rooms` (and later `live_messages`) in Neon, then refresh."
          />
        ) : cards.length === 0 ? (
          <EmptyState
            title="No live sellers yet."
            detail="Create your first room and it will appear here immediately."
            hint="POST /api/live/rooms with { title, seller: { id, name, handle?, avatarUrl?, verified? } }"
          />
        ) : (
          <main className="bidly-live-grid" style={gridStyle}>
            {cards.map((p) => (
              <div key={p.id} style={{ minWidth: 0 }}>
                <ProductCard {...p} />
              </div>
            ))}
          </main>
        )}
      </Container>
    </div>
  );
}
