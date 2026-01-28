// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Motion Provider — Devnet-0                                     ┃
   ┃ File   : src/components/motion/MotionProvider.tsx                      ┃
   ┃ Role   : Global motion config (VybzzMeet-style smooth + performant)    ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

"use client";

import * as React from "react";
import {
  LazyMotion,
  MotionConfig,
  domAnimation,
  useReducedMotion,
} from "framer-motion";

export type MotionProviderProps = {
  children: React.ReactNode;
  intensity?: "full" | "soft";
  durations?: {
    fast?: number;
    base?: number;
    slow?: number;
  };
};

function clamp(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

/**
 * MotionProvider
 * - Uses Framer Motion LazyMotion for smaller bundles
 * - Applies a consistent motion curve across the whole app
 * - Respects OS prefers-reduced-motion
 */
export default function MotionProvider({
  children,
  intensity = "full",
  durations,
}: MotionProviderProps) {
  const prefersReduced = useReducedMotion();

  const dFast = clamp(durations?.fast ?? 0.16, 0.08, 0.4);
  const dBase = clamp(durations?.base ?? 0.28, 0.12, 0.8);
  const dSlow = clamp(durations?.slow ?? 0.42, 0.2, 1.2);

  const reduced = Boolean(prefersReduced);
  const soft = intensity === "soft";

  const transition = reduced
    ? { duration: 0.01 }
    : {
        ease: [0.22, 1, 0.36, 1] as const,
        duration: soft ? dBase * 0.85 : dBase,
      };

  return (
    <LazyMotion features={domAnimation} strict>
      <MotionConfig reducedMotion="user" transition={transition}>
        <div
          style={
            {
              ["--bidly-motion-fast" as any]: `${
                reduced ? 0.01 : soft ? dFast * 0.85 : dFast
              }s`,
              ["--bidly-motion-base" as any]: `${
                reduced ? 0.01 : soft ? dBase * 0.85 : dBase
              }s`,
              ["--bidly-motion-slow" as any]: `${
                reduced ? 0.01 : soft ? dSlow * 0.85 : dSlow
              }s`,
              ["--bidly-ease-premium" as any]: reduced
                ? "linear"
                : "cubic-bezier(0.22, 1, 0.36, 1)",
            } as React.CSSProperties
          }
        >
          {children}
        </div>
      </MotionConfig>
    </LazyMotion>
  );
}

export function useBidlyReducedMotion() {
  const prefersReduced = useReducedMotion();
  return Boolean(prefersReduced);
}

/**
 * Convenience transitions (optional).
 * Import if you want consistent timings without guessing.
 */
const EASE_PREMIUM = [0.22, 1, 0.36, 1] as const;
const REDUCED = { duration: 0.01 } as const;

export const bidlyMotion = {
  reduced: REDUCED,
  fast: (reduced = false) =>
    reduced ? REDUCED : { duration: 0.16, ease: EASE_PREMIUM },
  base: (reduced = false) =>
    reduced ? REDUCED : { duration: 0.28, ease: EASE_PREMIUM },
  slow: (reduced = false) =>
    reduced ? REDUCED : { duration: 0.42, ease: EASE_PREMIUM },
} as const;
