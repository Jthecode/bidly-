// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Chat (Panel) — Devnet-0                                         ┃
   ┃ File   : src/components/chat/ChatPanel.tsx                              ┃
   ┃ Role   : Live room chat panel (messages + composer + presence hook)     ┃
   ┃ Status : Devnet-0 Ready                                                 ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)        ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                         ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

"use client";

import * as React from "react";

import type { RoomId } from "@/lib/live/types";
import { subscribeRoomChat, publishChatEvent } from "@/lib/realtime/ably";

import ChatMessage, { type ChatMessageItem } from "@/components/chat/ChatMessage";
import ChatComposer from "@/components/chat/ChatComposer";

type Props = {
  roomId: RoomId;

  /**
   * Optional initial chat history (server-fetched).
   */
  initial?: ChatMessageItem[];

  /**
   * If true, allow sending messages.
   * For MVP you can keep this true; later gate on auth.
   */
  canChat?: boolean;

  /**
   * Optional: show a small header label.
   */
  title?: string;
};

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

function makeId() {
  return `m_${Date.now().toString(16)}_${Math.random().toString(16).slice(2)}`;
}

function nowIso() {
  return new Date().toISOString();
}

export default function ChatPanel({
  roomId,
  initial = [],
  canChat = true,
  title = "Chat",
}: Props) {
  const [items, setItems] = React.useState<ChatMessageItem[]>(initial);
  const [error, setError] = React.useState<string | null>(null);

  const listRef = React.useRef<HTMLDivElement | null>(null);

  // Keep scrolled to bottom when new messages arrive (unless user scrolled up).
  const stickToBottomRef = React.useRef(true);

  function scrollToBottom() {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }

  React.useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const onScroll = () => {
      const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 64;
      stickToBottomRef.current = nearBottom;
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, []);

  React.useEffect(() => {
    // Subscribe to Ably per-room chat channel
    const unsub = subscribeRoomChat(roomId, (ev) => {
      if (ev.type !== "chat.message" && ev.type !== "chat.system") return;

      // Normalize event -> UI item
      const msg = ev.message;

      const item: ChatMessageItem = {
        id: (msg as any).id ?? makeId(),
        createdAt: (msg as any).createdAt ?? nowIso(),
        text: (msg as any).text ?? "",
        author: (msg as any).author,
        kind: ev.type === "chat.system" ? "system" : "user",
      };

      setItems((prev) => {
        // de-dupe by id
        if (prev.some((p) => p.id === item.id)) return prev;
        const next = [...prev, item].slice(-250); // keep last 250 in memory
        return next;
      });
    });

    return () => {
      unsub?.();
    };
  }, [roomId]);

  React.useEffect(() => {
    // auto-scroll on new messages if user is near bottom
    if (stickToBottomRef.current) {
      requestAnimationFrame(() => scrollToBottom());
    }
  }, [items.length]);

  async function send(text: string) {
    setError(null);

    const trimmed = text.trim();
    if (!trimmed) return;

    const optimistic: ChatMessageItem = {
      id: makeId(),
      createdAt: nowIso(),
      text: trimmed,
      kind: "user",
      author: {
        id: "anon",
        name: "You",
      },
    };

    // Optimistic append
    setItems((prev) => [...prev, optimistic].slice(-250));

    try {
      await publishChatEvent(roomId, {
        type: "chat.message",
        roomId,
        message: {
          id: optimistic.id,
          text: optimistic.text,
          createdAt: optimistic.createdAt,
          author: optimistic.author,
        },
      });
    } catch (e: any) {
      setError(e?.message ?? "Failed to send message.");
      // Optional: mark optimistic message as failed (for now keep simple)
    }
  }

  return (
    <div
      className={cx(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_18px_50px_rgba(0,0,0,0.35)]"
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 border-b border-white/10 bg-black/25 px-4 py-3">
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-white">{title}</div>
          <div className="mt-0.5 text-xs text-white/60">Room: {String(roomId)}</div>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/75">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--bidly-neon-cyan,#00f0ff)] shadow-[0_0_12px_rgba(0,240,255,.45)]" />
          Live
        </span>
      </div>

      {/* Messages */}
      <div
        ref={listRef}
        className={cx(
          "h-[340px] overflow-y-auto px-4 py-4",
          "scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent"
        )}
      >
        {items.length === 0 ? (
          <div className="py-10 text-center">
            <div className="text-sm font-semibold text-white/85">No messages yet</div>
            <div className="mt-1 text-xs text-white/60">Say hi to kick things off.</div>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((m) => (
              <ChatMessage key={m.id} item={m} />
            ))}
          </div>
        )}
      </div>

      {error ? (
        <div className="px-4 pb-2 text-xs text-[rgba(255,0,208,.92)]">
          {error}
        </div>
      ) : null}

      {/* Composer */}
      <div className="border-t border-white/10 bg-black/20 px-3 py-3">
        <ChatComposer disabled={!canChat} onSend={send} />
      </div>
    </div>
  );
}
