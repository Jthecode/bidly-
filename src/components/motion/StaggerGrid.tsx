// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Stagger Grid — Devnet-0                                        ┃
   ┃ File   : src/components/motion/StaggerGrid.tsx                         ┃
   ┃ Role   : VybzzMeet-style grid reveal (stagger + soft blur)             ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

"use client";

import * as React from "react";
import { m, useReducedMotion } from "framer-motion";

export type StaggerGridProps = {
  children: React.ReactNode;

  /**
   * Motion tuning
   */
  stagger?: number; // seconds
  delayChildren?: number; // seconds
  y?: number; // px
  blur?: number; // px
  duration?: number; // seconds
  className?: string;

  /**
   * Triggering (optional)
   * If enabled, only animates once when this grid enters view.
   * Useful on pages with multiple sections.
   */
  inView?: boolean;
  once?: boolean;
  amount?: number; // 0..1
  margin?: string;

  /**
   * Performance
   * - lite: disable blur filters (best for large card grids)
   * - limit: only animate first N items (rest render normally)
   */
  lite?: boolean;
  limit?: number;

  /**
   * If true, disables the animation while keeping layout stable.
   */
  disabled?: boolean;
};

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

function clamp(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

const EASE_PREMIUM = [0.22, 1, 0.36, 1] as const;

export default function StaggerGrid({
  children,
  stagger = 0.055,
  delayChildren = 0.02,
  y = 10,
  blur = 10,
  duration = 0.38,
  className,
  inView = false,
  once = true,
  amount = 0.25,
  margin = "0px 0px -8% 0px",
  lite = false,
  limit,
  disabled = false,
}: StaggerGridProps) {
  const reduced = useReducedMotion();
  const off = disabled || Boolean(reduced);

  const yy = clamp(y, -120, 120);
  const bb = clamp(blur, 0, 24);
  const st = clamp(stagger, 0, 0.35);
  const dc = clamp(delayChildren, 0, 1.5);
  const dur = clamp(duration, 0.01, 2.5);
  const amt = clamp(amount, 0, 1);

  const childArray = React.Children.toArray(children);
  const max = typeof limit === "number" ? Math.max(0, limit) : undefined;

  const container = off
    ? {}
    : {
        hidden: {},
        show: {
          transition: {
            staggerChildren: st,
            delayChildren: dc,
          },
        },
      };

  const item = off
    ? {}
    : {
        hidden: lite
          ? { opacity: 0, y: yy }
          : { opacity: 0, y: yy, filter: `blur(${bb}px)` },
        show: lite
          ? { opacity: 1, y: 0, transition: { duration: dur, ease: EASE_PREMIUM } }
          : {
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
              transition: { duration: dur, ease: EASE_PREMIUM },
            },
      };

  return (
    <m.div
      className={cx("min-w-0", className)}
      variants={container as any}
      initial={off ? undefined : "hidden"}
      animate={off || inView ? undefined : "show"}
      whileInView={off || !inView ? undefined : "show"}
      viewport={off || !inView ? undefined : { once, amount: amt, margin }}
    >
      {childArray.map((child, idx) => {
        const shouldAnimate = max === undefined ? true : idx < max;

        // If we’re limiting animations, render the rest as plain wrappers.
        if (!shouldAnimate || off) {
          return (
            <div key={idx} className="min-w-0">
              {child}
            </div>
          );
        }

        return (
          <m.div key={idx} className="min-w-0" variants={item as any}>
            {child}
          </m.div>
        );
      })}
    </m.div>
  );
}
