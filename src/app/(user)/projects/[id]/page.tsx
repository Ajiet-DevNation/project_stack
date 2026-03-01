import { Metadata } from "next";
import { ExternalLink, Github, Calendar, Users } from "lucide-react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { checkApplicationStatus } from "../../../../../actions/applications";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { db } from "@/lib/prisma";
import { ApplyButton } from "../_components/ApplyButton";
import LikeButton from "@/components/LikeButton";
import { SettingsDropdown } from "./_components/SettingsDropdown";
import { UserRoundCog } from "lucide-react";

interface ProjectPageProps {
  params: Promise<{ id: string }>;
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

export async function generateMetadata({
  params,
}: ProjectPageProps): Promise<Metadata> {
  const { id } = await params;
  const project = await getProject(id);

  if (!project) {
    return {
      title: "Project Not Found",
    };
  }

  return {
    title: project.title,
    description: project.description.substring(0, 160), // Good practice to limit length
    openGraph: {
      title: project.title,
      description: project.description.substring(0, 160),
      images: [
        {
          // Use the project thumbnail if available, otherwise fallback to logo
          url: project.thumbnail || "/logo.png",
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: project.title,
      description: project.description.substring(0, 160),
      images: [project.thumbnail || "/logo.png"],
    },
  };
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
    startDate: apiProject.startDate,
    endDate: apiProject.endDate,
    contributors: apiProject.contributors.map((c) => ({
      id: c.user.id,
      name: c.user.name,
      avatar: c.user.image || undefined,
    })),
  };

  const isProjectOwner = currentUserProfile?.id === apiProject.authorId;

  const isInitiallyLiked =
    !!currentUserProfile &&
    apiProject.likes.some((like) => like.profileId === currentUserProfile.id);

  return (
    <>
      <main className="relative min-h-screen pb-5 md:pt-10">

        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              {project.image && (
                <section className="fade-in-up">
                  <div className="overflow-hidden rounded-xl border border-border bg-card/60 shadow-xl backdrop-blur-sm">
                    <Image
                      src={project.image}
                      alt={project.title}
                      width={1920}
                      height={1080}
                      className="w-full aspect-video object-contain"
                    />
                  </div>

                  {project.screenshots.length > 1 && (
                    <div className="grid grid-cols-4 gap-4 mt-6">
                      {project.screenshots
                        .slice(0, 4)
                        .map((screenshot, index) => (
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
                              style={{ height: "120px" }}
                            />
                          </div>
                        ))}
                    </div>
                  )}
                </section>
              )}

              <section className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-8 shadow-xl fade-in-up">
                <h2 className="text-xl font-semibold text-foreground mb-6 pb-3 border-b border-border/50">
                  Project Timeline
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex items-start gap-4">
                    <div className="h-12 w-12 rounded-xl bg-green-500/10 flex items-center justify-center flex-shrink-0">
                      <Calendar className="h-5 w-5 text-green-600 dark:text-green-400" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">
                        Start Date
                      </p>
                      <p className="text-base font-semibold text-foreground">
                        {new Date(project.startDate).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </p>
                    </div>
                  </div>

                  {project.endDate && (
                    <div className="flex items-start gap-4">
                      <div className="h-12 w-12 rounded-xl bg-orange-500/10 flex items-center justify-center flex-shrink-0">
                        <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">
                          Expected End
                        </p>
                        <p className="text-base font-semibold text-foreground">
                          {new Date(project.endDate).toLocaleDateString(
                            "en-US",
                            {
                              month: "long",
                              day: "numeric",
                              year: "numeric",
                            }
                          )}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </section>

              <section className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-8 shadow-xl fade-in-up delay-100">
                <h2 className="text-2xl font-semibold text-foreground mb-6 pb-3 border-b border-border/50">
                  About
                </h2>
                <div className="space-y-6">
                  <div className="prose prose-sm max-w-none">
                    <p className="leading-relaxed text-base text-muted-foreground">
                      {project.about}
                    </p>
                  </div>

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

              {project.contributors.length > 0 && (
                <section className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-8 shadow-xl fade-in-up delay-200">
                  <h2 className="text-xl font-semibold text-foreground mb-6 pb-3 border-b border-border/50">
                    Contributors ({project.contributors.length})
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {project.contributors.map((contributor) => (
                      <Link
                        key={contributor.id}
                        href={`/profile/${contributor.id}`}
                        className="flex items-center gap-4 p-4 rounded-xl transition-all hover:bg-white/5 hover:shadow-md backdrop-blur-sm"
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

            <div className="lg:col-span-1">
              <div className="sticky top-24 space-y-6">
                <div className="bg-card/60 backdrop-blur-sm border border-border rounded-xl shadow-xl fade-in-up">
                  <div className="p-6 border-b border-border/50">
                    <div className="flex items-center justify-between mb-4">
                      <span
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                          project.status === "Completed"
                            ? "bg-green-500/10 text-green-600 dark:text-green-400"
                            : project.status === "Active"
                            ? "bg-blue-500/10 text-blue-600 dark:text-blue-400"
                            : "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                        }`}
                      >
                        {project.status}
                      </span>

                      {isProjectOwner && (
                        <SettingsDropdown project={project} projectId={id} />
                      )}
                    </div>

                    <h1 className="text-xl font-bold text-foreground mb-2 leading-tight">
                      {project.title}
                    </h1>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  <div className="p-6 border-b border-border/50">
                    <div className="flex items-center gap-3">
                      <Link href={`/profile/${project.creator.id}`}>
                        {project.creator.avatar ? (
                          <Image
                            src={project.creator.avatar}
                            alt={project.creator.name}
                            width={48}
                            height={48}
                            className="h-12 w-12 rounded-full border-2 border-border hover:border-primary/50 transition-colors object-contain"
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-full bg-muted border-2 border-border hover:border-primary/50 transition-colors flex items-center justify-center text-foreground font-semibold">
                            {project.creator.name.charAt(0)}
                          </div>
                        )}
                      </Link>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-0.5">
                          Created by
                        </p>
                        <Link
                          href={`/profile/${project.creator.id}`}
                          className="text-sm font-semibold text-foreground hover:text-primary transition-colors truncate block"
                        >
                          {project.creator.name}
                        </Link>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 border-b border-border/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                          <LikeButton
                            projectId={project.id}
                            isInitiallyLiked={isInitiallyLiked}
                            initialLikeCount={project.likes}
                            disabled={!currentUserProfile}
                          />
                        </div>
                        {project.contributors.length > 0 && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Users className="h-6 w-6" />
                            <span className="text-sm font-medium">
                              {project.contributors.length}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="p-6">
                    {isProjectOwner ? (
                      <Link
                        href={`/projects/${project.id}/applications`}
                        className="w-full inline-flex items-center justify-center gap-2 
                          rounded-lg bg-foreground text-background px-4 py-3 
                          text-sm font-semibold hover:opacity-90 transition-all"
                      >
                        <UserRoundCog className="h-4 w-4" />
                        Manage Applications
                      </Link>
                    ) : (
                      project.isActive && (
                        <ApplyButton
                          projectId={project.id}
                          profileId={currentUserProfile?.id}
                          hasApplied={applicationStatus?.hasApplied}
                          applicationStatus={
                            applicationStatus?.applicationStatus
                          }
                          isContributor={applicationStatus?.isContributor}
                        />
                      )
                    )}
                  </div>
                </div>

                
                {(project.liveUrl || project.githubUrl) && (
                  <div className="bg-card/60 backdrop-blur-sm border border-border rounded-xl p-6 shadow-xl fade-in-up delay-100">
                    <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wide">
                      Project Links
                    </h3>
                    <div className="space-y-3">
                      {project.liveUrl && (
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl 
                            bg-background/5 hover:bg-background/15 transition-all
                            border border-border/50 hover:border-border group"
                        >
                          <div className="h-9 w-9 rounded-lg flex items-center justify-center transition-colors">
                            <ExternalLink className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">
                              Live Demo
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              View project
                            </p>
                          </div>
                        </a>
                      )}

                      {project.githubUrl && (
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
                            bg-background/5 hover:bg-background/20 transition-all
                            border border-border/50 hover:border-border group"
                        >
                          <div className="h-9 w-9 rounded-lg flex items-center justify-center transition-colors">
                            <Github className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground">
                              Source Code
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              View on GitHub
                            </p>
                          </div>
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
