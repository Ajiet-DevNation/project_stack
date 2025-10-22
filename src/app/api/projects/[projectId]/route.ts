import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { z } from "zod";
import { projectSchema } from "../route";
import { NextResponse } from "next/server";

const updateProjectSchema = projectSchema.partial();

export async function GET(
  req: Request,
  { params }: { params: { projectId: string } }
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
  { params }: { params: { projectId: string } }
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

export async function DELETE(
  req: Request,
  { params }: { params: { projectId: string } }
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

    await db.project.delete({ where: { id: validatedProjectId } });
    return new Response(null, { status: 204 });
  } catch (error) {
    const err = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ err }, { status: 500 });
  }
}