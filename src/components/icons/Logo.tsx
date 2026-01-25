import * as React from "react";

interface LogoProps {
  className?: string;
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <span
      className={`text-2xl font-bold tracking-tight text-[var(--color-text-primary)] ${className}`}
    >
      Bid
      <span className="text-[var(--color-brand)]">ly</span>
    </span>
  );
}
