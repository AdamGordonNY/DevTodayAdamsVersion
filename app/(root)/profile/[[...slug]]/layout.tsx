import LeftSidebar from "@/components/layout/LeftSidebar";
import RightSidebar from "@/components/layout/RightSidebar";
import Profile from "@/components/profile/Profile";
import { getUserById, getUserWithContent } from "@/lib/actions/user.actions";
import { auth } from "@clerk/nextjs/server";
import React from "react";

const Layout = async ({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { slug: string[] };
}) => {
  const { userId } = auth();
  if (!userId) return null;

  const { slug } = params;

  const route = slug?.[0];

  const isEdit = route === "edit";

  const profileID = parseInt(route);

  const { user } = profileID
    ? await getUserById(profileID)
    : await getUserWithContent(userId);

  const socialMediaArray = user?.SocialMedia.map((social) => ({
    id: social.id,
    userId: social.userId,
    platform: social.platform,
    handle: social.handle,
    link: social.link,
  }));

  return (
    <section className="layout-wrapper">
      {!isEdit && (
        <LeftSidebar>
          <Profile
            user={{
              ...user!,
              SocialMedia: socialMediaArray ?? [],
            }}
          />
        </LeftSidebar>
      )}
      <div
        className={
          !isEdit
            ? `flex w-full flex-1 flex-col bg-white-200  max-lg:py-5  dark:bg-dark-900`
            : `flex w-full flex-1 flex-col items-center justify-center  bg-white-200  max-lg:py-5 dark:bg-dark-900`
        }
      >
        {children}
      </div>
      {!isEdit && (
        <RightSidebar
          firstName={user?.firstName!}
          lastName={user?.lastName!}
          userId={user?.id}
        />
      )}
    </section>
  );
};

export default Layout;
