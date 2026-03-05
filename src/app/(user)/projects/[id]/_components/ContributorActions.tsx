"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { UserMinus, LogOut, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { deleteContributor, leaveProject } from "../../../../../../actions/contributors";

interface ContributorActionsProps {
    contributorId: string; 
    contributorProfileId: string; 
    contributorName: string;
    projectId: string;
    currentUserProfileId?: string;
    authorProfileId: string;
}

export function ContributorActions({
    contributorId,
    contributorProfileId,
    contributorName,
    projectId,
    currentUserProfileId,
    authorProfileId,
}: ContributorActionsProps) {
    const [loading, setLoading] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const router = useRouter();

    const isAuthor = currentUserProfileId === authorProfileId;
    const isCurrentUserContributor = currentUserProfileId === contributorProfileId;

    if (!isAuthor && !isCurrentUserContributor) {
        return null;
    }

    const handleRemoveContributor = async () => {
        if (!currentUserProfileId) return;

        setLoading(true);
        try {
            const result = await deleteContributor(contributorId, currentUserProfileId, projectId);

            if (result.success) {
                toast.success("Contributor removed successfully");
                router.refresh();
            } else {
                toast.error(result.message || "Failed to remove contributor");
            }
        } catch {
            toast.error("An error occurred while removing the contributor");
        } finally {
            setLoading(false);
            setShowConfirm(false);
        }
    };

    const handleLeaveProject = async () => {
        if (!currentUserProfileId) return;

        setLoading(true);
        try {
            const result = await leaveProject(contributorId, currentUserProfileId, projectId);

            if (result.success) {
                toast.success("Successfully left the project");
                router.refresh();
            } else {
                toast.error(result.message || "Failed to leave project");
            }
        } catch {
            toast.error("An error occurred while leaving the project");
        } finally {
            setLoading(false);
            setShowConfirm(false);
        }
    };

    if (showConfirm) {
        return (
            <div className="flex items-center gap-2 ml-auto">
                <span className="text-xs text-muted-foreground">
                    {isAuthor ? "Remove?" : "Leave?"}
                </span>
                <button
                    onClick={isAuthor ? handleRemoveContributor : handleLeaveProject}
                    disabled={loading}
                    className="px-2 py-1 text-xs font-medium rounded-md bg-red-500/10 text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors disabled:opacity-50"
                >
                    {loading ? (
                        <Loader2 className="h-3 w-3 animate-spin" />
                    ) : (
                        "Yes"
                    )}
                </button>
                <button
                    onClick={() => setShowConfirm(false)}
                    disabled={loading}
                    className="px-2 py-1 text-xs font-medium rounded-md bg-muted text-muted-foreground hover:bg-muted/80 transition-colors disabled:opacity-50"
                >
                    No
                </button>
            </div>
        );
    }

    if (isAuthor) {
        return (
            <button
                onClick={() => setShowConfirm(true)}
                className="ml-auto p-2 rounded-lg text-muted-foreground hover:text-red-500 hover:bg-red-500/10 transition-all group"
                title={`Remove ${contributorName} from project`}
            >
                <UserMinus className="h-4 w-4" />
            </button>
        );
    }

    if (isCurrentUserContributor) {
        return (
            <button
                onClick={() => setShowConfirm(true)}
                className="ml-auto p-2 rounded-lg text-muted-foreground hover:text-orange-500 hover:bg-orange-500/10 transition-all group"
                title="Leave this project"
            >
                <LogOut className="h-4 w-4" />
            </button>
        );
    }

    return null;
}
