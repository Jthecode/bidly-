/* ======================================================
   Bidly — Checkbox Component — Devnet-0
   ======================================================
   File: components/ui/Checkbox.tsx
   Purpose: Reusable checkbox for forms, filters, and futuristic UI
   ====================================================== */
"use client";

import * as React from "react";

interface CheckboxProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked = false,
  onCheckedChange,
  className = "",
  ...props
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCheckedChange?.(e.target.checked);
  };

  return (
    <label className={`inline-flex items-center cursor-pointer ${className}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        className="sr-only"
        {...props}
      />
      <span
        className={`
          w-5 h-5 flex-shrink-0 rounded-md flex items-center justify-center
          border-2 transition-all duration-200
          ${checked ? "bg-[var(--color-accent)] border-[var(--color-accent)] shadow-[0_0_6px_var(--color-accent)]" 
                    : "bg-[var(--color-bg-surface)] border-[var(--color-border-subtle)] hover:border-[var(--color-accent)] hover:shadow-[0_0_4px_var(--color-accent)/50]"}
        `}
      >
        {checked && (
          <svg
            className="w-3 h-3 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        )}
      </span>
    </label>
  );
};

export default Checkbox;
