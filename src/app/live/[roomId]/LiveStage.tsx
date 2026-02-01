/* ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   ┃ Bidly — Live Stage — Devnet-0                                         ┃
   ┃ File   : src/app/live/[id]/LiveStage.tsx                              ┃
   ┃ Role   : Seller-first stage (hero media + minimal meta)               ┃
   ┃ Status : Devnet-0 Ready                                               ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)      ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                       ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃
   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ */

"use client";

import * as React from "react";
import { Badge } from "@/components/ui/Badge";
import type { LiveRoom } from "./live.types";

export interface LiveStageProps {
  /** ✅ FIX: page passes `room={room}` */
  room: LiveRoom;
  className?: string;
}

/** tiny class joiner */
function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

function stageLabel(state?: LiveRoom["stage"]["state"]) {
  if (state === "starting-soon") return "Starting Soon";
  if (state === "ended") return "Ended";
  if (state === "offline") return "Offline";
  return "LIVE";
}

function safeText(s?: string) {
  const t = (s ?? "").trim();
  return t || "";
}

export default function LiveStage({ room, className }: LiveStageProps) {
  const state = room?.stage?.state ?? "live";
  const title = safeText(room?.product?.title) || "Live";
  const image = safeText(room?.product?.image);
  const seller = safeText(room?.seller?.name) || "Seller";

  return (
    <section className={cx("min-w-0", className)}>
      <div
        className={cx(
          "min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] backdrop-blur",
          "shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_12px_44px_rgba(0,0,0,0.38)]"
        )}
      >
        {/* HERO MEDIA (video placeholder / image) */}
        <div className="relative min-w-0 bg-black/25" style={{ aspectRatio: "16 / 9" }}>
          {/* Background image (server-safe) */}
          {image ? (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: `url(${image})` }}
              aria-label={title}
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
          )}

          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
          <div className="absolute inset-0 opacity-35 [background:radial-gradient(85%_65%_at_50%_35%,rgba(0,240,255,0.14),transparent_60%)]" />

          {/* Top row: state badge only */}
          <div className="absolute left-4 right-4 top-4 flex items-center justify-between gap-3">
            <Badge variant={state === "live" ? "live" : "default"} className="inline-flex items-center gap-2">
              {state === "live" ? (
                <span
                  aria-hidden="true"
                  className="h-2 w-2 rounded-full bg-[var(--color-live)] animate-pulse"
                />
              ) : null}
              {stageLabel(state)}
            </Badge>

            {/* Optional right chip (kept minimal) */}
            <span className="hidden sm:inline-flex items-center rounded-full border border-white/10 bg-black/35 px-2.5 py-1 text-[11px] text-white/80 backdrop-blur whitespace-nowrap leading-none">
              {seller}
            </span>
          </div>

          {/* Center: video placeholder label (swap for real player later) */}
          <div className="absolute inset-0 grid place-items-center">
            <div className="rounded-2xl border border-white/10 bg-black/35 px-4 py-3 backdrop-blur">
              <div className="text-xs font-semibold text-white/85">LIVE STAGE</div>
              <div className="mt-0.5 text-[11px] text-white/55">
                Plug in your player here (HLS / WebRTC)
              </div>
            </div>
          </div>
        </div>

        {/* BELOW MEDIA: seller-first meta (no price/viewers/listing) */}
        <div className="p-4 sm:p-5 min-w-0">
          <div className="text-[10px] uppercase tracking-wider text-white/55 whitespace-nowrap">
            Live Room
          </div>
          <h2 className="mt-1 truncate text-base sm:text-lg font-extrabold tracking-tight text-[var(--color-text-primary)]">
            {title}
          </h2>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[11px] text-white/80">
              Host: <span className="ml-1 font-semibold text-white/90">{seller}</span>
            </span>

            {room?.seller?.handle ? (
              <span className="inline-flex items-center rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[11px] text-white/70">
                {room.seller.handle}
              </span>
            ) : null}

            {room?.seller?.verified ? (
              <span className="inline-flex items-center gap-1 rounded-full border border-white/12 bg-black/35 px-3 py-1 text-[11px] text-white/85">
                <span aria-hidden="true">✓</span> Verified
              </span>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
