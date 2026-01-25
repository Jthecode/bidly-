// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Categories Index Page — Devnet-0                              ┃
   ┃ File   : src/app/categories/page.tsx                                  ┃
   ┃ Role   : Categories landing (grid + routing source of truth)          ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import * as React from "react";
import Link from "next/link";
import Backdrop from "@/components/layout/Backdrop";
import Container from "@/components/layout/Container";
import { categoriesForNav, categoryHref, type Category } from "./category.data";

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

function accentGlow(accent?: Category["accent"]) {
  switch (accent) {
    case "cyan":
      return "shadow-[0_0_0_1px_rgba(0,240,255,0.12),0_0_26px_rgba(0,240,255,0.10)]";
    case "purple":
      return "shadow-[0_0_0_1px_rgba(162,0,255,0.14),0_0_26px_rgba(162,0,255,0.10)]";
    case "pink":
      return "shadow-[0_0_0_1px_rgba(255,0,208,0.14),0_0_26px_rgba(255,0,208,0.10)]";
    case "gold":
      return "shadow-[0_0_0_1px_rgba(255,180,0,0.16),0_0_26px_rgba(255,180,0,0.10)]";
    default:
      return "shadow-[0_0_0_1px_rgba(255,255,255,0.05)]";
  }
}

function accentDot(accent?: Category["accent"]) {
  switch (accent) {
    case "cyan":
      return "bg-[var(--color-cyan,#00f0ff)]";
    case "purple":
      return "bg-[var(--color-purple,#a200ff)]";
    case "pink":
      return "bg-[var(--color-pink,#ff00d0)]";
    case "gold":
      return "bg-[var(--color-gold,#ffb400)]";
    default:
      return "bg-white/40";
  }
}

export default function CategoriesPage() {
  const cats = categoriesForNav();

  // Defensive grid CSS so layout survives even if Tailwind gets weird.
  const css = `
    .bidly-cats-shell { padding-inline: 18px; }
    .bidly-cats-grid {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 28px;
      align-items: start;
      width: 100%;
      max-width: 1440px;
      margin: 0 auto;
    }
    @media (max-width: 1200px) {
      .bidly-cats-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    }
    @media (max-width: 740px) {
      .bidly-cats-grid { grid-template-columns: repeat(1, minmax(0, 1fr)); }
    }
    .bidly-cats-grid > * { min-width: 0; }
  `;

  return (
    <div className="relative min-h-[100svh]">
      <Backdrop />
      <style>{css}</style>

      <Container className="relative py-12 bidly-cats-shell" size="full">
        <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl min-w-0">
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
              Categories
            </h1>
            <p className="mt-1 text-sm md:text-base text-[var(--color-text-muted)]">
              Pick a lane. Discover sellers. Join live drops.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs text-[var(--color-text-muted)]">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 backdrop-blur">
              <span className={cx("h-2 w-2 rounded-full", accentDot("pink"))} />
              <span className="tracking-wide">{cats.length} categories</span>
            </span>
            <span className="hidden sm:inline text-white/20">•</span>
            <Link
              href="/"
              className="hidden sm:inline hover:text-white/85 transition-colors"
            >
              Live
            </Link>
          </div>
        </header>

        <div className="mb-10 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <main className="bidly-cats-grid">
          {cats.map((c) => {
            const href = categoryHref(c.slug);
            const bg = c.image ? { backgroundImage: `url(${c.image})` } : undefined;

            return (
              <Link
                key={c.slug}
                href={href}
                className={cx(
                  "group block min-w-0 rounded-2xl",
                  "focus:outline-none focus-visible:ring-1 focus-visible:ring-white/15"
                )}
                aria-label={`Open category: ${c.label}`}
              >
                <div
                  className={cx(
                    "relative overflow-hidden rounded-2xl",
                    "border border-white/10 bg-white/[0.03] backdrop-blur",
                    "transition-transform duration-200 hover:-translate-y-0.5",
                    accentGlow(c.accent)
                  )}
                >
                  {/* Media */}
                  <div
                    className="relative w-full"
                    style={{ aspectRatio: "16 / 10" }}
                  >
                    <div
                      className="absolute inset-0 bg-cover bg-center"
                      style={bg}
                      aria-hidden="true"
                    />
                    {!c.image && (
                      <div
                        className="absolute inset-0"
                        aria-hidden="true"
                        style={{
                          background:
                            "radial-gradient(80% 70% at 50% 25%, rgba(255,255,255,0.10), transparent 60%)",
                        }}
                      />
                    )}

                    {/* Overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/82 via-black/28 to-black/10" />
                    <div className="absolute inset-0 opacity-25 [background:radial-gradient(85%_65%_at_50%_35%,rgba(255,0,208,0.14),transparent_60%)]" />

                    {/* Top chip */}
                    <div className="absolute left-3 top-3">
                      <span className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-black/40 px-2.5 py-1 text-[11px] text-white/85 backdrop-blur leading-none whitespace-nowrap">
                        <span className={cx("h-2 w-2 rounded-full", accentDot(c.accent))} />
                        {c.label}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-4 min-w-0">
                    <div className="flex items-start justify-between gap-3 min-w-0">
                      <div className="min-w-0">
                        <h3 className="text-base font-semibold text-[var(--color-text-primary)] truncate">
                          {c.label}
                        </h3>
                        <p className="mt-1 text-sm text-white/65 line-clamp-2">
                          {c.description}
                        </p>
                      </div>

                      <span
                        className={cx(
                          "shrink-0 rounded-xl px-3 py-1.5 text-xs font-semibold",
                          "border border-white/10 bg-white/5 text-white/90",
                          "whitespace-nowrap leading-none",
                          "transition-colors group-hover:bg-white/10"
                        )}
                        aria-hidden="true"
                      >
                        Browse
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </main>
      </Container>
    </div>
  );
}
