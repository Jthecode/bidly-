// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Empty State — Devnet-0                                        ┃
   ┃ File   : src/components/ui/EmptyState.tsx                             ┃
   ┃ Role   : Reusable empty/zero-data state (title + description + hint)  ┃
   ┃ Status : Devnet-0 Ready                                               ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)      ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                       ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import * as React from "react";

export type EmptyStateProps = {
  title: string;
  description?: string;
  hint?: string;
  /**
   * Optional action area (button/links).
   */
  action?: React.ReactNode;
  className?: string;
};

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

export default function EmptyState({
  title,
  description,
  hint,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div className={cx("mx-auto w-full max-w-[980px]", className)}>
      <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur px-6 py-8 sm:px-8 shadow-[0_0_0_1px_rgba(255,255,255,0.03),0_18px_60px_rgba(0,0,0,0.35)]">
        <div className="flex flex-col gap-3">
          <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
            {title}
          </h2>

          {description ? (
            <p className="text-sm sm:text-base text-[var(--color-text-muted)]">
              {description}
            </p>
          ) : null}

          {hint ? (
            <div className="mt-2 rounded-xl border border-white/10 bg-black/20 px-4 py-3 text-xs sm:text-sm text-white/80">
              <span className="font-semibold text-white/90">Hint:</span> {hint}
            </div>
          ) : null}

          {action ? <div className="mt-4">{action}</div> : null}
        </div>
      </div>
    </div>
  );
}
