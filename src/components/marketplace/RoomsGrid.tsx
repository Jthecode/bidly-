// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Marketplace (Rooms Grid) — Devnet-0                            ┃
   ┃ File   : src/components/marketplace/RoomsGrid.tsx                      ┃
   ┃ Role   : Live rooms grid (realtime refresh via Ably rooms channel)     ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

"use client";

import * as React from "react";

import { subscribeRooms } from "@/lib/realtime/ably";
import type { LiveRoom } from "@/lib/live/types";
import { ProductCard, type ProductCardProps } from "@/components/marketplace/ProductCard";
import Skeleton from "@/components/ui/Skeleton";
import EmptyState from "@/components/ui/EmptyState";

type Props = {
  /**
   * Initial rooms (server-fetched).
   * If empty, component will show an empty state unless `loading` is true.
   */
  initial?: LiveRoom[];

  /**
   * Optional async refresher. If provided, we will call it:
   * - on mount (if no initial)
   * - when Ably signals rooms changed
   */
  refresh?: () => Promise<LiveRoom[]>;

  /**
   * Grid layout controls
   */
  cols?: 1 | 2 | 3 | 4;
  limit?: number;

  /**
   * If true, show skeletons and suppress empty state.
   */
  loading?: boolean;

  /**
   * Optional title + subtitle
   */
  title?: string;
  subtitle?: string;

  /**
   * If true, treat every card as “live” visually (seller-first UX),
   * even if the room status isn't live yet.
   */
  forceLive?: boolean;

  /**
   * Optional className wrapper
   */
  className?: string;
};

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

function roomToCard(room: LiveRoom, forceLive?: boolean): ProductCardProps {
  return {
    id: room.id,
    title: room.title,
    image: room.coverUrl || room.playback?.posterUrl || undefined,
    isLive: forceLive ? true : room.status === "live",
    seller: {
      name: room.seller?.name ?? "Seller",
      handle: room.seller?.handle,
      verified: Boolean(room.seller?.verified),
      avatar: room.seller?.avatarUrl,
    },
    href: `/live/${room.id}`,
  };
}

function clampCols(cols: Props["cols"]) {
  const c = Number(cols ?? 3);
  if (c <= 1) return 1;
  if (c === 2) return 2;
  if (c === 4) return 4;
  return 3;
}

export default function RoomsGrid({
  initial = [],
  refresh,
  cols = 3,
  limit = 48,
  loading = false,
  title = "Live Sellers",
  subtitle = "Realtime marketplace tiles (updates instantly).",
  forceLive = false,
  className,
}: Props) {
  const [rooms, setRooms] = React.useState<LiveRoom[]>(initial);
  const [busy, setBusy] = React.useState<boolean>(loading);
  const [err, setErr] = React.useState<string | null>(null);

  const colsSafe = clampCols(cols);

  const gridStyle: React.CSSProperties = React.useMemo(() => {
    const base = colsSafe;
    return {
      display: "grid",
      gridTemplateColumns: `repeat(${base}, minmax(0, 1fr))`,
      gap: 28,
      alignItems: "start",
      width: "100%",
    };
  }, [colsSafe]);

  const responsiveCss = React.useMemo(() => {
    // gentle fallback responsiveness even without Tailwind grid utilities
    return `
      @media (max-width: 1200px) {
        .bidly-rooms-grid { grid-template-columns: repeat(${Math.min(2, colsSafe)}, minmax(0, 1fr)); }
      }
      @media (max-width: 740px) {
        .bidly-rooms-grid { grid-template-columns: repeat(1, minmax(0, 1fr)); }
      }
      .bidly-rooms-grid > * { min-width: 0; }
    `;
  }, [colsSafe]);

  async function doRefresh(reason: "mount" | "realtime") {
    if (!refresh) return;
    setErr(null);
    setBusy(true);
    try {
      const next = await refresh();
      const sliced = (next ?? []).slice(0, limit);
      setRooms(sliced);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to refresh rooms.");
    } finally {
      setBusy(false);
    }
  }

  React.useEffect(() => {
    // If no initial data and we have refresh, pull once.
    if (initial.length === 0 && refresh) {
      void doRefresh("mount");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    // Realtime: if Ably says “rooms changed”, refresh (truth from DB).
    const unsub = subscribeRooms(() => {
      void doRefresh("realtime");
    });

    return () => {
      unsub?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, limit]);

  const cards = rooms.slice(0, limit).map((r) => roomToCard(r, forceLive));

  const showSkeletons = busy || loading;
  const showEmpty = !showSkeletons && !err && cards.length === 0;

  return (
    <section className={cx("min-w-0", className)}>
      <style>{responsiveCss}</style>

      <div className="mb-6 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
            {title}
          </h2>
          {subtitle ? (
            <p className="mt-1 text-sm text-[var(--color-text-muted)]">{subtitle}</p>
          ) : null}
        </div>

        <div className="mt-2 flex items-center gap-3 text-xs text-[var(--color-text-muted)] sm:mt-0">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur">
            <span
              className={cx(
                "h-2 w-2 rounded-full",
                showSkeletons ? "bg-white/30" : "bg-[var(--color-live)] animate-pulse"
              )}
            />
            <span className="tracking-wide">{showSkeletons ? "UPDATING" : "LIVE"}</span>
          </span>

          {refresh ? (
            <button
              type="button"
              onClick={() => void doRefresh("realtime")}
              disabled={showSkeletons}
              className={cx(
                "rounded-full border border-white/10 bg-black/25 px-3 py-1.5",
                "text-white/80 hover:bg-white/10 hover:text-white transition",
                showSkeletons && "opacity-60 cursor-not-allowed"
              )}
            >
              Refresh
            </button>
          ) : null}
        </div>
      </div>

      {err ? (
        <div className="mb-6 rounded-2xl border border-[var(--color-live)]/25 bg-[var(--color-live)]/10 px-4 py-3 text-sm text-white/90">
          <span className="font-semibold">Rooms refresh failed:</span> {err}
        </div>
      ) : null}

      {showEmpty ? (
        <EmptyState
          title="No live sellers yet."
          description="Create your first room and it will appear here immediately."
          hint="Use POST /api/live/rooms, then publish a rooms event to Ably (or just refresh)."
        />
      ) : showSkeletons ? (
        <div className="bidly-rooms-grid" style={gridStyle}>
          {Array.from({ length: colsSafe * 2 }).map((_, i) => (
            <div key={i} className="min-w-0">
              <Skeleton className="h-[320px] rounded-2xl" />
            </div>
          ))}
        </div>
      ) : (
        <div className="bidly-rooms-grid" style={gridStyle}>
          {cards.map((p) => (
            <div key={p.id} className="min-w-0">
              <ProductCard {...p} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
