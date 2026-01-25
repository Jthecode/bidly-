/* ======================================================
   Bidly — Modal Component — Devnet-0
   ======================================================
   File: src/components/layout/Modal.tsx
   Role: Reusable modal / dialog component
   Status: Devnet-0 Ready
   License: Quantara Open Source License v1 (Apache-2.0 compatible)
   SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0
   Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.
   ====================================================== */

import * as React from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-[var(--color-bg-surface)] rounded-lg shadow-xl max-w-lg w-full mx-4 sm:mx-6">
        {/* Header */}
        {title && (
          <div className="flex justify-between items-center p-4 border-b border-[var(--color-border)]">
            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">{title}</h2>
            <button
              onClick={onClose}
              className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>
        )}

        {/* Content */}
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
}
