"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface DeleteProjectButtonProps {
    projectId: string;
    projectTitle: string;
}

export function DeleteProjectButton({
    projectId,
    projectTitle,
}: DeleteProjectButtonProps) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [confirmText, setConfirmText] = useState("");
    const [isDeleting, setIsDeleting] = useState(false);
    const [mounted, setMounted] = useState(false);
    const router = useRouter();

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const handleDelete = async () => {
        if (confirmText !== projectTitle) {
            toast.error("Project name doesn't match!");
            return;
        }

        setIsDeleting(true);
        try {
            const res = await fetch(`/api/projects/${projectId}`, {
                method: "DELETE",
            });

            if (res.ok) {
                toast.success("Project deleted successfully!");
                router.push("/home");
                router.refresh();
            } else if (res.status === 403) {
                toast.error("You are not authorized to delete this project.");
            } else {
                const errorText = await res.text();
                toast.error(errorText || "Failed to delete project.");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong while deleting.");
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setShowConfirm(true)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-4xl text-left
                hover:bg-accent transition-all group md:bg-accent/40 bg-accent/40 cursor-pointer"
            >
                <div className="h-8 w-8 rounded-lg flex items-center justify-center transition-colors">
                    <Trash2 className="h-4 w-4 text-red-600 dark:text-red-400" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                        Delete Project
                    </p>
                </div>
            </button>

            {mounted && createPortal(
                <AnimatePresence>
                    {showConfirm && (
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4">
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black/70 backdrop-blur-sm"
                                onClick={() => !isDeleting && setShowConfirm(false)}
                            />

                            {/* Modal */}
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                                animate={{ scale: 1, opacity: 1, y: 0 }}
                                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                                transition={{ duration: 0.2 }}
                                className="relative w-full max-w-md bg-card border border-destructive/10 rounded-2xl shadow-2xl overflow-hidden z-[10000]"
                            >
                                {isDeleting ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                                        <span>{`Deleting\u2026`}</span>
                                    </>
                                ) : (
                                    <>
                                        <Trash2 className="h-4 w-4" />
                                        <span>Delete</span>
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}