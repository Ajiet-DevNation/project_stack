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
    "In-Progress": {
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

  const config = statusConfig[status] || statusConfig.Active; // Fallback to Active if status is invalid
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
  // comments: number;
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
      // comments,
      href,
      githubUrl,
      techStack = [],
      ...props
    },
    ref
  ) => {
    // State for mobile expansion
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [isMobile, setIsMobile] = React.useState(false);

    // Detect mobile screen size
    React.useEffect(() => {
      const checkMobile = () => {
        setIsMobile(window.innerWidth < 1024); // lg breakpoint
      };

      checkMobile();
      window.addEventListener('resize', checkMobile);

      return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Toggle expansion on mobile
    const handleCardClick = (e: React.MouseEvent) => {
      // Don't toggle if clicking on links or buttons
      if (
        isMobile &&
        !(e.target as HTMLElement).closest('a, button')
      ) {
        setIsExpanded(!isExpanded);
      }
    };

    // These status borders are semantic and should override the base border
    const borderColors = {
      Planning: "border-blue-400/50",
      Active: "border-green-400/50",
      "In-Progress": "border-green-400/50",
      Completed: "border-purple-400/50",
    };

    return (
      <div
        ref={ref}
        onClick={handleCardClick}
        className={cn(
          "group relative w-full max-w-7xl min-h-[200px] overflow-hidden rounded-xl shadow-lg z-0",
          "bg-card border-2 border-border",
          "transition-all duration-300 ease-in-out",
          !isMobile && "hover:shadow-2xl hover:-translate-y-2",
          isMobile && "cursor-pointer active:scale-[0.99]",
          borderColors[status],
          className
        )}
        {...props}
      >
        {/* Content Container */}
        <div className="relative flex h-full flex-col p-6 text-card-foreground">
          {/* Mobile Expand Indicator */}
          {isMobile && (
            <div className="absolute top-4 right-4 transition-transform duration-300" style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)" }}>
              <svg className="w-6 h-6 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          )}
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
              <p className="text-sm text-muted-foreground leading-relaxed mt-2 line-clamp-3">
                {description}
              </p>
            </div>
          </div>

          {/* Tech Stack Section (shown on hover for desktop, on click for mobile) */}
          {techStack.length > 0 && (
            <div className={cn(
              "transition-all duration-500 ease-in-out overflow-hidden",
              !isMobile && "opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-96 group-hover:mt-8 group-hover:mb-6",
              isMobile && (isExpanded ? "opacity-100 max-h-96 mt-8 mb-6" : "opacity-0 max-h-0")
            )}>
              <h4 className="font-semibold text-foreground mb-2 text-xs tracking-wide">
                TECH STACK
              </h4>
              <div className="flex flex-wrap gap-3">
                {techStack.filter(tech => tech && tech.name).map((tech, index) => (
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
                      {tech?.icon || null}
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

          {/* Bottom Section: Stats and Button (shown on hover for desktop, on click for mobile) */}
          <div className={cn(
            "pt-6 border-t border-border transition-all duration-500 ease-in-out overflow-hidden",
            !isMobile && "opacity-0 max-h-0 group-hover:opacity-100 group-hover:max-h-32",
            isMobile && (isExpanded ? "opacity-100 max-h-32" : "opacity-0 max-h-0")
          )}>
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
                {/* <div className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5 text-blue-400" /> 
                  <span className="text-lg font-bold text-foreground">
                    {comments}
                  </span>
                  <span className="text-muted-foreground text-sm">Comments</span>
                </div> */}
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