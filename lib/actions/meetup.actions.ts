"use server";

import prisma from "@/db";
import { auth } from "@clerk/nextjs/server";
// eslint-disable-next-line camelcase
import { revalidateTag, unstable_cache } from "next/cache";
import { Meetup } from "@prisma/client";
import { IMeetupSchema } from "../validations/meetup.validations";

export async function createMeetup(data: any) {
  const { userId } = auth();

  try {
    if (data as Meetup) {
      const { location, ...rest } = data;

      const meetup = await prisma.meetup.create({
        data: {
          ...rest,
          address: data.location.address,
          latitude: data.location.lat,
          longitude: data.location.lng,
          user: {
            connect: {
              clerkID: userId as string,
            },
          },
          group: {
            connect: {
              id: data.group.id,
            },
          },
        },
      });
      return { meetup, error: null };
    }
  } catch (error) {
    console.error("Error creating meetup:", error);
    return { error: "An unexpected error occurred while creating meetup." };
  }
  return { error: "An unexpected error occurred while creating meetup." };
}

export async function updateMeetup(data: IMeetupSchema, meetupId: number) {
  try {
    if (data) {
      const { location, ...rest } = data;

      const meetup = await prisma.meetup.update({
        where: {
          id: meetupId,
        },
        data: {
          ...rest,
          address: data.location.address,
          latitude: data.location.lat,
          longitude: data.location.lng,

          group: {
            connect: {
              id: data.group.id,
            },
          },
        },
      });

      revalidateTag("getMeetupById");
      return { meetup, error: null };
    }
  } catch (error) {
    console.error("Error updating meetup:", error);
    return { error: "An unexpected error occurred while updating meetup." };
  }
}

export async function _getMeetupById(id: string) {
  try {
    const meetup = await prisma.meetup.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        comment: {
          take: 4,
          orderBy: { createdAt: "desc" },
          include: {
            author: true,
          },
        },
        user: {
          include: {
            meetups: true,
            followers: true,
          },
        },
        group: true,
      },
    });

    return { meetup, error: null };
  } catch (error) {
    console.error("Error returning meetup:", error);
    return { error: "An unexpected error occurred while returning meetup." };
  }
}

export const getMeetupById = unstable_cache(
  _getMeetupById,
  ["_getMeetupById"],
  {
    tags: ["getMeetupById", "commentPages", "likes"],
    revalidate: 1,
  }
);

export async function deleteMeetup(id: number) {
  try {
    const meetup = await prisma.meetup.delete({
      where: {
        id,
      },
    });

    return meetup;
  } catch (error) {
    console.error("Error deleting meetup:", error);
    throw new Error("An unexpected error occurred while deleting meetup.");
  }
}

export async function getDynamicMeetups(
  page: number,
  type: "newest" | "popular" | "following",
  pageSize?: number
) {
  try {
    const skip = (page - 1) * pageSize!;
    const totalMeetups = await prisma.meetup.count();
    const totalPages = Math.ceil(totalMeetups / pageSize!);
    if (type === "following") {
      const user = await prisma.user.findUnique({
        where: {
          clerkID: auth().userId!,
        },
        include: {
          following: true,
        },
      });
      const followingIds = user?.following.map((follow) => follow.id);
      const mostRecentMeetups = await prisma.meetup.findMany({
        where: {
          userId: {
            in: followingIds,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take: pageSize,
        include: {
          _count: { select: { comment: true } },
          user: {
            select: {
              username: true,
              image: true,
              createdAt: true,
              id: true,
            },
          },
        },
      });
      const newTotal = Math.ceil(mostRecentMeetups.length / pageSize!);

      return {
        meetups: mostRecentMeetups.map((post) => ({
          ...post,
          commentCount: post._count.comment,
        })),
        totalPages: newTotal,
      };
    }
    const meetups = await prisma.meetup.findMany({
      orderBy: {
        ...(type === "popular" && { likes: "desc" }),
        ...(type === "newest" && { createdAt: "desc" }),
      },
      skip,
      take: pageSize || 4,
      include: {
        _count: { select: { comment: true } },
        user: { select: { username: true, image: true, createdAt: true } },
      },
    });

    return {
      meetups: meetups.map((meetup) => ({
        ...meetup,
        commentCount: meetup._count.comment,
      })),
      totalPages,
    };
  } catch (error) {
    console.error("Error fetching meetups:", error);
  }
}
export async function incrementMeetupLikes(id: number, increase: boolean) {
  try {
    if (increase === true) {
      const meetupLike = await prisma.meetup.update({
        where: {
          id,
        },
        data: {
          likes: { increment: 1 },
        },
      });
      return meetupLike.likes;
    } else {
      const meetupLike = await prisma.meetup.update({
        where: {
          id,
        },
        data: {
          likes: { decrement: 1 },
        },
      });
      return meetupLike.likes;
    }
  } catch (error) {
    console.error("Error incrementing meetupLike likes:", error);
    return {
      error: "An unexpected error occurred while incrementing comment likes.",
    };
  }
}
export async function _incrementMeetupViews(id: number) {
  try {
    const meetup = await prisma.meetup.update({
      where: { id },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    return meetup.views;
  } catch (error) {
    console.error("Error incrementing meetup views:", error);
    throw new Error(
      "An unexpected error occurred while incrementing meetup views."
    );
  }
}
export const incrementMeetupViews = unstable_cache(
  _incrementMeetupViews,
  ["incrementMeetupViews"],
  {
    tags: ["views"],
    revalidate: 1,
  }
);
