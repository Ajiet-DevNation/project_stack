"use client";

import { useState } from "react";
import { Edit3 } from "lucide-react";
import { EditProjectModal } from "./EditProjectModal";

interface EditProjectButtonProps {
    project: {
        id: string;
        title: string;
        description: string;
        tags: string[];
        liveUrl?: string;
        githubUrl?: string;
        status: "Planning" | "Active" | "Completed";
        startDate: string;
        endDate?: string;
        isActive: boolean;
    };
}

export function EditProjectButton({ project }: EditProjectButtonProps) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <>
            <button
                onClick={() => setIsModalOpen(true)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-4xl text-left
                hover:bg-accent transition-all group bg-accent/40 cursor-pointer"
            >
                <div className="h-8 w-8 rounded-lg flex items-center justify-center transition-colors">
                    <Edit3 className="h-4 w-4 dark:text-blue-400" />
                </div>
                <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">
                        Edit Project
                    </p>
                </div>
            </button>

            <EditProjectModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                project={{
                    id: project.id,
                    title: project.title,
                    description: project.description,
                    requiredSkills: project.tags,
                    liveUrl: project.liveUrl,
                    githubUrl: project.githubUrl,
                    projectStatus: project.status,
                    startDate: project.startDate,
                    endDate: project.endDate,
                    isActive: project.isActive,
                }}
            />
        </>
    );
}