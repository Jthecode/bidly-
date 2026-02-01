// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Database (Queries) — Devnet-0                                  ┃
   ┃ File   : src/lib/db/queries/messages.ts                                ┃
   ┃ Role   : Chat message queries (CRUD + room feed) for live rooms        ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import "server-only";

import { dbQuery } from "@/lib/db";
import type { MessageRow } from "@/lib/db/schema";
import { nowIso, makeId } from "@/lib/db/schema";

/* =====================================================================
   Types
   ===================================================================== */

export type CreateMessageInput = {
  roomId: string;
  text: string;
  kind?: MessageRow["kind"];
  authorUserId?: string | null;
};

export type ListMessagesInput = {
  roomId: string;
  limit?: number; // default 50
  before?: string; // ISO date string cursor (createdAt)
};

/* =====================================================================
   Queries
   ===================================================================== */

export async function getMessageById(id: string): Promise<MessageRow | null> {
  const rows = await dbQuery<MessageRow>(
    `
    SELECT
      id,
      room_id AS "roomId",
      author_user_id AS "authorUserId",
      kind,
      text,
      created_at AS "createdAt"
    FROM messages
    WHERE id = $1
    LIMIT 1
    `,
    [id]
  );
  return rows[0] ?? null;
}

export async function listMessages(input: ListMessagesInput): Promise<MessageRow[]> {
  const limit = Math.max(1, Math.min(200, input.limit ?? 50));

  // Cursor pagination: if before is provided, return older messages.
  const rows = await dbQuery<MessageRow>(
    input.before
      ? `
        SELECT
          id,
          room_id AS "roomId",
          author_user_id AS "authorUserId",
          kind,
          text,
          created_at AS "createdAt"
        FROM messages
        WHERE room_id = $1
          AND created_at < $2
        ORDER BY created_at DESC
        LIMIT $3
        `
      : `
        SELECT
          id,
          room_id AS "roomId",
          author_user_id AS "authorUserId",
          kind,
          text,
          created_at AS "createdAt"
        FROM messages
        WHERE room_id = $1
        ORDER BY created_at DESC
        LIMIT $2
        `,
    input.before ? [input.roomId, input.before, limit] : [input.roomId, limit]
  );

  // We return DESC for efficient "latest first" feeds.
  // UI can reverse for chronological display if desired.
  return rows;
}

export async function createMessage(input: CreateMessageInput): Promise<MessageRow> {
  const id = makeId("msg");
  const createdAt = nowIso();

  const kind: MessageRow["kind"] = input.kind ?? "user";

  const rows = await dbQuery<MessageRow>(
    `
    INSERT INTO messages (
      id, room_id, author_user_id, kind, text, created_at
    )
    VALUES (
      $1, $2, $3, $4, $5, $6
    )
    RETURNING
      id,
      room_id AS "roomId",
      author_user_id AS "authorUserId",
      kind,
      text,
      created_at AS "createdAt"
    `,
    [
      id,
      input.roomId,
      input.authorUserId ?? null,
      kind,
      input.text,
      createdAt,
    ]
  );

  if (!rows[0]) throw new Error("[db/messages] createMessage: insert returned no rows");
  return rows[0];
}

export async function deleteMessage(id: string): Promise<{ ok: boolean }> {
  const rows = await dbQuery<{ count: number }>(
    `
    WITH deleted AS (
      DELETE FROM messages
      WHERE id = $1
      RETURNING id
    )
    SELECT count(*)::int AS count FROM deleted
    `,
    [id]
  );

  return { ok: (rows[0]?.count ?? 0) > 0 };
}

/* =====================================================================
   Utilities
   ===================================================================== */

export function sanitizeMessageText(text: string) {
  return text.trim().slice(0, 2000);
}
