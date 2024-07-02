"use client";
import React, { useEffect, useState, useTransition } from "react";

import Image from "next/image";
import { Loader2 } from "lucide-react";

import { User } from "@prisma/client";
import { GroupContent, GroupTabContent } from "@/lib/types.d";
import { addOrRemoveGroupUser } from "@/lib/actions/group.actions";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import ConfirmationModal from "../shared/ConfirmationModal";
import { ImagePlaceholder, LeaveGroup, ProfilePlaceholder } from "../ui";
import MotionDiv from "../shared/MotionDiv";
import ContentMenu from "../contentTypes/ContentMenu";
import GroupTabs from "./GroupTabs";
import GroupAboutSection from "./GroupAboutSection";

const GroupDetails = ({ group, user }: { group: GroupContent; user: User }) => {
  const [isMember, setIsMember] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (group.admins.length > 0) {
      setIsAdmin(
        group.admins.some((admin) => user.id === admin.id) ||
          group.authorId === user.id
      );
    }
  }, [group.admins, group.authorId, isAdmin, user.id]);

  const handleAddOrdRemove = async () => {
    startTransition(async () => {
      await addOrRemoveGroupUser(group.id, user.id);
    });
  };

  useEffect(() => {
    const allMembers = group.admins.concat(group.members);
    if (allMembers.length > 0) {
      setIsMember(allMembers.some((member) => user.id === member.id));
    }
  }, [isMember, group, user.id]);

  return (
    <section className="flex w-full flex-col gap-y-5">
      <div className="rounded-lg bg-white-100 p-3 text-white-400 dark:bg-dark-800">
        {group.coverImage ? (
          <div className="relative h-[174px]">
            <Image
              src={group.coverImage}
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

        <div className="mt-3 flex w-full items-center gap-x-6 p-3">
          <div className="flex">
            {group.profileImage ? (
              <div className="relative size-[70px]">
                <Image
                  src={group.profileImage}
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
                {group.name ?? "Missing Post Title!"}
              </h1>
              <p className="mt-1 flex">
                Created by {group.author.firstName} {group.author.lastName}
              </p>
            </div>

            <div className="flex gap-x-2">
              {isMember ? (
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
                    onSubmit={handleAddOrdRemove}
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
                    onClick={handleAddOrdRemove}
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

              {isAdmin && (
                <ContentMenu contentId={group.id} contentCategory="Group" />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="md-a:hidden">
        <GroupAboutSection about={group.about} />
      </div>
      <GroupTabs
        group={group as GroupTabContent}
        user={user}
        isAdmin={isAdmin}
      />
    </section>
  );
};

export default GroupDetails;
