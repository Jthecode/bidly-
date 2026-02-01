// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Live Rooms Repo — Devnet-0                                     ┃
   ┃ File   : src/lib/live/rooms.ts                                         ┃
   ┃ Role   : CRUD + list/query helpers for Live Rooms                      ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                         ┃
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
 * Assumes Postgres schema:
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
 * This repo is server-only.
 */

/* ======================================================
   Helpers
   ====================================================== */

type LiveRoomRow = {
  id: unknown;
  title: unknown;
  description?: unknown;

  seller_id: unknown;
  seller_name: unknown;
  seller_handle?: unknown;
  seller_avatar_url?: unknown;
  seller_verified?: unknown;

  status?: unknown;
  visibility?: unknown;

  viewers?: unknown;
  category?: unknown;
  tags?: unknown;

  cover_url?: unknown;

  playback_hls_url?: unknown;
  playback_poster_url?: unknown;

  started_at?: unknown;
  ended_at?: unknown;
  last_heartbeat_at?: unknown;

  created_at?: unknown;
  updated_at?: unknown;
};

function isoNow() {
  return new Date().toISOString();
}

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : v == null ? fallback : String(v);
}

function asBool(v: unknown): boolean {
  return v === true || v === "true" || v === 1 || v === "1";
}

function asNumberOrUndef(v: unknown): number | undefined {
  if (v == null) return undefined;
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : undefined;
}

function asIsoOrUndef(v: unknown): string | undefined {
  if (v == null) return undefined;
  const s = asString(v, "");
  if (!s) return undefined;
  const t = Date.parse(s);
  return Number.isFinite(t) ? new Date(t).toISOString() : undefined;
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

function rowToRoom(row: LiveRoomRow): LiveRoom {
  const tags = row.tags;

  return {
    id: asString(row.id),
    title: asString(row.title),
    description: row.description == null ? undefined : asString(row.description),

    seller: {
      id: asString(row.seller_id),
      name: asString(row.seller_name),
      handle: row.seller_handle == null ? undefined : asString(row.seller_handle),
      avatarUrl: row.seller_avatar_url == null ? undefined : asString(row.seller_avatar_url),
      verified: asBool(row.seller_verified),
    },

    status: (asString(row.status, "offline") as LiveRoom["status"]) ?? "offline",
    visibility: (asString(row.visibility, "public") as RoomVisibility) ?? "public",

    viewers: asNumberOrUndef(row.viewers),
    category: row.category == null ? undefined : (asString(row.category) as RoomCategory),
    tags: Array.isArray(tags)
      ? (tags as string[]).map((t) => asString(t)).filter(Boolean)
      : undefined,

    coverUrl: row.cover_url == null ? undefined : asString(row.cover_url),

    playback: {
      hlsUrl: row.playback_hls_url == null ? undefined : asString(row.playback_hls_url),
      posterUrl: row.playback_poster_url == null ? undefined : asString(row.playback_poster_url),
    },

    startedAt: asIsoOrUndef(row.started_at),
    endedAt: asIsoOrUndef(row.ended_at),
    lastHeartbeatAt: asIsoOrUndef(row.last_heartbeat_at),

    createdAt: asIsoOrUndef(row.created_at),
    updatedAt: asIsoOrUndef(row.updated_at),
  };
}

function slugify(seed: string) {
  return seed
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function makeRoomId(seed: string) {
  const safe = slugify(seed);

  let suffix = "";
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const crypto = require("node:crypto") as typeof import("node:crypto");
    suffix = crypto.randomBytes(4).toString("hex");
  } catch {
    suffix = Date.now().toString(36).slice(-6);
  }

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
  const limit = Math.max(1, Math.min(100, Number(opts?.limit ?? 48) || 48));
  const status = opts?.status;
  const category = opts?.category;
  const visibility = opts?.visibility;

  const sql = db();

  if (status && category && visibility) {
    const rows = await sql.sql<LiveRoomRow>`
      select *
      from live_rooms
      where status = ${status} and category = ${category} and visibility = ${visibility}
      order by (status = 'live') desc, last_heartbeat_at desc nulls last, updated_at desc
      limit ${limit}
    `;
    return rows.map(rowToRoom);
  }

  if (status && category) {
    const rows = await sql.sql<LiveRoomRow>`
      select *
      from live_rooms
      where status = ${status} and category = ${category}
      order by (status = 'live') desc, last_heartbeat_at desc nulls last, updated_at desc
      limit ${limit}
    `;
    return rows.map(rowToRoom);
  }

  if (status && visibility) {
    const rows = await sql.sql<LiveRoomRow>`
      select *
      from live_rooms
      where status = ${status} and visibility = ${visibility}
      order by (status = 'live') desc, last_heartbeat_at desc nulls last, updated_at desc
      limit ${limit}
    `;
    return rows.map(rowToRoom);
  }

  if (category && visibility) {
    const rows = await sql.sql<LiveRoomRow>`
      select *
      from live_rooms
      where category = ${category} and visibility = ${visibility}
      order by (status = 'live') desc, last_heartbeat_at desc nulls last, updated_at desc
      limit ${limit}
    `;
    return rows.map(rowToRoom);
  }

  if (status) {
    const rows = await sql.sql<LiveRoomRow>`
      select *
      from live_rooms
      where status = ${status}
      order by (status = 'live') desc, last_heartbeat_at desc nulls last, updated_at desc
      limit ${limit}
    `;
    return rows.map(rowToRoom);
  }

  if (category) {
    const rows = await sql.sql<LiveRoomRow>`
      select *
      from live_rooms
      where category = ${category}
      order by (status = 'live') desc, last_heartbeat_at desc nulls last, updated_at desc
      limit ${limit}
    `;
    return rows.map(rowToRoom);
  }

  if (visibility) {
    const rows = await sql.sql<LiveRoomRow>`
      select *
      from live_rooms
      where visibility = ${visibility}
      order by (status = 'live') desc, last_heartbeat_at desc nulls last, updated_at desc
      limit ${limit}
    `;
    return rows.map(rowToRoom);
  }

  const rows = await sql.sql<LiveRoomRow>`
    select *
    from live_rooms
    order by (status = 'live') desc, last_heartbeat_at desc nulls last, updated_at desc
    limit ${limit}
  `;
  return rows.map(rowToRoom);
}

export async function getRoom(id: RoomId): Promise<LiveRoom | null> {
  const sql = db();
  const rows = await sql.sql<LiveRoomRow>`
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

  const ts = isoNow();

  const rows = await sql.sql<LiveRoomRow>`
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
      ${ts},
      ${ts}
    )
    returning *
  `;

  return rowToRoom(rows[0]);
}

export async function patchRoom(id: RoomId, patch: PatchRoomRequest): Promise<LiveRoom | null> {
  const sql = db();

  const existing = await getRoom(id);
  if (!existing) return null;

  const nextStatus = patch.status ?? existing.status;
  const nextVisibility = patch.visibility ?? existing.visibility;

  const ts = isoNow();
  const startedAt = nextStatus === "live" && !existing.startedAt ? ts : existing.startedAt ?? null;
  const endedAt = nextStatus === "ended" ? ts : existing.endedAt ?? null;

  const rows = await sql.sql<LiveRoomRow>`
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
      started_at = ${startedAt},
      ended_at = ${endedAt},
      updated_at = ${ts}
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

  const ts = isoNow();
  const startedAt = nextStatus === "live" && !existing.startedAt ? ts : existing.startedAt ?? null;

  const rows = await sql.sql<LiveRoomRow>`
    update live_rooms
    set
      status = ${nextStatus},
      viewers = ${input?.viewers ?? existing.viewers ?? null},
      last_heartbeat_at = ${ts},
      started_at = ${startedAt},
      updated_at = ${ts}
    where id = ${id}
    returning *
  `;

  return rows[0] ? rowToRoom(rows[0]) : null;
}
