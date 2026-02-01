// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — About Page — Devnet-0                                         ┃
   ┃ File   : src/app/about/page.tsx                                       ┃
   ┃ Role   : Brand story + seller-first positioning (cyber-luxury)        ┃
   ┃ Status : Devnet-0 Ready                                               ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)      ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                       ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import * as React from "react";
import Link from "next/link";

import Container from "@/components/layout/Container";
import Backdrop from "@/components/layout/Backdrop";

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "accent" | "magenta";
}) {
  const cls =
    tone === "accent"
      ? "border-[rgba(0,240,255,0.22)] bg-[rgba(0,240,255,0.08)] text-white/80"
      : tone === "magenta"
        ? "border-[rgba(255,0,208,0.22)] bg-[rgba(255,0,208,0.08)] text-white/85"
        : "border-white/10 bg-white/5 text-white/75";
  return (
    <span className={cx("inline-flex items-center rounded-full border px-3 py-1 text-xs backdrop-blur", cls)}>
      {children}
    </span>
  );
}

function Stat({
  label,
  value,
  detail,
}: {
  label: string;
  value: string;
  detail?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
      <div className="text-xs uppercase tracking-wider text-white/55">{label}</div>
      <div className="mt-2 text-2xl font-extrabold tracking-tight text-white">{value}</div>
      {detail ? <div className="mt-2 text-sm text-white/65">{detail}</div> : null}
    </div>
  );
}

function Feature({
  title,
  desc,
}: {
  title: string;
  desc: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur p-5">
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <span
          aria-hidden="true"
          className="h-8 w-8 rounded-xl border border-white/10 bg-white/5"
        />
      </div>
      <p className="mt-2 text-sm leading-relaxed text-white/70">{desc}</p>
    </div>
  );
}

export const metadata = {
  title: "Bidly • About",
  description:
    "Bidly is a seller-first live marketplace built for cyber-luxury speed, trust, and realtime commerce.",
};

export default function AboutPage() {
  return (
    <div className="relative min-h-[100svh]">
      <Backdrop />

      <Container className="relative py-12" size="full">
        {/* Hero */}
        <header className="mx-auto max-w-5xl">
          <p className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
            About Bidly
          </p>

          <div className="mt-3 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
                Seller-first live auctions,
                <span className="block text-white/85">built for realtime trust.</span>
              </h1>
              <p className="mt-3 max-w-2xl text-sm md:text-base text-[var(--color-text-muted)]">
                Bidly is a cyber-luxury live marketplace where sellers go live, buyers
                chat and bid in realtime, and the experience stays clean — no “listing”
                clutter, no noisy UI, just pure momentum.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Pill>Devnet-0</Pill>
              <Pill tone="accent">Realtime</Pill>
              <Pill tone="magenta">Seller-first</Pill>
            </div>
          </div>

          <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </header>

        {/* Value props */}
        <section className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3">
          <Stat
            label="Design Language"
            value="Cyber-Luxury"
            detail="Glass, glow, and clean information hierarchy."
          />
          <Stat
            label="Realtime Layer"
            value="Channels"
            detail="Live rooms + chat + presence with reliable message flow."
          />
          <Stat
            label="Seller Focus"
            value="First"
            detail="Tiles highlight sellers and live energy, not listing metadata."
          />
        </section>

        {/* Features */}
        <section className="mx-auto mt-10 max-w-6xl">
          <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 sm:p-8">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                  What we’re building
                </h2>
                <p className="mt-1 text-sm text-white/65">
                  Devnet-0 is the foundation: stable UI, stable routing, stable realtime.
                </p>
              </div>

              <Link
                href="/seller"
                className={cx(
                  "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold",
                  "border border-white/10 bg-black/25 text-white/85 backdrop-blur",
                  "hover:bg-white/10 transition"
                )}
              >
                Seller Dashboard →
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
              <Feature
                title="Live Rooms as truth"
                desc="Rooms are treated as the source of reality — a clean data layer powers tiles, pages, and realtime updates."
              />
              <Feature
                title="Chat that feels premium"
                desc="Fast, readable chat UI with a strong hierarchy: seller context, system messages, and a clear composer."
              />
              <Feature
                title="Presence with restraint"
                desc="Presence is optional and tasteful — a compact indicator, not a noisy overlay."
              />
              <Feature
                title="Production-safe by default"
                desc="No fake auth success, no pretend data. If something isn’t wired, we show an elite empty state with clear next steps."
              />
            </div>
          </div>
        </section>

        {/* Mission */}
        <section className="mx-auto mt-10 max-w-6xl">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-white/10 bg-black/20 backdrop-blur p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                Mission
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                Build the most premium realtime commerce experience on the internet —
                where sellers feel empowered, buyers feel confident, and the interface
                never gets in the way of momentum.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                We obsess over performance, trust, and design polish so that going live
                feels like stepping into a high-end studio — not a cluttered marketplace.
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white">
                Principles
              </h2>

              <ul className="mt-4 space-y-3 text-sm text-white/70">
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[var(--color-live)]" />
                  <span>
                    <span className="font-semibold text-white/85">Seller-first:</span>{" "}
                    every screen starts with the seller and the live moment.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[rgba(0,240,255,1)]" />
                  <span>
                    <span className="font-semibold text-white/85">Realtime clarity:</span>{" "}
                    fast updates without chaos — signal over noise.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[rgba(162,0,255,1)]" />
                  <span>
                    <span className="font-semibold text-white/85">Premium UI:</span>{" "}
                    spacing, typography, and glow are intentional — never accidental.
                  </span>
                </li>
                <li className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[rgba(255,0,208,1)]" />
                  <span>
                    <span className="font-semibold text-white/85">Truthful product:</span>{" "}
                    no fake states — we show what’s real and what’s next.
                  </span>
                </li>
              </ul>

              <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <div className="mt-6 flex flex-wrap gap-3">
                <Link
                  href="/"
                  className={cx(
                    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold",
                    "bg-gradient-to-r from-[#00f0ff] via-[#a200ff] to-[#ff00d0] text-white",
                    "shadow-lg shadow-black/35 hover:opacity-95 transition"
                  )}
                >
                  Explore Live Sellers
                </Link>

                <Link
                  href="/contact"
                  className={cx(
                    "inline-flex items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold",
                    "border border-white/10 bg-black/25 text-white/85 backdrop-blur",
                    "hover:bg-white/10 transition"
                  )}
                >
                  Contact
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer note */}
        <p className="mx-auto mt-10 max-w-6xl text-xs text-white/45">
          Devnet-0 pages are subject to rapid iteration as we wire auth, payments, and moderation.
        </p>
      </Container>
    </div>
  );
}
