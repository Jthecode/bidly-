// src/components/auth/AuthHeader.tsx
import * as React from "react";

export interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  className?: string; // Add className
}

export default function AuthHeader({ title, subtitle, className }: AuthHeaderProps) {
  return (
    <div className={`text-center ${className || ""}`}>
      <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{title}</h1>
      {subtitle && (
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">{subtitle}</p>
      )}
    </div>
  );
}
