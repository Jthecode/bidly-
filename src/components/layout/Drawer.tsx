/* ======================================================
   Bidly — Drawer Component — Devnet-0
   ======================================================
   File: src/components/layout/Drawer.tsx
   Role: Slide-in panel for mobile menus or filters
   Status: Devnet-0 Ready
   License: Quantara Open Source License v1 (Apache-2.0 compatible)
   SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0
   Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.
   ====================================================== */

import * as React from "react";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  side?: "left" | "right";
  width?: string; // Tailwind width, e.g., "w-80"
}

export default function Drawer({
  isOpen,
  onClose,
  title,
  children,
  side = "right",
  width = "w-80",
}: DrawerProps) {
  if (!isOpen) return null;

  const sidePosition = side === "left" ? "left-0" : "right-0";

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer Panel */}
      <div
        className={`${width} ${sidePosition} relative bg-[var(--color-bg-surface)] shadow-xl h-full flex flex-col transition-transform transform`}
      >
        {/* Header */}
        {title && (
          <div className="flex justify-between items-center p-4 border-b border-[var(--color-border)]">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              aria-label="Close drawer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-4 flex-1 overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
