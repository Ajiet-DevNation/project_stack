"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  ExternalLink, 
  Github, 
  Heart, 
  Users, 
  Calendar,
  Eye,
  Code
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export interface Project {
  id: string
  title: string
  description: string
  thumbnail?: string
  liveUrl?: string
  githubLink?: string
  requiredSkills: string[]
  projectStatus: string
  startDate?: string
  endDate?: string
  postedOn: string
  isActive?: boolean
  likes: number
  contributors: number
}

interface ProjectCardProps {
  project: Project
}

export function ProjectCard({ project }: ProjectCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'in progress':
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30'
      case 'planning':
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      default:
        return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  return (
    <Card className="border border-border/20 bg-background/20 backdrop-blur-sm hover:bg-background/30 transition-all duration-300 group h-full flex flex-col">
      <CardHeader className="p-0">
        {project.thumbnail ? (
          <div className="relative h-48 overflow-hidden rounded-t-lg">
            <Image
              src={project.thumbnail}
              alt={project.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <Badge 
              className={`absolute top-3 right-3 ${getStatusColor(project.projectStatus)} backdrop-blur-sm`}
            >
              {project.projectStatus}
            </Badge>
          </div>
        ) : (
          <div className="relative h-48 bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-lg flex items-center justify-center">
            <Code className="w-16 h-16 text-primary/20" />
            <Badge 
              className={`absolute top-3 right-3 ${getStatusColor(project.projectStatus)} backdrop-blur-sm`}
            >
              {project.projectStatus}
            </Badge>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="p-4 space-y-3 flex-1 flex flex-col">
        {/* Title & Description */}
        <div className="flex-1">
          <h3 className="text-base font-semibold text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
            {project.title}
          </h3>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {project.description}
          </p>
        </div>

        {/* Skills */}
        {project.requiredSkills && project.requiredSkills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {project.requiredSkills.slice(0, 3).map((skill) => (
              <Badge 
                key={skill} 
                variant="outline" 
                className="text-xs bg-primary/10 border-primary/20 text-foreground"
              >
                {skill}
              </Badge>
            ))}
            {project.requiredSkills.length > 3 && (
              <Badge variant="outline" className="text-xs bg-muted/20 border-border/20">
                +{project.requiredSkills.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-xs text-muted-foreground pt-2 border-t border-border/20">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Heart className="w-3.5 h-3.5" />
              <span>{project.likes || 0}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              <span>{project.contributors || 0}</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            <span>{formatDate(project.postedOn)}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Link href={`/projects/${project.id}`} className="flex-1">
            <Button size="sm" className="w-full bg-primary/80 hover:bg-primary/90 text-xs">
              <Eye className="w-3 h-3 mr-1" />
              View
            </Button>
          </Link>
          
          {project.liveUrl && (
            <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline" className="bg-background/20 border-border/20">
                <ExternalLink className="w-3 h-3" />
              </Button>
            </a>
          )}
          {project.githubLink && (
            <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
              <Button size="sm" variant="outline" className="bg-background/20 border-border/20">
                <Github className="w-3 h-3" />
              </Button>
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  )
}