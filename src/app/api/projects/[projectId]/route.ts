import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { z } from "zod";
import { projectSchema } from "@/lib/validations/project";
import { NextRequest, NextResponse } from "next/server";
const updateProjectSchema = projectSchema.partial();
import { createNotification } from "../../../../../actions/notifications";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const { projectId } = await params;

    const validatedProjectId = z.string().cuid().parse(projectId);
    const project = await db.project.findUnique({
      where: { id: validatedProjectId },
      // --- UPDATED INCLUDE BLOCK ---
      include: {
        author: true, // Gets the full author profile
        likes: {
          select: { profileId: true }, // Gets who liked it
        },
        comments: {
          include: {
            author: { // Gets the author of each comment
              select: { id: true, name: true, image: true },
            },
          },
        },
        contributors: {
          include: {
            user: { // 'user' is the relation name to the Profile
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
      // --- END OF UPDATED BLOCK ---
    });

    if (!project) return new Response("Project not found", { status: 404 });
    return new Response(JSON.stringify(project));
  } catch (error) {
    const err = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ err }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id)
      return new Response("Unauthorized", { status: 401 });

    const { projectId } = await params;
    const validatedProjectId = z.string().cuid().parse(projectId);

    const userProfile = await db.profile.findUnique({
      where: { userId: session.user.id },
    });
    const project = await db.project.findFirst({
      where: { id: validatedProjectId, authorId: userProfile?.id },
    });

    if (!project) return new Response("Forbidden", { status: 403 });

    const body = await req.json();
    const parsedData = updateProjectSchema.parse(body);

    const updatedProject = await db.project.update({
      where: { id: validatedProjectId },
      data: parsedData,
    });
    return new Response(JSON.stringify(updatedProject));
  } catch (error) {
    const err = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ err }, { status: 500 });
  }
}

// app/api/projects/[id]/route.ts


export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userProfile = await db.profile.findFirst({
      where: {
        user: {
          email: session.user.email,
        },
      },
    });

    if (!userProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const { projectId } = await params;

    // Get project with applicants and contributors
    const project = await db.project.findUnique({
      where: { id: projectId },
      include: {
        applicants: {
          include: {
            applicant: true,
          },
        },
        contributors: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    if (project.authorId !== userProfile.id) {
      return NextResponse.json(
        { error: "Only project author can delete this project" },
        { status: 403 }
      );
    }

    // Get unique profile IDs (applicants and contributors)
    const applicantIds = project.applicants.map((a) => a.profileId);
    const contributorIds = project.contributors.map((c) => c.profileId);
    const allAffectedUserIds = [...new Set([...applicantIds, ...contributorIds])];

    // Create notifications for all affected users
    const notificationPromises = allAffectedUserIds.map((profileId) =>
      createNotification({
        recipientId: profileId,
        message: `The project "${project.title}" has been deleted by its owner`,
        type: "PROJECT_DELETED",
        projectId: undefined,
      })
    );

    await Promise.all(notificationPromises);

    // Delete the project (cascade will handle related records)
    await db.project.delete({
      where: { id: projectId },
    });

    return NextResponse.json(
      { message: "Project deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting project:", error);
    return NextResponse.json(
      { error: "Failed to delete project" },
      { status: 500 }
    );
  }
}