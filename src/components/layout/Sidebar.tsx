/* ======================================================
   Bidly — Sidebar Component — Devnet-0
   ======================================================
   File: src/components/layout/Sidebar.tsx
   Role: Collapsible sidebar for marketplace filters / navigation
   Status: Devnet-0 Ready
   License: Quantara Open Source License v1 (Apache-2.0 compatible)
   SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0
   Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.
   ====================================================== */

import * as React from "react";

interface SidebarProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Width preset:
   * - "sm"  -> 280px (default)
   * - "md"  -> 320px
   * - "lg"  -> 360px
   */
  size?: "sm" | "md" | "lg";
  /**
   * Optional top offset for sticky behavior (if your header height differs).
   */
  stickyTopClassName?: string;
}

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Sidebar (grid-safe)
 * - Fixed width + shrink-0 so it doesn't squeeze the card grid unpredictably
 * - min-w-0 so inner content can truncate safely
 * - Optional sticky container + independent scrolling for long filter lists
 */
export default function Sidebar({
  children,
  className,
  size = "sm",
  stickyTopClassName = "top-20",
}: SidebarProps) {
  const w =
    size === "lg" ? "w-[360px]" : size === "md" ? "w-[320px]" : "w-[280px]";

  return (
    <aside
      className={cx(
        // Hidden on mobile; desktop sidebar
        "hidden md:block",
        // Fixed width; do not allow layout to shrink this column
        w,
        "shrink-0",
        // Visual shell
        "bg-[var(--color-bg-surface)] border-r border-[var(--color-border)]",
        // Ensure internal overflow behaves
        "min-w-0",
        className
      )}
    >
      <div
        className={cx(
          // Sticky sidebar content (plays well inside PageWrapper grid)
          "sticky",
          stickyTopClassName,
          // Constrain height + allow scrolling filters without affecting page
          "max-h-[calc(100vh-5rem)] overflow-y-auto",
          // Padding + polish
          "p-6",
          // Subtle safety for long tokens/labels
          "[overflow-wrap:anywhere]"
        )}
      >
        {children}
      </div>
    </aside>
  );
}
