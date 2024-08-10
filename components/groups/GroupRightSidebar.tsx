"use client";
import React, { useEffect } from "react";

import Image from "next/image";
import Link from "next/link";

import { User } from "@prisma/client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ProfilePlaceholder } from "../ui";
import { MeetupContent } from "@/lib/types.d";
import GroupMeetupCard from "./GroupMeetupCard";
import GroupMembersCard from "./GroupMembersCard";
import MotionDiv from "../shared/MotionDiv";
import { randomUUID } from "crypto";
import {
  GroupDetailsResult,
  GroupUserFields,
  LoggedInUserContent,
} from "@/lib/actions/shared.types";

const GroupRightSidebar = ({
  group,
  loggedIn,
  users,
  admins,
}: {
  group: GroupDetailsResult;
  loggedIn: LoggedInUserContent;
  users: {
    id: number;
    username: string | null;
    image: string | null;
    followers: User[];
    following: User[];
  }[];
  admins: {
    id: number;
    username: string | null;
    image: string | null;
    followers: User[];
    following: User[];
  }[];
}) => {
  const [meets, setMeets] = React.useState<MeetupContent[]>([]);
  const [groupMembers, setGroupMembers] = React.useState<GroupUserFields[]>([]);
  const [groupAdmins, setGroupAdmins] = React.useState<GroupUserFields[]>([]);
  console.log(users);
  useEffect(() => {
    const roleAssign = async () => {
      const grpAdmins = admins.map((admin) => admin);
      const allMembers = users.map((member) => member);
      setGroupAdmins(grpAdmins);
      setGroupMembers(allMembers);
    };
    roleAssign();
  }, [admins, users]);
  const renderMeetups =
    group?.meetups?.length > 0 ? (
      group?.meetups?.map((meetup, idx) => {
        return (
          <MotionDiv
            key={idx}
            whileHover={{
              scale: 1.03,
            }}
            transition={{
              duration: 0.2,
              ease: "linear",
            }}
          >
            <GroupMeetupCard meetup={meetup} />
          </MotionDiv>
        );
      })
    ) : (
      <h1 className="paragraph-3-medium flex gap-x-1 text-white-400 dark:text-white-300">
        No Meetups
      </h1>
    );

  return (
    <section className="flex w-full flex-col gap-y-5">
      <section className="flex flex-col gap-5 rounded-lg bg-white-100 p-5 text-white-400 max-md-a:hidden dark:bg-dark-800">
        <p className="paragraph-2-bold mb-1 text-dark-800 dark:text-white-200">
          Meetups
        </p>
        {renderMeetups}
      </section>

      <section className="paragraph-2-medium flex flex-col rounded-lg bg-white-100 p-4  text-white-400 dark:bg-dark-800">
        <div className="flex items-center justify-between">
          <p className="paragraph-2-bold text-dark-800 dark:text-white-200">
            Active Members
          </p>
          <p className="paragraph-4-regular text-white-400 dark:text-white-300">
            View All
          </p>
        </div>

        <div className="mt-5 flex flex-wrap justify-start gap-6">
          {groupMembers.length > 0 ? (
            groupMembers.map((member, idx) => (
              <React.Fragment key={idx}>
                <TooltipProvider>
                  <Tooltip>
                    <MotionDiv
                      key={idx}
                      whileHover={{
                        scale: 1.2,
                      }}
                      transition={{
                        duration: 0.2,
                        ease: "linear",
                      }}
                      className="flex"
                    >
                      <Link
                        href={`/profile/${member.id!}`}
                        className="relative size-10"
                      >
                        <TooltipTrigger>
                          <Image
                            src={member.image!}
                            alt="members-profile-image"
                            fill
                            className="rounded-full"
                          />
                        </TooltipTrigger>
                      </Link>
                    </MotionDiv>
                    <TooltipContent
                      className="caption-8 border border-white-border bg-white-100 text-dark-700 dark:border-dark-border dark:bg-dark-800 dark:text-white-300"
                      align="center"
                    >
                      {member.username}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </React.Fragment>
            ))
          ) : (
            <MotionDiv
              whileHover={{
                scale: 1.2,
              }}
              transition={{
                duration: 0.2,
                ease: "linear",
              }}
              className="flex cursor-pointer"
            >
              <ProfilePlaceholder size={40} className="shrink-0" />
            </MotionDiv>
          )}
        </div>
      </section>

      <section className="paragraph-2-medium flex flex-col rounded-lg bg-white-100 p-4  text-white-400 dark:bg-dark-800">
        <div className="flex items-center justify-between">
          <p className="paragraph-2-bold text-dark-700 dark:text-white-200">
            Group Admins
          </p>
          <p className="paragraph-4-regular text-white-400 dark:text-white-300">
            View All
          </p>
        </div>
        <div className="mt-5 flex flex-col justify-between gap-4">
          {groupAdmins &&
            groupAdmins.map((admin) => {
              return (
                <GroupMembersCard
                  key={admin.id}
                  member={admin}
                  loggedInUser={loggedIn}
                  isMemberAdmin={true}
                />
              );
            })}
        </div>
      </section>
    </section>
  );
};

export default GroupRightSidebar;
