// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Live Room (Page) — Devnet-0                                     ┃
   ┃ File   : src/app/live/[roomId]/page.tsx                                 ┃
   ┃ Role   : Live room viewer experience (Mux player + chat + presence)     ┃
   ┃ Status : Devnet-0 Ready                                                 ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)        ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                         ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import type { Metadata } from "next";

import type { RoomId } from "@/lib/live/types";
import { getRoomById } from "@/lib/db/queries/rooms";

import VideoPlayer from "@/components/live/VideoPlayer";
import PresencePill from "@/components/live/PresencePill";
import ChatPanel from "@/components/chat/ChatPanel";

/**
 * This page is server-rendered so we can fetch the room truth (title, seller, playbackId)
 * without exposing any secrets (ingestUrl/streamKey remain server-only).
 */

type Props = {
  params: { roomId: string };
};

function isRoomId(s: string): s is RoomId {
  return typeof s === "string" && s.length > 0;
}

function safeTitle(s?: string | null) {
  const t = (s ?? "").trim();
  return t.length ? t : "Live Room";
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const roomId = params.roomId;
  return {
    title: `Bidly • ${roomId}`,
  };
}

export default async function LiveRoomPage({ params }: Props) {
  const roomIdRaw = params.roomId;
  if (!isRoomId(roomIdRaw)) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white">
          Invalid room id.
        </div>
      </main>
    );
  }

  const room = await getRoomById(roomIdRaw);

  if (!room) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-10">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white">
          Room not found.
        </div>
      </main>
    );
  }

  const title = safeTitle((room as any).title);
  const sellerName = safeTitle((room as any).sellerName ?? (room as any).seller?.name);
  const playbackId = (room as any).playbackId ?? (room as any).streamPlaybackId ?? null;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <h1 className="truncate text-2xl font-semibold text-white">{title}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-white/70">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[var(--bidly-neon-cyan,#00f0ff)] shadow-[0_0_14px_rgba(0,240,255,.45)]" />
              Live
            </span>
            <span className="text-white/40">•</span>
            <span className="truncate">Seller: {sellerName}</span>
          </div>
        </div>

        <PresencePill roomId={roomIdRaw} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Video + Info */}
        <div className="space-y-5 lg:col-span-2">
          <VideoPlayer playbackId={playbackId} />

          {/* About / Details */}
          <section className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur">
            <h2 className="text-sm font-semibold text-white">About this live</h2>
            <p className="mt-2 text-sm text-white/70">
              {((room as any).description as string) ||
                "Live shopping on Bidly. Chat, bid, and win — in real time."}
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                <div className="text-xs text-white/60">Room ID</div>
                <div className="mt-1 truncate font-mono text-[11px] text-white/80">
                  {roomIdRaw}
                </div>
              </div>

              <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                <div className="text-xs text-white/60">Playback</div>
                <div className="mt-1 truncate font-mono text-[11px] text-white/80">
                  {playbackId ?? "—"}
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Chat */}
        <div className="lg:col-span-1">
          <ChatPanel roomId={roomIdRaw} />
        </div>
      </div>
    </main>
  );
}
