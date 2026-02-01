/* ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   ┃ Bidly — Live Sidebar — Devnet-0                                       ┃
   ┃ File   : src/app/live/[id]/LiveSidebar.tsx                            ┃
   ┃ Role   : Seller-first sidebar (seller card + actions + chat)          ┃
   ┃ Status : Devnet-0 Ready                                               ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)      ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                       ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃
   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ */

"use client";

import * as React from "react";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";
import type { LiveRoom, LiveChatMessage } from "./live.types";

export interface LiveSidebarProps {
  room: LiveRoom;
  className?: string;
}

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

function safeText(s?: string) {
  const t = (s ?? "").trim();
  return t || "";
}

function stageLabel(state?: LiveRoom["stage"]["state"]) {
  if (state === "starting-soon") return "Starting Soon";
  if (state === "ended") return "Ended";
  if (state === "offline") return "Offline";
  return "LIVE";
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function safeIso(d: Date) {
  return d.toISOString();
}

/**
 * Get a stable-ish anchor time from fields that commonly exist on the room.
 * We avoid referencing non-existent LiveStage fields (startedAt/scheduledFor).
 */
function roomAnchorMs(room: LiveRoom): number {
  const r = room as unknown as Record<string, any>;

  const candidates: Array<unknown> = [
    r.updatedAt,
    r.createdAt,
    r.lastHeartbeatAt,
    r.stage?.updatedAt,
    r.stage?.createdAt,
  ];

  for (const c of candidates) {
    if (typeof c === "string") {
      const t = Date.parse(c);
      if (Number.isFinite(t)) return t;
    }
    if (c instanceof Date) {
      const t = c.getTime();
      if (Number.isFinite(t)) return t;
    }
  }

  // Client component: safe fallback.
  return Date.now();
}

/** Deterministic-ish demo chat (no perf.now; no invalid stage fields). */
function makeDemoChat(room: LiveRoom, sellerName: string): LiveChatMessage[] {
  const base = roomAnchorMs(room);
  const iso = (ms: number) => safeIso(new Date(ms));

  const sender = (i: number) => ({
    id: `u-${i}`,
    name: `Viewer ${i}`,
    handle: `@viewer${i}`,
    avatar: `/placeholder/avatars/avatar-${pad2((i % 8) + 1)}.png`,
    verified: i % 7 === 0,
    role: "viewer" as const,
  });

  return [
    {
      id: "m-1",
      roomId: room.id,
      ts: iso(base - 1000 * 60 * 3),
      user: sender(1),
      text: `Yo ${sellerName} 🔥`,
      kind: "message",
    },
    {
      id: "m-2",
      roomId: room.id,
      ts: iso(base - 1000 * 60 * 2),
      user: sender(2),
      text: "W drop tonight",
      kind: "message",
    },
    {
      id: "m-3",
      roomId: room.id,
      ts: iso(base - 1000 * 60 * 1),
      user: sender(3),
      text: "Let’s goooo",
      kind: "message",
    },
  ];
}

export default function LiveSidebar({ room, className }: LiveSidebarProps) {
  const sellerName = safeText(room?.seller?.name) || "Seller";
  const sellerHandle = safeText(room?.seller?.handle);
  const verified = Boolean(room?.seller?.verified);
  const title = safeText(room?.product?.title) || safeText((room as any)?.title) || "Live";
  const state = room?.stage?.state ?? "live";

  const [messages] = React.useState<LiveChatMessage[]>(() =>
    makeDemoChat(room, sellerName)
  );

  const [copied, setCopied] = React.useState(false);

  async function copyShare() {
    const url =
      (room as any)?.shareUrl || (typeof window !== "undefined" ? window.location.href : "");
    if (!url) return;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1200);
    } catch {
      setCopied(false);
    }
  }

  return (
    <aside className={cx("min-w-0", className)}>
      {/* Seller card (seller-first; no “listing” anywhere) */}
      <div
        className={cx(
          "min-w-0 rounded-2xl border border-white/10 bg-white/[0.035] backdrop-blur",
          "shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_12px_44px_rgba(0,0,0,0.38)]"
        )}
      >
        <div className="p-4 sm:p-5 min-w-0">
          <div className="flex items-start justify-between gap-3 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <Avatar
                src={room?.seller?.avatar}
                alt={sellerName}
                size="md"
                isActive={state === "live"}
                verified={verified}
              />

              <div className="min-w-0">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="truncate text-sm font-semibold text-white/90">
                    {sellerName}
                  </div>

                  {verified ? (
                    <span
                      className="inline-flex items-center gap-1 rounded-full border border-white/12 bg-black/35 px-2 py-0.5 text-[10px] text-white/85 whitespace-nowrap leading-none"
                      aria-label="Verified seller"
                      title="Verified seller"
                    >
                      <span aria-hidden="true">✓</span>
                      <span className="hidden sm:inline">Verified</span>
                    </span>
                  ) : null}
                </div>

                {sellerHandle ? (
                  <div className="truncate text-xs text-white/65">{sellerHandle}</div>
                ) : (
                  <div className="truncate text-xs text-white/55">Host</div>
                )}
              </div>
            </div>

            <Badge variant={state === "live" ? "live" : "default"} className="shrink-0">
              {stageLabel(state)}
            </Badge>
          </div>

          <div className="mt-4 min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-white/55 whitespace-nowrap">
              Live Title
            </div>
            <div className="mt-1 truncate text-sm font-semibold text-[var(--color-text-primary)]">
              {title}
            </div>
          </div>

          {/* Actions */}
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button
              type="button"
              className={cx(
                "inline-flex items-center justify-center rounded-xl px-3 py-2",
                "border border-white/10 bg-black/25 text-xs font-semibold text-white/85",
                "transition-colors hover:bg-black/35 hover:text-white",
                "focus:outline-none focus-visible:ring-1 focus-visible:ring-white/15"
              )}
              aria-label="Follow seller"
            >
              Follow
            </button>

            <button
              type="button"
              onClick={copyShare}
              className={cx(
                "inline-flex items-center justify-center rounded-xl px-3 py-2",
                "border border-white/10 bg-black/25 text-xs font-semibold text-white/85",
                "transition-colors hover:bg-black/35 hover:text-white",
                "focus:outline-none focus-visible:ring-1 focus-visible:ring-white/15"
              )}
              aria-label="Copy share link"
            >
              {copied ? "Copied" : "Share"}
            </button>
          </div>
        </div>
      </div>

      {/* Chat */}
      <div
        className={cx(
          "mt-6 min-w-0 rounded-2xl border border-white/10 bg-white/[0.035] backdrop-blur",
          "shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_12px_44px_rgba(0,0,0,0.38)]"
        )}
      >
        <div className="flex items-center justify-between gap-3 p-4 sm:p-5">
          <div className="text-sm font-semibold text-white/90">Chat</div>
          <div className="text-[11px] text-white/55">Live room</div>
        </div>

        <div className="px-4 pb-4 sm:px-5 sm:pb-5">
          <div
            className={cx(
              "min-w-0 rounded-2xl border border-white/10 bg-black/20",
              "max-h-[420px] overflow-auto"
            )}
          >
            <ul className="p-3 space-y-2">
              {messages.map((m) => (
                <li key={m.id} className="min-w-0">
                  <div className="flex items-start gap-2 min-w-0">
                    <Avatar
                      src={m.user.avatar}
                      alt={m.user.name}
                      size="sm"
                      isActive={false}
                      verified={Boolean(m.user.verified)}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className="truncate text-[12px] font-semibold text-white/85">
                          {m.user.name}
                        </span>
                        {m.user.handle ? (
                          <span className="truncate text-[11px] text-white/45">
                            {m.user.handle}
                          </span>
                        ) : null}
                      </div>
                      <div className="text-[12px] leading-relaxed text-white/75 break-words">
                        {m.text}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Input (visual only; wire later via /api/live/rooms/[id]/messages + Ably) */}
          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              placeholder="Say something…"
              className={cx(
                "w-full min-w-0 rounded-xl border border-white/10 bg-black/25",
                "px-3 py-2 text-sm text-white/85 placeholder:text-white/35",
                "focus:outline-none focus:ring-1 focus:ring-white/14"
              )}
            />
            <button
              type="button"
              className={cx(
                "shrink-0 rounded-xl px-3 py-2 text-xs font-semibold",
                "border border-white/10 bg-white/5 text-white/85",
                "transition-colors hover:bg-white/10",
                "focus:outline-none focus-visible:ring-1 focus-visible:ring-white/15"
              )}
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
