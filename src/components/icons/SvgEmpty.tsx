/* ======================================================
   Bidly — SvgEmpty Component
   ======================================================
   File: components/icons/SvgEmpty.tsx
   Purpose: Reusable SVG illustration for empty states
   ====================================================== */
import * as React from "react";

interface SvgEmptyProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  color?: string;
}

const SvgEmpty: React.FC<SvgEmptyProps> = ({
  className = "w-40 h-40 text-neutral-300",
  color = "currentColor",
  ...props
}) => {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Example: empty box illustration */}
      <rect
        x="8"
        y="16"
        width="48"
        height="32"
        rx="4"
        stroke={color}
        strokeWidth="2"
        strokeDasharray="4 2"
      />
      <path
        d="M16 16L32 32L48 16"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="32" cy="32" r="2" fill={color} />
    </svg>
  );
};

export default SvgEmpty;
