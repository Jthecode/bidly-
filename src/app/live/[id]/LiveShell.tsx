/* ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   ┃ Bidly — Live Shell — Devnet-0                                          ┃
   ┃ File   : src/app/live/[id]/LiveShell.tsx                               ┃
   ┃ Role   : Elite 3-column live layout shell (stage + sidebar)            ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃
   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ */

import * as React from "react";

export interface LiveShellProps {
  children: React.ReactNode;
  className?: string;

  /**
   * Optional max width cap for a premium composition.
   * Default keeps a strong “Whatnot-style” desktop balance.
   */
  max?: "xl" | "2xl" | "3xl" | "full";
}

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

/**
 * LiveShell
 * - Page-level layout wrapper for /live/[id]
 * - Grid guarantees:
 *   - mobile: stacked
 *   - lg+:    stage area left + sidebar right
 * - Includes “breathing room” spacing to prevent clustered UI.
 */
export default function LiveShell({
  children,
  className,
  max = "3xl",
}: LiveShellProps) {
  const cap =
    max === "full"
      ? "max-w-none"
      : max === "xl"
        ? "max-w-[1280px]"
        : max === "2xl"
          ? "max-w-[1440px]"
          : "max-w-[1600px]";

  return (
    <div className={cx("mx-auto w-full px-4 sm:px-6 lg:px-8", cap, className)}>
      <div
        className={cx(
          // Grid scaffold
          "grid",
          // Mobile stack
          "grid-cols-1",
          // Desktop: stage + sidebar
          "lg:grid-cols-[minmax(0,1fr)_420px]",
          // Premium spacing
          "gap-6 lg:gap-8",
          // Prevent children from blowing out columns
          "min-w-0 [&>*]:min-w-0",
          // Alignment
          "items-start"
        )}
      >
        {children}
      </div>
    </div>
  );
}
