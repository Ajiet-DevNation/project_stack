import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { z } from "zod";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    // 1. Authenticate the user and ensure they have a profile
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }
    const userProfile = await db.profile.findUnique({
      where: { userId: session.user.id },
    });
    if (!userProfile) {
      return new Response("Profile not found.", { status: 403 });
    }

    // 2. Await and validate the project ID from the URL
    const { projectId } = await params;
    const validatedProjectId = z.string().cuid("Invalid project ID").parse(projectId);

    // 3. Authorization: Verify the user is the project's author
    const project = await db.project.findUnique({ where: { id: validatedProjectId } });
    if (project?.authorId !== userProfile.id) {
        return new Response("You are not the author of this project.", { status: 403 });
    }

    // 4. Fetch all applications for the project
    const applications = await db.application.findMany({
        where: {
            projectId: validatedProjectId,
        },
        include: {
            // Include the applicant's public profile information
            applicant: {
                select: {
                    id: true,
                    name: true,
                    image: true,
                    branch: true,
                    year: true,
                    skills: true,
                }
            }
        }
    });

    return NextResponse.json(applications, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request", { status: 400 });
    }
    console.error("GET /api/projects/[projectId]/applications error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}