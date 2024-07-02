import React from "react";
import RightArrow from "../../ui/icons/RightArrow";
import RecentItem from "./RecentItem";
import { getMostRecentPosts } from "@/lib/actions/user.actions";
import Link from "next/link";

interface RecentProps {
  firstName: string;
  lastName: string;
  userId: number;
}
const Recent = async ({ firstName, lastName, userId }: RecentProps) => {
  const userWithContent = await getMostRecentPosts(userId);
  const posts = userWithContent?.posts;
  return (
    <div className="flex h-[298px] w-full flex-col gap-y-5 rounded-[16px] bg-white-100 p-5 dark:bg-dark-800">
      <div className="flex">
        <span className="paragraph-2-bold flex gap-[3px] bg-white-100 align-middle text-dark-900 dark:bg-dark-800 dark:text-white-200">
          Recent Posts
          <RightArrow className="paragraph-2-bold size-[20px] fill-transparent dark:stroke-white-200" />
        </span>
      </div>
      {posts &&
        posts.map((item, index) => (
          <Link href={`/posts/${item.id}`} key={index}>
            <RecentItem
              key={index}
              id={item.id}
              image={item.image!}
              title={item.title}
              author={firstName + " " + lastName}
            />
          </Link>
        ))}
    </div>
  );
};

export default Recent;
