// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — ProductCard Component — Devnet-0                               ┃
   ┃ File   : src/components/marketplace/ProductCard.tsx                    ┃
   ┃ Role   : Marketplace product tile (minimal live info, cyber-luxury)    ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃
   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ */

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";

type Seller = {
  name: string;
  avatar?: string;
  handle?: string;
  verified?: boolean;
};

export interface ProductCardProps {
  id: string;
  title: string;

  /** Optional to prevent layout blowups when missing */
  image?: string;

  /** Optional routing (keeps component Server-safe; no events) */
  href?: string;

  isLive?: boolean;

  /** Optional live stats (kept minimal) */
  viewers?: number;

  /** Seller info */
  seller?: Seller;

  /** Optional: force a simpler tile density */
  density?: "default" | "compact";

  className?: string;
}

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

function safeTitle(s?: string) {
  const t = (s ?? "").trim();
  return t || "Untitled";
}

function safeViewers(v?: number) {
  if (typeof v !== "number" || !Number.isFinite(v) || v < 0) return null;
  return Math.round(v);
}

function formatViewers(v: number) {
  // clean “Whatnot-ish” compact numbers
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
  return String(v);
}

export default function ProductCard({
  id,
  title,
  image,
  href,
  isLive = false,
  viewers,
  seller,
  density = "default",
  className,
}: ProductCardProps) {
  const t = safeTitle(title);

  const hostName = (seller?.name ?? "Seller").trim() || "Seller";
  const handle = (seller?.handle ?? "").trim() || null;
  const verified = Boolean(seller?.verified);

  const v = safeViewers(viewers);

  // Server-safe navigation (no onClick, no client component)
  const to = (href ?? `/listing/${id}`).trim() || `/listing/${id}`;

  const pad = density === "compact" ? "p-3" : "p-4";
  const titleSize = density === "compact" ? "text-[15px]" : "text-base";

  return (
    <Card
      className={cx(
        // Grid safety
        "w-full min-w-0 overflow-hidden rounded-2xl",
        // Cyber-glass surface
        "border border-white/10 bg-white/[0.035] backdrop-blur",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_12px_44px_rgba(0,0,0,0.38)]",
        // Motion
        "transition-transform duration-200 hover:-translate-y-0.5",
        className
      )}
    >
      <Link
        href={to}
        className={cx(
          "group block min-w-0",
          "rounded-2xl",
          "focus:outline-none focus-visible:ring-1 focus-visible:ring-white/15"
        )}
        aria-label={isLive ? `Open live auction: ${t}` : `Open listing: ${t}`}
      >
        {/* MEDIA (clean, no price/ends clutter) */}
        <div className="relative min-w-0">
          <div
            className={cx("relative w-full overflow-hidden", "bg-[var(--color-bg-elevated)]")}
            // More “live tile” feel; less giant empty square.
            style={{ aspectRatio: "16 / 9" }}
          >
            {/* Background image (server-safe) */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={image ? { backgroundImage: `url(${image})` } : undefined}
              aria-label={t}
            />

            {/* Premium base if no image */}
            {!image && (
              <div className="absolute inset-0 bg-gradient-to-br from-white/12 via-white/6 to-transparent" />
            )}

            {/* Cyber overlays (subtle) */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/68 via-black/20 to-black/10" />
            <div className="absolute inset-0 opacity-25 [background:radial-gradient(85%_65%_at_50%_35%,rgba(0,240,255,0.14),transparent_60%)]" />

            {/* TOP ROW: LIVE + viewers (only) */}
            <div className="absolute left-3 right-3 top-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                {isLive ? (
                  <Badge variant="live" className="inline-flex items-center gap-2 whitespace-nowrap leading-none">
                    <span className="h-2 w-2 rounded-full bg-[var(--color-live)] animate-pulse" />
                    LIVE
                  </Badge>
                ) : (
                  <span className="inline-flex items-center rounded-full border border-white/12 bg-black/35 px-2.5 py-1 text-[11px] text-white/80 backdrop-blur whitespace-nowrap leading-none">
                    Listing
                  </span>
                )}
              </div>

              {isLive && v !== null ? (
                <span className="shrink-0 inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/40 px-2.5 py-1 text-[11px] text-white/85 backdrop-blur whitespace-nowrap leading-none">
                  <span aria-hidden="true">👀</span>
                  {formatViewers(v)}
                </span>
              ) : null}
            </div>
          </div>
        </div>

        {/* DETAILS (clean: title + seller + join/view) */}
        <div className={cx(pad, "min-w-0")}>
          <div className="flex items-start justify-between gap-3 min-w-0">
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)] whitespace-nowrap">
                {isLive ? "Live Auction" : "Listing"}
              </div>

              <h3
                className={cx(
                  "mt-1 line-clamp-2 font-semibold leading-snug text-[var(--color-text-primary)]",
                  titleSize
                )}
              >
                {t}
              </h3>
            </div>

            <span
              className={cx(
                "shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold",
                "border border-white/10 bg-white/5 text-white/90",
                "whitespace-nowrap leading-none",
                "transition-colors group-hover:bg-white/10",
                isLive ? "shadow-[0_0_16px_rgba(255,0,208,0.10)]" : ""
              )}
              aria-label={isLive ? "Join auction" : "View item"}
            >
              {isLive ? "Join" : "View"}
            </span>
          </div>

          {/* SELLER (simple, no extra blocks/lines) */}
          {seller ? (
            <div className={cx(density === "compact" ? "mt-3" : "mt-4", "flex items-center gap-3 min-w-0")}>
              <div className="shrink-0">
                <Avatar
                  src={seller.avatar}
                  alt={hostName}
                  size={density === "compact" ? "sm" : "sm"}
                  isActive={Boolean(isLive)}
                  verified={verified}
                />
              </div>

              <div className="min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="truncate text-sm font-semibold text-white/90">{hostName}</div>

                  {verified ? (
                    <span
                      className="inline-flex items-center gap-1 rounded-full border border-white/12 bg-black/35 px-2 py-0.5 text-[10px] text-white/85 whitespace-nowrap leading-none"
                      aria-label="Verified seller"
                      title="Verified seller"
                    >
                      <span aria-hidden="true">✓</span>
                      <span className="hidden sm:inline">Verified</span>
                    </span>
                  ) : null}
                </div>

                {handle ? (
                  <div className="truncate text-xs text-white/65">{handle}</div>
                ) : (
                  <div className="truncate text-xs text-white/55">Seller</div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </Link>
    </Card>
  );
}

export { ProductCard };
