import React from "react";

import { getGroupById } from "@/lib/actions/group.actions";

import Error from "@/components/shared/Error";

import ContentNotFound from "@/components/shared/ContentNotFound";
import GroupOverview from "@/components/groups/GroupOverview";

const Group = async ({ params }: { params: { groupId: string } }) => {
  const { group, error } = await getGroupById(params.groupId);

  if (!group) return <ContentNotFound contentCategory="Meetup" />;
  if (error) return <Error contentCategory="Meetup" error={error} />;

  return <GroupOverview group={group} />;
};

export default Group;
