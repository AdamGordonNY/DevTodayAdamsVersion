"use client";
import React, { useEffect, useState, useTransition } from "react";

import Image from "next/image";
import { Loader2 } from "lucide-react";

import { User } from "@prisma/client";
// import { addOrRemoveGroupUser } from "@/lib/actions/group.actions";
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
  LoggedInUserContent,
} from "@/lib/actions/shared.types";
import { RoleEnum } from "@/lib/types";

const GroupDetailsSection = ({
  group,
  user,
  role,
  owner,
  isAdmin,
}: {
  group: GroupDetailsResult;
  user: LoggedInUserContent;
  role: "ADMIN" | "OWNER" | "MEMBER" | "GUEST";
  owner: GroupOwnerContent;
  isAdmin: boolean;
}) => {
  const [isMember, setIsMember] = useState<Partial<User>[]>([]);
  const [admins, setAdmins] = useState<Partial<User>[]>([]);
  const [isOwner, setIsOwner] = useState<Partial<User>>(owner!);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const assignStates = async () => {
      const members = group.members!.map((member) => ({
        id: member.id,
        username: member.username,
        image: member.image,
      }));
      const admins = group.adminsAndOwners!.filter((member) => ({
        id: member.id,
        username: member.username,
        image: member.image,
      }));
      setIsMember(members);
      setAdmins(admins);
      if (isOwner.id === user.id) {
        setIsOwner(user);
      }
    };
    assignStates().then();
  }, [group.members, group.adminsAndOwners, isOwner, user.id, user]);

  const handleAddOrdRemove = async () => {
    startTransition(async () => {
      // await addOrRemoveGroupUser(group.id, user.id);
    });
  };

  return (
    <section className="flex w-full flex-col gap-y-5">
      <div className="rounded-lg bg-white-100 p-3 text-white-400 dark:bg-dark-800">
        {group?.group?.coverImage ? (
          <div className="relative h-[174px]">
            <Image
              src={group.group.coverImage}
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
            {group?.group?.profileImage ? (
              <div className="relative size-[70px]">
                <Image
                  src={group?.group?.profileImage!}
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
                {group?.group?.name! ?? "Missing Post Title!"}
              </h1>
              <p className="mt-1 flex">Created by{isOwner.username}</p>
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
                <ContentMenu
                  contentId={group?.group?.id!}
                  contentCategory="Group"
                />
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="md-a:hidden">
        <GroupAboutSection about={group?.group?.about!} />
      </div>
      <GroupTabs
        members={isMember!}
        group={group as GroupDetailsResult}
        user={group.loggedInUser}
        isAdmin={isAdmin}
      />
    </section>
  );
};

export default GroupDetailsSection;
