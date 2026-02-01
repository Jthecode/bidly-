// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Seller Dashboard — Devnet-0                                   ┃
   ┃ File   : src/app/(seller)/seller/page.tsx                              ┃
   ┃ Role   : Seller overview (status, quick actions, recent rooms)         ┃
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

function statusPill(status: LiveRoom["status"]) {
  const base =
    "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border";
  if (status === "live") {
    return cx(
      base,
      "bg-[var(--color-live)]/15 text-[var(--color-live)] border-[var(--color-live)]/25"
    );
  }
  if (status === "starting") {
    return cx(base, "bg-white/5 text-white/75 border-white/10");
  }
  if (status === "ended") {
    return cx(base, "bg-white/5 text-white/60 border-white/10");
  }
  if (status === "error") {
    return cx(base, "bg-red-500/10 text-red-200 border-red-500/20");
  }
  return cx(base, "bg-white/5 text-white/60 border-white/10");
}

function formatCount(n?: number) {
  if (!n || !Number.isFinite(n)) return "0";
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(Math.floor(n));
}

export default async function SellerDashboardPage() {
  // For now, we show "your" rooms as the most recent rooms (until auth is wired).
  const rooms = await listRooms({ limit: 8 });

  const liveCount = rooms.filter((r) => r.status === "live").length;
  const startingCount = rooms.filter((r) => r.status === "starting").length;

  return (
    <div className="min-w-0 space-y-6">
      {/* Top stats row */}
      <section className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-3">
        <div
          className={cx(
            "rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl p-4",
            "shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_20px_60px_rgba(0,0,0,0.35)]"
          )}
        >
          <p className="text-xs font-semibold tracking-wide text-white/55">
            Live right now
          </p>
          <p className="mt-2 text-3xl font-semibold text-white">{liveCount}</p>
          <p className="mt-1 text-sm text-white/60">
            Channels currently broadcasting
          </p>
        </div>

        <div
          className={cx(
            "rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl p-4",
            "shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_20px_60px_rgba(0,0,0,0.35)]"
          )}
        >
          <p className="text-xs font-semibold tracking-wide text-white/55">
            Starting
          </p>
          <p className="mt-2 text-3xl font-semibold text-white">
            {startingCount}
          </p>
          <p className="mt-1 text-sm text-white/60">Rooms warming up</p>
        </div>

        <div
          className={cx(
            "rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl p-4",
            "shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_20px_60px_rgba(0,0,0,0.35)]"
          )}
        >
          <p className="text-xs font-semibold tracking-wide text-white/55">
            Quick actions
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link
              href="/seller/rooms/new"
              className={cx(
                "inline-flex items-center justify-center",
                "rounded-xl px-3 py-2 text-sm font-semibold",
                "bg-gradient-to-r from-[#00f0ff] via-[#a200ff] to-[#ff00d0]",
                "text-white shadow-[0_10px_30px_rgba(0,240,255,0.10)]",
                "hover:opacity-95 transition"
              )}
            >
              Create a room
            </Link>

            <Link
              href="/seller/rooms"
              className={cx(
                "inline-flex items-center justify-center",
                "rounded-xl px-3 py-2 text-sm font-semibold",
                "border border-white/10 bg-white/5 text-white",
                "hover:bg-white/10 hover:border-white/15 transition"
              )}
            >
              Manage rooms
            </Link>

            <Link
              href="/seller/onboarding"
              className={cx(
                "inline-flex items-center justify-center",
                "rounded-xl px-3 py-2 text-sm font-semibold",
                "border border-white/10 bg-white/5 text-white",
                "hover:bg-white/10 hover:border-white/15 transition"
              )}
            >
              Finish onboarding
            </Link>
          </div>
        </div>
      </section>

      {/* Recent rooms */}
      <section className="min-w-0">
        <div className="mb-3 flex items-end justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-sm font-semibold text-white">Recent rooms</h2>
            <p className="mt-1 text-sm text-white/60">
              Until auth is wired, this shows the most recently active rooms.
            </p>
          </div>

          <Link
            href="/seller/rooms"
            className="shrink-0 text-sm font-semibold text-[#00f0ff] hover:underline"
          >
            View all
          </Link>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
          {rooms.map((room) => (
            <div
              key={room.id}
              className={cx(
                "min-w-0 rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl p-4",
                "hover:bg-black/25 transition"
              )}
            >
              <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={statusPill(room.status)}>
                      <span
                        className={cx(
                          "inline-block h-2 w-2 rounded-full",
                          room.status === "live"
                            ? "bg-[var(--color-live)] shadow-[0_0_16px_rgba(255,0,208,0.35)]"
                            : "bg-white/30"
                        )}
                      />
                      {room.status.toUpperCase()}
                    </span>

                    <span className="text-xs text-white/55">
                      Viewers: {formatCount(room.viewers)}
                    </span>
                  </div>

                  <h3 className="mt-2 truncate text-base font-semibold text-white">
                    {room.title}
                  </h3>

                  <p className="mt-1 truncate text-sm text-white/60">
                    {room.seller?.name ?? "Unknown seller"}
                    {room.seller?.verified ? " · Verified" : ""}
                  </p>
                </div>

                <div className="shrink-0 flex flex-col gap-2">
                  <Link
                    href={`/seller/rooms/${room.id}`}
                    className={cx(
                      "inline-flex items-center justify-center",
                      "rounded-xl px-3 py-2 text-sm font-semibold",
                      "border border-white/10 bg-white/5 text-white",
                      "hover:bg-white/10 hover:border-white/15 transition"
                    )}
                  >
                    Manage
                  </Link>

                  <Link
                    href={`/live/${room.id}`}
                    className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold text-[#00f0ff] hover:underline"
                  >
                    View
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {rooms.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl p-6 text-center">
            <p className="text-sm font-semibold text-white">No rooms yet</p>
            <p className="mt-2 text-sm text-white/60">
              Create your first room to start going live.
            </p>
            <div className="mt-4">
              <Link
                href="/seller/rooms/new"
                className={cx(
                  "inline-flex items-center justify-center",
                  "rounded-xl px-4 py-2 text-sm font-semibold",
                  "bg-gradient-to-r from-[#00f0ff] via-[#a200ff] to-[#ff00d0]",
                  "text-white shadow-[0_10px_30px_rgba(0,240,255,0.10)]",
                  "hover:opacity-95 transition"
                )}
              >
                + New room
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
