// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Seller Room Detail Page — Devnet-0                            ┃
   ┃ File   : src/app/(seller)/seller/rooms/[id]/page.tsx                   ┃
   ┃ Role   : Seller view of a single room (manage + jump to Studio)        ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                         ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import "server-only";

import Link from "next/link";
import { notFound } from "next/navigation";

import type { LiveRoom, RoomId } from "@/lib/live/types";

type RouteParams = { id: string };
type PageProps = { params: Promise<RouteParams> };

function normalizeId(raw: unknown) {
  return (typeof raw === "string" ? raw : "").trim();
}

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

async function getRoom(roomId: RoomId): Promise<LiveRoom | null> {
  // Uses your truth endpoint (keeps server-only repo private).
  const base =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

  const url = base ? `${base}/api/live/rooms/${roomId}` : `/api/live/rooms/${roomId}`;

  const res = await fetch(url, { method: "GET", cache: "no-store" });
  const data = await safeJson(res);

  if (!res.ok) return null;
  const room = data?.room as LiveRoom | null | undefined;
  return room ?? null;
}

function statusPill(status: LiveRoom["status"]) {
  const base =
    "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border";
  if (status === "live") {
    return (
      <span
        className={[
          base,
          "bg-[var(--color-live)]/15 text-[var(--color-live)] border-[var(--color-live)]/25",
        ].join(" ")}
      >
        <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-live)] shadow-[0_0_16px_rgba(255,0,208,0.35)]" />
        LIVE
      </span>
    );
  }

  if (status === "starting") {
    return (
      <span className={[base, "bg-white/5 text-white/70 border-white/10"].join(" ")}>
        <span className="inline-block h-2 w-2 rounded-full bg-white/30" />
        STARTING
      </span>
    );
  }

  if (status === "ended") {
    return (
      <span className={[base, "bg-white/5 text-white/65 border-white/10"].join(" ")}>
        <span className="inline-block h-2 w-2 rounded-full bg-white/20" />
        ENDED
      </span>
    );
  }

  if (status === "error") {
    return (
      <span className={[base, "bg-red-500/10 text-red-200 border-red-500/25"].join(" ")}>
        <span className="inline-block h-2 w-2 rounded-full bg-red-400" />
        ERROR
      </span>
    );
  }

  return (
    <span className={[base, "bg-white/5 text-white/70 border-white/10"].join(" ")}>
      <span className="inline-block h-2 w-2 rounded-full bg-white/25" />
      OFFLINE
    </span>
  );
}

function visibilityPill(v: LiveRoom["visibility"]) {
  const base =
    "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border bg-white/5 text-white/70 border-white/10";
  return <span className={base}>{v.toUpperCase()}</span>;
}

export default async function SellerRoomDetailPage({ params }: PageProps) {
  const p = await params;
  const id = normalizeId(p?.id) as RoomId;

  if (!id) notFound();

  const room = await getRoom(id);
  if (!room) notFound();

  const shareUrl =
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "");

  const publicLink = shareUrl ? `${shareUrl}/live/${room.id}` : `/live/${room.id}`;

  return (
    <div className="min-w-0 space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              {statusPill(room.status)}
              {visibilityPill(room.visibility)}
              <span className="text-sm text-white/60">Seller room</span>
            </div>

            <h1 className="mt-2 truncate text-xl font-semibold text-white sm:text-2xl">
              {room.title}
            </h1>

            <p className="mt-1 truncate text-sm text-white/60">
              {room.seller.name}
              {room.seller.verified ? " · Verified" : ""}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Link
              href="/seller/rooms"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10 hover:border-white/15 transition"
            >
              Back
            </Link>

            <Link
              href={`/seller/rooms/${room.id}/studio`}
              className="inline-flex items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold text-white shadow-lg transition hover:opacity-95"
              style={{
                background:
                  "linear-gradient(90deg, rgba(0,240,255,0.95), rgba(162,0,255,0.95), rgba(255,0,208,0.95))",
              }}
            >
              Open Studio
            </Link>
          </div>
        </div>
      </div>

      {/* 2-col: details + actions */}
      <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {/* Main */}
        <div className="min-w-0 space-y-4">
          {/* Cover */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/30">
            <div className="aspect-[16/7] w-full">
              {room.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={room.coverUrl}
                  alt=""
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-sm text-white/55">
                  No cover image
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-white">Details</h2>

            <div className="mt-3 space-y-2 text-sm text-white/70">
              <p>
                <span className="text-white/55">Room ID:</span>{" "}
                <span className="font-mono text-white/85">{room.id}</span>
              </p>

              <p>
                <span className="text-white/55">Category:</span>{" "}
                <span className="text-white/85">{room.category ?? "—"}</span>
              </p>

              <p>
                <span className="text-white/55">Tags:</span>{" "}
                <span className="text-white/85">
                  {room.tags?.length ? room.tags.join(", ") : "—"}
                </span>
              </p>

              <p className="pt-2">
                <span className="text-white/55">Description:</span>
              </p>
              <p className="text-white/80">
                {room.description?.trim() ? room.description : "—"}
              </p>
            </div>
          </div>

          {/* Playback */}
          <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-white">Playback</h2>
            <p className="mt-2 text-sm text-white/60">
              HLS URL is used by the public live room page. Studio will set this later.
            </p>

            <div className="mt-3 space-y-2 text-sm text-white/70">
              <p className="truncate">
                <span className="text-white/55">HLS:</span>{" "}
                <span className="font-mono text-white/80">
                  {room.playback?.hlsUrl ?? "—"}
                </span>
              </p>
              <p className="truncate">
                <span className="text-white/55">Poster:</span>{" "}
                <span className="font-mono text-white/80">
                  {room.playback?.posterUrl ?? "—"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="min-w-0 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl p-4">
            <h2 className="text-sm font-semibold text-white">Public link</h2>
            <p className="mt-2 text-sm text-white/60">
              Share this with viewers (if visibility allows).
            </p>

            <a
              href={publicLink}
              className="mt-3 block truncate rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/80 hover:bg-black/25"
            >
              {publicLink}
            </a>

            <div className="mt-3 text-xs text-white/45">
              Tip: If your room is <span className="text-white/70">private</span>, this
              link won’t be discoverable.
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl p-4">
            <h2 className="text-sm font-semibold text-white">Quick actions</h2>
            <div className="mt-3 space-y-2">
              <Link
                href={`/live/${room.id}`}
                className="inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
              >
                View public page
              </Link>

              <Link
                href={`/seller/rooms/${room.id}/studio`}
                className="inline-flex w-full items-center justify-center rounded-xl px-3 py-2 text-sm font-semibold text-white shadow-lg hover:opacity-95"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(0,240,255,0.95), rgba(162,0,255,0.95), rgba(255,0,208,0.95))",
                }}
              >
                Go to Studio
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/10 p-4 text-sm text-white/60">
            <p className="font-semibold text-white/80">Devnet-0 note</p>
            <p className="mt-1">
              This page uses your truth API (<span className="font-mono">/api/live/rooms/[id]</span>)
              for consistency. Once auth is wired, we’ll restrict seller pages to the owner.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
