// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Header Component — Devnet-0                                   ┃
   ┃ File   : src/components/layout/Header.tsx                              ┃
   ┃ Role   : Site header with logo, search, navigation, and live indicator ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                         ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "@/components/icons/Logo";

type NavItem = {
  label: string;
  href: string;
  liveDot?: boolean;
};

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * Header notes:
 * - Stays "premium" via glass + thin border + soft glow
 * - Avoids heavy motion in the header itself (motion belongs in backdrop)
 * - Mobile search included
 */
export function Header() {
  const pathname = usePathname() || "/";

  const nav: NavItem[] = [
    { label: "Categories", href: "/categories" },
    { label: "Live", href: "/", liveDot: true },
    { label: "Sign In", href: "/sign-in" },
  ];

  return (
    <header
      className={cx(
        "sticky top-0 z-50",
        // Glass / cyber surface
        "border-b border-white/10",
        "bg-[var(--color-bg-surface)]/65 backdrop-blur-xl",
        // Premium shadow + subtle glow line
        "shadow-[0_1px_0_rgba(255,255,255,0.04),0_14px_50px_rgba(0,0,0,0.38)]"
      )}
    >
      {/* Hairline glow strip */}
      <div
        aria-hidden="true"
        className={cx(
          "pointer-events-none",
          "absolute inset-x-0 top-0 h-px",
          "bg-gradient-to-r",
          "from-transparent via-[rgba(0,240,255,0.22)] to-transparent",
          "opacity-70"
        )}
      />

      <div className="mx-auto max-w-[1920px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center gap-3">
          {/* Logo */}
          <div className="flex shrink-0 items-center">
            <Link
              href="/"
              className={cx(
                "inline-flex items-center gap-2 rounded-xl",
                "focus:outline-none focus-visible:ring-1 focus-visible:ring-white/15"
              )}
              aria-label="Go to Bidly home"
            >
              <Logo className="h-auto w-28 sm:w-32" aria-label="Bidly Logo" />
            </Link>
          </div>

          {/* Search (desktop) */}
          <div className="hidden min-w-0 flex-1 items-center px-3 md:flex">
            <label htmlFor="header-search" className="sr-only">
              Search Bidly
            </label>

            <div className="relative w-full min-w-0">
              <span
                aria-hidden="true"
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
              >
                ⌕
              </span>

              <input
                id="header-search"
                type="text"
                placeholder="Search sellers, live rooms, drops…"
                className={cx(
                  "w-full min-w-0",
                  "rounded-2xl",
                  "border border-white/10 bg-black/20",
                  "px-10 py-2.5",
                  "text-sm text-[var(--color-text-primary)]",
                  "placeholder:text-white/35",
                  "outline-none",
                  "transition",
                  "focus:border-white/18 focus:ring-1 focus:ring-white/12"
                )}
              />

              {/* Soft inner sheen */}
              <span
                aria-hidden="true"
                className={cx(
                  "pointer-events-none absolute inset-0 rounded-2xl",
                  "bg-gradient-to-b from-white/[0.06] to-transparent",
                  "opacity-60"
                )}
              />
            </div>
          </div>

          {/* Nav */}
          <nav className="ml-auto flex items-center gap-2 sm:gap-3">
            {nav.map((item) => {
              const active = isActive(pathname, item.href);
              const isSignIn = item.href === "/sign-in";

              if (isSignIn) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cx(
                      "inline-flex items-center justify-center",
                      "rounded-2xl px-4 py-2 text-sm font-semibold",
                      "border border-white/10",
                      // Use accent gradient rather than single fill
                      "bg-[linear-gradient(90deg,var(--color-accent),var(--color-live))]",
                      "text-black",
                      "shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_12px_30px_rgba(0,0,0,0.35)]",
                      "transition",
                      "hover:brightness-110 hover:saturate-110",
                      "focus:outline-none focus-visible:ring-1 focus-visible:ring-white/15",
                      active && "ring-1 ring-white/14"
                    )}
                  >
                    Sign In
                  </Link>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cx(
                    "inline-flex items-center gap-2",
                    "rounded-2xl px-3 py-2 text-sm font-semibold",
                    "text-[var(--color-text-secondary)]",
                    "border border-transparent",
                    "transition",
                    "hover:text-[var(--color-text-primary)] hover:bg-white/5",
                    "focus:outline-none focus-visible:ring-1 focus-visible:ring-white/15",
                    active &&
                      "text-[var(--color-text-primary)] border-white/10 bg-white/5"
                  )}
                  aria-current={active ? "page" : undefined}
                >
                  <span className="leading-none">{item.label}</span>

                  {item.liveDot ? (
                    <span
                      aria-hidden="true"
                      className={cx(
                        "relative inline-flex",
                        "h-2 w-2 rounded-full",
                        "bg-[var(--color-live)]"
                      )}
                    >
                      {/* glow */}
                      <span
                        aria-hidden="true"
                        className={cx(
                          "absolute inset-0 rounded-full",
                          "shadow-[0_0_18px_rgba(255,0,208,0.35)]"
                        )}
                      />
                      {/* pulse ring */}
                      <span
                        aria-hidden="true"
                        className={cx(
                          "absolute -inset-1 rounded-full",
                          "border border-[rgba(255,0,208,0.45)]",
                          "opacity-50",
                          "animate-ping"
                        )}
                      />
                    </span>
                  ) : null}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Search (mobile) */}
        <div className="pb-3 md:hidden">
          <label htmlFor="header-search-mobile" className="sr-only">
            Search Bidly
          </label>

          <div className="relative w-full">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/40"
            >
              ⌕
            </span>

            <input
              id="header-search-mobile"
              type="text"
              placeholder="Search…"
              className={cx(
                "w-full",
                "rounded-2xl",
                "border border-white/10 bg-black/20",
                "px-10 py-2.5",
                "text-sm text-[var(--color-text-primary)]",
                "placeholder:text-white/35",
                "outline-none",
                "transition",
                "focus:border-white/18 focus:ring-1 focus:ring-white/12"
              )}
            />

            <span
              aria-hidden="true"
              className={cx(
                "pointer-events-none absolute inset-0 rounded-2xl",
                "bg-gradient-to-b from-white/[0.06] to-transparent",
                "opacity-55"
              )}
            />
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
