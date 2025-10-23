import ProfilePageWrapper from "./_components/ProfilePageWrapper";

interface ProfilePageProps {
  params: {
    profileId: string
  }
}

export default function ProfilePage({ params }: ProfilePageProps) {
  return <ProfilePageWrapper profileId={params.profileId} />
}