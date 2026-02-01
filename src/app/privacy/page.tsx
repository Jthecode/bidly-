// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Privacy Page — Devnet-0                                       ┃
   ┃ File   : src/app/privacy/page.tsx                                     ┃
   ┃ Role   : Privacy Policy (clear, seller-first, cyber-luxury layout)    ┃
   ┃ Status : Devnet-0 Ready                                               ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)      ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                       ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import * as React from "react";

import Container from "@/components/layout/Container";
import Backdrop from "@/components/layout/Backdrop";

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

function Pill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "accent" | "warning";
}) {
  const cls =
    tone === "accent"
      ? "border-[rgba(0,240,255,0.22)] bg-[rgba(0,240,255,0.08)] text-white/80"
      : tone === "warning"
        ? "border-[rgba(255,0,208,0.22)] bg-[rgba(255,0,208,0.08)] text-white/85"
        : "border-white/10 bg-white/5 text-white/75";
  return (
    <span className={cx("inline-flex items-center rounded-full border px-3 py-1 text-xs backdrop-blur", cls)}>
      {children}
    </span>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24">
      <h2 className="text-lg sm:text-xl font-semibold tracking-tight text-white">{title}</h2>
      <div className="mt-3 space-y-3 text-sm leading-relaxed text-white/70">{children}</div>
    </section>
  );
}

export const metadata = {
  title: "Bidly • Privacy",
  description: "Privacy Policy for Bidly (Devnet-0).",
};

export default function PrivacyPage() {
  const updatedAt = "2026-01-31";

  const toc = [
    { id: "overview", label: "Overview" },
    { id: "data-we-collect", label: "Data We Collect" },
    { id: "how-we-use", label: "How We Use Data" },
    { id: "sharing", label: "Sharing" },
    { id: "security", label: "Security" },
    { id: "choices", label: "Your Choices" },
    { id: "retention", label: "Retention" },
    { id: "children", label: "Children" },
    { id: "changes", label: "Changes" },
    { id: "contact", label: "Contact" },
  ] as const;

  return (
    <div className="relative min-h-[100svh]">
      <Backdrop />

      <Container className="relative py-12" size="full">
        <header className="mx-auto max-w-4xl">
          <p className="text-xs uppercase tracking-wider text-[var(--color-text-muted)]">
            Legal
          </p>

          <div className="mt-2 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
              <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
                Privacy Policy
              </h1>
              <p className="mt-2 text-sm md:text-base text-[var(--color-text-muted)]">
                What we collect, how we use it, and the choices you have.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <Pill>Devnet-0</Pill>
              <Pill tone="accent">Updated {updatedAt}</Pill>
              <Pill tone="warning">Draft</Pill>
            </div>
          </div>

          <div className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        </header>

        <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[300px_minmax(0,1fr)]">
          {/* TOC */}
          <aside className="lg:sticky lg:top-24 self-start">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4">
              <p className="text-xs font-semibold tracking-wide text-white/80">
                On this page
              </p>
              <nav className="mt-3 grid gap-1.5">
                {toc.map((t) => (
                  <a
                    key={t.id}
                    href={`#${t.id}`}
                    className={cx(
                      "rounded-xl px-3 py-2 text-sm transition",
                      "border border-transparent hover:border-white/10",
                      "text-white/70 hover:text-white",
                      "bg-black/15 hover:bg-black/25"
                    )}
                  >
                    {t.label}
                  </a>
                ))}
              </nav>
            </div>
          </aside>

          {/* Content */}
          <main className="min-w-0">
            <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur p-5 sm:p-7">
              <div className="space-y-10">
                <Section id="overview" title="Overview">
                  <p>
                    This Privacy Policy explains how Bidly collects, uses, and shares
                    information when you use our services, including live rooms,
                    chat, seller tools, and customer support.
                  </p>
                  <p>
                    This is a Devnet-0 draft. Before public launch, we’ll finalize this
                    policy with counsel and align it with your live regions and vendors.
                  </p>
                </Section>

                <Section id="data-we-collect" title="Data We Collect">
                  <p>
                    We may collect information you provide directly (like name, email,
                    seller profile details), information from your activity (like rooms
                    joined, chat messages, and purchases), and device/usage data (like
                    browser type and basic diagnostics).
                  </p>
                  <p>
                    If you go live, we may process stream metadata and content required
                    to deliver the experience (e.g., video playback, thumbnails, and
                    moderation signals).
                  </p>
                </Section>

                <Section id="how-we-use" title="How We Use Data">
                  <p>
                    We use information to operate Bidly: to create accounts, provide
                    live rooms and chat, process payments (when enabled), prevent fraud,
                    enforce policies, and improve performance and reliability.
                  </p>
                  <p>
                    We may use aggregated metrics to understand marketplace health
                    (e.g., active rooms, viewers, latency, and crash rates).
                  </p>
                </Section>

                <Section id="sharing" title="Sharing">
                  <p>
                    We may share information with service providers that help us run Bidly
                    (hosting, analytics, payments, livestream infrastructure, realtime
                    messaging). These providers are limited to what’s necessary to provide
                    their services.
                  </p>
                  <p>
                    We may share information to comply with law, respond to lawful
                    requests, protect users, prevent abuse, or enforce our Terms.
                  </p>
                </Section>

                <Section id="security" title="Security">
                  <p>
                    We apply reasonable safeguards designed to protect information, but no
                    system is perfectly secure. Use strong passwords and protect your
                    account credentials.
                  </p>
                </Section>

                <Section id="choices" title="Your Choices">
                  <p>
                    Depending on your region and how the product is configured, you may be
                    able to access, update, or delete certain profile details. You can also
                    opt out of some communications (e.g., marketing emails) if enabled.
                  </p>
                </Section>

                <Section id="retention" title="Retention">
                  <p>
                    We keep information for as long as needed to provide services, comply
                    with legal obligations, resolve disputes, and enforce agreements.
                    Retention varies by data type and region.
                  </p>
                </Section>

                <Section id="children" title="Children">
                  <p>
                    Bidly is not intended for children under the age required to consent
                    in your jurisdiction. If you believe a child has provided personal
                    information, contact us so we can take appropriate action.
                  </p>
                </Section>

                <Section id="changes" title="Changes">
                  <p>
                    We may update this Privacy Policy as Bidly evolves. If changes are
                    material, we’ll provide additional notice in-product or via email
                    where required.
                  </p>
                </Section>

                <Section id="contact" title="Contact">
                  <p>
                    For privacy questions or requests, contact us via the site contact page.
                  </p>
                </Section>
              </div>

              <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <p className="mt-6 text-xs text-white/45">
                This document is a product draft for Devnet-0 and is not legal advice.
                Replace with counsel-reviewed policy before public launch.
              </p>
            </div>
          </main>
        </div>
      </Container>
    </div>
  );
}
