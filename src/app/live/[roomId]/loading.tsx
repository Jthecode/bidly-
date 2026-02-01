// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Live Route Loading — Devnet-0                                 ┃
   ┃ File   : src/app/live/[roomId]/loading.tsx                            ┃
   ┃ Role   : Suspense loading state for live room                         ┃
   ┃ Status : Devnet-0 Ready                                               ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)      ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                       ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import * as React from "react";

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "animate-pulse rounded-2xl border border-white/10 bg-white/[0.04]",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_18px_60px_rgba(0,0,0,0.35)]",
        className
      )}
      aria-hidden="true"
    />
  );
}

export default function Loading() {
  return (
    <div className="relative min-h-[70svh] px-4 sm:px-6 lg:px-10 py-10">
      <div className="mx-auto w-full max-w-[1440px]">
        {/* Top bar */}
        <div className="flex items-start justify-between gap-6">
          <div className="min-w-0">
            <Skeleton className="h-8 w-[260px] sm:w-[320px]" />
            <Skeleton className="mt-3 h-4 w-[220px] sm:w-[360px]" />
          </div>
          <div className="hidden sm:flex items-center gap-3">
            <Skeleton className="h-9 w-[140px]" />
            <Skeleton className="h-9 w-[110px]" />
          </div>
        </div>

        <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Main layout: stage + sidebar */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          {/* Stage */}
          <div className="min-w-0">
            <Skeleton className="aspect-video w-full" />

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </div>

            {/* Action bar */}
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Skeleton className="h-10 w-[140px]" />
              <Skeleton className="h-10 w-[160px]" />
              <Skeleton className="h-10 w-[120px]" />
              <Skeleton className="h-10 w-[200px]" />
            </div>
          </div>

          {/* Sidebar */}
          <aside className="min-w-0">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="mt-5 h-[420px] w-full" />
            <Skeleton className="mt-5 h-14 w-full" />
          </aside>
        </div>
      </div>
    </div>
  );
}
