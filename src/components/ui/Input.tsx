"use client";

/* ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   ┃ Bidly — Input Component — Devnet-0                                    ┃
   ┃ File   : src/components/ui/Input.tsx                                   ┃
   ┃ Role   : Reusable input with label, futuristic styling, and end icons  ┃
   ┃ Status : Devnet-0 Ready                                               ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)      ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃
   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ */

import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  endIcon?: React.ReactNode;
  error?: string;
}

/**
 * Futuristic Input Field
 * - Floating glow focus
 * - Supports right-side icons (password toggle, validation, etc.)
 * - Error display support
 */
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, endIcon, error, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        {/* Label */}
        <label className="text-sm font-semibold text-[var(--color-text-primary)] tracking-wide">
          {label}
        </label>

        {/* Input Wrapper */}
        <div className="relative">
          <input
            ref={ref}
            {...props}
            className={`
              w-full rounded-xl
              bg-[var(--color-bg-elevated)]
              border border-[var(--color-border-subtle)]
              px-4 py-3
              ${endIcon ? "pr-12" : ""}
              text-[var(--color-text-primary)]
              placeholder:text-[var(--color-text-muted)]
              transition-all duration-300
              focus:outline-none
              focus:border-[#00f0ff]
              focus:ring-2
              focus:ring-[#00f0ff]/40
              focus:shadow-[0_0_15px_rgba(0,240,255,0.4)]
              ${error ? "border-red-500 focus:ring-red-500/40" : ""}
              ${className}
            `}
          />

          {/* End Icon */}
          {endIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
              {endIcon}
            </div>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <p className="text-xs text-red-500 mt-1 font-medium">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
