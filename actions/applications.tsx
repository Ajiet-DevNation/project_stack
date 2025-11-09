'use server';

import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();


export async function applyToProject(profileId: string, projectId: string) {
    try {
        const existingApplication = await prisma.application.findUnique({
            where: {
                profileId_projectId: {
                    profileId,
                    projectId,
                },
            },
        });

        if (existingApplication) {
            return {
                success: false,
                message: 'You have already applied to this project',
            };
        }

        const existingContributor = await prisma.contributor.findUnique({
            where: {
                profileId_projectId: {
                    profileId,
                    projectId,
                },
            },
        });

        if (existingContributor) {
            return {
                success: false,
                message: 'You are already a contributor to this project',
            };
        }

        const application = await prisma.application.create({
            data: {
                profileId,
                projectId,
                status: 'Pending',
            },
            include: {
                applicant: true,
                project: true,
            },
        });

        revalidatePath(`/projects/${projectId}`);
        revalidatePath('/profile/applications');

        return {
            success: true,
            message: 'Application submitted successfully',
            data: application,
        };
    } catch (error) {
        console.error('Error applying to project:', error);
        return {
            success: false,
            message: 'Failed to submit application',
        };
    }
}

export async function acceptApplication(applicationId: string, authorId: string) {
    try {
        const application = await prisma.application.findUnique({
            where: { id: applicationId },
            include: {
                project: true,
            },
        });

        if (!application) {
            return {
                success: false,
                message: 'Application not found',
            };
        }

        if (application.project.authorId !== authorId) {
            return {
                success: false,
                message: 'Only project author can accept applications',
            };
        }

        if (application.status !== 'Pending') {
            return {
                success: false,
                message: `Application is already ${application.status.toLowerCase()}`,
            };
        }

        const result = await prisma.$transaction(async (tx) => {
            const updatedApplication = await tx.application.update({
                where: { id: applicationId },
                data: { status: 'Accepted' },
            });

            const contributor = await tx.contributor.create({
                data: {
                    profileId: application.profileId,
                    projectId: application.projectId,
                },
            });

            return { updatedApplication, contributor };
        });

        revalidatePath(`/projects/${application.projectId}`);
        revalidatePath(`/projects/${application.projectId}/applications`);

        return {
            success: true,
            message: 'Application accepted and user added as contributor',
            data: result,
        };
    } catch (error) {
        console.error('Error accepting application:', error);
        return {
            success: false,
            message: 'Failed to accept application',
        };
    }
}

export async function rejectApplication(applicationId: string, authorId: string) {
    try {
        const application = await prisma.application.findUnique({
            where: { id: applicationId },
            include: {
                project: true,
            },
        });

        if (!application) {
            return {
                success: false,
                message: 'Application not found',
            };
        }

        if (application.project.authorId !== authorId) {
            return {
                success: false,
                message: 'Only project author can reject applications',
            };
        }

        if (application.status !== 'Pending') {
            return {
                success: false,
                message: `Application is already ${application.status.toLowerCase()}`,
            };
        }

        const updatedApplication = await prisma.application.update({
            where: { id: applicationId },
            data: { status: 'Rejected' },
        });

        revalidatePath(`/projects/${application.projectId}/applications`);

        return {
            success: true,
            message: 'Application rejected',
            data: updatedApplication,
        };
    } catch (error) {
        console.error('Error rejecting application:', error);
        return {
            success: false,
            message: 'Failed to reject application',
        };
    }
}

export async function getProjectApplications(projectId: string, authorId: string) {
    try {
        const project = await prisma.project.findUnique({
            where: { id: projectId },
        });

        if (!project || project.authorId !== authorId) {
            return {
                success: false,
                message: 'Unauthorized or project not found',
            };
        }

        const applications = await prisma.application.findMany({
            where: { projectId },
            include: {
                applicant: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                                image: true,
                            },
                        },
                    },
                },
            },
            orderBy: { appliedAt: 'desc' },
        });

        return {
            success: true,
            data: applications,
        };
    } catch (error) {
        console.error('Error fetching applications:', error);
        return {
            success: false,
            message: 'Failed to fetch applications',
        };
    }
}

export async function getUserApplications(profileId: string) {
    try {
        const applications = await prisma.application.findMany({
            where: { profileId },
            include: {
                project: {
                    include: {
                        author: true,
                    },
                },
            },
            orderBy: { appliedAt: 'desc' },
        });

        return {
            success: true,
            data: applications,
        };
    } catch (error) {
        console.error('Error fetching user applications:', error);
        return {
            success: false,
            message: 'Failed to fetch applications',
        };
    }
}

export async function getProjectContributors(projectId: string) {
    try {
        const contributors = await prisma.contributor.findMany({
            where: { projectId },
            include: {
                user: {
                    include: {
                        user: {
                            select: {
                                name: true,
                                email: true,
                                image: true,
                            },
                        },
                    },
                },
            },
        });

        return {
            success: true,
            data: contributors,
        };
    } catch (error) {
        console.error('Error fetching contributors:', error);
        return {
            success: false,
            message: 'Failed to fetch contributors',
        };
    }
}

export async function getUserContributions(profileId: string) {
    try {
        const contributions = await prisma.contributor.findMany({
            where: { profileId },
            include: {
                project: {
                    include: {
                        author: true,
                    },
                },
            },
        });

        return {
            success: true,
            data: contributions,
        };
    } catch (error) {
        console.error('Error fetching contributions:', error);
        return {
            success: false,
            message: 'Failed to fetch contributions',
        };
    }
}


export async function removeContributor(contributorId: string, authorId: string) {
    try {
        const contributor = await prisma.contributor.findUnique({
            where: { id: contributorId },
            include: {
                project: true,
            },
        });

        if (!contributor) {
            return {
                success: false,
                message: 'Contributor not found',
            };
        }

        if (contributor.project.authorId !== authorId) {
            return {
                success: false,
                message: 'Only project author can remove contributors',
            };
        }

        await prisma.contributor.delete({
            where: { id: contributorId },
        });

        revalidatePath(`/projects/${contributor.projectId}`);

        return {
            success: true,
            message: 'Contributor removed successfully',
        };
    } catch (error) {
        console.error('Error removing contributor:', error);
        return {
            success: false,
            message: 'Failed to remove contributor',
        };
    }
}

export async function checkApplicationStatus(profileId: string, projectId: string) {
    try {
        const application = await prisma.application.findUnique({
            where: {
                profileId_projectId: {
                    profileId,
                    projectId,
                },
            },
        });

        const contributor = await prisma.contributor.findUnique({
            where: {
                profileId_projectId: {
                    profileId,
                    projectId,
                },
            },
        });

        return {
            success: true,
            data: {
                hasApplied: !!application,
                applicationStatus: application?.status,
                isContributor: !!contributor,
            },
        };
    } catch (error) {
        console.error('Error checking application status:', error);
        return {
            success: false,
            message: 'Failed to check application status',
        };
    }
}