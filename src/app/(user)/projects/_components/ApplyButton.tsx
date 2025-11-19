'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { UserPlus, Check, Clock } from 'lucide-react';
import { applyToProject } from '../../../../../actions/applications';
import { useSession } from 'next-auth/react';
import { LoginModal } from '@/components/LoginModal';

interface ApplyButtonProps {
    projectId: string;
    profileId?: string;
    hasApplied?: boolean;
    applicationStatus?: string;
    isContributor?: boolean;
}

export function ApplyButton({
    projectId,
    profileId,
    hasApplied,
    applicationStatus,
    isContributor
}: ApplyButtonProps) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const { data: session } = useSession();
    const [loginOpen, setLoginOpen] = useState(false);

    const handleApply = async () => {
        if (!profileId) {
            window.location.href = "/onboarding";
            return;
        }

        setLoading(true);
        try {
            const result = await applyToProject(profileId, projectId);

            if (result.success) {
                router.refresh();
            } else {
                alert(result.message);
            }
        } catch {
            alert('An error occurred while applying');
        } finally {
            setLoading(false);
        }
    };

    if (!session) {
        return (
            <>
                <Button
                    onClick={() => setLoginOpen(true)}
                    className="inline-flex items-center gap-2 bg-primary hover:opacity-90 w-full transition-all shadow-md"
                >
                    <UserPlus className="h-4 w-4" />
                    Login to Apply
                </Button>
                <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
            </>
        );
    }

    if (isContributor) {
        return (
            <Button
                disabled
                className="inline-flex w-full items-center gap-2  bg-green-500/20 text-green-600 dark:text-green-400 hover:bg-green-500/30 cursor-not-allowed"
            >
                <Check className="h-4 w-4" />
                Already Contributing
            </Button>
        );
    }

    if (hasApplied) {
        return (
            <Button
                disabled
                className="inline-flex items-center gap-2 bg-yellow-500/20 w-full text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/30 cursor-not-allowed"
            >
                <Clock className="h-4 w-4" />
                Application {applicationStatus}
            </Button>
        );
    }

    return (
        <Button
            onClick={handleApply}
            disabled={loading}
            className="inline-flex items-center gap-2 bg-primary hover:opacity-90 w-full transition-all shadow-md"
        >
            <UserPlus className="h-4 w-4" />
            {loading ? 'Applying...' : 'Apply to Project'}
        </Button>
    );
}