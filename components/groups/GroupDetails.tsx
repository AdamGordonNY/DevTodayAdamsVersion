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
  const [isMember, setIsMember] = useState<User[]>([]);
  const [isAdmin, setIsAdmin] = useState<User[]>([]);
  const [isOwner, setIsOwner] = useState<User>();
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const assignRoles = async () => {
      const groupAdmins = group.groupUsers.filter((user) => {
        return user.role === "ADMIN" ? user : null;
      });
      groupAdmins.forEach((admin) => {
        if (admin.id === user.id) {
          setIsAdmin([...isAdmin, user]);
        }
      });
      const groupMembers = group.groupUsers.filter((user) => {
        return user.role === "MEMBER" ? user : null;
      });
      groupMembers.forEach((member) => {
        if (member.id === user.id) {
          setIsMember([...isMember, user]);
        }
      });
      const groupOwner = group.groupUsers.filter((user) => {
        return user.role === "OWNER" ? user : null;
      });
      groupOwner.forEach((owner) => {
        if (owner.id === user.id) {
          setIsOwner(user);
          setIsAdmin([...isAdmin, user]);
        }
      });
    };
    assignRoles();
  }, [group.createdBy, group.groupUsers, isAdmin, isMember, user, user.id]);

  const handleAddOrdRemove = async () => {
    startTransition(async () => {
      await addOrRemoveGroupUser(group.id, user.id);
    });
  };

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
                Created by {group.createdByUser?.firstName}{" "}
                {group.createdByUser?.lastName}
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
        isAdmin={isAdmin.includes(user) || isOwner === user}
      />
    </section>
  );
};

export default GroupDetails;
