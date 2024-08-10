"use client";

import React from "react";

import { User } from "@prisma/client";
import { GroupLoggedInUser } from "@/lib/types.d";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import MeetupCard from "@/components/profile/posts/MeetupCard";
import PostCard from "@/components/profile/posts/PostCard";
import PodcastCard from "@/components/profile/posts/PodcastCard";
import GroupMembersTab from "./GroupMembersTab";
import { GroupDetails } from "@/lib/actions/shared.types";

const GroupTabs = ({
  group,
  user,
  isAdmin,
}: {
  group: GroupDetails;
  user: User;
  isAdmin: boolean;
}) => {
  const [tabValue, setTabValue] = React.useState<string>("Posts");
  const tabsList = ["Posts", "Meetups", "Podcasts", "Members"];
  const groupUsers = group.groupUsers.map((grpUser) => grpUser.user);
  const groupAdmins = [
    ...group.groupUsers.filter(
      (user) => user.role === "ADMIN" || user.role === "OWNER"
    ),
  ];
  const groupMembers = [
    ...group.groupUsers.filter((user) => user.role === "MEMBER"),
  ];
  const allMembers = [...groupMembers, ...groupAdmins];

  return (
    <Tabs defaultValue={tabValue} onValueChange={(value) => setTabValue(value)}>
      <div className="flex h-[76px] w-full items-center justify-between gap-y-2.5 rounded-lg bg-white-100 px-7 text-white-400 max-md-b:h-[64px] dark:bg-dark-800 dark:text-white-100">
        <TabsList className="gap-x-auto flex w-full ">
          {tabsList.map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="dark:text-white-30 max-md-b:paragraph-3-medium paragraph-1-medium flex w-1/5 rounded-[7px] px-2 text-white-400 transition duration-200 ease-in hover:bg-primary-500 hover:text-white-200"
            >
              {tab}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      <TabsContent value="Posts" className="mt-4 flex w-full flex-col gap-y-5 ">
        {group.posts?.map((post: any, index: number) => (
          <PostCard
            key={index}
            userData={group}
            post={{
              ...post,
              commentCount: post.commentCount,
              tags: post.tags,
            }}
          />
        ))}
      </TabsContent>
      <TabsContent
        value="Meetups"
        className="mt-4 flex w-full flex-col gap-y-5 "
      >
        {group.meetups?.map((meetup: any, index: number) => (
          <MeetupCard key={index} meetup={meetup} />
        ))}
      </TabsContent>
      <TabsContent
        value="Podcasts"
        className="mt-4 flex w-full flex-col gap-y-5 "
      >
        <div className="columns-2 space-y-4 max-lg:mt-4 max-lg:columns-1">
          {group.podcasts?.map((podcast: any, index: number) => (
            <div
              key={index}
              className="rounded-[16px] bg-white-200 dark:bg-dark-800"
            >
              <PodcastCard key={index} user={group} podcast={podcast} />
            </div>
          ))}
        </div>
      </TabsContent>

      <TabsContent
        value="Members"
        className="mt-4 w-full space-y-2.5 bg-white-200 dark:bg-dark-900"
      >
        <div className=" grid grid-flow-row grid-rows-2 gap-5 max-lg:flex max-lg:flex-col xl:grid-cols-2 ">
          {allMembers?.map((member, index: any) => (
            <div key={index} className="rounded-[16px]">
              <GroupMembersTab
                member={member}
                loggedInUser={user as GroupLoggedInUser}
                isLoggedInUserAdmin={
                  member.role === "ADMIN" ||
                  (member.role === "OWNER" && groupAdmins.includes(member))
                }
                isMemberAdmin={isAdmin}
              />
            </div>
          ))}
        </div>
      </TabsContent>
    </Tabs>
  );
};

export default GroupTabs;
