import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { z } from "zod";
import { Prisma } from "@prisma/client";
import { projectSchema } from "@/lib/validations/project";

// POST: Create a new project
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
    const parsedData = projectSchema.parse(body);

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

// GET: Fetch a list of all projects
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    // Pagination
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "10");

    // Filtering & Searching
    const projectStatus = url.searchParams.get("projectStatus");
    const skills = url.searchParams.get("skills");
    const search = url.searchParams.get("search");

    const where: Prisma.ProjectWhereInput = {};

    if (projectStatus) {
      where.projectStatus = projectStatus;
    }
    if (skills) {
      where.requiredSkills = { hasSome: skills.split(',') };
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    const projects = await db.project.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where,
      orderBy: [
        {
          projectStatus: 'asc' as const
        },
        {
          postedOn: 'desc' as const
        }
      ],
      include: {
        author: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
        // Include the count of related records
        _count: {
          select: {
            likes: true,
            comments: true,
            contributors: true,
          },
        },
      },
    });

    // Custom sort to ensure Active > Planning > Completed
    const sortedProjects = projects.sort((a, b) => {
      const statusOrder: Record<string, number> = {
        'Active': 1,
        'Planning': 2,
        'Completed': 3
      };

      const orderA = statusOrder[a.projectStatus] || 999;
      const orderB = statusOrder[b.projectStatus] || 999;

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      // If same status, sort by posted date (newest first)
      return new Date(b.postedOn).getTime() - new Date(a.postedOn).getTime();
    });

    return new Response(JSON.stringify(sortedProjects), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Internal Server Error", { status: 500 });
  }
}