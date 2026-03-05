"use client";

import Link from "next/link";
import Image from "next/image";
import { ContributorActions } from "./ContributorActions";

interface Contributor {
    id: string;
    contributorRecordId: string;
    name: string;
    avatar?: string;
}

interface ContributorsSectionProps {
    contributors: Contributor[];
    projectId: string;
    currentUserProfileId?: string;
    authorProfileId: string;
}

export function ContributorsSection({
    contributors,
    projectId,
    currentUserProfileId,
    authorProfileId,
}: ContributorsSectionProps) {
    return (
        <section className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-8 shadow-xl fade-in-up delay-200">
            <h2 className="text-xl font-semibold text-foreground mb-6 pb-3 border-b border-border/50">
                Contributors ({contributors.length})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contributors.map((contributor) => (
                    <div
                        key={contributor.id}
                        className="flex items-center gap-4 p-4 rounded-xl transition-all hover:bg-white/5 hover:shadow-md backdrop-blur-sm"
                    >
                        <Link
                            href={`/profile/${contributor.id}`}
                            className="flex items-center gap-4 flex-1 min-w-0"
                        >
                            {contributor.avatar ? (
                                <Image
                                    src={contributor.avatar}
                                    alt={contributor.name}
                                    width={48}
                                    height={48}
                                    className="h-12 w-12 rounded-full bg-muted border-2 border-border shadow-sm"
                                />
                            ) : (
                                <div className="h-12 w-12 rounded-full bg-muted border-2 border-border flex items-center justify-center text-muted-foreground font-semibold shadow-sm">
                                    {contributor.name.charAt(0)}
                                </div>
                            )}
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-foreground truncate">
                                    {contributor.name}
                                </p>
                                <p className="text-xs text-muted-foreground">Contributor</p>
                            </div>
                        </Link>
                        <ContributorActions
                            contributorId={contributor.contributorRecordId}
                            contributorProfileId={contributor.id}
                            contributorName={contributor.name}
                            projectId={projectId}
                            currentUserProfileId={currentUserProfileId}
                            authorProfileId={authorProfileId}
                        />
                    </div>
                ))}
            </div>
        </section>
    );
}
