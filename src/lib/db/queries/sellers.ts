// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Database (Queries) — Devnet-0                                  ┃
   ┃ File   : src/lib/db/queries/sellers.ts                                 ┃
   ┃ Role   : Seller queries (CRUD + lookups) with mode-safe dbQuery wrapper┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import "server-only";

import { dbQuery } from "@/lib/db";
import type { SellerRow } from "@/lib/db/schema";
import { nowIso, makeId } from "@/lib/db/schema";

/* =====================================================================
   Types
   ===================================================================== */

export type CreateSellerInput = {
  userId: string;
  displayName: string;
  bio?: string;
  rating?: number;
  salesCount?: number;
};

export type UpdateSellerInput = Partial<{
  displayName: string;
  bio: string | null;
  rating: number | null;
  salesCount: number | null;
}>;

/* =====================================================================
   Queries
   ===================================================================== */

export async function getSellerById(id: string): Promise<SellerRow | null> {
  const rows = await dbQuery<SellerRow>(
    `
    SELECT
      id, user_id AS "userId", display_name AS "displayName",
      bio, rating, sales_count AS "salesCount",
      created_at AS "createdAt", updated_at AS "updatedAt"
    FROM sellers
    WHERE id = $1
    LIMIT 1
    `,
    [id]
  );
  return rows[0] ?? null;
}

export async function getSellerByUserId(userId: string): Promise<SellerRow | null> {
  const rows = await dbQuery<SellerRow>(
    `
    SELECT
      id, user_id AS "userId", display_name AS "displayName",
      bio, rating, sales_count AS "salesCount",
      created_at AS "createdAt", updated_at AS "updatedAt"
    FROM sellers
    WHERE user_id = $1
    LIMIT 1
    `,
    [userId]
  );
  return rows[0] ?? null;
}

export async function listSellers(limit = 50): Promise<SellerRow[]> {
  const rows = await dbQuery<SellerRow>(
    `
    SELECT
      id, user_id AS "userId", display_name AS "displayName",
      bio, rating, sales_count AS "salesCount",
      created_at AS "createdAt", updated_at AS "updatedAt"
    FROM sellers
    ORDER BY created_at DESC
    LIMIT $1
    `,
    [Math.max(1, Math.min(200, limit))]
  );
  return rows;
}

export async function createSeller(input: CreateSellerInput): Promise<SellerRow> {
  const id = makeId("sel");
  const createdAt = nowIso();
  const updatedAt = createdAt;

  const rows = await dbQuery<SellerRow>(
    `
    INSERT INTO sellers (
      id, user_id, display_name, bio, rating, sales_count, created_at, updated_at
    )
    VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8
    )
    RETURNING
      id, user_id AS "userId", display_name AS "displayName",
      bio, rating, sales_count AS "salesCount",
      created_at AS "createdAt", updated_at AS "updatedAt"
    `,
    [
      id,
      input.userId,
      input.displayName,
      input.bio ?? null,
      input.rating ?? null,
      input.salesCount ?? null,
      createdAt,
      updatedAt,
    ]
  );

  if (!rows[0]) throw new Error("[db/sellers] createSeller: insert returned no rows");
  return rows[0];
}

export async function updateSeller(id: string, patch: UpdateSellerInput): Promise<SellerRow | null> {
  const sets: string[] = [];
  const params: any[] = [];
  let i = 1;

  const add = (col: string, val: any) => {
    sets.push(`${col} = $${i++}`);
    params.push(val);
  };

  if (patch.displayName !== undefined) add("display_name", patch.displayName);
  if (patch.bio !== undefined) add("bio", patch.bio);
  if (patch.rating !== undefined) add("rating", patch.rating);
  if (patch.salesCount !== undefined) add("sales_count", patch.salesCount);

  add("updated_at", nowIso());

  if (sets.length === 0) return getSellerById(id);

  params.push(id);

  const rows = await dbQuery<SellerRow>(
    `
    UPDATE sellers
    SET ${sets.join(", ")}
    WHERE id = $${i}
    RETURNING
      id, user_id AS "userId", display_name AS "displayName",
      bio, rating, sales_count AS "salesCount",
      created_at AS "createdAt", updated_at AS "updatedAt"
    `,
    params
  );

  return rows[0] ?? null;
}

export async function deleteSeller(id: string): Promise<{ ok: boolean }> {
  const rows = await dbQuery<{ count: number }>(
    `
    WITH deleted AS (
      DELETE FROM sellers
      WHERE id = $1
      RETURNING id
    )
    SELECT count(*)::int AS count FROM deleted
    `,
    [id]
  );

  return { ok: (rows[0]?.count ?? 0) > 0 };
}
