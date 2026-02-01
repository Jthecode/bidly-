// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Category Hero — Devnet-0                                      ┃
   ┃ File   : src/components/categories/CategoryHero.tsx                   ┃
   ┃ Role   : Seller-first category header (title/desc + nav chips + stats)┃
   ┃ Status : Devnet-0 Ready                                               ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)      ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                       ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import * as React from "react";
import Link from "next/link";

export type CategoryHeroNavItem = {
  slug: string;
  label: string;
  href: string;
};

export type CategoryHeroMode = "live" | "setup" | "error";

export type CategoryHeroProps = {
  eyebrow?: string; // e.g. "Category"
  title: string; // e.g. "Electronics"
  description?: string;

  /** Active category slug (used to highlight chip) */
  activeSlug: string;

  /** Nav chips to other categories */
  nav: CategoryHeroNavItem[];

  /** Optional counts shown on the right */
  liveCount?: number;
  totalCount?: number;

  /** Optional status pill behavior */
  mode?: CategoryHeroMode;

  /** Optional “back to categories” link */
  categoriesHref?: string;
};

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

function Pill({
  mode,
  liveCount,
  totalCount,
}: {
  mode: CategoryHeroMode;
  liveCount?: number;
  totalCount?: number;
}) {
  const label =
    mode === "setup" ? "DB NOT CONNECTED" : mode === "error" ? "LOAD ERROR" : "LIVE";

  return (
    <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
      <span
        className={cx(
          "inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur",
          mode === "error" && "border-[var(--color-live)]/25 bg-[var(--color-live)]/10"
        )}
      >
        <span
          className={cx(
            "h-2 w-2 rounded-full",
            mode === "setup"
              ? "bg-white/30"
              : mode === "error"
              ? "bg-[var(--color-live)]"
              : "bg-[var(--color-live)] animate-pulse"
          )}
        />
        <span className="tracking-wide">{label}</span>
      </span>

      {mode === "live" && typeof liveCount === "number" && typeof totalCount === "number" ? (
        <>
          <span className="hidden sm:inline text-white/20">•</span>
          <span className="hidden sm:inline">
            {liveCount} live • {totalCount} total
          </span>
        </>
      ) : null}
    </div>
  );
}

function Chip({
  href,
  active,
  children,
}: {
  href: string;
  active?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={cx(
        "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold",
        "border border-white/10 backdrop-blur transition",
        active
          ? "bg-white/10 text-white"
          : "bg-black/25 text-white/75 hover:bg-white/10 hover:text-white"
      )}
      aria-current={active ? "page" : undefined}
    >
      {children}
    </Link>
  );
}

export default function CategoryHero({
  eyebrow = "Category",
  title,
  description,
  activeSlug,
  nav,
  liveCount,
  totalCount,
  mode = "live",
  categoriesHref = "/categories",
}: CategoryHeroProps) {
  return (
    <header className="mb-10 flex flex-col gap-3">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
            {eyebrow}
          </p>

          <h1 className="mt-2 text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
            {title}
          </h1>

          {description ? (
            <p className="mt-2 max-w-2xl text-sm md:text-base text-[var(--color-text-muted)]">
              {description}
            </p>
          ) : null}

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Link
              href={categoriesHref}
              className={cx(
                "inline-flex items-center rounded-full px-3 py-1.5 text-xs font-semibold",
                "border border-white/10 bg-black/25 text-white/75 backdrop-blur",
                "hover:bg-white/10 hover:text-white transition"
              )}
            >
              All Categories
            </Link>

            <span className="mx-1 hidden sm:inline h-4 w-px bg-white/10" aria-hidden="true" />

            {nav.map((c) => (
              <Chip key={c.slug} href={c.href} active={c.slug === activeSlug}>
                {c.label}
              </Chip>
            ))}
          </div>
        </div>

        <Pill mode={mode} liveCount={liveCount} totalCount={totalCount} />
      </div>

      <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </header>
  );
}
