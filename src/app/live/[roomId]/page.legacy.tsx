// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Live Room Page — Devnet-0                                     ┃
   ┃ File   : src/app/live/[id]/page.tsx                                   ┃
   ┃ Role   : Server page for a single live channel (seller-first)         ┃
   ┃ Status : Devnet-0 Ready                                               ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)      ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                       ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import "server-only";

import { notFound } from "next/navigation";

// If you already have these, keep your existing imports instead of these placeholders.
// import LiveHeader from "@/components/live/LiveHeader";
// import { getLiveRoom } from "@/lib/live/getLiveRoom";

type RouteParams = { id: string };

// In some Next versions / setups, params can be passed as a Promise.
// Type it as Promise to be safe and always await it.
type PageProps = {
  params: Promise<RouteParams>;
};

function normalizeId(raw: unknown) {
  const s = typeof raw === "string" ? raw : "";
  return s.trim();
}

async function getLiveRoom(id: string) {
  // TODO: replace with your real data source
  // This placeholder keeps the example self-contained and server-safe.
  return {
    id,
    title: "Mystery Box Live",
    seller: { name: "Seller 1", verified: true },
    isLive: true,
  };
}

export default async function LivePage({ params }: PageProps) {
  const p = await params;
  const id = normalizeId(p?.id);

  if (!id) notFound();

  const room = await getLiveRoom(id);

  if (!room) notFound();

  return (
    <div className="min-w-0 space-y-6">
      {/* Seller-first header */}
      <div className="min-w-0 rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span
                className={[
                  "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold",
                  room.isLive
                    ? "bg-[var(--color-live)]/20 text-[var(--color-live)] border border-[var(--color-live)]/25"
                    : "bg-white/5 text-white/70 border border-white/10",
                ].join(" ")}
              >
                <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-live)] shadow-[0_0_16px_rgba(255,0,208,0.35)]" />
                LIVE
              </span>

              <span className="text-sm text-white/70">Channel</span>
            </div>

            <h1 className="mt-2 truncate text-xl font-semibold text-white sm:text-2xl">
              {room.title}
            </h1>

            <p className="mt-1 truncate text-sm text-white/60">
              {room.seller.name}
              {room.seller.verified ? " · Verified" : ""}
            </p>
          </div>

          <div className="shrink-0">
            <div className="h-10 w-10 rounded-xl border border-white/10 bg-white/5" />
          </div>
        </div>
      </div>

      {/* 2-col layout: video + chat/info (grid-safe) */}
      <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {/* Video */}
        <div className="min-w-0 space-y-4">
          <div className="aspect-video w-full overflow-hidden rounded-2xl border border-white/10 bg-black/40">
            <div className="flex h-full w-full items-center justify-center text-sm text-white/60">
              LIVE VIDEO PLAYER (placeholder)
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl p-4">
            <p className="text-sm text-white/70">
              Seller-first experience: title + seller + LIVE status.
            </p>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="min-w-0 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl p-4">
            <h2 className="text-sm font-semibold text-white">Live Chat</h2>
            <div className="mt-3 h-[320px] rounded-xl border border-white/10 bg-black/30" />
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl p-4">
            <h2 className="text-sm font-semibold text-white">About</h2>
            <p className="mt-2 text-sm text-white/65">
              Room ID: <span className="font-mono text-white/80">{room.id}</span>
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
