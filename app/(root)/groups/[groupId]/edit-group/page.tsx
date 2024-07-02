import React from "react";

import { redirect } from "next/navigation";

import { isUserAuthor } from "@/lib/actions/user.actions";
import { getGroupById } from "@/lib/actions/group.actions";
import CreateOrEditGroup from "@/components/groups/CreateOrEditGroup";
import { GroupContent } from "@/lib/types.d";

// Forcing component to be dynamic rather than using cache in order to show immediate updates without a refresh
export const dynamic = "force-dynamic";

const EditGroupWrapper = async ({
  params,
}: {
  params: { groupId: string };
}) => {
  const group = await getGroupById(params.groupId);
  const { isAuthor } = await isUserAuthor(group?.group?.author.id as number);

  if (!isAuthor) redirect("/");

  return <CreateOrEditGroup group={group?.group as GroupContent} />;
};

export default EditGroupWrapper;
