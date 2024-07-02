import { getTopRankGroups } from "@/lib/actions/group.actions";
import React from "react";
import GroupTag from "../shared/GroupTag";
import { TopRankGroups } from "@/lib/actions/shared.types";
interface GroupSidebarProps {
  type: "groups" | "posts" | "podcasts" | "meetups";
}

const GroupLeftSidebar = async ({ type }: GroupSidebarProps) => {
  if (type !== "groups") {
    return null;
  }
  const groups = (await getTopRankGroups()) as TopRankGroups[];
  return (
    <div className="flex w-full flex-col gap-y-[10px] rounded-2xl bg-white-100  p-5 max-lg:hidden dark:bg-dark-800 dark:text-white-200">
      {" "}
      <div className="paragraph-2-bold flex justify-start  text-dark-900 dark:text-white-200">
        <span>Top Ranked</span>
      </div>
      {groups.map((group, idx) => (
        <GroupTag active={false} group={group} key={idx} />
      ))}
    </div>
  );
};

export default GroupLeftSidebar;
