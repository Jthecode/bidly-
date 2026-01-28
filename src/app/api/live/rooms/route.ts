// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Live Rooms API — Devnet-0                                      ┃
   ┃ File   : src/app/api/live/rooms/route.ts                               ┃
   ┃ Role   : Truth endpoint for rooms (GET list, POST create)              ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import "server-only";

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { createRoom, listRooms } from "@/lib/live/rooms";
import type {
  CreateRoomRequest,
  ListRoomsResponse,
  RoomCategory,
  LiveStatus,
  RoomVisibility,
} from "@/lib/live/types";

/* ======================================================
   Helpers
   ====================================================== */

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

function clampInt(n: number, min: number, max: number) {
  if (!Number.isFinite(n)) return min;
  const v = Math.floor(n);
  return Math.max(min, Math.min(max, v));
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

function isRoomVisibility(v: unknown): v is RoomVisibility {
  return v === "public" || v === "unlisted" || v === "private";
}

/**
 * If RoomCategory is a string union, we can only validate loosely at runtime.
 * We accept any non-empty string by default (server-side source of truth can reject).
 */
function normalizeCategory(v: string | null): RoomCategory | undefined {
  const s = (v ?? "").trim();
  return s ? (s as RoomCategory) : undefined;
}

/* ======================================================
   GET /api/live/rooms
   ====================================================== */

/**
 * GET /api/live/rooms
 * Query params:
 * - limit (1..100)
 * - status (live|offline|starting|ended|error)
 * - category (RoomCategory)
 * - visibility (public|unlisted|private)
 */
export async function GET(req: NextRequest) {
  const url = new URL(req.url);

  const limitRaw = url.searchParams.get("limit");
  const statusRaw = url.searchParams.get("status");
  const categoryRaw = url.searchParams.get("category");
  const visibilityRaw = url.searchParams.get("visibility");

  const limit = limitRaw ? clampInt(Number(limitRaw), 1, 100) : undefined;

  const status = statusRaw ? statusRaw.trim() : "";
  const visibility = visibilityRaw ? visibilityRaw.trim() : "";

  const statusSafe = status ? (isLiveStatus(status) ? (status as LiveStatus) : undefined) : undefined;
  if (status && !statusSafe) {
    return jsonError("Invalid status. Use: live|offline|starting|ended|error", 400);
  }

  const visibilitySafe = visibility
    ? isRoomVisibility(visibility)
      ? (visibility as RoomVisibility)
      : undefined
    : undefined;
  if (visibility && !visibilitySafe) {
    return jsonError("Invalid visibility. Use: public|unlisted|private", 400);
  }

  const rooms = await listRooms({
    limit,
    status: statusSafe,
    category: normalizeCategory(categoryRaw),
    visibility: visibilitySafe,
  });

  const body: ListRoomsResponse = { rooms };
  return NextResponse.json(body, { status: 200 });
}

/* ======================================================
   POST /api/live/rooms
   ====================================================== */

/**
 * POST /api/live/rooms
 * Body: CreateRoomRequest
 *
 * NOTE: This is a truth endpoint. In production you’ll likely
 * require auth here (seller session / API key).
 */
export async function POST(req: NextRequest) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const input = (json ?? {}) as Partial<CreateRoomRequest>;

  const title = typeof input.title === "string" ? input.title.trim() : "";
  if (!title) return jsonError("Missing required field: title", 400);
  if (title.length > 120) return jsonError("title is too long (max 120 chars)", 400);

  const seller = input.seller as any;
  const sellerId = typeof seller?.id === "string" ? seller.id.trim() : "";
  const sellerName = typeof seller?.name === "string" ? seller.name.trim() : "";

  if (!sellerId || !sellerName) {
    return jsonError("Missing required field: seller (id, name)", 400);
  }
  if (sellerName.length > 80) return jsonError("seller.name is too long (max 80 chars)", 400);

  // Optional fields (light validation)
  const category =
    typeof (input as any).category === "string"
      ? ((input as any).category.trim() as RoomCategory)
      : undefined;

  const visibilityVal = (input as any).visibility;
  if (visibilityVal != null && !isRoomVisibility(visibilityVal)) {
    return jsonError("Invalid visibility. Use: public|unlisted|private", 400);
  }

  const statusVal = (input as any).status;
  if (statusVal != null && !isLiveStatus(statusVal)) {
    return jsonError("Invalid status. Use: live|offline|starting|ended|error", 400);
  }

  const room = await createRoom({
    ...(input as CreateRoomRequest),
    title,
    seller: { ...(input as any).seller, id: sellerId, name: sellerName },
    ...(category ? { category } : {}),
  } as CreateRoomRequest);

  return NextResponse.json({ room }, { status: 201 });
}
