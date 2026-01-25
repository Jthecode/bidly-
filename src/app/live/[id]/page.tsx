/* ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
   ┃ Bidly — Live Auction Page — Devnet-0                                  ┃
   ┃ File   : src/app/live/[id]/page.tsx                                   ┃
   ┃ Role   : Seller-first live room (stage + sidebar, cyber-luxury)        ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃
   ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛ */

import * as React from "react";
import { notFound } from "next/navigation";

import Backdrop from "@/components/layout/Backdrop";
import Container from "@/components/layout/Container";

import LiveShell from "./LiveShell";
import LiveHeader from "./LiveHeader";
import LiveStage from "./LiveStage";
import LiveSidebar from "./LiveSidebar";

import { getLiveRoom } from "./live.data";

type PageProps = {
  params: { id: string };
};

export default async function LivePage({ params }: PageProps) {
  const id = (params?.id ?? "").trim();
  if (!id) notFound();

  const room = await getLiveRoom(id);
  if (!room) notFound();

  return (
    <div className="relative min-h-[100svh]">
      <Backdrop />

      {/* Keep layout stable: container + shell control spacing (not child cards). */}
      <Container className="relative py-10" size="full">
        <LiveShell>
          <LiveHeader room={room} backHref="/" />

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-12">
            {/* Stage (seller-first hero / video area) */}
            <div className="min-w-0 lg:col-span-8">
              <LiveStage room={room} />
            </div>

            {/* Sidebar (chat + seller info + actions) */}
            <div className="min-w-0 lg:col-span-4">
              <LiveSidebar room={room} />
            </div>
          </div>
        </LiveShell>
      </Container>
    </div>
  );
}
