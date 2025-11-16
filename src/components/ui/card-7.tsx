import * as React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  ArrowRight,
  Heart,
  Lightbulb,
  Rocket,
  CheckCircle2,
  MessageCircle,
  Github,
} from "lucide-react";

// Status badge component (Left as-is, these are semantic state colors)
const StatusBadge = ({
  status,
}: {
  status: "Planning" | "Active" | "Completed";
}) => {
  const statusConfig = {
    Planning: {
      icon: Lightbulb,
      color: "text-blue-400",
      bg: "bg-blue-500/20",
      border: "border-blue-400/50",
      textColor: "text-blue-300",
    },
    Active: {
      icon: Rocket,
      color: "text-green-400",
      bg: "bg-green-500/20",
      border: "border-green-400/50",
      textColor: "text-green-300",
    },
    Completed: {
      icon: CheckCircle2,
      color: "text-purple-400",
      bg: "bg-purple-500/20",
      border: "border-purple-400/50",
      textColor: "text-purple-300",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-full border-2",
        config.bg,
        config.border,
        "backdrop-blur-sm" // You can keep this glass effect for the badge
      )}
    >
      <Icon className={cn("h-5 w-5", config.color)} />
      <span className={cn("text-sm font-semibold", config.textColor)}>
        {status}
      </span>
    </div>
  );
};

// Tech stack item type
interface TechStackItem {
  name: string;
  icon: React.ReactNode; // Can be a Lucide icon or an img element
}

// Define the props for the ProjectCard component
interface ProjectCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  tagline: string;
  description: string;
  status: "Planning" | "Active" | "Completed";
  likes: number;
  comments: number;
  href: string;
  githubUrl?: string; // Optional GitHub URL
  techStack?: TechStackItem[]; // Optional tech stack array
}

const ProjectCard = React.forwardRef<HTMLDivElement, ProjectCardProps>(
  (
    {
      className,
      title,
      tagline,
      description,
      status,
      likes,
      comments,
      href,
      githubUrl,
      techStack = [],
      ...props
    },
    ref
  ) => {
    // These status borders are semantic and should override the base border
    const borderColors = {
      Planning: "border-blue-400/50",
      Active: "border-green-400/50",
      Completed: "border-purple-400/50",
    };

    return (
      <div
        ref={ref}
        className={cn(
          "group relative w-full max-w-7xl min-h-[200px] overflow-hidden rounded-xl shadow-lg z-0",
          "bg-card border-2 border-border", // Use border-2 to match StatusBadge
          "transition-all duration-300 ease-in-out hover:shadow-2xl hover:-translate-y-2",
          borderColors[status], // This overrides the 'border-border'
          className
        )}
        {...props}
      >
        {/* Content Container */}
        <div className="relative flex h-full flex-col p-6 text-card-foreground">
          {/* Top Section: Status Badge and GitHub Link */}
          <div className="flex items-start justify-between mb-6">
            <StatusBadge status={status} />
            {githubUrl && (
              <a
                href={githubUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg",
                  "bg-secondary border border-border", // Use secondary colors
                  "hover:bg-accent transition-all duration-200 group/github"
                )}
                title="View on GitHub"
              >
                <Github
                  className={cn(
                    "h-5 w-5 text-secondary-foreground", // Use secondary-foreground
                    "transition-colors"
                  )}
                />
                <span
                  className={cn(
                    "text-xs text-secondary-foreground", // Use secondary-foreground
                    "transition-colors font-medium"
                  )}
                >
                  GitHub
                </span>
              </a>
            )}
          </div>

          {/* Title and Description Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-3xl font-bold text-foreground">{title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{tagline}</p>
            </div>
            <div>
              <h4 className="font-semibold text-foreground text-xs tracking-wide">
                DESCRIPTION
              </h4>
              <p className="text-sm text-muted-foreground leading-relaxed mt-2 line-clamp-2">
                {description}
              </p>
            </div>
          </div>

          {techStack.length > 0 && (
            <div className="transition-all duration-500 ease-in-out opacity-0 max-h-0 overflow-hidden group-hover:opacity-100 group-hover:max-h-96 group-hover:mt-8 group-hover:mb-6">
              <h4 className="font-semibold text-foreground mb-2 text-xs tracking-wide">
                TECH STACK
              </h4>
              <div className="flex flex-wrap gap-3">
                {techStack.map((tech, index) => (
                  <div
                    key={index}
                    className={cn(
                      "group/tech flex items-center gap-2 px-3 py-2 rounded-lg",
                      "bg-muted border border-border", // Use muted background
                      "hover:bg-accent hover:border-input", // Use accent/input for hover
                      "transition-all duration-200"
                    )}
                    title={tech.name}
                  >
                    <div
                      className={cn(
                        "w-5 h-5 flex items-center justify-center",
                        "text-muted-foreground group-hover/tech:text-foreground",
                        "transition-colors"
                      )}
                    >
                      {tech.icon}
                    </div>
                    <span
                      className={cn(
                        "text-xs font-medium",
                        "text-muted-foreground group-hover/tech:text-foreground",
                        "transition-colors"
                      )}
                    >
                      {tech.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Section: Stats and Button (shown on hover) */}
          <div className="pt-6 border-t border-border transition-all duration-500 ease-in-out opacity-0 max-h-0 overflow-hidden group-hover:opacity-100 group-hover:max-h-32">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Heart
                    className="h-5 w-5 text-destructive fill-destructive" // Use destructive red
                  />
                  <span className="text-lg font-bold text-foreground">
                    {likes}
                  </span>
                  <span className="text-muted-foreground text-sm">Likes</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-blue-400" /> {/* No 'info' color, so blue is fine */}
                  <span className="text-lg font-bold text-foreground">
                    {comments}
                  </span>
                  <span className="text-muted-foreground text-sm">Comments</span>
                </div>
              </div>
              <Button
                asChild
                className={cn(
                  "h-11 rounded-md px-8",
                  "bg-primary text-primary-foreground", // Use primary colors
                  "hover:bg-primary/90" // Standard hover for primary
                )}
              >
                <Link href={href}>
                  View Project <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }
);
ProjectCard.displayName = "ProjectCard";

export { ProjectCard };