// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Seller Onboarding — Devnet-0                                  ┃
   ┃ File   : src/app/(seller)/seller/onboarding/page.tsx                   ┃
   ┃ Role   : Seller setup (profile + payout stub + stream settings stub)   ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                         ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

"use client";

import * as React from "react";
import Link from "next/link";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type StepKey = "profile" | "payouts" | "stream";

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

function StepPill({
  active,
  done,
  label,
}: {
  active?: boolean;
  done?: boolean;
  label: string;
}) {
  return (
    <div
      className={cx(
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
        done
          ? "border-white/10 bg-white/10 text-white"
          : active
          ? "border-[var(--color-ring)]/40 bg-[var(--color-ring)]/10 text-white"
          : "border-white/10 bg-white/5 text-white/70"
      )}
    >
      <span
        className={cx(
          "inline-block h-2 w-2 rounded-full",
          done
            ? "bg-[#22c55e] shadow-[0_0_16px_rgba(34,197,94,0.35)]"
            : active
            ? "bg-[var(--color-accent)] shadow-[0_0_16px_rgba(0,240,255,0.35)]"
            : "bg-white/30"
        )}
      />
      {label}
    </div>
  );
}

export default function SellerOnboardingPage() {
  const [step, setStep] = React.useState<StepKey>("profile");

  // Profile
  const [displayName, setDisplayName] = React.useState("");
  const [handle, setHandle] = React.useState("");
  const [bio, setBio] = React.useState("");

  // Payouts (stub)
  const [country, setCountry] = React.useState("US");
  const [payoutEmail, setPayoutEmail] = React.useState("");

  // Stream (stub)
  const [provider, setProvider] = React.useState<"cloudflare" | "mux" | "custom">(
    "cloudflare"
  );
  const [rtmpUrl, setRtmpUrl] = React.useState("");
  const [streamKeyId, setStreamKeyId] = React.useState("");

  const doneProfile = displayName.trim().length >= 2 && handle.trim().length >= 2;
  const donePayouts = payoutEmail.trim().includes("@");
  const doneStream = rtmpUrl.trim().length > 10 && streamKeyId.trim().length > 2;

  const canFinish = doneProfile && donePayouts && doneStream;

  function normalizeHandle(raw: string) {
    const v = raw.trim();
    if (!v) return "";
    const withAt = v.startsWith("@") ? v : `@${v}`;
    // keep it URL-safe-ish
    return withAt.replace(/\s+/g, "").replace(/[^@a-zA-Z0-9_\.]/g, "");
  }

  function goNext() {
    if (step === "profile") setStep("payouts");
    else if (step === "payouts") setStep("stream");
  }

  function goBack() {
    if (step === "stream") setStep("payouts");
    else if (step === "payouts") setStep("profile");
  }

  async function onFinish(e: React.FormEvent) {
    e.preventDefault();

    // TODO: wire to real persistence + auth user id
    // Suggested next steps:
    // - POST /api/seller/onboarding to store profile/payout/stream preferences
    // - create seller record keyed to user id
    alert("Saved (stub). Next: wire persistence + auth.");
  }

  return (
    <div className="min-w-0 space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-xl font-semibold text-white sm:text-2xl">
              Seller onboarding
            </h1>
            <p className="mt-1 text-sm text-white/60">
              Set up your profile, payouts, and stream settings. (Devnet-0 stubs —
              persistence comes next.)
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <StepPill label="Profile" active={step === "profile"} done={doneProfile} />
              <StepPill label="Payouts" active={step === "payouts"} done={donePayouts} />
              <StepPill label="Streaming" active={step === "stream"} done={doneStream} />
            </div>
          </div>

          <div className="shrink-0">
            <Link
              href="/seller"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10 hover:border-white/15 transition"
            >
              Back to dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={onFinish}
        className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl p-4 sm:p-5"
      >
        {/* Step: Profile */}
        {step === "profile" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Profile</h2>
              <p className="mt-1 text-sm text-white/60">
                This appears on your channel and seller card.
              </p>
            </div>

            <Input
              label="Display name"
              placeholder="e.g. NeonVault Collects"
              value={displayName}
              onChange={(e: any) => setDisplayName(e.target.value)}
              required
            />

            <Input
              label="Handle"
              placeholder="@neonvault"
              value={handle}
              onChange={(e: any) => setHandle(normalizeHandle(e.target.value))}
              required
            />

            {/* Small textarea without introducing new component dependencies */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-white/80">Bio</label>
              <textarea
                className={cx(
                  "w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2",
                  "text-sm text-white placeholder:text-white/40",
                  "outline-none focus:border-[var(--color-ring)]/45 focus:ring-2 focus:ring-[var(--color-ring)]/25",
                  "min-h-[104px]"
                )}
                placeholder="What do you sell? What’s your vibe?"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
              <p className="text-xs text-white/45">
                Optional. Keep it short and premium.
              </p>
            </div>
          </div>
        )}

        {/* Step: Payouts */}
        {step === "payouts" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Payouts</h2>
              <p className="mt-1 text-sm text-white/60">
                Stubbed for Devnet-0 — wire Stripe Connect next.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Input
                label="Country"
                placeholder="US"
                value={country}
                onChange={(e: any) => setCountry(e.target.value.toUpperCase())}
              />
              <Input
                label="Payout email"
                type="email"
                placeholder="payouts@yourbrand.com"
                value={payoutEmail}
                onChange={(e: any) => setPayoutEmail(e.target.value)}
                required
              />
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-sm font-semibold text-white">Next integration</p>
              <p className="mt-1 text-sm text-white/60">
                Use Stripe Connect to create an Express account for this seller and
                store the returned account id.
              </p>
              <p className="mt-2 text-xs text-white/45">
                Later: verification, tax forms, bank link, chargeback handling.
              </p>
            </div>
          </div>
        )}

        {/* Step: Streaming */}
        {step === "stream" && (
          <div className="space-y-4">
            <div>
              <h2 className="text-sm font-semibold text-white">Streaming</h2>
              <p className="mt-1 text-sm text-white/60">
                Choose a provider and save ingest settings. (Keys are ID-only here.)
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-sm font-medium text-white/80">
                  Provider
                </label>
                <select
                  className={cx(
                    "w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2",
                    "text-sm text-white outline-none",
                    "focus:border-[var(--color-ring)]/45 focus:ring-2 focus:ring-[var(--color-ring)]/25"
                  )}
                  value={provider}
                  onChange={(e) => setProvider(e.target.value as any)}
                >
                  <option value="cloudflare">Cloudflare Stream</option>
                  <option value="mux">Mux</option>
                  <option value="custom">Custom RTMP</option>
                </select>
                <p className="text-xs text-white/45">
                  You’ll wire provider APIs later to mint keys automatically.
                </p>
              </div>

              <Input
                label="Stream key id"
                placeholder="key_123 (ID only — never store raw key in client)"
                value={streamKeyId}
                onChange={(e: any) => setStreamKeyId(e.target.value)}
                required
              />
            </div>

            <Input
              label="RTMP ingest url"
              placeholder="rtmps://live.cloudflare.com:443/live/"
              value={rtmpUrl}
              onChange={(e: any) => setRtmpUrl(e.target.value)}
              required
            />

            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-sm font-semibold text-white">Security note</p>
              <p className="mt-1 text-sm text-white/60">
                In production, never expose raw stream keys. Store a provider key id
                and validate broadcaster actions server-side.
              </p>
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={goBack}>
              Back
            </Button>
            {step !== "stream" ? (
              <Button
                type="button"
                onClick={goNext}
                className="bg-gradient-to-r from-[#00f0ff] via-[#a200ff] to-[#ff00d0] text-white"
              >
                Next
              </Button>
            ) : (
              <Button
                type="submit"
                className={cx(
                  "bg-gradient-to-r from-[#00f0ff] via-[#a200ff] to-[#ff00d0] text-white",
                  !canFinish && "opacity-60 pointer-events-none"
                )}
              >
                Finish onboarding
              </Button>
            )}
          </div>

          <p className="text-xs text-white/45">
            Devnet-0: this page is UI-first. Next step is wiring auth + persistence.
          </p>
        </div>
      </form>
    </div>
  );
}
