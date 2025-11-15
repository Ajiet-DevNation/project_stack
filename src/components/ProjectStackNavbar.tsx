"use client";

import { useState, useEffect } from "react";
import { Dock, DockItem, DockIcon, DockLabel } from "@/components/ui/dock";
import { LogOut, Home, Plus, Inbox, Search } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { InboxPopup } from "./InboxPopup";
import { getNotificationCount } from "../../actions/notifications";
import { ActionSearchBar } from "@/components/ui/action-search-bar";
import { AnimatePresence, motion } from "framer-motion";

const DockLogo = () => (
  <Link href="/" className="flex items-center gap-4">
    <div
      className={cn(
        "w-8 h-8 rounded-lg shrink-0 flex items-center justify-center",
        "bg-primary"
      )}
    >
      <span className="text-primary-foreground font-bold text-sm">PS</span>
    </div>
    <span className="font-bold text-lg text-foreground name-glow">
      ProjectStack
    </span>
  </Link>
);

interface ProjectStackDockProps {
  onOpenCreateModal: () => void;
  profileId?: string;
}

export function ProjectStackDock({
  onOpenCreateModal,
  profileId,
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
              <Link href={"/home"} className="cursor-pointer">
                <Home />
              </Link>
            </DockIcon>
            <DockLabel>Home</DockLabel>
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
              <button className="cursor-pointer" onClick={() => signOut()}>
                <LogOut />
              </button>
            </DockIcon>
            <DockLabel>Sign-out</DockLabel>
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
              className="w-full max-w-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <ActionSearchBar autoFocus={isSearchVisible} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
