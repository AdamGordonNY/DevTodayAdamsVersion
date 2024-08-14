import {
  GroupUserWithFollowDetails,
  LoggedInUserContent,
} from "@/lib/actions/shared.types";

import GroupMembersCard from "./GroupMembersCard";

const GroupMembersTab = ({
  member,
  loggedInUser,
  isLoggedInUserAdmin,
  isMemberAdmin = false,
}: {
  member: GroupUserWithFollowDetails;
  loggedInUser: Partial<LoggedInUserContent>;
  isLoggedInUserAdmin: boolean;
  isMemberAdmin?: boolean;
}) => {
  return (
    <div className="rounded-lg p-4 dark:bg-dark-800">
      <GroupMembersCard
        member={{
          id: member.id!,
          followers: member.followers,
          following: member.following,
          username: member.username,
          image: member.image,
        }}
        loggedInUser={loggedInUser!}
        isLoggedInUserAdmin={isLoggedInUserAdmin}
        isMemberAdmin={isMemberAdmin}
      />
    </div>
  );
};

export default GroupMembersTab;
