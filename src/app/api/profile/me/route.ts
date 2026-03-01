import { db } from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { z } from "zod"

export async function GET(req: Request) {
  try {
    // 1. Authenticate the user
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 })
    }

    // 2. Fetch the current user's profile with projects
    const profile = await db.profile.findUnique({
      where: {
        userId: session.user.id,
      },
      include: {
        projects: {
          orderBy: { postedOn: "desc" },
        },
      },
    })

    // 3. Handle the case where the profile is not found
    if (!profile) {
      return new Response(JSON.stringify({ message: "Profile not found" }), { status: 404 })
    }

    // 2b. Fetch projects with their counts separately
    const projectsWithCounts = await db.project.findMany({
      where: { authorId: profile.id },
      orderBy: { postedOn: "desc" },
      include: {
        _count: {
          select: {
            likes: true,
            contributors: true,
          },
        },
      },
    })
    profile.projects = projectsWithCounts as any

    return new Response(JSON.stringify(profile), { status: 200 })
  } catch (error) {
    console.error("GET /api/profile/me error:", error)
    return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 })
  }
}

// This allows partial updates without strict field requirements
const updateProfileSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters").optional(),
    section: z.string().min(1, "Section is required").optional(),
    branch: z.string().min(2, "Branch is required").optional(),
    year: z.string().min(1, "Year is required").optional(),
    college: z.string().min(2, "College is required").optional(),
    bio: z.string().max(300, "Bio must be less than 300 characters").optional(),
    image: z.string().url("Invalid image URL").optional().or(z.literal("")).or(z.literal(null)),
    skills: z.array(z.string().min(1)).optional(),
  })
  .passthrough()

type UpdateProfileData = z.infer<typeof updateProfileSchema>

export async function PUT(req: Request) {
  try {
    // 1. Authenticate the user
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 })
    }

    // 2. Validate the incoming request body
    const body = await req.json()
    console.log("Received update data:", body)

    const parsedData = updateProfileSchema.parse(body)
    console.log("Parsed data after validation:", parsedData)

    // 3. Clean up the data before updating
    const updateData: UpdateProfileData = { ...parsedData }

    if (!updateData.image || updateData.image === "" || updateData.image === null) {
      delete updateData.image
    }

    console.log("Final data to update:", updateData)

    // 4. Update the user's profile in the database
    // The 'where' clause ensures users can ONLY update their own profile
    const updatedProfile = await db.profile.update({
      where: {
        userId: session.user.id,
      },
      data: updateData,
    })

    // 5. Fetch the updated profile with projects
    const profileWithCounts = await db.profile.findUnique({
      where: {
        userId: session.user.id,
      },
      include: {
        projects: {
          orderBy: { postedOn: "desc" },
        },
      },
    })

    // 5b. Fetch projects with their counts separately
    if (profileWithCounts) {
      const projectsWithCounts = await db.project.findMany({
        where: { authorId: profileWithCounts.id },
        orderBy: { postedOn: "desc" },
        include: {
          _count: {
            select: {
              likes: true,
              contributors: true,
            },
          },
        },
      })
      profileWithCounts.projects = projectsWithCounts as any
    }

    console.log("Profile updated successfully:", updatedProfile)
    return new Response(JSON.stringify(profileWithCounts), { status: 200 })
  } catch (error) {
    console.error("PUT /api/profile/me error:", error)

    if (error instanceof z.ZodError) {
      console.error("Validation errors:", error.issues)
      return new Response(
        JSON.stringify({
          message: "Validation failed",
          errors: error.issues,
        }),
        { status: 400 },
      )
    }

    return new Response(JSON.stringify({ message: "Internal Server Error" }), { status: 500 })
  }
}
