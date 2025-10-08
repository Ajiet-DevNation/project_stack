import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { z } from "zod";
import { Prisma } from "@prisma/client";

// Zod schema for validating the incoming request body
export const createProjectSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  requiredSkills: z.array(z.string()).nonempty("At least one skill is required"),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
  githubLink: z.string().url().optional().or(z.literal('')),
  liveUrl: z.string().url().optional().or(z.literal('')),
  thumbnail: z.string().url().optional().or(z.literal('')),
  projectStatus: z.enum(["Planning", "In Progress", "Completed"]),
});

export async function POST(req: Request) {
  try {
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

    const body = await req.json();
    const parsedData = createProjectSchema.parse(body);

    const newProject = await db.project.create({
      data: {
        ...parsedData,
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

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    // ... (filtering logic as before)
    const where: Prisma.ProjectWhereInput = { /* ... */ };

    const projects = await db.project.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where,
      include: {
        author: {
          select: { name: true, image: true },
        },
      },
      orderBy: { postedOn: "desc" },
    });

    return new Response(JSON.stringify(projects), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}