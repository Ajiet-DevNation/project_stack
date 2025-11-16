"use client";

import { ProjectCard as ProjectShowcaseCard } from "@/components/ui/card-7";
import { useEffect, useState } from "react";
import { Code2 } from "lucide-react";
import Loader from "./Loader";

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

interface ApiResponse {
  projects: Project[];
  total: number;
  limit: number;
  offset: number;
}

// Demo component to showcase the ProjectCard
export default function ProjectCard() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProjects() {
      try {
        const response = await fetch("/api/projects/");
        const data: Project[] = await response.json();
        setProjects(data);
        console.log("projects fetched");
        console.log(projects);
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchProjects();
  });

  if (loading) {
    return (
      <div className="relative z-10 flex min-h-screen w-full items-center justify-center p-4">
        {/* Updated this line to use the theme's foreground color */}
        <Loader />
      </div>
    );
  }

  return (
    <div className="relative z-0 min-h-screen w-full pt-5 pb-4 px-4">
      <div className="max-w-6xl mx-auto">
        {/* <div className="space-y-6 h-[calc(100vh-120px)] overflow-y-auto pr-2"> */}
        <div className="space-y-6 h-full overflow-y-auto pr-2 pt-2">
          {projects.map((project) => (
            
            <ProjectShowcaseCard
              key={project.id}
              title={project.title}
              tagline={`By ${project.author.name}`}
              description={project.description}
              status={project.projectStatus}
              likes={project._count.likes}
              comments={project._count.comments}
              href={`/projects/${project.id}` || "#"}
              githubUrl={project.githubLink || undefined}
              techStack={project.requiredSkills.map((skill) => ({
                name: skill,
                // This is fine, as the icon inherits its color
                // from the text-muted-foreground in the child component.
                icon: <Code2 className="w-5 h-5" />,
              }))}
              aria-label={`Project card for ${project.title}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
