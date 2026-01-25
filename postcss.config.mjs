/* ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   ┃ Bidly — PostCSS Config — Devnet-0                                      ┃
   ┃ File   : postcss.config.mjs                                            ┃
   ┃ Role   : Tailwind + autoprefixer pipeline for Next.js                  ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃
   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ */

const config = {
  plugins: {
    // Tailwind v4 PostCSS plugin entrypoint
    "@tailwindcss/postcss": {},
    // Required for cross-browser consistency
    autoprefixer: {},
  },
};

export default config;
