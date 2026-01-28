// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Performance Guard — Devnet-0                                   ┃
   ┃ File   : src/components/perf/PerformanceGuard.tsx                      ┃
   ┃ Role   : Harden Performance API calls (avoid negative timestamp crash)  ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

"use client";

import * as React from "react";

type MeasureOptions = {
  start?: string | number;
  end?: string | number;
  duration?: number;
};

function isObj(v: unknown): v is Record<string, unknown> {
  return typeof v === "object" && v !== null;
}

function clampNonNegative(n: number) {
  return Number.isFinite(n) ? Math.max(0, n) : 0;
}

/**
 * PerformanceGuard
 * - Wraps performance.measure to prevent hard crashes from invalid timing data
 * - Useful when 3rd-party code uses measure() with mixed clocks (Date.now vs performance.now)
 * - Runs once on client
 */
export default function PerformanceGuard() {
  React.useEffect(() => {
    const p = typeof window !== "undefined" ? window.performance : undefined;
    if (!p || typeof p.measure !== "function") return;

    // Avoid double-wrapping (HMR/StrictMode)
    const anyPerf = p as any;
    if (anyPerf.__bidlyMeasureWrapped) return;
    anyPerf.__bidlyMeasureWrapped = true;

    const original = p.measure.bind(p);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (p as any).measure = (name: string, startOrOptions?: any, endMark?: any) => {
      try {
        // Path A: measure(name, startMark, endMark)
        if (typeof startOrOptions === "string" || typeof endMark === "string") {
          return original(name, startOrOptions, endMark);
        }

        // Path B: measure(name, { start, end, duration })
        if (isObj(startOrOptions)) {
          const opt = startOrOptions as MeasureOptions;

          const patched: MeasureOptions = { ...opt };

          if (typeof patched.start === "number") patched.start = clampNonNegative(patched.start);
          if (typeof patched.end === "number") patched.end = clampNonNegative(patched.end);
          if (typeof patched.duration === "number") patched.duration = clampNonNegative(patched.duration);

          return original(name, patched as any);
        }

        // Path C: measure(name) or unknown overload
        return original(name);
      } catch {
        // If a library accidentally computes negative timestamps, ignore instead of crashing UI.
        return;
      }
    };
  }, []);

  return null;
}
