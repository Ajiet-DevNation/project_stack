import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/authOptions"
import { redirect } from "next/navigation"
import ProfilePageWrapper from "./[profileId]/_components/ProfilePageWrapper";
import { db } from "@/lib/prisma";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect("/")
  }

  const profile = await db.profile.findUnique({
    where: { userId: session.user.id },
    select: { id: true }
  });

  if (!profile) {
    redirect("/onboarding") 
  }

  return <ProfilePageWrapper profileId={profile.id} />
}