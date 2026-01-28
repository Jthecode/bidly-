// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Realtime Auth (Ably) — Devnet-0                                ┃
   ┃ File   : src/app/api/realtime/auth/route.ts                            ┃
   ┃ Role   : Mint Ably token requests (server-only, secure client auth)    ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import "server-only";

import { NextResponse } from "next/server";

/**
 * Ably Token Auth endpoint
 * ---------------------------------------------------------------------
 * Browser Ably clients should be configured with:
 *   NEXT_PUBLIC_ABLY_AUTH_URL="/api/realtime/auth"
 *
 * Server env required:
 *   ABLY_API_KEY="xxxx.yyyy:zzzzzzzzzzzzzzzz"  (KEEP SECRET)
 *
 * Optional:
 *   BIDLY_REALTIME_CLIENT_ID_PREFIX="bidly"
 *
 * Security posture (MVP):
 * - This endpoint issues a token for a derived clientId.
 * - Later we can bind clientId to a real session user / seller auth.
 *
 * Docs:
 * - Ably token auth: https://ably.com/docs/core-features/authentication#token-auth
 */

function env(name: string, required = true) {
  const v = process.env[name];
  if (!v && required) {
    throw new Error(`[Bidly Ably] Missing environment variable: ${name}`);
  }
  return v ?? "";
}

function safeId(s: string) {
  return s
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]+/g, "-")
    .replace(/(^-|-$)/g, "")
    .slice(0, 48);
}

function rand(n = 10) {
  // small, URL-safe entropy
  const alphabet = "abcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < n; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

/**
 * We keep this endpoint POST-only to avoid accidental caching issues.
 */
export async function POST(req: Request) {
  // Lazy import so Ably is only required when this endpoint is called.
  const Ably = (await import("ably")).default as any;

  const apiKey = env("ABLY_API_KEY");
  const prefix = safeId(process.env.BIDLY_REALTIME_CLIENT_ID_PREFIX ?? "bidly");

  // Parse an optional desired clientId from body.
  // If omitted, we generate a stable-ish anonymous id.
  let requestedClientId: string | undefined;
  try {
    const body = (await req.json()) as { clientId?: string } | null;
    requestedClientId = body?.clientId;
  } catch {
    requestedClientId = undefined;
  }

  const clientId =
    requestedClientId && typeof requestedClientId === "string"
      ? `${prefix}:${safeId(requestedClientId)}`
      : `${prefix}:anon-${rand(12)}`;

  /**
   * Capabilities:
   * - For MVP we allow publish/subscribe/presence on bidly:* channels.
   * - Tighten later per user role (viewer vs seller vs moderator).
   */
  const capability = {
    "bidly:*": ["publish", "subscribe", "presence"],
  };

  const rest = new Ably.Rest({ key: apiKey });

  // If Ably sends CORS preflight, make sure POST works.
  // Next.js handles OPTIONS automatically; no need to define unless custom.

  try {
    const tokenRequest = await rest.auth.createTokenRequest({
      clientId,
      capability,
      // token validity in ms (example: 1 hour)
      ttl: 60 * 60 * 1000,
    });

    return NextResponse.json(tokenRequest, {
      status: 200,
      headers: {
        "Cache-Control": "no-store",
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: "Failed to create Ably token request", detail: String(err?.message ?? err) },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
