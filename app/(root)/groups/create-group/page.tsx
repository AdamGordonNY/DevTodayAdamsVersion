import React from "react";

import { currentUser } from "@clerk/nextjs";
import { getUser } from "@/lib/actions/user.actions";
import CreateOrEditGroup from "@/components/groups/CreateOrEditGroup";

const CreateGroupWrapper = async () => {
  const clerkUser = await currentUser();
  const user = clerkUser && (await getUser(clerkUser.id));

  return <CreateOrEditGroup loggedInUserId={user?.user?.id as number} />;
};

export default CreateGroupWrapper;
