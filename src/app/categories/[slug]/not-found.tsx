// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Category Not Found — Devnet-0                                 ┃
   ┃ File   : src/app/categories/[slug]/not-found.tsx                       ┃
   ┃ Role   : Category 404 experience (cyber-luxury, helpful routing)       ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import Link from "next/link";
import { CATEGORIES, categoryHref } from "@/app/categories/category.data";

export default function NotFound() {
  return (
    <div className="relative mx-auto w-full max-w-[1100px] px-6 py-16">
      <div className="rounded-3xl border border-white/10 bg-white/[0.035] p-8 backdrop-blur shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_22px_70px_rgba(0,0,0,0.55)]">
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-[11px] font-semibold text-white/80">
              <span className="h-2 w-2 rounded-full bg-[var(--color-live)]" />
              CATEGORY NOT FOUND
            </div>

            <h1 className="mt-4 text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
              This category doesn’t exist
            </h1>

            <p className="mt-2 max-w-[62ch] text-sm md:text-base text-[var(--color-text-muted)]">
              The category slug in the URL is not recognized. Choose a valid
              category below or return to the categories index.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-3">
              <Link
                href="/categories"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white/90 backdrop-blur transition-colors hover:bg-white/10"
              >
                View all categories
              </Link>

              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-black/35 px-4 py-2 text-sm font-semibold text-white/80 backdrop-blur transition-colors hover:bg-black/45"
              >
                Back to home
              </Link>
            </div>
          </div>

          <div className="shrink-0 rounded-2xl border border-white/10 bg-black/30 p-4 backdrop-blur">
            <div className="text-[10px] uppercase tracking-wider text-white/55">
              Tips
            </div>
            <ul className="mt-2 space-y-2 text-sm text-white/75">
              <li>• Check spelling in the URL</li>
              <li>• Use a category from the list</li>
              <li>• Try the categories index</li>
            </ul>
          </div>
        </div>

        <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="mt-6">
          <div className="text-xs font-semibold text-white/70">
            Available categories
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={categoryHref(c.slug)}
                className="group min-w-0 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur transition-colors hover:bg-white/[0.06]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate text-base font-semibold text-white/90">
                      {c.label}
                    </div>
                    <div className="mt-1 line-clamp-2 text-sm text-white/60">
                      {c.description}
                    </div>
                  </div>

                  <span
                    aria-hidden="true"
                    className="shrink-0 rounded-xl border border-white/10 bg-black/35 px-3 py-1.5 text-xs font-semibold text-white/80 transition-colors group-hover:bg-black/45"
                  >
                    Open
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
