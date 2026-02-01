// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Seller (Shell) — Devnet-0                                       ┃
   ┃ File   : src/components/seller/SellerShell.tsx                          ┃
   ┃ Role   : Seller dashboard layout shell (nav + header + content frame)   ┃
   ┃ Status : Devnet-0 Ready                                                 ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)        ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                         ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import * as React from "react";
import Link from "next/link";

type NavItem = {
  label: string;
  href: string;
  icon?: React.ReactNode;
};

type Props = {
  /**
   * Page content.
   */
  children: React.ReactNode;

  /**
   * Header title/subtitle for the page.
   */
  title?: string;
  subtitle?: string;

  /**
   * Optional right-side header actions (buttons, filters, etc.)
   */
  actions?: React.ReactNode;

  /**
   * Current path for active nav highlighting.
   * Pass from the page (recommended) OR leave undefined to do exact href matching.
   */
  activePath?: string;

  /**
   * Optional: show an environment badge (Dev/Prod).
   */
  envLabel?: string;
};

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

function normalizePath(p?: string) {
  if (!p) return "";
  const s = p.trim();
  if (!s) return "";
  return s.endsWith("/") && s.length > 1 ? s.slice(0, -1) : s;
}

function isActive(href: string, activePath?: string) {
  const a = normalizePath(activePath);
  const h = normalizePath(href);
  if (!a) return false;
  if (a === h) return true;
  // allow nested routes under a section
  return a.startsWith(h + "/");
}

const DEFAULT_NAV: NavItem[] = [
  { label: "Overview", href: "/seller" },
  { label: "Rooms", href: "/seller/rooms" },
  { label: "Messages", href: "/seller/messages" },
  { label: "Analytics", href: "/seller/analytics" },
  { label: "Payouts", href: "/seller/payouts" },
  { label: "Settings", href: "/seller/settings" },
];

function EnvPill({ label }: { label: string }) {
  return (
    <span
      className={cx(
        "inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs",
        "border border-white/10 bg-white/5 text-white/80"
      )}
    >
      <span
        className={cx(
          "inline-block h-1.5 w-1.5 rounded-full",
          "bg-[var(--bidly-neon-cyan,#00f0ff)] shadow-[0_0_10px_rgba(0,240,255,.45)]"
        )}
      />
      {label}
    </span>
  );
}

function NeonDivider() {
  return (
    <div
      aria-hidden="true"
      className={cx(
        "h-px w-full",
        "bg-gradient-to-r from-transparent via-white/10 to-transparent"
      )}
    />
  );
}

export default function SellerShell({
  children,
  title = "Seller Dashboard",
  subtitle = "Manage your rooms, livestreams, and orders.",
  actions,
  activePath,
  envLabel = "Development",
}: Props) {
  return (
    <div className="min-h-screen">
      {/* Background glow layers (pure CSS classes; safe if you already have theme tokens) */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10">
        <div
          className={cx(
            "absolute left-1/2 top-[-240px] h-[520px] w-[520px] -translate-x-1/2 rounded-full blur-3xl",
            "bg-[radial-gradient(circle_at_center,rgba(0,240,255,0.18),transparent_60%)]"
          )}
        />
        <div
          className={cx(
            "absolute right-[-180px] top-[140px] h-[520px] w-[520px] rounded-full blur-3xl",
            "bg-[radial-gradient(circle_at_center,rgba(162,0,255,0.16),transparent_60%)]"
          )}
        />
        <div
          className={cx(
            "absolute left-[-220px] bottom-[-220px] h-[600px] w-[600px] rounded-full blur-3xl",
            "bg-[radial-gradient(circle_at_center,rgba(255,0,208,0.12),transparent_60%)]"
          )}
        />
      </div>

      {/* Top header */}
      <header
        className={cx(
          "sticky top-0 z-40",
          "border-b border-white/10 bg-black/40 backdrop-blur-xl"
        )}
      >
        <div className="mx-auto max-w-6xl px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Link href="/" className="group inline-flex items-center gap-2">
                <span
                  className={cx(
                    "inline-flex h-9 w-9 items-center justify-center rounded-xl",
                    "border border-white/10 bg-white/5",
                    "shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_10px_30px_rgba(0,0,0,0.35)]"
                  )}
                >
                  <span
                    className={cx(
                      "text-sm font-bold tracking-wide",
                      "text-white"
                    )}
                  >
                    B
                  </span>
                </span>
                <div className="leading-tight">
                  <div className="text-sm font-semibold text-white">
                    Bidly Seller
                  </div>
                  <div className="text-xs text-white/60">Live ops console</div>
                </div>
              </Link>

              <div className="hidden md:block">
                <EnvPill label={envLabel} />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {actions ? (
                <div className="flex items-center gap-2">{actions}</div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    href="/seller/rooms/new"
                    className={cx(
                      "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold",
                      "border border-white/10 bg-white/5 text-white",
                      "hover:bg-white/10 transition"
                    )}
                  >
                    Create room
                  </Link>
                  <Link
                    href="/seller/rooms"
                    className={cx(
                      "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold",
                      "bg-[linear-gradient(90deg,rgba(0,240,255,.95),rgba(162,0,255,.95))] text-black",
                      "shadow-[0_10px_30px_rgba(0,240,255,0.18)]",
                      "hover:opacity-95 transition"
                    )}
                  >
                    Go live
                  </Link>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <NeonDivider />
          </div>

          <div className="mt-4 flex items-start justify-between gap-6">
            <div>
              <h1 className="text-xl font-semibold text-white">{title}</h1>
              {subtitle ? (
                <p className="mt-1 text-sm text-white/70">{subtitle}</p>
              ) : null}
            </div>

            <div className="hidden md:flex items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/80">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,.45)]" />
                Server ready
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="grid gap-6 md:grid-cols-[240px_1fr]">
          {/* Sidebar */}
          <aside
            className={cx(
              "h-fit rounded-2xl border border-white/10 bg-white/5 p-3 backdrop-blur",
              "shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_18px_50px_rgba(0,0,0,0.35)]"
            )}
          >
            <div className="px-3 pb-2 text-xs font-semibold tracking-wide text-white/60">
              Navigation
            </div>

            <nav className="space-y-1">
              {DEFAULT_NAV.map((item) => {
                const active = isActive(item.href, activePath);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cx(
                      "flex items-center justify-between gap-3 rounded-xl px-3 py-2 text-sm",
                      "transition",
                      active
                        ? "bg-white/10 text-white border border-white/10"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    )}
                    aria-current={active ? "page" : undefined}
                  >
                    <span className="inline-flex items-center gap-2">
                      <span
                        className={cx(
                          "inline-block h-2 w-2 rounded-full",
                          active
                            ? "bg-[var(--bidly-neon-cyan,#00f0ff)] shadow-[0_0_12px_rgba(0,240,255,.45)]"
                            : "bg-white/20"
                        )}
                      />
                      {item.label}
                    </span>

                    <span className="text-xs text-white/40">↗</span>
                  </Link>
                );
              })}
            </nav>

            <div className="mt-4 px-3">
              <NeonDivider />
            </div>

            <div className="mt-4 rounded-xl border border-white/10 bg-black/20 p-3">
              <div className="text-xs font-semibold text-white/70">Tip</div>
              <p className="mt-1 text-xs text-white/60">
                Keep a room heartbeat running while you stream so the marketplace tiles stay “live”.
              </p>
            </div>
          </aside>

          {/* Main */}
          <main
            className={cx(
              "rounded-2xl border border-white/10 bg-white/5 p-4 md:p-6 backdrop-blur",
              "shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_18px_50px_rgba(0,0,0,0.35)]"
            )}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
