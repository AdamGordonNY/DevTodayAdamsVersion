import React from "react";

import Performance from "../profile/posts/Performance";
import Recent from "../profile/posts/Recent";

interface RightSidebarProps {
  className?: string;
  children?: React.ReactNode;
  userId?: number;
  firstName?: string;
  lastName?: string;
}

const RightSidebar = async ({
  className,
  children,
  userId,
  firstName,
  lastName,
}: RightSidebarProps) => {
  return (
    <section
      className={`${className} overflow-none flex w-full  flex-col  space-y-5  rounded-[16px] lg:mx-auto lg:w-[325px]`}
    >
      <Recent userId={userId!} firstName={firstName!} lastName={lastName!} />
      <Performance userId={userId} />
    </section>
  );
};

export default RightSidebar;
