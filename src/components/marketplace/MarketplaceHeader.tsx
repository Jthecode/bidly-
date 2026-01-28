"use client";

// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Marketplace Header — Devnet-0                                  ┃
   ┃ File   : src/components/marketplace/MarketplaceHeader.tsx              ┃
   ┃ Role   : Elite header + actions for seller-first Live Marketplace      ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export interface MarketplaceHeaderProps {
  title?: string;
  description?: string;
  className?: string;

  /**
   * Optional counts shown on the right (e.g., "12 live").
   * Keep it simple + seller-first.
   */
  liveCount?: number;

  /**
   * Primary/secondary CTAs.
   * Defaults are Bidly-appropriate (go live / explore).
   */
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
}

export default function MarketplaceHeader({
  title = "Live Sellers",
  description = "Seller-first tiles. Clean. Cyber-luxury.",
  className,
  liveCount,
  primaryHref = "/live/new",
  primaryLabel = "Go Live",
  secondaryHref = "/explore",
  secondaryLabel = "Explore",
}: MarketplaceHeaderProps) {
  return (
    <header
      className={cn(
        "relative w-full",
        "border-b border-white/10",
        "bg-white/[0.03] backdrop-blur-xl",
        className
      )}
    >
      {/* subtle glow rail */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent"
      />

      <div className="mx-auto w-full max-w-[1440px] px-5 py-8 md:px-8 md:py-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          {/* Left */}
          <div className="min-w-0">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] tracking-[0.18em] text-[var(--color-text-muted)] backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-[var(--color-live)] animate-pulse" />
                LIVE
              </span>
              {typeof liveCount === "number" && (
                <span className="text-xs text-[var(--color-text-muted)]">
                  {liveCount} live now
                </span>
              )}
            </div>

            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-[var(--color-text-primary)] md:text-4xl">
              {title}
            </h1>

            {description ? (
              <p className="mt-2 max-w-2xl text-sm text-[var(--color-text-muted)] md:text-base">
                {description}
              </p>
            ) : null}
          </div>

          {/* Right actions */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={primaryHref}
              className={cn(
                "inline-flex items-center justify-center rounded-2xl px-5 py-2.5",
                "text-sm font-semibold text-black",
                "bg-gradient-to-r from-[var(--color-cyber-cyan)] via-white to-[var(--color-cyber-pink)]",
                "shadow-[0_0_0_1px_rgba(255,255,255,0.12),0_18px_60px_rgba(0,240,255,0.08)]",
                "transition will-change-transform hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.18),0_24px_80px_rgba(255,0,208,0.12)]"
              )}
            >
              {primaryLabel}
            </Link>

            <Link
              href={secondaryHref}
              className={cn(
                "inline-flex items-center justify-center rounded-2xl px-5 py-2.5",
                "text-sm font-semibold text-[var(--color-text-primary)]",
                "border border-white/12 bg-white/5 backdrop-blur",
                "transition hover:bg-white/10"
              )}
            >
              {secondaryLabel}
            </Link>
          </div>
        </div>

        <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
      </div>
    </header>
  );
}
