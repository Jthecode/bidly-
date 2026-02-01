// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Seller Rooms Index — Devnet-0                                 ┃
   ┃ File   : src/app/(seller)/seller/rooms/page.tsx                        ┃
   ┃ Role   : Seller view of their rooms (list + quick actions)             ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                         ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import "server-only";

import Link from "next/link";

import { listRooms } from "@/lib/live/rooms";
import type { LiveRoom } from "@/lib/live/types";

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

function statusBadge(status: LiveRoom["status"]) {
  const base =
    "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold";
  if (status === "live") {
    return (
      <span
        className={cx(
          base,
          "border-[var(--color-live)]/25 bg-[var(--color-live)]/15 text-[var(--color-live)]"
        )}
      >
        <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-live)] shadow-[0_0_16px_rgba(255,0,208,0.35)]" />
        LIVE
      </span>
    );
  }
  if (status === "starting") {
    return (
      <span className={cx(base, "border-white/10 bg-white/10 text-white")}>
        <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-accent)] shadow-[0_0_16px_rgba(0,240,255,0.30)]" />
        STARTING
      </span>
    );
  }
  if (status === "ended") {
    return (
      <span className={cx(base, "border-white/10 bg-black/30 text-white/70")}>
        <span className="inline-block h-2 w-2 rounded-full bg-white/30" />
        ENDED
      </span>
    );
  }
  if (status === "error") {
    return (
      <span className={cx(base, "border-[#ef4444]/30 bg-[#ef4444]/10 text-[#ef4444]")}>
        <span className="inline-block h-2 w-2 rounded-full bg-[#ef4444] shadow-[0_0_16px_rgba(239,68,68,0.35)]" />
        ERROR
      </span>
    );
  }
  return (
    <span className={cx(base, "border-white/10 bg-white/5 text-white/70")}>
      <span className="inline-block h-2 w-2 rounded-full bg-white/30" />
      OFFLINE
    </span>
  );
}

function RoomCard({ room }: { room: LiveRoom }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl">
      {/* Cover */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/40">
        {/* If you have next/image usage already, you can replace this with <Image /> */}
        <div
          className="absolute inset-0 opacity-90"
          style={{
            backgroundImage: room.coverUrl ? `url(${room.coverUrl})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        {/* fallback sheen */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(0,240,255,0.18),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(162,0,255,0.14),transparent_50%),linear-gradient(180deg,rgba(0,0,0,0.0),rgba(0,0,0,0.55))]" />

        <div className="absolute left-3 top-3">{statusBadge(room.status)}</div>
      </div>

      {/* Body */}
      <div className="min-w-0 p-4">
        <div className="min-w-0">
          <p className="truncate text-xs font-semibold text-white/60">
            {room.seller?.name ?? "Seller"}
            {room.seller?.verified ? " · Verified" : ""}
          </p>
          <h3 className="mt-1 truncate text-base font-semibold text-white">
            {room.title}
          </h3>
          {room.description ? (
            <p className="mt-2 line-clamp-2 text-sm text-white/60">
              {room.description}
            </p>
          ) : (
            <p className="mt-2 line-clamp-2 text-sm text-white/45">
              No description yet.
            </p>
          )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <Link
            href={`/seller/rooms/${room.id}`}
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10 hover:border-white/15 transition"
          >
            Manage
          </Link>

          <Link
            href={`/live/${room.id}`}
            className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm font-semibold text-white/85 hover:bg-black/20 hover:text-white transition"
          >
            View
          </Link>

          <Link
            href={`/seller/rooms/${room.id}/studio`}
            className="inline-flex items-center justify-center rounded-xl border border-[var(--color-ring)]/30 bg-[var(--color-ring)]/10 px-3 py-2 text-sm font-semibold text-white hover:bg-[var(--color-ring)]/14 transition"
          >
            Studio
          </Link>
        </div>

        <div className="mt-4 text-xs text-white/45">
          <span className="font-mono text-white/60">{room.id}</span>
        </div>
      </div>
    </div>
  );
}

export default async function SellerRoomsPage() {
  // Devnet-0: list all rooms until auth scoping is wired.
  // Later: filter by seller_id from session.
  const rooms = await listRooms({ limit: 48 });

  return (
    <div className="min-w-0 space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-white sm:text-2xl">
              Your rooms
            </h1>
            <p className="mt-1 text-sm text-white/60">
              Manage your live channels, titles, covers, and streaming settings.
            </p>
          </div>

          <div className="shrink-0 flex gap-2">
            <Link
              href="/seller"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10 hover:border-white/15 transition"
            >
              Dashboard
            </Link>
            <Link
              href="/seller/rooms/new"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#00f0ff] via-[#a200ff] to-[#ff00d0] px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_40px_rgba(0,0,0,0.45)] hover:opacity-95 transition"
            >
              New room
            </Link>
          </div>
        </div>
      </div>

      {/* Grid */}
      {rooms.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl p-6 text-center">
          <p className="text-sm font-semibold text-white">No rooms yet</p>
          <p className="mt-1 text-sm text-white/60">
            Create your first channel and go live in minutes.
          </p>
          <div className="mt-4">
            <Link
              href="/seller/rooms/new"
              className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-[#00f0ff] via-[#a200ff] to-[#ff00d0] px-4 py-2 text-sm font-semibold text-white"
            >
              Create a room
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid min-w-0 grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      )}
    </div>
  );
}
