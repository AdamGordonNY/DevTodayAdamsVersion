import EditProfile from "@/components/profile/EditProfile";
import ProfileContent from "@/components/profile/ProfileContent";

import {
  getUser,
  getUserById,
  getUserWithContent,
} from "@/lib/actions/user.actions";
import { auth } from "@clerk/nextjs/server";
import React from "react";

const Profile = async ({ params }: { params: { slug: string } }) => {
  const { slug } = params;
  const { userId } = await auth();

  if (!userId) return null;

  const isEdit = slug?.[0] === "edit";

  const profileID = parseInt(slug?.[0]);
  const { user: dbUser } = await getUserWithContent(
    isNaN(profileID) ? userId : profileID
  );

  const { user } = profileID
    ? await getUserById(profileID)
    : await getUser(userId);

  if (isEdit) {
    return <EditProfile user={user!} />;
  }

  return (
    <div className="flex flex-1">
      <ProfileContent
        content={dbUser!}
        className="flex w-full flex-1 flex-col dark:bg-dark-900"
      />
    </div>
  );
};

export default Profile;
