import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { z } from "zod";
import { Prisma } from "@prisma/client";

// Zod schema for project creation
export const projectSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  requiredSkills: z.array(z.string()).nonempty(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  githubLink: z.string().url().optional().or(z.literal("")),
  liveUrl: z.string().url().optional().or(z.literal("")),
  thumbnail: z.string().url().optional().or(z.literal("")),
  projectStatus: z.string().min(1),
});

// POST: Create a new project
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Find the user's profile, which is the author
    const userProfile = await db.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!userProfile) {
      return new Response("Profile not found. Please complete onboarding.", { status: 403 });
    }

    const body = await req.json();
    const parsedData = projectSchema.parse(body);

    const newProject = await db.project.create({
      data: {
        ...parsedData,
        // Connect the project to the author's Profile ID
        author: {
          connect: { id: userProfile.id },
        },
      },
    });

    return new Response(JSON.stringify(newProject), { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 400 });
    }
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

// GET: Fetch a list of all projects
export async function GET(req: Request) {
  try {
    // Logic for pagination, filtering, and searching
    const where: Prisma.ProjectWhereInput = { /* ... */ };

    const projects = await db.project.findMany({
      where,
      orderBy: { postedOn: "desc" },
      include: {
        // Include the author's profile information
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    return new Response(JSON.stringify(projects), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}
