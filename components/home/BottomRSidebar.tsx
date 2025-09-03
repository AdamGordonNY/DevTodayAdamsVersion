import React from "react";
import RightArrow from "../ui/icons/RightArrow";
import { getDynamicPodcasts } from "@/lib/actions/podcast.actions";
import RecentItem from "../profile/posts/RecentItem";
import { getDynamicPosts } from "@/lib/actions/post.actions";
import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { getUser } from "@/lib/actions/user.actions";

const BottomRSidebar = async ({
  contentType,
  query,
}: {
  contentType: string;
  query: "newest" | "popular" | "following" | "joined";
}) => {
  const pageSize = 5;
  let typeHeading;
  switch (contentType) {
    case "meetups":
    case "posts":
      typeHeading = "Podcasts";
      break;
    case "podcasts":
    case "groups":
      typeHeading = "Posts";
      break;
    default:
      typeHeading = "Meetups";
      break;
  }
  const uid = await (await auth()).userId!;
  const { user } = await getUser(uid);

  if (
    query === "following" &&
    (!user?.following || user.following.length === 0)
  ) {
    query = "newest";
  }

  const renderContent = async (contentType: string) => {
    if (contentType === "meetups" || contentType === "posts") {
      const podcasts = await getDynamicPodcasts(1, query, pageSize);

      return (
        <div className="flex flex-col gap-y-5">
          {podcasts?.podcasts.map((podcast, idx) => (
            <Link href={`/podcasts/${podcast.id}`} key={idx}>
              <RecentItem
                key={idx}
                id={podcast.id}
                title={podcast?.title!}
                author={podcast?.user.username!}
                image={podcast?.image!}
              />
            </Link>
          ))}
        </div>
      );
    }
    if (contentType === "podcasts") {
      const posts = await getDynamicPosts(1, query, pageSize);

      return (
        <div className="flex flex-col gap-y-5">
          {posts?.posts?.map((post, idx) => (
            <Link href={`/posts/${post.id}`} key={idx}>
              <RecentItem
                key={idx}
                id={post.id}
                title={post?.title!}
                author={post?.user.username!}
                image={post?.image!}
              />
            </Link>
          ))}
        </div>
      );
    }
    if (contentType === "posts") {
      const podcasts = await getDynamicPodcasts(1, query, pageSize);

      return (
        <div className="flex flex-col gap-y-5">
          {podcasts?.podcasts.map((podcast, idx) => (
            <Link href={`/podcasts/${podcast.id}`} key={idx}>
              <RecentItem
                key={idx}
                id={podcast.id}
                title={podcast?.title!}
                author={podcast?.user.username!}
                image={podcast?.image!}
              />
            </Link>
          ))}
        </div>
      );
    }
    if (contentType === "groups") {
      const posts = await getDynamicPosts(1, query, 2);
      return (
        <div className="flex flex-col gap-y-5">
          {posts?.posts?.map((post, idx) => (
            <Link href={`/posts/${post.id}`} key={idx}>
              <RecentItem
                key={idx}
                id={post.id}
                title={post?.title!}
                author={post?.user.username!}
                image={post?.image!}
              />
            </Link>
          ))}
        </div>
      );
    }
  };
  return (
    <div className="flex w-full flex-col gap-y-[10px] rounded-2xl  bg-white-100 p-5 max-lg:hidden dark:bg-dark-800 dark:text-white-200">
      <div className="flex gap-[3px] text-left">
        <span className="paragraph-2-bold capitalize">
          {contentType && typeHeading}
        </span>
        <RightArrow className="fill-dark-800 dark:fill-white-200" />
      </div>
      <>{await renderContent(contentType)}</>
    </div>
  );
};

export default BottomRSidebar;
