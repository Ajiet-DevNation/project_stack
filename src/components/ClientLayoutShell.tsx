"use client";

import { usePathname } from "next/navigation";
import { ProjectStackDock } from "@/components/ProjectStackNavbar";

type ClientLayoutShellProps = {
  children: React.ReactNode;
};

export function ClientLayoutShell({ children }: ClientLayoutShellProps) {
  const pathname = usePathname();
  const isEntryPage = pathname === "/" || pathname === "/onboarding";

  return (
    <>
      {children}
      {!isEntryPage && <ProjectStackDock />}
    </>
  );
}
