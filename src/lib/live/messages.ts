// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Live Messages Repo — Devnet-0                                  ┃
   ┃ File   : src/lib/live/messages.ts                                      ┃
   ┃ Role   : Chat persistence helpers (list + post)                        ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import "server-only";

import { db } from "@/lib/live/db";
import type {
  ChatMessageKind,
  LiveChatMessage,
  MessageId,
  PostMessageRequest,
  RoomId,
  UserId,
} from "@/lib/live/types";
import { normalizeBeforeIso } from "@/lib/live/types";

/* ======================================================
   Notes
   ====================================================== */
/**
 * This module assumes a Postgres schema like:
 *
 * Table: live_messages
 * - id (text primary key)
 * - room_id (text not null)
 * - kind (text not null)             // user/system/event
 * - author_id (text)
 * - author_name (text)
 * - author_handle (text)
 * - author_avatar_url (text)
 * - author_verified (bool not null default false)
 * - text (text not null)
 * - created_at (timestamptz not null default now())
 *
 * Indexes (recommended):
 * - index on (room_id, created_at desc)
 */

/* ======================================================
   Helpers
   ====================================================== */

function nowIso() {
  return new Date().toISOString();
}

function clampInt(n: number, min: number, max: number) {
  const v = Math.floor(n);
  if (!Number.isFinite(v)) return min;
  return Math.max(min, Math.min(max, v));
}

/**
 * Collision-safe message id:
 * - deterministic prefix from seed
 * - plus time + short random (server-only)
 */
function makeMessageId(seed: string): MessageId {
  const safe = seed
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);

  const t = Date.now().toString(36);
  const r = Math.random().toString(36).slice(2, 10); // server-only; OK
  return `${safe || "msg"}-${t}-${r}` as MessageId;
}

function rowToMessage(row: any): LiveChatMessage {
  const hasAuthor = Boolean(row?.author_id || row?.author_name);

  return {
    id: String(row.id) as MessageId,
    roomId: String(row.room_id) as RoomId,
    kind: (row.kind ?? "user") as ChatMessageKind,
    author: hasAuthor
      ? {
          id: String(row.author_id ?? ("anon" as UserId)) as UserId,
          name: String(row.author_name ?? "Anonymous"),
          handle: row.author_handle ?? undefined,
          avatarUrl: row.author_avatar_url ?? undefined,
          verified: Boolean(row.author_verified),
        }
      : undefined,
    text: String(row.text ?? ""),
    createdAt: row.created_at ? new Date(row.created_at).toISOString() : nowIso(),
  };
}

/* ======================================================
   Public Repo API
   ====================================================== */

export async function listMessages(opts: {
  roomId: RoomId;
  limit?: number;
  /**
   * ISO8601; returns messages strictly older than this timestamp.
   * Used for pagination / infinite scroll.
   */
  before?: string;
}): Promise<LiveChatMessage[]> {
  const sql = db();
  const limit = clampInt(opts.limit ?? 60, 1, 200);

  const beforeIso = normalizeBeforeIso(opts.before);

  // If beforeIso is provided, filter: created_at < beforeIso
  const rows = beforeIso
    ? await sql.sql<any[]>`
        select *
        from live_messages
        where room_id = ${opts.roomId}
          and created_at < ${beforeIso}
        order by created_at desc
        limit ${limit}
      `
    : await sql.sql<any[]>`
        select *
        from live_messages
        where room_id = ${opts.roomId}
        order by created_at desc
        limit ${limit}
      `;

  // return oldest → newest for UI
  return rows.map(rowToMessage).reverse();
}

export async function postMessage(
  roomId: RoomId,
  input: PostMessageRequest,
  opts?: { kind?: ChatMessageKind }
): Promise<LiveChatMessage> {
  const sql = db();

  const kind: ChatMessageKind = opts?.kind ?? "user";

  const author = input.author;
  const authorId = author?.id ?? ("anon" as UserId);
  const authorName = (author?.name ?? "Anonymous").trim() || "Anonymous";

  const id = makeMessageId(`${roomId}-${authorId}-${authorName}`);

  const text = (input.text ?? "").trim();
  if (!text) {
    // Keep invariant tight for DB integrity.
    throw new Error("[Bidly live/messages] Cannot post empty message.");
  }

  const rows = await sql.sql<any[]>`
    insert into live_messages (
      id,
      room_id,
      kind,
      author_id,
      author_name,
      author_handle,
      author_avatar_url,
      author_verified,
      text,
      created_at
    )
    values (
      ${id},
      ${roomId},
      ${kind},
      ${author?.id ?? null},
      ${authorName},
      ${author?.handle ?? null},
      ${author?.avatarUrl ?? null},
      ${author?.verified ?? false},
      ${text},
      ${nowIso()}
    )
    returning *
  `;

  const row = rows?.[0];
  if (!row) {
    throw new Error("[Bidly live/messages] Insert failed (no row returned).");
  }

  return rowToMessage(row);
}

/**
 * Convenience for system/event messages.
 */
export async function postSystemMessage(roomId: RoomId, text: string) {
  return postMessage(roomId, { text }, { kind: "system" });
}

export async function postEventMessage(roomId: RoomId, text: string) {
  return postMessage(roomId, { text }, { kind: "event" });
}
