"use client";

import { ProjectCard as ProjectShowcaseCard } from "@/components/ui/card-7";
import { useEffect, useState, useRef, useCallback } from "react";
import { Code2 } from "lucide-react";
import Loader from "./Loader";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface Project {
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
  isLiked: boolean;
  author: {
    id: string;
    name: string;
    image: string | null;
  };
  _count: {
    likes: number;
    comments: number;
    contributors: number;
  };
}

import { getSkillIcon } from "@/lib/skillIcons";

export default function ProjectCard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const lastProjectRef = useRef<HTMLDivElement | null>(null);
  const { data: session } = useSession();
  const router = useRouter();

  const handleViewProject = useCallback((href: string) => {
    if (!session) {
      router.push("/?login=true");
    } else {
      router.push(href);
    }
  }, [session, router]);

  const fetchProjects = useCallback(async (pageNum: number) => {
    try {
      const response = await fetch(`/api/projects?page=${pageNum}&limit=10`);
      const data: Project[] = await response.json();

      if (data.length < 10) {
        setHasMore(false);
      }

      return data;
    } catch (error) {
      console.error("Failed to fetch projects:", error);
      return [];
    }
  }, []);

  useEffect(() => {
    async function initialFetch() {
      const data = await fetchProjects(1);
      setProjects(data);
      setLoading(false);
    }
    initialFetch();
  }, [fetchProjects]);

  useEffect(() => {
    if (page === 1) return; 

    async function fetchMore() {
      setIsFetchingMore(true);
      const data = await fetchProjects(page);
      setProjects(prev => [...prev, ...data]);
      setIsFetchingMore(false);
    }

    fetchMore();
  }, [page, fetchProjects]);

  useEffect(() => {
    if (loading || !hasMore) return;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isFetchingMore) {
          setPage(prev => prev + 1);
        }
      },
      { threshold: 0.1 }
    );

    const currentObserver = observerRef.current;
    const currentRef = lastProjectRef.current;

    if (currentRef) {
      currentObserver.observe(currentRef);
    }

    return () => {
      if (currentRef && currentObserver) {
        currentObserver.unobserve(currentRef);
      }
    };
  }, [loading, hasMore, isFetchingMore]);

  if (loading) {
    return (
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center p-4">
        <Loader />
      </div>
    );
  }

  return (
    <div className="relative z-0 min-h-screen w-full pt-5 pb-4 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="space-y-6 h-full overflow-y-auto pr-2 pt-2">
          {projects.map((project, index) => (
            <div
              key={project.id}
              ref={index === projects.length - 1 ? lastProjectRef : null}
            >
              <ProjectShowcaseCard
                projectId={project.id}
                title={project.title}
                tagline={`By ${project.author.name}`}
                description={project.description}
                status={project.projectStatus}
                initialLikeCount={project._count.likes}
                isInitiallyLiked={project.isLiked}
                href={`/projects/${project.id}` || "#"}
                githubUrl={project.githubLink || undefined}
                onViewProject={handleViewProject}
                techStack={project.requiredSkills.map((skill) => {
                  const Icon = getSkillIcon(skill) || Code2;
                  return {
                    name: skill,
                    icon: <Icon className="w-5 h-5" />,
                  };
                })}
                aria-label={`Project card for ${project.title}`}
              />
            </div>
          ))}

          {isFetchingMore && (
            <div className="flex justify-center py-8">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {!hasMore && projects.length > 0 && (
            <div className="text-center py-8 text-muted-foreground">
              You&apos;ve reached the end of the list
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
