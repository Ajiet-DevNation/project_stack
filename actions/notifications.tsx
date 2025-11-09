"use server";

import { db } from "@/lib/prisma";

export async function createNotification(data: {
    recipientId: string;
    message: string;
    type: string;
    projectId?: string;
    applicationId?: string;
}) {
    try {
        const notification = await db.notification.create({
            data,
        });
        return { success: true, data: notification };
    } catch (error) {
        console.error("Error creating notification:", error);
        return { success: false, error: "Failed to create notification" };
    }
}

export async function getAllNotifications(profileId: string) {
    try {
        const notifications = await db.notification.findMany({
            where: {
                recipientId: profileId,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 50,
        });
        return { success: true, data: notifications };
    } catch (error) {
        console.error("Error fetching notifications:", error);
        return { success: false, error: "Failed to fetch notifications" };
    }
}

export async function deleteNotification(notificationId: string) {
    try {
        await db.notification.delete({
            where: { id: notificationId },
        });
        return { success: true };
    } catch (error) {
        console.error("Error deleting notification:", error);
        return { success: false, error: "Failed to delete notification" };
    }
}

export async function getNotificationCount(profileId: string) {
    try {
        const count = await db.notification.count({
            where: {
                recipientId: profileId,
            },
        });
        return { success: true, data: count };
    } catch (error) {
        console.error("Error getting notification count:", error);
        return { success: false, error: "Failed to get count" };
    }
}