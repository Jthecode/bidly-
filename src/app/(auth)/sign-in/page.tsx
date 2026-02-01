// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Sign In Page — Devnet-0                                       ┃
   ┃ File   : src/app/(auth)/sign-in/page.tsx                              ┃
   ┃ Role   : User authentication page (seller-first, cyber-luxury)        ┃
   ┃ Status : Devnet-0 Ready                                               ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)      ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

"use client";

import * as React from "react";
import Link from "next/link";

import AuthCard from "@/components/auth/AuthCard";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthFooter from "@/components/auth/AuthFooter";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type FormState = {
  email: string;
  password: string;
};

function isEmailLike(v: string) {
  const s = v.trim();
  // Simple email-like check (not RFC exhaustive; good UX guard)
  return s.includes("@") && s.includes(".") && s.length >= 6;
}

export default function SignInPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [form, setForm] = React.useState<FormState>({
    email: "",
    password: "",
  });

  function onChange<K extends keyof FormState>(key: K) {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      setError(null);
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const email = form.email.trim();
    const password = form.password;

    if (!isEmailLike(email)) {
      setError("Please enter a valid email.");
      return;
    }
    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      // TODO (Devnet-0): wire real auth provider (Clerk / NextAuth / custom).
      // For now, this keeps the page production-safe without fake success.
      await new Promise((r) => setTimeout(r, 350));
      setError("Auth is not wired yet. Add an auth provider to enable sign-in.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-[100svh] items-center justify-center px-4 py-12">
      {/* Ambient auth-only blobs (works with global Backdrop too) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-[rgba(0,240,255,0.16)] blur-3xl animate-blob" />
        <div className="absolute -right-28 bottom-10 h-80 w-80 rounded-full bg-[rgba(162,0,255,0.14)] blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute right-10 top-28 h-64 w-64 rounded-full bg-[rgba(255,0,208,0.10)] blur-3xl animate-blob animation-delay-4000" />
      </div>

      <AuthCard className="w-full max-w-md overflow-hidden rounded-3xl shadow-2xl">
        {/* Top gradient accent */}
        <div className="h-1 bg-gradient-to-r from-[#00f0ff] via-[#a200ff] to-[#ff00d0]" />

        <AuthHeader title="Welcome back" subtitle="Sign in to your live channel dashboard" />

        {/* Error banner */}
        {error ? (
          <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/80">
            <span className="font-medium text-white">Heads up:</span>{" "}
            <span className="text-white/75">{error}</span>
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <Input
            type="email"
            label="Email"
            placeholder="you@bidly.com"
            required
            value={form.email}
            onChange={onChange("email")}
            autoComplete="email"
            inputMode="email"
          />

          <Input
            type={showPassword ? "text" : "password"}
            label="Password"
            placeholder="••••••••"
            required
            value={form.password}
            onChange={onChange("password")}
            autoComplete="current-password"
            endIcon={
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="rounded-md px-2 py-1 text-xs font-semibold text-[#00f0ff] transition hover:text-[#ff00d0] focus:outline-none focus:ring-2 focus:ring-[rgba(0,240,255,0.45)]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            }
          />

          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 text-xs text-white/65">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-white/15 bg-black/30"
                aria-label="Remember me"
              />
              Remember me
            </label>

            <Link
              href="/sign-in"
              className="text-xs font-medium text-white/60 transition hover:text-white"
              aria-label="Forgot password"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={submitting}
            className={[
              "w-full font-semibold py-3 rounded-xl shadow-lg transform transition",
              "bg-gradient-to-r from-[#00f0ff] via-[#a200ff] to-[#ff00d0] text-white",
              submitting ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02]",
            ].join(" ")}
          >
            {submitting ? "Signing in…" : "Sign In"}
          </Button>
        </form>

        {/* OAuth (placeholders, no client handlers needed yet) */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button
            type="button"
            variant="secondary"
            className="flex items-center justify-center gap-2"
            aria-label="Continue with Google"
          >
            <img src="/icons/google.svg" alt="" className="h-5 w-5" />
            Google
          </Button>

          <Button
            type="button"
            variant="secondary"
            className="flex items-center justify-center gap-2"
            aria-label="Continue with Apple"
          >
            <img src="/icons/apple.svg" alt="" className="h-5 w-5" />
            Apple
          </Button>
        </div>

        <div className="mt-6 text-center text-sm">
          <span className="text-[var(--color-text-muted)]">Don’t have an account?</span>{" "}
          <Link href="/sign-up" className="font-medium text-[#00f0ff] hover:underline">
            Sign Up
          </Link>
        </div>

        <AuthFooter variant="sign-in" />
      </AuthCard>
    </div>
  );
}
