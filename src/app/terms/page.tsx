// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Terms Page — Devnet-0                                         ┃
   ┃ File   : src/app/terms/page.tsx                                       ┃
   ┃ Role   : Terms of Service (seller-first, cyber-luxury, readable)      ┃
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
  tone?: "neutral" | "warning" | "accent";
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
  title: "Bidly • Terms",
  description: "Terms of Service for Bidly (Devnet-0).",
};

export default function TermsPage() {
  const updatedAt = "2026-01-31";

  const toc = [
    { id: "overview", label: "Overview" },
    { id: "eligibility", label: "Eligibility" },
    { id: "accounts", label: "Accounts & Security" },
    { id: "seller-rules", label: "Seller Rules" },
    { id: "buyer-rules", label: "Buyer Rules" },
    { id: "payments", label: "Payments & Fees" },
    { id: "content", label: "Content & IP" },
    { id: "safety", label: "Safety & Prohibited Items" },
    { id: "moderation", label: "Moderation & Enforcement" },
    { id: "disclaimers", label: "Disclaimers" },
    { id: "liability", label: "Limitation of Liability" },
    { id: "termination", label: "Termination" },
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
                Terms of Service
              </h1>
              <p className="mt-2 text-sm md:text-base text-[var(--color-text-muted)]">
                Seller-first live commerce. Clear rules. Real accountability.
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
                    These Terms govern your use of Bidly, including our website, apps,
                    live rooms, chat, and seller tools. By using Bidly, you agree to
                    follow these rules.
                  </p>
                  <p>
                    Bidly is a live commerce platform. Sellers host live rooms and
                    offer items. Buyers participate and purchase. We may update these
                    Terms as the product evolves.
                  </p>
                </Section>

                <Section id="eligibility" title="Eligibility">
                  <p>
                    You must be able to form a legally binding contract in your
                    jurisdiction. If you are under the age of majority, you may not
                    use Bidly unless a parent/guardian explicitly authorizes it.
                  </p>
                </Section>

                <Section id="accounts" title="Accounts & Security">
                  <p>
                    You are responsible for your account, credentials, and activity.
                    Do not share passwords. Keep your email and security settings up
                    to date.
                  </p>
                  <p>
                    If you suspect unauthorized access, notify us immediately. We may
                    suspend accounts to protect users and the platform.
                  </p>
                </Section>

                <Section id="seller-rules" title="Seller Rules">
                  <p>
                    Sellers must describe items accurately, ship on time, and comply
                    with applicable laws. Do not misrepresent authenticity, condition,
                    or availability.
                  </p>
                  <p>
                    Sellers are responsible for their content (video, listings, chat)
                    and for customer support relating to their orders.
                  </p>
                </Section>

                <Section id="buyer-rules" title="Buyer Rules">
                  <p>
                    Buyers must behave respectfully in chat and follow checkout rules.
                    Chargebacks, fraud, or abusive disputes may result in suspension.
                  </p>
                </Section>

                <Section id="payments" title="Payments & Fees">
                  <p>
                    Payments, fees, and settlement timing may vary by region and seller
                    tier. During Devnet-0, payment flows may be limited or disabled.
                  </p>
                  <p>
                    When enabled, Bidly may charge platform fees, processing fees, or
                    other service fees disclosed at checkout or in seller dashboards.
                  </p>
                </Section>

                <Section id="content" title="Content & IP">
                  <p>
                    You keep ownership of content you create, but you grant Bidly a
                    limited license to host, display, and distribute it for operating
                    the service (including replay, thumbnails, and moderation).
                  </p>
                  <p>
                    Do not upload content you don’t have rights to use. Repeat
                    infringement may result in termination.
                  </p>
                </Section>

                <Section id="safety" title="Safety & Prohibited Items">
                  <p>
                    Prohibited items include illegal goods, stolen property, and any
                    items restricted by law or our policies. We may publish additional
                    restricted categories over time.
                  </p>
                  <p>
                    You may not use Bidly for harassment, hate, threats, or attempts
                    to exploit other users.
                  </p>
                </Section>

                <Section id="moderation" title="Moderation & Enforcement">
                  <p>
                    We may remove content, restrict features, suspend rooms, or
                    terminate accounts for violations of these Terms or for safety and
                    trust reasons.
                  </p>
                  <p>
                    Enforcement decisions may be automated, manual, or a combination.
                  </p>
                </Section>

                <Section id="disclaimers" title="Disclaimers">
                  <p>
                    Bidly is provided “as is” and “as available”. We do not guarantee
                    uninterrupted service, and we do not guarantee that sellers will
                    fulfill orders as expected (though we may enforce policies).
                  </p>
                </Section>

                <Section id="liability" title="Limitation of Liability">
                  <p>
                    To the maximum extent permitted by law, Bidly is not liable for
                    indirect, incidental, special, consequential, or punitive damages,
                    or any loss of profits, revenues, data, or goodwill.
                  </p>
                </Section>

                <Section id="termination" title="Termination">
                  <p>
                    You may stop using Bidly at any time. We may suspend or terminate
                    your access if you violate these Terms or if required for safety,
                    legal compliance, or platform integrity.
                  </p>
                </Section>

                <Section id="contact" title="Contact">
                  <p>
                    Questions about these Terms? Contact us via the site contact page.
                  </p>
                </Section>
              </div>

              <div className="mt-10 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

              <p className="mt-6 text-xs text-white/45">
                This document is a product draft for Devnet-0 and is not legal advice.
                Replace with counsel-reviewed terms before public launch.
              </p>
            </div>
          </main>
        </div>
      </Container>
    </div>
  );
}
