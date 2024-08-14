import React from "react";
import {
  getFullGroupDetails,
  getTopRankGroups,
} from "@/lib/actions/group.actions";
import ContentNotFound from "@/components/shared/ContentNotFound";
import { getUserIdWithClerkID } from "@/lib/actions/user.actions";
import { GroupDetailsResult, TopRankGroups } from "@/lib/actions/shared.types";
import GroupLeftSidebar from "@/components/groups/GroupLeftSidebar";
import GroupRightSidebar from "@/components/groups/GroupRightSidebar";
import GroupDetailsSection from "@/components/groups/GroupDetailsSection";

const Group = async ({ params }: { params: { groupId: string } }) => {
  const user = await getUserIdWithClerkID();

  const groupData = (await getFullGroupDetails(
    Number(params.groupId),
    user.userId!
  )) as GroupDetailsResult;

  const { group, adminsAndOwners, members, isAdminOrOwner, loggedInUser } =
    groupData;

  const topGroups = (await getTopRankGroups()) as TopRankGroups[];

  if (group?.groupUsers?.length) {
    const loggedInUserRole = group?.groupUsers.find(
      (grpUser) => grpUser.userId === user?.userId!
    )?.role;

    if (loggedInUserRole) {
      console.log(`User is in the group with role: ${loggedInUserRole}`);
    } else {
      console.log("User is not in the group");
    }
  }

  if (!group) return <ContentNotFound contentCategory="Group" />;
  if (!user) return <ContentNotFound contentCategory="User" />;

  return (
    <>
      {" "}
      <section className="m-8 flex w-full justify-center gap-4 max-md-a:flex-col max-md:mb-28">
        <div className="flex min-w-[200px] basis-1/6 max-md-a:order-2 max-md:w-full lg:max-w-[200px]">
          <GroupLeftSidebar
            groupData={groupData!}
            topRankedGroups={topGroups}
          />
        </div>
        <div className="flex min-w-[350px] flex-1 flex-col max-md-a:-order-1">
          <GroupDetailsSection
            groupData={groupData}
            user={loggedInUser!}
            isAdmin={isAdminOrOwner!}
          />
        </div>
        <div className="flex min-w-[330px] basis-2/6 max-md-a:order-3 max-md-a:w-full lg:max-w-[330px]">
          <GroupRightSidebar
            group={group!}
            loggedIn={loggedInUser!}
            users={members!}
            admins={adminsAndOwners!}
          />
        </div>
      </section>
    </>
  );
};

export default Group;
