"use client";

import { Phone } from "lucide-react";
import { cn } from "@/lib/utils";

export function FloatingContactButton() {
  return (
    <a
      href="/contact"
      className={cn(
        "fixed bottom-8 right-8 z-50",
        "w-12 h-12 bg-primary hover:bg-primary/90",
        "rounded-full shadow-lg hover:shadow-xl",
        "flex items-center justify-center",
        "transition-all duration-300 ease-out",
        "hover:scale-110 active:scale-95",
        "group"
      )}
    >
      <Phone 
        className={cn(
          "w-4 h-4 text-primary-foreground",
          "transition-transform duration-300",
          "group-hover:rotate-12"
        )} 
      />
      <span className="sr-only">Contact</span>
    </a>
  );
}
