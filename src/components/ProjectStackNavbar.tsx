"use client";

import { Dock, DockItem, DockIcon, DockLabel } from "@/components/ui/dock";
import { LogOut, Home, Plus, Inbox, Search } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils"; // Import cn for managing classes
import { signOut } from "next-auth/react";

// Updated to use theme colors
const DockLogo = () => (
  <Link href="/" className="flex items-center gap-4">
    <div
      className={cn(
        "w-8 h-8 rounded-lg shrink-0 flex items-center justify-center",
        "bg-primary" // Using your theme's primary color
      )}
    >
      <span className="text-primary-foreground font-bold text-sm">PS</span>
    </div>
    {/* Updated text to use theme's foreground color */}
    <span className="font-bold text-lg text-foreground name-glow">
      ProjectStack
    </span>
  </Link>
);

export function ProjectStackDock() {
  return (
    <div className="fixed bottom-10 left-0 right-0 flex justify-center pointer-events-none z-20">
      <Dock
        className={cn(
          "w-full max-w-7xl justify-between px-4 rounded-2xl", // <-- 1. Set to max-w-6xl
          "pointer-events-auto shadow-lg",
          "bg-card/50 backdrop-blur-md border border-border" // <-- 2. Using theme variables
        )}
        magnification={62}
        distance={111}
        panelHeight={58}
      >
        {/* Left Side: The Logo */}
        <DockItem baseWidth={180} magnification={180}>
          <DockIcon>
            <DockLogo />
          </DockIcon>
        </DockItem>

        {/* The Spacer: This pushes the icons to the right */}
        <div className="-grow" />

        {/* Right Side: A group for the icons */}
        <DockItem>
          <DockIcon>
            <Plus />
          </DockIcon>
          <DockLabel>Create</DockLabel>
        </DockItem>
        <DockItem>
          <DockIcon>
            <Search />
          </DockIcon>
          <DockLabel>Search</DockLabel>
        </DockItem>
        <DockItem>
          <DockIcon>
            <Inbox />
          </DockIcon>
          <DockLabel>Inbox</DockLabel>
        </DockItem>
        <DockItem>
          <DockIcon>
            <button className="cursor-pointer" onClick={() => signOut()}>
              <LogOut />
            </button>
            
          </DockIcon>
          <DockLabel>Sign-out</DockLabel>
        </DockItem>
      </Dock>
    </div>
  );
}