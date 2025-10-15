import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { z } from "zod";
import { NextResponse } from "next/server";

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
    const validatedProjectId = z
      .string()
      .cuid("Invalid project ID")
      .parse(projectId);

    // 3. Find the user's profile to get their profile ID
    const userProfile = await db.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!userProfile) {
      return new Response("Profile not found. Please complete onboarding.", {
        status: 403,
      });
    }

    // 4. Check if the user has already liked this project
    const existingLike = await db.like.findUnique({
      where: {
        profileId_projectId: {
          profileId: userProfile.id,
          projectId: validatedProjectId,
        },
      },
    });

    // 5. Toggle the like status
    if (existingLike) {
      // If it exists, unlike the project
      await db.like.delete({
        where: { id: existingLike.id },
      });
      return NextResponse.json({ message: "Unliked" }, { status: 200 });
    } else {
      // If it doesn't exist, like the project
      await db.like.create({
        data: {
          profileId: userProfile.id,
          projectId: validatedProjectId,
        },
      });
      return NextResponse.json({ message: "Liked" }, { status: 201 });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.log(error);
      return new Response("Invalid request", { status: 400 });
    }
    console.error("POST /api/projects/[projectId]/like error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
