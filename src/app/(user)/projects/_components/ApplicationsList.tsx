'use client';

import { useState } from 'react';
import { acceptApplication, rejectApplication } from '../../../../../actions/applications';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Check, X, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

interface Application {
    id: string;
    status: string;
    appliedAt: Date;
    applicant: {
        id: string;
        name: string;
        bio: string | null;
        skills: string[];
        image: string | null;
        user: {
            name: string | null;
            email: string | null;
            image: string | null;
        };
    };
}

interface ApplicationListProps {
    applications: Application[];
    authorId: string;
}

export function ApplicationsList({ applications, authorId }: ApplicationListProps) {
    const [loading, setLoading] = useState<string | null>(null);
    const router = useRouter();

    const handleAccept = async (applicationId: string) => {
        setLoading(applicationId);
        try {
            const result = await acceptApplication(applicationId, authorId);

            if (result.success) {
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

    const handleReject = async (applicationId: string) => {
        setLoading(applicationId);
        try {
            const result = await rejectApplication(applicationId, authorId);

            if (result.success) {
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

    if (!applications || applications.length === 0) {
        return (
            <div className="text-center py-12">
                <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium text-foreground mb-2">No applications yet</h3>
                <p className="text-muted-foreground">
                    Applications will appear here when users apply to your project.
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {applications.map((application, index) => (
                <motion.div
                    key={application.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Card className="border border-border/20 bg-background/20 backdrop-blur-sm">
                        <CardContent className="p-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="flex gap-4 flex-1">
                                    <Link href={`/profile/${application.applicant.id}`}>
                                        <Avatar className="w-12 h-12 border-2 border-primary/20">
                                            <AvatarImage
                                                src={application.applicant.image || application.applicant.user.image || undefined}
                                                alt={application.applicant.name}
                                            />
                                            <AvatarFallback className="bg-primary/10">
                                                {application.applicant.name.split(" ").map(n => n[0]).join("")}
                                            </AvatarFallback>
                                        </Avatar>
                                    </Link>

                                    <div className="flex-1">
                                        <Link
                                            href={`/profile/${application.applicant.id}`}
                                            className="font-semibold text-lg text-foreground hover:underline"
                                        >
                                            {application.applicant.name}
                                        </Link>
                                        <p className="text-sm text-muted-foreground mb-2">
                                            {application.applicant.user.email}
                                        </p>

                                        {application.applicant.bio && (
                                            <p className="text-sm text-muted-foreground mb-3">
                                                {application.applicant.bio}
                                            </p>
                                        )}

                                        {application.applicant.skills.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-3">
                                                {application.applicant.skills.map((skill) => (
                                                    <Badge
                                                        key={skill}
                                                        variant="secondary"
                                                        className="bg-primary/20 text-foreground border border-border/20"
                                                    >
                                                        {skill}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}

                                        <p className="text-xs text-muted-foreground">
                                            Applied on {new Date(application.appliedAt).toLocaleDateString('en-US', {
                                                month: 'long',
                                                day: 'numeric',
                                                year: 'numeric'
                                            })}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex flex-col gap-2">
                                    {application.status === 'Pending' ? (
                                        <>
                                            <Button
                                                onClick={() => handleAccept(application.id)}
                                                disabled={loading === application.id}
                                                className="bg-green-600 hover:bg-green-700 text-white"
                                            >
                                                <Check className="h-4 w-4 mr-2" />
                                                {loading === application.id ? 'Processing...' : 'Accept'}
                                            </Button>
                                            <Button
                                                onClick={() => handleReject(application.id)}
                                                disabled={loading === application.id}
                                                variant="outline"
                                                className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                                            >
                                                <X className="h-4 w-4 mr-2" />
                                                Reject
                                            </Button>
                                        </>
                                    ) : (
                                        <Badge
                                            variant={application.status === 'Accepted' ? 'default' : 'destructive'}
                                            className={
                                                application.status === 'Accepted'
                                                    ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                                                    : 'bg-red-500/20 text-red-600 dark:text-red-400'
                                            }
                                        >
                                            {application.status}
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            ))}
        </div>
    );
}