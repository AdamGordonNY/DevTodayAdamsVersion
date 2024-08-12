import React from "react";
import Image from "next/image";
import Link from "next/link";

import { ImagePlaceholder } from "../ui";
import { singularOrPlural } from "@/lib/utils";
import MotionDiv from "../shared/MotionDiv";
import GroupAboutSection from "./GroupAboutSection";
import { GroupDetailsResult, TopRankGroups } from "@/lib/actions/shared.types";

interface GroupLeftSidebarProps {
  topRankedGroups: TopRankGroups[];

  group: Partial<GroupDetailsResult>;
}
const GroupLeftSidebar = async ({
  group,

  topRankedGroups,
}: GroupLeftSidebarProps) => {
  const stats = {
    admins: group.adminsAndOwners?.length!,
    members: group.totalMembersCount!,
    posts:
      group.posts?.length! + group.podcasts?.length! + group.meetups?.length!,
  };
  const renderStats = Object.entries(stats).map(
    ([stat, count]: [stat: string, count: number]) => {
      return (
        <p
          key={stat}
          className="paragraph-3-medium flex gap-x-1 capitalize text-white-400 dark:text-white-300"
        >
          <span className="paragraph-3-bold text-primary-500">{count}</span>
          {singularOrPlural(count, stat)}
        </p>
      );
    }
  );

  const renderTopRanked =
    topRankedGroups &&
    topRankedGroups.map((group) => {
      return (
        <MotionDiv
          key={group.id}
          whileHover={{
            scale: 1.05,
          }}
          transition={{
            duration: 0.2,
            ease: "linear",
          }}
        >
          <Link
            href={`/groups/${group.id}`}
            className="group flex items-center gap-x-2 rounded  hover:bg-white-200 dark:hover:bg-dark-700"
          >
            {group.coverImage ? (
              <div className="relative h-[31px] min-w-[31px]">
                <Image
                  src={group.coverImage}
                  alt="group-cover-image"
                  fill
                  className="rounded object-cover"
                />
              </div>
            ) : (
              <ImagePlaceholder
                size={31}
                className="rounded bg-white-100 text-white-300 dark:bg-dark-700 dark:text-white-400"
              />
            )}

            <div className="flex flex-col">
              <h1 className="paragraph-4-medium max-w-[130px] truncate text-dark-700 dark:text-white-200">
                {group.name ?? "Missing Group Name!"}
              </h1>
              <p className="caption-10 mt-0.5 flex gap-x-0.5 text-white-400 dark:group-hover:text-white-300">
                <span>{Number(group.postCount)}</span> Items Published
              </p>
            </div>
          </Link>
        </MotionDiv>
      );
    });

  return (
    <section className="flex w-full flex-col gap-y-5">
      <div className="max-md-a:hidden">
        <GroupAboutSection about={group.group?.about!} />
      </div>
      <section className="paragraph-2-medium flex flex-col rounded-lg bg-white-100 p-4 text-white-400 max-md-a:order-1 dark:bg-dark-800">
        <h1 className="paragraph-2-bold text-dark-800 dark:text-white-200">
          Statistical Highlights
        </h1>
        <div className="mt-3 flex flex-col gap-y-3 max-md-a:flex-row max-md-a:gap-x-4">
          {renderStats}
        </div>
      </section>

      <section className="paragraph-2-medium flex flex-col gap-y-3 rounded-lg bg-white-100 p-4 text-white-400 max-md-a:hidden dark:bg-dark-800">
        <h1 className="paragraph-2-bold text-dark-800 dark:text-white-200">
          Top Ranked
        </h1>
        {renderTopRanked}
      </section>
    </section>
  );
};

export default GroupLeftSidebar;
