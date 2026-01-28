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
import { createRoom, listRooms } from "@/lib/live/rooms";
import type { CreateRoomRequest, ListRoomsResponse, RoomCategory, LiveStatus, RoomVisibility } from "@/lib/live/types";

/**
 * GET /api/live/rooms
 * Query params:
 * - limit (1..100)
 * - status (live|offline|starting|ended|error)
 * - category (see RoomCategory)
 * - visibility (public|unlisted|private)
 */
export async function GET(req: Request) {
  const url = new URL(req.url);

  const limitRaw = url.searchParams.get("limit");
  const statusRaw = url.searchParams.get("status") as LiveStatus | null;
  const categoryRaw = url.searchParams.get("category") as RoomCategory | null;
  const visibilityRaw = url.searchParams.get("visibility") as RoomVisibility | null;

  const limit = limitRaw ? Math.max(1, Math.min(100, Number(limitRaw))) : undefined;

  const rooms = await listRooms({
    limit,
    status: statusRaw ?? undefined,
    category: categoryRaw ?? undefined,
    visibility: visibilityRaw ?? undefined,
  });

  const body: ListRoomsResponse = { rooms };
  return NextResponse.json(body, { status: 200 });
}

/**
 * POST /api/live/rooms
 * Body: CreateRoomRequest
 *
 * NOTE: This is a truth endpoint. In production you’ll likely
 * require auth here (seller session / API key).
 */
export async function POST(req: Request) {
  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const input = json as Partial<CreateRoomRequest>;

  if (!input?.title || typeof input.title !== "string") {
    return NextResponse.json({ error: "Missing required field: title" }, { status: 400 });
  }
  if (!input?.seller?.id || !input?.seller?.name) {
    return NextResponse.json(
      { error: "Missing required field: seller (id, name)" },
      { status: 400 }
    );
  }

  const room = await createRoom(input as CreateRoomRequest);

  return NextResponse.json({ room }, { status: 201 });
}
