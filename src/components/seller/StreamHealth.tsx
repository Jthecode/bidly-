// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Seller (Stream Health) — Devnet-0                                ┃
   ┃ File   : src/components/seller/StreamHealth.tsx                          ┃
   ┃ Role   : Live stream health panel (heartbeat + viewers + provider state)┃
   ┃ Status : Devnet-0 Ready                                                 ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)        ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                         ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

"use client";

import * as React from "react";

type StreamStatus = "unknown" | "offline" | "starting" | "live" | "ending";

export type StreamHealthRoom = {
  id: string;

  status: "draft" | "scheduled" | "live" | "ended";

  viewerCount?: number | null;

  streamProvider?: string | null;
  streamId?: string | null;
  playbackId?: string | null;

  heartbeatAt?: string | null; // ISO
  updatedAt?: string | null; // ISO
};

type Props = {
  room: StreamHealthRoom;

  /**
   * Poll interval (ms)
   */
  pollMs?: number;

  /**
   * Optional endpoint that returns { room } where room includes
   * heartbeatAt/viewerCount/status/updatedAt.
   *
   * Default: /api/live/rooms/:id
   */
  endpoint?: string;

  /**
   * Called when fresh data arrives.
   */
  onUpdate?: (room: StreamHealthRoom) => void;
};

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

function formatCompact(n: number) {
  try {
    return new Intl.NumberFormat(undefined, { notation: "compact" }).format(n);
  } catch {
    return String(n);
  }
}

function formatAgo(iso?: string | null) {
  if (!iso) return "—";
  const t = new Date(iso).getTime();
  if (!Number.isFinite(t)) return "—";
  const ms = Date.now() - t;
  const s = Math.max(0, Math.floor(ms / 1000));
  if (s < 10) return "just now";
  if (s < 60) return `${s}s ago`;
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

function computeStreamStatus(room: StreamHealthRoom): StreamStatus {
  if (!room.streamId || !room.playbackId) return "offline";
  if (room.status === "ended") return "offline";
  if (room.status === "live") return "live";

  // If we have stream ids but room isn't live yet, treat as starting.
  return "starting";
}

function HealthPill({ status }: { status: StreamStatus }) {
  const map: Record<StreamStatus, { label: string; bg: string; ring: string; dot: string }> = {
    unknown: {
      label: "Unknown",
      bg: "rgba(255,255,255,.06)",
      ring: "rgba(255,255,255,.10)",
      dot: "rgba(255,255,255,.55)",
    },
    offline: {
      label: "Offline",
      bg: "rgba(255,255,255,.06)",
      ring: "rgba(255,255,255,.10)",
      dot: "rgba(255,255,255,.55)",
    },
    starting: {
      label: "Starting",
      bg: "rgba(245,158,11,.10)",
      ring: "rgba(245,158,11,.18)",
      dot: "rgba(245,158,11,.95)",
    },
    live: {
      label: "Live",
      bg: "rgba(0,240,255,.12)",
      ring: "rgba(0,240,255,.22)",
      dot: "rgba(0,240,255,.95)",
    },
    ending: {
      label: "Ending",
      bg: "rgba(255,0,208,.10)",
      ring: "rgba(255,0,208,.18)",
      dot: "rgba(255,0,208,.95)",
    },
  };

  const s = map[status];

  return (
    <span
      className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1 text-xs font-semibold text-white/80"
      style={{ background: s.bg, boxShadow: `0 0 0 1px ${s.ring}` }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.dot, boxShadow: `0 0 12px ${s.ring}` }} />
      {s.label}
    </span>
  );
}

function Metric({
  label,
  value,
  hint,
}: {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/20 p-3">
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-1 text-sm font-semibold text-white">{value}</div>
      {hint ? <div className="mt-1 text-xs text-white/55">{hint}</div> : null}
    </div>
  );
}

export default function StreamHealth({
  room: initialRoom,
  pollMs = 5000,
  endpoint,
  onUpdate,
}: Props) {
  const [room, setRoom] = React.useState<StreamHealthRoom>(initialRoom);
  const [err, setErr] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const url = endpoint ?? `/api/live/rooms/${initialRoom.id}`;
  const status = computeStreamStatus(room);

  async function refresh() {
    setLoading(true);
    setErr(null);
    try {
      const res = await fetch(url, { cache: "no-store" });
      const json = await res.json().catch(() => null);

      if (!res.ok) {
        const msg = json?.error?.message || `Request failed (${res.status})`;
        throw new Error(msg);
      }

      const next: StreamHealthRoom =
        (json?.room as StreamHealthRoom) ??
        (json as StreamHealthRoom) ??
        room;

      setRoom(next);
      onUpdate?.(next);
    } catch (e: any) {
      setErr(e?.message ?? "Failed to fetch stream health.");
    } finally {
      setLoading(false);
    }
  }

  React.useEffect(() => {
    // initial sync
    void refresh();

    const id = window.setInterval(() => {
      void refresh();
    }, Math.max(1500, pollMs));

    return () => window.clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url, pollMs]);

  const viewers = Math.max(0, Number(room.viewerCount ?? 0));

  return (
    <div
      className={cx(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_18px_50px_rgba(0,0,0,0.35)]"
      )}
    >
      {/* Glow */}
      <div aria-hidden="true" className="pointer-events-none absolute -inset-14 opacity-70 blur-3xl">
        <div
          className="absolute left-10 top-10 h-40 w-40 rounded-full"
          style={{
            background: "radial-gradient(circle at center, rgba(0,240,255,0.16), transparent 65%)",
          }}
        />
        <div
          className="absolute right-10 bottom-10 h-40 w-40 rounded-full"
          style={{
            background: "radial-gradient(circle at center, rgba(255,0,208,0.12), transparent 65%)",
          }}
        />
      </div>

      <div className="relative">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-semibold text-white">Stream Health</h3>
              <HealthPill status={status} />
            </div>
            <p className="mt-1 text-xs text-white/60">
              Polling live-room data to detect heartbeat, viewers, and status changes.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void refresh()}
            disabled={loading}
            className={cx(
              "inline-flex items-center justify-center rounded-xl px-3 py-2 text-xs font-semibold",
              "border border-white/10 bg-white/5 text-white hover:bg-white/10 transition",
              loading && "opacity-60 cursor-not-allowed hover:bg-white/5"
            )}
          >
            {loading ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        {err ? (
          <div className="mt-4 rounded-xl border border-white/10 bg-[rgba(255,0,208,.08)] px-4 py-3 text-sm text-white/85">
            {err}
          </div>
        ) : null}

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <Metric label="Provider" value={room.streamProvider ?? "—"} hint={room.streamId ? "Stream attached" : "No stream yet"} />
          <Metric label="Viewers" value={formatCompact(viewers)} hint={room.status === "live" ? "Live audience count" : "Not live"} />
          <Metric label="Heartbeat" value={formatAgo(room.heartbeatAt)} hint="Server heartbeat time" />
          <Metric label="Room status" value={room.status} hint={room.updatedAt ? `Updated ${formatAgo(room.updatedAt)}` : "—"} />
        </div>

        <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3">
          <div className="text-xs font-semibold text-white/70">Playback</div>
          <div className="mt-1 truncate font-mono text-[11px] text-white/75">
            {room.playbackId ? `playbackId=${room.playbackId}` : "—"}
          </div>
          <div className="mt-2 text-xs text-white/55">
            If health shows “offline” but you’re streaming in OBS, confirm the ingest URL + stream key in your provider dashboard.
          </div>
        </div>
      </div>
    </div>
  );
}
