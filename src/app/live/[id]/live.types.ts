/* ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   ┃ Bidly — Live Types — Devnet-0                                          ┃
   ┃ File   : src/app/live/[id]/live.types.ts                               ┃
   ┃ Role   : Typed contract for Live room UI (server-safe)                 ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃
   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ */

/**
 * live.types.ts
 * - Contract shared across:
 *   - live.data.ts (data source)
 *   - /live/[id] page + components
 *
 * Keep this file:
 * - pure types/constants (no React, no browser APIs)
 * - stable (avoid churn that breaks many files)
 */

export type LiveRoomId = string;

export type LiveStageState = "live" | "starting-soon" | "ended" | "offline";

export type LiveSeller = {
  id: string;
  name: string;
  handle?: string;
  avatar?: string;
  verified?: boolean;
  tagline?: string;
};

export type LiveProduct = {
  id: string;
  title: string;
  image?: string;
  /**
   * Optional hint for UX (badges/filters). Keep strings stable.
   * Examples: "electronics" | "fashion" | "beauty"
   */
  categoryHint?: string;
};

export type LiveStage = {
  state: LiveStageState;

  /**
   * Optional live stats (your current UI may hide them).
   * Keep them as numbers (not strings) for future formatting.
   */
  viewers?: number;
  likes?: number;

  /**
   * When the room ends / next state change.
   * ISO string so it’s serializable server→client if needed.
   */
  closeAt?: string;

  /**
   * UX sugar (e.g., "15m"). Optional.
   */
  endsInLabel?: string;
};

export type LiveRoom = {
  id: LiveRoomId;
  createdAt: string;

  seller: LiveSeller;
  product: LiveProduct;
  stage: LiveStage;

  /**
   * Back-compat / UI convenience:
   * Some UI expects `isLive`. Canonical truth is `stage.state === "live"`.
   */
  isLive?: boolean;

  /**
   * Canonical routing fields so components don’t rebuild URLs.
   */
  href: string;
  shareUrl?: string;
};

/* ------------------------------------------------------------------ */
/* Back-compat aliases (keep until you migrate imports across the app) */
/* ------------------------------------------------------------------ */

export type LiveStream = LiveRoom;

/* ----------------------------- */
/* Live Chat (minimal contract)  */
/* ----------------------------- */

export type LiveChatRole = "host" | "moderator" | "viewer" | "system";

export type LiveChatSender = {
  id?: string;
  name: string;
  handle?: string;
  avatar?: string;
  verified?: boolean;
  role?: LiveChatRole;
};

export type LiveChatKind = "message" | "system" | "tip";

/**
 * LiveChatMessage (compat-first)
 *
 * Your demo/UI currently uses objects shaped like:
 * {
 *   id, user: { name, handle, avatar, verified }, message, ts, isHost
 * }
 *
 * While newer code prefers:
 * {
 *   id, roomId, sender, text, ts
 * }
 *
 * This type supports BOTH without forcing a refactor today.
 */
export type LiveChatMessage = {
  id: string;

  /**
   * Optional for demo arrays; required when wiring to real rooms.
   */
  roomId?: LiveRoomId;

  /**
   * ISO timestamp. Server-safe and serializable.
   */
  ts: string;

  /**
   * Back-compat sender field used by older UI.
   */
  user: LiveChatSender;

  /**
   * Forward name for newer code (optional so old data remains valid).
   */
  sender?: LiveChatSender;

  /**
   * Canonical text field (preferred).
   */
  text?: string;

  /**
   * Back-compat field used by current demo data.
   */
  message?: string;

  /**
   * Back-compat: some demo lists mark host messages this way.
   * Canonical approach is `user.role = "host"`.
   */
  isHost?: boolean;

  /**
   * Optional presentation hints.
   */
  kind?: LiveChatKind;
  isPinned?: boolean;
};

/* ----------------------------- */
/* Helpers                       */
/* ----------------------------- */

export function roomIsLive(room: Pick<LiveRoom, "isLive" | "stage">): boolean {
  if (typeof room.isLive === "boolean") return room.isLive;
  return room.stage?.state === "live";
}

export function chatSender(m: Pick<LiveChatMessage, "user" | "sender">): LiveChatSender {
  return m.sender ?? m.user;
}

/**
 * Normalizes message text:
 * - prefers `text`
 * - falls back to `message`
 */
export function chatText(m: Pick<LiveChatMessage, "text" | "message">): string {
  const t = (m.text ?? "").trim();
  if (t) return t;
  return (m.message ?? "").trim();
}

/**
 * Best-effort role resolution:
 * - explicit role wins
 * - `isHost` maps to host
 */
export function chatRole(m: Pick<LiveChatMessage, "user" | "sender" | "isHost">): LiveChatRole {
  const s = chatSender(m);
  if (s.role) return s.role;
  return m.isHost ? "host" : "viewer";
}
