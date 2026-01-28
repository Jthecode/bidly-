// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Live Room API — Devnet-0                                       ┃
   ┃ File   : src/app/api/live/rooms/[id]/route.ts                          ┃
   ┃ Role   : Truth endpoint for one room (GET one, PATCH update)           ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import "server-only";

import { NextResponse } from "next/server";
import { getRoom, patchRoom } from "@/lib/live/rooms";
import type {
  GetRoomResponse,
  LiveStatus,
  PatchRoomRequest,
  PatchRoomResponse,
  RoomId,
  RoomVisibility,
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

function isVisibility(v: unknown): v is RoomVisibility {
  return v === "public" || v === "unlisted" || v === "private";
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}

function isIsoDateish(v: unknown) {
  if (typeof v !== "string") return false;
  const t = Date.parse(v);
  return Number.isFinite(t);
}

/**
 * Ably publish (server-side REST).
 * - Uses ABLY_API_KEY
 * - Publishes to:
 *   - channel: "bidly:rooms"      (global list updates)
 *   - channel: `bidly:room:${id}` (room-specific updates)
 *
 * Safe no-op if ABLY_API_KEY is missing.
 */
async function publishRoomEvent(roomId: string, name: string, data: unknown) {
  const key = process.env.ABLY_API_KEY;
  if (!key) return;

  try {
    const Ably = (await import("ably")).default;
    const client = new Ably.Rest({ key });

    await Promise.all([
      client.channels.get("bidly:rooms").publish(name, { roomId, ...asObj(data) }),
      client.channels.get(`bidly:room:${roomId}`).publish(name, data),
    ]);
  } catch {
    // no-op: realtime is additive; never break truth endpoints
  }
}

function asObj(v: unknown): Record<string, unknown> {
  if (v && typeof v === "object" && !Array.isArray(v)) return v as Record<string, unknown>;
  return { value: v };
}

export async function GET(_req: Request, ctx: Ctx) {
  const id = (ctx.params.id ?? "").trim() as RoomId;
  if (!id) {
    const body: GetRoomResponse = { room: null };
    return NextResponse.json(body, { status: 400 });
  }

  const room = await getRoom(id);
  const body: GetRoomResponse = { room };

  // 404 if not found, but keep response shape consistent
  if (!room) return NextResponse.json(body, { status: 404 });
  return NextResponse.json(body, { status: 200 });
}

export async function PATCH(req: Request, ctx: Ctx) {
  const id = (ctx.params.id ?? "").trim() as RoomId;
  if (!id) return jsonError("Missing room id", 400);

  // Ensure room exists first (lets us detect state transitions cleanly)
  const before = await getRoom(id);
  if (!before) {
    const body: PatchRoomResponse = { room: null };
    return NextResponse.json(body, { status: 404 });
  }

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const patch = (json ?? {}) as Partial<PatchRoomRequest>;
  if (!patch || typeof patch !== "object") return jsonError("Invalid JSON body", 400);

  // -------- validation (tight but minimal) --------
  if (patch.title != null && typeof patch.title !== "string") {
    return jsonError("title must be a string", 400);
  }
  if (patch.description != null && typeof patch.description !== "string") {
    return jsonError("description must be a string", 400);
  }
  if (patch.status != null && !isLiveStatus(patch.status)) {
    return jsonError("status must be one of: live|offline|starting|ended|error", 400);
  }
  if (patch.visibility != null && !isVisibility(patch.visibility)) {
    return jsonError("visibility must be one of: public|unlisted|private", 400);
  }
  if (patch.tags != null && !isStringArray(patch.tags)) {
    return jsonError("tags must be an array of strings", 400);
  }
  if (patch.viewers != null) {
    if (typeof patch.viewers !== "number" || !Number.isFinite(patch.viewers)) {
      return jsonError("viewers must be a finite number", 400);
    }
    if (patch.viewers < 0) return jsonError("viewers must be non-negative", 400);
    if (patch.viewers > 5_000_000) return jsonError("viewers is too large", 400);
  }
  if (patch.coverUrl != null && typeof patch.coverUrl !== "string") {
    return jsonError("coverUrl must be a string", 400);
  }
  if (patch.playback != null) {
    if (typeof patch.playback !== "object" || Array.isArray(patch.playback)) {
      return jsonError("playback must be an object", 400);
    }
    const pb = patch.playback as { hlsUrl?: unknown; posterUrl?: unknown };
    if (pb.hlsUrl != null && typeof pb.hlsUrl !== "string") {
      return jsonError("playback.hlsUrl must be a string", 400);
    }
    if (pb.posterUrl != null && typeof pb.posterUrl !== "string") {
      return jsonError("playback.posterUrl must be a string", 400);
    }
  }

  // (Optional safety) If someone tries to smuggle timestamps, reject.
  // Those should be server-controlled (heartbeat/status transitions).
  // If your patchRoom implementation already ignores them, you can delete this.
  if ((patch as any).startedAt != null && !isIsoDateish((patch as any).startedAt)) {
    return jsonError("startedAt must be ISO8601 if provided", 400);
  }
  if ((patch as any).endedAt != null && !isIsoDateish((patch as any).endedAt)) {
    return jsonError("endedAt must be ISO8601 if provided", 400);
  }

  // -------- apply --------
  const room = await patchRoom(id, patch as PatchRoomRequest);
  const body: PatchRoomResponse = { room };

  if (!room) return NextResponse.json(body, { status: 404 });

  // -------- realtime events --------
  // Emit high-level semantic events for clients:
  // - room.updated (any patch)
  // - room.ended   (status transition -> ended)
  // - room.live    (status transition -> live)
  const prevStatus = before.status;
  const nextStatus = room.status;

  await publishRoomEvent(id, "room.updated", { room });

  if (prevStatus !== "ended" && nextStatus === "ended") {
    await publishRoomEvent(id, "room.ended", { room });
  } else if (prevStatus !== "live" && nextStatus === "live") {
    await publishRoomEvent(id, "room.live", { room });
  } else if (prevStatus !== nextStatus) {
    await publishRoomEvent(id, "room.status", { from: prevStatus, to: nextStatus, room });
  }

  return NextResponse.json(body, { status: 200 });
}
