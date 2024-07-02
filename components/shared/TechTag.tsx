import React from "react";
import { Button } from "../ui/button";
import TagX from "../ui/icons/TagX";

interface TechTagProps {
  tech: string;
  removeTech: any;
}
const TechTag = ({ tech, removeTech }: TechTagProps) => {
  return (
    <div className="flex justify-between gap-x-2.5">
      <Button
        className="text-caption-10 inline-flex h-5 items-center justify-center   gap-x-px py-1  pl-2.5 pr-1.5 align-middle  capitalize dark:bg-dark-700 dark:text-white-300"
        onClick={removeTech}
      >
        {tech} <TagX />
      </Button>
    </div>
  );
};

export default TechTag;
