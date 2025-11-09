"use client"
import { User } from "lucide-react"
import ProjectCard from "@/components/ProjectCard"
import DemoOne from "@/components/ShaderBackground"
import Link from "next/link"

export default function Home() {
  return (
    <>
      <div className="fixed -z-10 h-full w-screen">
        <DemoOne />
      </div>
      <div className="relative z-0 flex min-h-screen flex-col">
        <div className="p-8 md:p-12">
          <div className="flex flex-col">
            <div className="flex flex-row justify-between items-start">
              <div>
                <h1 className="text-6xl font-bold text-foreground md:text-6xl">
                  Community Projects
                </h1>
                <p className="mt-3 text-lg text-muted-foreground">
                  the projects the community is building
                </p>
              </div>
              
              {/* Profile Icon */}
              <Link
                href="/profile"
                className="flex rounded-full items-center justify-center bg-background/30 p-3 
                          hover:bg-background/50 transition-all 
                          border border-border/40 shadow-sm"
              >
                <User className="w-6 h-6 text-foreground" />
              </Link>
            </div>

            {/* Project Cards */}
            <ProjectCard />
          </div>
        </div>
      </div>
    </>
  )
}