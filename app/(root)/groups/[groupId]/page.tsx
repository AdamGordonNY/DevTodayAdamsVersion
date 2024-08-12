import React from "react";

import { getFullGroupDetails } from "@/lib/actions/group.actions";

import ContentNotFound from "@/components/shared/ContentNotFound";
import GroupOverview from "@/components/groups/GroupOverview";
import { getUserIdWithClerkID } from "@/lib/actions/user.actions";
import { GroupDetailsResult } from "@/lib/actions/shared.types";

const Group = async ({ params }: { params: { groupId: string } }) => {
  const user = await getUserIdWithClerkID();
  const group = (await getFullGroupDetails(
    Number(params.groupId),
    user.userId!
  )) as GroupDetailsResult;

  console.log(group);
  if (!group) return <ContentNotFound contentCategory="Group" />;
  if (!user) return <ContentNotFound contentCategory="User" />;
  return <GroupOverview group={group} />;
};

export default Group;
