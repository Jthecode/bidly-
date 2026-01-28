"use client";

// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Filters Bar — Devnet-0                                        ┃
   ┃ File   : src/components/marketplace/FiltersBar.tsx                     ┃
   ┃ Role   : Seller-first filters + sort (cyber-luxury, glass + glow)      ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import * as React from "react";
import { cn } from "@/lib/utils";

export type FiltersCategory =
  | "all"
  | "trending"
  | "new"
  | "verified"
  | "digital"
  | "physical"
  | "services"
  | "software";

export type FiltersSort =
  | "recommended"
  | "newest"
  | "oldest"
  | "popular"
  | "price-low"
  | "price-high";

export interface FiltersBarProps {
  className?: string;

  category?: FiltersCategory;
  onCategoryChange?: (value: FiltersCategory) => void;

  sort?: FiltersSort;
  onSortChange?: (value: FiltersSort) => void;

  /**
   * Optional counts for badges (if you have them later).
   */
  counts?: Partial<Record<FiltersCategory, number>>;
}

const DEFAULT_CATEGORIES: Array<{ label: string; value: FiltersCategory }> = [
  { label: "All", value: "all" },
  { label: "Trending", value: "trending" },
  { label: "New", value: "new" },
  { label: "Verified", value: "verified" },
  { label: "Digital", value: "digital" },
  { label: "Physical", value: "physical" },
  { label: "Services", value: "services" },
  { label: "Software", value: "software" },
];

const SORTS: Array<{ label: string; value: FiltersSort }> = [
  { label: "Recommended", value: "recommended" },
  { label: "Newest", value: "newest" },
  { label: "Oldest", value: "oldest" },
  { label: "Most Popular", value: "popular" },
  { label: "Price: Low → High", value: "price-low" },
  { label: "Price: High → Low", value: "price-high" },
];

function Pill({
  active,
  children,
  onClick,
  title,
}: {
  active?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "relative inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold",
        "transition will-change-transform",
        "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25 focus-visible:ring-offset-0",
        active
          ? cn(
              "text-[var(--color-text-primary)]",
              "bg-white/10 border border-white/14 backdrop-blur",
              "shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_18px_55px_rgba(0,0,0,0.35)]"
            )
          : cn(
              "text-[var(--color-text-muted)]",
              "bg-white/5 border border-white/10 backdrop-blur",
              "hover:bg-white/10 hover:text-[var(--color-text-primary)]",
              "hover:-translate-y-[1px]"
            )
      )}
    >
      {/* glow ring when active */}
      {active ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -inset-px rounded-full bg-gradient-to-r from-[var(--color-cyber-cyan)]/20 via-white/10 to-[var(--color-cyber-pink)]/20"
        />
      ) : null}

      <span className="relative">{children}</span>
    </button>
  );
}

export default function FiltersBar({
  className,
  category: categoryProp,
  onCategoryChange,
  sort: sortProp,
  onSortChange,
  counts,
}: FiltersBarProps) {
  const [categoryLocal, setCategoryLocal] =
    React.useState<FiltersCategory>("all");
  const [sortLocal, setSortLocal] = React.useState<FiltersSort>("recommended");

  const category = categoryProp ?? categoryLocal;
  const sort = sortProp ?? sortLocal;

  function setCategory(value: FiltersCategory) {
    setCategoryLocal(value);
    onCategoryChange?.(value);
  }

  function setSort(value: FiltersSort) {
    setSortLocal(value);
    onSortChange?.(value);
  }

  return (
    <section
      className={cn(
        "w-full",
        "border-b border-white/10",
        "bg-white/[0.03] backdrop-blur-xl",
        className
      )}
    >
      <div className="mx-auto w-full max-w-[1440px] px-5 py-4 md:px-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          {/* Left: category pills */}
          <div className="flex flex-wrap items-center gap-2">
            {DEFAULT_CATEGORIES.map((item) => {
              const active = category === item.value;
              const count = counts?.[item.value];
              const label =
                typeof count === "number" ? `${item.label} · ${count}` : item.label;

              return (
                <Pill
                  key={item.value}
                  active={active}
                  onClick={() => setCategory(item.value)}
                  title={item.label}
                >
                  {label}
                </Pill>
              );
            })}
          </div>

          {/* Right: sort select */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-semibold text-[var(--color-text-muted)]">
              Sort
            </span>

            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as FiltersSort)}
                className={cn(
                  "h-10 appearance-none rounded-2xl pl-3 pr-10 text-sm font-semibold",
                  "text-[var(--color-text-primary)]",
                  "border border-white/12 bg-white/5 backdrop-blur",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-white/25",
                  "transition hover:bg-white/10"
                )}
              >
                {SORTS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>

              {/* chevron */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
              >
                ▾
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
