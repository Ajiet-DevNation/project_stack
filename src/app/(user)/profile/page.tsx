import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { redirect } from "next/navigation"
import ProfilePageWrapper from "./[profileId]/_components/ProfilePageWrapper";
import { db } from "@/lib/prisma";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect("/")
  }

  // Fetch the profile ID from the user ID
  const profile = await db.profile.findUnique({
    where: { userId: session.user.id },
    select: { id: true }
  });

  if (!profile) {
    redirect("/onboarding") // Redirect if no profile exists
  }

  return <ProfilePageWrapper profileId={profile.id} />
}