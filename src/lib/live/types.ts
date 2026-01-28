// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Live Types — Devnet-0                                         ┃
   ┃ File   : src/lib/live/types.ts                                        ┃
   ┃ Role   : Canonical live-room + chat contracts (API + UI)              ┃
   ┃ Status : Devnet-0 Ready                                               ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)      ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                       ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

/* ======================================================
   Core IDs
   ====================================================== */

export type RoomId = string;
export type SellerId = string;
export type UserId = string;
export type MessageId = string;

/* ======================================================
   Enums
   ====================================================== */

export type LiveStatus = "live" | "offline" | "starting" | "ended" | "error";

export type RoomVisibility = "public" | "unlisted" | "private";

export type RoomCategory =
  | "all"
  | "trending"
  | "new"
  | "verified"
  | "digital"
  | "physical"
  | "services"
  | "software";

/* ======================================================
   Seller
   ====================================================== */

export interface LiveSeller {
  id: SellerId;
  name: string;
  handle?: string; // e.g. "@seller1"
  avatarUrl?: string;
  verified?: boolean;
}

/* ======================================================
   Streaming / Playback
   ====================================================== */

export interface PlaybackSources {
  /**
   * HLS playback (recommended).
   * Example: https://.../index.m3u8
   */
  hlsUrl?: string;

  /**
   * Optional poster/thumb shown before play.
   */
  posterUrl?: string;
}

/**
 * OBS ingest info (only needed for broadcaster tools/admin panels).
 * In a public API, do NOT return stream keys.
 */
export interface IngestInfo {
  provider?: "mux" | "cloudflare" | "aws-ivs" | "livepeer" | "custom";
  rtmpUrl?: string; // e.g. rtmp://...
  streamKeyId?: string; // ID only (never the key itself)
}

/* ======================================================
   Live Room
   ====================================================== */

export interface LiveRoom {
  id: RoomId;

  title: string;
  description?: string;

  seller: LiveSeller;

  status: LiveStatus;
  visibility: RoomVisibility;

  /**
   * Seller-first: we don’t show these on the marketplace cards by default,
   * but we keep them available for live room UX / ops.
   */
  viewers?: number;

  /**
   * Tags/categories to power filters.
   */
  category?: RoomCategory;
  tags?: string[];

  /**
   * Primary imagery for tile + page.
   */
  coverUrl?: string;

  /**
   * Playback sources for the live room page.
   */
  playback?: PlaybackSources;

  /**
   * Server timestamps (ISO8601).
   */
  startedAt?: string; // when stream went live
  endedAt?: string; // when stream ended
  lastHeartbeatAt?: string; // broadcaster heartbeat timestamp
  createdAt?: string;
  updatedAt?: string;
}

/* ======================================================
   Chat
   ====================================================== */

export type ChatMessageKind = "user" | "system" | "event";

export interface LiveChatMessage {
  id: MessageId;
  roomId: RoomId;

  kind: ChatMessageKind;

  /**
   * For user messages, include the author.
   * For system/event messages, author can be omitted.
   */
  author?: {
    id: UserId;
    name: string;
    handle?: string;
    avatarUrl?: string;
    verified?: boolean;
  };

  text: string;

  /**
   * Server time (ISO8601).
   */
  createdAt: string;
}

/* ======================================================
   API Payloads
   ====================================================== */

/**
 * GET /api/live/rooms
 */
export interface ListRoomsResponse {
  rooms: LiveRoom[];
}

/**
 * POST /api/live/rooms
 */
export interface CreateRoomRequest {
  title: string;
  description?: string;
  visibility?: RoomVisibility;
  category?: RoomCategory;
  tags?: string[];
  coverUrl?: string;

  seller: {
    id: SellerId;
    name: string;
    handle?: string;
    avatarUrl?: string;
    verified?: boolean;
  };
}

export interface CreateRoomResponse {
  room: LiveRoom;
}

/**
 * GET /api/live/rooms/[id]
 */
export interface GetRoomResponse {
  room: LiveRoom | null;
}

/**
 * PATCH /api/live/rooms/[id]
 */
export interface PatchRoomRequest {
  title?: string;
  description?: string;
  status?: LiveStatus;
  visibility?: RoomVisibility;
  category?: RoomCategory;
  tags?: string[];
  coverUrl?: string;

  viewers?: number;

  playback?: PlaybackSources;
}

export interface PatchRoomResponse {
  room: LiveRoom | null;
}

/**
 * POST /api/live/rooms/[id]/heartbeat
 */
export interface HeartbeatRequest {
  status?: LiveStatus; // allow broadcaster to update status
  viewers?: number;
}

export interface HeartbeatResponse {
  ok: true;
  room: LiveRoom | null;
}

/**
 * GET/POST /api/live/rooms/[id]/messages
 *
 * Pagination:
 * - limit: max 200
 * - before: ISO8601 string (messages strictly earlier than this timestamp)
 */
export interface ListMessagesRequest {
  limit?: number;
  before?: string; // ISO8601
}

export interface ListMessagesResponse {
  messages: LiveChatMessage[];
}

export interface PostMessageRequest {
  text: string;
  author?: LiveChatMessage["author"];
}

export interface PostMessageResponse {
  message: LiveChatMessage;
}

/* ======================================================
   Utilities
   ====================================================== */

/**
 * Back-compat helper: some earlier UI used boolean `isLive`.
 * This keeps old components working while we migrate to `status`.
 */
export function isRoomLive(room?: Pick<LiveRoom, "status"> | null) {
  return room?.status === "live";
}

/**
 * Normalize a "before" value:
 * - Accept ISO8601, reject invalid dates
 * - Returns normalized ISO string or undefined
 */
export function normalizeBeforeIso(before?: string) {
  const raw = (before ?? "").trim();
  if (!raw) return undefined;
  const t = Date.parse(raw);
  if (!Number.isFinite(t)) return undefined;
  return new Date(t).toISOString();
}
