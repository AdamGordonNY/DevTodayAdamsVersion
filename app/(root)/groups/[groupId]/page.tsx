import React from "react";

import { fetchGroup } from "@/lib/actions/group.actions";

import ContentNotFound from "@/components/shared/ContentNotFound";
import GroupOverview from "@/components/groups/GroupOverview";
import { DetailedGroupContent } from "@/lib/types";

const Group = async ({ params }: { params: { groupId: string } }) => {
  const group = (await fetchGroup(
    params.groupId
  )) as unknown as DetailedGroupContent;

  if (!group) return <ContentNotFound contentCategory="Group" />;

  return <GroupOverview group={group} />;
};

export default Group;
