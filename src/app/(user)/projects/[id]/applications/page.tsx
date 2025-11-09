import DemoOne from "@/components/ShaderBackground";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApplicationsList } from "../../_components/ApplicationsList";
import { getProjectApplications } from "../../../../../../actions/applications";

interface ApplicationsPageProps {
    params: { id: string };
}

export default async function ApplicationsPage({ params }: ApplicationsPageProps) {
    const { id } = params;
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) redirect("/login");

    const userProfile = await db.profile.findFirst({
        where: { user: { email: session.user.email } },
    });
    if (!userProfile) redirect("/onboarding");

    const project = await db.project.findUnique({ where: { id } });
    if (!project || project.authorId !== userProfile.id) redirect(`/projects/${id}`);

    const applicationsResult = await getProjectApplications(id, userProfile.id);
    const applications = applicationsResult.success ? applicationsResult.data || [] : [];

    const pendingCount = applications.filter((a) => a.status === "Pending").length;
    const acceptedCount = applications.filter((a) => a.status === "Accepted").length;
    const rejectedCount = applications.filter((a) => a.status === "Rejected").length;

    return (
        <>
            <div className="fixed -z-10 h-full w-screen">
                <DemoOne />
            </div>

            <main className="relative z-0 min-h-screen pb-20">
                <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-10">
                    <div className="w-full px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
                        <Link
                            href={`/projects/${id}`}
                            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                        >
                            ← Back to Project
                        </Link>
                    </div>
                </header>

                <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
                    <div className="mb-8">
                        <h1 className="text-4xl font-serif text-foreground mb-2">Applications</h1>
                        <p className="text-lg text-muted-foreground">Manage applications for your project</p>
                    </div>

                    <Tabs defaultValue="all" className="space-y-6">
                        <TabsList className="bg-background/20 backdrop-blur-sm border border-border/20">
                            <TabsTrigger value="all">All ({applications.length})</TabsTrigger>
                            <TabsTrigger value="pending">Pending ({pendingCount})</TabsTrigger>
                            <TabsTrigger value="accepted">Accepted ({acceptedCount})</TabsTrigger>
                            <TabsTrigger value="rejected">Rejected ({rejectedCount})</TabsTrigger>
                        </TabsList>

                        <TabsContent value="all">
                            <ApplicationsList applications={applications} authorId={userProfile.id} />
                        </TabsContent>

                        <TabsContent value="pending">
                            <ApplicationsList
                                applications={applications.filter((a) => a.status === "Pending")}
                                authorId={userProfile.id}
                            />
                        </TabsContent>

                        <TabsContent value="accepted">
                            <ApplicationsList
                                applications={applications.filter((a) => a.status === "Accepted")}
                                authorId={userProfile.id}
                            />
                        </TabsContent>

                        <TabsContent value="rejected">
                            <ApplicationsList
                                applications={applications.filter((a) => a.status === "Rejected")}
                                authorId={userProfile.id}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </>
    );
}
