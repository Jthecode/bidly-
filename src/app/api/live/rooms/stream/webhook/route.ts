// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — API (Stream Webhook) — Devnet-0                                 ┃
   ┃ File   : src/app/api/stream/webhook/route.ts                            ┃
   ┃ Role   : Receive provider webhooks (Mux) + update room state            ┃
   ┃ Status : Devnet-0 Ready                                                 ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)        ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                         ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import { NextResponse } from "next/server";

import { getStreamingProvider } from "@/lib/streaming/provider";
import { listRooms, setRoomStatus, bumpHeartbeat } from "@/lib/db/queries/rooms";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * POST /api/stream/webhook
 *
 * Provider webhooks (Mux-first).
 * - Verifies signature in provider.parseWebhook()
 * - Maps events to Bidly room status updates
 *
 * NOTE:
 * - We identify rooms via streamId/playbackId by scanning rooms.
 *   For scale: add an index table mapping {streamId -> roomId}.
 */
export async function POST(req: Request) {
  try {
    const provider = await getStreamingProvider();
    const ev = await provider.parseWebhook(req);

    // We need to locate the room for this event.
    // For MVP: scan a bounded list. For production: store a mapping table.
    const rooms = await listRooms({ limit: 200 });
    const room =
      rooms.find((r: any) => (ev.streamId && r.streamId === ev.streamId) || (ev.playbackId && r.playbackId === ev.playbackId)) ??
      null;

    if (!room) {
      // Webhooks can arrive out of order; return 200 to avoid retries.
      return NextResponse.json(
        { ok: true, ignored: true, reason: "room_not_found", event: { type: ev.type } },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    // Basic mapping: active -> live, ended/idle -> ended/draft depending on your preference.
    if (ev.type === "stream.active") {
      await setRoomStatus(room.id, "live" as any);
      await bumpHeartbeat(room.id);
    } else if (ev.type === "stream.idle" || ev.type === "stream.ended") {
      // Choose your product behavior:
      // - Some platforms set to "ended" only when seller explicitly ends.
      // - For MVP we end automatically when stream ends.
      await setRoomStatus(room.id, "ended" as any);
    } else {
      // Non-status events: still bump heartbeat to keep room "fresh" for dashboards.
      await bumpHeartbeat(room.id);
    }

    return NextResponse.json(
      { ok: true, provider: ev.provider, type: ev.type, roomId: room.id },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err: any) {
    // IMPORTANT:
    // For invalid signature, provider.parseWebhook() should throw.
    // We return 400 so Mux sees it as a failure (or 200 if you prefer silent ignore).
    return NextResponse.json(
      { ok: false, error: { code: "WEBHOOK_FAILED", message: err?.message ?? "Webhook failed" } },
      { status: 400 }
    );
  }
}
