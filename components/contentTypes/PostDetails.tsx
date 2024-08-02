"use client";
import Image from "next/image";

import { ContentType } from "@/lib/types.d";
import { ImagePlaceholder } from "../ui";
import { Separator } from "../ui/separator";
import ContentMenu from "./ContentMenu";
import { incrementViews } from "@/lib/actions/content.actions";
import { useEffect } from "react";
import { useDebounceCallback } from "usehooks-ts";
const PostDetails = ({
  post,
  isAuthor,
}: {
  post: ContentType;
  isAuthor: boolean;
}) => {
  const { tags, body, title, image, id } = post;
  const debouncedIncrementViews = useDebounceCallback(incrementViews, 30000);
  useEffect(() => {
    debouncedIncrementViews({ id, contentType: "post" });
  }, [id, debouncedIncrementViews]);
  return (
    <section className="flex w-full flex-col gap-y-6">
      <section className="flex flex-col gap-y-6">
        {image ? (
          <div className="relative h-64">
            <Image
              src={image}
              alt="post-image"
              fill
              className="rounded-2xl object-cover"
            />
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center rounded-2xl bg-white-100 dark:bg-dark-800">
            <ImagePlaceholder
              size={32}
              className="text-white-300 dark:text-white-400"
            />
          </div>
        )}

        <div className="flex items-center justify-between">
          <h1 className="display-2-bold dark:text-white-100">
            {title ?? "Missing Post Title!"}
          </h1>
          {isAuthor && <ContentMenu contentId={id} contentCategory="Post" />}
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

export default PostDetails;
