// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Chat (Composer) — Devnet-0                                      ┃
   ┃ File   : src/components/chat/ChatComposer.tsx                           ┃
   ┃ Role   : Chat input + send action (keyboard friendly, glass neon)       ┃
   ┃ Status : Devnet-0 Ready                                                 ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)        ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                         ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

"use client";

import * as React from "react";

type Props = {
  disabled?: boolean;
  placeholder?: string;
  maxLen?: number;
  onSend: (text: string) => void | Promise<void>;
};

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

export default function ChatComposer({
  disabled = false,
  placeholder = "Message…",
  maxLen = 400,
  onSend,
}: Props) {
  const [text, setText] = React.useState("");
  const [sending, setSending] = React.useState(false);

  const remaining = Math.max(0, maxLen - text.length);

  async function submit() {
    if (disabled || sending) return;
    const t = text.trim();
    if (!t) return;

    setSending(true);
    try {
      await onSend(t.slice(0, maxLen));
      setText("");
    } finally {
      setSending(false);
    }
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void submit();
    }
  }

  return (
    <div className="flex items-end gap-2">
      <div className="relative flex-1">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={disabled}
          rows={1}
          placeholder={placeholder}
          className={cx(
            "min-h-[44px] w-full resize-none rounded-2xl px-4 py-3 text-sm text-white",
            "border border-white/10 bg-white/5 backdrop-blur outline-none",
            "shadow-[0_10px_28px_rgba(0,0,0,0.35)]",
            "placeholder:text-white/40",
            "focus:border-white/20 focus:bg-white/7",
            disabled && "opacity-60 cursor-not-allowed"
          )}
        />

        <div className="pointer-events-none absolute inset-x-4 bottom-1.5 flex justify-end">
          <span className="text-[10px] text-white/40">{remaining}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => void submit()}
        disabled={disabled || sending || text.trim().length === 0}
        className={cx(
          "inline-flex h-[44px] items-center justify-center rounded-2xl px-4 text-sm font-semibold",
          "bg-[linear-gradient(90deg,rgba(0,240,255,.95),rgba(162,0,255,.95))] text-black",
          "shadow-[0_10px_30px_rgba(0,240,255,0.18)]",
          "hover:opacity-95 transition",
          (disabled || sending || text.trim().length === 0) &&
            "opacity-60 cursor-not-allowed hover:opacity-60"
        )}
        aria-label="Send message"
      >
        {sending ? "Sending…" : "Send"}
      </button>
    </div>
  );
}
