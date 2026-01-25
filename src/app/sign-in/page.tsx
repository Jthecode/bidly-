"use client";

/* ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   ┃ Bidly — Sign In Page — Devnet-0                                         ┃
   ┃ File   : src/app/sign-in/page.tsx                                        ┃
   ┃ Role   : User authentication page                                        ┃
   ┃ Status : Devnet-0 Ready                                                 ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)        ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                          ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC.                      ┃
   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ */

import * as React from "react";
import Link from "next/link";

import AuthCard from "@/components/auth/AuthCard";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthFooter from "@/components/auth/AuthFooter";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function SignInPage() {
  const [showPassword, setShowPassword] = React.useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0a0a0f] px-4 py-12">
      {/* Futuristic Background Blobs */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute w-64 h-64 bg-purple-700/20 rounded-full top-20 -left-16 blur-3xl animate-blob" />
        <div className="absolute w-72 h-72 bg-blue-500/20 rounded-full bottom-16 -right-20 blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute w-60 h-60 bg-pink-500/10 rounded-full top-40 right-10 blur-2xl animate-blob animation-delay-4000" />
      </div>

      <AuthCard className="w-full max-w-md rounded-3xl shadow-2xl overflow-hidden">
        {/* Top Gradient Accent */}
        <div className="h-1 bg-gradient-to-r from-[#00f0ff] via-[#a200ff] to-[#ff00d0]" />

        <AuthHeader
          title="Welcome Back"
          subtitle="Sign in to access your futuristic marketplace"
        />

        <form className="mt-6 space-y-4">
          <Input type="email" label="Email" placeholder="you@bidly.com" required />

          <Input
            type={showPassword ? "text" : "password"}
            label="Password"
            placeholder="••••••••"
            required
            endIcon={
              <button
                type="button" // ✅ fixed
                onClick={togglePassword}
                className="text-[#00f0ff] hover:text-[#ff00d0]"
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            }
          />

          <Button
            type="submit" // ✅ fixed
            className="w-full bg-gradient-to-r from-[#00f0ff] via-[#a200ff] to-[#ff00d0] text-white font-semibold py-3 rounded-xl shadow-lg transform transition hover:scale-105"
          >
            Sign In
          </Button>
        </form>

        {/* OAuth Buttons */}
        <div className="mt-6 flex gap-3">
          <Button variant="secondary" className="flex-1 flex items-center justify-center gap-2">
            <img src="/icons/google.svg" alt="Google" className="w-5 h-5" />
            Continue with Google
          </Button>
          <Button variant="secondary" className="flex-1 flex items-center justify-center gap-2">
            <img src="/icons/apple.svg" alt="Apple" className="w-5 h-5" />
            Continue with Apple
          </Button>
        </div>

        {/* Footer Links */}
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
