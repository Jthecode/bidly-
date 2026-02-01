// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Seller Room Studio Page — Devnet-0                            ┃
   ┃ File   : src/app/(seller)/seller/rooms/[id]/studio/page.tsx            ┃
   ┃ Role   : Seller “Studio” (OBS/RTMP info, status controls, chat tools)  ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                         ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

"use client";

import * as React from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import type { LiveRoom, LiveStatus, PatchRoomRequest, RoomId } from "@/lib/live/types";

type PatchResult = { ok: boolean; room?: LiveRoom | null; error?: string };

function cx(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

function pillClass(active: boolean) {
  return cx(
    "inline-flex items-center justify-center rounded-full px-3 py-1 text-xs font-semibold border transition",
    active ? "bg-white/10 text-white border-white/15" : "bg-white/5 text-white/70 border-white/10 hover:bg-white/8"
  );
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

async function safeJson<T>(res: Response): Promise<T | null> {
  try {
    return (await res.json()) as T;
  } catch {
    return null;
  }
}

async function apiGetRoom(id: RoomId): Promise<LiveRoom | null> {
  const res = await fetch(`/api/live/rooms/${id}`, { cache: "no-store" });
  const data = await safeJson<{ room: LiveRoom | null }>(res);
  if (!res.ok) return null;
  return data?.room ?? null;
}

async function apiPatchRoom(id: RoomId, patch: PatchRoomRequest): Promise<PatchResult> {
  const res = await fetch(`/api/live/rooms/${id}`, {
    method: "PATCH",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(patch),
  });

  const data = await safeJson<{ room: LiveRoom | null; error?: string }>(res);

  if (!res.ok) {
    return { ok: false, room: data?.room ?? null, error: data?.error ?? "Request failed" };
  }
  return { ok: true, room: data?.room ?? null };
}

async function apiHeartbeat(id: RoomId, body?: { status?: LiveStatus; viewers?: number }) {
  await fetch(`/api/live/rooms/${id}/heartbeat`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body ?? {}),
  }).catch(() => {});
}

function StatusPill({ status }: { status: LiveStatus }) {
  const base =
    "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border";
  if (status === "live") {
    return (
      <span className={cx(base, "bg-[var(--color-live)]/15 text-[var(--color-live)] border-[var(--color-live)]/25")}>
        <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-live)] shadow-[0_0_16px_rgba(255,0,208,0.35)]" />
        LIVE
      </span>
    );
  }
  if (status === "starting") {
    return <span className={cx(base, "bg-white/5 text-white/70 border-white/10")}>STARTING</span>;
  }
  if (status === "ended") {
    return <span className={cx(base, "bg-white/5 text-white/65 border-white/10")}>ENDED</span>;
  }
  if (status === "error") {
    return <span className={cx(base, "bg-red-500/10 text-red-200 border-red-500/25")}>ERROR</span>;
  }
  return <span className={cx(base, "bg-white/5 text-white/70 border-white/10")}>OFFLINE</span>;
}

/**
 * Devnet-0 Studio:
 * - Shows room + share link
 * - Lets seller set status (starting/live/offline/ended)
 * - Optional viewers override via heartbeat
 * - Minimal “ingest” placeholder (wire later to Mux/Cloudflare/IVS/Livepeer)
 */
export default function SellerRoomStudioPage() {
  const params = useParams();
  const router = useRouter();

  const id = (typeof params?.id === "string" ? params.id : "").trim() as RoomId;

  const [room, setRoom] = React.useState<LiveRoom | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);
  const [toast, setToast] = React.useState<{ kind: "ok" | "err"; msg: string } | null>(null);

  // Editable fields (Devnet-0 minimal)
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [visibility, setVisibility] = React.useState<LiveRoom["visibility"]>("public");
  const [status, setStatus] = React.useState<LiveStatus>("offline");
  const [coverUrl, setCoverUrl] = React.useState("");
  const [hlsUrl, setHlsUrl] = React.useState("");
  const [posterUrl, setPosterUrl] = React.useState("");
  const [viewers, setViewers] = React.useState<number>(0);

  // heartbeat interval (optional)
  const heartbeatRef = React.useRef<number | null>(null);

  const siteUrl =
    (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/+$/, "") ||
    (typeof window !== "undefined" && window.location?.origin ? window.location.origin : "");
  const publicLink = siteUrl ? `${siteUrl}/live/${id}` : `/live/${id}`;

  React.useEffect(() => {
    let alive = true;

    async function boot() {
      if (!id) return;
      setLoading(true);
      const r = await apiGetRoom(id);
      if (!alive) return;

      setRoom(r);
      setLoading(false);

      if (r) {
        setTitle(r.title ?? "");
        setDescription(r.description ?? "");
        setVisibility(r.visibility ?? "public");
        setStatus(r.status ?? "offline");
        setCoverUrl(r.coverUrl ?? "");
        setHlsUrl(r.playback?.hlsUrl ?? "");
        setPosterUrl(r.playback?.posterUrl ?? "");
        setViewers(typeof r.viewers === "number" ? r.viewers : 0);
      }
    }

    boot();
    return () => {
      alive = false;
    };
  }, [id]);

  React.useEffect(() => {
    // Auto-heartbeat when status is live (Devnet-0 helper)
    if (!id) return;

    if (status === "live") {
      if (heartbeatRef.current != null) return;

      heartbeatRef.current = window.setInterval(() => {
        apiHeartbeat(id, { status: "live", viewers });
      }, 12_000);
    } else {
      if (heartbeatRef.current != null) {
        window.clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }
    }

    return () => {
      if (heartbeatRef.current != null) {
        window.clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }
    };
  }, [id, status, viewers]);

  function showOk(msg: string) {
    setToast({ kind: "ok", msg });
    window.setTimeout(() => setToast(null), 2400);
  }

  function showErr(msg: string) {
    setToast({ kind: "err", msg });
    window.setTimeout(() => setToast(null), 3200);
  }

  async function refresh() {
    if (!id) return;
    const r = await apiGetRoom(id);
    setRoom(r);
  }

  async function savePatch(patch: PatchRoomRequest) {
    if (!id) return;
    setSaving(true);
    const res = await apiPatchRoom(id, patch);
    setSaving(false);

    if (!res.ok) {
      showErr(res.error ?? "Failed to save");
      return;
    }

    const next = res.room ?? null;
    setRoom(next);

    if (next) {
      setTitle(next.title ?? "");
      setDescription(next.description ?? "");
      setVisibility(next.visibility ?? "public");
      setStatus(next.status ?? "offline");
      setCoverUrl(next.coverUrl ?? "");
      setHlsUrl(next.playback?.hlsUrl ?? "");
      setPosterUrl(next.playback?.posterUrl ?? "");
      setViewers(typeof next.viewers === "number" ? next.viewers : 0);
    }

    showOk("Saved");
  }

  async function onSaveDetails(e: React.FormEvent) {
    e.preventDefault();

    const patch: PatchRoomRequest = {
      title: title.trim() || "Untitled Room",
      description: description.trim() || undefined,
      visibility,
      coverUrl: coverUrl.trim() || undefined,
      playback: {
        hlsUrl: hlsUrl.trim() || undefined,
        posterUrl: posterUrl.trim() || undefined,
      },
    };

    await savePatch(patch);
  }

  async function setRoomStatus(next: LiveStatus) {
    setStatus(next);

    // Persist status via PATCH
    await savePatch({ status: next });

    // Also touch heartbeat to bump lastHeartbeatAt (additive, safe)
    await apiHeartbeat(id, { status: next === "live" ? "live" : next, viewers });
  }

  async function bumpViewers(delta: number) {
    const next = clamp(viewers + delta, 0, 5_000_000);
    setViewers(next);

    // Update via heartbeat (doesn't require full PATCH)
    await apiHeartbeat(id, { viewers: next, status: status });
    showOk("Viewers updated");
  }

  if (!id) {
    return (
      <div className="rounded-2xl border border-white/10 bg-black/20 p-6 text-white/80">
        Missing room id.
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-6">
      {/* Top bar */}
      <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold text-white">Studio</span>
              <StatusPill status={status} />
              <span className="text-sm text-white/55">Room</span>
              <span className="font-mono text-sm text-white/75">{id}</span>
            </div>

            <h1 className="mt-2 truncate text-xl font-semibold text-white sm:text-2xl">
              {room?.title ?? (loading ? "Loading…" : "Untitled")}
            </h1>

            <p className="mt-1 truncate text-sm text-white/60">
              {room?.seller?.name ?? "Seller"}{room?.seller?.verified ? " · Verified" : ""}
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Link
              href={`/seller/rooms/${id}`}
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10 transition"
            >
              Back
            </Link>

            <Link
              href={`/live/${id}`}
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10 transition"
            >
              View Public
            </Link>

            <button
              type="button"
              onClick={() => router.refresh()}
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10 transition"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          className={cx(
            "rounded-2xl border px-4 py-3 text-sm backdrop-blur-xl",
            toast.kind === "ok"
              ? "border-white/10 bg-black/20 text-white/80"
              : "border-red-500/25 bg-red-500/10 text-red-100"
          )}
        >
          {toast.msg}
        </div>
      )}

      {/* Main layout */}
      <div className="grid min-w-0 grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        {/* Left: stream + controls */}
        <div className="min-w-0 space-y-4">
          {/* Preview placeholder */}
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/35">
            <div className="aspect-video w-full">
              <div className="flex h-full w-full items-center justify-center text-sm text-white/60">
                STREAM PREVIEW (wire player later)
              </div>
            </div>
          </div>

          {/* Status Controls */}
          <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-white">Go Live</h2>
            <p className="mt-2 text-sm text-white/60">
              Devnet-0 controls. When you integrate a streaming provider, status should
              reflect ingest events.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setRoomStatus("starting")}
                className={pillClass(status === "starting")}
              >
                Starting
              </button>
              <button type="button" onClick={() => setRoomStatus("live")} className={pillClass(status === "live")}>
                Live
              </button>
              <button
                type="button"
                onClick={() => setRoomStatus("offline")}
                className={pillClass(status === "offline")}
              >
                Offline
              </button>
              <button type="button" onClick={() => setRoomStatus("ended")} className={pillClass(status === "ended")}>
                End
              </button>
              <button type="button" onClick={() => setRoomStatus("error")} className={pillClass(status === "error")}>
                Error
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm text-white/70">
              <span className="text-white/55">Viewers:</span>
              <span className="font-mono text-white/85">{viewers.toLocaleString()}</span>
              <div className="ml-auto flex gap-2">
                <button
                  type="button"
                  onClick={() => bumpViewers(-10)}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10"
                >
                  -10
                </button>
                <button
                  type="button"
                  onClick={() => bumpViewers(10)}
                  className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-white hover:bg-white/10"
                >
                  +10
                </button>
              </div>
            </div>
          </div>

          {/* Details form */}
          <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl p-4 sm:p-5">
            <h2 className="text-sm font-semibold text-white">Room settings</h2>

            <form onSubmit={onSaveDetails} className="mt-4 space-y-3">
              <label className="block">
                <span className="text-xs font-semibold text-white/70">Title</span>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-white placeholder:text-white/35 outline-none focus:border-white/20"
                  placeholder="Room title"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-white/70">Description</span>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-white placeholder:text-white/35 outline-none focus:border-white/20"
                  placeholder="What’s happening on this live channel?"
                />
              </label>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-semibold text-white/70">Visibility</span>
                  <select
                    value={visibility}
                    onChange={(e) => setVisibility(e.target.value as any)}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-white outline-none focus:border-white/20"
                  >
                    <option value="public">Public</option>
                    <option value="unlisted">Unlisted</option>
                    <option value="private">Private</option>
                  </select>
                </label>

                <label className="block">
                  <span className="text-xs font-semibold text-white/70">Cover URL</span>
                  <input
                    value={coverUrl}
                    onChange={(e) => setCoverUrl(e.target.value)}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-white placeholder:text-white/35 outline-none focus:border-white/20"
                    placeholder="https://…"
                  />
                </label>
              </div>

              <label className="block">
                <span className="text-xs font-semibold text-white/70">Playback HLS URL</span>
                <input
                  value={hlsUrl}
                  onChange={(e) => setHlsUrl(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-white placeholder:text-white/35 outline-none focus:border-white/20"
                  placeholder="https://…/index.m3u8"
                />
              </label>

              <label className="block">
                <span className="text-xs font-semibold text-white/70">Poster URL</span>
                <input
                  value={posterUrl}
                  onChange={(e) => setPosterUrl(e.target.value)}
                  className="mt-2 w-full rounded-xl border border-white/10 bg-black/35 px-3 py-2 text-sm text-white placeholder:text-white/35 outline-none focus:border-white/20"
                  placeholder="https://…/poster.jpg"
                />
              </label>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="text-xs text-white/55">
                  Status changes are saved immediately. This form saves metadata + playback.
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className={cx(
                    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-lg transition",
                    "disabled:opacity-60 disabled:cursor-not-allowed"
                  )}
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(0,240,255,0.95), rgba(162,0,255,0.95), rgba(255,0,208,0.95))",
                  }}
                >
                  {saving ? "Saving…" : "Save settings"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right: share + ingest */}
        <aside className="min-w-0 space-y-4">
          <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl p-4">
            <h2 className="text-sm font-semibold text-white">Share</h2>
            <p className="mt-2 text-sm text-white/60">
              This is your public viewer link (if visibility allows).
            </p>

            <a
              href={publicLink}
              className="mt-3 block truncate rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/80 hover:bg-black/25"
            >
              {publicLink}
            </a>

            <div className="mt-3 text-xs text-white/45">
              Tip: Set visibility to <span className="text-white/70">unlisted</span> for
              private drops with link-only access.
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl p-4">
            <h2 className="text-sm font-semibold text-white">Ingest (placeholder)</h2>
            <p className="mt-2 text-sm text-white/60">
              Wire to Mux / Cloudflare Stream / AWS IVS / Livepeer later.
              For Devnet-0, keep this UI stable.
            </p>

            <div className="mt-3 space-y-2 text-sm text-white/70">
              <p>
                <span className="text-white/55">RTMP URL:</span>{" "}
                <span className="font-mono text-white/80">—</span>
              </p>
              <p>
                <span className="text-white/55">Stream Key:</span>{" "}
                <span className="font-mono text-white/80">—</span>
              </p>
              <p className="text-xs text-white/45 pt-1">
                Never expose real stream keys in a public API.
              </p>
            </div>

            <button
              type="button"
              onClick={() => refresh().then(() => showOk("Refreshed"))}
              className="mt-4 inline-flex w-full items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10 transition"
            >
              Refresh room data
            </button>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/10 p-4 text-sm text-white/60">
            <p className="font-semibold text-white/80">Next</p>
            <p className="mt-1">
              When auth is wired, only the seller should access Studio, and heartbeat
              should require a broadcaster token.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
