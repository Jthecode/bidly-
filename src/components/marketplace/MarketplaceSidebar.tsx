// ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
/* ┃ Bidly — MarketplaceSidebar Component — Devnet-0                          ┃
   ┃ File   : components/marketplace/MarketplaceSidebar.tsx                  ┃
   ┃ Role   : Sidebar for marketplace filters and controls                   ┃
   ┃ Status : Devnet-0 Ready                                                 ┃
   ┃ License: Quantara Open Source License v1 (Apache-2.0 compatible)       ┃
   ┃ SPDX-License-Identifier: Apache-2.0 OR QOSL-1.0                        ┃
   ┃ Copyright (C) 2026 Bidly / Quantara Technology LLC. All rights reserved.┃ */
// ┗━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┛

import * as React from "react";
import Checkbox from "@/components/ui/Checkbox";
import Slider from "@/components/ui/Slider";
import Button from "@/components/ui/Button";

interface Category {
  id: string;
  name: string;
}

interface Tag {
  id: string;
  name: string;
}

interface MarketplaceSidebarProps {
  categories: Category[];
  tags: Tag[];
  minPrice: number;
  maxPrice: number;
  selectedCategories: string[];
  selectedTags: string[];
  priceRange: [number, number];
  onCategoryChange: (id: string) => void;
  onTagChange: (id: string) => void;
  onPriceChange: (range: [number, number]) => void;
  onClearFilters: () => void;
}

const MarketplaceSidebar: React.FC<MarketplaceSidebarProps> = ({
  categories,
  tags,
  minPrice,
  maxPrice,
  selectedCategories,
  selectedTags,
  priceRange,
  onCategoryChange,
  onTagChange,
  onPriceChange,
  onClearFilters,
}) => {
  return (
    <aside className="w-full lg:w-72 p-6 bg-[var(--color-bg-surface)] border border-[var(--color-border-subtle)] rounded-xl shadow-sm space-y-6">
      {/* Categories */}
      <section>
        <h3 className="text-lg font-semibold mb-2 text-[var(--color-text-primary)]">Categories</h3>
        <div className="flex flex-col gap-2">
          {categories.map((cat) => (
            <label key={cat.id} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={selectedCategories.includes(cat.id)}
                onCheckedChange={() => onCategoryChange(cat.id)}
              />
              <span className="text-[var(--color-text-secondary)]">{cat.name}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Tags */}
      <section>
        <h3 className="text-lg font-semibold mb-2 text-[var(--color-text-primary)]">Tags</h3>
        <div className="flex flex-col gap-2">
          {tags.map((tag) => (
            <label key={tag.id} className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={selectedTags.includes(tag.id)}
                onCheckedChange={() => onTagChange(tag.id)}
              />
              <span className="text-[var(--color-text-secondary)]">{tag.name}</span>
            </label>
          ))}
        </div>
      </section>

      {/* Price Slider */}
      <section>
        <h3 className="text-lg font-semibold mb-2 text-[var(--color-text-primary)]">Price Range</h3>
        <Slider
          min={minPrice}
          max={maxPrice}
          value={priceRange}
          onValueChange={onPriceChange}
        />
        <div className="flex justify-between text-sm mt-1 text-[var(--color-text-secondary)]">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </section>

      {/* Clear Filters Button */}
      <Button
        variant="secondary"
        onClick={onClearFilters}
        className="w-full mt-4"
      >
        Clear Filters
      </Button>
    </aside>
  );
};

export default MarketplaceSidebar;
