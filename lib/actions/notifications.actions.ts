"use server";

import { prisma } from "@/db";
import { auth } from "@clerk/nextjs/server";
import { Notification, NotificationType } from "@prisma/client";
import { NotificationWithActionByAndPost } from "../types.d";

export async function createNotification(data: {
  type: NotificationType;
  ownerId?: number;
  postId?: number;
}) {
  const { userId } = auth();
  if (!userId) return { message: "No Logged In User" };
  try {
    const { ownerId, type, postId } = data;

    const dataToSend = {
      owner: {
        connect: { id: ownerId },
      },
      actionBy: {
        connect: { clerkID: userId },
      },
      type,
      ...(data.type !== NotificationType.follow && {
        post: {
          connect: { id: postId },
        },
      }),
      read: false,
    };

    const notification = await prisma.notification.create({
      data: dataToSend,
    });

    return { notification, error: null };
  } catch (error) {
    console.error("Error creating notification:", error);
    return {
      error: "An unexpected error occurred while creating notification.",
    };
  }
}

export async function getNotifications(
  showRecent: "showRecent",
  userId: string,
  notificationsToAdd: number
) {
  if (!userId) return { message: "No Logged In User" };

  try {
    const notifications = await prisma.user.findUnique({
      where: {
        clerkID: userId,
      },
      select: {
        notificationsReceived: {
          orderBy: [{ createdAt: "desc" }],
          ...(showRecent === "showRecent" && {
            take: notificationsToAdd,
          }),
          include: {
            post: true,
            actionBy: true,
          },
        },
      },
    });

    if (notifications && notifications.notificationsReceived.length > 0) {
      const { _count: totalNotifications } =
        (await prisma.notification.aggregate({
          _count: true,
          where: {
            ownerId: notifications?.notificationsReceived[0].ownerId,
          },
        })) as any;

      return {
        notifications: notifications.notificationsReceived,
        totalNotifications,
        error: null,
      };
    }
  } catch (error) {
    console.error("Error returning notifications:", error);
    return {
      error: "An unexpected error occurred while returning notifications.",
    };
  }
}

export async function updateNotifications(
  data: NotificationWithActionByAndPost[]
) {
  const { userId } = auth();
  if (!userId) return { message: "No Logged In User" };

  try {
    const updatedNotifications = await prisma.notification.updateMany({
      where: {
        id: {
          in: data.map((notification: Notification) => notification.id),
        },
      },
      data: {
        read: true,
      },
    });

    return { updatedNotifications, error: null };
  } catch (error) {
    console.error("Error updating notifications:", error);
    return {
      error: "An unexpected error occurred while updating notifications.",
    };
  }
}
