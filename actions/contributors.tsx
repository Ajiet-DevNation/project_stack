"use server";

import { db } from "@/lib/prisma";

export async function deleteContributor(contributorId: string, authorId: string, projectId: string) {
    try {
        if (!contributorId || !authorId || !projectId) {
            throw new Error("Missing required parameters");
        }

        const project = await db.project.findUnique({
            where: { id: projectId },
            include: { contributors: true }
        });

        if (!project) {
            throw new Error("Project not found");
        }

        if (project.authorId !== authorId) {
            throw new Error("Unauthorized: Only the project author can remove contributors");
        }

        const contributer = project.contributors.find(c => c.id === contributorId);

        if (!contributer) {
            throw new Error("Contributor not found in this project");
        }

        await db.contributor.delete({
            where: { id: contributorId }
        });

        await db.application.delete({
            where: {
                profileId_projectId: {
                    profileId: contributer.profileId,
                    projectId: projectId,
                }
            }
        });

        return { success: true, message: "Contributor removed successfully" };
    } catch (error) {
        console.error('Error removing contributor:', error);
        return {
            success: false,
            message: 'Failed to remove contributor',
        };
    }
}

export async function leaveProject(contributorId: string, userId: string, projectId: string) {
    try {
        if (!contributorId || !userId || !projectId) {
            throw new Error("Missing required parameters");
        }

        const project = await db.project.findUnique({
            where: { id: projectId },
            include: { contributors: true }
        });

        if (!project) throw new Error("Project not found");
        const contributor = project.contributors.find(c => c.id === contributorId);
        if (!contributor) throw new Error("Contributor not found in this project");
        if (contributor?.profileId !== userId) throw new Error("Unauthorized: You can only leave projects you are a contributor of");
        
        await db.contributor.delete({
            where: { id: contributorId }
        });

        await db.application.delete({
            where: {
                profileId_projectId: {
                    profileId: contributor.profileId,
                    projectId: projectId,
                }
            }
        });

        return { success: true, message: "Successfully left the project" };
    } catch (error) {
        console.error('Error leaving project:', error);
        return {
            success: false,
            message: 'Failed to leave project',
        };
    }
}