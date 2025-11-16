"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DeleteProjectButtonProps {
    projectId: string;
    projectTitle?: string;
    authorId?: string;
}

export function DeleteProjectButton({
    projectId,
    projectTitle,
}: DeleteProjectButtonProps) {
    const [showConfirm, setShowConfirm] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const handleDelete = async () => {
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
            setShowConfirm(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setShowConfirm(true)}
                className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-destructive/50 bg-destructive/10 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/20 transition-all shadow-sm"
            >
                <Trash2 className="h-4 w-4" />
                Delete Project
            </button>

            {showConfirm && (
                <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                    <div
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
                        onClick={() => !isDeleting && setShowConfirm(false)}
                    />

                    <div className="relative w-full max-w-md bg-card border border-border rounded-xl shadow-2xl p-6">
                        <h3 className="text-xl font-semibold text-foreground mb-2">
                            Delete Project?
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                            Are you sure you want to delete{" "}
                            <span className="font-semibold text-foreground">
                                "{projectTitle}"
                            </span>
                            ? This action cannot be undone.
                        </p>
                        <p className="text-sm text-muted-foreground mb-6">
                            All applicants and contributors will be notified.
                        </p>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={() => setShowConfirm(false)}
                                disabled={isDeleting}
                                className="px-4 py-2 text-sm font-medium text-foreground bg-secondary hover:bg-secondary/80 rounded-lg transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                disabled={isDeleting}
                                className="px-4 py-2 text-sm font-medium text-destructive-foreground bg-destructive hover:bg-destructive/90 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2"
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
                    </div>
                </div>
            )}
        </>
    );
}
