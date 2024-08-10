import React from "react";

import { getGroupDetails } from "@/lib/actions/group.actions";
import CreateOrEditGroup from "@/components/groups/CreateOrEditGroup";

import { auth } from "@clerk/nextjs/server";
import {
  getLoggedInUser,
  getUser,
  getUserById,
} from "@/lib/actions/user.actions";
import { GroupDetails } from "@/lib/actions/shared.types";

// Forcing component to be dynamic rather than using cache in order to show immediate updates without a refresh
export const dynamic = "force-dynamic";

const EditGroupWrapper = async ({
  params,
}: {
  params: { groupId: string };
}) => {
  const group = (await getGroupDetails(Number(params.groupId))) as GroupDetails;

  const { userId } = await auth();
  const user = await getLoggedInUser();

  return <CreateOrEditGroup group={group} loggedInUserId={user?.user?.id} />;
};

export default EditGroupWrapper;
