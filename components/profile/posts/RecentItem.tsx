import React from "react";
import Image from "next/image";

import RightArrow from "../../ui/icons/RightArrow";

import MotionDiv from "@/components/shared/MotionDiv";

interface RecentItemProps {
  id: number;
  image?: string | null;
  title?: string;
  author?: string;
}
const RecentItem = ({ image, title, author, id }: RecentItemProps) => {
  return (
    <>
      <MotionDiv
        className="flex w-full cursor-pointer gap-x-3.5"
        whileHover={{ scale: 1.1 }}
      >
        {" "}
        {image ? (
          <Image
            src={image!}
            width={60}
            height={60}
            alt="ph image"
            className="size-[50px] rounded-[6px]"
          />
        ) : (
          <Image
            src="/placeholder.png"
            alt="post image"
            width={60}
            height={60}
            className="size-[50px] rounded-[6px] dark:invert"
          />
        )}
        <div className="flex flex-1 flex-col justify-between gap-y-1.5 text-wrap dark:text-white-200">
          <div className="flex justify-between">
            <span className="paragraph-4-medium  line-clamp-2"> {title}</span>

            <RightArrow className="size-[20px] fill-none stroke-white-400 align-top" />
          </div>
          <span className="subtitle-regular text-white-400">by {author}</span>
        </div>
      </MotionDiv>
    </>
  );
};

export default RecentItem;
