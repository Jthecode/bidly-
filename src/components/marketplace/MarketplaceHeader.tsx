import Link from "next/link";

export default function MarketplaceHeader() {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <div className="container flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
        {/* Left */}
        <div>
          <h1 className="text-3xl font-bold text-neutral-900">
            Marketplace
          </h1>
          <p className="mt-2 max-w-xl text-neutral-600">
            Discover verified products, digital assets, and services built
            for the Quantara ecosystem.
          </p>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/marketplace/submit"
            className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-neutral-800"
          >
            Submit Listing
          </Link>

          <Link
            href="/marketplace/categories"
            className="inline-flex items-center justify-center rounded-xl border border-neutral-300 px-5 py-2.5 text-sm font-semibold text-neutral-900 transition hover:bg-neutral-100"
          >
            Browse Categories
          </Link>
        </div>
      </div>
    </header>
  );
}
