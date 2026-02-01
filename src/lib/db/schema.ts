// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Database (Schema) — Devnet-0                                   ┃
   ┃ File   : src/lib/db/schema.ts                                          ┃
   ┃ Role   : Canonical DB schema types (tables + row models) for Bidly      ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

/**
 * NOTE (Devnet-0 MVP):
 * This file is intentionally "driver-agnostic".
 * - If you use Drizzle ORM, you can replace the "Row" types with `InferSelectModel`
 *   and export the Drizzle table objects here.
 * - If you use Prisma, treat these as canonical row contracts at the boundary.
 *
 * For now: pure TypeScript row shapes so the app compiles and the db/queries
 * layer can be implemented with raw SQL (neon-http or node-postgres).
 */

export type ISODateString = string;
export type Id = string;

/* =====================================================================
   Users
   ===================================================================== */

export type UserRole = "buyer" | "seller" | "admin";

export type UserRow = {
  id: Id;
  email: string;
  name: string;
  handle?: string | null;
  avatarUrl?: string | null;
  role: UserRole;
  verified: boolean;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

/* =====================================================================
   Sellers
   ===================================================================== */

export type SellerRow = {
  id: Id;
  userId: Id;
  displayName: string;
  bio?: string | null;
  rating?: number | null; // e.g. 4.9
  salesCount?: number | null;
  createdAt: ISODateString;
  updatedAt: ISODateString;
};

/* =====================================================================
   Rooms (Live Auctions)
   ===================================================================== */

export type RoomStatus = "draft" | "scheduled" | "live" | "ended";

export type RoomRow = {
  id: Id;
  sellerId: Id;

  title: string;
  description?: string | null;

  status: RoomStatus;

  coverImageUrl?: string | null;

  // Streaming provider references (Mux/AWS IVS/etc.)
  streamProvider?: "mux" | "aws-ivs" | "custom" | null;
  streamId?: string | null;        // provider stream id
  playbackId?: string | null;      // provider playback id
  ingestUrl?: string | null;       // provider RTMP ingest URL (server-side only)
  streamKey?: string | null;       // provider stream key (server-side only)

  // Live metrics
  viewerCount: number;

  // Scheduling & lifecycle timestamps
  scheduledFor?: ISODateString | null;
  startedAt?: ISODateString | null;
  endedAt?: ISODateString | null;

  createdAt: ISODateString;
  updatedAt: ISODateString;
};

/* =====================================================================
   Chat messages
   ===================================================================== */

export type MessageRow = {
  id: Id;
  roomId: Id;
  authorUserId?: Id | null;
  kind: "user" | "system";
  text: string;
  createdAt: ISODateString;
};

/* =====================================================================
   Helpers
   ===================================================================== */

export function nowIso(): ISODateString {
  return new Date().toISOString();
}

export function makeId(prefix = "id"): Id {
  // Non-crypto id suitable for DB primary keys in MVP.
  // Swap to ULID/UUID later if desired.
  return `${prefix}_${Math.random().toString(16).slice(2)}_${Date.now().toString(16)}`;
}
