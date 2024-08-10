"use server";

import { prisma } from "@/db";

import { revalidateTag, unstable_cache as cache } from "next/cache";
import { IUserProfileUpdateSchema } from "../validations/user.validations";

import { Platform, User } from "@prisma/client";

import { auth } from "@clerk/nextjs/server";
export const getLoggedInUser = async () => {
  try {
    const { userId: clerkID } = await auth();
    const user = await prisma.user.findUnique({
      where: { clerkID: clerkID! },
      include: {
        SocialMedia: true,
        followers: true,
        following: true,
        groupRoles: true,
        groups: true,
      },
    });
    if (user?.username === null || user?.username === undefined) {
      const setUserName = user?.email.split("@")[0];
      await prisma.user.update({
        where: { id: user?.id },
        data: {
          username: setUserName,
        },
      });
    }
    return { user: user };
  } catch (error) {
    console.log(error);
    return { error: "There was an error fetching the user." };
  }
};
export const getUser = async (clerkID: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { clerkID },
      include: {
        SocialMedia: true,
        followers: true,
        following: true,
        groupRoles: true,
        groups: true,
      },
    });
    if (user?.username === null || user?.username === undefined) {
      const setUserName = user?.email.split("@")[0];
      await prisma.user.update({
        where: { clerkID },
        data: {
          username: setUserName,
        },
      });
    }
    return user;
  } catch (error) {
    console.log(error);
    return { error: "There was an error fetching the user." };
  }
};

export const editPicture = async (id: number, image: string) => {
  try {
    const user = await prisma.user.update({
      where: { id },
      data: {
        image,
      },
    });
    revalidateTag("User");
    return { user };
  } catch (error) {
    return { error: "There was an error updating the user." };
  }
};

export const editProfile = async (
  id: number,
  data: IUserProfileUpdateSchema
) => {
  const { tech, socialMedia, ...rest } = data;

  try {
    const res = await prisma.user.update({
      where: { id },
      data: {
        ...rest,
        tech,
        SocialMedia: {
          deleteMany: {},
          create: [
            {
              platform: Platform.LinkedIn,
              handle: (socialMedia && socialMedia[0]?.handle) || "",
              link: (socialMedia && socialMedia[0]?.link) || "",
            },
            {
              platform: Platform.Instagram,
              handle: (socialMedia && socialMedia[1]?.handle) || "",
              link: (socialMedia && socialMedia[1]?.link) || "",
            },
            {
              platform: Platform.Twitter,
              handle: (socialMedia && socialMedia[2]?.handle) || "",
              link: (socialMedia && socialMedia[2]?.link) || "",
            },
          ],
        },
      },
      include: {
        SocialMedia: true,
      },
    });
    revalidateTag("User");
    return { res };
  } catch (error) {
    console.log(error);
    return { error: "There was an error updating the user." };
  }
};
export const getUserById = async (slug: number) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: slug },
      include: {
        SocialMedia: true,
        followers: true,
        following: true,
        groupRoles: true,
        groups: true,
      },
    });

    return { user };
  } catch (error) {
    return { error: "There was an error fetching the user." };
  }
};
export const followUser = async (fromClerkID: string, toUserId: number) => {
  // clerk id from auth to grab logged in user for current, followed id will be a number (params)
  try {
    const user = await prisma.user.update({
      where: { clerkID: fromClerkID },
      data: {
        following: {
          connect: {
            id: toUserId,
          },
        },
      },
    });
    revalidateTag("User");
    revalidateTag("getPostById");
    revalidateTag("getGroupById");
    return { user };
  } catch (error) {
    return { error: "There was an error following the user." };
  }
};
export const unfollowUser = async (fromClerkID: string, toUserId: number) => {
  try {
    const user = await prisma.user.update({
      where: { clerkID: fromClerkID },
      data: {
        following: {
          disconnect: {
            id: toUserId,
          },
        },
      },
    });
    revalidateTag("User");
    return { user };
  } catch (error) {
    return { error: "There was an error unfollowing the user." };
  }
};
export const getMostRecentPosts = async (slug: number | string) => {
  try {
    const where = typeof slug === "number" ? { id: slug } : { clerkID: slug };
    const user = await prisma.user.findUnique({
      where,
      include: {
        posts: {
          orderBy: { createdAt: "desc" },
          take: 3,
        },
      },
    });

    if (!user) {
      return { user: null, error: "User not found" };
    }

    return { posts: user.posts, error: null };
  } catch (e) {
    console.error(e);
  }
};
export const _getUserWithContent = async (slug: number | string) => {
  try {
    const where = typeof slug === "number" ? { id: slug } : { clerkID: slug };

    const user = await prisma.user.findUnique({
      where,
      include: {
        posts: {
          orderBy: { createdAt: "asc" },
          take: 3,
          include: { _count: { select: { comment: true } } },
        },
        podcasts: {
          orderBy: { createdAt: "asc" },
          take: 4,
          include: { _count: { select: { comment: true } } },
        },
        meetups: {
          orderBy: { createdAt: "asc" },
          take: 3,
          include: { _count: { select: { comment: true } } },
        },
        groups: {
          select: {
            id: true,
            name: true,
            about: true,
            coverImage: true,
            groupUsers: {
              take: 4,
            },
            createdAt: true,
            _count: { select: { groupUsers: true } },
          },
        },

        SocialMedia: true,
        followers: true,
        following: true,
      },
    });

    if (!user) {
      return { user: null, error: "User not found" };
    }

    return { user, error: null };
  } catch (error) {
    console.error(error);
    return { user: null, error: "There was an error fetching the user." };
  }
};
export const getUserWithContent = cache(
  _getUserWithContent,
  ["getUserWithContent"],
  {
    tags: ["User", "Posts", "Podcasts", "Meetups", "Groups"],
  }
);

export const getUserIdWithClerkID = async () => {
  const { userId: clerkID } = auth();

  if (!clerkID) return { message: "No Logged In User" };
  try {
    const user = await prisma.user.findUnique({
      where: { clerkID },
    });
    const userId = user?.id;

    return { userId, error: null };
  } catch (error) {
    return { error: "There was an error fetching the user." };
  }
};

export const isUserAuthor = async (authorId: number) => {
  const { userId: clerkID } = auth();
  if (!clerkID) return { message: "No Logged In User" };

  try {
    const user = (await getUser(clerkID)) as User;
    const isAuthor = user.id === authorId;

    return { isAuthor, error: null };
  } catch (error) {
    return { error: "There was an error fetching the user." };
  }
};
export const getFollowerCount = async (id: number | string) => {
  try {
    const user = await prisma.user.findUnique({
      where: typeof id === "number" ? { id } : { clerkID: id },
      select: {
        following: true,
      },
    });

    return { followerCount: user?.following.length, error: null };
  } catch (error) {
    return { error: "There was an error fetching the user." };
  }
};
