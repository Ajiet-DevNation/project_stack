import { Project as PrismaProject } from "@prisma/client";

export interface Project extends PrismaProject {
  _count?: {
    likes: number;
    comments: number;
    contributors: number;
  };
}

export interface Profile {
  id: string;
  name: string;
  image?: string | null;
  branch?: string;
  year?: string;
  section?: string;
  college?: string;
  bio?: string | null;
  skills: string[];
  projects: Project[];
  userId: string;
}

export interface Contribution {
  id: string;
  project: Project;
}
