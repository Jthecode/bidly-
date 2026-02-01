// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Sign Up Page — Devnet-0                                       ┃
   ┃ File   : src/app/(auth)/sign-up/page.tsx                              ┃
   ┃ Role   : User registration page (cyber-luxury, production-safe)       ┃
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
  name: string;
  email: string;
  password: string;
  confirm: string;
  agree: boolean;
};

function isEmailLike(v: string) {
  const s = v.trim();
  return s.includes("@") && s.includes(".") && s.length >= 6;
}

function passwordScore(pw: string) {
  // lightweight UX score (not security policy)
  let score = 0;
  if (pw.length >= 8) score += 1;
  if (/[A-Z]/.test(pw)) score += 1;
  if (/[a-z]/.test(pw)) score += 1;
  if (/[0-9]/.test(pw)) score += 1;
  if (/[^A-Za-z0-9]/.test(pw)) score += 1;
  return Math.min(score, 5);
}

function strengthLabel(score: number) {
  if (score <= 1) return "Weak";
  if (score === 2) return "Okay";
  if (score === 3) return "Good";
  if (score === 4) return "Strong";
  return "Elite";
}

export default function SignUpPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirm, setShowConfirm] = React.useState(false);

  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [form, setForm] = React.useState<FormState>({
    name: "",
    email: "",
    password: "",
    confirm: "",
    agree: true,
  });

  const pwScore = passwordScore(form.password);
  const pwLabel = strengthLabel(pwScore);

  const passwordsMatch =
    form.password.length > 0 && form.confirm.length > 0 && form.password === form.confirm;

  function onChange<K extends keyof FormState>(key: K) {
    return (
      e: React.ChangeEvent<HTMLInputElement> | React.MouseEvent<HTMLButtonElement>
    ) => {
      // checkbox changes come through input event
      if ("target" in e && (e.target as HTMLInputElement).type === "checkbox") {
        const t = e.target as HTMLInputElement;
        setForm((prev) => ({ ...prev, [key]: t.checked } as FormState));
        setError(null);
        return;
      }

      if ("target" in e) {
        const t = e.target as HTMLInputElement;
        setForm((prev) => ({ ...prev, [key]: t.value } as FormState));
        setError(null);
      }
    };
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const name = form.name.trim();
    const email = form.email.trim();

    if (name.length < 2) {
      setError("Please enter your full name.");
      return;
    }
    if (!isEmailLike(email)) {
      setError("Please enter a valid email.");
      return;
    }
    if (!form.password || form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (!form.agree) {
      setError("Please accept the Terms to continue.");
      return;
    }

    setSubmitting(true);
    try {
      // TODO (Devnet-0): Wire Clerk/NextAuth/custom + DB insert (seller profile)
      // Keep it safe: do NOT pretend we created an account until auth is live.
      await new Promise((r) => setTimeout(r, 350));
      setError("Sign-up is not wired yet. Add an auth provider + DB to enable registration.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative flex min-h-[100svh] items-center justify-center px-4 py-12">
      {/* Futuristic background blobs (auth-only layer) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-[rgba(162,0,255,0.16)] blur-3xl animate-blob" />
        <div className="absolute -right-28 bottom-10 h-80 w-80 rounded-full bg-[rgba(0,240,255,0.14)] blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute right-10 top-28 h-64 w-64 rounded-full bg-[rgba(255,0,208,0.10)] blur-3xl animate-blob animation-delay-4000" />
      </div>

      <AuthCard className="w-full max-w-md overflow-hidden rounded-3xl shadow-2xl">
        {/* Top Gradient Accent */}
        <div className="h-1 bg-gradient-to-r from-[#00f0ff] via-[#a200ff] to-[#ff00d0]" />

        <AuthHeader
          title="Create your account"
          subtitle="Join Bidly and go live with a seller-first experience"
        />

        {/* Error banner */}
        {error ? (
          <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/80">
            <span className="font-medium text-white">Heads up:</span>{" "}
            <span className="text-white/75">{error}</span>
          </div>
        ) : null}

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <Input
            type="text"
            label="Full Name"
            placeholder="Jane Doe"
            required
            value={form.name}
            onChange={onChange("name")}
            autoComplete="name"
          />

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
            autoComplete="new-password"
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

          {/* Strength meter */}
          <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-white/70">Password strength</p>
              <p className="text-xs font-semibold text-white">{pwLabel}</p>
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-white/10">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#00f0ff] via-[#a200ff] to-[#ff00d0] transition-[width] duration-300"
                style={{ width: `${(pwScore / 5) * 100}%` }}
                aria-hidden="true"
              />
            </div>
            <p className="mt-2 text-[11px] text-white/55">
              Tip: 8+ chars, mix upper/lower, number, and symbol.
            </p>
          </div>

          <Input
            type={showConfirm ? "text" : "password"}
            label="Confirm Password"
            placeholder="••••••••"
            required
            value={form.confirm}
            onChange={onChange("confirm")}
            autoComplete="new-password"
            endIcon={
              <button
                type="button"
                onClick={() => setShowConfirm((v) => !v)}
                className="rounded-md px-2 py-1 text-xs font-semibold text-[#00f0ff] transition hover:text-[#ff00d0] focus:outline-none focus:ring-2 focus:ring-[rgba(0,240,255,0.45)]"
                aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
              >
                {showConfirm ? "Hide" : "Show"}
              </button>
            }
          />

          {form.confirm.length > 0 ? (
            <div
              className={[
                "rounded-2xl border px-4 py-3 text-xs",
                passwordsMatch
                  ? "border-white/10 bg-black/15 text-white/70"
                  : "border-[rgba(255,0,208,0.22)] bg-[rgba(255,0,208,0.06)] text-white/80",
              ].join(" ")}
            >
              {passwordsMatch ? "Passwords match." : "Passwords do not match."}
            </div>
          ) : null}

          <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-black/15 px-4 py-3 text-xs text-white/70">
            <input
              type="checkbox"
              checked={form.agree}
              onChange={onChange("agree") as any}
              className="mt-0.5 h-4 w-4 rounded border-white/15 bg-black/30"
              aria-label="Agree to Terms"
            />
            <span>
              I agree to the{" "}
              <Link href="/sign-up" className="font-medium text-[#00f0ff] hover:underline">
                Terms
              </Link>{" "}
              and{" "}
              <Link href="/sign-up" className="font-medium text-[#00f0ff] hover:underline">
                Privacy Policy
              </Link>
              .
            </span>
          </label>

          <Button
            type="submit"
            disabled={submitting}
            className={[
              "w-full font-semibold py-3 rounded-xl shadow-lg transform transition",
              "bg-gradient-to-r from-[#00f0ff] via-[#a200ff] to-[#ff00d0] text-white",
              submitting ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02]",
            ].join(" ")}
          >
            {submitting ? "Creating…" : "Sign Up"}
          </Button>
        </form>

        {/* OAuth */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Button
            variant="secondary"
            className="flex items-center justify-center gap-2"
            type="button"
            aria-label="Continue with Google"
          >
            <img src="/icons/google.svg" alt="" className="h-5 w-5" />
            Google
          </Button>
          <Button
            variant="secondary"
            className="flex items-center justify-center gap-2"
            type="button"
            aria-label="Continue with Apple"
          >
            <img src="/icons/apple.svg" alt="" className="h-5 w-5" />
            Apple
          </Button>
        </div>

        <div className="mt-6 text-center text-sm">
          <span className="text-[var(--color-text-muted)]">Already have an account?</span>{" "}
          <Link href="/sign-in" className="font-medium text-[#00f0ff] hover:underline">
            Sign In
          </Link>
        </div>

        <AuthFooter variant="sign-up" />
      </AuthCard>
    </div>
  );
}
