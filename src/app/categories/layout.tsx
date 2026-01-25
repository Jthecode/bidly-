// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Categories Layout — Devnet-0                                  ┃
   ┃ File   : src/app/categories/layout.tsx                                ┃
   ┃ Role   : Category section layout (shared chrome + spacing)            ┃
   ┃ Status : Devnet-0 Ready                                               ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)      ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                       ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import * as React from "react";

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /**
   * Keep this layout light:
   * - App-level layout already provides Header/Footer/PageShell.
   * - This layout only provides section-level spacing & min-height safety.
   */
  return <section className="min-h-[100svh]">{children}</section>;
}
