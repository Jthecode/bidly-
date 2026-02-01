// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Seller (Rooms Table) — Devnet-0                                 ┃
   ┃ File   : src/components/seller/RoomsTable.tsx                           ┃
   ┃ Role   : Seller dashboard rooms table (live status + actions)           ┃
   ┃ Status : Devnet-0 Ready                                                 ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)        ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                         ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

"use client";

import * as React from "react";
import Link from "next/link";

type RoomStatus = "draft" | "scheduled" | "live" | "ended";

export type RoomRow = {
  id: string;
  title: string;
  status: RoomStatus;
  viewerCount?: number | null;
  scheduledFor?: string | null; // ISO
  updatedAt?: string | null; // ISO
};

export type RoomsTableProps = {
  rooms: RoomRow[];
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

function formatDateTime(iso?: string | null) {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString();
}

function StatusPill({ status }: { status: RoomStatus }) {
  const map: Record<RoomStatus, { label: string; ring: string; bg: string; dot: string }> = {
    draft: {
      label: "Draft",
      ring: "rgba(255,255,255,.10)",
      bg: "rgba(255,255,255,.06)",
      dot: "rgba(255,255,255,.55)",
    },
    scheduled: {
      label: "Scheduled",
      ring: "rgba(245,158,11,.18)",
      bg: "rgba(245,158,11,.10)",
      dot: "rgba(245,158,11,.95)",
    },
    live: {
      label: "Live",
      ring: "rgba(0,240,255,.22)",
      bg: "rgba(0,240,255,.12)",
      dot: "rgba(0,240,255,.95)",
    },
    ended: {
      label: "Ended",
      ring: "rgba(255,0,208,.18)",
      bg: "rgba(255,0,208,.10)",
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

function ActionButton({
  children,
  href,
  onClick,
  tone = "neutral",
}: {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  tone?: "primary" | "danger" | "neutral";
}) {
  const cls =
    tone === "primary"
      ? "bg-[linear-gradient(90deg,rgba(0,240,255,.95),rgba(162,0,255,.95))] text-black"
      : tone === "danger"
      ? "bg-[linear-gradient(90deg,rgba(255,0,208,.92),rgba(245,158,11,.92))] text-black"
      : "border border-white/10 bg-white/5 text-white hover:bg-white/10";

  const base = cx(
    "inline-flex items-center justify-center rounded-xl px-3 py-2 text-xs font-semibold",
    "transition shadow-[0_10px_28px_rgba(0,0,0,0.35)]",
    cls
  );

  if (href) {
    return (
      <Link href={href} className={base}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={base}>
      {children}
    </button>
  );
}

async function postJson(url: string, body: any) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => null);
  if (!res.ok) {
    const msg = json?.error?.message || json?.message || `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return json;
}

export default function RoomsTable({ rooms }: RoomsTableProps) {
  const [ending, setEnding] = React.useState<string | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  async function endRoom(roomId: string) {
    setError(null);
    setEnding(roomId);
    try {
      // If you haven't created this endpoint yet, you can change/remove this.
      await postJson(`/api/rooms/${roomId}/end`, {});
      // Quick refresh
      window.location.reload();
    } catch (e: any) {
      setError(e?.message ?? "Failed to end room.");
    } finally {
      setEnding(null);
    }
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-white">Rooms</h2>
          <p className="mt-1 text-xs text-white/60">
            Create, schedule, go live, and manage your rooms.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <ActionButton href="/seller/rooms/new" tone="neutral">
            Create
          </ActionButton>
          <ActionButton href="/seller/rooms" tone="primary">
            Manage
          </ActionButton>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl border border-white/10 bg-[rgba(255,0,208,.08)] px-4 py-3 text-sm text-white/85">
          {error}
        </div>
      ) : null}

      {/* Table wrapper */}
      <div
        className={cx(
          "overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur",
          "shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_18px_50px_rgba(0,0,0,0.35)]"
        )}
      >
        <div className="overflow-x-auto">
          <table className="min-w-[760px] w-full">
            <thead className="bg-black/25">
              <tr className="text-left text-xs font-semibold tracking-wide text-white/70">
                <th className="px-4 py-3">Room</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Viewers</th>
                <th className="px-4 py-3">Scheduled</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/10">
              {rooms.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center">
                    <div className="text-sm font-semibold text-white/85">
                      No rooms yet
                    </div>
                    <div className="mt-1 text-xs text-white/60">
                      Create your first room to start selling live.
                    </div>
                    <div className="mt-4 flex justify-center">
                      <ActionButton href="/seller/rooms/new" tone="primary">
                        Create room
                      </ActionButton>
                    </div>
                  </td>
                </tr>
              ) : (
                rooms.map((r) => {
                  const viewers = Math.max(0, Number(r.viewerCount ?? 0));
                  return (
                    <tr key={r.id} className="hover:bg-white/5 transition">
                      <td className="px-4 py-4">
                        <div className="min-w-0">
                          <div className="truncate text-sm font-semibold text-white">
                            {r.title}
                          </div>
                          <div className="mt-1 text-xs text-white/50">
                            {r.id}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <StatusPill status={r.status} />
                      </td>

                      <td className="px-4 py-4">
                        <span className="text-sm font-semibold text-white">
                          {formatCompact(viewers)}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-sm text-white/75">
                        {formatDateTime(r.scheduledFor)}
                      </td>

                      <td className="px-4 py-4 text-sm text-white/75">
                        {formatDateTime(r.updatedAt)}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex justify-end gap-2">
                          <ActionButton href={`/seller/rooms/${r.id}`} tone="neutral">
                            Open
                          </ActionButton>

                          {r.status !== "ended" ? (
                            <ActionButton
                              onClick={() => endRoom(r.id)}
                              tone="danger"
                            >
                              {ending === r.id ? "Ending…" : "End"}
                            </ActionButton>
                          ) : (
                            <ActionButton href={`/seller/rooms/${r.id}`} tone="neutral">
                              View
                            </ActionButton>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="flex items-center justify-between gap-4 px-4 py-3 text-xs text-white/60">
          <span>{rooms.length} rooms</span>
          <span className="hidden sm:inline">
            Tip: Use “End” to stop the stream and close the room.
          </span>
        </div>
      </div>
    </div>
  );
}
