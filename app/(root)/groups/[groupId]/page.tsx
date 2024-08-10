import React from "react";

import { getGroupDetails } from "@/lib/actions/group.actions";

import ContentNotFound from "@/components/shared/ContentNotFound";
import GroupOverview from "@/components/groups/GroupOverview";
import { getUser } from "@/lib/actions/user.actions";
import { auth } from "@clerk/nextjs/server";
import { GroupUserContent } from "@/lib/actions/shared.types";

const Group = async ({ params }: { params: { groupId: string } }) => {
  const group = await getGroupDetails(Number(params.groupId));

  const { userId } = await auth();
  const user = await getUser(userId!);
  if (!group) return <ContentNotFound contentCategory="Group" />;
  if (!user) return <ContentNotFound contentCategory="User" />;
  return <GroupOverview group={group} />;
};

export default Group;
