// app/(user)/profile/applications/page.tsx
import DemoOne from "@/components/ShaderBackground";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import { getUserApplications } from "../../../../../actions/applications";
import { UserApplications } from "@/app/(user)/projects/_components/UserApplications";

export default async function MyApplicationsPage() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
        redirect("/login");
    }

    const userProfile = await db.profile.findFirst({
        where: {
            user: {
                email: session.user.email,
            },
        },
    });

    if (!userProfile) {
        redirect("/onboarding");
    }

    const applicationsResult = await getUserApplications(userProfile.id);
    const applications = applicationsResult.success ? applicationsResult.data || [] : [];

    return (
        <>
            <div className="fixed -z-10 h-full w-screen">
                <DemoOne />
            </div>

            <main className="relative z-0 min-h-screen pb-20">
                <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-4xl font-serif text-foreground mb-2">My Applications</h1>
                        <p className="text-lg text-muted-foreground">
                            Track the status of your project applications
                        </p>
                    </div>

                    <UserApplications applications={applications} />
                </div>
            </main>
        </>
    );
}