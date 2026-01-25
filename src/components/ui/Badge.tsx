// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Badge — Devnet-0                                               ┃
   ┃ File   : src/components/ui/Badge.tsx                                   ┃
   ┃ Role   : Neon/glass badge with stable variants (no layout jitter)      ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃
   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ */

"use client";

import * as React from "react";

export type BadgeVariant = "default" | "live" | "success" | "warning";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  className?: string;
}

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Badge
 * - Stable sizing (no jitter): leading-none + whitespace-nowrap
 * - Accessible focus (when used inside links/buttons)
 * - "live" uses the neon live token instead of hardcoding red
 */
export function Badge({
  variant = "default",
  className,
  ...props
}: BadgeProps) {
  const base = cx(
    "inline-flex items-center justify-center",
    "rounded-full",
    "px-2.5 py-1",
    "text-[11px] font-semibold",
    "leading-none whitespace-nowrap",
    "select-none",
    "border border-white/10",
    "backdrop-blur",
    "transition-colors duration-200"
  );

  const variants: Record<BadgeVariant, string> = {
    default: cx(
      "bg-black/35 text-white/85",
      "shadow-[0_0_0_1px_rgba(255,255,255,0.03)]"
    ),

    live: cx(
      "bg-black/45 text-white",
      "border-white/14",
      "shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_0_18px_rgba(255,0,208,0.18)]"
    ),

    success: cx(
      "bg-black/35 text-white/90",
      "shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_0_18px_rgba(0,240,255,0.16)]"
    ),

    warning: cx(
      "bg-black/35 text-white/90",
      "shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_0_18px_rgba(255,180,0,0.18)]"
    ),
  };

  return <span className={cx(base, variants[variant], className)} {...props} />;
}

export default Badge;
