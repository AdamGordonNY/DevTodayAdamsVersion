import { User } from "@prisma/client";
import { GroupLoggedInUser } from "@/lib/types.d";

import GroupMembersCard from "./GroupMembersCard";

const GroupMembersTab = ({
  member,
  loggedInUser,
  isLoggedInUserAdmin,
  isMemberAdmin = false,
}: {
  member: User;
  loggedInUser: GroupLoggedInUser;
  isLoggedInUserAdmin: boolean;
  isMemberAdmin?: boolean;
}) => {
  return (
    <div className="rounded-lg p-4 dark:bg-dark-800">
      <GroupMembersCard
        member={member}
        loggedInUser={loggedInUser}
        isLoggedInUserAdmin={isLoggedInUserAdmin}
        isMemberAdmin={isMemberAdmin}
      />
    </div>
  );
};

export default GroupMembersTab;
