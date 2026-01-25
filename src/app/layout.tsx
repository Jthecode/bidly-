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

import type { Metadata } from "next";
import * as React from "react";
import { Header } from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

/* ======================================================
   Metadata
   ====================================================== */

export const metadata: Metadata = {
  metadataBase: new URL("https://www.bidly.com"),
  title: {
    default: "Bidly — Live Auctions & Marketplace",
    template: "%s • Bidly",
  },
  description:
    "Bid live. Win fast. Discover collectibles, fashion, and exclusive items on Bidly.",
  applicationName: "Bidly",
  authors: [{ name: "Bidly / Quantara Technology LLC" }],
  keywords: [
    "live auctions",
    "real-time bidding",
    "marketplace",
    "collectibles",
    "fashion",
    "exclusive auctions",
    "Bidly",
  ],
  openGraph: {
    title: "Bidly — Live Auctions & Marketplace",
    description:
      "Bid live. Win fast. Discover collectibles, fashion, and exclusive items on Bidly.",
    siteName: "Bidly",
    url: "/",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Bidly Live Marketplace",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Bidly — Live Auctions & Marketplace",
    description:
      "Bid live. Win fast. Discover collectibles, fashion, and exclusive items on Bidly.",
    creator: "@BidlyOfficial",
  },
};

/* ======================================================
   Root Layout
   ====================================================== */

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={[
          // Make the whole app a stable vertical shell
          "min-h-screen",
          "flex flex-col",
          // Theme
          "bg-[var(--color-bg-page)]",
          "font-sans",
          "text-[var(--color-text-primary)]",
          "antialiased",
        ].join(" ")}
      >
        {/* Site Header */}
        <Header />

        {/* Main Content */}
        <main
          className={[
            // IMPORTANT: allow internal grids to shrink correctly
            "flex-1",
            "min-w-0",
            // Keep page content centered + padded
            "mx-auto",
            "w-full",
            "max-w-[1920px]",
            "px-4",
            "sm:px-6",
            "lg:px-8",
            // Optional: give pages breathing room by default
            "py-6",
            "sm:py-8",
          ].join(" ")}
        >
          {children}
        </main>

        {/* Site Footer */}
        <Footer />
      </body>
    </html>
  );
}
