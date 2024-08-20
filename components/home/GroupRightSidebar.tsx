import React from "react";
import RightArrow from "../ui/icons/RightArrow";

import RecentItem from "../profile/posts/RecentItem";
import { getDynamicPodcasts } from "@/lib/actions/podcast.actions";
import Link from "next/link";

interface GroupSidebarProps {
  type: "groups";
  filter: "newest" | "popular" | "following" | "joined";
}
const GroupSidebar = async ({ type, filter }: GroupSidebarProps) => {
  const podcasts = await getDynamicPodcasts(1, filter, 3);
  return (
    <div
      className={`flex w-full flex-col gap-y-[10px] rounded-2xl  bg-white-100 p-5 max-[1340px]:hidden   dark:bg-dark-800 dark:text-white-200`}
    >
      <div className="flex gap-[3px] text-left">
        <span className="paragraph-2-bold capitalize">Podcasts</span>
        <RightArrow className="fill-dark-800 dark:fill-white-200" />
      </div>
      <div className="flex flex-col gap-y-5">
        {podcasts?.podcasts.map((post, idx) => (
          <Link href={`/podcasts/${post.id}`} key={idx}>
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
    </div>
  );
};

export default GroupSidebar;
