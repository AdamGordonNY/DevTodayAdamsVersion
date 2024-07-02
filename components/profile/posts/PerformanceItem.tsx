import React from "react";
import Image from "next/image";
import Link from "next/link";
interface PerformanceItemProps {
  id: number;
  views: number;
  likes: number;
  comments: number;
  image?: string;
  type: string;
}
const PerformanceItem = ({
  views,
  likes,
  comments,
  id,
  image,
  type,
}: PerformanceItemProps) => {
  return (
    <div className="flex w-full gap-x-[14px]">
      <Link href={`/${type}/${id}`}>
        <Image
          src={image!}
          alt="thumbnail"
          width={60}
          height={60}
          className="size-[50px] rounded-[6px]"
        />
      </Link>
      <div className="flex  gap-x-7">
        <div className="flex flex-col space-y-1">
          <span className="paragraph-3-regular text-dark-800 dark:text-white-300">
            Views
          </span>
          <span className="paragraph-3-medium">{views}</span>
        </div>
        <div className="flex flex-col space-y-1">
          <span className="paragraph-3-regular text-dark-800 dark:text-white-300">
            Likes
          </span>
          <span className="paragraph-3-medium">{likes}</span>
        </div>
        <div className="flex flex-col space-y-1">
          <span className="paragraph-3-regular text-dark-800 dark:text-white-300">
            Comments
          </span>
          <span className="paragraph-3-medium">{comments}</span>
        </div>
      </div>
    </div>
  );
};

export default PerformanceItem;
