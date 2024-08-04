import React from "react";
import { Podcast, User } from "@prisma/client";
import { ContentCategoryEnum } from "@/lib/types.d";
import ContentTags from "./ContentTags";
import UserSection from "./UserSection";
import ContainedImage from "@/components/shared/ContainedImage";
import LikeButton from "@/components/shared/LikeButton";
import Link from "next/link";
import MotionDiv from "@/components/shared/MotionDiv";

interface PodcastCardProps {
  podcast?: Partial<Podcast> & {
    commentCount: number;
  };
  user: Partial<User>;
  index?: number;
}

const PodcastCard = ({ podcast, user, index = 1 }: PodcastCardProps) => {
  return (
    <MotionDiv
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.03 }}
      className="relative flex h-[260px] break-inside-avoid-column flex-col justify-between rounded-[16px] bg-white-100 p-5 dark:bg-dark-800"
    >
      <div className="flex w-full flex-col justify-between gap-y-2">
        <div className="flex flex-row items-start">
          <MotionDiv whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.9 }}>
            <Link href={`/podcasts/${podcast?.id!}`}>
              <ContainedImage
                src={podcast?.image || "/placeholder.png"}
                alt="post image"
                width={50}
                height={50}
                className="size-12 rounded-[6px] dark:invert"
              />
            </Link>
          </MotionDiv>
          <div className="mx-2 flex grow flex-col">
            <span className="paragraph-1-bold max-lg:paragraph-3-bold line-clamp-2 overflow-hidden text-dark-800 dark:text-white-100">
              {podcast?.title}
            </span>
          </div>
          <div className="ml-auto">
            <LikeButton
              contentId={podcast?.id!}
              contentCategory={ContentCategoryEnum.PODCAST}
            />
          </div>
        </div>
        <div
          className="paragraph-3-regular my-1 line-clamp-3 text-white-400 dark:text-white-300"
          dangerouslySetInnerHTML={{ __html: podcast?.body ?? "" }}
        ></div>
        <div className="mt-1 flex h-10 flex-wrap gap-x-2.5 overflow-hidden">
          {podcast?.tags &&
            podcast.tags.map((tag, idx) => <ContentTags key={idx} tag={tag} />)}
        </div>
      </div>

      <Link href={`/profile/${user.id}`} className="justify-self-end">
        <UserSection
          image={user.image!}
          username={user?.username!}
          createdAt={podcast?.createdAt!}
        />
      </Link>
    </MotionDiv>
  );
};

export default PodcastCard;
