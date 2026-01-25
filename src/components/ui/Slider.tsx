/* ======================================================
   Bidly — Slider Component — Devnet-0
   ======================================================
   File: components/ui/Slider.tsx
   Purpose: Reusable range slider for price or numeric filters with futuristic design
   ====================================================== */
"use client";

import * as React from "react";

interface SliderProps {
  min: number;
  max: number;
  value: [number, number];
  onValueChange: (value: [number, number]) => void;
  step?: number;
  className?: string;
}

const Slider: React.FC<SliderProps> = ({
  min,
  max,
  value,
  onValueChange,
  step = 1,
  className = "",
}) => {
  const [minVal, setMinVal] = React.useState(value[0]);
  const [maxVal, setMaxVal] = React.useState(value[1]);

  const handleMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), maxVal - step);
    setMinVal(val);
    onValueChange([val, maxVal]);
  };

  const handleMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), minVal + step);
    setMaxVal(val);
    onValueChange([minVal, val]);
  };

  // Calculate percentages for styles
  const minPercent = ((minVal - min) / (max - min)) * 100;
  const maxPercent = ((maxVal - min) / (max - min)) * 100;

  return (
    <div className={`relative w-full h-6 ${className}`}>
      {/* Slider Track */}
      <div className="absolute w-full h-1 bg-[var(--color-bg-elevated)] rounded top-1/2 -translate-y-1/2" />

      {/* Selected Range */}
      <div
        className="absolute h-1 bg-[var(--color-accent)] rounded top-1/2 -translate-y-1/2 transition-all duration-200"
        style={{
          left: `${minPercent}%`,
          right: `${100 - maxPercent}%`,
        }}
      />

      {/* Min Handle */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={minVal}
        onChange={handleMinChange}
        className="absolute w-full appearance-none pointer-events-none h-0 top-1/2 -translate-y-1/2"
      />

      {/* Max Handle */}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={maxVal}
        onChange={handleMaxChange}
        className="absolute w-full appearance-none pointer-events-none h-0 top-1/2 -translate-y-1/2"
      />

      {/* Min Thumb */}
      <div
        className="absolute w-5 h-5 bg-[var(--color-accent)] rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2 shadow-[0_0_6px_var(--color-accent)] hover:scale-110 transition-transform cursor-pointer"
        style={{ left: `${minPercent}%` }}
      />

      {/* Max Thumb */}
      <div
        className="absolute w-5 h-5 bg-[var(--color-accent)] rounded-full top-1/2 -translate-y-1/2 -translate-x-1/2 shadow-[0_0_6px_var(--color-accent)] hover:scale-110 transition-transform cursor-pointer"
        style={{ left: `${maxPercent}%` }}
      />
    </div>
  );
};

export default Slider;
