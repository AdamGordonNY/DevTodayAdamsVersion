"use client";

import { format } from "date-fns";
import Image from "next/image";

import { Meetup } from "@prisma/client";
import { Calendar, Location } from "@/components/ui/icons";
import { ImagePlaceholder } from "../ui";
import { Separator } from "../ui/separator";
import ContentMenu from "./ContentMenu";
import GoogleMap from "@/components/shared/GoogleMap";
import { useDebounceCallback } from "usehooks-ts";
import { incrementViews } from "@/lib/actions/content.actions";

import { useEffect } from "react";

const MeetupDetails = ({
  meetup,
  isAuthor,
}: {
  meetup: Meetup;
  isAuthor: boolean;
}) => {
  const { tags, body, title, image, id, startTime, endTime, address } = meetup;

  const meetupStartDate = startTime
    ? format(new Date(startTime), "EEEE, MMMM dd, yyyy")
    : "No date found";
  const meetupStartTime = startTime
    ? format(new Date(startTime), "p")
    : "No date found";
  const meetupEndTime = endTime
    ? format(new Date(endTime), "p")
    : "No date found";
  const meetupDateAndTime = `${meetupStartDate} • ${meetupStartTime} - ${meetupEndTime}`;
  const debouncedIncrementViews = useDebounceCallback(incrementViews, 60000);
  useEffect(() => {
    debouncedIncrementViews({ id, contentType: "meetup" });
  }, [id, debouncedIncrementViews]);
  return (
    <section className="flex w-full flex-col gap-y-6">
      <section className="flex flex-col gap-y-6">
        {address && (
          <div className="h-64 w-full overflow-hidden rounded-lg">
            <GoogleMap
              meetup={meetup}
              meetupStartDate={meetupStartDate}
              meetupStartTime={meetupStartTime}
            />
          </div>
        )}

        <div className="flex justify-between">
          <div className="flex gap-x-2">
            {image ? (
              <div className="relative size-[72px]">
                <Image
                  src={image}
                  alt="meetup-image"
                  fill
                  className="rounded-lg object-cover"
                />
              </div>
            ) : (
              <ImagePlaceholder
                size={72}
                className="rounded-lg bg-white-100 text-white-300 dark:bg-dark-700 dark:text-white-400"
              />
            )}
            <h1 className="display-2-bold mt-2 dark:text-white-100">
              {title ?? "Missing Post Title!"}
            </h1>
          </div>
          <div className="mt-4 align-top">
            {isAuthor && (
              <ContentMenu contentId={id} contentCategory="Meetup" />
            )}
          </div>
        </div>

        <div className="flex gap-x-4">
          {tags.length > 0 &&
            tags.map((tag) => {
              return (
                <div
                  key={tag}
                  className="caption-10 rounded-full bg-white-100 p-2 uppercase text-white-400 dark:bg-dark-700 dark:text-white-300"
                >
                  {tag}
                </div>
              );
            })}
        </div>

        <section className="flex flex-col gap-y-4">
          <div className="flex items-center gap-x-2">
            <Calendar size={18} fill="fill-primary-500" />
            <p className="paragraph-2-medium text-dark-700 dark:text-white-200">
              {meetupDateAndTime}
            </p>
          </div>
          <div className="flex items-center gap-x-2">
            <Location size={18} fill="fill-primary-500" />
            <p className="paragraph-2-medium text-dark-700 dark:text-white-200">
              {address}
            </p>
          </div>
        </section>

        {body && (
          <div
            dangerouslySetInnerHTML={{ __html: body }}
            className="paragraph-2-regular flex-col text-white-400 dark:bg-transparent dark:text-white-300"
          />
        )}
      </section>

      <Separator
        orientation="horizontal"
        className="my-4 size-px w-full text-white-border dark:bg-dark-700 dark:text-dark-700"
      />
    </section>
  );
};

export default MeetupDetails;
