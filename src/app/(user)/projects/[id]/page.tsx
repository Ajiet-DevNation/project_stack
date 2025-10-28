import DemoOne from "@/components/ShaderBackground"
import { ExternalLink, Github, Heart, MessageCircle, UserPlus } from "lucide-react"
import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"

// 1. FIX: params is a plain object in Page Components, not a Promise.
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

  if (!apiProject) {
    notFound()
  }

  // This mapping is 100% correct!
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

  return (
    <>
    {/* Shader Background */}
    <div className="fixed -z-10 h-full w-screen">
      <DemoOne />
    </div>
    
    <main className="relative z-0 min-h-screen pb-20">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-10">
        <div className="w-full px-4 py-4 sm:px-6 lg:px-8">
          <nav>
            {/* 3. Minor Tweak: Use <Link> for client-side navigation */}
            <Link href="/home" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              ← Back to Projects
            </Link>
          </nav>
        </div>
      </header>

      {/* Main content */}
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 bg-card/80 backdrop-blur-lg border border-border rounded-xl my-8 shadow-xl fade-in-up">
        
        {/* Project title section */}
        <section className="mb-12 fade-in-up delay-100">
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              project.status === 'Completed' ? 'bg-green-500/20 text-green-600 dark:text-green-400' :
              project.status === 'Active' ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' :
              'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
            }`}>
              {project.status}
            </span>
          </div>
          <h1 className="text-4xl font-serif text-foreground mb-3">{project.title}</h1>
          <p className="text-lg font-serif text-muted-foreground">{project.description}</p>
        </section>

        {/* Creator Section */}
        <section className="mb-12 flex flex-wrap items-center justify-between gap-6 fade-in-up delay-200">
          <Link href={`/profile/${project.creator.id}`} className="flex items-center gap-4 group">
            {project.creator.avatar ? (
              <Image
                src={project.creator.avatar}
                alt={project.creator.name}
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
          
          {/* Project stats */}
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

        {/* Contributors Section */}
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

        {/* Tags */}
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

        {/* Image */}
        {project.image && (
          <section className="mb-12 fade-in-up delay-500">
            <div className="overflow-hidden rounded-xl border border-border bg-card shadow-lg hover-lift">
              <Image src={project.image} alt={project.title} className="h-auto w-full object-cover" />
            </div>
            
            {project.screenshots.length > 1 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                {project.screenshots.slice(1).map((screenshot, index) => (
                  <div key={index} className="overflow-hidden rounded-lg border border-border bg-card shadow-md hover-lift">
                    <Image src={screenshot} alt={`${project.title} screenshot ${index + 2}`} className="h-auto w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* About */}
        <section className="mb-12 fade-in-up delay-600">
          <h2 className="text-2xl font-semibold text-foreground mb-4">About this project</h2>
          <div className="prose prose-sm max-w-none text-muted-foreground">
            <p className="leading-relaxed">{project.about}</p>
          </div>
        </section>

        {/* Action Buttons */}
        {(project.liveUrl || project.githubUrl || project.isActive) && (
          <section className="flex flex-wrap gap-3 fade-in-up delay-700">
            {project.isActive && (
              <a
                href={`/projects/${project.id}/apply`}
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-2.5 font-medium text-primary-foreground hover:opacity-90 transition-all shadow-md hover-lift"
              >
                <UserPlus className="h-4 w-4" />
                Apply
              </a>
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