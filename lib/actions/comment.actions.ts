"use server";

import prisma from "@/db";
import { revalidateTag } from "next/cache";

export async function createComment(data: any) {
  try {
    if (data) {
      const comment = await prisma.comment.create({
        data: {
          body: data.commentText,
          author: {
            connect: {
              id: data.userId,
            },
          },
          ...(data.contentCategory === "Post" && {
            post: {
              connect: { id: data.id },
            },
          }),
          ...(data.contentCategory === "Meetup" && {
            meetup: {
              connect: { id: data.id },
            },
          }),
          ...(data.contentCategory === "Podcast" && {
            podcast: {
              connect: { id: data.id },
            },
          }),
        },
      });

      revalidateTag("commentPages");
      return { comment, error: null };
    }
  } catch (error) {
    console.error("Error creating post:", error);
    return { error: "An unexpected error occurred while creating comment." };
  }
  return { error: "An unexpected error occurred while creating comment." };
}

export async function incrementCommentLikes(id: number, increase: boolean) {
  try {
    if (increase === true) {
      const comment = await prisma.comment.update({
        where: {
          id,
        },
        data: {
          likes: { increment: 1 },
        },
      });
      return comment.likes;
    } else {
      const comment = await prisma.comment.update({
        where: {
          id,
        },
        data: {
          likes: { decrement: 1 },
        },
      });
      return comment.likes;
    }
  } catch (error) {
    console.error("Error incrementing comment likes:", error);
    return {
      error: "An unexpected error occurred while incrementing comment likes.",
    };
  }
}

export async function updateComment(data: any) {
  try {
    if (data) {
      const comment = await prisma.comment.update({
        where: { id: data.id },
        data: {
          updatedAt: new Date(),
          body: data.updatedCommentText,
        },
      });

      revalidateTag("commentPages");
      return { comment, error: null };
    }
  } catch (error) {
    console.error("Error updating comment:", error);
    return { error: "An unexpected error occurred while updating comment." };
  }
}

export async function deleteComment(id: number) {
  try {
    const comment = await prisma.comment.delete({
      where: {
        id,
      },
    });

    revalidateTag("commentPages");
    return comment;
  } catch (error) {
    console.error("Error deleting comment:", error);
    return { error: "An unexpected error occurred while deleting comment." };
  }
}
