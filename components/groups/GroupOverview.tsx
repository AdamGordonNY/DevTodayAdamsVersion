import React from "react";

import GroupLeftSidebar from "./GroupLeftSidebar";
import GroupRightSidebar from "./GroupRightSidebar";

import { getTopRankGroups } from "@/lib/actions/group.actions";
import { GroupDetailsResult, TopRankGroups } from "@/lib/actions/shared.types";
import GroupDetailsSection from "./GroupDetailsSection";

const GroupOverview = async ({ group }: { group: GroupDetailsResult }) => {
  const {
    loggedInUser,
    isAdminOrOwner,
    adminsAndOwners,
    members,

    owner,
    loggedInUserRole,
  } = group;

  const topGroups = (await getTopRankGroups()) as TopRankGroups[];

  return (
    <section className="m-8 flex w-full justify-center gap-4 max-md-a:flex-col max-md:mb-28">
      <div className="flex min-w-[200px] basis-1/6 max-md-a:order-2 max-md:w-full lg:max-w-[200px]">
        <GroupLeftSidebar group={group} topRankedGroups={topGroups} />
      </div>

      <div className="flex min-w-[350px] flex-1 flex-col max-md-a:-order-1">
        <GroupDetailsSection
          group={group}
          user={loggedInUser!}
          role={
            (loggedInUserRole! as "ADMIN") || "OWNER" || "MEMBER" || "GUEST"
          }
          owner={owner!}
          isAdmin={isAdminOrOwner!}
        />
      </div>

      <div className="flex min-w-[330px] basis-2/6 max-md-a:order-3 max-md-a:w-full lg:max-w-[330px]">
        <GroupRightSidebar
          group={group}
          loggedIn={loggedInUser}
          users={members}
          admins={adminsAndOwners}
        />
      </div>
    </section>
  );
};

export default GroupOverview;
