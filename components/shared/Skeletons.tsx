import { Skeleton } from "@/components/ui/skeleton";

import React from "react";
const ProfileCardSkeleton = () => {
  return (
    <Skeleton className="h-[205px] w-full animate-pulse rounded-[16px] bg-white-300 dark:bg-dark-800">
      <Skeleton className="flex   space-y-4 p-4">
        <Skeleton className="shadow-#2B00D4 flex size-fit rounded-full bg-white-400 dark:bg-dark-700" />
        <Skeleton className="h-[165px] w-[156px] rounded-[16px] bg-white-400 dark:bg-dark-700"></Skeleton>
        <Skeleton className="ml-2 flex w-full flex-col space-y-5 ">
          <Skeleton className="h-4 w-1/2 rounded bg-white-400 dark:bg-dark-700"></Skeleton>
          <Skeleton className="h-3 w-1/3 rounded bg-white-400 dark:bg-dark-700"></Skeleton>
          <Skeleton className=" flex gap-x-2.5 px-2.5 py-1">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-5 w-12 rounded-[20px] bg-white-400 dark:bg-dark-700"
              ></Skeleton>
            ))}
          </Skeleton>
          <Skeleton className="flex w-full flex-row items-center gap-x-2.5">
            <Skeleton className="flex items-center">
              <Skeleton className="size-10 rounded-full bg-white-400 dark:bg-dark-700"></Skeleton>
            </Skeleton>
          </Skeleton>
        </Skeleton>
      </Skeleton>
    </Skeleton>
  );
};
export const ProfileCardSkeletons = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          style={{
            opacity: 0.5 - index * 0.2,
          }}
        >
          <ProfileCardSkeleton />
        </div>
      ))}
    </>
  );
};
export const RecentPostSkeleton = ({ count = 3 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          style={{
            opacity: 0.5 - index * 0.2,
          }}
        >
          <Skeleton className="flex h-[60px] w-full  items-center rounded-[16px] bg-white-200 dark:bg-dark-700">
            <Skeleton className="ml-1 size-[50px] items-center justify-center bg-white-300" />
            <div className="flex flex-col">
              <Skeleton className="h-4 w-3/4 rounded bg-white-300 dark:bg-dark-700"></Skeleton>
              <Skeleton className="h-3 w-1/2 rounded bg-white-300 dark:bg-dark-700"></Skeleton>
            </div>
            <Skeleton className="h-4 w-1/4 rounded bg-white-300 dark:bg-dark-700">
              <Skeleton className="h-4 w-1/4 rounded bg-white-300 dark:bg-dark-700"></Skeleton>
            </Skeleton>
          </Skeleton>
        </div>
      ))}
    </>
  );
};
export const PodcastCardSkeleton = ({ count = 4 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          style={{
            opacity: 0.5 - index * 0.2,
          }}
        >
          <Skeleton className="min-h-1/2  flex  w-full flex-col flex-wrap gap-y-[10px] rounded-[16px] bg-white-100 p-5 dark:bg-dark-800"></Skeleton>
        </div>
      ))}
    </>
  );
};
const PostCardSkeleton = () => {
  return (
    <Skeleton className="space-y-7.5 relative flex min-w-full flex-1 animate-pulse rounded-[16px] bg-white-100 p-5 dark:bg-dark-800">
      <div className="mobile-card flex min-w-full flex-row gap-x-5">
        <div className="shadow-#2B00D4 flex size-fit h-[165px] w-[156px] rounded-full dark:bg-dark-700 "></div>
        <div className="flex flex-col justify-between space-y-2 bg-transparent">
          <Skeleton className="flex flex-col space-y-2">
            <div className="h-6 w-3/4 rounded bg-gray-300"></div>
            <div className="h-4 w-1/2 rounded bg-gray-300"></div>
          </Skeleton>
          <Skeleton className="flex flex-wrap gap-x-2.5 space-x-2 px-2.5 py-1">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="h-5 w-12 rounded bg-gray-300"></div>
            ))}
          </Skeleton>
          <div className="flex w-full flex-row items-center gap-x-2.5">
            <div className="size-10 rounded-full bg-gray-300"></div>
            <div className="flex flex-col space-y-1">
              <div className="h-4 w-20 rounded bg-gray-300"></div>
              <div className="h-3 w-16 rounded bg-gray-300"></div>
            </div>
            <div className="absolute bottom-4 right-4 flex items-center justify-evenly gap-x-7 overflow-x-visible">
              <div className="h-4 w-10 rounded bg-gray-300"></div>
              <div className="h-4 w-10 rounded bg-gray-300"></div>
              <div className="h-4 w-10 rounded bg-gray-300"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex rounded-full bg-white-100 dark:bg-dark-700">
        <div className="size-6 rounded-full bg-gray-300"></div>
      </div>
    </Skeleton>
  );
};

export default PostCardSkeleton;

export const CommentCardSkeleton = () => {
  return (
    <Skeleton className="h-[116px] space-y-4 rounded-xl bg-white-100 p-6 text-white-100 dark:border dark:border-dark-border dark:bg-dark-800">
      <div className="flex w-full justify-between">
        <div className="flex w-2/5 items-center gap-x-2">
          <div className="size-7 shrink-0 rounded-full bg-gray-200 dark:bg-dark-700"></div>
          <div className="h-4 w-full rounded bg-gray-200 dark:bg-dark-700"></div>
        </div>
        <div className="flex items-center gap-x-2">
          <div className="size-5 shrink-0 rounded bg-gray-200 dark:bg-dark-700"></div>
          <div className="size-5 shrink-0 rounded bg-gray-200 dark:bg-dark-700"></div>
        </div>
      </div>
      <div className="h-5 rounded bg-gray-200 dark:bg-dark-700"></div>
    </Skeleton>
  );
};

export const GroupSearchMenuSkeleton = () => {
  return (
    <div className="relative -scale-y-100">
      <div className="absolute flex h-[206px] w-full -scale-y-100 flex-col justify-center gap-y-3 rounded-lg bg-white-100 p-4 text-white-100 dark:border dark:border-dark-border dark:bg-dark-800">
        {[...Array(8)].map((_, idx) => {
          return (
            <Skeleton
              key={idx}
              className="flex w-full items-center gap-x-2 bg-white-100 dark:bg-dark-800"
            >
              <div className="size-3 shrink-0 rounded-full bg-gray-200 dark:bg-dark-700"></div>
              <div className="h-3 w-[100px] rounded bg-gray-200 dark:bg-dark-700"></div>
            </Skeleton>
          );
        })}
      </div>
    </div>
  );
};
