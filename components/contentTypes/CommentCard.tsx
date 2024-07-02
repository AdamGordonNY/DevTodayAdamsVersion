import { format } from "date-fns";
import Image from "next/image";
import { Comment, User } from "@prisma/client";

import { ProfilePlaceholder } from "../ui";
import MotionDiv from "../shared/MotionDiv";
import { isUserAuthor } from "@/lib/actions/user.actions";
import CommentMenu from "./CommentMenu";
import { ContentCategoryEnum } from "@/lib/types.d";
import LikeButton from "../shared/LikeButton";

const CommentCard = async ({
  comment,
  contentCategory,
}: {
  comment: Comment & { author: User };
  contentCategory: ContentCategoryEnum;
}) => {
  const {
    id,
    author: { username, image },
    createdAt,
    updatedAt,
    body,
    authorId,
  } = comment;

  const { isAuthor } = await isUserAuthor(authorId);

  const date = format(new Date(createdAt), "MMMM dd") ?? "No date found";
  const editedDate = updatedAt && format(new Date(updatedAt), "MMMM dd");
  const commentIdAttribute = `${id.toString()}-comment`;

  return (
    <MotionDiv
      key={id.toString()}
      layoutId={id.toString()}
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4 rounded-2xl bg-white-100 p-6 text-white-100 dark:border dark:border-dark-border dark:bg-dark-800"
    >
      <div className="flex justify-between">
        <div className="flex items-center gap-x-2">
          {image ? (
            <div className="relative size-8 shrink-0">
              <Image
                src={image}
                fill
                alt="author-profile-image"
                className="rounded-full"
              />
            </div>
          ) : (
            <ProfilePlaceholder size={33} className="shrink-0" />
          )}
          <div className="flex items-center gap-x-2 max-xl:flex-col max-xl:items-start">
            <p className="paragraph-3-medium text-dark-700 dark:text-white-200">
              {username}
            </p>
            <div className="flex items-center gap-x-1">
              <p className="flex text-white-400 max-xl:hidden">•</p>
              <p className="paragraph-3-medium max-xl:subtitle-regular text-white-400">
                {date}
              </p>
              {editedDate && (
                <>
                  <p className="max-xl:subtitle-regular flex text-white-400">
                    •
                  </p>
                  <p className="paragraph-3-medium max-xl:subtitle-regular text-white-400">
                    Edited on {editedDate}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center">
          {isAuthor ? (
            <CommentMenu
              id={id}
              commentIdAttribute={commentIdAttribute}
              key={updatedAt?.toString()}
              body={body}
              contentCategory={contentCategory}
            />
          ) : (
            <LikeButton
              contentId={id}
              contentCategory={ContentCategoryEnum.COMMENT}
              size={16}
              heartBgType="none"
            />
          )}
        </div>
      </div>

      <div
        id={commentIdAttribute}
        key={updatedAt?.toString()}
        className="paragraph-2-regular whitespace-pre-wrap text-dark-700 dark:text-white-300"
      >
        <p>{body}</p>
      </div>
    </MotionDiv>
  );
};

export default CommentCard;
