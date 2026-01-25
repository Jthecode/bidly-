"use client";

// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Stream Card — Devnet-0                                        ┃
   ┃ File   : src/components/live/StreamCard.tsx                            ┃
   ┃ Role   : Displays upcoming / recorded streams                          ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)      ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                       ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved. ┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";

type StreamCardProps = {
  id: string;
  title: string;
  thumbnail: string;
  seller: {
    name: string;
    avatar: string;
  };
  scheduledFor?: string;
};

export function StreamCard({
  id,
  title,
  thumbnail,
  seller,
  scheduledFor,
}: StreamCardProps) {
  return (
    <Link href={`/live/${id}`} className="group">
      <Card className="overflow-hidden rounded-xl bg-[var(--color-bg-surface)] hover:shadow-xl transition-shadow cursor-pointer">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-gray-200">
          <Image
            src={thumbnail}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Scheduled Badge */}
          {scheduledFor && (
            <div className="absolute top-3 left-3 bg-black/70 text-white text-xs font-medium px-2 py-1 rounded-full">
              ⏰ {scheduledFor}
            </div>
          )}
        </div>

        {/* Card Content */}
        <div className="p-4 space-y-3">
          <h3 className="font-semibold text-[var(--color-text-primary)] text-sm sm:text-base line-clamp-2">
            {title}
          </h3>

          <div className="flex items-center gap-2">
            <Avatar src={seller.avatar} alt={seller.name} size="sm" />
            <span className="text-sm text-[var(--color-text-secondary)] line-clamp-1">
              {seller.name}
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
