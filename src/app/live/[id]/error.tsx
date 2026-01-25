/* ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   ┃ Bidly — Live Route Error Boundary — Devnet-0                           ┃
   ┃ File   : src/app/live/[id]/error.tsx                                   ┃
   ┃ Role   : Client error boundary UI for live room                        ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃
   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ */

"use client";

import * as React from "react";

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const message =
    (error?.message ?? "").trim() || "Something went wrong while loading this live room.";

  return (
    <div className="relative min-h-[70svh] px-4 sm:px-6 lg:px-10 py-14">
      <div className="mx-auto w-full max-w-[960px]">
        <div
          className={cx(
            "rounded-3xl border border-white/10 bg-white/[0.035] backdrop-blur",
            "shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_18px_60px_rgba(0,0,0,0.42)]",
            "p-6 sm:p-8"
          )}
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-1 text-xs text-white/80">
                <span className="h-2 w-2 rounded-full bg-[var(--color-live)]" />
                Live Room
              </div>

              <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                We couldn’t load this room
              </h1>

              <p className="mt-2 text-sm text-white/70">{message}</p>

              {error?.digest ? (
                <p className="mt-2 text-xs text-white/40">Ref: {error.digest}</p>
              ) : null}
            </div>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => reset()}
                className={cx(
                  "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold",
                  "border border-white/12 bg-white/5 text-white/90",
                  "hover:bg-white/10 transition-colors"
                )}
              >
                Try again
              </button>

              <a
                href="/"
                className={cx(
                  "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold",
                  "border border-white/12 bg-black/35 text-white/85",
                  "hover:bg-black/45 transition-colors"
                )}
              >
                Go home
              </a>
            </div>
          </div>

          <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="text-xs uppercase tracking-wider text-white/55">Check</div>
              <div className="mt-1 text-sm font-semibold text-white/85">Network + refresh</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="text-xs uppercase tracking-wider text-white/55">If invited</div>
              <div className="mt-1 text-sm font-semibold text-white/85">Verify the room link</div>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
              <div className="text-xs uppercase tracking-wider text-white/55">Still stuck</div>
              <div className="mt-1 text-sm font-semibold text-white/85">Try again in 30s</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
