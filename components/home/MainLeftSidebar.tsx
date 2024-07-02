import React from "react";

interface MainLeftSidebarProps {
  children?: React.ReactNode;
  className?: string;
}
const MainLeftSidebar = ({ children, className }: MainLeftSidebarProps) => {
  return (
    <section
      className={`${className} flex w-[210px] flex-col gap-y-5 max-lg:flex max-lg:w-full`}
    >
      {children}
    </section>
  );
};

export default MainLeftSidebar;
