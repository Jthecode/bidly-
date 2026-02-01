// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Middleware — Devnet-0                                         ┃
   ┃ File   : src/middleware.ts                                            ┃
   ┃ Role   : Route protection & auth gating (safe, production-ready)      ┃
   ┃ Status : Devnet-0 Ready                                               ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)      ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                       ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved. ┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/* ======================================================
   Config
   ====================================================== */

/**
 * Exact routes that do NOT require authentication.
 * Keep these minimal and explicit.
 */
const PUBLIC_ROUTES = new Set<string>([
  "/",
  "/sign-in",
  "/sign-up",
  "/categories",
]);

/**
 * Prefix-based public paths (assets, static, etc.)
 * NOTE: include /api if you have public endpoints.
 */
const PUBLIC_PREFIXES: ReadonlyArray<string> = [
  "/_next",
  "/favicon.ico",
  "/images",
  "/placeholder",
  "/public",
  "/api", // keep public while auth provider is not wired; tighten later per-route
];

/**
 * Auth gating switch:
 * - default OFF so you don't accidentally lock yourself out in prod.
 * - turn ON by setting NEXT_PUBLIC_AUTH_ENABLED="true"
 *
 * When you wire Clerk/NextAuth, replace the placeholder auth check below.
 */
const AUTH_ENABLED =
  (process.env.NEXT_PUBLIC_AUTH_ENABLED ?? "").toLowerCase() === "true";

/* ======================================================
   Helpers
   ====================================================== */

function isPublicPath(pathname: string) {
  if (PUBLIC_ROUTES.has(pathname)) return true;
  return PUBLIC_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(`${p}/`)
  );
}

function isStaticAsset(pathname: string) {
  // Common file extensions that should bypass middleware.
  // Helps avoid accidental redirects on images/fonts/etc.
  return /\.(?:png|jpg|jpeg|webp|gif|svg|ico|css|js|map|txt|xml|json|woff2?|ttf|eot)$/.test(
    pathname
  );
}

/* ======================================================
   Middleware
   ====================================================== */

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow known public paths/prefixes and static assets
  if (isPublicPath(pathname) || isStaticAsset(pathname)) {
    return NextResponse.next();
  }

  // Auth not enabled yet => don't gate routes (safe default)
  if (!AUTH_ENABLED) {
    return NextResponse.next();
  }

  /**
   * 🔐 Auth check placeholder (replace with Clerk / NextAuth / custom session)
   *
   * Recommended approach:
   * - Check an HTTP-only cookie (e.g. "bidly_session") set by your auth provider
   * - Or use Clerk middleware (clerkMiddleware) directly and remove this file
   */
  const hasSession =
    Boolean(req.cookies.get("bidly_session")?.value) ||
    Boolean(req.cookies.get("__session")?.value) ||
    Boolean(req.cookies.get("session")?.value);

  if (!hasSession) {
    const signInUrl = req.nextUrl.clone();
    signInUrl.pathname = "/sign-in";
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

/* ======================================================
   Matcher
   ====================================================== */

export const config = {
  /**
   * Apply middleware to all routes except:
   * - Next static/image
   * - common public files
   *
   * Keep this broad; we also guard in-code (isPublicPath/isStaticAsset).
   */
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)",
  ],
};
