"use client";

import { UserButton, useUser } from "@clerk/nextjs";

import { useMediaQuery } from "usehooks-ts";

const UserButtonNav = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const { user } = useUser();

  return (
    <>
      <UserButton
        afterSignOutUrl="/sign-in"
        key={isMobile.toString()}
        showName={!isMobile}
        userProfileUrl={`/${user?.id}`}
      />
    </>
  );
};

export default UserButtonNav;
