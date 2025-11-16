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
                                {/* Warning Header */}
                                <div className="bg-destructive/5 border-b border-destructive/10 px-6 py-4 flex items-center gap-3">
                                    <div className="p-2 bg-destructive/10 rounded-lg">
                                        <AlertTriangle className="h-6 w-6 text-destructive" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-destructive">
                                            Delete Project
                                        </h3>
                                        <p className="text-xs text-muted-foreground">
                                            This action cannot be undone
                                        </p>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6 space-y-4">
                                    <div className="bg-destructive/5 rounded-lg p-4">
                                        <p className="text-sm text-foreground mb-2">
                                            This will permanently delete:
                                        </p>
                                        <ul className="text-sm text-muted-foreground space-y-1 ml-4 list-disc">
                                            <li>Project and all its data</li>
                                            <li>All applications and contributions</li>
                                            <li>All comments and likes</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <p className="text-sm text-foreground mb-2">
                                            All applicants and contributors will be notified of this deletion.
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block text-sm font-semibold text-foreground">
                                            Type <span className="font-mono text-destructive">{projectTitle}</span> to confirm:
                                        </label>
                                        <input
                                            type="text"
                                            value={confirmText}
                                            onChange={(e) => setConfirmText(e.target.value)}
                                            placeholder="Enter project name"
                                            disabled={isDeleting}
                                            className="w-full px-4 py-2.5 bg-background border border-border focus:ring-none focus:outline-none focus:border-red-400 rounded-lg text-foreground placeholder:text-muted-foreground disabled:opacity-50 transition-colors"
                                            autoFocus
                                        />
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="bg-muted/30 px-6 py-4 flex gap-3 justify-end border-t border-border">
                                    <button
                                        onClick={() => {
                                            setShowConfirm(false);
                                            setConfirmText("");
                                        }}
                                        disabled={isDeleting}
                                        className="px-4 py-2 text-sm font-medium text-foreground bg-secondary hover:bg-secondary/80 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleDelete}
                                        disabled={isDeleting || confirmText !== projectTitle}
                                        className="px-4 py-2 text-sm font-semibold text-destructive-foreground bg-destructive hover:bg-destructive/90 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                    >
                                        {isDeleting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Deleting...
                                            </>
                                        ) : (
                                            <>
                                                <Trash2 className="h-4 w-4" />
                                                Delete Project
                                            </>
                                        )}
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}