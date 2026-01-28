// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Live Heartbeat API — Devnet-0                                  ┃
   ┃ File   : src/app/api/live/rooms/[id]/heartbeat/route.ts                ┃
   ┃ Role   : Broadcaster heartbeat (keeps room “live” + updates viewers)   ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import "server-only";

import { NextResponse } from "next/server";
import { heartbeatRoom } from "@/lib/live/rooms";
import type {
  HeartbeatRequest,
  HeartbeatResponse,
  LiveStatus,
  RoomId,
} from "@/lib/live/types";

type Ctx = { params: { id: string } };

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function isLiveStatus(v: unknown): v is LiveStatus {
  return (
    v === "live" ||
    v === "offline" ||
    v === "starting" ||
    v === "ended" ||
    v === "error"
  );
}

/**
 * POST /api/live/rooms/[id]/heartbeat
 *
 * Body: HeartbeatRequest
 * - status?: live/offline/starting/ended/error
 * - viewers?: number
 *
 * In production, protect this endpoint:
 * - require a broadcaster token
 * - or validate a signed secret from your ingest provider webhook
 */
export async function POST(req: Request, ctx: Ctx) {
  const id = (ctx.params.id ?? "").trim() as RoomId;
  if (!id) return jsonError("Missing room id", 400);

  let json: unknown = {};
  try {
    // allow empty body
    json = await req.json();
  } catch {
    json = {};
  }

  const input = (json ?? {}) as Partial<HeartbeatRequest>;

  // Validate status if present
  const status = input.status;
  if (status != null && !isLiveStatus(status)) {
    return jsonError(
      `status must be one of: live|offline|starting|ended|error`,
      400
    );
  }

  // Validate viewers if present
  const viewers = input.viewers;
  if (viewers != null) {
    if (typeof viewers !== "number" || !Number.isFinite(viewers)) {
      return jsonError("viewers must be a finite number", 400);
    }
    if (viewers < 0) return jsonError("viewers must be a non-negative number", 400);
    if (viewers > 5_000_000) return jsonError("viewers is too large", 400);
  }

  const room = await heartbeatRoom(id, {
    status,
    viewers,
  });

  const body: HeartbeatResponse = { ok: true, room };

  if (!room) return NextResponse.json(body, { status: 404 });
  return NextResponse.json(body, { status: 200 });
}
