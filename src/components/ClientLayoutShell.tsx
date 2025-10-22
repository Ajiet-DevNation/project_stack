"use client";

import { usePathname } from "next/navigation";
import { ProjectStackDock } from "@/components/ProjectStackNavbar";

type ClientLayoutShellProps = {
  children: React.ReactNode;
};

export function ClientLayoutShell({ children }: ClientLayoutShellProps) {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";

  return (
    <>
      {children}
      {!isLandingPage && <ProjectStackDock />}
    </>
  );
}
