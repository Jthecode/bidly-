// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Backdrop — Devnet-0                                            ┃
   ┃ File   : src/components/layout/Backdrop.tsx                            ┃
   ┃ Role   : Global cyber-luxury background layers (stars/grid/glows/orbs) ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃
   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ */

import * as React from "react";

type BackdropProps = {
  className?: string;
  fixed?: boolean;
  reduced?: boolean;
  frameGlow?: boolean;
};

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

export default function Backdrop({
  className,
  fixed = true,
  reduced = false,
  frameGlow = true,
}: BackdropProps) {
  const rootPos = fixed ? "fixed" : "absolute";

  return (
    <div
      aria-hidden="true"
      className={cx(
        rootPos,
        "inset-0 overflow-hidden pointer-events-none",
        "-z-10",
        "isolate",
        className
      )}
      data-reduced={reduced ? "true" : "false"}
    >
      {/* CSS keyframes (component-local, works in App Router) */}
      <style>{`
        @keyframes bidlyGlowDrift {
          0%   { transform: translate3d(-2%, -1%, 0) scale(1); filter: saturate(1.05); opacity: .70; }
          50%  { transform: translate3d( 2%,  1%, 0) scale(1.02); filter: saturate(1.15); opacity: .82; }
          100% { transform: translate3d(-2%, -1%, 0) scale(1); filter: saturate(1.05); opacity: .70; }
        }

        @keyframes bidlyGridPan {
          0%   { background-position: 50% 50%; opacity: .14; }
          50%  { background-position: 54% 46%; opacity: .18; }
          100% { background-position: 50% 50%; opacity: .14; }
        }

        @keyframes bidlyOrbFloatA {
          0%   { transform: translate3d(0, 0, 0) scale(1); opacity: .42; }
          50%  { transform: translate3d(14px, -18px, 0) scale(1.03); opacity: .50; }
          100% { transform: translate3d(0, 0, 0) scale(1); opacity: .42; }
        }

        @keyframes bidlyOrbFloatB {
          0%   { transform: translate3d(0, 0, 0) scale(1); opacity: .38; }
          50%  { transform: translate3d(-16px, 12px, 0) scale(1.04); opacity: .46; }
          100% { transform: translate3d(0, 0, 0) scale(1); opacity: .38; }
        }

        @keyframes bidlyFramePulse {
          0%   { opacity: .62; transform: translateZ(0); }
          50%  { opacity: .78; transform: translateZ(0); }
          100% { opacity: .62; transform: translateZ(0); }
        }

        /* Respect OS reduced motion automatically */
        @media (prefers-reduced-motion: reduce) {
          .bidly-anim { animation: none !important; }
        }

        /* Respect prop reduced=true */
        [data-reduced="true"] .bidly-anim { animation: none !important; }
      `}</style>

      {/* Base */}
      <div className="absolute inset-0 bg-[#07070c]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/95" />

      {/* Animated color wash (VybzzMeet-ish teal/blue glow) */}
      <div
        className={cx("absolute inset-0 bidly-anim", "will-change-transform")}
        style={{
          animation: reduced ? "none" : "bidlyGlowDrift 10.5s ease-in-out infinite",
          background:
            "radial-gradient(1200px 700px at 20% -10%, rgba(0,240,255,0.20), transparent 60%)," +
            "radial-gradient(1000px 600px at 85% 10%, rgba(47,107,255,0.18), transparent 58%)," +
            "radial-gradient(1100px 720px at 55% 120%, rgba(162,0,255,0.14), transparent 60%)",
        }}
      />

      {/* Frame glow (animated pulse) */}
      {frameGlow && (
        <>
          <div
            className={cx("absolute bidly-anim", "will-change-opacity")}
            style={{
              inset: 18,
              borderRadius: 18,
              animation: reduced ? "none" : "bidlyFramePulse 6.5s ease-in-out infinite",
              boxShadow:
                "0 0 0 2px rgba(120,220,255,0.10), " +
                "0 0 60px rgba(0,240,255,0.16), " +
                "0 0 130px rgba(47,107,255,0.18)",
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                "radial-gradient(900px 650px at 25% 10%, rgba(0,0,0,0.42), transparent 60%)," +
                "radial-gradient(900px 650px at 85% 10%, rgba(0,0,0,0.38), transparent 62%)," +
                "radial-gradient(900px 900px at 50% 120%, rgba(0,0,0,0.62), transparent 55%)",
              opacity: 0.92,
            }}
          />
        </>
      )}

      {/* Stars (static texture; keeps vibe) */}
      {!reduced && (
        <div
          className="absolute inset-0 opacity-35"
          style={{
            backgroundImage: 'url("/placeholder/backgrounds/stars.png")',
            backgroundRepeat: "repeat",
            backgroundSize: "auto",
          }}
        />
      )}

      {/* Grid (slow pan) */}
      <div
        className={cx("absolute inset-0 bidly-anim", "will-change-[background-position]")}
        style={{
          backgroundImage: 'url("/placeholder/backgrounds/grid.png")',
          backgroundRepeat: "repeat",
          backgroundSize: "720px 720px",
          backgroundPosition: "center",
          animation: reduced ? "none" : "bidlyGridPan 14s ease-in-out infinite",
        }}
      />

      {/* Glows */}
      <div
        className={cx(
          "absolute left-0 right-0 top-0",
          reduced ? "h-[320px] opacity-45" : "h-[420px] opacity-55"
        )}
        style={{
          backgroundImage: 'url("/placeholder/backgrounds/glow-top.png")',
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "top center",
        }}
      />
      <div
        className={cx(
          "absolute left-0 right-0 bottom-0",
          reduced ? "h-[360px] opacity-35" : "h-[460px] opacity-45"
        )}
        style={{
          backgroundImage: 'url("/placeholder/backgrounds/glow-bottom.png")',
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "bottom center",
        }}
      />

      {/* Orbs (float) */}
      {!reduced && (
        <>
          <div
            className={cx(
              "absolute -left-32 top-24 h-[520px] w-[520px]",
              "bidly-anim will-change-transform"
            )}
            style={{
              backgroundImage: 'url("/placeholder/backgrounds/blur-orb-1.png")',
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              backgroundPosition: "center",
              animation: "bidlyOrbFloatA 9.5s ease-in-out infinite",
            }}
          />
          <div
            className={cx(
              "absolute -right-40 bottom-10 h-[560px] w-[560px]",
              "bidly-anim will-change-transform"
            )}
            style={{
              backgroundImage: 'url("/placeholder/backgrounds/blur-orb-2.png")',
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              backgroundPosition: "center",
              animation: "bidlyOrbFloatB 11.5s ease-in-out infinite",
            }}
          />
        </>
      )}

      {/* Soft scanlines */}
      {!reduced && (
        <div
          className="absolute inset-0 opacity-[0.07] mix-blend-overlay"
          style={{
            backgroundImage: 'url("/placeholder/overlays/scanlines.png")',
            backgroundRepeat: "repeat",
            backgroundSize: "900px 900px",
          }}
        />
      )}

      {/* Film grain */}
      <div
        className={cx(
          "absolute inset-0 mix-blend-overlay",
          reduced ? "opacity-[0.10]" : "opacity-[0.14]"
        )}
        style={{
          backgroundImage: 'url("/placeholder/overlays/noise.png")',
          backgroundRepeat: "repeat",
          backgroundSize: "220px 220px",
        }}
      />
    </div>
  );
}
