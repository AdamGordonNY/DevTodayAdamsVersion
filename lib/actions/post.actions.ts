"use server";

import prisma from "@/db";
import { auth } from "@clerk/nextjs/server";
// eslint-disable-next-line camelcase
import { revalidateTag, unstable_cache } from "next/cache";
import { Post } from "@prisma/client";
import { IPostSchema } from "../validations/post.validations";

export async function createPost(data: any) {
  const { userId } = auth();

  try {
    if (data as Post) {
      const post = await prisma.post.create({
        data: {
          ...data,
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
      revalidateTag("User");
      revalidateTag("Group");
      revalidateTag("getPostById");
      return { post, error: null };
    }
  } catch (error) {
    console.error("Error creating post:", error);
    return { error: "An unexpected error occurred while creating post." };
  }
  return { error: "An unexpected error occurred while creating post." };
}

export async function updatePost(data: IPostSchema, postId: number) {
  try {
    if (data) {
      const post = await prisma.post.update({
        where: {
          id: postId,
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

      revalidateTag("getPostById");
      revalidateTag("User");
      return { post, error: null };
    }
  } catch (error) {
    console.error("Error updating post:", error);
    return { error: "An unexpected error occurred while updating post." };
  }
}

export async function _getPostById(id: string) {
  try {
    const post = await prisma.post.findUnique({
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
            posts: true,
            followers: true,
          },
        },
        group: true,
      },
    });

    return { post, error: null };
  } catch (error) {
    console.error("Error returning post:", error);
    return { error: "An unexpected error occurred while returning post." };
  }
}

export const getPostById = unstable_cache(_getPostById, ["_getPostById"], {
  tags: ["getPostById", "commentPages", "likes"],
  revalidate: 1,
});

export async function likePost(postId: number) {
  try {
    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        likes: {
          increment: 1, // Increment the likes count by 1
        },
      },
    });
    return post;
  } catch (error) {
    console.error("Error liking post:", error);
    throw new Error("Could not like the post.");
  }
}
export async function unlikePost(postId: number) {
  try {
    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        likes: {
          decrement: 1, // Decrement the likes count by 1
        },
      },
    });

    // Ensure likes count does not go below 0
    if (post.likes < 0) {
      await prisma.post.update({
        where: { id: postId },
        data: { likes: 0 },
      });
    }

    return post;
  } catch (error) {
    console.error("Error unliking post:", error);
    throw new Error("Could not unlike the post.");
  }
}

export async function deletePost(id: number) {
  try {
    const post = await prisma.post.delete({
      where: {
        id,
      },
    });

    return post;
  } catch (error) {
    console.error("Error deleting post:", error);
    throw new Error("An unexpected error occurred while deleting post.");
  }
}
export async function incrementPostLikes(postId: number, increase: boolean) {
  if (!postId) {
    throw new Error("Post ID is required.");
  }

  try {
    if (increase === true) {
      const post = await prisma.post.update({
        where: { id: postId },
        data: {
          likes: {
            increment: 1,
          },
        },
      });
      return post.likes;
    } else {
      const post = await prisma.post.update({
        where: { id: postId },
        data: {
          likes: {
            decrement: 1,
          },
        },
      });
      return post.likes;
    }
  } catch (error) {
    console.error("Error incrementing post likes:", error);
    throw new Error(
      "An unexpected error occurred while incrementing post likes."
    );
  }
}
export async function _incrementPostViews(postId: number) {
  if (!postId) {
    throw new Error("Post ID is required.");
  }

  try {
    const post = await prisma.post.update({
      where: { id: postId },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    return post.views;
  } catch (error) {
    console.error("Error incrementing post views:", error);
    throw new Error(
      "An unexpected error occurred while incrementing post views."
    );
  }
}
export const incrementPostViews = unstable_cache(
  _incrementPostViews,
  ["incrementPostViews"],
  {
    tags: ["views"],
    revalidate: 1,
  }
);
export async function getDynamicPosts(
  page: number,
  type: "newest" | "popular" | "following" | "joined",
  pageSize: number
) {
  if (!type) type = "newest";
  try {
    const skip = (page - 1) * pageSize;

    const totalPosts = await prisma.post.count();
    const totalPages = Math.ceil(totalPosts / pageSize);
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
      if (followingIds?.length === 0) {
        return {
          error: "No Followers",
          message: "You are not following anyone.",
        };
      }
      const mostRecentPosts = await prisma.post.findMany({
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
            select: { username: true, image: true, createdAt: true, id: true },
          },
        },
      });
      const newTotal = Math.ceil(mostRecentPosts.length / pageSize);

      return {
        posts: mostRecentPosts.map((post) => ({
          ...post,
          commentCount: post._count.comment,
        })),
        totalPages: newTotal,
      };
    }

    const mostRecentPosts = await prisma.post.findMany({
      orderBy: {
        ...(type === "popular" && { likes: "desc" }),
        ...(type === "newest" && { createdAt: "desc" }),
      },
      skip,
      take: pageSize,
      include: {
        _count: { select: { comment: true } },
        user: {
          select: { username: true, image: true, createdAt: true, id: true },
        },
      },
    });
    return {
      posts: mostRecentPosts.map((post) => ({
        ...post,
        commentCount: post._count.comment,
      })),
      totalPages,
    };
  } catch (error) {
    console.error("Error fetching recent posts:", error);
    return {
      message: "An unexpected error occurred while fetching recent posts.",
    };
  }
}
// export const getRecentPosts = unstable_cache(_getRecentPosts, ["Post"], {
//   tags: ["Post"],
// });
