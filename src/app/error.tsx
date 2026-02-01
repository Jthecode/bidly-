// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Global Error Boundary — Devnet-0                              ┃
   ┃ File   : src/app/error.tsx                                            ┃
   ┃ Role   : App-level error UI (cyber-luxury, production-safe)           ┃
   ┃ Status : Devnet-0 Ready                                               ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)      ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                       ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

"use client";

import * as React from "react";
import Link from "next/link";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

function safeMessage(err: unknown) {
  if (!err) return "Something went wrong.";
  const msg = (err as any)?.message;
  return typeof msg === "string" && msg.trim().length ? msg : "Something went wrong.";
}

export default function GlobalError({ error, reset }: Props) {
  const [showDetails, setShowDetails] = React.useState(false);

  const message = safeMessage(error);
  const digest = typeof error?.digest === "string" ? error.digest : undefined;

  return (
    <main className="relative min-h-[100svh] px-4 py-12">
      {/* Ambient blobs (keeps the cyber-luxury vibe even on error screens) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-[rgba(0,240,255,0.14)] blur-3xl" />
        <div className="absolute -right-28 bottom-10 h-80 w-80 rounded-full bg-[rgba(162,0,255,0.12)] blur-3xl" />
        <div className="absolute right-10 top-28 h-64 w-64 rounded-full bg-[rgba(255,0,208,0.10)] blur-3xl" />
      </div>

      <div className="mx-auto w-full max-w-[920px]">
        <div
          className={cx(
            "rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl",
            "shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_28px_100px_rgba(0,0,0,0.55)]",
            "overflow-hidden"
          )}
        >
          {/* Top neon accent */}
          <div className="h-1 bg-gradient-to-r from-[#00f0ff] via-[#a200ff] to-[#ff00d0]" />

          <div className="p-6 sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-wider text-white/60">Bidly</p>
                <h1 className="mt-2 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                  We hit a snag.
                </h1>
                <p className="mt-2 text-sm sm:text-base text-white/70">{message}</p>

                {digest ? (
                  <p className="mt-2 text-xs text-white/45">
                    Error digest: <span className="font-mono">{digest}</span>
                  </p>
                ) : null}
              </div>

              <div className="flex shrink-0 flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => reset()}
                  className={cx(
                    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold",
                    "bg-gradient-to-r from-[#00f0ff] via-[#a200ff] to-[#ff00d0] text-white",
                    "shadow-lg transition hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-[rgba(0,240,255,0.45)]"
                  )}
                >
                  Try again
                </button>

                <Link
                  href="/"
                  className={cx(
                    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold",
                    "border border-white/10 bg-black/20 text-white/80 backdrop-blur",
                    "transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  )}
                >
                  Back home
                </Link>

                <button
                  type="button"
                  onClick={() => setShowDetails((v) => !v)}
                  className={cx(
                    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold",
                    "border border-white/10 bg-black/10 text-white/70 backdrop-blur",
                    "transition hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20"
                  )}
                  aria-expanded={showDetails}
                >
                  {showDetails ? "Hide details" : "Show details"}
                </button>
              </div>
            </div>

            {showDetails ? (
              <div className="mt-6 rounded-2xl border border-white/10 bg-black/25 p-4">
                <p className="text-xs font-semibold text-white/70">Debug details</p>
                <pre className="mt-2 max-h-[320px] overflow-auto whitespace-pre-wrap break-words text-[11px] leading-relaxed text-white/70">
                  {String(error?.stack ?? error?.message ?? error)}
                </pre>
              </div>
            ) : null}

            <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                <p className="text-xs text-white/60">Tip</p>
                <p className="mt-1 text-sm text-white/75">
                  If this repeats, clear <span className="font-mono">.next</span> and rebuild.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                <p className="text-xs text-white/60">DB</p>
                <p className="mt-1 text-sm text-white/75">
                  Verify <span className="font-mono">DATABASE_URL</span> + migrations.
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/15 p-4">
                <p className="text-xs text-white/60">Realtime</p>
                <p className="mt-1 text-sm text-white/75">
                  Confirm <span className="font-mono">ABLY_API_KEY</span> + auth route.
                </p>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-white/45">
          Bidly • Devnet-0 • cyber-luxury reliability layer
        </p>
      </div>
    </main>
  );
}
