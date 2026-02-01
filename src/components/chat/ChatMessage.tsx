// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Chat (Message) — Devnet-0                                       ┃
   ┃ File   : src/components/chat/ChatMessage.tsx                            ┃
   ┃ Role   : Single chat message row (user + system variants)               ┃
   ┃ Status : Devnet-0 Ready                                                 ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)        ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                         ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

"use client";

import * as React from "react";

export type ChatAuthor = {
  id: string;
  name: string;
  handle?: string;
  avatarUrl?: string;
  verified?: boolean;
};

export type ChatMessageItem = {
  id: string;
  createdAt: string; // ISO
  text: string;
  kind?: "user" | "system";
  author?: ChatAuthor;
};

type Props = {
  item: ChatMessageItem;
};

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  const a = parts[0]?.[0] ?? "U";
  const b = parts[1]?.[0] ?? "";
  return (a + b).toUpperCase();
}

function formatTime(iso: string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function Avatar({
  author,
}: {
  author: ChatAuthor;
}) {
  const fallback = initials(author.name);

  return (
    <div
      className={cx(
        "relative h-8 w-8 shrink-0 overflow-hidden rounded-xl",
        "border border-white/10 bg-white/5"
      )}
      aria-label={author.name}
      title={author.name}
    >
      {author.avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={author.avatarUrl}
          alt=""
          className="h-full w-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center text-[10px] font-bold text-white/80">
          {fallback}
        </div>
      )}

      {author.verified ? (
        <span
          className={cx(
            "absolute -bottom-1 -right-1 inline-flex h-4 w-4 items-center justify-center rounded-full",
            "border border-white/10 bg-black/70 text-[10px]"
          )}
          title="Verified"
        >
          <span
            className="inline-block h-2 w-2 rounded-full bg-[var(--bidly-neon-cyan,#00f0ff)] shadow-[0_0_10px_rgba(0,240,255,.45)]"
            aria-hidden="true"
          />
        </span>
      ) : null}
    </div>
  );
}

function Bubble({
  children,
  kind,
}: {
  children: React.ReactNode;
  kind: "user" | "system";
}) {
  if (kind === "system") {
    return (
      <div
        className={cx(
          "rounded-2xl border border-white/10 bg-black/25 px-3 py-2 text-xs text-white/70",
          "shadow-[0_10px_28px_rgba(0,0,0,0.35)]"
        )}
      >
        {children}
      </div>
    );
  }

  return (
    <div
      className={cx(
        "rounded-2xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/90",
        "shadow-[0_10px_28px_rgba(0,0,0,0.35)]"
      )}
    >
      {children}
    </div>
  );
}

export default function ChatMessage({ item }: Props) {
  const kind: "user" | "system" = item.kind ?? (item.author ? "user" : "system");
  const author = item.author;

  return (
    <div className="flex items-start gap-3">
      {kind === "user" && author ? <Avatar author={author} /> : <div className="h-8 w-8" />}

      <div className="min-w-0 flex-1">
        {kind === "user" && author ? (
          <div className="flex items-center gap-2">
            <div className="truncate text-xs font-semibold text-white/80">
              {author.name}
              {author.handle ? (
                <span className="ml-2 text-white/50">@{author.handle}</span>
              ) : null}
            </div>
            <span className="text-[10px] text-white/45">
              {formatTime(item.createdAt)}
            </span>
          </div>
        ) : (
          <div className="text-[10px] text-white/45">{formatTime(item.createdAt)}</div>
        )}

        <div className="mt-1">
          <Bubble kind={kind}>
            <p className="whitespace-pre-wrap break-words leading-relaxed">
              {item.text}
            </p>
          </Bubble>
        </div>
      </div>
    </div>
  );
}
