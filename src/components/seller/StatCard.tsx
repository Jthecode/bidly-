// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Seller (Stat Card) — Devnet-0                                   ┃
   ┃ File   : src/components/seller/StatCard.tsx                             ┃
   ┃ Role   : Reusable KPI card for seller dashboard (cyber-lux glass)       ┃
   ┃ Status : Devnet-0 Ready                                                 ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)        ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                         ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import * as React from "react";

type Tone = "cyan" | "purple" | "pink" | "emerald" | "amber" | "neutral";

export type StatCardProps = {
  label: string;
  value: React.ReactNode;
  hint?: React.ReactNode;

  /**
   * Optional small icon shown on the left.
   */
  icon?: React.ReactNode;

  /**
   * Accent tone for glow ring and pill.
   */
  tone?: Tone;

  /**
   * Optional right-side meta (e.g. +12%, "Today", etc.)
   */
  meta?: React.ReactNode;

  className?: string;
};

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

function toneVars(tone: Tone) {
  switch (tone) {
    case "cyan":
      return {
        ring: "rgba(0,240,255,.22)",
        dot: "rgba(0,240,255,.95)",
        pill: "rgba(0,240,255,.14)",
      };
    case "purple":
      return {
        ring: "rgba(162,0,255,.22)",
        dot: "rgba(162,0,255,.95)",
        pill: "rgba(162,0,255,.14)",
      };
    case "pink":
      return {
        ring: "rgba(255,0,208,.22)",
        dot: "rgba(255,0,208,.95)",
        pill: "rgba(255,0,208,.14)",
      };
    case "emerald":
      return {
        ring: "rgba(52,211,153,.18)",
        dot: "rgba(52,211,153,.95)",
        pill: "rgba(52,211,153,.12)",
      };
    case "amber":
      return {
        ring: "rgba(245,158,11,.18)",
        dot: "rgba(245,158,11,.95)",
        pill: "rgba(245,158,11,.12)",
      };
    default:
      return {
        ring: "rgba(255,255,255,.10)",
        dot: "rgba(255,255,255,.65)",
        pill: "rgba(255,255,255,.06)",
      };
  }
}

export default function StatCard({
  label,
  value,
  hint,
  icon,
  tone = "cyan",
  meta,
  className,
}: StatCardProps) {
  const vars = toneVars(tone);

  return (
    <div
      className={cx(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-4",
        "shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_16px_45px_rgba(0,0,0,0.35)]",
        "backdrop-blur",
        "transition hover:bg-white/7",
        className
      )}
      style={
        {
          ["--ring" as any]: vars.ring,
          ["--dot" as any]: vars.dot,
          ["--pill" as any]: vars.pill,
        } as React.CSSProperties
      }
    >
      {/* Glow ring */}
      <div
        aria-hidden="true"
        className={cx(
          "pointer-events-none absolute -inset-10 opacity-0 blur-2xl transition duration-500",
          "group-hover:opacity-100"
        )}
        style={{
          background:
            "radial-gradient(circle at 30% 20%, var(--ring), transparent 55%)",
        }}
      />

      {/* Subtle top sheen */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-12 opacity-40"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.10), transparent)",
        }}
      />

      <div className="relative flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          {/* Icon */}
          <div
            className={cx(
              "flex h-10 w-10 items-center justify-center rounded-xl",
              "border border-white/10 bg-black/25"
            )}
          >
            {icon ? (
              <div className="text-white/90">{icon}</div>
            ) : (
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{
                  background: "var(--dot)",
                  boxShadow: "0 0 16px var(--ring)",
                }}
              />
            )}
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <div className="text-xs font-semibold tracking-wide text-white/70">
                {label}
              </div>
              <span
                className="rounded-full border border-white/10 px-2 py-0.5 text-[10px] font-semibold text-white/70"
                style={{ background: "var(--pill)" }}
              >
                Live
              </span>
            </div>

            <div className="mt-2 text-2xl font-semibold text-white">
              {value}
            </div>

            {hint ? (
              <div className="mt-1 text-xs text-white/60">{hint}</div>
            ) : null}
          </div>
        </div>

        {meta ? (
          <div className="shrink-0 rounded-xl border border-white/10 bg-black/20 px-3 py-2 text-xs text-white/70">
            {meta}
          </div>
        ) : null}
      </div>

      {/* Bottom divider */}
      <div className="relative mt-4 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </div>
  );
}
