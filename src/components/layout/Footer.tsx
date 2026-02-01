// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Footer Component — Devnet-0                                   ┃
   ┃ File   : src/components/layout/Footer.tsx                             ┃
   ┃ Role   : Site footer with branding, nav, legal, and Devnet-0 context  ┃
   ┃ Status : Devnet-0 Ready                                               ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)      ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                       ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import * as React from "react";
import Link from "next/link";

import { Logo } from "@/components/icons/Logo";

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

function FooterLink(props: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  const base =
    "text-sm text-white/65 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-[rgba(0,240,255,0.35)] rounded-md";
  if (props.external) {
    return (
      <a
        href={props.href}
        target="_blank"
        rel="noopener noreferrer"
        className={base}
      >
        {props.children}
      </a>
    );
  }
  return (
    <Link href={props.href} className={base}>
      {props.children}
    </Link>
  );
}

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative mt-16 border-t border-white/10">
      {/* soft neon edge */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"
      />

      <div className="relative bg-black/20 backdrop-blur-xl">
        <div className="mx-auto w-full max-w-[1280px] px-4 py-10 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
            {/* Brand */}
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <Logo className="h-auto w-28" />
                <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-semibold text-white/70">
                  <span className="h-2 w-2 rounded-full bg-[var(--bidly-neon-cyan,#00f0ff)] shadow-[0_0_12px_rgba(0,240,255,.45)]" />
                  Devnet-0
                </span>
              </div>

              <p className="mt-4 max-w-sm text-sm leading-6 text-white/65">
                Bidly is a seller-first live marketplace—real-time rooms, chat, and
                presence built for a premium cyber-luxury experience.
              </p>

              <p className="mt-4 text-xs text-white/45">
                © {year} Bidly. All rights reserved.
              </p>
            </div>

            {/* Navigation */}
            <nav aria-label="Footer navigation" className="grid grid-cols-2 gap-8 md:col-span-2 sm:grid-cols-3">
              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                  Product
                </p>
                <div className="flex flex-col gap-2">
                  <FooterLink href="/">Live Auctions</FooterLink>
                  <FooterLink href="/categories">Categories</FooterLink>
                  <FooterLink href="/seller">Seller Dashboard</FooterLink>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                  Company
                </p>
                <div className="flex flex-col gap-2">
                  <FooterLink href="/about">About</FooterLink>
                  <FooterLink href="/contact">Contact</FooterLink>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-white/60">
                  Legal
                </p>
                <div className="flex flex-col gap-2">
                  <FooterLink href="/terms">Terms</FooterLink>
                  <FooterLink href="/privacy">Privacy</FooterLink>
                </div>
              </div>
            </nav>
          </div>

          {/* Bottom line */}
          <div className="mt-10 flex flex-col gap-3 border-t border-white/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-white/45">
              Token auth recommended for realtime (server-minted Ably tokens). Do not share secrets
              in chat.
            </p>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center rounded-full border border-white/10 bg-black/25 px-3 py-1 text-[11px] text-white/55">
                License: Apache-2.0 OR QOSL-1.0
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
