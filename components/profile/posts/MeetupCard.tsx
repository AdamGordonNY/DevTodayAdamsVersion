import { Meetup } from "@prisma/client";
import React from "react";
import Image from "next/image";
import Date from "@/components/shared/Date";
import ContentTags from "./ContentTags";
import MotionDiv from "@/components/shared/MotionDiv";
import Link from "next/link";

interface MeetupCardProps {
  meetup?: Partial<Meetup>;
  index?: number;
}

const MeetupCard = ({ meetup, index = 1 }: MeetupCardProps) => {
  return (
    <Link href={`/meetups/${meetup?.id}`}>
      {meetup && (
        <MotionDiv
          initial={{
            opacity: 0,

            x: index % 2 === 0 ? -50 : 50,
          }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col space-y-[10px] rounded-[16px] bg-white-100 p-5 dark:bg-dark-800"
        >
          <div className="flex flex-col gap-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-x-5">
                <MotionDiv whileHover={{ scale: 1.1 }}>
                  <Link href={`/meetups/${meetup.id}`}>
                    <Image
                      src={meetup?.image!}
                      width={72}
                      height={72}
                      alt="meetup-image"
                      className="size-[72px] shrink-0 self-start rounded-[6px] max-lg:hidden"
                    />
                  </Link>
                </MotionDiv>
                <div className="flex flex-col gap-y-2">
                  <h3 className="paragraph-1-bold max-lg:paragraph-3-bold text-dark-800 max-lg:line-clamp-1 dark:text-white-200">
                    {meetup?.title}
                  </h3>
                  <p className="paragraph-3-regular text-white-400 max-lg:line-clamp-1">
                    {meetup?.address}
                  </p>
                </div>
              </div>
              <Date startTime={meetup?.startTime!} />
            </div>
            <div
              dangerouslySetInnerHTML={{ __html: meetup?.body! }}
              className="paragraph-3-regular text-white-400 dark:text-white-200"
            ></div>
            <div className="flex justify-between">
              <div className="flex gap-x-2.5">
                {meetup?.tags!.map((tag, index) => (
                  <ContentTags key={index} tag={tag} />
                ))}
              </div>
              {/* <LikeButton
                contentCategory={ContentCategoryEnum.MEETUP}
                contentId={meetup.id!}
              /> */}
            </div>
          </div>
        </MotionDiv>
      )}
    </Link>
  );
};

export default MeetupCard;
