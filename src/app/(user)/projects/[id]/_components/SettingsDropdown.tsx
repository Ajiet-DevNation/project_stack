"use client";

import { useState, useRef, useEffect } from "react";
import { Settings, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { EditProjectButton } from "./EditProjectButton";
import { DeleteProjectButton } from "../../_components/DeleteButton";

interface SettingsDropdownProps {
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
    projectId: string;
}

export function SettingsDropdown({ project, projectId }: SettingsDropdownProps) {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Settings Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`p-2 rounded-lg transition-all duration-300 ${isOpen
                        ? "text-primary rotate-90"
                        : "text-muted-foreground cursor-pointer"
                    }`}
            >
                <Settings className="h-5 w-5 transition-transform duration-300" />
            </button>

            {/* Dropdown Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, x: -10, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className="absolute right-0 md:left-20 top-48 md:top-0 w-48 rounded-xl overflow-hidden z-50"
                    >
                        <div className="p-2 space-y-2">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1, duration: 0.3 }}
                                className="w-full"
                            >
                                <EditProjectButton project={project} />
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.2, duration: 0.3 }}
                                className="w-full"
                            >
                                <DeleteProjectButton
                                    projectId={projectId}
                                    projectTitle={project.title}
                                />
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}