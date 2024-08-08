import React from "react";
import Image from "next/image";
import Link from "next/link";

import { TopRankGroups } from "@/lib/actions/shared.types";
const GroupTag = async ({
  group,
  active,
}: {
  group: TopRankGroups;
  active: boolean;
}) => {
  return (
    <Link href={`/groups/${group.id}`}>
      <div className="line-clamp-1 flex justify-normal  gap-x-2.5 truncate lg:max-w-[169px]">
        <div className="flex items-center justify-center">
          <Image
            src={group.coverImage!}
            alt="group image"
            width={31}
            height={31}
            className="rounded-sm"
          />
        </div>
        <div className="flex w-full flex-col gap-y-1 overflow-hidden">
          <div className="paragraph-4-medium truncate capitalize text-dark-700 dark:text-white-100">
            {group.name}
          </div>
          <div className="subtitle-medium text-white-400 dark:text-white-400">
            <span className="">{group.postCount}</span> Posts Published{" "}
            {active && <span>Recently</span>}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GroupTag;
