"use client";

import { cn } from "@/lib/utils";
import { BANGLA_LETTERS } from "@/constants/floating-letters";

/**
 * FloatingBanglaLetters Component
 *
 * Displays floating Bangla letters as a decorative background element.
 * Letters are positioned randomly with varying sizes, rotations, and opacity.
 * They appear behind the gradient mask for a layered aesthetic effect.
 *
 * @returns {JSX.Element} A container with floating Bangla letters
 */
export function FloatingBanglaLetters() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {BANGLA_LETTERS.map((item, index) => (
        <div
          key={index}
          className={cn("absolute text-foreground select-none", item.size)}
          style={
            {
              top: item.top,
              left: item.left,
              opacity: 0,
              animation: `fadeInFloat 2s ease-out ${item.delay}s forwards`,
              "--rotation": `${item.rotation}deg`,
              "--target-opacity": item.opacity,
            } as React.CSSProperties & {
              "--rotation": string;
              "--target-opacity": number;
            }
          }
        >
          {item.letter}
        </div>
      ))}
    </div>
  );
}
