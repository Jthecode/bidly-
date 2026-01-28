// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Live Rooms Repo — Devnet-0                                     ┃
   ┃ File   : src/lib/live/rooms.ts                                         ┃
   ┃ Role   : CRUD + list/query helpers for Live Rooms                      ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import "server-only";

import { db } from "@/lib/live/db";
import type {
  CreateRoomRequest,
  LiveRoom,
  LiveSeller,
  PatchRoomRequest,
  RoomCategory,
  RoomId,
  RoomVisibility,
} from "@/lib/live/types";

/* ======================================================
   Notes
   ====================================================== */
/**
 * This module assumes a Postgres schema like:
 *
 * Table: live_rooms
 * - id (text primary key)
 * - title (text not null)
 * - description (text)
 * - seller_id (text not null)
 * - seller_name (text not null)
 * - seller_handle (text)
 * - seller_avatar_url (text)
 * - seller_verified (bool not null default false)
 * - status (text not null)             // live/offline/starting/ended/error
 * - visibility (text not null)         // public/unlisted/private
 * - viewers (int)
 * - category (text)
 * - tags (text[])                      // optional
 * - cover_url (text)
 * - playback_hls_url (text)
 * - playback_poster_url (text)
 * - started_at (timestamptz)
 * - ended_at (timestamptz)
 * - last_heartbeat_at (timestamptz)
 * - created_at (timestamptz not null default now())
 * - updated_at (timestamptz not null default now())
 *
 * We keep this repo purely server-side.
 */

/* ======================================================
   Helpers
   ====================================================== */

function nowIso() {
  return new Date().toISOString();
}

function normalizeSeller(input: CreateRoomRequest["seller"]): LiveSeller {
  return {
    id: input.id,
    name: input.name,
    handle: input.handle,
    avatarUrl: input.avatarUrl,
    verified: input.verified ?? false,
  };
}

function rowToRoom(row: any): LiveRoom {
  return {
    id: String(row.id),
    title: String(row.title),
    description: row.description ?? undefined,

    seller: {
      id: String(row.seller_id),
      name: String(row.seller_name),
      handle: row.seller_handle ?? undefined,
      avatarUrl: row.seller_avatar_url ?? undefined,
      verified: Boolean(row.seller_verified),
    },

    status: (row.status ?? "offline") as LiveRoom["status"],
    visibility: (row.visibility ?? "public") as RoomVisibility,

    viewers: row.viewers == null ? undefined : Number(row.viewers),
    category: (row.category ?? undefined) as RoomCategory | undefined,
    tags: Array.isArray(row.tags) ? (row.tags as string[]) : undefined,

    coverUrl: row.cover_url ?? undefined,

    playback: {
      hlsUrl: row.playback_hls_url ?? undefined,
      posterUrl: row.playback_poster_url ?? undefined,
    },

    startedAt: row.started_at ? new Date(row.started_at).toISOString() : undefined,
    endedAt: row.ended_at ? new Date(row.ended_at).toISOString() : undefined,
    lastHeartbeatAt: row.last_heartbeat_at
      ? new Date(row.last_heartbeat_at).toISOString()
      : undefined,

    createdAt: row.created_at ? new Date(row.created_at).toISOString() : undefined,
    updatedAt: row.updated_at ? new Date(row.updated_at).toISOString() : undefined,
  };
}

function makeRoomId(seed: string) {
  // deterministic-ish, URL-safe. Replace with UUID if preferred.
  const safe = seed
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const suffix = Date.now().toString(36).slice(-6);
  return `${safe || "room"}-${suffix}`;
}

/* ======================================================
   Public Repo API (Neon SQL path)
   ====================================================== */

export async function listRooms(opts?: {
  limit?: number;
  status?: LiveRoom["status"];
  category?: RoomCategory;
  visibility?: RoomVisibility;
}) {
  const limit = Math.max(1, Math.min(100, opts?.limit ?? 48));

  // Server-side filtering is intentionally conservative for now.
  // You can expand this into dynamic SQL safely later.
  const status = opts?.status;
  const category = opts?.category;
  const visibility = opts?.visibility;

  const where: string[] = [];
  const args: any[] = [];

  // NOTE: Neon template tag handles parameterization safely when values are interpolated.
  // We'll build conditions with fixed SQL fragments and push values through interpolation.

  // Because we’re using template literals, we can’t dynamically splice in values safely
  // without a SQL builder. We'll keep to a few common paths.

  const sql = db();

  if (status && category && visibility) {
    const rows = await sql.sql<any[]>`
      select *
      from live_rooms
      where status = ${status} and category = ${category} and visibility = ${visibility}
      order by (status = 'live') desc, last_heartbeat_at desc nulls last, updated_at desc
      limit ${limit}
    `;
    return rows.map(rowToRoom);
  }

  if (status && category) {
    const rows = await sql.sql<any[]>`
      select *
      from live_rooms
      where status = ${status} and category = ${category}
      order by (status = 'live') desc, last_heartbeat_at desc nulls last, updated_at desc
      limit ${limit}
    `;
    return rows.map(rowToRoom);
  }

  if (status && visibility) {
    const rows = await sql.sql<any[]>`
      select *
      from live_rooms
      where status = ${status} and visibility = ${visibility}
      order by (status = 'live') desc, last_heartbeat_at desc nulls last, updated_at desc
      limit ${limit}
    `;
    return rows.map(rowToRoom);
  }

  if (status) {
    const rows = await sql.sql<any[]>`
      select *
      from live_rooms
      where status = ${status}
      order by (status = 'live') desc, last_heartbeat_at desc nulls last, updated_at desc
      limit ${limit}
    `;
    return rows.map(rowToRoom);
  }

  if (visibility) {
    const rows = await sql.sql<any[]>`
      select *
      from live_rooms
      where visibility = ${visibility}
      order by (status = 'live') desc, last_heartbeat_at desc nulls last, updated_at desc
      limit ${limit}
    `;
    return rows.map(rowToRoom);
  }

  // default: show live-first, most recently active
  const rows = await sql.sql<any[]>`
    select *
    from live_rooms
    order by (status = 'live') desc, last_heartbeat_at desc nulls last, updated_at desc
    limit ${limit}
  `;
  return rows.map(rowToRoom);
}

export async function getRoom(id: RoomId): Promise<LiveRoom | null> {
  const sql = db();
  const rows = await sql.sql<any[]>`
    select *
    from live_rooms
    where id = ${id}
    limit 1
  `;
  const row = rows[0];
  return row ? rowToRoom(row) : null;
}

export async function createRoom(input: CreateRoomRequest): Promise<LiveRoom> {
  const sql = db();

  const seller = normalizeSeller(input.seller);
  const id = makeRoomId(`${seller.handle ?? seller.name}-${input.title}`);

  const visibility: RoomVisibility = input.visibility ?? "public";
  const status: LiveRoom["status"] = "starting";

  const createdAt = nowIso();
  const updatedAt = createdAt;

  const rows = await sql.sql<any[]>`
    insert into live_rooms (
      id,
      title,
      description,
      seller_id,
      seller_name,
      seller_handle,
      seller_avatar_url,
      seller_verified,
      status,
      visibility,
      category,
      tags,
      cover_url,
      created_at,
      updated_at
    )
    values (
      ${id},
      ${input.title},
      ${input.description ?? null},
      ${seller.id},
      ${seller.name},
      ${seller.handle ?? null},
      ${seller.avatarUrl ?? null},
      ${seller.verified ?? false},
      ${status},
      ${visibility},
      ${input.category ?? null},
      ${input.tags ?? null},
      ${input.coverUrl ?? null},
      ${createdAt},
      ${updatedAt}
    )
    returning *
  `;

  return rowToRoom(rows[0]);
}

export async function patchRoom(id: RoomId, patch: PatchRoomRequest): Promise<LiveRoom | null> {
  const sql = db();

  // Fetch existing first; keeps patch logic simple and safe.
  const existing = await getRoom(id);
  if (!existing) return null;

  const nextStatus = patch.status ?? existing.status;
  const nextVisibility = patch.visibility ?? existing.visibility;

  const rows = await sql.sql<any[]>`
    update live_rooms
    set
      title = ${patch.title ?? existing.title},
      description = ${patch.description ?? existing.description ?? null},
      status = ${nextStatus},
      visibility = ${nextVisibility},
      viewers = ${patch.viewers ?? existing.viewers ?? null},
      category = ${patch.category ?? existing.category ?? null},
      tags = ${patch.tags ?? existing.tags ?? null},
      cover_url = ${patch.coverUrl ?? existing.coverUrl ?? null},
      playback_hls_url = ${patch.playback?.hlsUrl ?? existing.playback?.hlsUrl ?? null},
      playback_poster_url = ${patch.playback?.posterUrl ?? existing.playback?.posterUrl ?? null},
      started_at = ${
        // If we are transitioning into live and there was no startedAt, set it.
        nextStatus === "live" && !existing.startedAt
          ? nowIso()
          : existing.startedAt ?? null
      },
      ended_at = ${
        // If we ended, set endedAt.
        nextStatus === "ended" ? nowIso() : existing.endedAt ?? null
      },
      updated_at = ${nowIso()}
    where id = ${id}
    returning *
  `;

  return rows[0] ? rowToRoom(rows[0]) : null;
}

export async function heartbeatRoom(
  id: RoomId,
  input?: { status?: LiveRoom["status"]; viewers?: number }
): Promise<LiveRoom | null> {
  const sql = db();

  const existing = await getRoom(id);
  if (!existing) return null;

  const nextStatus = input?.status ?? existing.status;

  const rows = await sql.sql<any[]>`
    update live_rooms
    set
      status = ${nextStatus},
      viewers = ${input?.viewers ?? existing.viewers ?? null},
      last_heartbeat_at = ${nowIso()},
      started_at = ${
        nextStatus === "live" && !existing.startedAt ? nowIso() : existing.startedAt ?? null
      },
      updated_at = ${nowIso()}
    where id = ${id}
    returning *
  `;

  return rows[0] ? rowToRoom(rows[0]) : null;
}
