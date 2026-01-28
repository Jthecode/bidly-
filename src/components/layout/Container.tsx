// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Container Component — Devnet-0                                  ┃
   ┃ File   : src/components/layout/Container.tsx                            ┃
   ┃ Role   : Max-width wrapper + responsive padding (grid-safe)             ┃
   ┃ Status : Devnet-0 Ready                                                 ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)        ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                          ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import * as React from "react";

export interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;

  /**
   * Optional max width preset.
   * - "xl"   -> max-w-6xl
   * - "2xl"  -> max-w-7xl (default)
   * - "3xl"  -> max-w-[1440px]
   * - "4xl"  -> max-w-[1600px] (ultra-wide layouts)
   * - "frame"-> max-w-[1920px] (matches RootLayout “frame”)
   * - "full" -> no max width (still padded unless noGutters)
   */
  size?: "xl" | "2xl" | "3xl" | "4xl" | "frame" | "full";

  /**
   * Optional: remove horizontal padding.
   * Use sparingly (e.g., full-bleed sections that manage their own gutters).
   */
  noGutters?: boolean;

  /**
   * Optional: vertical padding preset.
   * Useful for consistent section spacing without repeating classes everywhere.
   */
  y?: "none" | "sm" | "md" | "lg" | "xl";
}

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Container (grid-safe)
 * - Centers content with a sane max width
 * - Provides consistent responsive gutters
 * - Guarantees min-w-0 so children can truncate inside CSS grid/flex
 * - Does NOT impose height/row/column behavior
 */
export default function Container({
  children,
  className,
  size = "2xl",
  noGutters = false,
  y = "none",
  ...props
}: ContainerProps) {
  const max =
    size === "full"
      ? "max-w-none"
      : size === "xl"
        ? "max-w-6xl"
        : size === "3xl"
          ? "max-w-[1440px]"
          : size === "4xl"
            ? "max-w-[1600px]"
            : size === "frame"
              ? "max-w-[1920px]"
              : "max-w-7xl";

  const gutters = noGutters ? "" : "px-4 sm:px-6 lg:px-8";

  const yPad =
    y === "none"
      ? ""
      : y === "sm"
        ? "py-6"
        : y === "md"
          ? "py-10"
          : y === "lg"
            ? "py-14"
            : "py-18";

  return (
    <div
      className={cx(
        // CRITICAL for grid/flex children:
        "mx-auto w-full min-w-0",
        max,
        gutters,
        yPad,
        // Helps avoid “everything hugs the left” when parent is constrained
        "relative",
        // Improves text rendering slightly on some displays
        "antialiased",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
