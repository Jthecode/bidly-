/* ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   ┃ Bidly — Live Data — Devnet-0                                           ┃
   ┃ File   : src/app/live/[id]/live.data.ts                                ┃
   ┃ Role   : Deterministic demo/live room data source (server-safe)        ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃
   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ */

/**
 * live.data.ts
 * - Single place for fetching/constructing live room data.
 * - Today: deterministic demo data (NO Math.random) to avoid hydration issues.
 * - Tomorrow: swap `getLiveRoom()` internals to your API/DB layer.
 *
 * IMPORTANT:
 * - Keep this file server-safe (no window, no localStorage).
 * - If you later add caching, do it at the route level or with Next cache primitives.
 */

import type {
  LiveRoom,
  LiveRoomId,
  LiveSeller,
  LiveProduct,
  LiveStage,
} from "./live.types";

/* ======================================================
   Helpers
   ====================================================== */

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function clampInt(n: number, min: number, max: number) {
  const v = Math.floor(n);
  return Math.max(min, Math.min(max, v));
}

/** Simple stable hash (non-crypto) for deterministic demo values. */
function hashStr(input: string) {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function pick<T>(arr: readonly T[], seed: number) {
  const idx = arr.length ? seed % arr.length : 0;
  return arr[idx]!;
}

function seededRange(seed: number, min: number, max: number) {
  const span = Math.max(1, max - min + 1);
  return min + (seed % span);
}

function nowIso() {
  return new Date().toISOString();
}

/* ======================================================
   Demo Library
   ====================================================== */

const TAGLINES = [
  "Elite drops. Clean tiles. Cyber-luxury bidding.",
  "Rare pieces, live energy, premium execution.",
  "Fast bids, clean rooms, zero clutter.",
  "Seller-first auctions with Whatnot-grade polish.",
] as const;

const CATEGORY_HINTS = [
  "electronics",
  "fashion",
  "collectibles",
  "beauty",
  "home",
  "auto",
] as const;

function makeSeller(id: string): LiveSeller {
  const seed = hashStr(id);
  const idx = seededRange(seed, 1, 50);

  const avatarIdx = (idx % 8) + 1; // you have avatar-01..08
  const verified = idx % 5 === 0;

  return {
    id: `seller-${idx}`,
    name: `Seller ${idx}`,
    handle: `@seller${idx}`,
    verified,
    avatar: `/placeholder/avatars/avatar-${pad2(avatarIdx)}.png`,
    tagline: pick(TAGLINES, seed),
  };
}

function makeProduct(id: string): LiveProduct {
  const seed = hashStr(`prod:${id}`);
  const idx = seededRange(seed, 1, 99);

  const coverIdx = (idx % 2) + 1; // you have cover-01..02
  return {
    id: `product-${idx}`,
    title: `Mystery Box #${idx}`,
    image: `/placeholder/covers/cover-${pad2(coverIdx)}.jpg`,
    categoryHint: pick(CATEGORY_HINTS, seed),
  };
}

function makeStage(id: string): LiveStage {
  const seed = hashStr(`stage:${id}`);

  // Deterministic “live stats”
  const viewers = seededRange(seed, 12, 5200);
  const likes = seededRange(seed >>> 1, 0, 9800);

  // “ends in” is UX sugar; a real system uses closeAt.
  const endsMins = seededRange(seed >>> 2, 2, 45);

  const closeAt = new Date(Date.now() + endsMins * 60_000).toISOString();

  return {
    state: "live",
    viewers,
    likes,
    closeAt,
    endsInLabel: `${endsMins}m`,
  };
}

/* ======================================================
   Public API
   ====================================================== */

export function isLiveRoomId(id: unknown): id is LiveRoomId {
  if (typeof id !== "string") return false;
  const s = id.trim();
  if (!s) return false;
  // allow simple slugs/ids; keep it permissive for now
  return s.length <= 120;
}

/**
 * Get a live room by id.
 * - Today: returns a deterministic demo room for any id.
 * - Tomorrow: fetch from API and return null when missing.
 */
export async function getLiveRoom(id: LiveRoomId): Promise<LiveRoom | null> {
  const rid = (id ?? "").trim();
  if (!isLiveRoomId(rid)) return null;

  const seller = makeSeller(rid);
  const product = makeProduct(rid);
  const stage = makeStage(rid);

  const room: LiveRoom = {
    id: rid,
    createdAt: nowIso(),
    seller,
    product,
    stage,
    // Routes (keep in one place so UI stays consistent)
    href: `/live/${encodeURIComponent(rid)}`,
    shareUrl: `/live/${encodeURIComponent(rid)}`,
  };

  return room;
}

/**
 * Optional: list “featured” live rooms for discovery sections.
 * Deterministic set so UI doesn’t jump.
 */
export async function listFeaturedLiveRooms(count = 8): Promise<LiveRoom[]> {
  const n = clampInt(count, 0, 24);

  const ids = Array.from({ length: n }).map((_, i) => `featured-${i + 1}`);
  const rooms = await Promise.all(ids.map((id) => getLiveRoom(id)));
  return rooms.filter(Boolean) as LiveRoom[];
}
