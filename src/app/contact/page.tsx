// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Contact Page — Devnet-0                                       ┃
   ┃ File   : src/app/contact/page.tsx                                     ┃
   ┃ Role   : Contact + inbound form (production-safe, cyber-luxury)       ┃
   ┃ Status : Devnet-0 Ready                                               ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)      ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                       ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

"use client";

import * as React from "react";
import Link from "next/link";

import Container from "@/components/layout/Container";
import Backdrop from "@/components/layout/Backdrop";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type FormState = {
  name: string;
  email: string;
  topic: "support" | "sales" | "partnerships" | "press" | "security" | "other";
  message: string;
};

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

function isEmailLike(v: string) {
  const s = v.trim();
  return s.includes("@") && s.includes(".") && s.length >= 6;
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

export default function ContactPage() {
  const [submitting, setSubmitting] = React.useState(false);
  const [status, setStatus] = React.useState<"idle" | "ok" | "error">("idle");
  const [error, setError] = React.useState<string | null>(null);

  const [form, setForm] = React.useState<FormState>({
    name: "",
    email: "",
    topic: "support",
    message: "",
  });

  const remaining = 1200 - form.message.length;

  function onChange<K extends keyof FormState>(key: K) {
    return (
      e:
        | React.ChangeEvent<HTMLInputElement>
        | React.ChangeEvent<HTMLTextAreaElement>
        | React.ChangeEvent<HTMLSelectElement>
    ) => {
      setError(null);
      setStatus("idle");
      const v = e.target.value;
      setForm((prev) => ({ ...prev, [key]: v } as FormState));
    };
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus("idle");

    const name = form.name.trim();
    const email = form.email.trim();
    const message = form.message.trim();

    if (name.length < 2) {
      setError("Please enter your name.");
      return;
    }
    if (!isEmailLike(email)) {
      setError("Please enter a valid email.");
      return;
    }
    if (message.length < 10) {
      setError("Message is too short. Add a bit more detail.");
      return;
    }

    setSubmitting(true);
    try {
      // Production-safe placeholder: do NOT pretend to send until API is wired.
      // TODO: POST /api/contact (Neon + email provider) with anti-abuse protections.
      await new Promise((r) => setTimeout(r, 450));
      setStatus("error");
      setError("Contact API isn’t wired yet. Add /api/contact to enable submissions.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="relative min-h-[100svh]">
      <Backdrop />

      <Container className="relative py-12" size="full">
        <header className="mx-auto max-w-5xl">
          <p className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
            Contact
          </p>

          <div className="mt-3 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
            <div className="min-w-0">
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
                Let’s talk.
              </h1>
              <p className="mt-3 max-w-2xl text-sm md:text-base text-[var(--color-text-muted)]">
                Support, partnerships, press, security — reach out and we’ll route it to the
                right place. Devnet-0 is intentionally production-safe (no fake sends).
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-white/70 backdrop-blur">
                Response SLA: <span className="ml-2 text-white/85">24–72h</span>
              </span>
              <span className="inline-flex items-center rounded-full border border-white/10 bg-black/25 px-3 py-1 text-xs text-white/70 backdrop-blur">
                Security: <span className="ml-2 text-white/85">responsible disclosure</span>
              </span>
            </div>
          </div>

          <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </header>

        <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Form */}
          <section className="lg:col-span-2 rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6 sm:p-8">
            <h2 className="text-lg font-extrabold tracking-tight text-white">Send a message</h2>
            <p className="mt-1 text-sm text-white/65">
              We’ll follow up via email. Don’t include secrets or private keys.
            </p>

            {error ? (
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/80">
                <span className="font-medium text-white">Heads up:</span>{" "}
                <span className="text-white/75">{error}</span>
              </div>
            ) : status === "ok" ? (
              <div className="mt-5 rounded-2xl border border-white/10 bg-black/25 px-4 py-3 text-sm text-white/80">
                <span className="font-medium text-white">Sent.</span>{" "}
                <span className="text-white/75">We’ll get back to you shortly.</span>
              </div>
            ) : null}

            <form onSubmit={onSubmit} className="mt-6 space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input
                  type="text"
                  label="Name"
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
              </div>

              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <label className="block text-xs font-semibold text-white/70">Topic</label>
                <select
                  value={form.topic}
                  onChange={onChange("topic")}
                  className={cx(
                    "mt-2 w-full rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/85",
                    "outline-none focus:ring-2 focus:ring-[rgba(0,240,255,0.35)]"
                  )}
                >
                  <option value="support">Support</option>
                  <option value="sales">Sales</option>
                  <option value="partnerships">Partnerships</option>
                  <option value="press">Press</option>
                  <option value="security">Security</option>
                  <option value="other">Other</option>
                </select>
              </div>

              {/* Message */}
              <div className="rounded-2xl border border-white/10 bg-black/20 px-4 py-3">
                <label className="block text-xs font-semibold text-white/70">Message</label>
                <textarea
                  value={form.message}
                  onChange={(e) => {
                    setError(null);
                    setStatus("idle");
                    const v = e.target.value;
                    // keep UI snappy + prevent huge payloads
                    const next = v.slice(0, 1200);
                    setForm((prev) => ({ ...prev, message: next }));
                  }}
                  rows={7}
                  placeholder="Tell us what you’re building, what you need, and any links that help."
                  className={cx(
                    "mt-2 w-full resize-none rounded-xl border border-white/10 bg-black/30 px-3 py-2 text-sm text-white/85",
                    "outline-none focus:ring-2 focus:ring-[rgba(255,0,208,0.22)]"
                  )}
                />

                <div className="mt-2 flex items-center justify-between text-[11px] text-white/55">
                  <span>Max 1200 chars</span>
                  <span className={remaining < 100 ? "text-white/80" : ""}>
                    {clamp(remaining, 0, 1200)} remaining
                  </span>
                </div>
              </div>

              <Button
                type="submit"
                disabled={submitting}
                className={cx(
                  "w-full py-3 rounded-xl font-semibold shadow-lg transform transition",
                  "bg-gradient-to-r from-[#00f0ff] via-[#a200ff] to-[#ff00d0] text-white",
                  submitting ? "opacity-70 cursor-not-allowed" : "hover:scale-[1.02]"
                )}
              >
                {submitting ? "Sending…" : "Send Message"}
              </Button>

              <p className="text-[11px] text-white/50">
                By sending, you agree not to share sensitive credentials. For legal terms, see{" "}
                <Link href="/terms" className="text-[#00f0ff] hover:underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-[#00f0ff] hover:underline">
                  Privacy
                </Link>
                .
              </p>
            </form>
          </section>

          {/* Side panel */}
          <aside className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-black/20 backdrop-blur p-6">
              <h3 className="text-sm font-semibold text-white">Fast routes</h3>

              <div className="mt-4 space-y-3 text-sm">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-wider text-white/55">Support</div>
                  <div className="mt-1 text-white/80">
                    Product issues, bugs, access problems.
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-wider text-white/55">Partnerships</div>
                  <div className="mt-1 text-white/80">
                    Seller networks, creators, brands, integrations.
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <div className="text-xs uppercase tracking-wider text-white/55">Security</div>
                  <div className="mt-1 text-white/80">
                    Report vulnerabilities responsibly — include repro steps.
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 backdrop-blur p-6">
              <h3 className="text-sm font-semibold text-white">Need to go live?</h3>
              <p className="mt-2 text-sm text-white/70">
                Start with your seller dashboard and create a room. The homepage will show it
                instantly when your DB is configured.
              </p>
              <Link
                href="/seller"
                className={cx(
                  "mt-4 inline-flex w-full items-center justify-center rounded-xl px-4 py-2 text-sm font-semibold",
                  "border border-white/10 bg-black/25 text-white/85 backdrop-blur hover:bg-white/10 transition"
                )}
              >
                Open Seller Dashboard →
              </Link>
            </div>
          </aside>
        </div>
      </Container>
    </div>
  );
}
