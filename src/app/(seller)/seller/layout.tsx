// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Seller Layout — Devnet-0                                      ┃
   ┃ File   : src/app/(seller)/seller/layout.tsx                            ┃
   ┃ Role   : Shared shell for seller dashboard routes                      ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                         ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import * as React from "react";
import Link from "next/link";

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

const nav = [
  { href: "/seller", label: "Overview" },
  { href: "/seller/onboarding", label: "Onboarding" },
  { href: "/seller/rooms", label: "Rooms" },
];

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-w-0">
      {/* Seller Header */}
      <header
        className={cx(
          "min-w-0",
          "mb-6",
          "rounded-2xl",
          "border border-white/10",
          "bg-black/20",
          "backdrop-blur-xl",
          "shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_24px_80px_rgba(0,0,0,0.35)]"
        )}
      >
        <div className="flex min-w-0 flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <div className="min-w-0">
            <p className="text-xs font-semibold tracking-wide text-white/55">
              Seller Dashboard
            </p>
            <h1 className="mt-1 truncate text-lg font-semibold text-white sm:text-xl">
              Manage your live channels
            </h1>
            <p className="mt-1 truncate text-sm text-white/60">
              Rooms, studio, drops — seller-first.
            </p>
          </div>

          {/* Quick actions */}
          <div className="flex shrink-0 flex-wrap items-center gap-2">
            <Link
              href="/seller/rooms/new"
              className={cx(
                "inline-flex items-center justify-center",
                "rounded-xl px-3 py-2 text-sm font-semibold",
                "border border-white/10 bg-white/5 text-white",
                "hover:bg-white/10 hover:border-white/15",
                "transition"
              )}
            >
              + New room
            </Link>

            <Link
              href="/live"
              className={cx(
                "inline-flex items-center justify-center",
                "rounded-xl px-3 py-2 text-sm font-semibold",
                "bg-gradient-to-r from-[#00f0ff] via-[#a200ff] to-[#ff00d0]",
                "text-white shadow-[0_10px_30px_rgba(0,240,255,0.10)]",
                "hover:opacity-95 transition"
              )}
            >
              View marketplace
            </Link>
          </div>
        </div>

        {/* Nav */}
        <nav className="border-t border-white/10 px-2 py-2 sm:px-3">
          <div className="flex flex-wrap gap-2">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cx(
                  "rounded-xl px-3 py-2 text-sm font-medium",
                  "text-white/70 hover:text-white",
                  "hover:bg-white/5 border border-transparent hover:border-white/10",
                  "transition"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      </header>

      {/* Content */}
      <div className="min-w-0">{children}</div>
    </div>
  );
}
