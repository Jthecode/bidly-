// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Middleware — Devnet-0                                        ┃
   ┃ File   : src/app/middleware.ts                                       ┃
   ┃ Role   : Route protection & auth gating                              ┃
   ┃ Status : Devnet-0 Ready                                              ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)     ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                      ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC.                  ┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/* ======================================================
   Config
   ====================================================== */

/**
 * Routes that do NOT require authentication
 */
const PUBLIC_ROUTES = [
  "/",
  "/sign-in",
  "/sign-up",
  "/categories",
];

/**
 * Prefix-based public paths (assets, static, etc.)
 */
const PUBLIC_PREFIXES = [
  "/_next",
  "/favicon.ico",
  "/images",
  "/placeholder",
];

/* ======================================================
   Middleware
   ====================================================== */

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public prefixes
  if (PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // Allow exact public routes
  if (PUBLIC_ROUTES.includes(pathname)) {
    return NextResponse.next();
  }

  /**
   * 🔐 Auth check placeholder
   * This will be replaced by Clerk middleware once enabled
   */
  const isAuthenticated = false; // TODO: replace with Clerk auth()

  if (!isAuthenticated) {
    const signInUrl = new URL("/sign-in", req.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

/* ======================================================
   Matcher
   ====================================================== */

export const config = {
  matcher: [
    /*
     * Apply middleware to all routes except static assets
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
};
