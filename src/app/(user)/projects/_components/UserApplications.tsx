'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Check, X } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface UserApplication {
    id: string;
    status: string;
    appliedAt: Date;
    project: {
        id: string;
        title: string;
        description: string;
        thumbnail: string | null;
        author: {
            name: string;
            image: string | null;
        };
    };
}

interface UserApplicationsProps {
    applications: UserApplication[];
}

export function UserApplications({ applications }: UserApplicationsProps) {
    if (!applications || applications.length === 0) {
        return (
            <div className="text-center py-12">
                <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium text-foreground mb-2">No applications yet</h3>
                <p className="text-muted-foreground">
                    You haven&apos;t applied to any projects yet
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {applications.map((application, index) => (
                <motion.div
                    key={application.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                >
                    <Link href={`/projects/${application.project.id}`}>
                        <Card className="border border-border/20 bg-background/20 backdrop-blur-sm hover:shadow-lg transition-all overflow-hidden group">
                            {application.project.thumbnail && (
                                <div className="relative h-48 overflow-hidden">
                                    <Image
                                        src={application.project.thumbnail}
                                        alt={application.project.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            )}
                            <CardContent className="p-6">
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors">
                                        {application.project.title}
                                    </h3>
                                    <Badge
                                        className={
                                            application.status === 'Pending'
                                                ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                                                : application.status === 'Accepted'
                                                    ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                                                    : 'bg-red-500/20 text-red-600 dark:text-red-400'
                                        }
                                    >
                                        {application.status === 'Pending' && <Clock className="w-3 h-3 mr-1" />}
                                        {application.status === 'Accepted' && <Check className="w-3 h-3 mr-1" />}
                                        {application.status === 'Rejected' && <X className="w-3 h-3 mr-1" />}
                                        {application.status}
                                    </Badge>
                                </div>

                                <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                                    {application.project.description}
                                </p>

                                <div className="flex items-center justify-between text-xs text-muted-foreground">
                                    <span>By {application.project.author.name}</span>
                                    <span>
                                        Applied {new Date(application.appliedAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                </motion.div>
            ))}
        </div>
    );
}