import { redirect } from "next/navigation"
// import { getServerSession } from "next-auth"
// import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export default async function MyProfilePage() {
  // Uncomment when implementing auth
  // const session = await getServerSession(authOptions)
  // if (!session?.user?.id) {
  //   redirect("/auth/signin")
  // }

  // For demo, redirect to a demo profile
  redirect("/profile/profile123")
}