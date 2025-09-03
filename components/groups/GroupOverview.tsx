import React from "react";

import { getUser } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs/server";

import { User } from "@prisma/client";
import { GroupContent } from "@/lib/types.d";
import GroupLeftSidebar from "./GroupLeftSidebar";
import GroupRightSidebar from "./GroupRightSidebar";
import GroupDetails from "./GroupDetails";

const GroupOverview = async ({ group }: { group: GroupContent }) => {
  const clerkUser = await currentUser();
  const user = clerkUser && (await getUser(clerkUser.id));

  return (
    <section className="m-8 flex w-full justify-center gap-4 max-md-a:flex-col max-md:mb-28">
      <div className="flex min-w-[200px] basis-1/6 max-md-a:order-2 max-md:w-full lg:max-w-[200px]">
        <GroupLeftSidebar group={group} />
      </div>

      <div className="flex min-w-[350px] flex-1 flex-col max-md-a:-order-1">
        <GroupDetails group={group} user={user?.user as User} />
      </div>

      <div className="flex min-w-[330px] basis-2/6 max-md-a:order-3 max-md-a:w-full lg:max-w-[330px]">
        <GroupRightSidebar group={group} user={user?.user as User} />
      </div>
    </section>
  );
};

export default GroupOverview;
