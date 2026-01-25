/* ======================================================
   Bidly — Footer Component — Devnet-0
   ======================================================
   File: src/components/layout/Footer.tsx
   Role: Site footer with branding and links
   Status: Devnet-0 Ready
   License: Quantara Open Source License v1 (Apache-2.0 compatible)
   SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0
   Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.
   ====================================================== */

import * as React from "react";
import { Logo } from "@/components/icons/Logo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[var(--color-bg-surface)] text-[var(--color-text-secondary)] border-t border-[var(--color-border)] py-8 mt-12">
      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        {/* Branding */}
        <div className="flex items-center space-x-2">
          <Logo className="w-28 h-auto" />
          <span className="text-sm">
            © {currentYear} Bidly. All rights reserved.
          </span>
        </div>

        {/* Navigation Links */}
        <div className="flex flex-wrap gap-4 md:gap-6">
          <a
            href="#"
            className="hover:text-[var(--color-text-primary)] transition-colors"
          >
            About
          </a>
          <a
            href="#"
            className="hover:text-[var(--color-text-primary)] transition-colors"
          >
            Terms
          </a>
          <a
            href="#"
            className="hover:text-[var(--color-text-primary)] transition-colors"
          >
            Privacy
          </a>
          <a
            href="#"
            className="hover:text-[var(--color-text-primary)] transition-colors"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}
