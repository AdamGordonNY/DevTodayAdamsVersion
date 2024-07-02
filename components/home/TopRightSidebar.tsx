import React from "react";
import RightArrow from "../ui/icons/RightArrow";
import MeetupTag from "../shared/MeetupTag";
import { getDynamicMeetups } from "@/lib/actions/meetup.actions";
import { getDynamicPosts } from "@/lib/actions/post.actions";
import RecentItem from "../profile/posts/RecentItem";
import Link from "next/link";

const TopRightSidebar = async ({
  contentType,
  filter,
}: {
  contentType: string;
  filter: "newest" | "popular" | "following";
}) => {
  const renderContent = async (contentType: string) => {
    if (contentType === "meetups") {
      const posts = await getDynamicPosts(1, filter, 4);
      const heading = "Posts";
      return (
        <>
          <div className="flex gap-[3px] text-left">
            <span className="paragraph-2-bold capitalize dark:bg-dark-800 dark:text-white-100">
              {heading}
            </span>
            <RightArrow className="fill-dark-800 dark:fill-white-200" />
          </div>
          <div className="flex justify-between">
            {" "}
            <div className="flex flex-col gap-y-5">
              {posts?.posts.map((post, idx) => (
                <Link href={`/posts/${post.id}`} key={idx}>
                  <RecentItem
                    key={idx}
                    id={post.id}
                    image={post.image}
                    author={post.user.username!}
                    title={post.title}
                  />
                </Link>
              ))}
            </div>
          </div>
        </>
      );
    }
    if (contentType === "posts" || contentType === "podcasts") {
      const meetups = await getDynamicMeetups(1, "newest", 4);
      const heading = "Meetups";
      return (
        <>
          <div className="flex gap-[3px] text-left">
            <span className="paragraph-2-bold capitalize dark:bg-dark-800 dark:text-white-100">
              {heading}
            </span>
            <RightArrow className="fill-dark-800 dark:fill-white-200" />
          </div>
          <div className="flex flex-col gap-y-5">
            {meetups?.meetups.map((meetup, idx) => (
              <Link href={`/meetups/${meetup.id}`} key={idx}>
                <MeetupTag
                  user={meetup.user}
                  key={idx}
                  id={meetup.id}
                  meetupTitle={meetup?.title!}
                  meetupLocation={meetup?.address}
                  meetupTags={meetup.tags}
                  startTime={meetup.startTime!}
                />
              </Link>
            ))}
          </div>
        </>
      );
    }
    if (contentType === "groups") {
      const meetups = await getDynamicMeetups(1, filter, 3);
      const heading = "Meetups";
      return (
        <>
          <div className="flex gap-[3px] text-left">
            <span className="paragraph-2-bold capitalize dark:bg-dark-800 dark:text-white-100">
              {heading}
            </span>
            <RightArrow className="fill-dark-800 dark:fill-white-200" />
          </div>
          <div className="flex flex-col gap-y-5">
            {meetups?.meetups.map((meetup, idx) => (
              <Link href={`/meetups/${meetup.id}`} key={idx}>
                <MeetupTag
                  user={meetup.user}
                  key={idx}
                  id={meetup.id}
                  meetupTitle={meetup?.title!}
                  meetupLocation={meetup?.address}
                  meetupTags={meetup.tags}
                  startTime={meetup.startTime!}
                />
              </Link>
            ))}
          </div>
        </>
      );
    }
  };

  return (
    <div className="flex w-full flex-col gap-y-[10px]  rounded-2xl bg-white-100 p-5 max-lg:hidden  dark:bg-dark-800 dark:text-white-200">
      {renderContent(contentType)}
    </div>
  );
};

export default TopRightSidebar;
