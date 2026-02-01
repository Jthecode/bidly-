// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Database (Queries: Rooms) — Devnet-0                            ┃
   ┃ File   : src/lib/db/queries/rooms.ts                                    ┃
   ┃ Role   : Live rooms queries (CRUD + stream fields + heartbeat/viewers)  ┃
   ┃ Status : Devnet-0 Ready                                                 ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)        ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                         ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import "server-only";

import { dbQuery } from "@/lib/db";
import type { RoomRow } from "@/lib/db/schema";
import { nowIso, makeId } from "@/lib/db/schema";

/* =====================================================================
   Types
   ===================================================================== */

export type RoomStatus = RoomRow["status"];

export type CreateRoomInput = {
  sellerId: string;
  title: string;
  description?: string | null;
  coverImageUrl?: string | null;
  scheduledFor?: string | null; // ISO
};

export type UpdateRoomBasicsInput = {
  title?: string;
  description?: string | null;
  coverImageUrl?: string | null;
  scheduledFor?: string | null; // ISO
};

export type UpdateRoomStreamInput = {
  streamProvider: string | null;
  streamId: string | null;
  playbackId: string | null;
  ingestUrl: string | null;
  streamKey: string | null;
};

export type ListRoomsInput = {
  sellerId?: string;
  status?: RoomStatus;
  limit?: number;
};

/* =====================================================================
   Helpers
   ===================================================================== */

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

function rowSelectSql() {
  // Keep this consistent everywhere.
  return `
    id,
    seller_id AS "sellerId",

    title,
    description,
    status,
    cover_image_url AS "coverImageUrl",

    stream_provider AS "streamProvider",
    stream_id AS "streamId",
    playback_id AS "playbackId",
    ingest_url AS "ingestUrl",
    stream_key AS "streamKey",

    viewer_count AS "viewerCount",

    scheduled_for AS "scheduledFor",
    started_at AS "startedAt",
    ended_at AS "endedAt",

    heartbeat_at AS "heartbeatAt",

    created_at AS "createdAt",
    updated_at AS "updatedAt"
  `;
}

/* =====================================================================
   Queries
   ===================================================================== */

export async function getRoomById(roomId: string): Promise<RoomRow | null> {
  const rows = await dbQuery<RoomRow>(
    `
    SELECT ${rowSelectSql()}
    FROM rooms
    WHERE id = $1
    LIMIT 1
    `,
    [roomId]
  );
  return rows[0] ?? null;
}

export async function listRooms(input: ListRoomsInput = {}): Promise<RoomRow[]> {
  const limit = clamp(input.limit ?? 50, 1, 200);

  if (input.sellerId && input.status) {
    return dbQuery<RoomRow>(
      `
      SELECT ${rowSelectSql()}
      FROM rooms
      WHERE seller_id = $1
        AND status = $2
      ORDER BY updated_at DESC
      LIMIT $3
      `,
      [input.sellerId, input.status, limit]
    );
  }

  if (input.sellerId) {
    return dbQuery<RoomRow>(
      `
      SELECT ${rowSelectSql()}
      FROM rooms
      WHERE seller_id = $1
      ORDER BY updated_at DESC
      LIMIT $2
      `,
      [input.sellerId, limit]
    );
  }

  if (input.status) {
    return dbQuery<RoomRow>(
      `
      SELECT ${rowSelectSql()}
      FROM rooms
      WHERE status = $1
      ORDER BY updated_at DESC
      LIMIT $2
      `,
      [input.status, limit]
    );
  }

  return dbQuery<RoomRow>(
    `
    SELECT ${rowSelectSql()}
    FROM rooms
    ORDER BY updated_at DESC
    LIMIT $1
    `,
    [limit]
  );
}

export async function listLiveRooms(limit = 50): Promise<RoomRow[]> {
  return dbQuery<RoomRow>(
    `
    SELECT ${rowSelectSql()}
    FROM rooms
    WHERE status = 'live'
    ORDER BY viewer_count DESC, updated_at DESC
    LIMIT $1
    `,
    [clamp(limit, 1, 200)]
  );
}

export async function createRoom(input: CreateRoomInput): Promise<RoomRow> {
  const id = makeId("room");
  const createdAt = nowIso();
  const updatedAt = createdAt;

  const rows = await dbQuery<RoomRow>(
    `
    INSERT INTO rooms (
      id, seller_id, title, description, status, cover_image_url,
      scheduled_for, viewer_count,
      created_at, updated_at
    )
    VALUES (
      $1, $2, $3, $4, 'draft', $5,
      $6, 0,
      $7, $8
    )
    RETURNING ${rowSelectSql()}
    `,
    [
      id,
      input.sellerId,
      input.title,
      input.description ?? null,
      input.coverImageUrl ?? null,
      input.scheduledFor ?? null,
      createdAt,
      updatedAt,
    ]
  );

  if (!rows[0]) throw new Error("[db/rooms] createRoom: insert returned no rows");
  return rows[0];
}

export async function updateRoomBasics(roomId: string, patch: UpdateRoomBasicsInput) {
  const updatedAt = nowIso();

  const rows = await dbQuery<RoomRow>(
    `
    UPDATE rooms
    SET
      title = COALESCE($2, title),
      description = COALESCE($3, description),
      cover_image_url = COALESCE($4, cover_image_url),
      scheduled_for = COALESCE($5, scheduled_for),
      updated_at = $6
    WHERE id = $1
    RETURNING ${rowSelectSql()}
    `,
    [
      roomId,
      patch.title ?? null,
      patch.description ?? null,
      patch.coverImageUrl ?? null,
      patch.scheduledFor ?? null,
      updatedAt,
    ]
  );

  return rows[0] ?? null;
}

export async function setRoomStatus(roomId: string, status: RoomStatus) {
  const updatedAt = nowIso();

  // If going live, stamp started_at. If ending, stamp ended_at.
  const startedAt = status === "live" ? nowIso() : null;
  const endedAt = status === "ended" ? nowIso() : null;

  const rows = await dbQuery<RoomRow>(
    `
    UPDATE rooms
    SET
      status = $2,
      started_at = CASE WHEN $2 = 'live' THEN COALESCE(started_at, $3::timestamptz) ELSE started_at END,
      ended_at = CASE WHEN $2 = 'ended' THEN COALESCE(ended_at, $4::timestamptz) ELSE ended_at END,
      updated_at = $5
    WHERE id = $1
    RETURNING ${rowSelectSql()}
    `,
    [roomId, status, startedAt, endedAt, updatedAt]
  );

  return rows[0] ?? null;
}

/**
 * ✅ This is the missing export your /api/stream/create route expects.
 * Persists provider stream identifiers + server-only ingest secrets.
 */
export async function updateRoomStream(roomId: string, stream: UpdateRoomStreamInput) {
  const updatedAt = nowIso();

  const rows = await dbQuery<RoomRow>(
    `
    UPDATE rooms
    SET
      stream_provider = $2,
      stream_id = $3,
      playback_id = $4,
      ingest_url = $5,
      stream_key = $6,
      updated_at = $7
    WHERE id = $1
    RETURNING ${rowSelectSql()}
    `,
    [
      roomId,
      stream.streamProvider,
      stream.streamId,
      stream.playbackId,
      stream.ingestUrl,
      stream.streamKey,
      updatedAt,
    ]
  );

  return rows[0] ?? null;
}

export async function setViewerCount(roomId: string, viewerCount: number) {
  const updatedAt = nowIso();
  const rows = await dbQuery<RoomRow>(
    `
    UPDATE rooms
    SET viewer_count = $2,
        updated_at = $3
    WHERE id = $1
    RETURNING ${rowSelectSql()}
    `,
    [roomId, clamp(viewerCount, 0, 10_000_000), updatedAt]
  );
  return rows[0] ?? null;
}

export async function bumpHeartbeat(roomId: string) {
  const updatedAt = nowIso();
  const rows = await dbQuery<RoomRow>(
    `
    UPDATE rooms
    SET heartbeat_at = $2,
        updated_at = $3
    WHERE id = $1
    RETURNING ${rowSelectSql()}
    `,
    [roomId, updatedAt, updatedAt]
  );
  return rows[0] ?? null;
}
