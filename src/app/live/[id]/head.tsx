/* ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   ┃ Bidly — Live Route Head — Devnet-0                                     ┃
   ┃ File   : src/app/live/[id]/head.tsx                                    ┃
   ┃ Role   : Route-level head tags for live room pages                     ┃
   ┃ Status : Devnet-0 Ready                                                 ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                         ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃
   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ */

import * as React from "react";

export default function Head() {
  return (
    <>
      <title>Bidly — Live</title>
      <meta
        name="description"
        content="Join a live auction on Bidly. Cyber-luxury live commerce."
      />
      <meta name="robots" content="index,follow" />
      <meta name="theme-color" content="#06070a" />

      {/* Social */}
      <meta property="og:title" content="Bidly — Live" />
      <meta
        property="og:description"
        content="Join a live auction on Bidly. Cyber-luxury live commerce."
      />
      <meta property="og:type" content="website" />

      {/* Optional: set a default image later */}
      {/* <meta property="og:image" content="/og/live.png" /> */}
      {/* <meta name="twitter:card" content="summary_large_image" /> */}
    </>
  );
}
