// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Glow Cursor — Devnet-0                                         ┃
   ┃ File   : src/components/motion/GlowCursor.tsx                          ┃
   ┃ Role   : Premium cyber-luxury cursor glow (VybzzMeet-style)            ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

"use client";

import * as React from "react";

export type GlowCursorProps = {
  /**
   * Enable/disable globally. Keep this off on very low-end devices if needed.
   */
  enabled?: boolean;

  /**
   * How strong the glow is (0..1). Default 0.9
   */
  intensity?: number;

  /**
   * Size in px (diameter). Default 520
   */
  size?: number;

  /**
   * Extra className for the overlay.
   */
  className?: string;

  /**
   * Optional: z-index for the overlay (default 5).
   * Keep this under modals.
   */
  zIndex?: number;
};

function clamp(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  return Math.max(min, Math.min(max, n));
}

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

/**
 * GlowCursor
 * - Pure CSS overlay (no framer-motion dependency)
 * - Uses requestAnimationFrame to avoid over-updating state
 * - Pointer-events: none (never blocks clicks)
 * - Hidden on touch devices by default
 */
export default function GlowCursor({
  enabled = true,
  intensity = 0.9,
  size = 520,
  className,
  zIndex = 5,
}: GlowCursorProps) {
  const ref = React.useRef<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (!enabled) return;

    // Avoid on touch devices (coarse pointers).
    if (typeof window !== "undefined") {
      const coarse = window.matchMedia?.("(pointer: coarse)")?.matches;
      if (coarse) return;
    }

    const el = ref.current;
    if (!el) return;

    const s = clamp(size, 220, 900);
    const a = clamp(intensity, 0, 1);

    el.style.setProperty("--gc-size", `${s}px`);
    el.style.setProperty("--gc-alpha", `${a}`);

    let raf = 0;
    let targetX = window.innerWidth * 0.5;
    let targetY = window.innerHeight * 0.4;
    let currentX = targetX;
    let currentY = targetY;

    // Slightly tighter than 0.18 feels more “premium”
    const speed = 0.16; // smoothing (0..1)

    const onMove = (e: PointerEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;

      if (!raf) raf = window.requestAnimationFrame(tick);
    };

    const tick = () => {
      raf = 0;

      // Smooth follow
      currentX = currentX + (targetX - currentX) * speed;
      currentY = currentY + (targetY - currentY) * speed;

      el.style.setProperty("--gc-x", `${currentX}px`);
      el.style.setProperty("--gc-y", `${currentY}px`);

      // Keep animating while the cursor is still catching up
      const dx = Math.abs(targetX - currentX);
      const dy = Math.abs(targetY - currentY);
      if (dx > 0.25 || dy > 0.25) {
        raf = window.requestAnimationFrame(tick);
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", onMove);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, [enabled, intensity, size]);

  if (!enabled) return null;

  return (
    <>
      {/* Scoped CSS so you don’t have to remember to paste it elsewhere */}
      <style>{`
        .bidly-glow-cursor{
          position:fixed;
          inset:0;
          pointer-events:none;
          mix-blend-mode:screen;
          opacity:0.9;
          transform: translateZ(0);
        }

        .bidly-glow-cursor::before{
          content:"";
          position:absolute;
          left:calc(var(--gc-x, 50vw) - (var(--gc-size, 520px) / 2));
          top:calc(var(--gc-y, 40vh) - (var(--gc-size, 520px) / 2));
          width:var(--gc-size, 520px);
          height:var(--gc-size, 520px);
          border-radius:9999px;
          background:
            radial-gradient(circle at 30% 30%,
              rgba(0,240,255, calc(var(--gc-alpha, .9) * .35)),
              rgba(162,0,255, calc(var(--gc-alpha, .9) * .22)) 45%,
              rgba(255,0,208, calc(var(--gc-alpha, .9) * .14)) 72%,
              rgba(0,0,0,0) 78%);
          filter: blur(22px);
          transform: translate3d(0,0,0);
        }

        @media (pointer: coarse){
          .bidly-glow-cursor{ display:none; }
        }

        @media (prefers-reduced-motion: reduce){
          .bidly-glow-cursor{ display:none; }
        }
      `}</style>

      <div
        ref={ref}
        className={cx("bidly-glow-cursor", className)}
        aria-hidden="true"
        style={{ zIndex }}
      />
    </>
  );
}
