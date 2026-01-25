/* ======================================================
   Bidly — MarketplaceEmptyState Component
   ======================================================
   File: components/marketplace/MarketplaceEmptyState.tsx
   Purpose: UX placeholder when no listings exist
   ====================================================== */
import * as React from "react";
import Button from "@/components/ui/Button"; // default import
import SvgEmpty from "@/components/icons/SvgEmpty"; // default import

interface MarketplaceEmptyStateProps {
  message?: string;
  onClearFilters?: () => void;
}

const MarketplaceEmptyState: React.FC<MarketplaceEmptyStateProps> = ({
  message = "No items found matching your search or filters.",
  onClearFilters,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-24 px-6 text-center">
      {/* Illustration */}
      <SvgEmpty className="w-40 h-40 mb-6 text-neutral-300" />

      {/* Message */}
      <h2 className="text-2xl font-semibold text-neutral-900 mb-2">{message}</h2>
      <p className="text-neutral-600 mb-6">
        Try adjusting your filters or search terms to find what you're looking for.
      </p>

      {/* Optional Clear Filters Button */}
      {onClearFilters && (
        <Button variant="secondary" onClick={onClearFilters}>
          Clear Filters
        </Button>
      )}
    </div>
  );
};

export default MarketplaceEmptyState;
