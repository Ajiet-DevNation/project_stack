"use client";

import { usePathname } from "next/navigation";
import { ProjectStackDock } from "@/components/ProjectStackNavbar";
import { CreateProjectModal } from "@/components/CreateProjectModal";
import { LoginModal } from "@/components/LoginModal";
import { useState } from "react";
import { useSession } from "next-auth/react"; 
import { Toaster } from "sonner";

type ClientLayoutShellProps = {
  children: React.ReactNode;
};

export function ClientLayoutShell({ children }: ClientLayoutShellProps) {
  const pathname = usePathname();
  const { data: session } = useSession(); 
  const isEntryPage = pathname === "/" || pathname === "/onboarding";
  
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false); 


  const handleCreateClick = () => {
    if (session) {
      setIsCreateModalOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <>
      <Toaster theme="system" richColors /> 
      {children}
      
      {!isEntryPage && (
        <ProjectStackDock onOpenCreateModal={handleCreateClick} /> 
      )}
      
      <CreateProjectModal 
        open={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
      />
      
      <LoginModal 
        open={isLoginModalOpen} 
        onClose={() => setIsLoginModalOpen(false)} 
      />
    </>
  );
}