// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Realtime (Ably) — Devnet-0                                     ┃
   ┃ File   : src/lib/realtime/ably.ts                                      ┃
   ┃ Role   : Ably client helpers + channel naming (rooms + chat + presence)┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

/**
 * Ably integration model:
 * - Public "rooms updates" channel for marketplace live tiles.
 * - Per-room chat channel.
 * - Optional presence per room.
 *
 * Environment:
 * - NEXT_PUBLIC_ABLY_KEY              (public key for client publish/subscribe)
 * - ABLY_API_KEY                      (server key for auth/token minting) [recommended]
 * - NEXT_PUBLIC_SITE_URL              (optional; for token auth endpoint)
 *
 * SECURITY NOTES:
 * - The safest approach is token auth from the server via /api/realtime/auth
 *   and NEVER exposing ABLY_API_KEY to the browser.
 * - For a quick dev/demo, NEXT_PUBLIC_ABLY_KEY can be used client-side.
 */

import type { RoomId } from "@/lib/live/types";

/* ======================================================
   Channel naming
   ====================================================== */

export const AblyChannels = {
  /**
   * Marketplace updates: publish when a room goes live/offline,
   * or when title/cover/viewers change.
   */
  rooms: () => `bidly:rooms`,

  /**
   * Room chat stream.
   */
  chat: (roomId: RoomId) => `bidly:room:${roomId}:chat`,

  /**
   * Room presence (optional).
   */
  presence: (roomId: RoomId) => `bidly:room:${roomId}:presence`,
} as const;

/* ======================================================
   Events (payloads)
   ====================================================== */

export type RoomsEvent =
  | { type: "room.created"; roomId: RoomId }
  | { type: "room.updated"; roomId: RoomId }
  | { type: "room.ended"; roomId: RoomId };

export type ChatEvent =
  | {
      type: "chat.message";
      roomId: RoomId;
      message: {
        id: string;
        text: string;
        createdAt: string;
        author?: {
          id: string;
          name: string;
          handle?: string;
          avatarUrl?: string;
          verified?: boolean;
        };
      };
    }
  | {
      type: "chat.system";
      roomId: RoomId;
      message: { id: string; text: string; createdAt: string };
    };

/* ======================================================
   Client helpers
   ====================================================== */

let _ablyClient: any | null = null;

/**
 * Browser client (subscribe/publish).
 * Uses:
 * - token auth endpoint if NEXT_PUBLIC_ABLY_AUTH_URL is set
 * - otherwise falls back to NEXT_PUBLIC_ABLY_KEY (dev-only)
 */
export function getAblyClient() {
  if (typeof window === "undefined") {
    throw new Error("[Ably] getAblyClient() can only be used in the browser.");
  }

  if (_ablyClient) return _ablyClient;

  // Lazy import to avoid bundling if unused
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const Ably = require("ably");

  const authUrl = process.env.NEXT_PUBLIC_ABLY_AUTH_URL || "/api/realtime/auth";
  const publicKey = process.env.NEXT_PUBLIC_ABLY_KEY;

  // Preferred: token auth (server-minted Ably token)
  if (authUrl) {
    _ablyClient = new Ably.Realtime({
      authUrl,
      authMethod: "POST",
      // Optional: send headers/body here later if you add session auth
    });
    return _ablyClient;
  }

  // Dev fallback: public key directly in the browser
  if (!publicKey) {
    throw new Error("[Ably] Missing NEXT_PUBLIC_ABLY_KEY or NEXT_PUBLIC_ABLY_AUTH_URL.");
  }

  _ablyClient = new Ably.Realtime(publicKey);
  return _ablyClient;
}

/* ======================================================
   Subscription helpers
   ====================================================== */

export function subscribeRooms(onEvent: (ev: RoomsEvent) => void) {
  const client = getAblyClient();
  const ch = client.channels.get(AblyChannels.rooms());

  const handler = (msg: any) => {
    if (!msg?.data) return;
    onEvent(msg.data as RoomsEvent);
  };

  ch.subscribe(handler);

  return () => {
    ch.unsubscribe(handler);
    // Keep channel cached; Ably handles cleanup internally
  };
}

export function subscribeRoomChat(
  roomId: RoomId,
  onEvent: (ev: ChatEvent) => void
) {
  const client = getAblyClient();
  const ch = client.channels.get(AblyChannels.chat(roomId));

  const handler = (msg: any) => {
    if (!msg?.data) return;
    onEvent(msg.data as ChatEvent);
  };

  ch.subscribe(handler);

  return () => {
    ch.unsubscribe(handler);
  };
}

/* ======================================================
   Publish helpers (client-side)
   ====================================================== */

export async function publishRoomsEvent(ev: RoomsEvent) {
  const client = getAblyClient();
  const ch = client.channels.get(AblyChannels.rooms());
  await ch.publish("rooms", ev);
}

export async function publishChatEvent(roomId: RoomId, ev: ChatEvent) {
  const client = getAblyClient();
  const ch = client.channels.get(AblyChannels.chat(roomId));
  await ch.publish("chat", ev);
}

/* ======================================================
   Presence helpers (optional)
   ====================================================== */

export function enterPresence(roomId: RoomId, payload?: Record<string, any>) {
  const client = getAblyClient();
  const ch = client.channels.get(AblyChannels.presence(roomId));
  ch.presence.enter(payload ?? {});
  return () => ch.presence.leave();
}

export function subscribePresence(roomId: RoomId, onChange: (msg: any) => void) {
  const client = getAblyClient();
  const ch = client.channels.get(AblyChannels.presence(roomId));
  ch.presence.subscribe(onChange);
  return () => ch.presence.unsubscribe(onChange);
}
