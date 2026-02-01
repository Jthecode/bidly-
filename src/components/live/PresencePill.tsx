// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Live (Presence Pill) — Devnet-0                                ┃
   ┃ File   : src/components/live/PresencePill.tsx                           ┃
   ┃ Role   : Room presence + "watching" count (Ably presence)               ┃
   ┃ Status : Devnet-0 Ready                                                 ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)        ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                         ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

"use client";

import * as React from "react";

import type { RoomId } from "@/lib/live/types";
import { AblyChannels, getAblyClient, enterPresence, subscribePresence } from "@/lib/realtime/ably";

type Props = {
  roomId: RoomId;
  /**
   * Poll interval in ms for counting presence members.
   * Presence events are not guaranteed to include a count, so we compute it.
   */
  intervalMs?: number;
};

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

function safeInt(n: unknown, fallback = 0) {
  const v = typeof n === "number" ? n : Number(n);
  return Number.isFinite(v) ? v : fallback;
}

export default function PresencePill({ roomId, intervalMs = 4000 }: Props) {
  const [count, setCount] = React.useState<number>(0);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    let alive = true;

    async function refreshCount() {
      try {
        const client = getAblyClient();
        const ch = client.channels.get(AblyChannels.presence(roomId));
        const members = await ch.presence.get();
        if (!alive) return;
        setCount(Array.isArray(members) ? members.length : 0);
        setReady(true);
      } catch {
        if (!alive) return;
        // keep last known count; do not flip ready off
      }
    }

    // Enter presence for this viewer.
    const leave = enterPresence(roomId, {
      role: "viewer",
      joinedAt: new Date().toISOString(),
    });

    // On any presence event, refresh count (debounced by interval loop too).
    const unsub = subscribePresence(roomId, () => {
      void refreshCount();
    });

    // Initial + periodic refresh (guards against missed events / reconnects).
    void refreshCount();
    const id = window.setInterval(() => void refreshCount(), Math.max(1500, safeInt(intervalMs, 4000)));

    return () => {
      alive = false;
      window.clearInterval(id);
      try {
        unsub?.();
      } catch {}
      try {
        leave?.();
      } catch {}
    };
  }, [roomId, intervalMs]);

  return (
    <div
      className={cx(
        "inline-flex items-center gap-2 rounded-full",
        "border border-white/10 bg-white/5 px-3 py-1.5",
        "backdrop-blur shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
      )}
      title={ready ? "Watching now" : "Connecting…"}
      aria-label="Watching now"
    >
      <span className="h-2 w-2 rounded-full bg-[var(--bidly-neon-cyan,#00f0ff)] shadow-[0_0_14px_rgba(0,240,255,.45)]" />
      <span className="text-xs font-semibold text-white/85">
        {count.toLocaleString()} watching
      </span>

      {!ready ? (
        <span className="ml-1 text-[10px] text-white/45">(sync…)</span>
      ) : null}
    </div>
  );
}
