/* ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   ┃ Bidly — Product Card — Devnet-0                                        ┃
   ┃ File   : src/components/product/ProductCard.tsx                        ┃
   ┃ Role   : Live seller tile w/ cover preview (grid-safe, pro)            ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃
   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ */

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";

export type SellerInfo = {
  name: string;
  avatar?: string;
  verified?: boolean;
  handle?: string;
};

export interface ProductCardProps {
  id: string;

  seller?: SellerInfo;
  isLive?: boolean;

  /** Auction title shown under the preview */
  title: string;

  /** Cover frame for the preview */
  image?: string;

  currentBid: number;
  viewers: number;
  endsIn: string;

  /**
   * Optional destination.
   * Defaults to `/live/${id}`.
   * Keep ProductCard server-safe: use Link, no client handlers.
   */
  href?: string;

  className?: string;
}

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

function formatUsd(n: number) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `$${Math.round(n)}`;
  }
}

function shortHandle(name?: string) {
  const base = (name ?? "seller")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
  return base ? `@${base.slice(0, 14)}` : "@seller";
}

type MetricPillProps = {
  label: string;
  value: string;
  tone?: "live" | "muted";
};

function MetricPill({ label, value, tone = "muted" }: MetricPillProps) {
  return (
    <div
      className={cx(
        "min-w-0 rounded-xl border px-2.5 py-2 backdrop-blur",
        "bg-black/35 border-white/12",
        "flex flex-col justify-center",
        "h-[52px]",
        tone === "live" ? "shadow-[0_0_18px_rgba(0,240,255,0.10)]" : ""
      )}
    >
      <div className="text-[10px] uppercase tracking-wider text-white/60">{label}</div>
      <div className="mt-0.5 truncate text-sm font-semibold text-white">{value}</div>
    </div>
  );
}

export default function ProductCard(props: ProductCardProps) {
  const {
    id,
    title,
    image,
    currentBid,
    viewers,
    endsIn,
    isLive,
    seller,
    href,
    className,
  } = props;

  const hostName = seller?.name ?? "Live Seller";
  const handle = seller?.handle ?? shortHandle(hostName);
  const verified = Boolean(seller?.verified);
  const live = Boolean(isLive);
  const to = href ?? `/live/${id}`;

  /**
   * Grid-safety rules:
   * - Outer card: min-w-0, no forced height
   * - Preview: fixed aspect ratio (16:9) so rows don’t “dance”
   * - Internal text: truncate + min-w-0 so it doesn’t blow out columns
   */
  return (
    <Card
      className={cx(
        "group w-full min-w-0 overflow-hidden rounded-2xl",
        "border border-white/10 bg-white/[0.035] backdrop-blur",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.04)]",
        "transition-transform duration-200 hover:-translate-y-0.5",
        className
      )}
    >
      <div className="p-3 min-w-0">
        {/* PREVIEW TILE */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-black/55">
          <div
            className={cx("relative w-full", "aspect-video")}
            style={{ aspectRatio: "16 / 9" }} // fallback even if Tailwind isn’t applied
          >
            {/* cover */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={image ? { backgroundImage: `url(${image})` } : undefined}
            />
            {/* always give a premium fallback base so empty covers still look elite */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/12 via-white/6 to-transparent" />

            {/* premium overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/10" />
            <div className="absolute inset-0 opacity-45 [background:radial-gradient(85%_65%_at_50%_35%,rgba(0,240,255,0.16),transparent_60%)]" />

            {/* TOP BAR */}
            <div className="absolute left-0 right-0 top-0 p-3">
              <div className="flex items-center justify-between gap-3">
                {/* seller */}
                <div className="flex min-w-0 items-center gap-2.5">
                  <Avatar src={seller?.avatar} alt={hostName} size="sm" isActive={live} />

                  <div className="min-w-0 leading-tight">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="truncate text-sm font-semibold text-white">{hostName}</div>

                      {verified && (
                        <span
                          className="inline-flex items-center gap-1 rounded-full border border-white/12 bg-black/35 px-2 py-0.5 text-[10px] text-white/85"
                          aria-label="Verified"
                          title="Verified"
                        >
                          <span aria-hidden="true">✓</span>
                          <span className="hidden sm:inline">Verified</span>
                        </span>
                      )}
                    </div>

                    <div className="truncate text-xs text-white/70">{handle}</div>
                  </div>
                </div>

                {/* status + viewers */}
                <div className="shrink-0 flex items-center gap-2">
                  <span
                    className={cx(
                      "inline-flex items-center gap-2 rounded-full border px-2.5 py-1 text-[11px] tracking-wide backdrop-blur",
                      live
                        ? "border-[var(--color-live)]/35 bg-[var(--color-live)]/15 text-[var(--color-live)]"
                        : "border-white/12 bg-white/5 text-white/80"
                    )}
                  >
                    <span
                      className={cx(
                        "h-2 w-2 rounded-full",
                        live ? "bg-[var(--color-live)] animate-pulse" : "bg-white/30"
                      )}
                    />
                    {live ? "LIVE" : "OFFLINE"}
                  </span>

                  <span className="hidden sm:inline-flex items-center rounded-full border border-white/12 bg-black/35 px-2.5 py-1 text-[11px] text-white/80">
                    👀 {viewers.toLocaleString("en-US")}
                  </span>
                </div>
              </div>
            </div>

            {/* CENTER play glyph */}
            <div className="absolute inset-0 grid place-items-center">
              <div
                className={cx(
                  "rounded-full border border-white/15 bg-black/30 p-4 backdrop-blur",
                  "transition-transform duration-200 group-hover:scale-[1.02]",
                  live ? "shadow-[0_0_28px_rgba(0,240,255,0.18)]" : ""
                )}
                aria-hidden="true"
              >
                <div className="h-0 w-0 border-y-[10px] border-y-transparent border-l-[16px] border-l-white/85 translate-x-[2px]" />
              </div>
            </div>

            {/* BOTTOM METRICS BAR */}
            <div className="absolute bottom-0 left-0 right-0 p-3">
              <div className="grid grid-cols-3 gap-2">
                <MetricPill
                  label="Current bid"
                  value={formatUsd(currentBid)}
                  tone={live ? "live" : "muted"}
                />
                <MetricPill label="Viewers" value={viewers.toLocaleString("en-US")} />
                <MetricPill label="Ends in" value={endsIn} />
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER (title + CTA) */}
        <div className="mt-3 grid grid-cols-[1fr_auto] items-center gap-3 min-w-0">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
              Live Auction
            </div>
            <div className="truncate text-sm font-semibold text-[var(--color-text-primary)]">
              {title}
            </div>
          </div>

          {/* Server-safe CTA (no event handlers) */}
          <Link
            href={to}
            className={cx(
              "shrink-0 rounded-xl px-4 py-2 text-sm font-semibold",
              "border border-white/10 bg-white/5 text-white/90",
              "hover:bg-white/10 transition-colors",
              live ? "shadow-[0_0_18px_rgba(0,240,255,0.12)]" : ""
            )}
            aria-label={live ? "Join live" : "View"}
          >
            {live ? "Join Live" : "View"}
          </Link>
        </div>
      </div>
    </Card>
  );
}

// Optional named export for convenience
export { ProductCard };
