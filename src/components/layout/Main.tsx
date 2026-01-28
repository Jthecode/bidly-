// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Main Component — Devnet-0                                      ┃
   ┃ File   : src/components/layout/Main.tsx                                ┃
   ┃ Role   : Main content wrapper (min-w-0, padding, safe for grids)        ┃
   ┃ Status : Devnet-0 Ready                                                 ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)        ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                          ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃
   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ */

import * as React from "react";

export interface MainProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;

  /**
   * Optional vertical rhythm preset.
   * - "none": no spacing
   * - "sm":  compact
   * - "md":  default (recommended)
   * - "lg":  airy / premium
   */
  rhythm?: "none" | "sm" | "md" | "lg";

  /**
   * Optional padding preset.
   * - "none": no padding
   * - "sm":  small
   * - "md":  default (recommended)
   * - "lg":  larger
   */
  pad?: "none" | "sm" | "md" | "lg";

  /**
   * Optional: adds a subtle inner glass lane behind content
   * (Use when Main is mounted in a raw page without the RootLayout lane.)
   */
  glassLane?: boolean;
}

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Main (grid-safe)
 * - Forces min-w-0 so inner card grids can shrink properly
 * - Provides consistent padding + vertical rhythm
 * - Avoids accidental stretching behaviors
 */
export default function Main({
  children,
  className,
  rhythm = "md",
  pad = "none",
  glassLane = false,
  ...props
}: MainProps) {
  const spacing =
    rhythm === "lg"
      ? "space-y-8"
      : rhythm === "sm"
        ? "space-y-4"
        : rhythm === "none"
          ? ""
          : "space-y-6";

  const padding =
    pad === "lg"
      ? "py-10"
      : pad === "sm"
        ? "py-4"
        : pad === "none"
          ? ""
          : "py-6";

  return (
    <main
      className={cx(
        // CRITICAL: prevents overflow + weird wrapping inside parent grids/flex
        "w-full min-w-0",
        // Keep content aligned naturally (no stretch)
        "self-start",
        padding,
        spacing,
        glassLane &&
          [
            "relative",
            "rounded-[28px]",
            "border border-white/10",
            "bg-black/10",
            "backdrop-blur-[10px]",
            "shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_30px_120px_rgba(0,0,0,0.45)]",
            "p-3 sm:p-5 lg:p-6",
          ].join(" "),
        className
      )}
      {...props}
    >
      {children}
    </main>
  );
}
