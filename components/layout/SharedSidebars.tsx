import React from "react";
import MainLeftSidebar from "../home/MainLeftSidebar";
import BottomLSidebar from "../home/BottomLSidebar";

import TopRightSidebar from "../home/TopRightSidebar";
import SidebarFilter from "../shared/SidebarFilter";
import SidebarTags from "../shared/SidebarTags";
import BottomRSidebar from "../home/BottomRSidebar";
import GroupSidebar from "../home/GroupRightSidebar";
import GroupLeftSidebar from "../home/GroupLeftSidebar";

const SharedSidebars = async ({
  children,
  filter,
  page,
  contentType,
}: {
  contentType?: "meetups" | "posts" | "podcasts" | "groups";
  children: React.ReactNode;
  filter: "newest" | "popular" | "following";
  page: number;
}) => {
  return (
    <section className="layout-wrapper max-lg:flex-1 max-lg:justify-center ">
      <MainLeftSidebar>
        <SidebarFilter />
        {contentType === "groups" ? (
          <GroupLeftSidebar type={contentType!} />
        ) : (
          <SidebarTags />
        )}

        <BottomLSidebar contentType={contentType!} />
      </MainLeftSidebar>
      <>{children}</>

      <section className="flex flex-col gap-y-5 max-[1340px]:hidden lg:w-[325px]">
        <TopRightSidebar contentType={contentType!} filter={filter} />
        {contentType === "groups" && (
          <GroupSidebar type="groups" filter={filter} />
        )}
        <BottomRSidebar contentType={contentType!} query={filter} />
      </section>
    </section>
  );
};

export default SharedSidebars;
