// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Streaming (Provider) — Devnet-0                                ┃
   ┃ File   : src/lib/streaming/provider.ts                                 ┃
   ┃ Role   : Streaming provider abstraction + selection (Mux-first)        ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import "server-only";

/**
 * Provider file goals (Devnet-0):
 * - Single abstraction that keeps streaming details OUT of UI.
 * - Server-only: ingestUrl + streamKey never leak to the client.
 * - Provider selection via env, with safe defaults.
 * - Mux-first implementation (AWS IVS can be added later without refactors).
 *
 * Env:
 * - BIDLY_STREAM_PROVIDER="mux" | "custom" | "aws-ivs" (not implemented yet)
 *
 * Mux env (required if provider=mux):
 * - MUX_TOKEN_ID
 * - MUX_TOKEN_SECRET
 * - MUX_WEBHOOK_SECRET (recommended; used by webhook verification)
 * - MUX_PLAYBACK_POLICY="public" | "signed" (optional)
 */

/* =====================================================================
   Core types
   ===================================================================== */

export type StreamProviderKind = "mux" | "custom" | "aws-ivs";
export type StreamId = string;
export type PlaybackId = string;

export type StreamLatencyMode = "standard" | "low";
export type PlaybackPolicy = "public" | "signed";

export type StreamAsset = {
  provider: StreamProviderKind;

  streamId: StreamId;
  playbackId: PlaybackId;

  /**
   * Server-only secrets (never return these to the browser).
   * - ingestUrl: RTMP/RTMPS ingest endpoint
   * - streamKey: provider stream key
   */
  ingestUrl?: string;
  streamKey?: string;

  /**
   * ISO timestamp when the provider resource was created.
   */
  createdAt: string;

  /**
   * Optional provider passthrough metadata. Keep as plain strings.
   */
  metadata?: Record<string, string>;
};

export type CreateStreamInput = {
  /**
   * Optional display name for provider dashboards.
   */
  name?: string;

  /**
   * Optional metadata you may want embedded (roomId, sellerId, etc.)
   */
  metadata?: Record<string, string>;

  /**
   * Latency/profile selection.
   */
  latencyMode?: StreamLatencyMode;

  /**
   * Playback policy (public vs signed).
   */
  playbackPolicy?: PlaybackPolicy;
};

export type EndStreamInput = {
  streamId: StreamId;
};

export type ProviderWebhookEventType =
  | "stream.created"
  | "stream.active"
  | "stream.idle"
  | "stream.ended"
  | "asset.ready"
  | "playback.ready"
  | "unknown";

export type ProviderWebhookEvent = {
  provider: StreamProviderKind;
  type: ProviderWebhookEventType;

  streamId?: string;
  playbackId?: string;

  raw: unknown;
  receivedAt: string; // ISO
};

export interface StreamingProvider {
  kind: StreamProviderKind;

  /**
   * Create a new stream asset for a room.
   */
  createStream(input: CreateStreamInput): Promise<StreamAsset>;

  /**
   * End/disable a stream. Some providers don't truly "end" but can disable.
   */
  endStream(input: EndStreamInput): Promise<{ ok: true }>;

  /**
   * Verify and parse a webhook request from the provider.
   * MUST throw on invalid signatures.
   */
  parseWebhook(req: Request): Promise<ProviderWebhookEvent>;
}

/* =====================================================================
   Env + selection
   ===================================================================== */

function optionalEnv(name: string) {
  const v = process.env[name];
  return v && v.trim().length ? v : undefined;
}

function requireEnv(name: string) {
  const v = optionalEnv(name);
  if (!v) throw new Error(`[streaming] Missing required env var: ${name}`);
  return v;
}

function nowIso() {
  return new Date().toISOString();
}

/**
 * BIDLY_STREAM_PROVIDER
 * - mux (default)
 * - custom
 * - aws-ivs (reserved; not implemented yet)
 */
export function getStreamingProviderKind(): StreamProviderKind {
  const raw = (optionalEnv("BIDLY_STREAM_PROVIDER") ?? "mux").trim().toLowerCase();

  if (raw === "mux") return "mux";
  if (raw === "custom") return "custom";
  if (raw === "aws-ivs" || raw === "awsivs" || raw === "ivs") return "aws-ivs";

  throw new Error(`[streaming] Invalid BIDLY_STREAM_PROVIDER: ${raw}`);
}

/**
 * Singleton provider (per server runtime).
 */
let _provider: StreamingProvider | null = null;

/**
 * Returns the selected provider implementation.
 *
 * NOTE:
 * - Lazy imports keep bundles lean.
 * - This file is server-only; providers may use Node APIs.
 */
export async function getStreamingProvider(): Promise<StreamingProvider> {
  assertServerOnly();

  if (_provider) return _provider;

  const kind = getStreamingProviderKind();

  if (kind === "mux") {
    // Fail fast with a crystal-clear error if env isn't configured.
    requireEnv("MUX_TOKEN_ID");
    requireEnv("MUX_TOKEN_SECRET");

    const mod = await import("./mux");
    _provider = mod.muxProvider;
    return _provider;
  }

  if (kind === "aws-ivs") {
    // We’re Mux-first. Keeping the type for future, but NOT importing a missing file.
    throw new Error(
      "[streaming] BIDLY_STREAM_PROVIDER=aws-ivs selected, but AWS IVS is not implemented yet. " +
        "Set BIDLY_STREAM_PROVIDER=mux."
    );
  }

  _provider = createCustomProvider();
  return _provider;
}

/**
 * Useful in tests/dev to reset singleton state.
 */
export function resetStreamingProviderForTests() {
  _provider = null;
}

/* =====================================================================
   Custom provider (stub)
   ===================================================================== */

function makePseudoId(prefix: string) {
  return `${prefix}_${Date.now().toString(16)}_${Math.random().toString(16).slice(2)}`;
}

/**
 * Custom provider is a stub used when you bring your own infrastructure.
 * It returns non-secret IDs that allow the app to proceed in development.
 */
function createCustomProvider(): StreamingProvider {
  return {
    kind: "custom",

    async createStream(input) {
      return {
        provider: "custom",
        streamId: makePseudoId("custom_stream"),
        playbackId: makePseudoId("custom_play"),
        createdAt: nowIso(),
        metadata: input.metadata,
      };
    },

    async endStream() {
      return { ok: true as const };
    },

    async parseWebhook(req: Request) {
      const raw = await req.json().catch(() => null);
      return {
        provider: "custom",
        type: "unknown",
        raw,
        receivedAt: nowIso(),
      };
    },
  };
}

/* =====================================================================
   Hard guard
   ===================================================================== */

/**
 * Defensive check for accidental client import.
 * Next.js should honor `server-only`, but this gives clearer errors.
 */
export function assertServerOnly() {
  if (typeof window !== "undefined") {
    throw new Error("[streaming] provider.ts must not be imported in the browser.");
  }
}
