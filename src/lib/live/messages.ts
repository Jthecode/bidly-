// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Live Messages Repo — Devnet-0                                  ┃
   ┃ File   : src/lib/live/messages.ts                                      ┃
   ┃ Role   : Chat persistence helpers (list + post)                        ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        
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
 * Assumes Postgres schema:
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

type LiveMessageRow = {
  id: unknown;
  room_id: unknown;
  kind?: unknown;

  author_id?: unknown;
  author_name?: unknown;
  author_handle?: unknown;
  author_avatar_url?: unknown;
  author_verified?: unknown;

  text?: unknown;
  created_at?: unknown;
};

function nowIso() {
  return new Date().toISOString();
}

function clampInt(n: number, min: number, max: number) {
  const v = Math.floor(n);
  if (!Number.isFinite(v)) return min;
  return Math.max(min, Math.min(max, v));
}

function asString(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : v == null ? fallback : String(v);
}

function asBool(v: unknown): boolean {
  return v === true || v === "true" || v === 1 || v === "1";
}

function rowToMessage(row: LiveMessageRow): LiveChatMessage {
  const authorId = row.author_id == null ? null : asString(row.author_id);
  const authorName = row.author_name == null ? "" : asString(row.author_name);

  const hasAuthor = Boolean(authorId || authorName);

  return {
    id: asString(row.id) as MessageId,
    roomId: asString(row.room_id) as RoomId,
    kind: (asString(row.kind, "user") as ChatMessageKind) ?? "user",
    author: hasAuthor
      ? {
          id: (authorId ?? ("anon" as UserId)) as UserId,
          name: (authorName || "Anonymous").trim() || "Anonymous",
          handle: row.author_handle == null ? undefined : asString(row.author_handle),
          avatarUrl: row.author_avatar_url == null ? undefined : asString(row.author_avatar_url),
          verified: asBool(row.author_verified),
        }
      : undefined,
    text: asString(row.text),
    createdAt: row.created_at ? new Date(asString(row.created_at)).toISOString() : nowIso(),
  };
}

/**
 * Collision-safe message id (server-only):
 * - deterministic-ish slug prefix
 * - plus crypto random suffix (fallback to time if crypto unavailable)
 */
function makeMessageId(seed: string): MessageId {
  const safe = seed
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);

  let suffix = "";
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const crypto = require("node:crypto") as typeof import("node:crypto");
    suffix = crypto.randomBytes(6).toString("hex");
  } catch {
    suffix = `${Date.now().toString(36)}-${Math.floor(Date.now() / 7).toString(36)}`;
  }

  return `${safe || "msg"}-${suffix}` as MessageId;
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

  // IMPORTANT: Neon generic is the ROW type, not ROW[].
  const rows = beforeIso
    ? await sql.sql<LiveMessageRow>`
        select *
        from live_messages
        where room_id = ${opts.roomId}
          and created_at < ${beforeIso}
        order by created_at desc
        limit ${limit}
      `
    : await sql.sql<LiveMessageRow>`
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
  const authorId = (author?.id ?? ("anon" as UserId)) as UserId;
  const authorName = (author?.name ?? "Anonymous").trim() || "Anonymous";

  const text = (input.text ?? "").trim();
  if (!text) {
    // Keep invariant tight for DB integrity.
    throw new Error("[Bidly live/messages] Cannot post empty message.");
  }

  const id = makeMessageId(`${roomId}-${authorId}-${authorName}`);

  // IMPORTANT: Neon generic is the ROW type, not ROW[].
  const rows = await sql.sql<LiveMessageRow>`
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
