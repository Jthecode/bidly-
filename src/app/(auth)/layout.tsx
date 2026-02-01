// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Auth Layout — Devnet-0                                        ┃
   ┃ File   : src/app/(auth)/layout.tsx                                    ┃
   ┃ Role   : Shared layout for auth routes (sign-in/sign-up)              ┃
   ┃ Status : Devnet-0 Ready                                               ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)      ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import * as React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <section
      className={[
        // full-viewport but respects root layout shell
        "min-h-[calc(100svh-0px)]",
        "w-full",
        "flex",
        "items-center",
        "justify-center",
        "py-10",
        "sm:py-14",
      ].join(" ")}
    >
      {children}
    </section>
  );
}
