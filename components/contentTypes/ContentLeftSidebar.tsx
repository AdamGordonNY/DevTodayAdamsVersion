import { format as formatDate } from "date-fns";
import Link from "next/link";

import { ContentCategoryEnum, ContentType } from "@/lib/types.d";
import { Comment, Eye } from "../ui";
import LikeButton from "../shared/LikeButton";
import ShareButton from "../shared/SocialMediaShare";
const ContentLeftSidebar = ({
  content,
  contentCategory,
}: {
  content: ContentType;
  contentCategory: ContentCategoryEnum;
}) => {
  const {
    id: contentId,
    likes,
    views,
    comment,
    createdAt,
    user: { username, id },
  } = content as ContentType;
  const postedOnDate = formatDate(new Date(createdAt), "MMM dd, yyyy");

  return (
    <section className="flex w-full flex-col gap-y-5">
      <section className="paragraph-2-medium space-y-3 rounded-lg bg-white-100 p-5 text-white-400 dark:bg-dark-800">
        <div className="flex items-center gap-x-2">
          <LikeButton
            contentId={contentId}
            contentCategory={contentCategory}
            size={16}
            heartBgType="square"
          />
          <div>{likes ? `${likes} Hearts` : "No likes yet"}</div>
        </div>

        <div className="flex items-center gap-x-2 whitespace-nowrap">
          <div className="rounded dark:bg-dark-700">
            <Comment size={24} className="dark:rounded dark:fill-dark-700" />
          </div>
          <div>
            {comment && comment.length > 0
              ? comment.length === 1
                ? `1 Comment`
                : `${comment.length} Comments`
              : "No comments yet"}
          </div>
        </div>

        <div className="flex items-center gap-x-3">
          <div className="flex size-6 items-center justify-center rounded dark:bg-dark-700">
            <Eye />
          </div>
          <div>{views ? `${views} Views` : "No views yet"}</div>
        </div>
      </section>

      <ShareButton />

      <div className="paragraph-2-medium flex rounded-lg bg-white-100 p-4 text-center text-white-400 max-md-b:hidden dark:bg-dark-800">
        <p>
          <Link href={`/profile/${id}`} className="text-[#5D95E8]">
            {username ?? "Username is missing!"}
          </Link>
          {postedOnDate
            ? ` Posted on ${postedOnDate}`
            : " Posted on date missing"}
        </p>
      </div>
    </section>
  );
};

export default ContentLeftSidebar;
