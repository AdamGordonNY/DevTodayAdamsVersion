"use client";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { getFollowerCount } from "@/lib/actions/user.actions";
import { useUser } from "@clerk/nextjs";
import { getJoinedGroupCount } from "@/lib/actions/group.actions";
import { usePathname } from "next/navigation";

interface SidebarButtonProps {
  label: string;
  icon: React.ReactNode;
  onSelect: () => void;
  className?: string;
}

const SidebarButton = ({
  label,
  icon,
  onSelect,
  className,
}: SidebarButtonProps) => {
  const { user } = useUser();
  const [followerCount, setFollowerCount] = useState<number | null>(null);

  const pathname = usePathname();
  useEffect(() => {
    const fetchFollowerCount = async () => {
      if (user?.id) {
        if (pathname !== "/groups" && label.toLowerCase() === "following") {
          const followers = await getFollowerCount(user.id);
          setFollowerCount(followers.followerCount ?? null);
        } else if (pathname === "/groups" && label.toLowerCase() === "joined") {
          const getJoinedCount = await getJoinedGroupCount();
          setFollowerCount(getJoinedCount);
        }
      }
    };
    fetchFollowerCount();
  }, [label, pathname, user?.id]);

  return (
    <Button
      onClick={onSelect}
      className={`${className} h-10 rounded-md  lg:w-[167px]`}
    >
      <div className="flex w-full items-center gap-x-2.5">
        <div className="flex size-7 items-center  justify-center rounded-md bg-white-200 p-1 dark:bg-dark-700">
          {icon}
        </div>
        <div className="flex w-full items-center justify-between pl-2">
          <span className="paragraph-4-medium text-dark-900 dark:text-white-100">
            {label}
          </span>

          {followerCount !== null && (
            <div className="caption-10 flex size-5 flex-col items-center justify-center rounded bg-primary-500 py-[3px] text-white-100 max-lg:hidden">
              {followerCount}
            </div>
          )}
        </div>
      </div>
    </Button>
  );
};

export default SidebarButton;
