import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { z } from "zod";
import { NextResponse } from "next/server";

// Zod schema to validate the comment's content
const commentSchema = z.object({
  content: z.string().min(1, "Comment cannot be empty").max(500, "Comment is too long"),
});

export async function POST(
  req: Request,
  { params }: { params: { projectId: string } }
) {
  try {
    // 1. Authenticate the user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    // 2. Await and validate the project ID from the URL
    const { projectId } = await params;
    const validatedProjectId = z.string().cuid("Invalid project ID").parse(projectId);

    // 3. Find the user's profile
    const userProfile = await db.profile.findUnique({
      where: { userId: session.user.id },
    });
    if (!userProfile) {
      return new Response("Profile not found. Please complete onboarding.", { status: 403 });
    }

    // 4. Validate the request body (the comment content)
    const body = await req.json();
    const { content } = commentSchema.parse(body);

    // 5. Create the comment in the database
    const newComment = await db.comment.create({
      data: {
        content,
        projectId: validatedProjectId,
        profileId: userProfile.id, // Link the comment to the user's profile
      },
      include: {
        // Include the author's details in the response for the frontend
        author: {
          select: { name: true, image: true, id: true },
        },
      },
    });

    return NextResponse.json(newComment, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request", { status: 400 });
    }
    console.error("POST /api/projects/[projectId]/comments error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
} 


