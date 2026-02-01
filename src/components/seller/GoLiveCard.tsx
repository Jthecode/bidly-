// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Seller (Go Live Card) — Devnet-0                                ┃
   ┃ File   : src/components/seller/GoLiveCard.tsx                           ┃
   ┃ Role   : Seller action card to create stream + start/stop live room     ┃
   ┃ Status : Devnet-0 Ready                                                 ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)        ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                         ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

"use client";

import * as React from "react";

type RoomStatus = "draft" | "scheduled" | "live" | "ended";

export type GoLiveRoom = {
  id: string;
  title: string;
  status: RoomStatus;

  streamProvider?: string | null;
  streamId?: string | null;
  playbackId?: string | null;

  viewerCount?: number | null;
  heartbeatAt?: string | null; // ISO
  updatedAt?: string | null; // ISO
};

type Props = {
  room: GoLiveRoom;

  /**
   * Optional callback after actions complete (refresh, revalidate, etc.)
   */
  onUpdated?: () => void;
};

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

async function postJson(url: string, body: any) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body ?? {}),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = json?.error?.message || json?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return json;
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
  const ms = Date.now() - new Date(iso).getTime();
  if (!Number.isFinite(ms)) return "—";
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

function StatusChip({ status }: { status: RoomStatus }) {
  const map: Record<RoomStatus, { label: string; bg: string; ring: string; dot: string }> = {
    draft: {
      label: "Draft",
      bg: "rgba(255,255,255,.06)",
      ring: "rgba(255,255,255,.10)",
      dot: "rgba(255,255,255,.55)",
    },
    scheduled: {
      label: "Scheduled",
      bg: "rgba(245,158,11,.10)",
      ring: "rgba(245,158,11,.18)",
      dot: "rgba(245,158,11,.95)",
    },
    live: {
      label: "LIVE",
      bg: "rgba(0,240,255,.12)",
      ring: "rgba(0,240,255,.22)",
      dot: "rgba(0,240,255,.95)",
    },
    ended: {
      label: "Ended",
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

function PrimaryButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "inline-flex w-full items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold",
        "bg-[linear-gradient(90deg,rgba(0,240,255,.95),rgba(162,0,255,.95))] text-black",
        "shadow-[0_10px_30px_rgba(0,240,255,0.18)]",
        "hover:opacity-95 transition",
        disabled && "opacity-60 cursor-not-allowed hover:opacity-60"
      )}
    >
      {children}
    </button>
  );
}

function GhostButton({
  children,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "inline-flex w-full items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold",
        "border border-white/10 bg-white/5 text-white",
        "hover:bg-white/10 transition",
        disabled && "opacity-60 cursor-not-allowed hover:bg-white/5"
      )}
    >
      {children}
    </button>
  );
}

/**
 * GoLiveCard
 * - Create stream (if missing) via /api/stream/create
 * - Mark room live via PATCH /api/live/rooms/:id (or your room status endpoint)
 * - End room via /api/rooms/:id/end
 *
 * NOTE:
 * This component is intentionally endpoint-flexible:
 * - If you already have /api/live/rooms/:id PATCH wired, it uses it.
 * - Otherwise, it can still create the stream and provide playbackId.
 */
export default function GoLiveCard({ room, onUpdated }: Props) {
  const [busy, setBusy] = React.useState<null | "create" | "live" | "end">(null);
  const [error, setError] = React.useState<string | null>(null);

  const viewers = Math.max(0, Number(room.viewerCount ?? 0));
  const hasStream = Boolean(room.playbackId && room.streamId);

  async function createStreamIfNeeded() {
    if (hasStream) return;

    setBusy("create");
    setError(null);
    try {
      await postJson("/api/stream/create", {
        roomId: room.id,
        name: room.title ? `Bidly • ${room.title}` : `Bidly Room ${room.id}`,
        metadata: { roomId: room.id },
        latencyMode: "standard",
        playbackPolicy: "public",
      });
      onUpdated?.();
    } catch (e: any) {
      setError(e?.message ?? "Failed to create stream.");
    } finally {
      setBusy(null);
    }
  }

  async function goLive() {
    setBusy("live");
    setError(null);
    try {
      // Preferred: mark room live via your live rooms PATCH endpoint (from earlier stack).
      // If your endpoint differs, change this URL.
      await fetch(`/api/live/rooms/${room.id}`, {
        method: "PATCH",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ status: "live" }),
      }).then(async (res) => {
        const j = await res.json().catch(() => null);
        if (!res.ok) throw new Error(j?.error?.message || `Request failed (${res.status})`);
      });

      onUpdated?.();
    } catch (e: any) {
      setError(e?.message ?? "Failed to go live.");
    } finally {
      setBusy(null);
    }
  }

  async function endRoom() {
    setBusy("end");
    setError(null);
    try {
      await postJson(`/api/rooms/${room.id}/end`, {});
      onUpdated?.();
    } catch (e: any) {
      setError(e?.message ?? "Failed to end room.");
    } finally {
      setBusy(null);
    }
  }

  const canCreateStream = !hasStream;
  const canGoLive = hasStream && room.status !== "live" && room.status !== "ended";
  const canEnd = room.status === "live";

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
          className="absolute left-8 top-6 h-44 w-44 rounded-full"
          style={{
            background: "radial-gradient(circle at center, rgba(0,240,255,0.18), transparent 65%)",
          }}
        />
        <div
          className="absolute right-10 bottom-6 h-44 w-44 rounded-full"
          style={{
            background: "radial-gradient(circle at center, rgba(162,0,255,0.16), transparent 65%)",
          }}
        />
      </div>

      <div className="relative">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="truncate text-sm font-semibold text-white">Go Live</h3>
              <StatusChip status={room.status} />
            </div>
            <p className="mt-1 text-xs text-white/60">
              Create your stream, then start your live room when you’re ready.
            </p>
          </div>

          <div className="shrink-0 text-right">
            <div className="text-xs text-white/60">Viewers</div>
            <div className="text-lg font-semibold text-white">{formatCompact(viewers)}</div>
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3">
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <div className="text-white/60">Provider</div>
              <div className="mt-1 font-semibold text-white/90">
                {room.streamProvider ?? (hasStream ? "mux" : "—")}
              </div>
            </div>

            <div>
              <div className="text-white/60">Playback ID</div>
              <div className="mt-1 truncate font-mono text-[11px] text-white/80">
                {room.playbackId ?? "—"}
              </div>
            </div>

            <div>
              <div className="text-white/60">Heartbeat</div>
              <div className="mt-1 font-semibold text-white/80">
                {formatAgo(room.heartbeatAt)}
              </div>
            </div>

            <div>
              <div className="text-white/60">Updated</div>
              <div className="mt-1 font-semibold text-white/80">
                {formatAgo(room.updatedAt)}
              </div>
            </div>
          </div>
        </div>

        {error ? (
          <div className="mt-4 rounded-xl border border-white/10 bg-[rgba(255,0,208,.08)] px-4 py-3 text-sm text-white/85">
            {error}
          </div>
        ) : null}

        <div className="mt-4 grid gap-2">
          {canCreateStream ? (
            <PrimaryButton onClick={createStreamIfNeeded} disabled={busy !== null}>
              {busy === "create" ? "Creating stream…" : "Create stream"}
            </PrimaryButton>
          ) : (
            <PrimaryButton onClick={goLive} disabled={!canGoLive || busy !== null}>
              {busy === "live" ? "Starting…" : room.status === "live" ? "Live now" : "Go live"}
            </PrimaryButton>
          )}

          <GhostButton onClick={endRoom} disabled={!canEnd || busy !== null}>
            {busy === "end" ? "Ending…" : "End stream"}
          </GhostButton>
        </div>

        <div className="mt-4 text-xs text-white/55">
          Tip: Stream keys and ingest URLs are stored server-side only. Your OBS uses the ingest + key from the dashboard,
          not the browser.
        </div>
      </div>
    </div>
  );
}
