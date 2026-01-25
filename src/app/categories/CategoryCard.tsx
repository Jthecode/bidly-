// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Category Card — Devnet-0                                      ┃
   ┃ File   : src/app/categories/CategoryCard.tsx                           ┃
   ┃ Role   : Category tile card (grid-safe, cyber-luxury)                  ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import * as React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { categoryHref, type Category } from "./category.data";

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

type CategoryCardProps = {
  category: Category;
  className?: string;
};

function accentGlow(a?: Category["accent"]) {
  switch (a) {
    case "cyan":
      return "shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_0_32px_rgba(0,240,255,0.10)]";
    case "purple":
      return "shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_0_32px_rgba(162,0,255,0.10)]";
    case "pink":
      return "shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_0_32px_rgba(255,0,208,0.10)]";
    case "gold":
      return "shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_0_32px_rgba(255,180,0,0.10)]";
    default:
      return "shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_14px_44px_rgba(0,0,0,0.38)]";
  }
}

export default function CategoryCard({ category, className }: CategoryCardProps) {
  const href = categoryHref(category.slug);

  return (
    <Card
      className={cx(
        "min-w-0 overflow-hidden rounded-2xl",
        "border border-white/10 bg-white/[0.03] backdrop-blur",
        "transition-transform duration-200 hover:-translate-y-0.5",
        accentGlow(category.accent),
        className
      )}
    >
      <Link
        href={href}
        className={cx(
          "group block min-w-0 rounded-2xl",
          "focus:outline-none focus-visible:ring-1 focus-visible:ring-white/15"
        )}
        aria-label={`Open category: ${category.label}`}
      >
        {/* Media */}
        <div className="relative min-w-0">
          <div
            className="relative w-full overflow-hidden bg-black/30"
            style={{ aspectRatio: "16 / 10" }}
          >
            {/* Background image (server-safe) */}
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={
                category.image ? { backgroundImage: `url(${category.image})` } : undefined
              }
              aria-label={category.label}
            />

            {!category.image && (
              <div className="absolute inset-0 bg-gradient-to-br from-white/12 via-white/6 to-transparent" />
            )}

            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/10" />
            <div className="absolute inset-0 opacity-30 [background:radial-gradient(85%_65%_at_45%_35%,rgba(0,240,255,0.14),transparent_60%)]" />

            {/* Top badge */}
            <div className="absolute left-3 top-3">
              <Badge variant="default" className="bg-black/45 text-white/85">
                Category
              </Badge>
            </div>

            {/* Bottom label */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              <div className="flex items-end justify-between gap-3">
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-wider text-white/60 whitespace-nowrap">
                    Explore
                  </div>
                  <div className="truncate text-base font-semibold text-white">
                    {category.label}
                  </div>
                </div>

                <span
                  className={cx(
                    "shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold",
                    "border border-white/10 bg-white/5 text-white/90",
                    "whitespace-nowrap leading-none",
                    "transition-colors group-hover:bg-white/10"
                  )}
                >
                  View
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="p-4 min-w-0">
          <p className="line-clamp-2 text-sm text-white/70">{category.description}</p>
        </div>
      </Link>
    </Card>
  );
}
