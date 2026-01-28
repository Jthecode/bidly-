// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Live DB Wrapper (Neon) — Devnet-0                              ┃
   ┃ File   : src/lib/live/db.ts                                            ┃
   ┃ Role   : Neon-only SQL client (server-only, Vercel-friendly)           ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import "server-only";

import { neon } from "@neondatabase/serverless";

/**
 * Neon-only DB wrapper (Bidly)
 * ---------------------------------------------------------------------
 * Required env:
 *   BIDLY_DB_MODE="neon"
 *   DATABASE_URL="postgresql://USER:PASS@HOST/DB?sslmode=require"
 *
 * Install:
 *   pnpm add @neondatabase/serverless
 *
 * Notes:
 * - Keep this file server-only (service credentials).
 * - Neon `neon()` returns a safe, parameterized SQL template tag.
 * - All DB modules should import { db } and use db().sql`...`.
 */

export type DbMode = "neon";

export type SqlTag = <T = any>(
  strings: TemplateStringsArray,
  ...values: any[]
) => Promise<T[]>;

/* ======================================================
   Env helpers
   ====================================================== */

function env(name: string, required = true) {
  const v = process.env[name];
  if (!v && required) {
    throw new Error(
      `[Bidly DB] Missing environment variable: ${name}. ` +
        `Set it in .env.local (and Vercel env) before running.`
    );
  }
  return v ?? "";
}

function mode(): DbMode {
  // We keep the function for consistency with the rest of the repo,
  // but Bidly is Neon-only right now.
  const raw = (process.env.BIDLY_DB_MODE ?? "neon").toLowerCase();
  if (raw !== "neon") {
    throw new Error(
      `[Bidly DB] Unsupported BIDLY_DB_MODE="${raw}". ` +
        `Bidly is configured for Neon only. Set BIDLY_DB_MODE="neon".`
    );
  }
  return "neon";
}

/* ======================================================
   Neon client
   ====================================================== */

let _sql: SqlTag | null = null;

function sqlTag(): SqlTag {
  if (_sql) return _sql;

  // Validate env eagerly on first use.
  mode();
  const url = env("DATABASE_URL");

  _sql = neon(url) as unknown as SqlTag;
  return _sql;
}

/* ======================================================
   Public API
   ====================================================== */

export type Db = {
  mode: DbMode;
  /**
   * Execute SQL via Neon.
   * Usage:
   *   const rows = await db().sql<MyRow[]>`select * from table where id=${id}`;
   */
  sql<T = any>(strings: TemplateStringsArray, ...values: any[]): Promise<T[]>;
};

let _db: Db | null = null;

export function db(): Db {
  if (_db) return _db;

  const m = mode();

  _db = {
    mode: m,
    async sql<T = any>(strings: TemplateStringsArray, ...values: any[]) {
      const sql = sqlTag();
      return sql<T>(strings, ...values);
    },
  };

  return _db;
}

/* ======================================================
   Optional helpers
   ====================================================== */

/**
 * Returns true if DATABASE_URL is present (does not validate connectivity).
 * Useful for local dev to show friendly empty states.
 */
export function isDbConfigured() {
  return Boolean(process.env.DATABASE_URL);
}

/**
 * Lightweight runtime ping (optional).
 * Handy for a quick smoke check in an API route.
 */
export async function dbPing(): Promise<{ ok: boolean; mode: DbMode }> {
  try {
    await db().sql`select 1 as ok`;
    return { ok: true, mode: "neon" };
  } catch {
    return { ok: false, mode: "neon" };
  }
}
