import DemoOne from "@/components/ShaderBackground";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { checkApplicationStatus } from "../../../../../actions/applications";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { db } from "@/lib/prisma";
import { ApplyButton } from "../_components/ApplyButton";
import { DeleteProjectButton } from "../_components/DeleteButton";
import LikeButton from "@/components/LikeButton";
import { ExternalLink, Github } from "lucide-react";

interface ProjectPageProps {
  params: { id: string };
}

type LikeWithProfile = {
  profileId: string;
};

interface ApiProject {
  id: string;
  title: string;
  description: string;
  requiredSkills: string[];
  startDate: string;
  endDate: string;
  postedOn: string;
  githubLink: string | null;
  liveUrl: string | null;
  thumbnail: string | null;
  projectStatus: "Planning" | "Active" | "Completed";
  isActive: boolean;
  authorId: string;
  author: {
    id: string;
    name: string;
    image: string | null;
  };
  likes: LikeWithProfile[];
  comments: unknown[];
  contributors: {
    id: string;
    user: {
      id: string;
      name: string;
      image: string | null;
    };
  }[];
  screenshots?: string[];
  videoUrl?: string | null;
}

async function getProject(id: string): Promise<ApiProject | null> {
  try {
    const response = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/projects/${id}`,
      {
        cache: "no-store",
      }
    );

    if (!response.ok) {
      return null;
    }
    return response.json();
  } catch (error) {
    console.error("Failed to fetch project:", error);
    return null;
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const apiProject = await getProject(id);
  console.log("isActive:", apiProject?.isActive);

  if (!apiProject) {
    notFound();
  }

  const session = await getServerSession(authOptions);
  let currentUserProfile = null;
  let applicationStatus = null;

  if (session?.user?.email) {
    currentUserProfile = await db.profile.findFirst({
      where: {
        user: {
          email: session.user.email,
        },
      },
    });

    // Check application status
    if (currentUserProfile) {
      const statusResult = await checkApplicationStatus(
        currentUserProfile.id,
        id
      );
      if (statusResult.success) {
        applicationStatus = statusResult.data;
      }
    }
  }

  const project = {
    id: apiProject.id,
    title: apiProject.title,
    description: apiProject.description,
    creator: {
      id: apiProject.author.id,
      name: apiProject.author.name,
      avatar: apiProject.author.image || undefined,
    },
    tags: apiProject.requiredSkills,
    image: apiProject.screenshots?.[0] || apiProject.thumbnail || undefined,
    about: apiProject.description,
    liveUrl: apiProject.liveUrl || undefined,
    githubUrl: apiProject.githubLink || undefined,
    status: apiProject.projectStatus,
    likes: apiProject.likes.length,
    comments: apiProject.comments.length,
    screenshots: apiProject.screenshots || [],
    isActive: apiProject.isActive,
    contributors: apiProject.contributors.map((c) => ({
      id: c.user.id,
      name: c.user.name,
      avatar: c.user.image || undefined,
    })),
  };

  const isProjectOwner = currentUserProfile?.id === apiProject.authorId;
  console.log("Current User Profile:", currentUserProfile);
  console.log("Is Project Owner:", isProjectOwner);
  console.log("Application Status:", applicationStatus);

  const isInitiallyLiked =
    !!currentUserProfile &&
    apiProject.likes.some((like) => like.profileId === currentUserProfile.id);

  return (
    <>
      <div className="fixed -z-10 h-full w-screen">
        <DemoOne />
      </div>

      <main className="relative z-0 min-h-screen pb-20">
        <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-10">
          <div className="w-full px-4 py-4 sm:px-6 lg:px-8">
            <nav>
              <Link
                href="/home"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Back to Home
              </Link>
            </nav>
          </div>
        </header>

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Hero Image Section */}
              {project.image && (
                <section className="fade-in-up">
                  <div className="overflow-hidden rounded-xl border border-border bg-card/60 shadow-xl backdrop-blur-sm">
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={800}
                      height={500}
                      className="w-full object-cover"
                      style={{ height: '500px' }}
                    />
                  </div>

                  {/* Thumbnail Gallery */}
                  {project.screenshots.length > 1 && (
                    <div className="grid grid-cols-4 gap-4 mt-6">
                      {project.screenshots.slice(0, 4).map((screenshot, index) => (
                        <div
                          key={index}
                          className="overflow-hidden rounded-lg border-2 border-border bg-card/60 shadow-md hover:shadow-lg hover:border-primary/50 transition-all cursor-pointer backdrop-blur-sm"
                        >
                          <Image
                            src={screenshot}
                            alt={`${project.title} screenshot ${index + 1}`}
                            width={200}
                            height={150}
                            className="w-full object-cover"
                            style={{ height: '120px' }}
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              )}

              {/* About Section */}
              <section className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-8 shadow-xl fade-in-up delay-100">
                <h2 className="text-2xl font-semibold text-foreground mb-6 pb-3 border-b border-border/50">
                  About
                </h2>
                <div className="space-y-6">
                  <div className="prose prose-sm max-w-none">
                    <p className="leading-relaxed text-base text-muted-foreground">{project.about}</p>
                  </div>
                  
                  {/* Required Skills in About Section */}
                  <div className="pt-4">
                    <h3 className="text-base font-semibold text-foreground mb-4">
                      Required Skills
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-block rounded-full bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground shadow-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* Contributors Section */}
              {project.contributors.length > 0 && (
                <section className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-8 shadow-xl fade-in-up delay-200">
                  <h2 className="text-2xl font-semibold text-foreground mb-6 pb-3 border-b border-border/50">
                    Contributors ({project.contributors.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.contributors.map((contributor) => (
                      <Link
                        key={contributor.id}
                        href={`/profile/${contributor.id}`}
                        className="flex items-center gap-4 p-4 bg-card/40 border border-border rounded-lg transition-all hover:bg-accent hover:border-primary/50 hover:shadow-md backdrop-blur-sm"
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
                          <p className="text-xs text-muted-foreground">
                            Contributor
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar Column */}
            <div className="lg:col-span-1 space-y-6">
              {/* Project Info Card */}
              <div className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-6 shadow-xl fade-in-up sticky top-24">
                {/* Title and Status */}
                <div className="mb-6 pb-6 border-b border-border/50">
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                        project.status === "Completed"
                          ? "bg-green-500/20 text-green-600 dark:text-green-400 border border-green-500/30"
                          : project.status === "Active"
                          ? "bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/30"
                          : "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30"
                      }`}
                    >
                      {project.status}
                    </span>
                    
                    {isProjectOwner && (
                      <DeleteProjectButton
                        projectId={id}
                        projectTitle={project.title}
                      />
                    )}
                  </div>
                  
                  <h1 className="text-2xl font-serif font-bold text-foreground mb-3 leading-tight">
                    {project.title}
                  </h1>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {project.description}
                  </p>
                </div>

                {/* Creator Info */}
                <div className="mb-6 pb-6 border-b border-border/50">
                  <Link
                    href={`/profile/${project.creator.id}`}
                    className="flex items-center gap-3 group p-2 rounded-lg hover:bg-accent/50 transition-all"
                  >
                    {project.creator.avatar ? (
                      <Image
                        src={`${project.creator.avatar}`}
                        alt={project.creator.name}
                        width={48}
                        height={48}
                        className="h-12 w-12 rounded-full bg-muted border-2 border-border shadow-md"
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-muted border-2 border-border shadow-md flex items-center justify-center text-muted-foreground font-semibold">
                        {project.creator.name.charAt(0)}
                      </div>
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-foreground group-hover:underline">
                        {project.creator.name}
                      </p>
                      <p className="text-xs text-muted-foreground">Project Creator</p>
                    </div>
                  </Link>
                </div>

                {/* Engagement Stats */}
                <div className="mb-6 pb-6 border-b border-border/50">
                  <div className="flex items-center justify-start">
                    <LikeButton
                      projectId={project.id}
                      isInitiallyLiked={isInitiallyLiked}
                      initialLikeCount={project.likes}
                      disabled={!currentUserProfile}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  {isProjectOwner && (
                    <Link
                      href={`/projects/${project.id}/applications`}
                      className="w-full inline-flex items-center justify-center gap-2 
                        rounded-lg bg-purple-600 px-4 py-3 
                        text-sm font-semibold text-white 
                        hover:bg-purple-700 transition-all 
                        shadow-md hover:shadow-lg"
                    >
                      Manage Applications
                    </Link>
                  )}
                  
                  {project.isActive && currentUserProfile && !isProjectOwner && (
                    <ApplyButton
                      projectId={project.id}
                      profileId={currentUserProfile.id}
                      hasApplied={applicationStatus?.hasApplied}
                      applicationStatus={applicationStatus?.applicationStatus}
                      isContributor={applicationStatus?.isContributor}
                    />
                  )}
                  
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90 transition-all shadow-md hover:shadow-lg"
                    >
                      <ExternalLink className="h-4 w-4" />
                      View Live
                    </a>
                  )}
                  
                  {project.githubUrl && (
                    <a
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full inline-flex items-center justify-center gap-2 rounded-lg border border-border bg-card/40 px-4 py-3 text-sm font-semibold text-foreground hover:bg-accent transition-all shadow-md hover:shadow-lg backdrop-blur-sm"
                    >
                      <Github className="h-4 w-4" />
                      GitHub
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}