"use client"

import { useState, useEffect } from "react" // <-- Added useEffect
import { MeshGradient, DotOrbit } from "@paper-design/shaders-react"

// --- 1. Custom Hook to Detect Theme ---
// This hook safely checks the user's theme preference
// and updates when it changes.
function useTheme() {
  // Initialize state with a function that runs only once on the client
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window !== "undefined") {
      return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
    }
    return "light"; // Default for server-side rendering
  });

  useEffect(() => {
    // This effect now only handles *updates* to the theme
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? "dark" : "light");
    };

    mediaQuery.addEventListener("change", handleChange);

    // Cleanup listener on unmount
    return () => {
      mediaQuery.removeEventListener("change", handleChange);
    };
  }, []); // Empty dependency array means this effect runs once on mount

  return theme;
}

// --- 2. Define Your Color Palettes ---
const themePalettes = {
  dark: {
    // Dark, warm, desaturated brown theme
    mesh: ["#111111", "#191919", "#393028", "#111111"],
    dots: ["#393028", "#191919"],
    dotBack: "#111111",
  },
  light: {
    // Light, warm, beige/tan theme
    mesh: ["#f9f9f9", "#fcfcfc", "#ffdfb5", "#f9f9f9"],
    dots: ["#ffdfb5", "#d8d8d8"],
    dotBack: "#f9f9f9",
  },
}

export default function DemoOne() {
  const [intensity] = useState(1.5)
  const [speed] = useState(1.0)
  const [activeEffect] = useState("mesh")

  // --- 3. Use the Hook and Palettes ---
  const theme = useTheme() // Returns 'light' or 'dark'
  const activePalette = themePalettes[theme] // Selects the correct palette

  return (
    // Use a key to force React to re-render the component
    // when the theme changes, ensuring the new colors are applied.
    <div key={theme} className="w-full h-screen bg-black relative overflow-hidden">
      {activeEffect === "mesh" && (
        <MeshGradient
          className="w-full h-full absolute inset-0"
          colors={activePalette.mesh} // <-- Use palette
          speed={speed}
        />
      )}

      {activeEffect === "dots" && (
        <div className="w-full h-full absolute inset-0 bg-black">
          <DotOrbit
            className="w-full h-full"
            colors={activePalette.dots} // <-- Use palette
            colorBack={activePalette.dotBack} // <-- Use palette
            speed={speed}
            size={intensity}
          />
        </div>
      )}

      {activeEffect === "combined" && (
        <>
          <MeshGradient
            className="w-full h-full absolute inset-0"
            colors={activePalette.mesh} // <-- Use palette
            speed={speed * 0.5}
          />
          <div className="w-full h-full absolute inset-0 opacity-60">
            <DotOrbit
              className="w-full h-full"
              colors={activePalette.dots} // <-- Use palette
              colorBack={activePalette.dotBack} // <-- Use palette
              speed={speed * 1.5}
              size={intensity * 0.8}
            />
          </div>
        </>
      )}

      {/* UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Header */}
        <div className="absolute top-8 left-8 pointer-events-auto"></div>

        {/* Effect Controls */}
        <div className="absolute bottom-8 left-8 pointer-events-auto"></div>

        {/* Parameter Controls */}
        <div className="absolute bottom-8 right-8 pointer-events-auto space-y-4"></div>

        {/* Status indicator */}
        <div className="absolute top-8 right-8 pointer-events-auto"></div>
      </div>

      {/* Lighting overlay effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/3 w-32 h-32 bg-gray-800/5 rounded-full blur-3xl animate-pulse animate-duration-3s" />
        <div className="absolute bottom-1/3 right-1/4 w-24 h-24 bg-white/2 rounded-full blur-2xl animate-pulse animate-duration-2s delay-1000" />
        <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-gray-900/3 rounded-full blur-xl animate-pulse animate-duration-4s delay-500" />
      </div>

      {/* <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        ... (Your commented out UI) ...
      </div> */}
    </div>
  )
}