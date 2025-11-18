import ProfilePageWrapper from "./_components/ProfilePageWrapper";

interface ProfilePageProps {
  params: Promise<{
    profileId: string;
  }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { profileId } = await params;
  return <ProfilePageWrapper profileId={profileId} />;
}