"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { profileSchema, ProfileFormData } from "@/lib/validations/profile"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, Plus, User, Save } from "lucide-react"
import axios from "axios"
import { Profile } from "@/types/profile"

interface ProfileEditModalProps {
    isOpen: boolean
    onClose: () => void
    profile: Profile | null
    onSave: (data: Partial<Profile>) => void
}

export function ProfileEditModal({ isOpen, onClose, profile, onSave }: ProfileEditModalProps) {
    const [skillInput, setSkillInput] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)
    const submitLockRef = useRef(false)

    const {
        register,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
    })

    // Use an effect to reset the form when the profile data changes
    useEffect(() => {
        if (profile) {
            reset({
                name: profile.name || "",
                section: profile.section || "",
                branch: profile.branch || "",
                year: profile.year || "",
                college: profile.college || "",
                bio: profile.bio || "",
                image: profile.image || "",
                skills: profile.skills || [],
            });
        }
    }, [profile, reset]);


    const skills = watch("skills") || []

    const addSkill = (skillToAdd: string) => {
        const trimmedSkill = skillToAdd.trim()
        if (!trimmedSkill || skills.includes(trimmedSkill)) return

        setValue("skills", [...skills, trimmedSkill], { shouldValidate: true })
        setSkillInput("")
    }

    const removeSkill = (skillToRemove: string) => {
        setValue("skills", skills.filter(skill => skill !== skillToRemove), { shouldValidate: true })
    }

    const onSubmit = async (data: ProfileFormData) => {
        if (submitLockRef.current) return;

        submitLockRef.current = true
        setIsSubmitting(true)
        
        try {
            const submitData = { ...data }
            if (!submitData.image) {
                delete submitData.image
            }
            
            const response = await axios.put(`/api/profile/me`, submitData)
            
            onSave(response.data)
            onClose()
        } catch (error) {
            console.error("Error updating profile:", error)
            if (axios.isAxiosError(error) && error.response && Array.isArray(error.response.data)) {
                error.response.data.forEach((err: { message: string }) => {
                    console.error("Validation error:", err.message)
                })
            }
        } finally {
            setIsSubmitting(false)
            setTimeout(() => {
                submitLockRef.current = false
            }, 1000)
        }
    }

    const handleSkillKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" || e.key === "," || e.key === "Tab") {
            e.preventDefault()
            addSkill(skillInput)
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-background/95 backdrop-blur-sm border-border/20">
                <DialogHeader>
                    <DialogTitle className="text-foreground flex items-center gap-2">
                        <User className="w-5 h-5" />
                        Edit Profile
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Profile Image */}
                    <div className="flex items-center gap-4">
                        <Avatar className="w-20 h-20 border-2 border-primary/20">
                            <AvatarImage src={watch("image") ?? undefined} alt={watch("name")} />
                            <AvatarFallback className="text-lg bg-primary/10">
                                {watch("name")?.split(' ').map(n => n[0]).join('') || 'U'}
                            </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <Label htmlFor="image" className="text-foreground">Profile Image URL</Label>
                            <Input
                                id="image"
                                placeholder="https://example.com/image.jpg"
                                {...register("image")}
                                className="mt-1 bg-background/40 backdrop-blur-sm border-border/40"
                            />
                            {errors.image && (
                                <p className="text-xs text-destructive mt-1">{errors.image.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <Label htmlFor="name" className="text-foreground">Full Name</Label>
                            <Input
                                id="name"
                                {...register("name")}
                                className="mt-1 bg-background/40 backdrop-blur-sm border-border/40"
                            />
                            {errors.name && (
                                <p className="text-xs text-destructive mt-1">{errors.name.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="section" className="text-foreground">Section</Label>
                            <Input
                                id="section"
                                placeholder="A, B, C..."
                                {...register("section")}
                                className="mt-1 bg-background/40 backdrop-blur-sm border-border/40"
                            />
                            {errors.section && (
                                <p className="text-xs text-destructive mt-1">{errors.section.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="branch" className="text-foreground">Branch</Label>
                            <Input
                                id="branch"
                                placeholder="Computer Science Engineering"
                                {...register("branch")}
                                className="mt-1 bg-background/40 backdrop-blur-sm border-border/40"
                            />
                            {errors.branch && (
                                <p className="text-xs text-destructive mt-1">{errors.branch.message}</p>
                            )}
                        </div>

                        <div>
                            <Label htmlFor="year" className="text-foreground">Year</Label>
                            <Input
                                id="year"
                                placeholder="1st Year, 2nd Year..."
                                {...register("year")}
                                className="mt-1 bg-background/40 backdrop-blur-sm border-border/40"
                            />
                            {errors.year && (
                                <p className="text-xs text-destructive mt-1">{errors.year.message}</p>
                            )}
                        </div>

                        {/* College field - spans full width */}
                        <div className="md:col-span-2">
                            <Label htmlFor="college" className="text-foreground">College</Label>
                            <Input
                                id="college"
                                placeholder="e.g., National Institute of Technology"
                                {...register("college")}
                                className="mt-1 bg-background/40 backdrop-blur-sm border-border/40"
                            />
                            {errors.college && (
                                <p className="text-xs text-destructive mt-1">{errors.college.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Bio */}
                    <div>
                        <Label htmlFor="bio" className="text-foreground">Bio</Label>
                        <Textarea
                            id="bio"
                            placeholder="Tell us about yourself, your interests, and what you're looking for..."
                            rows={4}
                            {...register("bio")}
                            className="mt-1 bg-background/40 backdrop-blur-sm border-border/40 resize-none"
                        />
                        <div className="flex justify-between items-center mt-1">
                            {errors.bio && (
                                <p className="text-xs text-destructive">{errors.bio.message}</p>
                            )}
                            <p className="text-xs text-muted-foreground ml-auto">
                                {watch("bio")?.length || 0}/300
                            </p>
                        </div>
                    </div>

                    {/* Skills */}
                    <div>
                        <Label htmlFor="skills" className="text-foreground">Skills</Label>
                        <div className="mt-2 space-y-3">
                            <div className="flex gap-2">
                                <Input
                                    value={skillInput}
                                    onChange={(e) => setSkillInput(e.target.value)}
                                    onKeyDown={handleSkillKeyDown}
                                    placeholder="Add a skill and press Enter"
                                    className="bg-background/40 backdrop-blur-sm border-border/40"
                                />
                                <Button
                                    type="button"
                                    onClick={() => addSkill(skillInput)}
                                    disabled={!skillInput.trim()}
                                    className="bg-primary/80 hover:bg-primary/90"
                                >
                                    <Plus className="w-4 h-4" />
                                </Button>
                            </div>

                            <AnimatePresence>
                                {skills.length > 0 && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="flex flex-wrap gap-2"
                                    >
                                        {skills.map((skill, index) => (
                                            <motion.div
                                                key={skill}
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                exit={{ opacity: 0, scale: 0 }}
                                                transition={{ delay: index * 0.05 }}
                                            >
                                                <Badge
                                                    variant="secondary"
                                                    className="bg-primary/20 text-foreground border border-border/20 backdrop-blur-sm"
                                                >
                                                    {skill}
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSkill(skill)}
                                                        className="ml-2 hover:text-destructive transition-colors"
                                                    >
                                                        <X className="w-3 h-3" />
                                                    </button>
                                                </Badge>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <p className="text-xs text-muted-foreground">
                                Add skills like React, Python, Figma, etc. Press Enter or comma to add.
                            </p>

                            {errors.skills && (
                                <p className="text-xs text-destructive">{errors.skills.message}</p>
                            )}
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-border/20">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="bg-background/20 border-border/30"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-primary/80 hover:bg-primary/90 backdrop-blur-sm"
                        >
                            {isSubmitting ? (
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
                                />
                            ) : (
                                <Save className="w-4 h-4 mr-2" />
                            )}
                            {isSubmitting ? "Saving..." : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}