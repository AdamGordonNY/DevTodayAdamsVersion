import React from "react";
import One from "../ui/icons/One";
import Two from "../ui/icons/Two";
import Three from "../ui/icons/Three";
import Four from "../ui/icons/Four";
import Five from "../ui/icons/Five";
interface HomeTagProps {
  idx: number;
  tag: string;
  tagCount: number;
}
const HomeTag = ({ idx, tag, tagCount }: HomeTagProps) => {
  idx = idx + 1;
  const renderIcon = (number: number) => {
    switch (number) {
      case 1:
        return <One size={20} />;
      case 2:
        return <Two size={20} />;
      case 3:
        return <Three size={20} />;
      case 4:
        return <Four size={20} />;
      case 5:
        return <Five size={20} />;
      default:
        return <div>{number}</div>;
    }
  };

  return (
    <div className="flex h-8 w-full gap-x-2.5">
      <div className="flex size-8 items-center justify-center dark:bg-dark-700">
        {renderIcon(idx)}
      </div>
      <div className="flex flex-col gap-y-1">
        <div className="paragraph-4-medium lowercase text-dark-700 dark:text-white-100 ">
          #{tag}
        </div>
        <div className="subtitle-medium text-white-400">
          {tagCount} Posted by this Tag
        </div>
      </div>
    </div>
  );
};

export default HomeTag;
