"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Dock, DockItem, DockIcon, DockLabel } from "@/components/ui/dock";
import { Plus, Inbox, Search, User as UserIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { InboxPopup } from "./InboxPopup";
import { getNotificationCount } from "../../actions/notifications";
import { ActionSearchBar } from "@/components/ui/action-search-bar";
import { AnimatePresence, motion } from "framer-motion";

const DockLogo = () => {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push("/home")}
      className="flex items-center gap-4 cursor-pointer group"
    >
      <div className="relative w-8 h-8 shrink-0">
        <Image
          src="/logo.png"
          alt="ProjectStack"
          fill
          className="object-contain"
        />
      </div>
      <span className="font-bold text-lg text-foreground hidden md:block transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.7)]">
        ProjectStack
      </span>
    </div>
  );
};

interface ProjectStackDockProps {
  onOpenCreateModal: () => void;
  profileId?: string;
  userImage?: string | null;
}

export function ProjectStackDock({
  onOpenCreateModal,
  profileId,
  userImage,
}: ProjectStackDockProps) {
  const [showInbox, setShowInbox] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!profileId) return;

    const fetchNotificationCount = async () => {
      const result = await getNotificationCount(profileId);
      if (result.success && result.data !== undefined) {
        setNotificationCount(result.data);
      }
    };

    fetchNotificationCount();

    // Poll every 5 seconds
    const interval = setInterval(fetchNotificationCount, 5000);
    return () => clearInterval(interval);
  }, [profileId]);

  const [isSearchVisible, setIsSearchVisible] = useState(false);

  const toggleSearch = () => {
    setIsSearchVisible((prev) => !prev);
  };

  return (
    <>
      <div className="fixed bottom-10 left-0 right-0 flex justify-center pointer-events-none z-20">
        <Dock
          className={cn(
            "w-full max-w-7xl justify-between px-2 sm:px-4 rounded-2xl",
            "pointer-events-auto shadow-lg",
            "bg-card/50 backdrop-blur-md border border-border"
          )}
          magnification={isMobile ? 50 : 62}
          distance={isMobile ? 80 : 111}
          panelHeight={isMobile ? 50 : 58}
        >
          <DockItem
            baseWidth={isMobile ? 50 : 180}
            magnification={isMobile ? 50 : 180}
          >
            <DockIcon>
              <DockLogo />
            </DockIcon>
            {!isMobile && <DockLabel>Home</DockLabel>}
          </DockItem>

          <div className="-grow" />

          <DockItem baseWidth={isMobile ? 45 : 64}>
            <DockIcon>
              <button className="cursor-pointer" onClick={onOpenCreateModal}>
                <Plus className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </DockIcon>
            {!isMobile && <DockLabel>Create</DockLabel>}
          </DockItem>

          <DockItem baseWidth={isMobile ? 45 : 64}>
            <DockIcon>
              <button className="cursor-pointer" onClick={toggleSearch}>
                <Search className="w-5 h-5 md:w-6 md:h-6" />
              </button>
            </DockIcon>
            {!isMobile && <DockLabel>Search</DockLabel>}
          </DockItem>

          <DockItem baseWidth={isMobile ? 45 : 64}>
            <DockIcon>
              <button
                className="cursor-pointer relative"
                onClick={() => setShowInbox(true)}
              >
                <Inbox className="w-5 h-5 md:w-6 md:h-6" />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </span>
                )}
              </button>
            </DockIcon>
            {!isMobile && <DockLabel>Inbox</DockLabel>}
          </DockItem>

          <DockItem baseWidth={isMobile ? 45 : 64}>
            <DockIcon>
              <Link
                href={profileId ? `/profile/${profileId}` : "/profile"}
                className="cursor-pointer"
              >
                <div className="relative w-8 h-8 md:w-9 md:h-9 rounded-full border-2 border-gray-400 overflow-hidden bg-black/20 flex items-center justify-center">
                  {userImage ? (
                    <Image
                      src={userImage}
                      alt="Profile"
                      width={32}
                      height={32}
                      className="rounded-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full rounded-full border-2 border-green-500 bg-muted flex items-center justify-center">
                      <UserIcon className="w-5 h-5 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </Link>
            </DockIcon>
            {!isMobile && <DockLabel>Profile</DockLabel>}
          </DockItem>
        </Dock>
      </div>

      {showInbox && profileId && (
        <InboxPopup profileId={profileId} onClose={() => setShowInbox(false)} />
      )}

      <AnimatePresence>
        {isSearchVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={toggleSearch}
          >
            <motion.div
              initial={{ scale: 0.95, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 50 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <ActionSearchBar
                autoFocus={isSearchVisible}
                onClose={toggleSearch}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
