/* ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   ┃ Bidly — Backdrop — Devnet-0                                            ┃
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
  /**
   * If true, uses `fixed` so the backdrop stays anchored to the viewport even
   * when parent containers are narrow/positioned.
   *
   * Recommended for app-wide backgrounds.
   */
  fixed?: boolean;
  /**
   * If true, reduces GPU-heavy layers (useful for low-power devices).
   */
  reduced?: boolean;
};

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

/**
 * Backdrop
 * - Anchors to viewport (optional fixed) so it never “hugs the left”
 * - Uses layered PNGs from /public/placeholder
 * - Adds safe z-index + isolation so overlays blend correctly
 * - Zero pointer events; does not interfere with UI
 */
export default function Backdrop({ className, fixed = true, reduced = false }: BackdropProps) {
  const rootPos = fixed ? "fixed" : "absolute";

  return (
    <div
      aria-hidden="true"
      className={cx(
        rootPos,
        "inset-0 overflow-hidden pointer-events-none",
        // Keep it behind everything, regardless of parent stacking contexts.
        "-z-10",
        // Makes blend modes predictable (prevents weird compositing with parent).
        "isolate",
        className
      )}
    >
      {/* Base vignette + subtle color wash */}
      <div className="absolute inset-0 bg-[#07070c]" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/55 to-black/95" />
      <div className="absolute inset-0 opacity-70 [background:radial-gradient(1200px_700px_at_20%_-10%,rgba(0,240,255,0.10),transparent_60%),radial-gradient(900px_520px_at_85%_10%,rgba(255,0,208,0.10),transparent_55%),radial-gradient(1000px_640px_at_50%_110%,rgba(162,0,255,0.10),transparent_60%)]" />

      {/* Stars */}
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

      {/* Grid */}
      <div
        className={cx("absolute inset-0", reduced ? "opacity-[0.08]" : "opacity-15")}
        style={{
          backgroundImage: 'url("/placeholder/backgrounds/grid.png")',
          backgroundRepeat: "repeat",
          backgroundSize: "720px 720px",
          backgroundPosition: "center",
        }}
      />

      {/* Glows */}
      <div
        className={cx("absolute left-0 right-0 top-0", reduced ? "h-[320px] opacity-45" : "h-[420px] opacity-55")}
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

      {/* Orbs */}
      {!reduced && (
        <>
          <div
            className="absolute -left-32 top-24 h-[520px] w-[520px] opacity-45 blur-[0.2px]"
            style={{
              backgroundImage: 'url("/placeholder/backgrounds/blur-orb-1.png")',
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              backgroundPosition: "center",
            }}
          />
          <div
            className="absolute -right-40 bottom-10 h-[560px] w-[560px] opacity-40 blur-[0.2px]"
            style={{
              backgroundImage: 'url("/placeholder/backgrounds/blur-orb-2.png")',
              backgroundRepeat: "no-repeat",
              backgroundSize: "contain",
              backgroundPosition: "center",
            }}
          />
        </>
      )}

      {/* Soft scanlines (very subtle) */}
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

      {/* Soft film grain */}
      <div
        className={cx("absolute inset-0 mix-blend-overlay", reduced ? "opacity-[0.10]" : "opacity-[0.14]")}
        style={{
          backgroundImage: 'url("/placeholder/overlays/noise.png")',
          backgroundRepeat: "repeat",
          backgroundSize: "220px 220px",
        }}
      />
    </div>
  );
}
