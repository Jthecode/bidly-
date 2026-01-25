// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — UI Card — Devnet-0                                             ┃
   ┃ File   : src/components/ui/Card.tsx                                    ┃
   ┃ Role   : Grid-safe glass card wrapper (no forced full-row sizing)      ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃
   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ */

import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

/** Minimal class joiner (keeps this file standalone). */
function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Grid-safe Card (FIXED)
 * - Never forces sizing (no w-full / h-full / col-span-full).
 * - Predictable in CSS grid & flex:
 *   - min-w-0 prevents overflow blowouts
 *   - max-w-full prevents border/shadow pseudo-elements from widening the box
 *   - overflow-visible so pseudo-elements never clip (caller opts into clipping)
 * - Glass baseline: subtle border, blur, controlled depth.
 * - Accessible: supports focus-within ring for cards containing controls.
 *
 * IMPORTANT LAYOUT NOTE:
 * Some “cards stuck top-left / weird spacing / hover causes shifts” issues come
 * from transforms + pseudo-elements interacting with grid row sizing.
 * We keep transforms subtle and do NOT force grid auto-rows in this component.
 */
export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cx(
        // Layout safety
        "relative min-w-0 max-w-full",
        // Pseudo-elements are inside this stacking context
        "isolate",
        // Do NOT clip by default (call sites can add overflow-hidden)
        "overflow-visible",

        // Interaction baseline (transform only on hover; no permanent transforms)
        "transition-transform duration-200 will-change-transform",

        // Glass defaults (override-friendly)
        "rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur",

        // Controlled depth (avoid huge shadows that make cards feel “flat black”)
        "shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_14px_44px_rgba(0,0,0,0.38)]",

        // Micro highlight (extremely subtle)
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-2xl",
        "before:opacity-100 before:bg-[radial-gradient(120%_80%_at_18%_0%,rgba(255,255,255,0.07),transparent_58%)]",

        // Thin inner edge line to read “premium” against dark backdrops
        "after:pointer-events-none after:absolute after:inset-0 after:rounded-2xl",
        "after:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.05)] after:opacity-100",

        // Focus-within ring
        "focus-within:ring-1 focus-within:ring-white/14 focus-within:ring-offset-0",

        // Hover polish (subtle)
        "hover:-translate-y-0.5 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.05),0_18px_60px_rgba(0,0,0,0.42)]",

        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

/**
 * Optional helper: consistent padded section for card contents.
 */
export interface CardSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  className?: string;
}

export function CardSection({ children, className, ...props }: CardSectionProps) {
  return (
    <div className={cx("min-w-0 p-4 sm:p-5", className)} {...props}>
      {children}
    </div>
  );
}
