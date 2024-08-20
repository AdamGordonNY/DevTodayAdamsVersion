"use client";
import React, { useEffect, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";

import addUser from "@/public/add-user.svg";
import { followUser } from "@/lib/actions/user.actions";
import { ProfilePlaceholder } from "../ui";
import MotionDiv from "../shared/MotionDiv";
import { TopRankUsers } from "@/lib/actions/shared.types";
import { GroupLoggedInUser } from "@/lib/types";
import { useRouter } from "next/navigation";
import { toast } from "../ui/use-toast";

const ActiveMemberCards = ({
  loggedInUser,
  user,
}: {
  loggedInUser: GroupLoggedInUser;
  user: TopRankUsers;
}) => {
  const [loggedIn, setLoggedIn] = React.useState<GroupLoggedInUser | null>(
    null
  );
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const handleFollow = async () => {
    const { clerkID } = loggedIn as GroupLoggedInUser;
    startTransition(async () => {
      if (user.id !== loggedInUser.id) {
        const follow = await followUser(clerkID as string, user.id);
        if (follow) {
          toast({
            title: `You are now following ${user.firstName} ${user.lastName}`,
            variant: "default",
            type: "foreground",
          });
          router.refresh();
        }
      }
    });
  };
  useEffect(() => {
    if (loggedInUser) {
      setLoggedIn(loggedInUser);
    }
  }, [loggedInUser]);
  return (
    <div className="flex w-full columns-1 flex-col justify-center gap-3 ">
      {user && (
        <div
          key={user?.id}
          className=" flex w-full  break-inside-avoid-column items-center justify-between "
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
              href={`/profile/${user?.id}`}
              className="flex  w-full items-center gap-x-2"
            >
              {user?.image ? (
                <div className="relative size-[30px]">
                  <Image
                    src={user?.image}
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
                {user?.firstName!} {user?.lastName!}
              </p>
            </Link>
          </MotionDiv>{" "}
          <div className="flex gap-x-2">
            {
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
                  <Image
                    src={addUser}
                    alt="add-user-icon"
                    width={20}
                    height={20}
                  />
                </button>
              </MotionDiv>
            }
          </div>
        </div>
      )}
    </div>
  );
};

export default ActiveMemberCards;
