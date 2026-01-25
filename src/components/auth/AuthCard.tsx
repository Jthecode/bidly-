"use client";

// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Auth Card — Devnet-0                                         ┃
   ┃ File   : src/components/auth/AuthCard.tsx                            ┃
   ┃ Role   : Shared container for auth forms (sign-in / sign-up)        ┃
   ┃ Status : Devnet-0 Ready                                              ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)     ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                      ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC.                  ┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import * as React from "react";

/* ======================================================
   Types
   ====================================================== */

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
  /**
   * Optional prop to apply a top accent bar for sign-in/sign-up
   * e.g., gradient or color to indicate active auth page
   */
  topAccent?: boolean;
}

/* ======================================================
   Component
   ====================================================== */

export default function AuthCard({
  children,
  className = "",
  topAccent = false,
}: AuthCardProps) {
  return (
    <div
      className={`relative w-full max-w-md rounded-2xl border border-[var(--color-border-subtle)]
        bg-[var(--color-bg-surface)] shadow-lg px-6 py-8 sm:px-8 ${className}`}
    >
      {/* Optional Top Accent */}
      {topAccent && (
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[var(--color-accent)] to-[var(--color-live)] rounded-t-xl" />
      )}

      {children}
    </div>
  );
}
