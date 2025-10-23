// import { getServerSession } from "next-auth"
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"
// import { redirect } from "next/navigation"
import ProfilePageWrapper from "./[profileId]/_components/ProfilePageWrapper";

export default async function ProfilePage() {
  // Uncomment when implementing auth
  // const session = await getServerSession(authOptions)
  // if (!session?.user?.id) {
  //   redirect("/auth/signin")
  // }

  // Get user's profile ID from session
  // const userProfile = await db.profile.findUnique({
  //   where: { userId: session.user.id }
  // })
  
  // if (!userProfile) {
  //   redirect("/onboarding")
  // }

  // For demo, use demo profile ID
  const currentUserProfileId = "profile123"

  return <ProfilePageWrapper profileId={currentUserProfileId} />
}