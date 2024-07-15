"use server";

import prisma from "@/db";
import { auth } from "@clerk/nextjs/server";
import { Podcast } from "@prisma/client";
import { IPodcastSchema } from "../validations/podcast.validations";
// eslint-disable-next-line camelcase
import { unstable_cache } from "next/cache";

export async function getPodcastById(id: string) {
  try {
    const podcast = await prisma.podcast.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        comment: {
          include: {
            author: true,
          },
        },
        user: {
          include: {
            podcasts: true,
            followers: true,
          },
        },
        group: true,
      },
    });

    return { podcast, error: null };
  } catch (error) {
    console.error("Error returning podcast:", error);
    return { error: "An unexpected error occurred while returning podcast." };
  }
}

export async function incrementPodcastLikes(id: number, increase: boolean) {
  try {
    if (increase === true) {
      const podcast = await prisma.podcast.update({
        where: {
          id,
        },
        data: {
          likes: { increment: 1 },
        },
      });

      return podcast.likes;
    } else {
      const podcast = await prisma.podcast.update({
        where: {
          id,
        },
        data: {
          likes: { decrement: 1 },
        },
      });

      return podcast.likes;
    }
  } catch (error) {
    console.error("Error incrementing podcast likes:", error);
    return {
      error: "An unexpected error occurred while updating podcast likes.",
    };
  }
}
export async function _incrementPodcastViews(id: number) {
  try {
    const podcast = await prisma.podcast.update({
      where: {
        id,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    return podcast.views;
  } catch (error) {
    console.error("Error incrementing podcast views:", error);
    return {
      error: "An unexpected error occurred while updating podcast views.",
    };
  }
}
export const incrementPodcastViews = unstable_cache(
  _incrementPodcastViews,
  ["incrementPodcastViews"],
  {
    tags: ["views"],
    revalidate: 1,
  }
);
export async function getDynamicPodcasts(
  page: number,
  type: "newest" | "popular" | "following",
  pageSize?: number
) {
  if (!page) {
    page = 1;
  }
  if (!pageSize) {
    pageSize = 4;
  }
  try {
    const skip = (page - 1) * pageSize;

    const totalPodcasts = await prisma.podcast.count();
    const totalPages = Math.ceil(totalPodcasts / pageSize!);
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
      const podcasts = await prisma.meetup.findMany({
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
      const newTotal = Math.ceil(podcasts.length / pageSize!);
      return {
        podcasts: podcasts.map((podcast) => ({
          ...podcast,
          commentCount: podcast._count.comment,
        })),
        totalPages: newTotal,
      };
    }
    const podcasts = await prisma.podcast.findMany({
      orderBy: {
        ...(type === "popular" && { likes: "desc" }),
        ...(type === "newest" && { createdAt: "desc" }),
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

    return {
      podcasts: podcasts.map((podcast) => ({
        ...podcast,
        commentCount: podcast._count.comment,
      })),
      totalPages,
    };
  } catch (error) {
    console.error("Error fetching podcasts:", error);
  }
}
export const createPodcast = async (data: IPodcastSchema) => {
  const { userId } = auth();
  const { audio, group, title, tags, image, body, audioTitle } = data;
  try {
    if (data as Partial<Podcast>) {
      const podcast = await prisma.podcast.create({
        data: {
          title,
          image,
          body,
          tags,
          audioTitle,
          user: {
            connect: {
              clerkID: userId as string,
            },
          },
          audio,
          group: {
            connect: {
              id: group.id,
            },
          },
        },
      });
      return podcast as Podcast;
    }
  } catch (error) {
    console.error("Error updating post:", error);
  }
};
export const updatePodcast = async (data: IPodcastSchema, id: number) => {
  try {
    if (data) {
      const podcast = await prisma.podcast.update({
        where: {
          id,
        },
        data: {
          ...data,
          group: {
            connect: {
              id: data.group.id,
            },
          },
        },
      });
      return podcast;
    }
  } catch (error) {
    console.error("Error updating post:", error);
  }
};
export const deletePodcast = async (id: number) => {
  try {
    const podcast = await prisma.podcast.delete({
      where: {
        id,
      },
    });
    return podcast;
  } catch (error) {
    console.error("Error deleting podcast:", error);
  }
};
