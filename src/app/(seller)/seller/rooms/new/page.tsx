// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Seller Create Room Page — Devnet-0                            ┃
   ┃ File   : src/app/(seller)/seller/rooms/new/page.tsx                    ┃
   ┃ Role   : Create a new live room (seller-first)                         ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                         ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

type CreateRoomPayload = {
  title: string;
  description?: string;
  visibility?: "public" | "unlisted" | "private";
  category?: "all" | "trending" | "new" | "verified" | "digital" | "physical" | "services" | "software";
  tags?: string[];
  coverUrl?: string;
  seller: {
    id: string;
    name: string;
    handle?: string;
    avatarUrl?: string;
    verified?: boolean;
  };
};

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

function parseTags(raw: string) {
  const t = raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .slice(0, 20);
  return t.length ? t : undefined;
}

function clampLen(s: string, max: number) {
  const v = s.trim();
  return v.length > max ? v.slice(0, max) : v;
}

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return null;
  }
}

export default function SellerNewRoomPage() {
  const router = useRouter();

  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [visibility, setVisibility] = React.useState<"public" | "unlisted" | "private">("public");
  const [category, setCategory] = React.useState<CreateRoomPayload["category"]>("digital");
  const [tags, setTags] = React.useState("");
  const [coverUrl, setCoverUrl] = React.useState("");

  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  // Devnet-0 placeholder seller identity (until auth is wired)
  const seller = React.useMemo<CreateRoomPayload["seller"]>(
    () => ({
      id: "seller_devnet0_001",
      name: "Seller 1",
      handle: "@seller1",
      verified: true,
    }),
    []
  );

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (pending) return;

    setError(null);

    const t = clampLen(title, 90);
    if (!t) {
      setError("Title is required.");
      return;
    }

    const payload: CreateRoomPayload = {
      title: t,
      description: description.trim() ? clampLen(description, 500) : undefined,
      visibility,
      category,
      tags: parseTags(tags),
      coverUrl: coverUrl.trim() ? clampLen(coverUrl, 400) : undefined,
      seller,
    };

    setPending(true);
    try {
      const res = await fetch("/api/live/rooms", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await safeJson(res);

      if (!res.ok) {
        const msg =
          (data && typeof data === "object" && (data as any).error) ||
          `Failed to create room (HTTP ${res.status}).`;
        setError(String(msg));
        return;
      }

      const roomId = data?.room?.id;
      if (typeof roomId === "string" && roomId.trim()) {
        router.push(`/seller/rooms/${roomId}`);
        return;
      }

      // Fallback: go back to list
      router.push("/seller/rooms");
    } catch {
      setError("Network error creating room. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="min-w-0 space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white/60">Seller</p>
            <h1 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
              Create a new room
            </h1>
            <p className="mt-2 text-sm text-white/60">
              Set a title, cover, and category — then jump into Studio to go live.
            </p>
          </div>

          <div className="shrink-0 flex gap-2">
            <Link
              href="/seller/rooms"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10 hover:border-white/15 transition"
            >
              Back to rooms
            </Link>
          </div>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={onSubmit}
        className="rounded-2xl border border-white/10 bg-black/20 backdrop-blur-xl p-4 sm:p-5"
      >
        <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
          <Input
            label="Room title"
            placeholder="e.g., Mystery Box Live"
            value={title}
            onChange={(e: any) => setTitle(e.target.value)}
            required
          />

          <Input
            label="Cover image URL (optional)"
            placeholder="https://…"
            value={coverUrl}
            onChange={(e: any) => setCoverUrl(e.target.value)}
          />

          <div className="lg:col-span-2">
            <label className="block text-sm font-semibold text-white/80">
              Description (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="What are you selling today?"
              className={cx(
                "mt-2 w-full min-w-0 rounded-2xl border border-white/10 bg-black/30 p-3 text-sm text-white/90",
                "outline-none",
                "focus:border-[var(--color-ring)]/50 focus:ring-2 focus:ring-[var(--color-ring)]/25"
              )}
              rows={4}
              maxLength={500}
            />
            <p className="mt-2 text-xs text-white/45">
              {Math.min(description.length, 500)}/500
            </p>
          </div>

          {/* Visibility */}
          <div>
            <label className="block text-sm font-semibold text-white/80">
              Visibility
            </label>
            <select
              value={visibility}
              onChange={(e) => setVisibility(e.target.value as any)}
              className={cx(
                "mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white/90",
                "outline-none",
                "focus:border-[var(--color-ring)]/50 focus:ring-2 focus:ring-[var(--color-ring)]/25"
              )}
            >
              <option value="public">Public</option>
              <option value="unlisted">Unlisted</option>
              <option value="private">Private</option>
            </select>
            <p className="mt-2 text-xs text-white/45">
              Public shows in marketplace. Unlisted needs a link. Private is seller-only.
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-semibold text-white/80">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as any)}
              className={cx(
                "mt-2 w-full rounded-2xl border border-white/10 bg-black/30 px-3 py-3 text-sm text-white/90",
                "outline-none",
                "focus:border-[var(--color-ring)]/50 focus:ring-2 focus:ring-[var(--color-ring)]/25"
              )}
            >
              <option value="digital">Digital</option>
              <option value="physical">Physical</option>
              <option value="services">Services</option>
              <option value="software">Software</option>
              <option value="verified">Verified</option>
              <option value="trending">Trending</option>
              <option value="new">New</option>
              <option value="all">All</option>
            </select>
            <p className="mt-2 text-xs text-white/45">
              Powers filters — you can refine this later.
            </p>
          </div>

          {/* Tags */}
          <div className="lg:col-span-2">
            <Input
              label="Tags (comma-separated, optional)"
              placeholder="mystery box, deals, fashion"
              value={tags}
              onChange={(e: any) => setTags(e.target.value)}
            />
            <p className="mt-2 text-xs text-white/45">
              Up to 20 tags. These help discovery.
            </p>
          </div>
        </div>

        {error ? (
          <div className="mt-4 rounded-2xl border border-[#ef4444]/25 bg-[#ef4444]/10 p-3 text-sm text-[#fecaca]">
            {error}
          </div>
        ) : null}

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-xs text-white/45">
            Creating as{" "}
            <span className="font-semibold text-white/70">
              {seller.name}
              {seller.verified ? " · Verified" : ""}
            </span>{" "}
            (Devnet-0 placeholder)
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="ghost"
              className="rounded-xl"
              onClick={() => router.push("/seller/rooms")}
              disabled={pending}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="primary"
              className="rounded-xl bg-gradient-to-r from-[#00f0ff] via-[#a200ff] to-[#ff00d0] text-white shadow-lg"
              disabled={pending}
            >
              {pending ? "Creating…" : "Create room"}
            </Button>
          </div>
        </div>
      </form>

      {/* Next steps */}
      <div className="rounded-2xl border border-white/10 bg-black/10 p-4 text-sm text-white/60">
        <p className="font-semibold text-white/80">Next</p>
        <p className="mt-1">
          After creation, go to <span className="text-white/80">Studio</span> to connect
          your stream ingest and start broadcasting.
        </p>
      </div>
    </div>
  );
}
