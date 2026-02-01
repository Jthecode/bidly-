// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Live Room (Video Player) — Devnet-0                             ┃
   ┃ File   : src/components/live/VideoPlayer.tsx                            ┃
   ┃ Role   : Mux playback wrapper (safe client player w/ fallback states)   ┃
   ┃ Status : Devnet-0 Ready                                                 ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)        ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                         ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

"use client";

import * as React from "react";

// If you install Mux Player React, uncomment:
// import MuxPlayer from "@mux/mux-player-react";

type Props = {
  /**
   * Mux playback id (safe for clients).
   * Example: "abc123xyz"
   */
  playbackId: string | null;

  /**
   * Optional poster URL (for non-mux fallback).
   */
  posterUrl?: string;

  /**
   * Autoplay default off to avoid aggressive behavior on mobile.
   */
  autoPlay?: boolean;

  /**
   * Start muted by default (allows autoplay in many browsers).
   */
  muted?: boolean;
};

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

export default function VideoPlayer({
  playbackId,
  posterUrl,
  autoPlay = false,
  muted = true,
}: Props) {
  // Basic player state for nicer UI.
  const [ready, setReady] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // If playback id changes, reset state.
  React.useEffect(() => {
    setReady(false);
    setError(null);
  }, [playbackId]);

  if (!playbackId) {
    return (
      <div
        className={cx(
          "relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur",
          "shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_18px_50px_rgba(0,0,0,0.35)]"
        )}
      >
        <div className="aspect-video w-full grid place-items-center px-6 py-10">
          <div className="max-w-md text-center">
            <div className="text-sm font-semibold text-white">Stream not ready</div>
            <p className="mt-1 text-xs text-white/65">
              This room doesn’t have a playback ID yet. The seller may still be starting the stream.
            </p>
          </div>
        </div>
      </div>
    );
  }

  /**
   * MVP approach (no extra dependency):
   * Use Mux HLS URL directly in a native <video> tag.
   *
   * Note: Many browsers need HLS support (Safari supports; Chrome often needs MSE/HLS.js).
   * For production, install @mux/mux-player-react (recommended) which handles HLS cleanly.
   */
  const hlsSrc = `https://stream.mux.com/${playbackId}.m3u8`;

  return (
    <div
      className={cx(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_18px_50px_rgba(0,0,0,0.35)]"
      )}
    >
      {/* Glow */}
      <div aria-hidden="true" className="pointer-events-none absolute -inset-12 opacity-75 blur-3xl">
        <div
          className="absolute left-10 top-10 h-40 w-40 rounded-full"
          style={{
            background: "radial-gradient(circle at center, rgba(0,240,255,0.16), transparent 65%)",
          }}
        />
        <div
          className="absolute right-10 bottom-10 h-40 w-40 rounded-full"
          style={{
            background: "radial-gradient(circle at center, rgba(162,0,255,0.12), transparent 65%)",
          }}
        />
      </div>

      <div className="relative">
        {/* If you prefer the official Mux Player React, replace the <video> with:
            <MuxPlayer
              streamType="live"
              playbackId={playbackId}
              autoPlay={autoPlay}
              muted={muted}
              onCanPlay={() => setReady(true)}
              onError={() => setError("Playback error.")}
              style={{ width: "100%", aspectRatio: "16 / 9" }}
            />
        */}

        <video
          className="aspect-video w-full"
          controls
          playsInline
          muted={muted}
          autoPlay={autoPlay}
          poster={posterUrl}
          onCanPlay={() => setReady(true)}
          onError={() => setError("Playback error. Check playbackId / stream state.")}
        >
          <source src={hlsSrc} type="application/x-mpegURL" />
        </video>

        {/* Overlay: status */}
        <div className="absolute left-4 top-4 flex items-center gap-2">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/55 px-3 py-1 text-xs font-semibold text-white/85 backdrop-blur">
            <span className="h-2 w-2 rounded-full bg-[var(--bidly-neon-cyan,#00f0ff)] shadow-[0_0_14px_rgba(0,240,255,.45)]" />
            LIVE
          </span>

          {!ready ? (
            <span className="rounded-full border border-white/10 bg-black/45 px-3 py-1 text-xs text-white/70 backdrop-blur">
              Loading…
            </span>
          ) : null}
        </div>

        {/* Overlay: error */}
        {error ? (
          <div className="absolute inset-x-4 bottom-4 rounded-xl border border-white/10 bg-[rgba(255,0,208,.12)] px-4 py-3 text-sm text-white/85 backdrop-blur">
            {error}
          </div>
        ) : null}
      </div>
    </div>
  );
}
