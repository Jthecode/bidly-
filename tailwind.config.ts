/* ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   ┃ Bidly — Tailwind Config — Devnet-0                                     ┃
   ┃ File   : tailwind.config.ts                                            ┃
   ┃ Role   : Tailwind content paths + Bidly theme tokens wiring            ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃
   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ */

import type { Config } from "tailwindcss";

const config: Config = {
  // The #1 reason Tailwind “doesn’t apply” is incorrect content globs.
  // This includes ALL places Bidly can render classes from.
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/lib/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/styles/**/*.{js,ts,jsx,tsx,mdx,css}",

    // If you ever move files outside /src, add these:
    // "./app/**/*.{js,ts,jsx,tsx,mdx}",
    // "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "ui-sans-serif", "system-ui"],
      },

      colors: {
        bg: {
          page: "var(--color-bg-page)",
          surface: "var(--color-bg-surface)",
          elevated: "var(--color-bg-elevated)",
        },
        text: {
          primary: "var(--color-text-primary)",
          secondary: "var(--color-text-secondary)",
          muted: "var(--color-text-muted)",
        },
        border: {
          subtle: "var(--color-border-subtle)",
          // keep this token optional (doesn't break if you haven't defined it yet)
          strong: "var(--color-border-strong, rgba(255,255,255,0.18))",
        },
        accent: "var(--color-accent)",
        accent2: "var(--color-accent-2, var(--color-accent))",
        live: "var(--color-live)",
      },

      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
        glow: "var(--shadow-glow, 0 0 24px rgba(0,240,255,0.20))",
      },

      backgroundImage: {
        "bidly-hero":
          "radial-gradient(1200px 700px at 20% -10%, rgba(0,240,255,0.10), transparent 60%), radial-gradient(900px 520px at 85% 10%, rgba(255,0,208,0.10), transparent 55%), radial-gradient(1000px 640px at 50% 110%, rgba(162,0,255,0.10), transparent 60%)",
      },

      keyframes: {
        float: {
          "0%, 100%": { transform: "translate3d(0,0,0)" },
          "50%": { transform: "translate3d(0,-10px,0)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-120%)" },
          "100%": { transform: "translateX(120%)" },
        },
      },

      animation: {
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 1.6s ease-in-out infinite",
      },
    },
  },

  plugins: [],
};

export default config;
