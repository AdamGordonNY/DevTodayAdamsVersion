import React from "react";

import { getGroupById } from "@/lib/actions/group.actions";

import ContentNotFound from "@/components/shared/ContentNotFound";
import GroupOverview from "@/components/groups/GroupOverview";

const Group = async ({ params }: { params: { groupId: string } }) => {
  const { group, totals } = await getGroupById(params.groupId);

  if (!group) return <ContentNotFound contentCategory="Group" />;

  return <GroupOverview group={group} totals={totals} />;
};

export default Group;
