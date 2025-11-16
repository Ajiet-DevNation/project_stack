"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, Calendar, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import axios from "axios";

interface EditProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
    project: {
        id: string;
        title: string;
        description: string;
        requiredSkills: string[];
        liveUrl?: string;
        githubUrl?: string;
        projectStatus: "Planning" | "Active" | "Completed";
        startDate: string;
        endDate?: string;
        isActive: boolean;
    };
}

export function EditProjectModal({ isOpen, onClose, project }: EditProjectModalProps) {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    const [formData, setFormData] = useState({
        description: project.description,
        requiredSkills: project.requiredSkills,
        liveUrl: project.liveUrl || "",
        githubLink: project.githubUrl || "",
        projectStatus: project.projectStatus,
        startDate: project.startDate.split("T")[0],
        endDate: project.endDate ? project.endDate.split("T")[0] : "",
        isActive: project.isActive,
    });

    const [skillInput, setSkillInput] = useState("");

    const handleAddSkill = () => {
        if (skillInput.trim() && !formData.requiredSkills.includes(skillInput.trim())) {
            setFormData({
                ...formData,
                requiredSkills: [...formData.requiredSkills, skillInput.trim()],
            });
            setSkillInput("");
        }
    };

    const handleRemoveSkill = (skill: string) => {
        setFormData({
            ...formData,
            requiredSkills: formData.requiredSkills.filter((s) => s !== skill),
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            await axios.patch(`/api/projects/${project.id}`, {
                ...formData,
                startDate: new Date(formData.startDate).toISOString(),
                endDate: formData.endDate ? new Date(formData.endDate).toISOString() : null,
            });

            toast.success("Project updated successfully!");
            router.refresh();
            onClose();
        } catch (error) {
            console.error("Error updating project:", error);
            toast.error("Failed to update project");
        } finally {
            setIsSubmitting(false);
        }
    };
    return (
        <>
            {mounted && createPortal(
                <AnimatePresence>
                    {isOpen && (
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={onClose}
                                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                            />

                            {/* Modal */}
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="relative w-full max-w-3xl bg-card border border-border rounded-2xl shadow-2xl z-[10000]"
                            >
                                {/* Header */}
                                <div className="bg-card/95 backdrop-blur-md border-b border-border px-6 py-5 flex items-center justify-between rounded-t-2xl">
                                    <div>
                                        <h2 className="text-2xl font-semibold text-foreground">Edit Project</h2>
                                        <p className="text-sm text-muted-foreground mt-1">{project.title}</p>
                                    </div>
                                    <button
                                        onClick={onClose}
                                        className="p-2 hover:bg-accent rounded-lg transition-colors"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                {/* Form - Scrollable Content */}
                                <div className="max-h-[calc(90vh-180px)] overflow-y-auto">
                                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                        {/* Description */}
                                        <div>
                                            <label className="block text-sm font-semibold text-foreground mb-2">
                                                Description
                                            </label>
                                            <textarea
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                className="w-full px-4 py-3 bg-background border-2 border-border rounded-lg transition-colors hover:border-primary/50 resize-none text-foreground"
                                                rows={4}
                                                required
                                            />
                                        </div>

                                        {/* Required Skills */}
                                        <div>
                                            <label className="block text-sm font-semibold text-foreground mb-2">
                                                Required Skills
                                            </label>
                                            <div className="flex gap-2 mb-3">
                                                <input
                                                    type="text"
                                                    value={skillInput}
                                                    onChange={(e) => setSkillInput(e.target.value)}
                                                    onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), handleAddSkill())}
                                                    placeholder="Add a skill"
                                                    className="flex-1 px-4 py-2.5 bg-background border-2 border-border rounded-lg transition-colors hover:border-primary/50 text-foreground"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={handleAddSkill}
                                                    className="px-5 py-2.5 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity font-medium"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {formData.requiredSkills.map((skill) => (
                                                    <span
                                                        key={skill}
                                                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-secondary text-secondary-foreground rounded-full text-sm font-medium"
                                                    >
                                                        {skill}
                                                        <button
                                                            type="button"
                                                            onClick={() => handleRemoveSkill(skill)}
                                                            className="hover:text-destructive transition-colors"
                                                        >
                                                            <X className="h-3 w-3" />
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Project Status & Active Status */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-foreground mb-2">
                                                    Project Status
                                                </label>
                                                <select
                                                    value={formData.projectStatus}
                                                    onChange={(e) => setFormData({ ...formData, projectStatus: e.target.value as any })}
                                                    className="w-full px-4 py-2.5 bg-background border-2 border-border rounded-lg transition-colors hover:border-primary/50 text-foreground"
                                                >
                                                    <option value="Planning">Planning</option>
                                                    <option value="Active">Active</option>
                                                    <option value="Completed">Completed</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-foreground mb-2">
                                                    Accepting Applications
                                                </label>
                                                <div className="flex items-center h-[42px]">
                                                    <label className="relative inline-flex items-center cursor-pointer">
                                                        <input
                                                            type="checkbox"
                                                            checked={formData.isActive}
                                                            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                                            className="sr-only peer"
                                                        />
                                                        <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                                                        <span className="ms-3 text-sm font-medium text-foreground">
                                                            {formData.isActive ? "Open" : "Closed"}
                                                        </span>
                                                    </label>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Dates */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div>
                                                <label className="block text-sm font-semibold text-foreground mb-2">
                                                    <Calendar className="inline h-4 w-4 mr-1.5" />
                                                    Start Date
                                                </label>
                                                <input
                                                    type="date"
                                                    value={formData.startDate}
                                                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                                                    className="w-full px-4 py-2.5 bg-background border-2 border-border rounded-lg transition-colors hover:border-primary/50 text-foreground"
                                                    required
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-foreground mb-2">
                                                    <Calendar className="inline h-4 w-4 mr-1.5" />
                                                    End Date (Optional)
                                                </label>
                                                <input
                                                    type="date"
                                                    value={formData.endDate}
                                                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                                                    className="w-full px-4 py-2.5 bg-background border-2 border-border rounded-lg transition-colors hover:border-primary/50 text-foreground"
                                                />
                                            </div>
                                        </div>

                                        {/* URLs */}
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-foreground mb-2">
                                                    Live URL (Optional)
                                                </label>
                                                <input
                                                    type="url"
                                                    value={formData.liveUrl}
                                                    onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                                                    placeholder="https://your-project.com"
                                                    className="w-full px-4 py-2.5 bg-background border-2 border-border rounded-lg transition-colors hover:border-primary/50 text-foreground"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-foreground mb-2">
                                                    GitHub URL (Optional)
                                                </label>
                                                <input
                                                    type="url"
                                                    value={formData.githubLink}
                                                    onChange={(e) => setFormData({ ...formData, githubLink: e.target.value })}
                                                    placeholder="https://github.com/username/repo"
                                                    className="w-full px-4 py-2.5 bg-background border-2 border-border rounded-lg transition-colors hover:border-primary/50 text-foreground"
                                                />
                                            </div>
                                        </div>
                                    </form>
                                </div>

                                {/* Footer - Fixed Action Buttons */}
                                <div className="bg-card/95 backdrop-blur-md border-t border-border px-6 py-4 flex gap-3 justify-end rounded-b-2xl">
                                    <button
                                        type="button"
                                        onClick={onClose}
                                        disabled={isSubmitting}
                                        className="px-6 py-2.5 text-sm font-semibold text-foreground bg-secondary hover:bg-secondary/80 rounded-lg transition-colors disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        onClick={handleSubmit}
                                        disabled={isSubmitting}
                                        className="px-6 py-2.5 text-sm font-semibold text-primary-foreground bg-primary hover:opacity-90 rounded-lg transition-opacity disabled:opacity-50 flex items-center gap-2"
                                    >
                                        {isSubmitting ? (
                                            <>
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                Saving...
                                            </>
                                        ) : (
                                            "Save Changes"
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