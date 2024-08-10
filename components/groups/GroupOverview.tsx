import React from "react";

import { getLoggedInUser, getUserById } from "@/lib/actions/user.actions";
import { User } from "@prisma/client";
import GroupLeftSidebar from "./GroupLeftSidebar";
import GroupRightSidebar from "./GroupRightSidebar";

import { getTopRankGroups } from "@/lib/actions/group.actions";
import { GroupDetails, TopRankGroups } from "@/lib/actions/shared.types";
import GroupDetailsSection from "./GroupDetailsSection";

const GroupOverview = async ({ group }: { group: GroupDetails }) => {
  const groupUser = await getLoggedInUser();
  const { groupUsers, meetups, podcasts, posts } = group;

  const topGroups = (await getTopRankGroups()) as TopRankGroups[];

  const groupOwner = await getUserById(group.createdBy);
  // Filter to find users with roles 'ADMIN' or 'OWNER'
  const isAdmin = groupUsers.filter(
    (user) => user.role === "ADMIN" || user.role === "OWNER"
  );

  // Check if the logged-in user is an admin or owner
  const isUserAdmin = isAdmin.some(
    (user) => user.userId === groupUser?.user?.id
  );

  // Determine the logged-in user's role within the group
  const userRoleInGroup =
    groupUser?.user?.groupRoles.find((role) => role.groupId === group.id)
      ?.role || "MEMBER";
  return (
    <section className="m-8 flex w-full justify-center gap-4 max-md-a:flex-col max-md:mb-28">
      <div className="flex min-w-[200px] basis-1/6 max-md-a:order-2 max-md:w-full lg:max-w-[200px]">
        <GroupLeftSidebar group={group} topRankedGroups={topGroups} />
      </div>

      <div className="flex min-w-[350px] flex-1 flex-col max-md-a:-order-1">
        <GroupDetailsSection
          group={group}
          user={groupUser.user}
          role={userRoleInGroup}
          owner={groupOwner! as unknown as User}
        />
      </div>

      <div className="flex min-w-[330px] basis-2/6 max-md-a:order-3 max-md-a:w-full lg:max-w-[330px]">
        <GroupRightSidebar
          group={group}
          loggedIn={groupUser?.user as User}
          users={group.groupUsers}
        />
      </div>
    </section>
  );
};

export default GroupOverview;
