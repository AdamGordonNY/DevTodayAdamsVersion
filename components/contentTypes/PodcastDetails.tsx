// components/PodcastDetails.tsx
"use client";

import { Podcast } from "@prisma/client";
import PlayCard from "./PlayCard";
import ContentMenu from "./ContentMenu";
import { useDebounceCallback } from "usehooks-ts";
import { incrementViews } from "@/lib/actions/content.actions";

import { useEffect } from "react";

const PodcastDetails = ({
  podcast,
  isAuthor,
}: {
  podcast: Podcast;
  isAuthor: boolean;
}) => {
  const { title, audio, tags, body, image, userId, id } = podcast;
  const debouncedIncrementViews = useDebounceCallback(incrementViews, 60000);
  useEffect(() => {
    debouncedIncrementViews({ id, contentType: "podcast" });
  }, [id, debouncedIncrementViews]);
  return (
    <section className="flex w-full flex-1 flex-col space-y-5">
      <PlayCard title={title} image={image!} audio={audio} userId={userId} />
      <div className="flex items-center justify-between">
        <h1 className="display-2-bold dark:text-white-100">
          {title ?? "Missing Post Title!"}
        </h1>
        {isAuthor && <ContentMenu contentId={id} contentCategory="Podcast" />}
      </div>

      <div className="flex gap-x-4">
        {tags.length > 0 &&
          tags.map((tag) => (
            <div
              key={tag}
              className="caption-10 rounded-2xl  p-2 uppercase text-white-400 dark:bg-dark-700 dark:text-white-300"
            >
              {tag}
            </div>
          ))}
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: body ?? "" }}
        className="paragraph-2-regular flex flex-col text-white-400 dark:text-white-300"
      ></div>
    </section>
  );
};

export default PodcastDetails;
