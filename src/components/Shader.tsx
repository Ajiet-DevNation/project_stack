"use client";

import React, { useState, useRef, useEffect } from "react";
// Removed Framer Motion hooks: useMotionValue, useAnimationFrame, MotionValue
// import { motion } from "framer-motion"; // 'motion' is no longer needed
import { cn } from "@/lib/utils";

// CSS-based grid pattern using repeating-linear-gradient
// This ensures the pattern renders continuously without waiting for full tiles
const GridPattern = () => {
  return (
    <div
      className="w-full h-full animate-grid-slide"
      style={{
        backgroundImage: `
          repeating-linear-gradient(
            0deg,
            transparent,
            transparent 49px,
            var(--foreground) 49px,
            var(--foreground) 50px
          ),
          repeating-linear-gradient(
            90deg,
            transparent,
            transparent 49px,
            var(--foreground) 49px,
            var(--foreground) 50px
          )
        `,
        backgroundSize: "50px 50px",
        backgroundRepeat: "repeat",
      }}
    />
  );
};

export const Shader = () => {
  // isMobile state is unused in this simplified example, but kept for context
  const [isMobile, setIsMobile] = React.useState(false);

  // All grid-related state (gridOffsetX, gridOffsetY, useAnimationFrame) has been removed.

  // NOTE: The `useEffect` for `visibilitychange` is now redundant
  // because CSS animations automatically pause when the tab is hidden.

  return (
    <div
      className={cn(
        "relative w-full h-screen flex flex-col items-center justify-center overflow-hidden"
      )}
      style={{
        background: "var(--background)",
        color: "var(--foreground)",
      }}
    >
      {/* Optimized Grid Layer 
          - opacity-20 for subtlety
          - Removed `transform: translateZ(0)` here, as it's better placed on the animating element (the rect)
      */}
      <div className="absolute inset-0 opacity-7 pointer-events-none">
        {/* The animation logic is now inside GridPattern */}
        <GridPattern />
      </div>

      {/* Decorative Blobs - Retained with conditional blur */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className={cn(
            "absolute right-[-20%] top-[-20%] w-[40%] h-[40%] rounded-full",
            isMobile ? "blur-[60px] opacity-50" : "blur-[120px]"
          )}
          style={{
            background: "color-mix(in srgb, var(--primary) 20%, transparent)",
            // Add will-change to the expensive blur operation
            willChange: "filter, transform",
          }}
        />
        <div
          className={cn(
            "absolute right-[10%] top-[-10%] w-[20%] h-[20%] rounded-full",
            isMobile ? "blur-[50px] opacity-50" : "blur-[100px]"
          )}
          style={{
            background: "color-mix(in srgb, var(--secondary) 15%, transparent)",
            willChange: "filter, transform",
          }}
        />
        <div
          className={cn(
            "absolute left-[-10%] bottom-[-20%] w-[40%] h-[40%] rounded-full",
            isMobile ? "blur-[60px] opacity-50" : "blur-[120px]"
          )}
          style={{
            background: "color-mix(in srgb, var(--primary) 12%, transparent)",
            willChange: "filter, transform",
          }}
        />
      </div>
    </div>
  );
};
