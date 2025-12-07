import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { z } from "zod";
import { NextResponse } from "next/server";
import { sections, branches, years } from "@/lib/profileConstants";
import { ALL_PREDEFINED_SKILLS } from "@/lib/skills";

// Zod schema to validate the incoming profile data
const createProfileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  branch: z.enum(branches, { message: "Please select a valid branch." }),
  year: z.enum(years, { message: "Please select a valid year." }),
  section: z.enum(sections, { message: "Please select a valid section from A-Z." }),
  skills: z
    .array(
      z.string().refine((skill) => ALL_PREDEFINED_SKILLS.includes(skill), {
        message: "Invalid skill selected",
      })
    )
    .nonempty("At least one skill is required"),
  bio: z.string().max(250, "Bio must be less than 250 characters").optional(),
  image: z.string().url("Invalid image URL").optional(),
});

export async function POST(req: Request) {
  try {
    // 1. Authenticate the user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    // 2. Check if the user is already onboarded
    const existingProfile = await db.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (existingProfile) {
      return new Response("Profile already exists", { status: 409 }); // 409 Conflict
    }

    // 3. Validate the request body
    const body = await req.json();
    const parsedData = createProfileSchema.parse(body);

    // 4. Create the profile and update the user in a single transaction
    // This ensures both actions succeed or both fail together.
    const newProfile = await db.$transaction(async (prisma) => {
      const createdProfile = await prisma.profile.create({
        data: {
          ...parsedData,
          userId: session.user.id,
        },
      });

      await prisma.user.update({
        where: { id: session.user.id },
        data: { onboarded: true },
      });

      return createdProfile;
    });

    return new Response(JSON.stringify(newProfile), { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 400 });
    }
    console.error("POST /api/profile error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const searchQuery = searchParams.get("search");

  if (searchQuery) {
    try {
      const profiles = await db.profile.findMany({
        where: {
          OR: [
            {
              name: {
                contains: searchQuery,
                mode: "insensitive",
              },
            },
            {
              skills: {
                has: searchQuery,
              },
            },
          ],
        },
        select: {
          id: true,
          name: true,
          skills: true,
          bio: true,
          user: {
            select: {
              name: true,
            },
          },
        },
      });
      return NextResponse.json(profiles);
    } catch (error) {
      console.error("Error searching profiles:", error);
      return NextResponse.json(
        { error: "Failed to search profiles" },
        { status: 500 }
      );
    }
  }

  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const profile = await db.profile.findFirst({
      where: {
        user: {
          email: session.user.email,
        },
      },
      select: {
        id: true,
      },
    });

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({ profileId: profile.id });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}