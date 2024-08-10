"use client";
import React from "react";

import { format } from "date-fns";
import Image from "next/image";
import Link from "next/link";
import { MeetupContent } from "@/lib/actions/shared.types";

const GroupMeetupCard = ({ meetup }: { meetup: MeetupContent }) => {
  const startMonth =
    format(new Date(meetup.startTime as Date), "MMM") ?? "No date found";
  const startDay =
    format(new Date(meetup?.startTime as Date), "d") ?? "No date found";

  return (
    <Link
      key={meetup.id}
      href={`/meetups/${meetup.id}`}
      className="group flex gap-x-4 rounded hover:bg-white-200 dark:hover:bg-dark-700"
    >
      <div className="flex h-[66px] min-w-[45px] flex-col items-center justify-center rounded bg-white-200 dark:bg-dark-700">
        <p className="paragraph-4-regular uppercase text-dark-800 dark:text-white-200">
          {startMonth}
        </p>
        <p className="display-2-bold text-primary-500">{startDay}</p>
      </div>
      <div className="flex w-full flex-col justify-between hover:text-white-300 dark:text-white-400">
        <h1 className="paragraph-3-medium max-w-[230px] truncate text-dark-800 dark:text-white-200">
          {meetup.title}
        </h1>

        <div className="flex w-full gap-x-2">
          <div className="relative size-4">
            <Image
              src={meetup.image as string}
              alt="meetup-image"
              fill
              className="rounded-full"
            />
          </div>
          <p className="subtitle-regular max-w-[200px] truncate text-white-400">
            {meetup.address}
          </p>
        </div>
        <div className="mt-2 flex items-center gap-x-1 group-hover:pb-1">
          {meetup.tags.length > 0 &&
            meetup.tags.map((tag: string) => {
              return (
                <div
                  key={tag}
                  className="items-center rounded-xl  bg-white-200 group-hover:bg-white-100 dark:bg-dark-700 group-hover:dark:bg-dark-800"
                >
                  <p className="caption-8 px-2 py-1 uppercase text-white-400 dark:text-white-300">
                    {tag}
                  </p>
                </div>
              );
            })}
        </div>
      </div>
    </Link>
  );
};

export default GroupMeetupCard;
