/* ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   ┃ Bidly — Live Header — Devnet-0                                         ┃
   ┃ File   : src/app/live/[id]/LiveHeader.tsx                              ┃
   ┃ Role   : Seller-first live header (LIVE badge + title + seller)        ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃
   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ */

"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import type { LiveRoom } from "./live.types";
import { roomIsLive } from "./live.types";

export type LiveSeller = {
  name: string;
  handle?: string;
  avatar?: string;
  verified?: boolean;
};

export interface LiveHeaderProps {
  /**
   * ✅ Primary API (preferred):
   * pass the room object and the header will derive everything.
   */
  room?: LiveRoom | null;

  /**
   * Back-compat API:
   * older call sites can still pass title + seller directly.
   */
  title?: string;
  seller?: LiveSeller;

  className?: string;

  /**
   * Optional: back link destination.
   * Default: / (your live auctions grid)
   */
  backHref?: string;
}

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

function safeText(s?: string) {
  const t = (s ?? "").trim();
  return t || "";
}

function stageLabel(room?: LiveRoom | null) {
  const st = room?.stage?.state;
  if (st === "starting-soon") return "Starting Soon";
  if (st === "ended") return "Ended";
  if (st === "offline") return "Offline";
  return "LIVE";
}

function deriveSeller(room?: LiveRoom | null, seller?: LiveSeller): LiveSeller {
  if (room?.seller) {
    return {
      name: room.seller.name,
      handle: room.seller.handle,
      avatar: room.seller.avatar,
      verified: room.seller.verified,
    };
  }
  return seller ?? { name: "Seller" };
}

function deriveTitle(room?: LiveRoom | null, title?: string, sellerName?: string) {
  const t = safeText(title);
  if (t) return t;

  const productTitle = safeText(room?.product?.title);
  if (productTitle) return productTitle;

  const sn = safeText(sellerName);
  return sn ? `Live with ${sn}` : "Live";
}

export default function LiveHeader({
  room,
  title,
  seller,
  className,
  backHref = "/",
}: LiveHeaderProps) {
  const s = deriveSeller(room, seller);

  const name = safeText(s.name) || "Seller";
  const handle = safeText(s.handle) || "";
  const verified = Boolean(s.verified);

  const t = deriveTitle(room, title, name);

  const isLive = room ? roomIsLive(room) : true;
  const label = room ? stageLabel(room) : "LIVE";

  return (
    <header
      className={cx(
        "min-w-0",
        "rounded-2xl border border-white/10 bg-white/[0.035] backdrop-blur",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_12px_44px_rgba(0,0,0,0.38)]",
        className
      )}
    >
      <div className="flex items-start justify-between gap-4 p-4 sm:p-5 min-w-0">
        {/* Left: Back + Status + Title */}
        <div className="min-w-0">
          <div className="flex items-center gap-3">
            <Link
              href={backHref}
              className={cx(
                "inline-flex items-center gap-2 rounded-xl",
                "border border-white/10 bg-black/25 px-3 py-2",
                "text-xs font-semibold text-white/85",
                "transition-colors hover:bg-black/35 hover:text-white",
                "focus:outline-none focus-visible:ring-1 focus-visible:ring-white/15"
              )}
              aria-label="Back"
            >
              <span aria-hidden="true">←</span>
              <span className="hidden sm:inline">Back</span>
            </Link>

            <Badge
              variant={isLive ? "live" : "default"}
              className="inline-flex items-center gap-2"
            >
              {isLive ? (
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-[var(--color-live)] animate-pulse"
                />
              ) : (
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-white/40"
                />
              )}
              {label.toUpperCase()}
            </Badge>
          </div>

          <h1 className="mt-3 truncate text-lg sm:text-xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
            {t}
          </h1>
        </div>

        {/* Right: Seller (seller-first) */}
        <div className="shrink-0">
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/20 px-3 py-2">
            <Avatar
              src={s.avatar}
              alt={name}
              size="sm"
              isActive={isLive}
              verified={verified}
            />

            <div className="min-w-0">
              <div className="flex items-center gap-2 min-w-0">
                <div className="max-w-[180px] truncate text-sm font-semibold text-white/90">
                  {name}
                </div>

                {verified ? (
                  <span
                    className="inline-flex items-center gap-1 rounded-full border border-white/12 bg-black/35 px-2 py-0.5 text-[10px] text-white/85 whitespace-nowrap"
                    aria-label="Verified seller"
                    title="Verified seller"
                  >
                    <span aria-hidden="true">✓</span>
                    <span className="hidden sm:inline">Verified</span>
                  </span>
                ) : null}
              </div>

              {handle ? (
                <div className="max-w-[180px] truncate text-xs text-white/65">
                  {handle}
                </div>
              ) : (
                <div className="max-w-[180px] truncate text-xs text-white/55">
                  Seller
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
