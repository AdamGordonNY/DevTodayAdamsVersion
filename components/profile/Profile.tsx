"use client";
import React, { useTransition } from "react";
import { Button } from "../ui/button";

import { Separator } from "../ui/separator";

import gradient from "@/public/profile-top.svg";
import { getTimeDifference } from "@/lib/utils";
import Image from "next/image";
import { SocialMedia, User } from "@prisma/client";
import { followUser, unfollowUser } from "@/lib/actions/user.actions";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import RenderSocialLink from "./RenderSocialLink";
import ContainedImage from "../shared/ContainedImage";

interface ProfileProps {
  user?: Partial<User> & {
    SocialMedia: SocialMedia[];
    followers: User[];
    following: User[];
  };
}
const Profile = ({ user }: ProfileProps) => {
  const [pending, startTransition] = useTransition();
  const { user: currentUser } = useUser();
  const router = useRouter();

  const followerCount = user?.followers?.length;
  const followingCount = user?.following?.length;

  const handleFollow = async () => {
    const idToFollow = user?.id;
    const userFollowing = currentUser?.id;
    startTransition(async () => {
      await followUser(userFollowing!, idToFollow!);
    });
  };
  const handleUnfollow = async () => {
    const idToFollow = user?.id;
    const userFollowing = currentUser?.id;
    startTransition(async () => {
      await unfollowUser(userFollowing!, idToFollow!);
    });
  };

  const currentUserId = currentUser?.id;
  const isFollowing = user?.followers?.some(
    (follower) => follower?.clerkID! === currentUserId!
  );
  const isCurrentUser = user?.clerkID! === currentUserId!;
  const handleProfileNavigate = async () => {
    startTransition(async () => {
      if (isCurrentUser) router.push(`/profile/edit`);
    });
  };

  return (
    <>
      <div className="absolute flex size-full max-h-[120px] flex-1 ">
        <Image
          src={gradient}
          alt="top-strip"
          fill
          className="rounded-t-[16px] object-cover "
        />
      </div>
      <div className="relative z-10 flex  w-full flex-col content-center items-center justify-between gap-y-[30px]">
        <div className="flex flex-col content-center items-center  justify-center gap-y-[10px] ">
          <ContainedImage
            src={user?.image!}
            alt="user-image"
            width={110}
            height={110}
            className="rounded-full"
          />

          <h3 className="heading-1-medium  text-white-400 dark:text-white-100">
            {user?.firstName!} {user?.lastName!}
          </h3>
          <span className="paragraph-3-regular gap-x-2.5 dark:text-white-400">
            @{user?.username!}
          </span>
        </div>
        {isCurrentUser ? (
          <Button
            className="paragraph-3-bold w-full bg-primary-500 px-1 py-2 lg:w-full dark:text-white-100"
            onClick={handleProfileNavigate}
            disabled={pending}
          >
            Edit Profile {pending && <Loader2 className=" ml-2 animate-spin" />}
          </Button>
        ) : !isFollowing ? (
          <Button
            className="paragraph-3-bold w-full bg-primary-500 px-1 py-2 lg:w-full dark:text-white-100"
            onClick={handleFollow}
            disabled={pending}
          >
            Follow {pending && <Loader2 className=" ml-2 animate-spin" />}
          </Button>
        ) : (
          <Button
            className="paragraph-3-bold w-full bg-primary-500 px-1 py-2 lg:w-full dark:text-white-100"
            onClick={handleUnfollow}
            disabled={pending}
          >
            Unfollow {pending && <Loader2 className=" ml-2 animate-spin" />}
          </Button>
        )}

        <div className="flex flex-col items-center justify-center  dark:text-white-400">
          <span className="paragraph-3-medium text-white-400">
            {followingCount} followed
          </span>
          <span className="paragraph-3-medium text-white-400">
            {followerCount} Following
          </span>
        </div>
        <div
          className="paragraph-3-regular mx-0 flex w-full  flex-wrap content-center items-center justify-center gap-x-2.5  gap-y-[5px] align-middle lg:content-center
      "
        >
          {user?.tech &&
            user.tech.map((tech: any) => (
              <div key={tech} className="inline-flex">
                <span className="items-center gap-x-5 rounded-[4px] bg-white-200 px-2.5  py-1 capitalize text-white-400 dark:bg-dark-700 dark:text-white-200 ">
                  {tech}
                </span>
              </div>
            ))}
        </div>

        <Separator
          orientation="horizontal"
          className="size-px w-full  dark:bg-dark-700 dark:text-dark-700"
        />
        <div className="flex items-center justify-center text-center text-white-400 dark:text-white-300">
          <span className="paragraph-3-regular text-wrap">{user?.bio!}</span>
        </div>
        <div className="flex flex-col items-center gap-y-[14px] align-top text-white-400">
          <RenderSocialLink socialMedia={user?.SocialMedia!} />
          joined {getTimeDifference(user?.createdAt!)}
        </div>
      </div>
    </>
  );
};

export default Profile;
