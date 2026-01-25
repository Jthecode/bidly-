/* ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   ┃ Bidly — Live Grid — Devnet-0                                           ┃
   ┃ File   : src/components/marketplace/LiveGrid.tsx                       ┃
   ┃ Role   : 3-up live tiles layout (clean spacing, not clustered)         ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃
   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ */

import * as React from "react";

interface LiveGridProps {
  children: React.ReactNode;
  className?: string;

  /**
   * Optional: cap the grid width for a premium “3-up” feel.
   * - "xl"   -> 1280px
   * - "2xl"  -> 1440px (default)
   * - "3xl"  -> 1600px
   * - "full" -> no cap
   */
  max?: "xl" | "2xl" | "3xl" | "full";

  /**
   * Optional: minimum card width in pixels for auto-fit minmax().
   * Default: 360 (clean 3-up at 1440 width)
   */
  minTilePx?: number;

  /**
   * Optional spacing preset.
   */
  gap?: "tight" | "md" | "wide";

  /**
   * Optional: enable consistent “3-up” behavior on desktop by biasing
   * the min tile width upward on large screens.
   *
   * This is useful when you want:
   * - mobile: 1 column
   * - md:     2 columns
   * - lg+:    3 columns (stable)
   */
  preferThreeUp?: boolean;
}

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

function clampMinTilePx(n: number | undefined) {
  const v = typeof n === "number" && Number.isFinite(n) ? Math.round(n) : 360;
  // prevent unusably small tiles; keep layout stable
  return Math.max(260, Math.min(560, v));
}

/**
 * LiveGrid (grid-safe)
 * - Uses CSS grid with responsive min widths (stable 1→2→3)
 * - Avoids “clustered” feel via premium gaps + width cap
 * - min-w-0 safeguards so children can truncate inside
 * - Uses explicit breakpoints to eliminate odd auto-fit breaks
 */
export default function LiveGrid({
  children,
  className,
  max = "2xl",
  minTilePx,
  gap = "wide",
  preferThreeUp = true,
}: LiveGridProps) {
  const cap =
    max === "full"
      ? "max-w-none"
      : max === "xl"
        ? "max-w-[1280px]"
        : max === "3xl"
          ? "max-w-[1600px]"
          : "max-w-[1440px]";

  const g =
    gap === "tight"
      ? "gap-x-4 gap-y-5 sm:gap-x-5 sm:gap-y-6"
      : gap === "md"
        ? "gap-x-6 gap-y-7 sm:gap-x-7 sm:gap-y-8"
        : "gap-x-7 gap-y-9 sm:gap-x-8 sm:gap-y-10";

  const minPx = clampMinTilePx(minTilePx);

  /**
   * Why not pure auto-fit everywhere?
   * Auto-fit is great, but it can create “weird” column counts on wide screens
   * depending on padding + scrollbars + container caps.
   *
   * Here we:
   * - keep auto-fit for smaller screens
   * - force 3 columns on lg+ for a consistent marketplace feel
   */
  const responsiveCols = preferThreeUp
    ? cx(
        // Mobile: 1 column (natural)
        `[grid-template-columns:repeat(auto-fit,minmax(${Math.min(minPx, 360)}px,1fr))]`,
        // md: usually 2 columns
        `md:[grid-template-columns:repeat(auto-fit,minmax(${Math.min(
          Math.max(minPx, 360),
          420
        )}px,1fr))]`,
        // lg+: bias toward 3-up; consistent premium look
        `lg:[grid-template-columns:repeat(3,minmax(0,1fr))]`
      )
    : `[grid-template-columns:repeat(auto-fit,minmax(${minPx}px,1fr))]`;

  return (
    <div
      className={cx(
        // Width cap keeps “3-up” composition premium
        "mx-auto w-full",
        cap,

        // True grid
        "grid",

        // Let cards size naturally; do not force equal heights
        "items-start auto-rows-max",

        // Grid safety for nested content
        "min-w-0 [&>*]:min-w-0",

        // Columns behavior
        responsiveCols,

        // Premium spacing
        g,

        className
      )}
    >
      {children}
    </div>
  );
}
