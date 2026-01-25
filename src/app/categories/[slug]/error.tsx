"use client";

// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Category Error Boundary — Devnet-0                             ┃
   ┃ File   : src/app/categories/[slug]/error.tsx                           ┃
   ┃ Role   : Friendly route-level error UI for category pages              ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import * as React from "react";
import Link from "next/link";

type Props = {
  error: Error & { digest?: string };
  reset: () => void;
};

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

export default function ErrorBoundary({ error, reset }: Props) {
  const message =
    (error?.message ?? "").trim() ||
    "Something went wrong while loading this category.";

  return (
    <div className="relative mx-auto w-full max-w-[1100px] px-6 py-16">
      <div
        className={cx(
          "overflow-hidden rounded-3xl border border-white/10 bg-white/[0.035] backdrop-blur",
          "shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_18px_60px_rgba(0,0,0,0.45)]"
        )}
      >
        <div className="p-8 sm:p-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-1 text-[11px] font-semibold text-white/80">
                <span className="h-2 w-2 rounded-full bg-[var(--color-live)]" />
                CATEGORY ERROR
              </div>

              <h1 className="mt-4 text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                We couldn’t load this category
              </h1>

              <p className="mt-2 text-sm text-white/70 max-w-2xl">{message}</p>

              {error?.digest ? (
                <p className="mt-2 text-xs text-white/45">
                  Error ID: <span className="font-mono">{error.digest}</span>
                </p>
              ) : null}
            </div>

            <div className="flex shrink-0 items-center gap-3">
              <button
                type="button"
                onClick={reset}
                className={cx(
                  "rounded-xl px-4 py-2 text-sm font-semibold",
                  "border border-white/12 bg-white/5 text-white/90",
                  "hover:bg-white/10 transition-colors"
                )}
              >
                Try again
              </button>

              <Link
                href="/categories"
                className={cx(
                  "rounded-xl px-4 py-2 text-sm font-semibold",
                  "border border-white/12 bg-black/35 text-white/90",
                  "hover:bg-black/45 transition-colors"
                )}
              >
                All categories
              </Link>
            </div>
          </div>

          <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          <div className="mt-6 flex flex-col gap-3 text-sm text-white/70">
            <p className="leading-relaxed">
              If this keeps happening, double-check the category slug in the URL
              and make sure it exists in{" "}
              <span className="font-mono text-white/80">category.data.ts</span>.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="text-white/80 hover:text-white transition-colors underline underline-offset-4"
              >
                Back to Live
              </Link>
              <span className="text-white/20">•</span>
              <Link
                href="/categories"
                className="text-white/80 hover:text-white transition-colors underline underline-offset-4"
              >
                Browse categories
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
