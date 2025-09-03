import { Meetup, Podcast } from "@prisma/client";
import {
  ContentCategoryEnum,
  ContentCategoryType,
  ContentType,
} from "@/lib/types.d";
import { currentUser } from "@clerk/nextjs/server";

import { getUser, isUserAuthor } from "@/lib/actions/user.actions";
import PostDetails from "./PostDetails";
import MeetupDetails from "./MeetupDetails";
import PodcastDetails from "./PodcastDetails";
import ContentLeftSidebar from "./ContentLeftSidebar";
import ContentRightSidebar from "./ContentRightSidebar";
import Comments from "./Comments";
import CommentCard from "./CommentCard";

const ContentOverview = async ({
  content,
  contentCategoryType,
  contentCategoryEnum,
}: {
  content: ContentType;
  contentCategoryType: ContentCategoryType;
  contentCategoryEnum: ContentCategoryEnum;
}) => {
  const clerkUser = await currentUser();
  const user = clerkUser && (await getUser(clerkUser.id));
  const { isAuthor: isContentAuthor } = await isUserAuthor(
    content.userId as number
  );

  const renderContentDetails = () => {
    switch (contentCategoryEnum) {
      case ContentCategoryEnum.POST:
        return (
          <PostDetails
            post={content as ContentType}
            isAuthor={isContentAuthor as boolean}
          />
        );
      case ContentCategoryEnum.MEETUP:
        return (
          <MeetupDetails
            meetup={content as Meetup}
            isAuthor={isContentAuthor as boolean}
          />
        );
      case ContentCategoryEnum.PODCAST:
        return (
          <PodcastDetails
            podcast={content as Podcast}
            isAuthor={isContentAuthor as boolean}
          />
        );
      default:
        break;
    }
  };

  return (
    <section className="m-8 flex w-full justify-center gap-4 max-md-b:flex-col">
      <div className="flex max-w-[200px] basis-1/6 max-md-b:hidden">
        <ContentLeftSidebar
          content={content}
          contentCategory={contentCategoryEnum}
        />
      </div>

      <div className="flex flex-1 flex-col">
        <div className="flex min-w-[350px] max-md-b:-order-1">
          {renderContentDetails()}
        </div>

        {/* MOBILE VIEW */}
        <div className="hidden basis-1/6 max-md-b:block">
          <ContentLeftSidebar
            content={content}
            contentCategory={contentCategoryEnum}
          />
        </div>

        <div className="mt-6 flex basis-5/6">
          <Comments
            content={content}
            contentCategory={contentCategoryType}
            loggedInUserImage={user?.user?.image as string}
          >
            {content.comment.length > 0 &&
              content.comment.map((comment) => {
                return (
                  <CommentCard
                    key={comment.id}
                    comment={comment}
                    contentCategory={contentCategoryEnum}
                  />
                );
              })}
          </Comments>
        </div>
      </div>

      <div className="flex min-w-[330px] max-w-[330px] basis-2/6 max-md-b:order-3 max-md-b:min-w-[275px] max-md-b:max-w-screen-md-b">
        <ContentRightSidebar
          content={content}
          loggedInUserId={user?.user?.id as number}
          clerkUserId={clerkUser?.id as string}
          isAuthor={isContentAuthor as boolean}
          contentCategory={contentCategoryType}
        />
      </div>
    </section>
  );
};

export default ContentOverview;
