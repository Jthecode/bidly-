/* ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   ┃ Bidly — Live Route Layout — Devnet-0                                   ┃
   ┃ File   : src/app/live/[id]/layout.tsx                                  ┃
   ┃ Role   : Per-room layout wrapper (metadata boundary + stable shell)    ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                         ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃
   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ */

import * as React from "react";

export default function LiveRoomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  /**
   * Keep this layout minimal:
   * - No client hooks
   * - No extra wrappers that affect grid sizing
   * - Let the page components own spacing and composition
   */
  return (
    <section className="min-w-0">
      {children}
    </section>
  );
}
