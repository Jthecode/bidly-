// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Page Transition — Devnet-0                                     ┃
   ┃ File   : src/components/motion/PageTransition.tsx                      ┃
   ┃ Role   : VybzzMeet-style route/page enter/exit wrapper                 ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

"use client";

import * as React from "react";
import { AnimatePresence, m, useReducedMotion } from "framer-motion";

export type PageTransitionProps = {
  children: React.ReactNode;

  /**
   * Use a stable key for transitions.
   * In Next App Router, you can pass pathname from a small wrapper component.
   */
  routeKey?: string;

  /**
   * Visual style
   * - "fade" is safest
   * - "slide" is a little more energetic
   */
  variant?: "fade" | "slide";

  /**
   * Extra className applied to the motion wrapper.
   */
  className?: string;

  /**
   * If true, disables exit animation (useful for perf on low-end devices).
   */
  disableExit?: boolean;
};

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

export default function PageTransition({
  children,
  routeKey,
  variant = "fade",
  className,
  disableExit = false,
}: PageTransitionProps) {
  const reduced = useReducedMotion();

  const key = routeKey ?? "page";

  const enter = reduced
    ? { opacity: 1, y: 0, filter: "blur(0px)" }
    : variant === "slide"
      ? { opacity: 1, y: 0, filter: "blur(0px)" }
      : { opacity: 1, y: 0, filter: "blur(0px)" };

  const initial = reduced
    ? { opacity: 1, y: 0, filter: "blur(0px)" }
    : variant === "slide"
      ? { opacity: 0, y: 10, filter: "blur(6px)" }
      : { opacity: 0, y: 0, filter: "blur(8px)" };

  const exit = reduced || disableExit
    ? { opacity: 1, y: 0, filter: "blur(0px)" }
    : variant === "slide"
      ? { opacity: 0, y: -8, filter: "blur(10px)" }
      : { opacity: 0, y: 0, filter: "blur(10px)" };

  return (
    <AnimatePresence mode="wait" initial={false}>
      <m.div
        key={key}
        className={cx("min-h-[100svh] will-change-transform", className)}
        initial={initial}
        animate={enter}
        exit={exit}
        transition={
          reduced
            ? { duration: 0.01 }
            : {
                duration: 0.38,
                ease: [0.22, 1, 0.36, 1],
              }
        }
      >
        {children}
      </m.div>
    </AnimatePresence>
  );
}

/**
 * Small helper wrapper to auto-key by pathname (recommended usage).
 * Put this in any client layout where you have access to usePathname().
 */
export function PageTransitionByPath({
  children,
  className,
  variant = "fade",
  disableExit,
}: Omit<PageTransitionProps, "routeKey">) {
  const reduced = useReducedMotion();

  // Lazy import so this file doesn't force next/navigation into every bundle
  const usePathname =
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    (require("next/navigation") as typeof import("next/navigation")).usePathname;

  const path = usePathname?.() ?? "page";

  return (
    <PageTransition
      routeKey={path}
      className={className}
      variant={variant}
      disableExit={disableExit ?? Boolean(reduced)}
    >
      {children}
    </PageTransition>
  );
}
