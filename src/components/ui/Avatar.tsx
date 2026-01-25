// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — UI Avatar — Devnet-0                                           ┃
   ┃ File   : src/components/ui/Avatar.tsx                                  ┃
   ┃ Role   : Cyber-luxury avatar (server-safe, fixed sizing, fallback)     ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃
   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ */

import * as React from "react";

export type AvatarSize = "xs" | "sm" | "md" | "lg";

export interface AvatarProps extends React.HTMLAttributes<HTMLSpanElement> {
  /**
   * Optional image src. Rendered as CSS background (NOT <img>) to prevent:
   * - broken image icons
   * - global img { max-width:100% } quirks
   * - client-only onError handlers
   */
  src?: string;
  alt?: string;
  size?: AvatarSize;

  /** Live ring glow */
  isActive?: boolean;

  /** Verified indicator */
  verified?: boolean;

  /** Override initials (otherwise derived from alt) */
  initials?: string;

  /**
   * Optional: override fallback skeleton path.
   * Defaults to: /placeholder/skeleton/avatar-skeleton.png
   */
  fallbackSrc?: string;
}

/** Minimal class joiner (keeps this file standalone). */
function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

function initialsFrom(alt?: string) {
  const t = (alt ?? "").trim();
  if (!t) return "•";
  const parts = t.split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "";
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : "";
  const out = (a + b).toUpperCase();
  return out || "•";
}

function sizePx(size: AvatarSize) {
  if (size === "xs") return 24;
  if (size === "sm") return 32;
  if (size === "lg") return 56;
  return 40; // md
}

/** Defensive: avoid breaking CSS from quotes or control chars in URLs. */
function safeUrl(u?: string) {
  const s = (u ?? "").trim();
  if (!s) return "";
  // disallow control chars and quotes which can break CSS parsing
  if (/[\u0000-\u001F\u007F"'\\]/.test(s)) return "";
  return s;
}

/**
 * Avatar (server-safe)
 * - Fixed px sizing (never stretches in grid/flex)
 * - CSS background with layered fallback (no <img> / no JS)
 * - Optional live ring + verified pip
 *
 * Note: If the primary URL 404s, browsers typically keep the second layer visible.
 */
export function Avatar({
  src,
  alt = "Avatar",
  size = "md",
  isActive = false,
  verified = false,
  initials,
  fallbackSrc = "/placeholder/skeleton/avatar-skeleton.png",
  className,
  ...props
}: AvatarProps) {
  const px = sizePx(size);

  const primary = safeUrl(src);
  const fallback = safeUrl(fallbackSrc) || "/placeholder/skeleton/avatar-skeleton.png";

  const bg = primary ? `url(${primary}), url(${fallback})` : `url(${fallback})`;

  // Only show initials when user did not provide a valid src.
  const showInitials = !primary;

  const ring = isActive
    ? "ring-2 ring-[var(--color-live)] ring-offset-2 ring-offset-black/45"
    : "ring-1 ring-white/10";

  const glow = isActive
    ? "shadow-[0_0_18px_rgba(255,0,208,0.18)]"
    : "shadow-[0_0_0_1px_rgba(255,255,255,0.06)]";

  return (
    <span
      role="img"
      aria-label={alt}
      title={alt}
      className={cx(
        // Fixed sizing + flex-none prevents “giant avatar” and stretching
        "relative inline-flex flex-none items-center justify-center",
        "overflow-hidden rounded-full isolate",
        ring,
        glow,
        // Baseline surface so empty/loading never looks harsh
        "bg-black/30",
        // Premium inner stroke + subtle highlight
        "before:pointer-events-none before:absolute before:inset-0 before:rounded-full",
        "before:shadow-[inset_0_0_0_1px_rgba(255,255,255,0.10)]",
        "after:pointer-events-none after:absolute after:-inset-6 after:rounded-full",
        "after:bg-[radial-gradient(60%_45%_at_30%_25%,rgba(255,255,255,0.10),transparent_55%)] after:opacity-100",
        className
      )}
      style={{
        width: px,
        height: px,
        minWidth: px,
        minHeight: px,
        maxWidth: px,
        maxHeight: px,
        backgroundImage: bg,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
      {...props}
    >
      {showInitials ? (
        <span
          aria-hidden="true"
          className={cx(
            "pointer-events-none select-none",
            "text-[11px] font-semibold leading-none text-white/85"
          )}
        >
          {initials ?? initialsFrom(alt)}
        </span>
      ) : null}

      {/* Verified pip (non-intrusive, doesn’t affect layout) */}
      {verified ? (
        <span
          aria-hidden="true"
          className={cx(
            "absolute -bottom-0.5 -right-0.5 grid h-4 w-4 place-items-center rounded-full",
            "border border-white/12 bg-black/75 backdrop-blur",
            "shadow-[0_0_14px_rgba(0,240,255,0.14)]"
          )}
        >
          <span className="block h-2 w-2 rounded-full bg-[var(--color-accent)]" />
        </span>
      ) : null}
    </span>
  );
}

export default Avatar;
