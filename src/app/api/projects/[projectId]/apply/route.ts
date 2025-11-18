import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { z } from "zod";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
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
      return new Response("Profile not found. Please complete onboarding.", { status: 403 });
    }

    // 2. Await and validate the project ID from the URL
    const { projectId } = await params;
    const validatedProjectId = z.string().cuid("Invalid project ID").parse(projectId);

    // 3. Authorization: Prevent users from applying to their own project
    const project = await db.project.findUnique({ where: { id: validatedProjectId } });
    if (project?.authorId === userProfile.id) {
        return new Response("You cannot apply to your own project.", { status: 400 });
    }

    // 4. Prevent duplicate applications
    const existingApplication = await db.application.findUnique({
        where: {
            profileId_projectId: {
                profileId: userProfile.id,
                projectId: validatedProjectId,
            }
        }
    });
    if (existingApplication) {
        return new Response("You have already applied to this project.", { status: 409 });
    }

    // 5. Create the application
    const newApplication = await db.application.create({
      data: {
        projectId: validatedProjectId,
        profileId: userProfile.id,
      },
    });

    return NextResponse.json(newApplication, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request", { status: 400 });
    }
    console.error("POST /api/projects/[projectId]/apply error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}