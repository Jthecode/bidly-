/* ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   ┃ Bidly — Live Action Bar — Devnet-0                                     ┃
   ┃ File   : src/app/live/[id]/LiveActionBar.tsx                           ┃
   ┃ Role   : Primary live actions (Follow/Share/Shop) — seller-first UI    ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃
   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ */

"use client";

import * as React from "react";
import { Card, CardSection } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

import type { LiveStream } from "./live.types";

export interface LiveActionBarProps extends React.HTMLAttributes<HTMLDivElement> {
  stream: LiveStream;
  density?: "default" | "compact";

  /**
   * Optional: hide certain actions in early builds.
   */
  showFollow?: boolean;
  showShare?: boolean;
  showShop?: boolean;
}

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

function safeText(s: unknown, fallback: string) {
  const t = typeof s === "string" ? s.trim() : "";
  return t || fallback;
}

export default function LiveActionBar({
  stream,
  density = "default",
  showFollow = true,
  showShare = true,
  showShop = true,
  className,
  ...props
}: LiveActionBarProps) {
  const sellerName = safeText(stream?.seller?.name, "Seller");
  const isLive = Boolean(stream?.isLive);

  const pad = density === "compact" ? "p-4" : "p-5";
  const gap = density === "compact" ? "gap-2" : "gap-3";

  return (
    <Card className={cx("min-w-0 overflow-hidden", className)} {...props}>
      <CardSection className={cx("min-w-0", pad)}>
        <div className="flex items-center justify-between gap-3 min-w-0">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
              Actions
            </div>
            <div className="mt-1 flex items-center gap-2 min-w-0">
              {isLive ? (
                <Badge variant="live" className="px-3 py-1">
                  LIVE
                </Badge>
              ) : (
                <span className="inline-flex items-center rounded-full border border-white/12 bg-black/35 px-3 py-1 text-[11px] font-semibold text-white/80 leading-none whitespace-nowrap">
                  OFFLINE
                </span>
              )}
              <div className="truncate text-sm text-white/70">
                {sellerName} • seller-first stream
              </div>
            </div>
          </div>

          <span
            className={cx(
              "shrink-0 inline-flex items-center rounded-xl px-3 py-1.5",
              "border border-white/10 bg-white/5 text-white/85",
              "text-xs font-semibold leading-none whitespace-nowrap"
            )}
          >
            Quick
          </span>
        </div>

        <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className={cx("mt-5 grid grid-cols-1 sm:grid-cols-3", gap, "min-w-0")}>
          {showFollow ? (
            <button
              type="button"
              className={cx(
                "min-w-0",
                "rounded-2xl border border-white/10 bg-white/5",
                "px-4 py-3",
                "text-sm font-semibold text-white/90",
                "hover:bg-white/10",
                "transition",
                "shadow-[0_0_0_1px_rgba(255,255,255,0.03)]"
              )}
              aria-label="Follow seller"
              onClick={() => {
                // demo noop
              }}
            >
              Follow
              <span className="ml-2 text-xs text-white/50">+</span>
            </button>
          ) : null}

          {showShare ? (
            <button
              type="button"
              className={cx(
                "min-w-0",
                "rounded-2xl border border-white/10 bg-white/5",
                "px-4 py-3",
                "text-sm font-semibold text-white/90",
                "hover:bg-white/10",
                "transition",
                "shadow-[0_0_0_1px_rgba(255,255,255,0.03)]"
              )}
              aria-label="Share stream"
              onClick={async () => {
                // light, safe share attempt; no hard dependency
                const url =
                  typeof window !== "undefined" ? window.location.href : "";
                try {
                  // @ts-ignore
                  if (navigator?.share && url) {
                    // @ts-ignore
                    await navigator.share({
                      title: `Bidly Live — ${sellerName}`,
                      url,
                    });
                  }
                } catch {
                  // ignore
                }
              }}
            >
              Share
              <span className="ml-2 text-xs text-white/50">↗</span>
            </button>
          ) : null}

          {showShop ? (
            <button
              type="button"
              className={cx(
                "min-w-0",
                "rounded-2xl border border-white/10 bg-white/5",
                "px-4 py-3",
                "text-sm font-semibold text-white/90",
                "hover:bg-white/10",
                "transition",
                "shadow-[0_0_0_1px_rgba(255,255,255,0.03)]"
              )}
              aria-label="Shop seller items"
              onClick={() => {
                // demo noop
              }}
            >
              Shop
              <span className="ml-2 text-xs text-white/50">▦</span>
            </button>
          ) : null}
        </div>

        <div className="mt-3 text-xs text-white/40">
          Seller-first UI • no listing labels • clean professional actions.
        </div>
      </CardSection>
    </Card>
  );
}
