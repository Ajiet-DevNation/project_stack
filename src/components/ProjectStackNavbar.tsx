"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Dock, DockItem, DockIcon, DockLabel } from "@/components/ui/dock";
import { Plus, Inbox, Search, User as UserIcon } from "lucide-react"; 
import Link from "next/link";
import { cn } from "@/lib/utils";
import { InboxPopup } from "./InboxPopup";
import { getNotificationCount } from "../../actions/notifications";
import { ActionSearchBar } from "@/components/ui/action-search-bar";
import { AnimatePresence, motion } from "framer-motion";


const DockLogo = () => (
  <Link href="/home" className="flex items-center gap-4">
    <div
      className={cn(
        "w-8 h-8 rounded-lg shrink-0 flex items-center justify-center",
        "bg-primary"
      )}
    >
      <span className="text-primary-foreground font-bold text-sm">PS</span>
    </div>
    <span className="font-bold text-lg text-foreground ">
      ProjectStack
    </span>
  </Link>
);

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
            "w-full max-w-7xl justify-between px-4 rounded-2xl",
            "pointer-events-auto shadow-lg",
            "bg-card/50 backdrop-blur-md border border-border"
          )}
          magnification={62}
          distance={111}
          panelHeight={58}
        >
          <DockItem baseWidth={180} magnification={180}>
            <DockIcon>
              <DockLogo />
            </DockIcon>
          </DockItem>

          <div className="-grow" />

          <DockItem>
            <DockIcon>
              <button className="cursor-pointer" onClick={onOpenCreateModal}>
                <Plus />
              </button>
            </DockIcon>
            <DockLabel>Create</DockLabel>
          </DockItem>

          <DockItem>
            <DockIcon>
              <button className="cursor-pointer" onClick={toggleSearch}>
                <Search />
              </button>
            </DockIcon>
            <DockLabel>Search</DockLabel>
          </DockItem>

          <DockItem>
            <DockIcon>
              <button
                className="cursor-pointer relative"
                onClick={() => setShowInbox(true)}
              >
                <Inbox />
                {notificationCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {notificationCount > 9 ? "9+" : notificationCount}
                  </span>
                )}
              </button>
            </DockIcon>
            <DockLabel>Inbox</DockLabel>
          </DockItem>

          <DockItem>
            <DockIcon>
              <Link
                href={profileId ? `/profile/${profileId}` : "/profile"}
                className="cursor-pointer"
              >
                <div className="relative w-8 h-8 rounded-full border-2 border-gray-400 overflow-hidden bg-black/20 flex items-center justify-center">
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
            <DockLabel>Profile</DockLabel>
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
              <ActionSearchBar autoFocus={isSearchVisible} onClose={toggleSearch} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}