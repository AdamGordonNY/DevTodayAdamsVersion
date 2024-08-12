"use client";
import React, { useTransition } from "react";

import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";

import { User } from "@prisma/client";

import addUser from "@/public/add-user.svg";
import { followUser } from "@/lib/actions/user.actions";
import { ProfilePlaceholder } from "../ui";
import MotionDiv from "../shared/MotionDiv";
import GroupMembersMenu from "./GroupMembersMenu";
import { LoggedInUserContent } from "@/lib/actions/shared.types";

const GroupMembersCard = ({
  member,
  loggedInUser,
  isLoggedInUserAdmin = false,
  isMemberAdmin = false,
}: {
  member: {
    id: number;
    username: string | null;
    image: string | null;
    followers: User[];
    following: User[];
  };
  loggedInUser: LoggedInUserContent;
  isLoggedInUserAdmin?: boolean;
  isMemberAdmin?: boolean;
}) => {
  const { following, followers, id, username, image, clerkID } = loggedInUser;
  const [pending, startTransition] = useTransition();
  const isFollowing = following.some((follow) => follow.id === member.id);

  const handleFollow = async () => {
    startTransition(async () => {
      await followUser(clerkID as string, member.id);
    });
  };

  return (
    <div key={member.id} className="flex items-center justify-between">
      <MotionDiv
        whileHover={{
          scale: 1.2,
          originX: 0,
        }}
        transition={{
          duration: 0.2,
          ease: "linear",
        }}
      >
        <Link
          href={`/profile/${member.id}`}
          className="flex items-center gap-x-2"
        >
          {member.image ? (
            <div className="relative size-[30px]">
              <Image
                src={member.image!}
                alt="member-image"
                fill
                className="rounded-full"
              />
            </div>
          ) : (
            <div>
              <ProfilePlaceholder size={30} className="shrink-0" />
            </div>
          )}

          <p className="paragraph-3-medium text-dark-700 dark:text-white-300">
            {member.username}
          </p>
        </Link>
      </MotionDiv>

      <div className="flex gap-x-2">
        {!isFollowing &&
          (pending ? (
            <Loader2 className="animate-spin text-white-300" />
          ) : (
            <MotionDiv
              whileHover={{
                scale: 1.4,
              }}
              transition={{
                duration: 0.2,
                ease: "linear",
              }}
            >
              <button
                className="relative size-[15px]"
                type="button"
                onClick={handleFollow}
                disabled={pending}
              >
                <Image src={addUser} alt="add-user-icon" />
              </button>
            </MotionDiv>
          ))}

        {!isMemberAdmin && isLoggedInUserAdmin && (
          <MotionDiv
            whileHover={{
              scale: 1.4,
            }}
            transition={{
              duration: 0.2,
              ease: "linear",
            }}
          >
            <GroupMembersMenu memberId={member.id} />
          </MotionDiv>
        )}
      </div>
    </div>
  );
};

export default GroupMembersCard;
