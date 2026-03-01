"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Edit3,
  MapPin,
  Calendar,
  GraduationCap,
  Code,
  Users,
  Trophy,
  Building2,
  LogOut
} from "lucide-react";
import { ProjectCard } from "./ProjectCard";
import { ProfileEditModal } from "./ProfileEditModal";
import axios from "axios";
import { signOut, useSession } from "next-auth/react";
import { getUserContributions } from "../../../../../../actions/applications";
import { Project, Profile, Contribution } from "@/types/profile";
import Loader from "@/components/Loader";
import { getSkillIcon } from "@/lib/skillIcons";

interface ProfileContentProps {
  profileId?: string;
}

function ProfileContent({ profileId }: ProfileContentProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("projects");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, update } = useSession();
  const [contributions, setContributions] = useState<Contribution[]>([]);

  let isOwnProfile = false;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        // If no profileId provided, fetch current user's profile
        const endpoint = profileId ? `/api/profile/${profileId}` : `/api/profile/me`;
        // console.log("Fetching from:", endpoint);

        const { data } = await axios.get(endpoint);
        // console.log("Profile data received:", data);
        setProfile(data);

        if (data.id) {
          const contributionsResult = await getUserContributions(data.id);
          if (contributionsResult.success && contributionsResult.data) {
            setContributions(contributionsResult.data.map(c => ({ id: c.id, project: c.project as Project })));
          }
        }
      } catch (error) {
        console.error("Error fetching Profile", error);
        if (axios.isAxiosError(error)) {
          const errorMessage = error.response?.data || error.message || "Failed to load profile";
          setError(errorMessage);
        } else if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("An unknown error occurred while fetching the profile.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileId]);

  if (session?.user.id == profile?.userId) isOwnProfile = true;

  const handleProfileUpdate = async (updatedData: Partial<Profile>) => {
    try {
      const { data } = await axios.put(`/api/profile/me`, updatedData);
      setProfile(data);
      await update();
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating profile", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          {/* <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading profile...</p> */}
          <Loader/>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center max-w-md">
          <div className="text-destructive text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Profile Not Found</h2>
          <p className="text-muted-foreground mb-4">{error}</p>
          <p className="text-sm text-muted-foreground">
            Profile ID: <code className="bg-muted px-2 py-1 rounded">{profileId || "current user"}</code>
          </p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-muted-foreground">Profile not found</p>
        </div>
      </div>
    );
  }

  const stats = [
    { label: "Projects", value: profile.projects?.length || 0, icon: Code },
    { label: "Contributions", value: contributions.length, icon: Users },

  ];
  console.log(profile.image);

  return (
    <main className="relative z-0 min-h-screen">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 md:py-14">
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
                    <AvatarImage src={isOwnProfile ? session?.user?.image ?? profile.image ?? undefined : profile.image ?? undefined} alt={profile.name} />
                    <AvatarFallback className="text-2xl font-semibold bg-primary/10">
                      {profile.name?.split(" ").map(n => n[0]).join("")}
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
                        {profile.branch && (
                          <div className="flex items-center gap-1">
                            <GraduationCap className="w-4 h-4" />
                            <span>{profile.branch}</span>
                          </div>
                        )}
                        {profile.year && (
                          <div className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            <span>{profile.year}</span>
                          </div>
                        )}
                        {profile.section && (
                          <div className="flex items-center gap-1">
                            <MapPin className="w-4 h-4" />
                            <span>Section {profile.section}</span>
                          </div>
                        )}
                        {profile.college && (
                          <div className="flex items-center gap-1">
                            <Building2 className="w-4 h-4" />
                            <span>{profile.college}</span>
                          </div>
                        )}
                      </motion.div>
                    </div>

                    {isOwnProfile && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.5 }}
                        className="flex flex-col gap-4"
                      >
                        <Button
                          onClick={() => setIsEditModalOpen(true)}
                          className="bg-primary/80 cursor-pointer hover:bg-primary/90 backdrop-blur-sm"
                        >
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit Profile
                        </Button>
                        <Button
                          onClick={() => signOut()}
                          className="bg-primary/80 hover:bg-primary/90 backdrop-blur-sm"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign-Out
                        </Button>
                      </motion.div>
                    )}
                  </div>

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

                  {profile.skills && profile.skills.length > 0 && (
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
                        {profile.skills.map((skill, index) => {
                          const Icon = getSkillIcon(skill);
                          return (
                            <motion.div
                              key={skill}
                              initial={{ opacity: 0, scale: 0 }}
                              animate={{ opacity: 1, scale: 1 }}
                              transition={{ delay: 0.8 + index * 0.05 }}
                            >
                              <Badge
                                variant="secondary"
                                className="bg-primary/20 text-foreground border border-border/20 backdrop-blur-sm flex items-center gap-2"
                              >
                                {Icon && <Icon className="w-4 h-4" />}
                                {skill}
                              </Badge>
                            </motion.div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 gap-4 mb-6"
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
                  <stat.icon className="w-5 h-5 mx-auto mb-2 text-primary" />
                  <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="bg-background/20 backdrop-blur-sm border border-border/20">
              <TabsTrigger value="projects" className="data-[state=active]:bg-primary/20 cursor-pointer">
                <Code className="w-4 h-4 mr-2" />
                Projects
              </TabsTrigger>
              <TabsTrigger value="contributions" className="data-[state=active]:bg-primary/20 cursor-pointer">
                <Users className="w-4 h-4 mr-2" />
                Contributions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="projects" className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">
                  Projects ({profile.projects?.length || 0})
                </h2>
              </div>

              {profile.projects && profile.projects.length > 0 ? (
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
                        <ProjectCard
                          project={{
                            ...project,
                            liveUrl: project.liveUrl ?? undefined,
                            thumbnail: project.thumbnail ?? undefined,
                            endDate: project.endDate ? new Date(project.endDate).toISOString() : undefined,
                            githubLink: project.githubLink ?? undefined,
                            postedOn: new Date(project.postedOn).toISOString(),
                            startDate: project.startDate ? new Date(project.startDate).toISOString() : undefined,
                            requiredSkills: project.requiredSkills || [],
                            likes: project._count?.likes || 0,
                            contributors: project._count?.contributors || 0
                          }}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
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
              {contributions.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <AnimatePresence>
                    {contributions.map((contribution, index) => (
                      <motion.div
                        key={contribution.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <ProjectCard
                          project={{
                            id: contribution.project.id,
                            title: contribution.project.title,
                            description: contribution.project.description,
                            liveUrl: contribution.project.liveUrl ?? undefined,
                            thumbnail: contribution.project.thumbnail ?? undefined,
                            endDate: contribution.project.endDate ? new Date(contribution.project.endDate).toISOString() : undefined,
                            githubLink: contribution.project.githubLink ?? undefined,
                            isActive: contribution.project.isActive,
                            postedOn: new Date(contribution.project.postedOn).toISOString(),
                            projectStatus: contribution.project.projectStatus,
                            requiredSkills: contribution.project.requiredSkills || [],
                            startDate: contribution.project.startDate ? new Date(contribution.project.startDate).toISOString() : undefined,
                            likes: contribution.project._count?.likes || 0,
                            contributors: contribution.project._count?.contributors || 0
                          }}
                        />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <Users className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No contributions yet</h3>
                  <p className="text-muted-foreground">
                    Contributions will appear here once you start collaborating on projects.
                  </p>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="activity" className="space-y-6">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Trophy className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-medium text-foreground mb-2">No activity yet</h3>
                <p className="text-muted-foreground">
                  Your activity history will be displayed here.
                </p>
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        profile={profile}
        onSave={handleProfileUpdate}
      />
    </main>
  );
}

export default ProfileContent;