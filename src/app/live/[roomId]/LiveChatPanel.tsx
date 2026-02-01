/* ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   ┃ Bidly — Live Chat Panel — Devnet-0                                     ┃
   ┃ File   : src/app/live/[id]/LiveChatPanel.tsx                           ┃
   ┃ Role   : Cyber-luxury chat rail (server-safe shell + elite visuals)    ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃
   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ */

"use client";

import * as React from "react";
import { Card, CardSection } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Avatar } from "@/components/ui/Avatar";

import type { LiveChatMessage, LiveSeller } from "./live.types";

export interface LiveChatPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  seller: LiveSeller;
  isLive?: boolean;

  /**
   * Provide messages when wired to a realtime backend.
   * If omitted, we render deterministic demo content.
   */
  messages?: LiveChatMessage[];

  /**
   * If true, hide the input row (read-only mode).
   */
  readOnly?: boolean;

  /**
   * Tighten spacing for smaller layouts.
   */
  density?: "default" | "compact";
}

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

function pad2(n: number) {
  return String(n).padStart(2, "0");
}

function safeText(s: unknown, fallback: string) {
  const t = typeof s === "string" ? s.trim() : "";
  return t || fallback;
}

/**
 * Deterministic demo messages (no Math.random)
 * - avoids hydration mismatch
 * - gives an “alive” feel without backend
 */
function demoMessages(seller: LiveSeller): LiveChatMessage[] {
  const hostName = safeText(seller?.name, "Seller");
  const hostHandle = safeText(seller?.handle, "@seller");
  const base = [
    { u: "Nova", h: "@nova", m: "That glow is insane 🔥", a: 1 },
    { u: "Cipher", h: "@cipher", m: "W drop. Clean.", a: 2 },
    { u: "Mira", h: "@mira", m: "What time do you ship?", a: 3 },
    { u: "Atlas", h: "@atlas", m: "Following. This is elite.", a: 4 },
    { u: hostName, h: hostHandle, m: "Welcome in — appreciate you.", a: 5, host: true },
    { u: "Zen", h: "@zen", m: "Chat is moving fast 😭", a: 6 },
  ];

  return base.map((x, i) => ({
    id: `msg-${i + 1}`,
    user: {
      name: x.u,
      handle: x.h,
      avatar: x.host ? seller.avatar : `/placeholder/avatars/avatar-${pad2(((i + 2) % 8) + 1)}.png`,
      verified: Boolean(x.host ? seller.verified : i % 7 === 0),
    },
    message: x.m,
    ts: new Date(1700000000000 + (i + 1) * 60000).toISOString(),
    isHost: Boolean(x.host),
  }));
}

function ChatRow({
  msg,
}: {
  msg: LiveChatMessage;
}) {
  const name = safeText(msg?.user?.name, "User");
  const handle = safeText(msg?.user?.handle, "");
  const text = safeText(msg?.message, "…");

  return (
    <div className="flex items-start gap-3 min-w-0">
      <div className="shrink-0">
        <Avatar
          src={msg?.user?.avatar}
          alt={name}
          size="sm"
          verified={Boolean(msg?.user?.verified)}
          isActive={Boolean(msg?.isHost)}
        />
      </div>

      <div className="min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="truncate text-sm font-semibold text-white/90">{name}</div>
          {handle ? <div className="truncate text-xs text-white/55">{handle}</div> : null}
          {msg?.isHost ? (
            <Badge variant="success" className="px-2 py-0.5 text-[10px]">
              HOST
            </Badge>
          ) : null}
        </div>

        <div className="mt-0.5 text-sm leading-snug text-white/75 break-words">
          {text}
        </div>
      </div>
    </div>
  );
}

export default function LiveChatPanel({
  seller,
  isLive = true,
  messages,
  readOnly = false,
  density = "default",
  className,
  ...props
}: LiveChatPanelProps) {
  const pad = density === "compact" ? "p-4" : "p-5";
  const gapY = density === "compact" ? "gap-4" : "gap-5";

  const items = React.useMemo(() => {
    return (messages && messages.length ? messages : demoMessages(seller)).slice(-50);
  }, [messages, seller]);

  // minimal local state for the input; still “client” safe
  const [draft, setDraft] = React.useState("");

  return (
    <Card className={cx("min-w-0 overflow-hidden", className)} {...props}>
      <CardSection className={cx("min-w-0", pad)}>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 min-w-0">
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
              Live Chat
            </div>
            <div className="mt-1 flex items-center gap-2 min-w-0">
              {isLive ? (
                <Badge variant="live" className="px-3 py-1">
                  LIVE
                </Badge>
              ) : (
                <span className="inline-flex items-center rounded-full border border-white/12 bg-black/35 px-3 py-1 text-[11px] font-semibold text-white/80 leading-none whitespace-nowrap">
                  OFFLINE
                </span>
              )}
              <div className="truncate text-sm text-white/70">
                Seller-first room • keep it clean
              </div>
            </div>
          </div>

          <span
            className={cx(
              "shrink-0 inline-flex items-center rounded-xl px-3 py-1.5",
              "border border-white/10 bg-white/5 text-white/85",
              "text-xs font-semibold leading-none whitespace-nowrap"
            )}
          >
            Chat
          </span>
        </div>

        <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Messages */}
        <div
          className={cx(
            "mt-5 min-w-0",
            "flex flex-col",
            gapY,
            // soft glass well
            "rounded-2xl border border-white/10 bg-black/20",
            "p-4",
            // scroll
            "max-h-[420px] overflow-y-auto",
            // scrollbar polish (works if your theme.css includes scrollbar styles)
            "[scrollbar-gutter:stable]"
          )}
          aria-label="Chat messages"
        >
          {items.map((m) => (
            <ChatRow key={m.id} msg={m} />
          ))}
        </div>

        {/* Input (client only) */}
        {!readOnly ? (
          <div className="mt-5 min-w-0">
            <div className="flex items-center gap-3 min-w-0">
              <div className="min-w-0 flex-1">
                <label htmlFor="live-chat-input" className="sr-only">
                  Send a message
                </label>
                <input
                  id="live-chat-input"
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  placeholder="Say something…"
                  className={cx(
                    "w-full min-w-0",
                    "rounded-2xl border border-white/10 bg-black/25",
                    "px-4 py-3",
                    "text-sm text-white/90 placeholder:text-white/40",
                    "outline-none",
                    "focus:ring-1 focus:ring-white/14 focus:border-white/14",
                    "transition"
                  )}
                />
              </div>

              <button
                type="button"
                className={cx(
                  "shrink-0",
                  "rounded-2xl px-4 py-3",
                  "border border-white/10 bg-white/5",
                  "text-sm font-semibold text-white/90",
                  "hover:bg-white/10",
                  "transition"
                )}
                onClick={() => {
                  // demo noop: keep the UI elite without pretending to send.
                  setDraft("");
                }}
                aria-label="Send message"
              >
                Send
              </button>
            </div>

            <div className="mt-2 text-xs text-white/40">
              Be respectful • No listings • Seller-first room.
            </div>
          </div>
        ) : null}
      </CardSection>
    </Card>
  );
}
