// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Category Loading — Devnet-0                                   ┃
   ┃ File   : src/app/categories/[slug]/loading.tsx                         ┃
   ┃ Role   : Route loading skeleton for category pages                      ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

export default function Loading() {
  return (
    <div className="relative mx-auto w-full max-w-[1440px] px-6 py-12">
      {/* Header skeleton */}
      <div className="mb-10">
        <div className="h-7 w-40 rounded-lg bg-white/10" />
        <div className="mt-3 h-4 w-[420px] max-w-full rounded-lg bg-white/10" />
        <div className="mt-2 h-4 w-[320px] max-w-full rounded-lg bg-white/10" />
      </div>

      <div className="mb-10 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 gap-x-7 gap-y-9 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 sm:gap-x-8 sm:gap-y-10 items-start auto-rows-max min-w-0 [&>*]:min-w-0">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.035] backdrop-blur shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_14px_44px_rgba(0,0,0,0.38)]"
          >
            {/* media */}
            <div className="relative w-full bg-black/30" style={{ aspectRatio: "16 / 10" }}>
              <div className="absolute inset-0 animate-pulse bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
              <div className="absolute left-3 top-3 h-5 w-14 rounded-full bg-white/10" />
            </div>

            {/* content */}
            <div className="p-4">
              <div className="h-3 w-24 rounded bg-white/10" />
              <div className="mt-2 h-5 w-3/4 rounded bg-white/10" />
              <div className="mt-4 flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-white/10" />
                <div className="min-w-0 flex-1">
                  <div className="h-4 w-32 rounded bg-white/10" />
                  <div className="mt-2 h-3 w-20 rounded bg-white/10" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
