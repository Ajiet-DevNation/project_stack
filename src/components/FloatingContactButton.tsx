"use client";

import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export function FloatingContactButton() {
  return (
    <a
      href="/contact"
      className={cn(
        "fixed right-4 z-40",
        "md:bottom-8 md:right-8",
        "bottom-28 sm:bottom-24",
        "md:w-12 md:h-12 w-10 h-10 bg-primary hover:bg-primary/90",
        "rounded-full shadow-lg hover:shadow-xl",
        "flex items-center justify-center",
        "transition-all duration-300 ease-out",
        "hover:scale-110 active:scale-95",
        "group"
      )}
    >
      <Phone 
        className={cn(
          "md:w-4 md:h-4 w-3 h-3 text-primary-foreground",
          "transition-transform duration-300",
          "group-hover:rotate-12"
        )} 
      />
      <span className="sr-only">Contact</span>
    </a>
  );
}
