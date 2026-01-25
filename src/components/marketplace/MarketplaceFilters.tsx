"use client";

import { useState } from "react";

export default function MarketplaceFilters() {
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("newest");

  return (
    <section className="border-b border-neutral-200 bg-neutral-50">
      <div className="container flex flex-col gap-4 py-4 md:flex-row md:items-center md:justify-between">
        {/* Left: Categories */}
        <div className="flex flex-wrap items-center gap-2">
          {[
            { label: "All", value: "all" },
            { label: "Digital Assets", value: "digital" },
            { label: "Physical Goods", value: "physical" },
            { label: "Services", value: "services" },
            { label: "Software", value: "software" },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => setCategory(item.value)}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                category === item.value
                  ? "bg-neutral-900 text-white"
                  : "bg-white text-neutral-700 hover:bg-neutral-200"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Right: Sort */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="sort"
            className="text-sm font-medium text-neutral-600"
          >
            Sort by
          </label>
          <select
            id="sort"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 focus:outline-none focus:ring-2 focus:ring-neutral-900"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>
      </div>
    </section>
  );
}
