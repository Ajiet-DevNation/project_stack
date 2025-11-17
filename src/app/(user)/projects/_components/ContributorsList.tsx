'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { removeContributor } from '../../../../../actions/applications';
import Image from 'next/image';

interface Contributor {
    id: string;
    user: {
        id: string;
        name: string;
        bio: string | null;
        user: {
            image: string | null;
            name: string | null;
        };
    };
}

interface ContributorsListProps {
    contributors: Contributor[];
    authorId: string;
    isAuthor: boolean;
}

export function ContributorsList({
    contributors,
    authorId,
    isAuthor
}: ContributorsListProps) {
    const [loading, setLoading] = useState<string | null>(null);
    const router = useRouter();

    const handleRemove = async (contributorId: string) => {
        if (!confirm('Are you sure you want to remove this contributor?')) {
            return;
        }

        setLoading(contributorId);
        try {
            const result = await removeContributor(contributorId, authorId);

            if (result.success) {
                alert(result.message);
                router.refresh();
            } else {
                alert(result.message);
            }
        } catch {
            alert('An error occurred');
        } finally {
            setLoading(null);
        }
    };

    if (contributors.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                No contributors yet
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {contributors.map((contributor) => (
                <div
                    key={contributor.id}
                    className="border rounded-lg p-4 bg-white shadow-sm"
                >
                    <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                            {contributor.user.user.image && (
                                <Image
                                    src={contributor.user.user.image}
                                    alt={contributor.user.name}
                                    className="w-12 h-12 rounded-full"
                                />
                            )}
                            <div>
                                <h3 className="font-semibold">
                                    {contributor.user.name}
                                </h3>
                                {contributor.user.bio && (
                                    <p className="text-sm text-gray-600 mt-1">
                                        {contributor.user.bio}
                                    </p>
                                )}
                            </div>
                        </div>
                        {isAuthor && (
                            <button
                                onClick={() => handleRemove(contributor.id)}
                                disabled={loading === contributor.id}
                                className="text-red-600 hover:text-red-700 text-sm disabled:opacity-50"
                            >
                                {loading === contributor.id ? '...' : 'Remove'}
                            </button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    );
}