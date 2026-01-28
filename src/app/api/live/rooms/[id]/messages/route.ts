// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Live Messages API — Devnet-0                                   ┃
   ┃ File   : src/app/api/live/rooms/[id]/messages/route.ts                 ┃
   ┃ Role   : Room chat endpoints (GET list, POST message)                  ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import "server-only";

import { NextResponse } from "next/server";
import { getRoom } from "@/lib/live/rooms";
import { listMessages, postMessage } from "@/lib/live/messages";
import type {
  ListMessagesResponse,
  PostMessageRequest,
  PostMessageResponse,
  RoomId,
} from "@/lib/live/types";

type Ctx = { params: { id: string } };

function clampInt(n: number, min: number, max: number) {
  const v = Math.floor(n);
  if (!Number.isFinite(v)) return min;
  return Math.max(min, Math.min(max, v));
}

function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function GET(req: Request, ctx: Ctx) {
  const roomId = (ctx.params.id ?? "").trim() as RoomId;
  if (!roomId) {
    const body: ListMessagesResponse = { messages: [] };
    return NextResponse.json(body, { status: 400 });
  }

  const room = await getRoom(roomId);
  if (!room) {
    const body: ListMessagesResponse = { messages: [] };
    return NextResponse.json(body, { status: 404 });
  }

  const url = new URL(req.url);
  const limitParam = url.searchParams.get("limit");
  const limit = limitParam ? clampInt(Number(limitParam), 1, 200) : 50;

  const messages = await listMessages({ roomId, limit });

  const body: ListMessagesResponse = { messages };
  return NextResponse.json(body, { status: 200 });
}

export async function POST(req: Request, ctx: Ctx) {
  const roomId = (ctx.params.id ?? "").trim() as RoomId;
  if (!roomId) return jsonError("Missing room id", 400);

  const room = await getRoom(roomId);
  if (!room) return jsonError("Room not found", 404);

  let json: unknown;
  try {
    json = await req.json();
  } catch {
    return jsonError("Invalid JSON body", 400);
  }

  const input = (json ?? {}) as Partial<PostMessageRequest>;

  const text = (input.text ?? "").trim();
  if (!text) return jsonError("Message text is required", 400);
  if (text.length > 500) return jsonError("Message too long (max 500 chars)", 400);

  const message = await postMessage(roomId, {
    text,
    author: input.author,
  });

  const body: PostMessageResponse = { message };
  return NextResponse.json(body, { status: 201 });
}
