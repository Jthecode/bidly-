// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — UI Empty State — Devnet-0                                     ┃
   ┃ File   : src/components/ui/EmptyState.tsx                             ┃
   ┃ Role   : Polished empty/error placeholder (cyber-luxury, reusable)    ┃
   ┃ Status : Devnet-0 Ready                                               ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)      ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                       ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import * as React from "react";
import Link from "next/link";

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

export type EmptyStateTone = "default" | "info" | "warning" | "danger";

export type EmptyStateAction =
  | { kind: "link"; label: string; href: string }
  | { kind: "button"; label: string; onClick: () => void };

export type EmptyStateProps = {
  title: string;
  description?: React.ReactNode;

  /**
   * Optional icon shown above title.
   * Provide an inline SVG / component.
   */
  icon?: React.ReactNode;

  /**
   * Visual tone (affects border/glow accent).
   */
  tone?: EmptyStateTone;

  /**
   * Primary action (optional).
   */
  action?: EmptyStateAction;

  /**
   * Secondary action (optional).
   */
  secondaryAction?: EmptyStateAction;

  /**
   * Layout sizing presets.
   */
  size?: "sm" | "md" | "lg";

  className?: string;
};

function toneClasses(tone: EmptyStateTone) {
  switch (tone) {
    case "info":
      return {
        ring: "ring-1 ring-[rgba(0,240,255,0.18)]",
        glow: "shadow-[0_0_0_1px_rgba(0,240,255,0.12),0_24px_80px_rgba(0,0,0,0.45)]",
        chip: "bg-[rgba(0,240,255,0.10)] text-[rgba(0,240,255,0.95)] border-[rgba(0,240,255,0.22)]",
      };
    case "warning":
      return {
        ring: "ring-1 ring-[rgba(255,175,0,0.18)]",
        glow: "shadow-[0_0_0_1px_rgba(255,175,0,0.10),0_24px_80px_rgba(0,0,0,0.45)]",
        chip: "bg-[rgba(255,175,0,0.10)] text-[rgba(255,215,120,0.95)] border-[rgba(255,175,0,0.22)]",
      };
    case "danger":
      return {
        ring: "ring-1 ring-[rgba(255,0,208,0.18)]",
        glow: "shadow-[0_0_0_1px_rgba(255,0,208,0.10),0_24px_80px_rgba(0,0,0,0.45)]",
        chip: "bg-[rgba(255,0,208,0.10)] text-[rgba(255,0,208,0.95)] border-[rgba(255,0,208,0.22)]",
      };
    default:
      return {
        ring: "ring-1 ring-white/10",
        glow: "shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_24px_80px_rgba(0,0,0,0.45)]",
        chip: "bg-white/5 text-white/80 border-white/10",
      };
  }
}

function sizeClasses(size: "sm" | "md" | "lg") {
  switch (size) {
    case "sm":
      return {
        wrap: "p-5 rounded-2xl",
        title: "text-base",
        desc: "text-sm",
        icon: "h-10 w-10",
        actions: "mt-4",
      };
    case "lg":
      return {
        wrap: "p-8 md:p-10 rounded-3xl",
        title: "text-xl md:text-2xl",
        desc: "text-base",
        icon: "h-14 w-14",
        actions: "mt-6",
      };
    default:
      return {
        wrap: "p-7 rounded-3xl",
        title: "text-lg md:text-xl",
        desc: "text-sm md:text-base",
        icon: "h-12 w-12",
        actions: "mt-5",
      };
  }
}

function ActionButton({
  label,
  onClick,
  variant,
}: {
  label: string;
  onClick: () => void;
  variant: "primary" | "secondary";
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold",
        "transition focus:outline-none focus:ring-2 focus:ring-[rgba(0,240,255,0.35)]",
        variant === "primary"
          ? "bg-gradient-to-r from-[#00f0ff] via-[#a200ff] to-[#ff00d0] text-white shadow-lg hover:brightness-110"
          : "border border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
      )}
    >
      {label}
    </button>
  );
}

function ActionLink({
  label,
  href,
  variant,
}: {
  label: string;
  href: string;
  variant: "primary" | "secondary";
}) {
  return (
    <Link
      href={href}
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold",
        "transition focus:outline-none focus:ring-2 focus:ring-[rgba(0,240,255,0.35)]",
        variant === "primary"
          ? "bg-gradient-to-r from-[#00f0ff] via-[#a200ff] to-[#ff00d0] text-white shadow-lg hover:brightness-110"
          : "border border-white/10 bg-white/5 text-white/80 hover:bg-white/10"
      )}
    >
      {label}
    </Link>
  );
}

const DefaultIcon = (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-full w-full">
    <path
      d="M12 22a10 10 0 1 1 10-10 10 10 0 0 1-10 10Zm0-14.5a1 1 0 0 0-1 1V13a1 1 0 0 0 2 0V8.5a1 1 0 0 0-1-1Zm0 10a1.25 1.25 0 1 0-1.25-1.25A1.25 1.25 0 0 0 12 17.5Z"
      fill="currentColor"
      opacity="0.9"
    />
  </svg>
);

export default function EmptyState({
  title,
  description,
  icon,
  tone = "default",
  action,
  secondaryAction,
  size = "md",
  className,
}: EmptyStateProps) {
  const t = toneClasses(tone);
  const s = sizeClasses(size);

  return (
    <section
      className={cx(
        "relative overflow-hidden border border-white/10 bg-black/25 backdrop-blur",
        s.wrap,
        t.ring,
        t.glow,
        className
      )}
    >
      {/* Ambient accents */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-20 top-10 h-56 w-56 rounded-full bg-[rgba(0,240,255,0.10)] blur-3xl" />
        <div className="absolute -right-24 bottom-8 h-64 w-64 rounded-full bg-[rgba(162,0,255,0.10)] blur-3xl" />
        <div className="absolute left-1/2 top-1/2 h-52 w-52 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(255,0,208,0.06)] blur-3xl" />
      </div>

      <div className="flex items-start gap-4">
        <div
          className={cx(
            "shrink-0 rounded-2xl border px-3 py-3",
            t.chip
          )}
          aria-hidden="true"
        >
          <div className={cx("grid place-items-center", s.icon)}>
            {icon ?? DefaultIcon}
          </div>
        </div>

        <div className="min-w-0">
          <h2 className={cx("font-semibold text-white", s.title)}>{title}</h2>

          {description ? (
            <div className={cx("mt-2 text-white/70", s.desc)}>{description}</div>
          ) : null}

          {(action || secondaryAction) ? (
            <div className={cx("flex flex-wrap items-center gap-3", s.actions)}>
              {action ? (
                action.kind === "link" ? (
                  <ActionLink label={action.label} href={action.href} variant="primary" />
                ) : (
                  <ActionButton label={action.label} onClick={action.onClick} variant="primary" />
                )
              ) : null}

              {secondaryAction ? (
                secondaryAction.kind === "link" ? (
                  <ActionLink
                    label={secondaryAction.label}
                    href={secondaryAction.href}
                    variant="secondary"
                  />
                ) : (
                  <ActionButton
                    label={secondaryAction.label}
                    onClick={secondaryAction.onClick}
                    variant="secondary"
                  />
                )
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
