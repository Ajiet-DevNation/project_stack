import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { z } from "zod";
import { NextResponse } from "next/server";

const updateApplicationSchema = z.object({
  status: z.enum(["accepted", "rejected"]),
});

export async function PUT(
  req: Request,
  { params }: { params: { applicationId: string } }
) {
  try {
    // 1. Authenticate the user
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

    // 2. Await and validate the application ID
    const { applicationId } = await params;
    const validatedApplicationId = z.string().cuid().parse(applicationId);
    
    // 3. Validate the request body
    const body = await req.json();
    const { status } = updateApplicationSchema.parse(body);

    // 4. Authorization: Verify user is the author of the project linked to the application
    const application = await db.application.findUnique({
      where: { id: validatedApplicationId },
      include: { project: true }, // Include project to check its author
    });

    if (!application || application.project.authorId !== userProfile.id) {
      return new Response("Application not found or you are not the project author.", { status: 403 });
    }

    // 5. Update the application and potentially create a contributor record
    if (status === "accepted") {
      // Use a transaction to ensure both operations succeed or fail together
      const [updatedApplication] = await db.$transaction([
        db.application.update({
          where: { id: validatedApplicationId },
          data: { status: "accepted" },
        }),
        db.contributor.create({
          data: {
            profileId: application.profileId,
            projectId: application.projectId,
          },
        }),
      ]);
      return NextResponse.json(updatedApplication);
    } else {
      // If rejected, just update the status
      const updatedApplication = await db.application.update({
        where: { id: validatedApplicationId },
        data: { status: "rejected" },
      });
      return NextResponse.json(updatedApplication);
    }

  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request", { status: 400 });
    }
    console.error("PUT /api/applications/[applicationId] error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}