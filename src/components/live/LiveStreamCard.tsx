"use client";

// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Live Stream Card — Devnet-0                                   ┃
   ┃ File   : src/components/live/LiveStreamCard.tsx                        ┃
   ┃ Role   : Displays live streams in grids and discovery views            ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)      ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                       ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved. ┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import Image from "next/image";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";

type LiveStreamCardProps = {
  id: string;
  title: string;
  thumbnail: string;
  seller: {
    name: string;
    avatar: string;
  };
  viewers: number;
};

export function LiveStreamCard({
  id,
  title,
  thumbnail,
  seller,
  viewers,
}: LiveStreamCardProps) {
  return (
    <Link href={`/live/${id}`} className="group">
      <Card className="overflow-hidden rounded-xl bg-[var(--color-bg-surface)] hover:shadow-xl transition-shadow cursor-pointer">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-gray-200">
          <Image
            src={thumbnail}
            alt={title}
            fill
            priority={false}
            className="object-cover group-hover:scale-105 transition-transform duration-300"
          />

          {/* Live Badge */}
          <Badge
            variant="live"
            className="absolute top-3 left-3 px-2 py-0.5 text-xs font-bold"
          >
            LIVE
          </Badge>

          {/* Viewer Count */}
          <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 text-white text-xs rounded-full px-2 py-0.5 font-medium">
            <span>👁️</span>
            <span>{viewers.toLocaleString()}</span>
          </div>
        </div>

        {/* Card Content */}
        <div className="p-4 space-y-3">
          {/* Title */}
          <h3 className="font-semibold text-[var(--color-text-primary)] text-sm sm:text-base line-clamp-2">
            {title}
          </h3>

          {/* Seller */}
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
