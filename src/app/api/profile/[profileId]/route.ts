import { db } from "@/lib/prisma";
import { z } from "zod";

export async function GET(
  req: Request,
  { params }: { params: { profileId: string } }
) {
  try {
    const { profileId } = await params;

    const validatedProfileId = z.string().cuid("Invalid profile ID").parse(profileId);

    // 2. Fetch the profile and its associated projects
    const profile = await db.profile.findUnique({
      where: { id: validatedProfileId }, // Use the validated ID
      include: {
        projects: {
          orderBy: { postedOn: "desc" },
        },
      },
    });

    // 3. Handle the case where the profile is not found
    if (!profile) {
      return new Response("Profile not found", { status: 404 });
    }

    return new Response(JSON.stringify(profile), { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request", { status: 400 });
    }
    console.error("GET /api/profile/[profileId] error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}