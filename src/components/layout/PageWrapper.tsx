/* ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   ┃ Bidly — Page Wrapper Component — Devnet-0                               ┃
   ┃ File   : src/components/layout/PageWrapper.tsx                          ┃
   ┃ Role   : Grid-safe shell with optional sidebar + main content           ┃
   ┃ Status : Devnet-0 Ready                                                 ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)        ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                         ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃
   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ */

import * as React from "react";

interface PageWrapperProps {
  children: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
}

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

/**
 * PageWrapper
 * - Uses CSS Grid (more predictable than flex for sidebar shells)
 * - Prevents grid children from blowing out width (min-w-0 on grid items)
 * - Stabilizes sticky sidebar behavior across viewport sizes
 * - Ensures main content can safely render internal grids (3-up cards, etc.)
 */
export default function PageWrapper({
  children,
  sidebar,
  className,
}: PageWrapperProps) {
  const hasSidebar = Boolean(sidebar);

  return (
    <div
      className={cx(
        // Stable shell: 1-col mobile, 2-col desktop
        "grid w-full gap-6",
        hasSidebar ? "grid-cols-1 md:grid-cols-[280px_minmax(0,1fr)]" : "grid-cols-1",
        className
      )}
    >
      {hasSidebar ? (
        <aside
          className={cx(
            // Keep sidebar from forcing main width; hidden on mobile
            "hidden md:block min-w-0",
            // Sidebar should not stretch the row height
            "self-start"
          )}
        >
          <div
            className={cx(
              // Sticky within page chrome; adjust if your header height differs
              "sticky top-20",
              // Prevent sticky child from overflowing horizontally
              "min-w-0",
              // Optional: keep sidebar from exceeding viewport height
              "max-h-[calc(100vh-5rem)] overflow-auto"
            )}
          >
            {sidebar}
          </div>
        </aside>
      ) : null}

      <main
        className={cx(
          // CRITICAL: allows inner grids (cards) to shrink properly inside shell
          "min-w-0",
          // Prevent accidental stretching when children use height utilities
          "self-start",
          // Make sure main actually takes remaining column space
          "w-full"
        )}
      >
        {children}
      </main>
    </div>
  );
}
