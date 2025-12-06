"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { X, Trash2, ChevronUp } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getAllNotifications, deleteNotification } from "../../actions/notifications";
import Link from "next/link";

interface Notification {
    id: string;
    message: string;
    type: string;
    projectId: string | null;
    createdAt: Date;
}

interface InboxPopupProps {
    profileId: string;
    onClose: () => void;
}

export function InboxPopup({ profileId, onClose }: InboxPopupProps) {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const popupRef = useRef<HTMLDivElement>(null);

    const handleClose = useCallback(() => {
        setIsVisible(false);
        setTimeout(onClose, 300);
    }, [onClose]);

    useEffect(() => {
        const fetchNotifications = async () => {
            const result = await getAllNotifications(profileId);
            if (result.success && result.data) {
                setNotifications(
                    result.data.map((n) => ({
                        ...n,
                        createdAt: new Date(n.createdAt),
                    }))
                );
            }
            setLoading(false);
        };
        
        fetchNotifications();
        setTimeout(() => setIsVisible(true), 10);

        const interval = setInterval(fetchNotifications, 5000);
        return () => clearInterval(interval);
    }, [profileId]);

    useEffect(() => {
        if (isExpanded) return;

        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                handleClose();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isExpanded, handleClose]);

    const handleDelete = async (notificationId: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        const result = await deleteNotification(notificationId);
        if (result.success) {
            setNotifications((prev) =>
                prev.filter((n) => n.id !== notificationId)
            );
        }
    };

    const handleExpand = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded(true);
    };

    const handleCollapse = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsExpanded(false);
    };

    const latestNotification = notifications[0];
    const hasMultipleNotifications = notifications.length > 1;

    return (
        <>
            {!isExpanded ? (
                <div className="fixed bottom-28 left-1/2 -translate-x-1/2 z-[60]">
                    <div
                        ref={popupRef}
                        className={`transition-all duration-500 ${
                            isVisible
                                ? "opacity-100 translate-y-0 scale-100"
                                : "opacity-0 translate-y-4 scale-95"
                        }`}
                    >
                        {loading ? (
                            <div className="w-80 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 flex items-center justify-center">
                                <div className="animate-spin rounded-full h-6 w-6 border-2 border-white/20 border-t-cyan-400" />
                            </div>
                        ) : notifications.length === 0 ? (
                            <div className="w-80 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 text-center">
                                <p className="text-white/60 text-sm font-light">
                                    No notifications
                                </p>
                            </div>
                        ) : (
                            <div className="relative w-80">
                                {hasMultipleNotifications && (
                                    <>
                                        <div className="absolute top-1.5 left-1.5 right-1.5 h-full bg-black/30 backdrop-blur-xl border border-white/10 rounded-2xl -z-10 pointer-events-none" />
                                        <div className="absolute top-3 left-3 right-3 h-full bg-black/20 backdrop-blur-lg border border-white/10 rounded-2xl -z-20 pointer-events-none" />
                                    </>
                                )}

                                <div className="relative bg-black/5 backdrop-blur-2xl border border-white/10 rounded-2xl overflow-hidden group hover:border-black/10 transition-all duration-300">
                                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/0 via-transparent to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                                    <div className="relative p-4">
                                        <div className="flex items-start gap-3">
                                            <div className="flex-1 min-w-0">
                                                {latestNotification.projectId ? (
                                                    <Link
                                                        href={`/projects/${latestNotification.projectId}`}
                                                        onClick={handleClose}
                                                        className="block"
                                                    >
                                                        <p className="text-sm text-white/90 leading-relaxed mb-1.5">
                                                            {latestNotification.message}
                                                        </p>
                                                        <p className="text-xs text-white/40 font-light">
                                                            {formatDistanceToNow(latestNotification.createdAt, {
                                                                addSuffix: true,
                                                            })}
                                                        </p>
                                                    </Link>
                                                ) : (
                                                    <div>
                                                        <p className="text-sm text-white/90 leading-relaxed mb-1.5">
                                                            {latestNotification.message}
                                                        </p>
                                                        <p className="text-xs text-white/40 font-light">
                                                            {formatDistanceToNow(latestNotification.createdAt, {
                                                                addSuffix: true,
                                                            })}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>

                                            <button
                                                onClick={(e) => handleDelete(latestNotification.id, e)}
                                                className="p-2 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95 shrink-0"
                                                title="Delete notification"
                                            >
                                                <Trash2 className="h-3.5 w-3.5 text-white/60 hover:text-red-400 transition-colors" />
                                            </button>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleExpand}
                                        className="w-full py-3 border-t border-white/10 bg-white/5 hover:bg-white/10 transition-all duration-200 flex items-center justify-center group/expand"
                                    >
                                        <ChevronUp className="h-4 w-4 text-white/60 group-hover/expand:text-cyan-400 transition-all duration-200 group-hover/expand:translate-y-[-2px]" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            ) : (
                <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
                    <div
                        className="fixed inset-0 bg-black/10 backdrop-blur-xl transition-opacity duration-300"
                        onClick={handleCollapse}
                    />

                    <div
                        className={`relative w-full max-w-md transition-all duration-500 ${
                            isExpanded
                                ? "opacity-100 translate-y-0 scale-100"
                                : "opacity-0 translate-y-8 scale-95"
                        }`}
                    >
                        <div className=" overflow-hidden">
                            <div className=" relative flex items-center justify-between p-4">
                                <h2 className="text-2xl font-light text-white tracking-wide">
                                    Notifications
                                </h2>
                                <button
                                    onClick={handleClose}
                                    className="p-2 hover:bg-white/10 rounded-full transition-all duration-200 hover:rotate-90 group"
                                >
                                    <X className="h-5 w-5 text-white/70 group-hover:text-white transition-colors" />
                                </button>
                            </div>

                            <div className="relative px-6 pb-6 pt-4 space-y-3 max-h-[70vh] overflow-y-auto custom-scrollbar">
                                {notifications.map((notification, index) => (
                                    <div
                                        key={notification.id}
                                        className="group relative animate-slide-in"
                                        style={{
                                            animationDelay: `${index * 50}ms`,
                                        }}
                                    >
                                        <div className="relative bg-black/5 backdrop-blur-md border border-white/10 rounded-2xl p-4 hover:bg-black/20 hover:border-black/10 transition-all duration-300 hover:scale-[1.02]">
                                            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-cyan-400/0 via-transparent to-blue-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                                            <div className="relative flex items-start gap-4">
                                                <div className="flex-1 min-w-0">
                                                    {notification.projectId ? (
                                                        <Link
                                                            href={`/projects/${notification.projectId}`}
                                                            onClick={handleClose}
                                                            className="block"
                                                        >
                                                            <p className="text-sm text-white/90 leading-relaxed mb-2 group-hover:text-white transition-colors">
                                                                {notification.message}
                                                            </p>
                                                            <p className="text-xs text-white/40 font-light">
                                                                {formatDistanceToNow(notification.createdAt, {
                                                                    addSuffix: true,
                                                                })}
                                                            </p>
                                                        </Link>
                                                    ) : (
                                                        <div>
                                                            <p className="text-sm text-white/90 leading-relaxed mb-2">
                                                                {notification.message}
                                                            </p>
                                                            <p className="text-xs text-white/40 font-light">
                                                                {formatDistanceToNow(notification.createdAt, {
                                                                    addSuffix: true,
                                                                })}
                                                            </p>
                                                            {notification.type === "PROJECT_DELETED" && (
                                                                <p className="text-xs text-red-400/80 mt-2 font-light">
                                                                    Project no longer available
                                                                </p>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>

                                                <button
                                                    onClick={(e) => handleDelete(notification.id, e)}
                                                    className="p-2.5 bg-white/5 hover:bg-red-500/20 border border-white/10 hover:border-red-500/30 rounded-xl transition-all duration-200 hover:scale-110 active:scale-95 shrink-0"
                                                    title="Delete notification"
                                                >
                                                    <Trash2 className="h-4 w-4 text-white/60 hover:text-red-400 transition-colors" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <button
                                onClick={handleCollapse}
                                className="w-full py-4 transition-all duration-200 flex items-center justify-center gap-2 group/collapse"
                            >
                                <ChevronUp className="h-4 w-4 text-white/60 group-hover/collapse:text-cyan-400 transition-all duration-200 rotate-180 group-hover/collapse:translate-y-[2px]" />
                                <span className="text-xs text-white/60 group-hover/collapse:text-white transition-colors font-light">
                                    Show less
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                @keyframes slide-in {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .animate-slide-in {
                    animation: slide-in 0.4s ease-out forwards;
                    opacity: 0;
                }

                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }

                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 3px;
                }

                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: rgba(255, 255, 255, 0.2);
                }
            `}</style>
        </>
    );
}
