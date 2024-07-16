"use server";
import prisma from "@/db";
import { ContentCategoryEnum, ContentMetrics } from "../types.d";
import { incrementPostLikes, incrementPostViews } from "./post.actions";
import {
  incrementPodcastLikes,
  incrementPodcastViews,
} from "./podcast.actions";
import { incrementCommentLikes } from "./comment.actions";
import { incrementMeetupLikes, incrementMeetupViews } from "./meetup.actions";
import { LikedContent } from "./shared.types";
import { unstable_cache as cache, revalidateTag } from "next/cache";
export async function _getTopFiveContent({ userId }: { userId: number }) {
  try {
    const content: ContentMetrics[] = await prisma.$queryRaw`
    WITH comment_counts AS (
        SELECT 'post' AS type, "postId" AS item_id, COUNT(*)::int AS comment_count
        FROM "Comment"
        WHERE "postId" IS NOT NULL
        GROUP BY "postId"
        UNION
        SELECT 'meetup' AS type, "meetupId" AS item_id, COUNT(*)::int AS comment_count
        FROM "Comment"
        WHERE "meetupId" IS NOT NULL
        GROUP BY "meetupId"
        UNION
        SELECT 'podcast' AS type, "podcastId" AS item_id, COUNT(*)::int AS comment_count
        FROM "Comment"
        WHERE "podcastId" IS NOT NULL
        GROUP BY "podcastId"
    )
    SELECT
        p.type,
        COALESCE(cc.comment_count, 0) AS comment_count,
        (p.likes + p.views) AS interactions,
        p.id,
        p.title,
        p.likes,
        p.views,
        p.image
    FROM (
        SELECT 'post' AS type, id, title, likes, views, image
        FROM "Post"
        WHERE "userId" = ${userId}
        UNION
        SELECT 'meetup' AS type, id, title, likes, views, image
        FROM "Meetup"
        WHERE "userId" = ${userId}
        UNION
        SELECT 'podcast' AS type, id, title, likes, views, image
        FROM "Podcast"
        WHERE "userId" = ${userId}
    ) p
    LEFT JOIN comment_counts cc
    ON p.type = cc.type AND p.id = cc.item_id
    ORDER BY interactions DESC
    LIMIT 5;
    `;

    return { content };
  } catch (error) {
    console.error("Error returning top content:", error);
    return {
      error: "An unexpected error occurred while returning top content.",
    };
  }
}
export const getTopFiveContent = cache(_getTopFiveContent, ["TopFive"], {
  tags: ["TopFive", "likes"],
});

export async function likeCheck({
  clerkId,
  contentId,
  contentCategory,
}: {
  clerkId: string;
  contentId: number;
  contentCategory: ContentCategoryEnum;
}) {
  try {
    let uniqueWhere;

    switch (contentCategory) {
      case ContentCategoryEnum.POST:
        uniqueWhere = { clerkId_postId: { clerkId, postId: contentId } };
        break;
      case ContentCategoryEnum.PODCAST:
        uniqueWhere = { clerkId_podcastId: { clerkId, podcastId: contentId } };
        break;
      case ContentCategoryEnum.COMMENT:
        uniqueWhere = { clerkId_commentId: { clerkId, commentId: contentId } };
        break;
      case ContentCategoryEnum.MEETUP:
        uniqueWhere = { clerkId_meetupId: { clerkId, meetupId: contentId } };
        break;
      default:
        throw new Error("Invalid content type");
    }

    const existingLike = await prisma.like.findUnique({
      where: uniqueWhere,
    });
    return {
      liked: !!existingLike,
      message: "Like checked",
      error: null,
    } as LikedContent;
  } catch (error) {
    console.error(error);
    return {
      message: "Error occurred checking liked content",
      error,
      liked: null,
    };
  }
}
export async function likeToggle({
  clerkId,
  contentId,
  contentCategory,
}: {
  clerkId: string;
  contentId: number;
  contentCategory: ContentCategoryEnum;
}) {
  try {
    let uniqueWhere;

    switch (contentCategory) {
      case ContentCategoryEnum.POST:
        uniqueWhere = { clerkId_postId: { clerkId, postId: contentId } };
        break;
      case ContentCategoryEnum.PODCAST:
        uniqueWhere = { clerkId_podcastId: { clerkId, podcastId: contentId } };
        break;
      case ContentCategoryEnum.COMMENT:
        uniqueWhere = { clerkId_commentId: { clerkId, commentId: contentId } };
        break;
      case ContentCategoryEnum.MEETUP:
        uniqueWhere = { clerkId_meetupId: { clerkId, meetupId: contentId } };
        break;
      default:
        throw new Error("Invalid content type");
    }

    const existingLike = await prisma.like.findUnique({
      where: uniqueWhere,
    });

    if (existingLike) {
      let likes;
      await prisma.like.delete({
        where: { id: existingLike.id },
      });
      switch (contentCategory) {
        case ContentCategoryEnum.POST:
          likes = await incrementPostLikes(contentId, false);
          break;
        case ContentCategoryEnum.PODCAST:
          likes = await incrementPodcastLikes(contentId, false);
          break;
        case ContentCategoryEnum.COMMENT:
          likes = await incrementCommentLikes(contentId, false);
          break;
        case ContentCategoryEnum.MEETUP:
          likes = await incrementMeetupLikes(contentId, false);
          break;
        default:
          throw new Error("Invalid content type");
      }

      revalidateTag("likes");
      return {
        liked: false,
        message: "Post Unliked",
        error: null,
        contentCategory,
        likes,
      } as LikedContent;
    } else {
      const newLike = await prisma.like.create({
        data: {
          clerkId,
          ...(contentCategory === ContentCategoryEnum.POST && {
            postId: contentId,
          }),
          ...(contentCategory === ContentCategoryEnum.PODCAST && {
            podcastId: contentId,
          }),
          ...(contentCategory === ContentCategoryEnum.COMMENT && {
            commentId: contentId,
          }),
          ...(contentCategory === ContentCategoryEnum.MEETUP && {
            meetupId: contentId,
          }),
        },
      });

      if (newLike) {
        let likes;
        switch (contentCategory) {
          case ContentCategoryEnum.POST:
            likes = await incrementPostLikes(contentId, true);
            break;
          case ContentCategoryEnum.PODCAST:
            likes = await incrementPodcastLikes(contentId, true);
            break;
          case ContentCategoryEnum.COMMENT:
            likes = await incrementCommentLikes(contentId, true);
            break;
          case ContentCategoryEnum.MEETUP:
            likes = await incrementMeetupLikes(contentId, true);
            break;
          default:
            throw new Error("Invalid content type");
        }

        revalidateTag("likes");
        return {
          liked: true,
          message: "Post Liked",
          error: null,
          contentCategory,
          likes,
        } as LikedContent;
      }

      revalidateTag("likes");
      return { liked: false, message: "Error creating like", error: null };
    }
  } catch (error) {
    console.error(error);
    return { liked: null, message: `${error}`, error };
  }
}
export async function updateContentLikes({
  id,
  increase,
  contentCategory,
}: {
  id: number;
  increase: boolean;
  contentCategory: ContentCategoryEnum;
}) {
  try {
    switch (contentCategory) {
      case ContentCategoryEnum.POST:
        return incrementPostLikes(id, increase);
      case ContentCategoryEnum.PODCAST:
        return incrementPodcastLikes(id, increase);
      case ContentCategoryEnum.COMMENT:
        return incrementCommentLikes(id, increase);
      default:
        throw new Error("Invalid content type");
    }
  } catch (error) {
    console.error(error);
    return {
      message: "Error updating content likes",
      error,
    };
  }
}
export const incrementViews = async ({
  id,
  contentType,
}: {
  id: number;
  contentType: string;
}) => {
  try {
    let updatedContent;
    switch (contentType) {
      case "post":
        updatedContent = await incrementPostViews(id);
        revalidateTag("views");
        break;
      case "podcast":
        updatedContent = await incrementPodcastViews(id);
        revalidateTag("views");
        break;
      case "meetup":
        updatedContent = await incrementMeetupViews(id);
        revalidateTag("views");
        break;
      default:
        throw new Error("Invalid content type");
    }
    console.log(updatedContent);
    return updatedContent;
  } catch (error) {
    console.error("Error incrementing views:", error);
    throw error;
  }
};
