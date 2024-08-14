"use client";
import React, { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";

import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ConfirmationModal from "../shared/ConfirmationModal";
import { ImagePlaceholder, LeaveGroup, ProfilePlaceholder } from "../ui";
import MotionDiv from "../shared/MotionDiv";
import ContentMenu from "../contentTypes/ContentMenu";
import GroupTabs from "./GroupTabs";
import GroupAboutSection from "./GroupAboutSection";
import {
  GroupDetailsResult,
  GroupOwnerContent,
  GroupUserWithFollowDetails,
  MeetupContent,
  PostContent,
  PodcastContent,
} from "@/lib/actions/shared.types";

const GroupDetailsSection = ({
  groupData,
  user,
  role,
  owner,
  isAdmin,
  podcasts,
  meetups,
  posts,
}: {
  groupData: Partial<GroupDetailsResult>;
  user: GroupUserWithFollowDetails & {
    role: "ADMIN" | "OWNER" | "MEMBER" | "GUEST";
  };
  role: "ADMIN" | "OWNER" | "MEMBER" | "GUEST";
  owner: GroupOwnerContent;
  isAdmin: boolean;
  podcasts: PodcastContent[];
  meetups: MeetupContent[];
  posts: PostContent[];
}) => {
  const { group, members, adminsAndOwners, loggedInUser } = groupData!!;
  const [pending, startTransition] = useTransition();

  const [admins, setAdmins] = useState<Partial<GroupUserWithFollowDetails>[]>(
    []
  );
  const [groupMembers, setGroupMembers] = useState<
    GroupUserWithFollowDetails[]
  >([]);
  const [grpRole, setGrpRole] = useState<
    "ADMIN" | "OWNER" | "MEMBER" | "GUEST"
  >("GUEST");
  useEffect(() => {
    // Initialize the members and admins from the group data
    const initializeGroupData = () => {
      const memberList =
        members?.map((member) => ({
          id: member.id,
          username: member.username,
          image: member.image,
          followers: member.followers!,
          following: member.following!,
        })) || []; // Fallback to empty array if members is undefined or null

      const adminList =
        adminsAndOwners?.map((admin) => ({
          id: admin.id,
          username: admin.username,
          image: admin.image,
          followers: admin.followers!,
          following: admin.following!,
        })) || []; // Fallback to empty array if adminsAndOwners is undefined or null

      const loggedInUserRole = loggedInUser?.role || "GUEST"; // Fallback to "GUEST" if role is undefined

      setGrpRole(loggedInUserRole);
      setGroupMembers(memberList);
      setAdmins(adminList);
    };

    initializeGroupData();
  }, [
    adminsAndOwners,
    groupData.adminsAndOwners,
    groupData.members,
    loggedInUser?.role,
    members,
  ]);
  const handleAddOrRemoveUser = async () => {
    startTransition(async () => {
      // Call the function to add or remove user from group
      // await addOrRemoveGroupUser(group.group?.id!, user.id);
    });
  };

  return (
    <section className="flex w-full flex-col gap-y-5">
      <div className="rounded-lg bg-white-100 p-3 text-white-400 dark:bg-dark-800">
        {/* Group Cover Image */}
        {group?.coverImage ? (
          <div className="relative h-[174px]">
            <Image
              src={group?.coverImage!}
              alt="group-cover-image"
              fill
              className="rounded-2xl object-cover"
            />
          </div>
        ) : (
          <div className="flex h-[174px] items-center justify-center rounded-2xl bg-white-100 dark:bg-dark-800">
            <ImagePlaceholder
              size={174}
              className="text-white-300 dark:text-white-400"
            />
          </div>
        )}

        {/* Group Profile Image and Details */}
        <div className="mt-3 flex w-full items-center gap-x-6 p-3">
          <div className="flex">
            {group?.profileImage ? (
              <div className="relative size-[70px]">
                <Image
                  src={group?.profileImage!}
                  alt="group-cover-image"
                  fill
                  className="rounded-full"
                />
              </div>
            ) : (
              <ProfilePlaceholder size={70} className="shrink-0" />
            )}
          </div>

          <div className="flex w-full justify-between">
            <div className="flex flex-col">
              <h1 className="display-2-bold dark:text-white-100">
                {group?.name! ?? "Missing Group Name!"}
              </h1>
              <p className="mt-1 flex">Created by {owner?.username!}</p>
            </div>

            <div className="flex gap-x-2">
              {/* Join or Leave Group Button */}
              {loggedInUser?.role !== "GUEST" ? (
                <Dialog>
                  <DialogTrigger className="flex align-top">
                    <MotionDiv
                      whileHover={{
                        translateX: 8,
                      }}
                      transition={{ type: "spring", stiffness: 400 }}
                      whileTap={{ scale: 1.1 }}
                      className="flex h-8 w-[119px] cursor-pointer items-center justify-center rounded-md bg-white-200 dark:bg-dark-700"
                    >
                      <LeaveGroup className="items-center fill-white-400 dark:fill-white-300" />
                      <p className="paragraph-4-medium text-white-400 dark:text-white-300">
                        Leave Group
                      </p>
                    </MotionDiv>
                  </DialogTrigger>

                  <ConfirmationModal
                    contentCategory="Group"
                    confirmationType="Leave"
                    onSubmit={handleAddOrRemoveUser}
                    isSubmitting={pending}
                  />
                </Dialog>
              ) : (
                <MotionDiv
                  whileHover={{
                    translateX: -8,
                  }}
                  transition={{ type: "spring", stiffness: 400 }}
                  whileTap={{ scale: 1.1 }}
                  className="flex h-8 w-[92px] cursor-pointer justify-center rounded-md bg-primary-500"
                >
                  <button
                    className="paragraph-4-medium text-white-100"
                    type="button"
                    onClick={handleAddOrRemoveUser}
                    disabled={pending}
                  >
                    {pending ? (
                      <Loader2 size={20} className="animate-spin" />
                    ) : (
                      "Join Group"
                    )}
                  </button>
                </MotionDiv>
              )}

              {/* Admin Content Menu */}
              {loggedInUser?.role === "ADMIN" && (
                <ContentMenu
                  contentId={groupData?.group?.id!}
                  contentCategory="Group"
                />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Group About Section */}
      <div className="md-a:hidden">
        <GroupAboutSection about={groupData?.group?.about!} />
      </div>

      {/* Group Tabs */}
      {members !== undefined && user && groupData?.group! && (
        <GroupTabs
          posts={posts}
          podcasts={podcasts}
          meetups={meetups}
          members={members!}
          group={groupData?.group!}
          user={{
            id: user?.id!,
            followers: user?.followers!,
            following: user?.following!,
            username: user?.username!,
            image: user?.image!,
            role: loggedInUser?.role!,
            clerkID: user?.clerkID!,
          }}
          isAdmin={
            loggedInUser?.role === "ADMIN" || loggedInUser?.role === "OWNER"
          }
        />
      )}
    </section>
  );
};

export default GroupDetailsSection;
