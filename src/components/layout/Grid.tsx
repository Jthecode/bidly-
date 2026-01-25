/* ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   ┃ Bidly — Grid Component — Devnet-0                                      ┃
   ┃ File   : src/components/layout/Grid.tsx                                ┃
   ┃ Role   : Reusable, card-safe grid wrapper (no stretch, no blowout)     ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃
   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ */

import * as React from "react";

export interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;

  /**
   * Preset layouts.
   * - "cards" (default): 1 → 2 → 3 columns (desktop = 3-across)
   * - "tight": slightly smaller gaps for dense pages
   * - "wide": larger gaps for premium spacing
   */
  variant?: "cards" | "tight" | "wide";

  /**
   * Optional: enforce a specific desktop column count.
   * Keeps the Bidly standard (3) unless you override it.
   */
  desktopCols?: 2 | 3 | 4;

  /**
   * Optional: minimum card width for auto-fit mode.
   * If set, we use auto-fit minmax() so the grid adapts smoothly.
   * Example: minItemPx={260}
   */
  minItemPx?: number;
}

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Grid (card-safe)
 * - Aligns items to start (prevents card stretching)
 * - Protects against flex/grid blowouts (min-w-0 + child min-w-0)
 * - Default = 3-across on desktop (Bidly standard)
 */
export default function Grid({
  children,
  className,
  variant = "cards",
  desktopCols = 3,
  minItemPx,
  ...props
}: GridProps) {
  const gap =
    variant === "wide"
      ? "gap-6 sm:gap-7 lg:gap-8"
      : variant === "tight"
        ? "gap-3 sm:gap-4 lg:gap-5"
        : "gap-4 sm:gap-5 lg:gap-6";

  // If minItemPx is set, use auto-fit minmax() so the grid is ultra-stable
  // across odd widths (still aligned to "start").
  const autoFit =
    typeof minItemPx === "number" && Number.isFinite(minItemPx) && minItemPx >= 160;

  const colsClass = autoFit
    ? // Tailwind arbitrary value: repeat(auto-fit, minmax(Xpx, 1fr))
      // (This removes “awkward half columns” and keeps cards evenly sized.)
      `grid-cols-[repeat(auto-fit,minmax(${Math.round(minItemPx)}px,1fr))]`
    : // Fixed responsive columns (Bidly standard: desktop 3-across)
      cx(
        "grid-cols-1",
        "sm:grid-cols-2",
        desktopCols === 2
          ? "lg:grid-cols-2"
          : desktopCols === 4
            ? "lg:grid-cols-4"
            : "lg:grid-cols-3"
      );

  return (
    <div
      className={cx(
        // Core grid behavior
        "grid w-full",
        colsClass,
        gap,

        // CRITICAL: prevent internal blowouts/truncation bugs
        "min-w-0 [&>*]:min-w-0",

        // Prevent vertical stretching; let cards size naturally
        "items-start auto-rows-max",

        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
