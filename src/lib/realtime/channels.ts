// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Realtime (Ably) — Devnet-0                                     ┃
   ┃ File   : src/lib/realtime/channels.ts                                  ┃
   ┃ Role   : Canonical realtime channel + event name registry              ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import type { RoomId } from "@/lib/live/types";

/**
 * Canonical realtime namespace for Bidly.
 *
 * Rules:
 * - All channels are under `bidly:` namespace.
 * - Room-scoped channels are always `bidly:room:<roomId>:<topic>`.
 * - Keep topics stable and additive (never rename once in production).
 * - Event names are dotted strings (`room.updated`, `chat.message`) and are
 *   published as the Ably message "name" for easy filtering.
 */
export const RealtimeChannels = {
  /** Marketplace-wide broadcast for live tiles (rooms list updates). */
  rooms: () => `bidly:rooms`,

  /** Per-room state updates (viewers, status, title, cover, etc). */
  room: (roomId: RoomId) => `bidly:room:${roomId}`,

  /** Per-room chat stream. */
  chat: (roomId: RoomId) => `bidly:room:${roomId}:chat`,

  /** Optional presence for per-room viewer list / counts. */
  presence: (roomId: RoomId) => `bidly:room:${roomId}:presence`,
} as const;

/**
 * Canonical event name registry.
 * Use these as Ably message names (msg.name) so you can subscribe to specific names.
 */
export const RealtimeEvents = {
  // Rooms / marketplace
  roomCreated: "room.created",
  roomUpdated: "room.updated",
  roomEnded: "room.ended",

  // Per-room state updates
  roomState: "room.state",

  // Chat
  chatMessage: "chat.message",
  chatSystem: "chat.system",

  // Presence / health
  presenceEnter: "presence.enter",
  presenceLeave: "presence.leave",
  heartbeat: "room.heartbeat",
} as const;

export type RealtimeEventName = (typeof RealtimeEvents)[keyof typeof RealtimeEvents];

/* =====================================================================
   Shared payload shapes (lightweight + forward compatible)
   ===================================================================== */

export type RoomsBroadcastEvent =
  | { type: typeof RealtimeEvents.roomCreated; roomId: RoomId }
  | { type: typeof RealtimeEvents.roomUpdated; roomId: RoomId }
  | { type: typeof RealtimeEvents.roomEnded; roomId: RoomId };

export type RoomStateEvent = {
  type: typeof RealtimeEvents.roomState;
  roomId: RoomId;
  state: {
    status: "live" | "offline" | "ended";
    title?: string;
    coverImageUrl?: string;
    viewerCount?: number;
    sellerId?: string;
    updatedAt: string; // ISO
  };
};

export type ChatMessageEvent = {
  type: typeof RealtimeEvents.chatMessage;
  roomId: RoomId;
  message: {
    id: string;
    text: string;
    createdAt: string; // ISO
    author?: {
      id: string;
      name: string;
      handle?: string;
      avatarUrl?: string;
      verified?: boolean;
    };
  };
};

export type ChatSystemEvent = {
  type: typeof RealtimeEvents.chatSystem;
  roomId: RoomId;
  message: { id: string; text: string; createdAt: string };
};

export type PresenceEvent =
  | { type: typeof RealtimeEvents.presenceEnter; roomId: RoomId; clientId: string; at: string }
  | { type: typeof RealtimeEvents.presenceLeave; roomId: RoomId; clientId: string; at: string };

export type HeartbeatEvent = {
  type: typeof RealtimeEvents.heartbeat;
  roomId: RoomId;
  at: string;
};

export type RealtimePayload =
  | RoomsBroadcastEvent
  | RoomStateEvent
  | ChatMessageEvent
  | ChatSystemEvent
  | PresenceEvent
  | HeartbeatEvent;

/* =====================================================================
   Helpers
   ===================================================================== */

export function isRoomId(v: unknown): v is RoomId {
  return typeof v === "string" && v.length > 0 && v.length <= 128;
}

export function nowIso() {
  return new Date().toISOString();
}

/**
 * Convenience: stable message name for a given payload (maps `type`).
 * If you publish `name` as payload.type, Ably filtering is clean.
 */
export function eventName(payload: RealtimePayload): RealtimeEventName {
  return payload.type;
}
