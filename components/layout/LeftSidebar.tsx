import React from "react";

interface LeftSidebarProps {
  children?: React.ReactNode;
  className?: string;
}
const LeftSidebar = ({ children, className }: LeftSidebarProps) => {
  return (
    <section
      className={`${className} relative  flex flex-col content-center items-center  space-y-[30px] rounded-[16px] bg-white-100 px-5 pb-7 text-center lg:max-w-[210px]    dark:bg-dark-800`}
    >
      {children}
    </section>
  );
};

export default LeftSidebar;
