import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { profileSchema } from "../route"; 
import { z } from "zod";

// Create an update schema where all fields are optional
const updateProfileSchema = profileSchema.partial();

export async function PUT(req: Request) {
  try {
    // 1. Authenticate the user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    // 2. Validate the incoming request body
    const body = await req.json();
    const parsedData = updateProfileSchema.parse(body);

    // 3. Update the user's profile in the database
    // The 'where' clause ensures users can ONLY update their own profile
    const updatedProfile = await db.profile.update({
      where: {
        userId: session.user.id,
      },
      data: parsedData,
    });

    return new Response(JSON.stringify(updatedProfile), { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(JSON.stringify(error.issues), { status: 400 });
    }
    console.error("PUT /api/profile/me error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}