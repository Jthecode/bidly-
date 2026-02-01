// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — API (Stream Create) — Devnet-0                                  ┃
   ┃ File   : src/app/api/stream/create/route.ts                             ┃
   ┃ Role   : Create a live stream for a room (Mux-first) + persist to DB    ┃
   ┃ Status : Devnet-0 Ready                                                 ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)        ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                         ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import { NextResponse } from "next/server";

import { getStreamingProvider } from "@/lib/streaming/provider";
import { getRoomById, updateRoomStream } from "@/lib/db/queries/rooms";
import type { StreamLatencyMode, PlaybackPolicy } from "@/lib/streaming/provider";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  roomId: string;
  /**
   * Optional: used by provider dashboards (Mux stream name).
   */
  name?: string;

  /**
   * Optional metadata to pass through to provider if supported.
   */
  metadata?: Record<string, string>;

  /**
   * Optional latency mode.
   */
  latencyMode?: StreamLatencyMode;

  /**
   * Optional playback policy.
   */
  playbackPolicy?: PlaybackPolicy;
};

function badRequest(message: string) {
  return NextResponse.json(
    { ok: false, error: { code: "BAD_REQUEST", message } },
    { status: 400 }
  );
}

function serverError(message: string) {
  return NextResponse.json(
    { ok: false, error: { code: "SERVER_ERROR", message } },
    { status: 500 }
  );
}

/**
 * POST /api/stream/create
 *
 * Creates (or re-creates) a provider stream for a room.
 *
 * Security:
 * - This endpoint should be protected (seller-only) once auth is enabled.
 * - It returns ONLY client-safe fields (playbackId, provider, streamId optional).
 * - ingestUrl + streamKey are persisted server-side but never returned.
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => null)) as Body | null;
    if (!body) return badRequest("Missing JSON body.");

    const roomId = (body.roomId ?? "").trim();
    if (!roomId) return badRequest("roomId is required.");

    // TODO: enforce seller auth:
    // - ensure caller owns the roomId's sellerId
    // - otherwise return 403

    const room = await getRoomById(roomId);
    if (!room) return badRequest(`Room not found: ${roomId}`);

    // Create stream at provider
    const provider = await getStreamingProvider();
    const asset = await provider.createStream({
      name: body.name ?? `Bidly Room ${roomId}`,
      metadata: {
        roomId,
        sellerId: String((room as any).sellerId ?? ""),
        ...(body.metadata ?? {}),
      },
      latencyMode: body.latencyMode ?? "standard",
      playbackPolicy: body.playbackPolicy ?? "public",
    });

    // Persist server-only stream data on the room
    await updateRoomStream(roomId, {
      streamProvider: asset.provider,
      streamId: asset.streamId,
      playbackId: asset.playbackId,
      ingestUrl: asset.ingestUrl ?? null,
      streamKey: asset.streamKey ?? null,
    });

    // Notify marketplace updates (optional):
    // - You can publish Ably rooms event here if desired:
    //   publishRoomsEvent({ type: "room.updated", roomId })

    return NextResponse.json(
      {
        ok: true,
        roomId,
        stream: {
          provider: asset.provider,
          playbackId: asset.playbackId,
          // streamId is not secret, but can be omitted if you prefer:
          streamId: asset.streamId,
        },
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (err: any) {
    const msg = err?.message ?? "Unknown error";
    return serverError(msg);
  }
}
