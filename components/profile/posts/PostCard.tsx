import React from "react";

import ContentTags from "./ContentTags";
import { Post, User } from "@prisma/client";
import { ContentCategoryEnum } from "@/lib/types.d";
import LikeButton from "@/components/shared/LikeButton";
import UserSection from "./UserSection";
import Image from "next/image";
import Link from "next/link";
import MotionDiv from "@/components/shared/MotionDiv";

interface PostCardProps {
  post?: Partial<Post> & {
    commentCount: number;
  };
  index?: number;
  userData?: Partial<User>;
}

const PostCard = ({ post, userData, index = 1 }: PostCardProps) => {
  return (
    <>
      {post && (
        <MotionDiv
          initial={{
            opacity: 0,

            x: index % 2 === 0 ? -50 : 50,
          }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className={`min-h-[200px] gap-x-5 gap-y-2.5 rounded-[16px]  bg-white-100 p-5 text-dark-800     dark:bg-dark-800 dark:text-white-100`}
        >
          <Link href={`/posts/${post?.id}`}>
            <MotionDiv
              whileHover={{ scale: 1.01 }}
              className="min-size-[50px] float-left"
            >
              {post.image ? (
                <Image
                  src={post?.image ?? "/img.png"}
                  alt="post image"
                  width={150}
                  height={150}
                  className="rounded-[6px] max-lg:size-[50px] lg:size-[160px]"
                />
              ) : (
                <Image
                  src="/placeholder.png"
                  alt="post image"
                  width={150}
                  height={150}
                  className="rounded-[6px] max-lg:size-[50px] lg:size-[160px] dark:invert"
                />
              )}
            </MotionDiv>
            {/* title and like */}
          </Link>
          <div className="max-lg:paragraph-3-regular paragraph-1-bold   flex items-center justify-between text-dark-800  dark:text-white-100">
            <span className="paragraph-1-bold max-lg:paragraph-3-bold ml-3 line-clamp-2 text-wrap  text-dark-800  max-lg:h-[45px] lg:truncate dark:text-white-100">
              {post.title}
            </span>

            <LikeButton
              contentId={post.id!}
              contentCategory={ContentCategoryEnum.POST}
            />
          </div>
          {/* body and tags */}
          <div
            dangerouslySetInnerHTML={{ __html: post.body ?? "" }}
            className="max-lg:paragraph-3-regular line-clamp-1 text-wrap text-dark-800 max-xl:mt-1  lg:ml-[172px] dark:text-white-100"
          ></div>
          {/* tags and user section */}
          <section className=" flex flex-col justify-between gap-x-3 gap-y-2">
            <div className="my-1 flex flex-wrap gap-x-2 max-lg:gap-x-3">
              {post?.tags!.map((tag: any, index: number) => (
                <ContentTags key={index} tag={tag} />
              ))}
            </div>
            {/* user and aggregates */}
            <div className="my-1 flex w-full justify-between gap-x-3 gap-y-2 align-bottom max-xl:my-0 max-xl:w-full max-xl:flex-col max-lg:flex-col lg:ml-3">
              <UserSection
                image={userData?.image!}
                username={userData?.username!}
                createdAt={post?.createdAt!}
              />

              <div className="flex self-center max-xl:w-full max-lg:-order-1 max-lg:w-full">
                <div className="paragraph-3-regular max-xl:paragraph-4-regular mr-2 flex gap-x-7 whitespace-nowrap max-xl:gap-x-4 max-lg:w-full max-lg:justify-between max-lg:gap-x-1">
                  <span>Views {post.views}</span>
                  <span>Likes {post.likes}</span>
                  <span>Comments {post.commentCount}</span>
                </div>
              </div>
            </div>
          </section>
        </MotionDiv>
      )}
    </>
  );
};

export default PostCard;
