import React from "react";
import HomeTag from "./HomeTag";
import { Tag, getTopFiveTags } from "@/lib/actions/tag.actions";

const SidebarTags = async () => {
  const { tags: popularTags, error } = await getTopFiveTags();

  return (
    <div className="sidebar-padding flex w-full flex-col rounded-2xl max-lg:hidden">
      <div className="flex flex-col gap-y-3">
        <div className="paragraph-2-bold flex justify-start  text-dark-900 dark:text-white-200">
          <span>Popular Tags</span>
        </div>
        <div className="flex flex-col gap-y-3.5">
          {!error &&
            popularTags?.map((tag: Tag, idx: number) => {
              return (
                <HomeTag
                  key={tag.tag}
                  idx={idx}
                  tag={tag.tag}
                  tagCount={tag.tag_count}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default SidebarTags;
