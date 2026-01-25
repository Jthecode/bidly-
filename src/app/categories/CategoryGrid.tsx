// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — Category Grid — Devnet-0                                      ┃
   ┃ File   : src/app/categories/CategoryGrid.tsx                           ┃
   ┃ Role   : Grid layout for category discovery (breathing room)           ┃
   ┃ Status : Devnet-0 Ready                                                ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import * as React from "react";
import CategoryCard from "./CategoryCard";
import { getCategories, type Category } from "./category.data";

function cx(...parts: Array<string | undefined | null | false>) {
  return parts.filter(Boolean).join(" ");
}

export interface CategoryGridProps {
  categories?: Category[];
  className?: string;

  /**
   * Layout controls
   * - max: width cap so tiles breathe (kills clustered look)
   * - cols: desktop column target
   */
  max?: "lg" | "xl" | "2xl" | "3xl" | "full";
  cols?: 2 | 3 | 4;

  gap?: "tight" | "md" | "wide";
}

export default function CategoryGrid({
  categories,
  className,
  max = "2xl",
  cols = 3,
  gap = "wide",
}: CategoryGridProps) {
  const items = categories?.length ? categories : getCategories();

  const cap =
    max === "full"
      ? "max-w-none"
      : max === "lg"
        ? "max-w-[1100px]"
        : max === "xl"
          ? "max-w-[1280px]"
          : max === "3xl"
            ? "max-w-[1600px]"
            : "max-w-[1440px]";

  const gaps =
    gap === "tight"
      ? "gap-x-4 gap-y-6 sm:gap-x-5 sm:gap-y-7"
      : gap === "md"
        ? "gap-x-6 gap-y-8 sm:gap-x-7 sm:gap-y-9"
        : "gap-x-7 gap-y-9 sm:gap-x-8 sm:gap-y-10";

  // Desktop behavior: never cram 4-up unless explicitly requested
  const gridCols =
    cols === 4
      ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
      : cols === 2
        ? "grid-cols-1 sm:grid-cols-2"
        : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={cx("mx-auto w-full", cap, className)}>
      <div
        className={cx(
          "grid",
          gridCols,
          gaps,
          "items-start auto-rows-max",
          "min-w-0 [&>*]:min-w-0"
        )}
      >
        {items.map((c) => (
          <div key={c.slug} className="min-w-0">
            <CategoryCard category={c} />
          </div>
        ))}
      </div>
    </div>
  );
}
