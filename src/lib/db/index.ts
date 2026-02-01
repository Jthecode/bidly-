// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Database (Core) — Devnet-0                                     ┃
   ┃ File   : src/lib/db/index.ts                                           ┃
   ┃ Role   : DB entrypoint (mode-aware) + safe query wrapper               ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import "server-only";

export type DbMode = "neon-http" | "node-postgres" | "mock";

/**
 * BIDLY_DB_MODE controls which driver we use.
 * - neon-http:    Neon serverless (HTTP) driver (best for Vercel edge-like envs)
 * - node-postgres: pg Pool (best for long-lived servers / local dev)
 * - mock:         in-memory mock for tests/dev
 */
const DEFAULT_MODE: DbMode = "neon-http";

function env(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`[DB] Missing required environment variable: ${name}`);
  return v;
}

function optionalEnv(name: string) {
  const v = process.env[name];
  return v && v.trim().length ? v : undefined;
}

function getMode(): DbMode {
  const raw = (optionalEnv("BIDLY_DB_MODE") ?? DEFAULT_MODE).toLowerCase();
  if (raw === "neon-http") return "neon-http";
  if (raw === "node-postgres") return "node-postgres";
  if (raw === "mock") return "mock";
  throw new Error(`[DB] Invalid BIDLY_DB_MODE: ${raw}`);
}

/* =====================================================================
   Driver: Neon serverless HTTP
   ===================================================================== */

type NeonSql = (strings: TemplateStringsArray, ...values: any[]) => Promise<any>;

async function makeNeon() {
  const { neon } = await import("@neondatabase/serverless");
  const url = env("DATABASE_URL");
  const sql = neon(url);
  return {
    mode: "neon-http" as const,
    sql: sql as NeonSql,
    close: async () => {},
  };
}

/* =====================================================================
   Driver: node-postgres
   ===================================================================== */

type PgPool = {
  query: (text: string, params?: any[]) => Promise<{ rows: any[] }>;
  end: () => Promise<void>;
};

async function makeNodePg() {
  const { Pool } = await import("pg");
  const connectionString = env("DATABASE_URL");
  const pool = new Pool({ connectionString }) as unknown as PgPool;

  return {
    mode: "node-postgres" as const,
    pool,
    close: async () => {
      await pool.end();
    },
  };
}

/* =====================================================================
   Driver: mock
   ===================================================================== */

type MockDb = {
  mode: "mock";
  // This can be expanded into real in-memory tables later.
  close: () => Promise<void>;
};

async function makeMock(): Promise<MockDb> {
  return {
    mode: "mock",
    close: async () => {},
  };
}

/* =====================================================================
   Public API
   ===================================================================== */

export type DbClient =
  | Awaited<ReturnType<typeof makeNeon>>
  | Awaited<ReturnType<typeof makeNodePg>>
  | Awaited<ReturnType<typeof makeMock>>;

let _db: DbClient | null = null;

/**
 * getDb() returns a singleton per server runtime.
 * This keeps things stable across hot reloads (dev) and reduces overhead.
 */
export async function getDb(): Promise<DbClient> {
  if (_db) return _db;

  const mode = getMode();
  if (mode === "neon-http") _db = await makeNeon();
  else if (mode === "node-postgres") _db = await makeNodePg();
  else _db = await makeMock();

  return _db;
}

/**
 * Convenience query helper that normalizes results to `rows: T[]`
 * across Neon HTTP and node-postgres.
 *
 * IMPORTANT: This is the boundary that prevents "nested rows" bugs.
 * Anything that queries the DB should go through this function.
 */
export async function dbQuery<T = any>(text: string, params: any[] = []): Promise<T[]> {
  const db = await getDb();

  if (db.mode === "neon-http") {
    // Neon SQL template tags are safer than string concatenation.
    // But our queries/*.ts layer may prefer raw SQL strings.
    // We'll support raw text by converting to a single template.
    const values = params;

    // Build a template literal with placeholders replaced as $1, $2, etc.
    // Neon accepts parameter interpolation through template strings.
    // To avoid SQL injection, do NOT insert values directly.
    //
    // Implementation note:
    // - For neon-http, easiest pattern is to keep queries as template tags.
    // - If you prefer raw strings, keep using node-postgres mode locally.
    //
    // For Devnet-0 MVP we implement a safe fallback by using `sql` as a function:
    // `sql` from neon supports `sql.query(text, values)` in newer versions,
    // but not all versions. So we use a tiny adapter:
    //
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const sqlAny = db.sql as any;

    if (typeof sqlAny.query === "function") {
      const res = await sqlAny.query(text, values);
      // res.rows is already an array
      return (res?.rows ?? []) as T[];
    }

    // Fallback: use a very small subset by replacing $n with ${values[n-1]}
    // NOT SAFE for arbitrary SQL — so we disallow it.
    throw new Error(
      "[DB] Neon driver does not support raw SQL .query(). " +
        "Either upgrade @neondatabase/serverless or use BIDLY_DB_MODE=node-postgres."
    );
  }

  if (db.mode === "node-postgres") {
    const res = await db.pool.query(text, params);
    return (res?.rows ?? []) as T[];
  }

  // mock
  return [];
}

/**
 * For graceful shutdown hooks (optional).
 */
export async function closeDb() {
  if (!_db) return;
  await _db.close();
  _db = null;
}
