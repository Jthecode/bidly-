// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — UI Skeleton — Devnet-0                                        ┃
   ┃ File   : src/components/ui/Skeleton.tsx                               ┃
   ┃ Role   : Reusable loading skeleton blocks (grid-safe, SSR-safe)       ┃
   ┃ Status : Devnet-0 Ready                                               ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)      ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                       ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import * as React from "react";

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * If true, adds the “cyber glow” ring shadow. Default: true.
   */
  glow?: boolean;

  /**
   * Corner radius preset. Default: "2xl".
   */
  radius?: "lg" | "xl" | "2xl" | "3xl";
};

/**
 * Skeleton
 * - Works everywhere (server or client)
 * - Grid-safe (no fixed widths unless you pass them)
 * - Cyber-luxury style: subtle glass + ring + pulse
 */
export default function Skeleton({
  className,
  glow = true,
  radius = "2xl",
  ...props
}: SkeletonProps) {
  const r =
    radius === "lg"
      ? "rounded-lg"
      : radius === "xl"
      ? "rounded-xl"
      : radius === "3xl"
      ? "rounded-3xl"
      : "rounded-2xl";

  return (
    <div
      className={cx(
        "animate-pulse",
        r,
        "border border-white/10 bg-white/[0.04]",
        glow
          ? "shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_18px_60px_rgba(0,0,0,0.35)]"
          : undefined,
        className
      )}
      aria-hidden="true"
      {...props}
    />
  );
}

/* ======================================================
   Convenience shapes (optional)
   ====================================================== */

export function SkeletonText({
  lines = 3,
  className,
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={cx("space-y-2", className)}>
      {Array.from({ length: Math.max(1, lines) }).map((_, i) => (
        <Skeleton
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          className={cx(
            "h-3",
            i === lines - 1 ? "w-2/3" : "w-full",
            "rounded-xl"
          )}
          glow={false}
        />
      ))}
    </div>
  );
}

export function SkeletonAvatar({ size = 40 }: { size?: number }) {
  return (
    <Skeleton
      className="rounded-full"
      style={{ width: size, height: size }}
      glow={false}
    />
  );
}
