"use client";
import React, { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { User } from "@prisma/client";

import addUser from "@/public/add-user.svg";
import { followUser } from "@/lib/actions/user.actions";
import { ProfilePlaceholder } from "../ui";
import MotionDiv from "../shared/MotionDiv";
import { TopRankUsers } from "@/lib/actions/shared.types";
import { getTopActiveUsers } from "@/lib/actions/group.actions";

const ActiveMemberCard = ({
  loggedInUser,
}: {
  loggedInUser: User & { following: Partial<User[]> };
}) => {
  const { following, clerkID } = loggedInUser;
  const [topUsers, setTopUsers] = useState<TopRankUsers[]>([]);

  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const fetchTopUsers = async () => {
      const users = await getTopActiveUsers();
      if (users.users.length > 0) {
        setTopUsers(users.users);
      }
    };
    fetchTopUsers();
  }, []);

  const handleFollow = async () => {
    startTransition(async () => {
      if (topUsers.filter((user) => user.id !== loggedInUser.id)) {
        await followUser(
          clerkID as string,
          topUsers.find((tU) => tU.id !== loggedInUser.id)?.id!
        );
      }
    });
  };
  const isFollowingUser = (userId: number) => {
    return following.some((followedUser) => followedUser?.id === userId);
  };
  return (
    <div className="flex w-4/5 flex-col justify-center">
      {topUsers &&
        topUsers.map((member) => (
          <div
            key={member?.id || member?.id!}
            className="flex items-center justify-between"
          >
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
                href={`/profile/${member?.id}`}
                className="flex items-center gap-x-2"
              >
                {member?.image ? (
                  <div className="relative size-[30px]">
                    <Image
                      src={member?.image}
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
                  {member?.firstName!} {member?.lastName!}
                </p>
              </Link>
            </MotionDiv>

            <div className="flex gap-x-2">
              {!isFollowingUser &&
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
            </div>
          </div>
        ))}
    </div>
  );
};

export default ActiveMemberCard;
