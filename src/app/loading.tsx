// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Global Loading UI — Devnet-0                                  ┃
   ┃ File   : src/app/loading.tsx                                          ┃
   ┃ Role   : App-wide loading fallback (cyber-luxury skeleton state)      ┃
   ┃ Status : Devnet-0 Ready                                               ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)      ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                       ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import * as React from "react";

import Backdrop from "@/components/layout/Backdrop";
import Container from "@/components/layout/Container";
import Skeleton from "@/components/ui/Skeleton";

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

function GlowDivider() {
  return (
    <div
      aria-hidden="true"
      className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
    />
  );
}

function Card(props: { className?: string; children: React.ReactNode }) {
  return (
    <div
      className={cx(
        "rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl",
        "shadow-[0_22px_70px_rgba(0,0,0,0.35)]",
        props.className
      )}
    >
      {props.children}
    </div>
  );
}

export default function Loading() {
  return (
    <div className="relative min-h-[100svh]">
      <Backdrop />

      <Container className="relative py-10" size="full">
        <div className="mx-auto max-w-6xl">
          {/* Header skeleton */}
          <div className="flex items-end justify-between gap-4">
            <div className="min-w-0 space-y-3">
              <Skeleton className="h-3 w-28 rounded-full" />
              <Skeleton className="h-10 w-[320px] max-w-full rounded-2xl" />
              <Skeleton className="h-4 w-[520px] max-w-full rounded-xl" />
            </div>

            <div className="hidden sm:block">
              <Skeleton className="h-10 w-32 rounded-xl" />
            </div>
          </div>

          <div className="mt-8">
            <GlowDivider />
          </div>

          {/* Main grid skeleton (rooms grid vibe) */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
              <Card key={i} className="overflow-hidden">
                {/* Cover */}
                <div className="relative aspect-[16/10] w-full">
                  <Skeleton className="absolute inset-0 rounded-none" />
                  <div className="absolute left-4 top-4">
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 space-y-4">
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-[85%] rounded-xl" />
                    <Skeleton className="h-4 w-[70%] rounded-xl" />
                  </div>

                  <div className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-xl" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <Skeleton className="h-4 w-[55%] rounded-lg" />
                      <Skeleton className="h-3 w-[35%] rounded-lg" />
                    </div>
                    <Skeleton className="h-8 w-20 rounded-full" />
                  </div>

                  <div className="flex gap-2">
                    <Skeleton className="h-7 w-20 rounded-full" />
                    <Skeleton className="h-7 w-16 rounded-full" />
                    <Skeleton className="h-7 w-24 rounded-full" />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Footer hint */}
          <div className="mt-10 flex items-center justify-center">
            <div className="rounded-full border border-white/10 bg-black/20 px-4 py-2 text-xs text-white/60 backdrop-blur">
              Loading Bidly…
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
