// app/(user)/projects/[id]/page.tsx
import DemoOne from "@/components/ShaderBackground"
import { ExternalLink, Github, Heart, MessageCircle } from "lucide-react"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { checkApplicationStatus } from '../../../../../actions/applications';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { db } from '@/lib/prisma';
import { ApplyButton } from "../_components/ApplyButton"

interface ProjectPageProps {
  params: { id: string }
}

interface ApiProject {
  id: string
  title: string
  description: string
  requiredSkills: string[]
  startDate: string
  endDate: string
  postedOn: string
  githubLink: string | null
  liveUrl: string | null
  thumbnail: string | null
  projectStatus: 'Planning' | 'Active' | 'Completed'
  isActive: boolean
  authorId: string
  author: {
    id: string
    name: string
    image: string | null
  }
  likes: unknown[]
  comments: unknown[]
  contributors: {
    id: string
    user: {
      id: string
      name: string
      image: string | null
    }
  }[]
  screenshots?: string[]
  videoUrl?: string | null
}

async function getProject(id: string): Promise<ApiProject | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/projects/${id}`, {
      cache: 'no-store'
    })

    if (!response.ok) {
      return null
    }
    return response.json()
  } catch (error) {
    console.error('Failed to fetch project:', error)
    return null
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { id } = await params;
  const apiProject = await getProject(id)
  console.log("isActive:", apiProject?.isActive);

  if (!apiProject) {
    notFound()
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
      const statusResult = await checkApplicationStatus(currentUserProfile.id, id);
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
    contributors: apiProject.contributors.map(c => ({
      id: c.user.id,
      name: c.user.name,
      avatar: c.user.image || undefined,
    })),
  }

  const isProjectOwner = currentUserProfile?.id === apiProject.authorId;
  console.log("Current User Profile:", currentUserProfile);
  console.log("Is Project Owner:", isProjectOwner);
  console.log("Application Status:", applicationStatus);

  return (
    <>
      <div className="fixed -z-10 h-full w-screen">
        <DemoOne />
      </div>

      <main className="relative z-0 min-h-screen pb-20">
        <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-10">
          <div className="w-full px-4 py-4 sm:px-6 lg:px-8">
            <nav>
              <Link href="/home" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                ← Back to Projects
              </Link>
            </nav>
          </div>
        </header>

        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 bg-card/80 backdrop-blur-lg border border-border rounded-xl my-8 shadow-xl fade-in-up">

          <section className="mb-12 fade-in-up delay-100">
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${project.status === "Completed"
                  ? "bg-green-500/20 text-green-600 dark:text-green-400"
                  : project.status === "Active"
                    ? "bg-blue-500/20 text-blue-600 dark:text-blue-400"
                    : "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400"
                  }`}
              >
                {project.status}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
              <div>
                <h1 className="text-4xl font-serif text-foreground mb-3">
                  {project.title}
                </h1>
                <p className="text-lg font-serif text-muted-foreground">
                  {project.description}
                </p>
              </div>

              {isProjectOwner && (
                <Link
                  href={`/projects/${project.id}/applications`}
                  className="self-end sm:self-start mt-2 sm:mt-0
                    inline-flex items-center gap-1.5 
                    rounded-md bg-purple-600 px-4 py-1.5 
                    text-sm font-medium text-white 
                    hover:bg-purple-700 transition-all 
                    shadow-sm hover:shadow-md"
                >
                  Manage
                </Link>
              )}
            </div>
          </section>

          <section className="mb-12 flex flex-wrap items-center justify-between gap-6 fade-in-up delay-200">
            <Link href={`/profile/${project.creator.id}`} className="flex items-center gap-4 group">
              {project.creator.avatar ? (
                <Image
                  src={`${project.creator.avatar}`}
                  alt={project.creator.name}
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full bg-muted border-2 border-border shadow-md"
                />
              ) : (
                <div className="h-12 w-12 rounded-full bg-muted border-2 border-border shadow-md flex items-center justify-center text-muted-foreground font-medium">
                  {project.creator.name.charAt(0)}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-foreground group-hover:underline">{project.creator.name}</p>
                <p className="text-xs text-muted-foreground">Creator</p>
              </div>
            </Link>

            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Heart className="h-4 w-4" />
                <span className="text-sm font-medium">{project.likes}</span>
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <MessageCircle className="h-4 w-4" />
                <span className="text-sm font-medium">{project.comments}</span>
              </div>
            </div>
          </section>

          {project.contributors.length > 0 && (
            <section className="mb-12 fade-in-up delay-300">
              <h2 className="text-2xl font-semibold text-foreground mb-4">Contributors</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {project.contributors.map((contributor) => (
                  <Link
                    key={contributor.id}
                    href={`/profile/${contributor.id}`}
                    className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg shadow-sm transition-colors hover-lift hover:bg-accent hover:border-input"
                  >
                    {contributor.avatar ? (
                      <Image
                        src={contributor.avatar}
                        alt={contributor.name}
                        width={40}
                        height={40}
                        className="h-10 w-10 rounded-full bg-muted border border-border"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-muted border border-border flex items-center justify-center text-muted-foreground font-medium">
                        {contributor.name.charAt(0)}
                      </div>
                    )}
                    <div>
                      <p className="text-sm font-medium text-foreground">{contributor.name}</p>
                      <p className="text-xs text-muted-foreground">Contributor</p>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          <section className="mb-12 fade-in-up delay-400">
            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block rounded-full bg-secondary px-3 py-1 text-sm font-medium text-secondary-foreground"
                >
                  {tag}
                </span>
              ))}
            </div>
          </section>

          {project.image && (
            <section className="mb-12 fade-in-up delay-500">
              <div className="overflow-hidden rounded-xl border border-border bg-card shadow-lg hover-lift">
                <Image
                  src={project.image}
                  alt={project.title}
                  width={800}
                  height={450}
                  className="h-auto w-full object-cover"
                />
              </div>

              {project.screenshots.length > 1 && (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                  {project.screenshots.slice(1).map((screenshot, index) => (
                    <div key={index} className="overflow-hidden rounded-lg border border-border bg-card shadow-md hover-lift">
                      <Image
                        src={screenshot}
                        alt={`${project.title} screenshot ${index + 2}`}
                        width={300}
                        height={200}
                        className="h-auto w-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          <section className="mb-12 fade-in-up delay-600">
            <h2 className="text-2xl font-semibold text-foreground mb-4">About this project</h2>
            <div className="prose prose-sm max-w-none text-muted-foreground">
              <p className="leading-relaxed">{project.about}</p>
            </div>
          </section>

          {(project.liveUrl || project.githubUrl || (project.isActive && currentUserProfile && !isProjectOwner)) && (
            <section className="flex flex-wrap gap-3 fade-in-up delay-700">
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
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-medium text-primary-foreground hover:opacity-90 transition-all shadow-md hover-lift"
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
                  className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-6 py-2.5 font-medium text-foreground hover:bg-accent transition-all shadow-md hover-lift"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                </a>
              )}
            </section>
          )}
        </div>
      </main>
    </>
  )
}