"use client";
import React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import SidebarButton from "./SidebarButton";
import Newest from "../ui/icons/Newest";
import Popular from "../ui/icons/Popular";
import Following from "../ui/icons/Following";
import { groupSidebarButtons, sidebarButtons } from "@/lib/constants";

const SidebarFilter = ({ className }: { className?: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("filter");
  const pathname = usePathname();
  const handleSelectButton = (item: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("filter", item.toLowerCase());
    params.set("page", "1");
    router.push(`${window.location.pathname}?${params.toString()}`, undefined);
  };

  return (
    <div
      className={`filter-wrapper responsive-filter bg-white-100 dark:bg-dark-800 ${className}`}
    >
      <div className="flex w-full flex-col lg:p-5">
        <div className="paragraph-2-bold flex justify-start bg-white-100 text-dark-900 max-lg:hidden dark:bg-dark-800 dark:text-white-200">
          <span>Sort & Filter</span>
        </div>
        <div className="flex w-full flex-col justify-start gap-x-1 gap-y-2.5 py-1 max-lg:flex-row max-lg:justify-around max-lg:p-0 lg:pr-5">
          {pathname === "/groups"
            ? groupSidebarButtons.map((button) => (
                <div
                  key={button.key}
                  className={`w-full rounded-md  ${
                    active === button.key &&
                    "items-center rounded-md bg-white-200  text-white-100 dark:bg-dark-700 dark:text-white-100"
                  }`}
                >
                  <SidebarButton
                    key={button.key}
                    label={
                      pathname === "/groups" && button.key === "groups"
                        ? "Joined Groups"
                        : button.label
                    }
                    icon={getIcon(button.key)}
                    onSelect={() => handleSelectButton(button.key)}
                    className={`flex w-full gap-x-1 rounded-md bg-white-100 px-0 py-1.5 text-dark-900 hover:bg-white-200 hover:text-dark-900 dark:bg-dark-800 dark:hover:bg-dark-700 dark:hover:text-white-200 ${
                      active === button.key &&
                      "bg-white-200 text-white-100 dark:bg-dark-700 dark:text-white-100"
                    }`}
                  />
                </div>
              ))
            : sidebarButtons.map((button) => (
                <div
                  key={button.key}
                  className={`w-full rounded-md  ${
                    active === button.key &&
                    "items-center rounded-md bg-white-200  text-white-100 dark:bg-dark-700 dark:text-white-100"
                  }`}
                >
                  <SidebarButton
                    key={button.key}
                    label={
                      pathname === "/groups" && button.key === "groups"
                        ? "Joined Groups"
                        : button.label
                    }
                    icon={getIcon(button.key)}
                    onSelect={() => handleSelectButton(button.key)}
                    className={`flex w-full gap-x-1 rounded-md bg-white-100 px-0 py-1.5 text-dark-900 hover:bg-white-200 hover:text-dark-900 dark:bg-dark-800 dark:hover:bg-dark-700 dark:hover:text-white-200 ${
                      active === button.key &&
                      "bg-white-200 text-white-100 dark:bg-dark-700 dark:text-white-100"
                    }`}
                  />
                </div>
              ))}
        </div>
      </div>
    </div>
  );
};

export const getIcon = (key: string) => {
  switch (key) {
    case "newest":
      return <Newest size={20} className="left-1" />;
    case "popular":
      return <Popular size={20} className="left-1" />;
    case "following":
    case "joined":
      return <Following size={20} className="left-1" />;
    default:
      return null;
  }
};

export default SidebarFilter;
