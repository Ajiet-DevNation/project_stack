import { db } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { z } from "zod";


export async function DELETE(
  req: Request,
  { params }: { params: { commentId: string } }
) {
  try {
    // 1. Authenticate the user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return new Response("Unauthorized", { status: 401 });
    }

    // 2. Await and validate the comment ID from the URL
    const { commentId } = await params;
    const validatedCommentId = z.string().cuid("Invalid comment ID").parse(commentId);

    // 3. Find the user's profile
    const userProfile = await db.profile.findUnique({
      where: { userId: session.user.id },
    });

    if (!userProfile) {
      return new Response("Profile not found", { status: 403 });
    }

    // 4. Authorization: Verify the user is the author of the comment
    const comment = await db.comment.findFirst({
      where: {
        id: validatedCommentId,
        profileId: userProfile.id, // This ensures ownership
      },
    });

    if (!comment) {
      return new Response("Comment not found or you are not the author", { status: 403 });
    }

    // 5. Delete the comment
    await db.comment.delete({
      where: { id: validatedCommentId },
    });

    return new Response(null, { status: 204 }); // No Content
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request", { status: 400 });
    }
    console.error("DELETE /api/comments/[commentId] error:", error);
    return new Response("Internal Server Error", { status: 500 });
  }
}