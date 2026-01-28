// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — App Layout — Devnet-0                                         ┃
   ┃ File   : src/app/layout.tsx                                           ┃
   ┃ Role   : Root HTML layout for all Bidly pages                         ┃
   ┃ Status : Devnet-0 Ready                                               ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)      ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                       ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved. ┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import "@/app/globals.css";
import "@/styles/tokens.css";
import "@/styles/themes.css";

import type { Metadata, Viewport } from "next";
import * as React from "react";

import Backdrop from "@/components/layout/Backdrop";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import PerformanceGuard from "@/components/perf/PerformanceGuard";

/* ======================================================
   Metadata
   ====================================================== */

export const metadata: Metadata = {
  metadataBase: new URL("https://www.bidly.com"),
  title: {
    default: "Bidly — Live Channels",
    template: "%s • Bidly",
  },
  description:
    "Seller-first live channels. Discover creators, shops, and drops — live, fast, and premium.",
  applicationName: "Bidly",
  authors: [{ name: "Bidly / Quantara Technology LLC" }],
  keywords: [
    "live channels",
    "live auctions",
    "real-time",
    "marketplace",
    "collectibles",
    "fashion",
    "drops",
    "Bidly",
  ],
  openGraph: {
    title: "Bidly — Live Channels",
    description:
      "Seller-first live channels. Discover creators, shops, and drops — live, fast, and premium.",
    siteName: "Bidly",
    url: "/",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Bidly — Live Channels",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bidly — Live Channels",
    description:
      "Seller-first live channels. Discover creators, shops, and drops — live, fast, and premium.",
    creator: "@BidlyOfficial",
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0b10",
  colorScheme: "dark",
};

/* ======================================================
   Root Layout
   ====================================================== */

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={[
          // Stable vertical shell
          "min-h-[100svh]",
          "flex flex-col",
          // Theme base (Backdrop paints behind)
          "bg-[var(--color-bg-page)]",
          "font-sans",
          "text-[var(--color-text-primary)]",
          "antialiased",
          // Avoid horizontal scroll from glow layers
          "overflow-x-hidden",
        ].join(" ")}
      >
        {/* Hardens Performance API (prevents negative timestamp measure crashes) */}
        <PerformanceGuard />

        {/* Global cyber-luxury backdrop for ALL pages */}
        <Backdrop fixed reduced={false} />

        {/* Ambient VybzzMeet-style frame glow + vignette */}
        <div
          aria-hidden="true"
          className={[
            "pointer-events-none",
            "fixed inset-0 -z-10",
            // vignette darkening edges
            "[background:radial-gradient(1400px_760px_at_50%_0%,rgba(0,220,255,0.14),transparent_62%),radial-gradient(1100px_720px_at_100%_22%,rgba(0,120,255,0.14),transparent_60%),radial-gradient(1100px_720px_at_0%_28%,rgba(150,0,255,0.10),transparent_58%),radial-gradient(120%_90%_at_50%_30%,rgba(0,0,0,0.0),rgba(0,0,0,0.55))]",
            "opacity-90",
          ].join(" ")}
        />

        {/* Subtle animated scan/noise overlay (CSS-driven, no client JS) */}
        <div
          aria-hidden="true"
          className={[
            "pointer-events-none",
            "fixed inset-0 -z-10",
            "opacity-[0.12]",
            "mix-blend-overlay",
            "bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.20),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.12),transparent_40%)]",
            "animate-[bidlyNoise_10s_linear_infinite]",
          ].join(" ")}
        />

        {/* Site Header */}
        <Header />

        {/* Main Content */}
        <main
          className={[
            "relative",
            "flex-1",
            "min-w-0",
            // Content width + padding (keeps the glow “frame” feel)
            "mx-auto",
            "w-full",
            "max-w-[1920px]",
            "px-4",
            "sm:px-6",
            "lg:px-8",
            "py-6",
            "sm:py-8",
          ].join(" ")}
        >
          {/* Inner glass lane (subtle, makes pages feel premium) */}
          <div
            className={[
              "relative",
              "min-w-0",
              "rounded-[28px]",
              "border border-white/10",
              "bg-black/10",
              "backdrop-blur-[10px]",
              "shadow-[0_0_0_1px_rgba(255,255,255,0.04),0_30px_120px_rgba(0,0,0,0.45)]",
              "p-3",
              "sm:p-5",
              "lg:p-6",
            ].join(" ")}
          >
            {children}
          </div>
        </main>

        {/* Site Footer */}
        <Footer />

        {/* Minimal keyframes (keep it here to avoid hunting for it) */}
        <style>{`
          @keyframes bidlyNoise {
            0% { transform: translate3d(0,0,0); filter: blur(0px); }
            20% { transform: translate3d(-2%,1%,0); filter: blur(0.2px); }
            40% { transform: translate3d(1%,-2%,0); filter: blur(0.1px); }
            60% { transform: translate3d(2%,1%,0); filter: blur(0.25px); }
            80% { transform: translate3d(-1%,2%,0); filter: blur(0.15px); }
            100% { transform: translate3d(0,0,0); filter: blur(0px); }
          }

          /* Guard: avoid motion sickness if OS requests reduced motion */
          @media (prefers-reduced-motion: reduce) {
            .animate-\\[bidlyNoise_10s_linear_infinite\\] {
              animation: none !important;
            }
          }
        `}</style>
      </body>
    </html>
  );
}
