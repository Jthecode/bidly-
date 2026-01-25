/* ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   ┃ Bidly — Placeholder Assets Helper — Devnet-0                           ┃
   ┃ File   : src/lib/placeholders.ts                                      ┃
   ┃ Role   : Single source of truth for /public/placeholder asset paths   ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃
   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ */

export type OverlayKey =
  | "live-badge"
  | "offline-badge"
  | "verified-badge"
  | "play"
  | "waveform"
  | "scanlines"
  | "noise";

export type BackgroundKey =
  | "grid"
  | "glow-top"
  | "glow-bottom"
  | "stars"
  | "blur-orb-1"
  | "blur-orb-2";

export type SkeletonKey = "preview-skeleton" | "avatar-skeleton";

const ROOT = "/placeholder" as const;

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

/** /public/placeholder/avatars/avatar-01.png */
export function phAvatar(n: number) {
  const safe = Number.isFinite(n) ? Math.max(1, Math.floor(n)) : 1;
  return `${ROOT}/avatars/avatar-${pad2(safe)}.png`;
}

/** /public/placeholder/covers/cover-01.jpg */
export function phCover(n: number) {
  const safe = Number.isFinite(n) ? Math.max(1, Math.floor(n)) : 1;
  return `${ROOT}/covers/cover-${pad2(safe)}.jpg`;
}

/** /public/placeholder/overlays/<name>.png */
export function phOverlay(name: OverlayKey) {
  return `${ROOT}/overlays/${name}.png`;
}

/** /public/placeholder/backgrounds/<name>.png */
export function phBackground(name: BackgroundKey) {
  return `${ROOT}/backgrounds/${name}.png`;
}

/** /public/placeholder/skeleton/<name>.png */
export function phSkeleton(name: SkeletonKey) {
  return `${ROOT}/skeleton/${name}.png`;
}

/** Commonly used fallbacks */
export const PH_FALLBACKS = {
  avatar: phSkeleton("avatar-skeleton"),
  preview: phSkeleton("preview-skeleton"),
} as const;

/**
 * Deterministic cycling helpers (so demo lists don’t flicker).
 * Example:
 *   phAvatarCycle(i, 8) -> avatar-01..08
 *   phCoverCycle(i, 2)  -> cover-01..02
 */
export function phAvatarCycle(indexZeroBased: number, total = 8) {
  const t = Math.max(1, Math.floor(total));
  const i = Math.max(0, Math.floor(indexZeroBased));
  return phAvatar((i % t) + 1);
}

export function phCoverCycle(indexZeroBased: number, total = 2) {
  const t = Math.max(1, Math.floor(total));
  const i = Math.max(0, Math.floor(indexZeroBased));
  return phCover((i % t) + 1);
}
