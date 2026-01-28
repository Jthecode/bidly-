// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Reveal — Devnet-0                                              ┃
   ┃ File   : src/components/motion/Reveal.tsx                              ┃
   ┃ Role   : VybzzMeet-style reveal on view (blur + lift, perf-safe)       ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

"use client";

import * as React from "react";
import { m, useReducedMotion } from "framer-motion";

export type RevealProps = {
  children: React.ReactNode;

  /**
   * Visual tuning
   */
  y?: number; // px
  blur?: number; // px
  duration?: number; // seconds
  delay?: number; // seconds

  /**
   * Triggering
   */
  once?: boolean;
  amount?: number; // 0..1, how much of element needs to be in view

  /**
   * Styling
   */
  as?: React.ElementType;
  className?: string;

  /**
   * Disable reveal (keeps layout stable).
   */
  disabled?: boolean;

  /**
   * If true, uses opacity-only reveal (no blur) to reduce GPU cost.
   * Useful for very large lists/grids.
   */
  lite?: boolean;

  /**
   * Custom easing curve (Framer Motion format).
   * Defaults to Bidly premium ease.
   */
  ease?: [number, number, number, number];

  /**
   * Root margin for intersection observer.
   * Example: "0px 0px -10% 0px"
   */
  margin?: string;
};

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

function clamp(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

/**
 * Reveal
 * - VybzzMeet-style enter on scroll: soft blur + lift + fade
 * - Respects prefers-reduced-motion (auto disables)
 * - "lite" mode for large grids to avoid heavy blur filters
 * - Safe defaults for App Router + dynamic lists
 */
export default function Reveal({
  children,
  y = 10,
  blur = 10,
  duration = 0.42,
  delay = 0,
  once = true,
  amount = 0.25,
  as,
  className,
  disabled = false,
  lite = false,
  ease = [0.22, 1, 0.36, 1],
  margin = "0px 0px -8% 0px",
}: RevealProps) {
  const reduced = useReducedMotion();
  const off = disabled || Boolean(reduced);

  // If `as` is provided, render that element type via framer-motion's `m()`.
  // Otherwise default to m.div.
  const Comp = as ? (m(as) as any) : m.div;

  const yy = clamp(y, -120, 120);
  const bb = clamp(blur, 0, 24);
  const d = clamp(duration, 0.01, 2.5);
  const dl = clamp(delay, 0, 3);
  const a = clamp(amount, 0, 1);

  const initial = off
    ? undefined
    : lite
      ? { opacity: 0, y: yy }
      : { opacity: 0, y: yy, filter: `blur(${bb}px)` };

  const animate = off
    ? undefined
    : lite
      ? { opacity: 1, y: 0 }
      : { opacity: 1, y: 0, filter: "blur(0px)" };

  return (
    <Comp
      className={cx("min-w-0", className)}
      initial={initial}
      whileInView={animate}
      viewport={off ? undefined : { once, amount: a, margin }}
      transition={
        off
          ? undefined
          : {
              duration: d,
              delay: dl,
              ease,
            }
      }
    >
      {children}
    </Comp>
  );
}
