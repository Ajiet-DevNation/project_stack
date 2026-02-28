"use client";
import { usePathname } from "next/navigation";
import { ProjectStackDock } from "@/components/ProjectStackNavbar";
import { CreateProjectModal } from "@/components/CreateProjectModal";
import { LoginModal } from "@/components/LoginModal";
import { FloatingContactButton } from "@/components/FloatingContactButton";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Toaster } from "sonner";
import { Shader } from "./Shader";

type ClientLayoutShellProps = {
  children: React.ReactNode;
};

export function ClientLayoutShell({ children }: ClientLayoutShellProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const isEntryPage = pathname === "/" || pathname === "/onboarding";

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [profileId, setProfileId] = useState<string | undefined>();

  useEffect(() => {
    const fetchProfileId = async () => {
      if (session?.user?.email) {
        try {
          const response = await fetch("/api/profile");
          if (response.ok) {
            const data = await response.json();
            setProfileId(data.profileId);
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
        }
      } else {
        setProfileId(undefined);
      }
    };

    fetchProfileId();
  }, [session]);

  const handleCreateClick = () => {
    if (session) {
      if (!profileId) {
        window.location.href = "/onboarding";
        return;
      }
      setIsCreateModalOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <>
      {!isEntryPage && (
        <div className="fixed -z-10 h-full w-screen">
          <Shader />
        </div>
      )}
      <Toaster theme="system" richColors />
      {children}
      {!isEntryPage && (
        <ProjectStackDock
          onOpenCreateModal={handleCreateClick}
          profileId={profileId}
          userImage={session?.user?.image}
        />
      )}
      <FloatingContactButton />
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