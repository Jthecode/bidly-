// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Realtime (Ably) — Devnet-0                                     ┃
   ┃ File   : src/lib/realtime/ably.server.ts                               ┃
   ┃ Role   : Server-only Ably helpers (REST client + token auth minting)   ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import "server-only";

import Ably from "ably";
import { randomUUID } from "node:crypto";

export type AblyCapability = Record<
  string,
  Array<"publish" | "subscribe" | "presence" | "history">
>;

export type MintTokenRequestInput = {
  /**
   * Optional external identity (user id, session id, etc).
   * If provided, we will embed it into clientId in a safe way.
   */
  userId?: string;

  /**
   * If you already have a preferred clientId, provide it directly.
   * If both userId and clientId are present, clientId wins.
   */
  clientId?: string;

  /**
   * Capability defaults to bidly:* with publish/subscribe/presence/history.
   * You can scope it down for stricter security.
   */
  capability?: AblyCapability;

  /**
   * Token TTL in ms (defaults to 60 minutes).
   */
  ttlMs?: number;
};

const DEFAULT_TTL_MS = 60 * 60 * 1000;

const DEFAULT_CAPABILITY: AblyCapability = {
  "bidly:*": ["publish", "subscribe", "presence", "history"],
};

let _rest: Ably.Rest | null = null;

function env(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`[Ably] Missing required environment variable: ${name}`);
  return v;
}

function optionalEnv(name: string) {
  const v = process.env[name];
  return v && v.trim().length ? v : undefined;
}

function sanitizeToken(input: string) {
  // Ably clientId must be <= 128 chars and should be URL-safe-ish.
  // Keep it strict: alphanum + "_" + "-" + ":" + "."
  return input.replace(/[^a-zA-Z0-9_\-:.]/g, "_").slice(0, 96);
}

function buildClientId(input?: { userId?: string }) {
  const prefix = optionalEnv("BIDLY_REALTIME_CLIENT_ID_PREFIX") ?? "bidly";
  const userId = input?.userId ? sanitizeToken(input.userId) : "anon";
  const nonce = sanitizeToken(randomUUID());
  // Keep room for Ably constraints.
  return `${prefix}:${userId}:${nonce}`.slice(0, 128);
}

/**
 * Server-side Ably REST client.
 * Uses ABLY_API_KEY (never expose this to the browser).
 */
export function getAblyRest(): Ably.Rest {
  if (_rest) return _rest;

  const key = env("ABLY_API_KEY");
  _rest = new Ably.Rest({
    key,
    // Keep us resilient under load without becoming noisy.
    // You can tune these later if needed.
    realtimeRequestTimeout: 10_000,
    httpRequestTimeout: 10_000,
    fallbackHosts: [
      "a.ably-realtime.com",
      "b.ably-realtime.com",
      "c.ably-realtime.com",
      "d.ably-realtime.com",
      "e.ably-realtime.com",
    ],
  });

  return _rest;
}

/**
 * Mint an Ably TokenRequest to be returned by /api/realtime/auth.
 *
 * Typical flow:
 * - Browser Ably client is configured with authUrl="/api/realtime/auth"
 * - That route calls mintAblyTokenRequest() on the server
 * - Ably SDK exchanges the token request for a token automatically
 */
export async function mintAblyTokenRequest(input: MintTokenRequestInput = {}) {
  const rest = getAblyRest();

  const clientId = input.clientId
    ? sanitizeToken(input.clientId)
    : buildClientId({ userId: input.userId });

  const capabilityObj = input.capability ?? DEFAULT_CAPABILITY;

  // Ably accepts capability as a JSON string.
  const capability = JSON.stringify(capabilityObj);

  const ttl = Math.max(10_000, input.ttlMs ?? DEFAULT_TTL_MS);

  // Create a signed token request (safe to send to client; does NOT expose ABLY_API_KEY)
  const tokenRequest = await rest.auth.createTokenRequest({
    clientId,
    capability,
    ttl,
  });

  return tokenRequest;
}

/**
 * Optional helper: issue a server-side token (not usually needed if you use authUrl).
 * Use this only if you need server-to-server realtime actions with a distinct identity.
 */
export async function issueAblyToken(input: MintTokenRequestInput = {}) {
  const rest = getAblyRest();

  const clientId = input.clientId
    ? sanitizeToken(input.clientId)
    : buildClientId({ userId: input.userId });

  const capabilityObj = input.capability ?? DEFAULT_CAPABILITY;
  const capability = JSON.stringify(capabilityObj);
  const ttl = Math.max(10_000, input.ttlMs ?? DEFAULT_TTL_MS);

  const tokenDetails = await rest.auth.requestToken({ clientId, capability, ttl });
  return tokenDetails;
}

/**
 * Lightweight config check for diagnostics.
 */
export function isAblyServerConfigured() {
  return Boolean(optionalEnv("ABLY_API_KEY"));
}
