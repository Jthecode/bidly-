// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Database (Queries) — Devnet-0                                  ┃
   ┃ File   : src/lib/db/queries/users.ts                                   ┃
   ┃ Role   : User queries (CRUD + lookups) with mode-safe dbQuery wrapper  ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import "server-only";

import { dbQuery } from "@/lib/db";
import type { UserRole, UserRow } from "@/lib/db/schema";
import { nowIso, makeId } from "@/lib/db/schema";

/* =====================================================================
   Types
   ===================================================================== */

export type CreateUserInput = {
  email: string;
  name: string;
  role?: UserRole;
  handle?: string;
  avatarUrl?: string;
  verified?: boolean;
};

export type UpdateUserInput = Partial<{
  email: string;
  name: string;
  role: UserRole;
  handle: string | null;
  avatarUrl: string | null;
  verified: boolean;
}>;

/* =====================================================================
   Queries
   ===================================================================== */

export async function getUserById(id: string): Promise<UserRow | null> {
  const rows = await dbQuery<UserRow>(
    `
    SELECT
      id, email, name, handle, avatar_url AS "avatarUrl", role, verified,
      created_at AS "createdAt", updated_at AS "updatedAt"
    FROM users
    WHERE id = $1
    LIMIT 1
    `,
    [id]
  );
  return rows[0] ?? null;
}

export async function getUserByEmail(email: string): Promise<UserRow | null> {
  const rows = await dbQuery<UserRow>(
    `
    SELECT
      id, email, name, handle, avatar_url AS "avatarUrl", role, verified,
      created_at AS "createdAt", updated_at AS "updatedAt"
    FROM users
    WHERE lower(email) = lower($1)
    LIMIT 1
    `,
    [email]
  );
  return rows[0] ?? null;
}

export async function listUsers(limit = 50): Promise<UserRow[]> {
  const rows = await dbQuery<UserRow>(
    `
    SELECT
      id, email, name, handle, avatar_url AS "avatarUrl", role, verified,
      created_at AS "createdAt", updated_at AS "updatedAt"
    FROM users
    ORDER BY created_at DESC
    LIMIT $1
    `,
    [Math.max(1, Math.min(200, limit))]
  );
  return rows;
}

export async function createUser(input: CreateUserInput): Promise<UserRow> {
  const id = makeId("usr");
  const createdAt = nowIso();
  const updatedAt = createdAt;

  const role: UserRole = input.role ?? "buyer";
  const verified = Boolean(input.verified ?? false);

  const rows = await dbQuery<UserRow>(
    `
    INSERT INTO users (
      id, email, name, handle, avatar_url, role, verified, created_at, updated_at
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9
    )
    RETURNING
      id, email, name, handle, avatar_url AS "avatarUrl", role, verified,
      created_at AS "createdAt", updated_at AS "updatedAt"
    `,
    [
      id,
      input.email,
      input.name,
      input.handle ?? null,
      input.avatarUrl ?? null,
      role,
      verified,
      createdAt,
      updatedAt,
    ]
  );

  if (!rows[0]) throw new Error("[db/users] createUser: insert returned no rows");
  return rows[0];
}

export async function updateUser(id: string, patch: UpdateUserInput): Promise<UserRow | null> {
  // Build a dynamic update that keeps SQL injection-safe parameterization.
  const sets: string[] = [];
  const params: any[] = [];
  let i = 1;

  const add = (col: string, val: any) => {
    sets.push(`${col} = $${i++}`);
    params.push(val);
  };

  if (patch.email !== undefined) add("email", patch.email);
  if (patch.name !== undefined) add("name", patch.name);
  if (patch.role !== undefined) add("role", patch.role);
  if (patch.handle !== undefined) add("handle", patch.handle);
  if (patch.avatarUrl !== undefined) add("avatar_url", patch.avatarUrl);
  if (patch.verified !== undefined) add("verified", patch.verified);

  // Always update updated_at
  add("updated_at", nowIso());

  if (sets.length === 0) return getUserById(id);

  params.push(id);

  const rows = await dbQuery<UserRow>(
    `
    UPDATE users
    SET ${sets.join(", ")}
    WHERE id = $${i}
    RETURNING
      id, email, name, handle, avatar_url AS "avatarUrl", role, verified,
      created_at AS "createdAt", updated_at AS "updatedAt"
    `,
    params
  );

  return rows[0] ?? null;
}

export async function deleteUser(id: string): Promise<{ ok: boolean }> {
  const rows = await dbQuery<{ count: number }>(
    `
    WITH deleted AS (
      DELETE FROM users
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

export function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}
