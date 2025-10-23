"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    User,
    Edit3,
    MapPin,
    Calendar,
    GraduationCap,
    Code,
    FileText,
    Heart,
    MessageCircle,
    ExternalLink,
    Github,
    Users,
    Trophy,
    Settings,
    Building2
} from "lucide-react"
import { ProjectCard } from "./ProjectCard"
import { ProfileEditModal } from "./ProfileEditModal"

interface ProfileContentProps {
    profileId: string
}

// Demo data - replace with actual API calls
const demoProfile = {
    id: "profile123",
    name: "Sunpreeth Vishwa",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
    section: "A",
    branch: "Computer Science Engineering",
    year: "3rd Year",
    college: "A.J. Institute of Stupidity",
    skills: ["React", "Node.js", "Python", "Machine Learning", "UI/UX Design", "MongoDB"],
    bio: "Passionate full-stack developer with a keen interest in AI/ML. Love building innovative solutions that solve real-world problems. Always eager to collaborate on exciting projects! and GAY",
    userId: "user123",
    projects: [
        {
            id: "proj1",
            title: "AI-Powered Study Assistant",
            description: "An intelligent study companion that helps students organize notes, create quizzes, and track progress using machine learning algorithms.",
            thumbnail: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=200&fit=crop",
            liveUrl: "https://study-assistant.demo.com",
            githubLink: "https://github.com/aanya/study-assistant",
            requiredSkills: ["React", "Python", "TensorFlow"],
            projectStatus: "Completed",
            postedOn: "2024-01-15T10:00:00Z",
            likes: 24,
            comments: 8,
            contributors: 3
        },
        {
            id: "proj2",
            title: "Campus Event Management System",
            description: "A comprehensive platform for managing college events, registrations, and notifications with real-time updates.",
            thumbnail: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=400&h=200&fit=crop",
            liveUrl: "https://campus-events.demo.com",
            githubLink: "https://github.com/aanya/campus-events",
            requiredSkills: ["Next.js", "PostgreSQL", "Socket.io"],
            projectStatus: "In Progress",
            postedOn: "2024-02-20T14:30:00Z",
            likes: 18,
            comments: 12,
            contributors: 5
        }
    ]
}

const currentUserId = "user123" // This would come from session/auth

function ProfileContent({ profileId }: ProfileContentProps) {
    const [profile, setProfile] = useState(demoProfile)
    const [isEditModalOpen, setIsEditModalOpen] = useState(false)
    const [activeTab, setActiveTab] = useState("projects")
    const [isLoading, setIsLoading] = useState(false)

    const isOwnProfile = profile.userId === currentUserId

    // Commented out API calls - replace with actual implementation
    useEffect(() => {
        // const fetchProfile = async () => {
        //   try {
        //     const response = await fetch(`/api/profile/${profileId}`)
        //     if (response.ok) {
        //       const data = await response.json()
        //       setProfile(data)
        //     }
        //   } catch (error) {
        //     console.error('Error fetching profile:', error)
        //   }
        // }
        // fetchProfile()
    }, [profileId])

    const handleProfileUpdate = async (updatedData: any) => {
        // const response = await fetch('/api/profile/me', {
        //   method: 'PUT',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(updatedData)
        // })
        // if (response.ok) {
        //   const updated = await response.json()
        //   setProfile(updated)
        // }

        // Demo update
        setProfile(prev => ({ ...prev, ...updatedData }))
        setIsEditModalOpen(false)
    }

    const stats = [
        { label: "Projects", value: profile.projects.length, icon: Code },
        { label: "Contributions", value: 12, icon: Users },
        { label: "Likes Received", value: 42, icon: Heart },
        { label: "Comments", value: 28, icon: MessageCircle }
    ]

    return (
        <main className="relative z-0 min-h-screen">
            <div className="mx-auto w-full max-w-6xl px-4 py-10 md:py-14">
                {/* Profile Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="border border-border/20 bg-background/20 backdrop-blur-sm mb-8">
                        <CardContent className="p-8">
                            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                                >
                                    <Avatar className="w-24 h-24 border-4 border-primary/20">
                                        <AvatarImage src={profile.image} alt={profile.name} />
                                        <AvatarFallback className="text-2xl font-semibold bg-primary/10">
                                            {profile.name.split(' ').map(n => n[0]).join('')}
                                        </AvatarFallback>
                                    </Avatar>
                                </motion.div>

                                <div className="flex-1 space-y-4">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                        <div>
                                            <motion.h1
                                                className="text-3xl font-bold text-foreground"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.3 }}
                                            >
                                                {profile.name}
                                            </motion.h1>
                                            <motion.div
                                                className="flex flex-wrap items-center gap-4 mt-2 text-muted-foreground"
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.4 }}
                                            >
                                                <div className="flex items-center gap-1">
                                                    <GraduationCap className="w-4 h-4" />
                                                    <span>{profile.branch}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Calendar className="w-4 h-4" />
                                                    <span>{profile.year}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    <span>Section {profile.section}</span>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <Building2 className="w-4 h-4" />
                                                    <span>{profile.college}</span>
                                                </div>
                                            </motion.div>
                                        </div>


                                        {isOwnProfile && (
                                            <motion.div
                                                initial={{ opacity: 0, scale: 0 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: 0.5 }}
                                            >
                                                <Button
                                                    onClick={() => setIsEditModalOpen(true)}
                                                    className="bg-primary/80 hover:bg-primary/90 backdrop-blur-sm"
                                                >
                                                    <Edit3 className="w-4 h-4 mr-2" />
                                                    Edit Profile
                                                </Button>
                                            </motion.div>
                                        )}
                                    </div>

                                    {/* Bio */}
                                    {profile.bio && (
                                        <motion.p
                                            className="text-muted-foreground leading-relaxed"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.6 }}
                                        >
                                            {profile.bio}
                                        </motion.p>
                                    )}

                                    {/* Skills */}
                                    <motion.div
                                        className="space-y-2"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.7 }}
                                    >
                                        <h3 className="text-sm font-medium text-foreground flex items-center gap-2">
                                            <Code className="w-4 h-4" />
                                            Skills
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {profile.skills.map((skill, index) => (
                                                <motion.div
                                                    key={skill}
                                                    initial={{ opacity: 0, scale: 0 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    transition={{ delay: 0.8 + index * 0.05 }}
                                                >
                                                    <Badge
                                                        variant="secondary"
                                                        className="bg-primary/20 text-foreground border border-border/20 backdrop-blur-sm"
                                                    >
                                                        {skill}
                                                    </Badge>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {/* Stats Cards */}
                <motion.div
                    className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.5 }}
                >
                    {stats.map((stat, index) => (
                        <motion.div
                            key={stat.label}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.4 + index * 0.1 }}
                        >
                            <Card className="border border-border/20 bg-background/20 backdrop-blur-sm">
                                <CardContent className="p-4 text-center">
                                    <stat.icon className="w-6 h-6 mx-auto mb-2 text-primary" />
                                    <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Content Tabs */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.5 }}
                >
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                        <TabsList className="bg-background/20 backdrop-blur-sm border border-border/20">
                            <TabsTrigger value="projects" className="data-[state=active]:bg-primary/20">
                                <Code className="w-4 h-4 mr-2" />
                                Projects
                            </TabsTrigger>
                            <TabsTrigger value="contributions" className="data-[state=active]:bg-primary/20">
                                <Users className="w-4 h-4 mr-2" />
                                Contributions
                            </TabsTrigger>
                            <TabsTrigger value="activity" className="data-[state=active]:bg-primary/20">
                                <Trophy className="w-4 h-4 mr-2" />
                                Activity
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="projects" className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold text-foreground">
                                    Projects ({profile.projects.length})
                                </h2>
                                {isOwnProfile && (
                                    <Button variant="outline" className="bg-background/20 backdrop-blur-sm border-border/20">
                                        <Code className="w-4 h-4 mr-2" />
                                        New Project
                                    </Button>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <AnimatePresence>
                                    {profile.projects.map((project, index) => (
                                        <motion.div
                                            key={project.id}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -20 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <ProjectCard project={project} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>

                            {profile.projects.length === 0 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-12"
                                >
                                    <Code className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                    <h3 className="text-lg font-medium text-foreground mb-2">No projects yet</h3>
                                    <p className="text-muted-foreground">
                                        {isOwnProfile ? "Start by creating your first project!" : "No projects to show."}
                                    </p>
                                </motion.div>
                            )}
                        </TabsContent>

                        <TabsContent value="contributions" className="space-y-6">
                            <div className="text-center py-12">
                                <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                <h3 className="text-lg font-medium text-foreground mb-2">Contributions</h3>
                                <p className="text-muted-foreground">Project contributions will appear here.</p>
                            </div>
                        </TabsContent>

                        <TabsContent value="activity" className="space-y-6">
                            <div className="text-center py-12">
                                <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                                <h3 className="text-lg font-medium text-foreground mb-2">Activity Feed</h3>
                                <p className="text-muted-foreground">Recent activity and achievements will appear here.</p>
                            </div>
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </div>

            {/* Edit Profile Modal */}
            <ProfileEditModal
                isOpen={isEditModalOpen}
                onClose={() => setIsEditModalOpen(false)}
                profile={profile}
                onSave={handleProfileUpdate}
            />
        </main>
    )
}

export default ProfileContent;