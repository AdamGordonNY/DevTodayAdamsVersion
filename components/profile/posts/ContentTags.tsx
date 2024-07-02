import { Button } from "@/components/ui/button";
import React from "react";

const ContentTags = ({ tag }: { tag: string }) => {
  return (
    <div className="my-2 lg:ml-3">
      <Button
        className={`paragraph-3-regular caption-10 h-5  cursor-default gap-x-2.5 rounded-[20px] bg-white-200 uppercase text-white-400  dark:bg-dark-700 dark:text-white-300`}
      >
        {tag}
      </Button>
    </div>
  );
};

export default ContentTags;
