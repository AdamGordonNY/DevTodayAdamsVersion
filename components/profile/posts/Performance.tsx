import React from "react";
import PerformanceItem from "./PerformanceItem";
import { getTopFiveContent } from "@/lib/actions/content.actions";

const Performance = async ({ userId }: { userId?: number }) => {
  const contents: any[] = [];
  if (userId) {
    const { content } = await getTopFiveContent({ userId });

    if (content) {
      contents.push(...content);
    }
  }
  return (
    <div className="flex size-full flex-col  gap-x-2.5  rounded-[16px] bg-white-100 px-5 py-[20px] dark:bg-dark-800 dark:text-white-200">
      <div className="mb-[20px] flex flex-col">
        <span className="paragraph-2-bold text-dark-800 dark:text-white-200  ">
          Performance
        </span>
        <span className="paragraph-3-regular text-dark-900 dark:text-white-200">
          The best posts of the last 30 days.
        </span>
      </div>

      <div className="flex flex-col content-center items-center justify-center space-y-5 bg-transparent">
        {contents.map((content, index) => (
          <PerformanceItem
            type={content.type === "post" ? "posts" : content.type}
            key={index}
            views={content.views}
            likes={content.likes}
            comments={content.comment_count}
            id={content.id}
            image={content.image}
          />
        ))}
      </div>
    </div>
  );
};

export default Performance;
