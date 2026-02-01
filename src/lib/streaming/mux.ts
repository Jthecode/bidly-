// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Streaming (Mux) — Devnet-0                                     ┃
   ┃ File   : src/lib/streaming/mux.ts                                      ┃
   ┃ Role   : Mux provider implementation (create stream + webhook parsing) ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import "server-only";

import type { CreateStreamInput, ProviderWebhookEvent, StreamingProvider, StreamAsset } from "./provider";

/**
 * Env:
 * - MUX_TOKEN_ID
 * - MUX_TOKEN_SECRET
 * - MUX_WEBHOOK_SECRET (recommended)
 *
 * Optional:
 * - MUX_PLAYBACK_POLICY ("public" | "signed") default: public
 */
function env(name: string) {
  const v = process.env[name];
  if (!v) throw new Error(`[mux] Missing required environment variable: ${name}`);
  return v;
}

function optionalEnv(name: string) {
  const v = process.env[name];
  return v && v.trim().length ? v : undefined;
}

function nowIso() {
  return new Date().toISOString();
}

function pickPlaybackPolicy(input?: CreateStreamInput["playbackPolicy"]) {
  const raw = (input ?? optionalEnv("MUX_PLAYBACK_POLICY") ?? "public").toLowerCase();
  return raw === "signed" ? "signed" : "public";
}

/**
 * Lightweight signature verification for Mux webhooks.
 *
 * Mux docs:
 * - Header: "Mux-Signature"
 * - Format: "t=<timestamp>,v1=<signature>"
 * - HMAC SHA256 of `${timestamp}.${rawBody}` with webhook secret.
 *
 * Note: we keep this dependency-free to stay lean.
 */
async function verifyMuxWebhook(req: Request, rawBody: string) {
  const header = req.headers.get("Mux-Signature") || req.headers.get("mux-signature");
  const secret = optionalEnv("MUX_WEBHOOK_SECRET");

  if (!secret) {
    // If you don't set a webhook secret, we can’t verify signatures.
    // For production, always set it.
    return { ok: true, warning: "MUX_WEBHOOK_SECRET not set; signature not verified." as const };
  }

  if (!header) throw new Error("[mux] Missing Mux-Signature header");

  const parts = header.split(",").map((s) => s.trim());
  const tPart = parts.find((p) => p.startsWith("t="));
  const v1Part = parts.find((p) => p.startsWith("v1="));

  if (!tPart || !v1Part) throw new Error("[mux] Invalid Mux-Signature header format");

  const ts = tPart.slice(2);
  const sig = v1Part.slice(3);

  const data = new TextEncoder().encode(`${ts}.${rawBody}`);
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  const mac = await crypto.subtle.sign("HMAC", key, data);
  const hex = Array.from(new Uint8Array(mac))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");

  // Constant-time compare
  if (hex.length !== sig.length) throw new Error("[mux] Signature length mismatch");
  let diff = 0;
  for (let i = 0; i < hex.length; i++) diff |= hex.charCodeAt(i) ^ sig.charCodeAt(i);
  if (diff !== 0) throw new Error("[mux] Invalid webhook signature");

  return { ok: true as const };
}

/**
 * Minimal Mux REST client using fetch (no SDK required).
 * Endpoint base: https://api.mux.com
 */
async function muxFetch(path: string, init: RequestInit = {}) {
  const tokenId = env("MUX_TOKEN_ID");
  const tokenSecret = env("MUX_TOKEN_SECRET");

  const auth = Buffer.from(`${tokenId}:${tokenSecret}`).toString("base64");

  const res = await fetch(`https://api.mux.com${path}`, {
    ...init,
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
    cache: "no-store",
  });

  if (!res.ok) {
    const txt = await res.text().catch(() => "");
    throw new Error(`[mux] HTTP ${res.status} ${res.statusText} — ${txt.slice(0, 500)}`);
  }

  return res;
}

async function createMuxLiveStream(input: CreateStreamInput): Promise<StreamAsset> {
  const playbackPolicy = pickPlaybackPolicy(input.playbackPolicy);

  const name = input.name ?? "Bidly Live Stream";
  const latency = input.latencyMode === "low" ? "low_latency" : "standard";

  const body = {
    playback_policy: playbackPolicy === "signed" ? ["signed"] : ["public"],
    new_asset_settings: {
      playback_policy: playbackPolicy === "signed" ? ["signed"] : ["public"],
    },
    // A subset of allowed values: "standard" | "low_latency"
    // Mux uses "low_latency" for LL streams.
    latency_mode: latency,
    // For future: you can set "reconnect_window" etc.
    // For metadata:
    passthrough: input.metadata ? JSON.stringify(input.metadata) : undefined,
    name,
  };

  const res = await muxFetch("/video/v1/live-streams", {
    method: "POST",
    body: JSON.stringify(body),
  });

  const json = (await res.json()) as any;
  const data = json?.data;

  const streamId = data?.id as string;
  const playbackId = data?.playback_ids?.[0]?.id as string | undefined;

  const ingestUrl = data?.stream_key ? "rtmps://global-live.mux.com:443/app" : undefined;
  const streamKey = data?.stream_key as string | undefined;

  if (!streamId) throw new Error("[mux] createStream: missing stream id");
  if (!playbackId) throw new Error("[mux] createStream: missing playback id");

  return {
    provider: "mux",
    streamId,
    playbackId,
    ingestUrl,
    streamKey,
    createdAt: nowIso(),
  };
}

async function disableMuxLiveStream(streamId: string) {
  // Mux supports disabling a live stream:
  // POST /video/v1/live-streams/{LIVE_STREAM_ID}/disable
  await muxFetch(`/video/v1/live-streams/${encodeURIComponent(streamId)}/disable`, {
    method: "POST",
    body: JSON.stringify({}),
  });
}

async function parseMuxWebhook(req: Request): Promise<ProviderWebhookEvent> {
  const rawBody = await req.text();
  await verifyMuxWebhook(req, rawBody);

  const payload = JSON.parse(rawBody) as any;

  const typeRaw = String(payload?.type ?? "unknown");
  const data = payload?.data ?? {};
  const streamId = data?.id ?? data?.live_stream_id ?? data?.object?.id;
  const playbackId = data?.playback_id ?? data?.playback_ids?.[0]?.id;

  // Map Mux event types -> our canonical set
  let type: ProviderWebhookEvent["type"] = "unknown";
  if (typeRaw.includes("live_stream.created")) type = "stream.created";
  else if (typeRaw.includes("live_stream.active")) type = "stream.active";
  else if (typeRaw.includes("live_stream.idle")) type = "stream.idle";
  else if (typeRaw.includes("live_stream.disconnected") || typeRaw.includes("live_stream.disabled"))
    type = "stream.ended";
  else if (typeRaw.includes("video.asset.ready")) type = "asset.ready";
  else if (typeRaw.includes("video.playback.ready")) type = "playback.ready";

  return {
    provider: "mux",
    type,
    streamId: streamId ? String(streamId) : undefined,
    playbackId: playbackId ? String(playbackId) : undefined,
    raw: payload,
    receivedAt: nowIso(),
  };
}

export const muxProvider: StreamingProvider = {
  kind: "mux",

  async createStream(input) {
    return createMuxLiveStream(input);
  },

  async endStream({ streamId }) {
    await disableMuxLiveStream(streamId);
    return { ok: true as const };
  },

  async parseWebhook(req) {
    return parseMuxWebhook(req);
  },
};
