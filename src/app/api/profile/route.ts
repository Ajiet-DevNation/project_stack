import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { z } from "zod";

// Zod schema to validate the incoming profile data
export const profileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  branch: z.string().min(1, "Branch is required"),
  year: z.string().min(1, "Year is required"),
  section: z.string().min(1, "Section is required"),
  skills: z.array(z.string()).nonempty("At least one skill is required"),
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
    const parsedData = profileSchema.parse(body);

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