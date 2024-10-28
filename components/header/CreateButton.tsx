"use client";
import React from "react";
import { useMediaQuery } from "usehooks-ts";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import ThinPlus from "../ui/icons/ThinPlus";
import { Button } from "../ui/button";
import { createMenuItems } from "@/lib/constants";
import { useRouter } from "next/navigation";
import Plus from "../ui/icons/Plus";

const MenuButtons = () => {
  const router = useRouter();
  return (
    <div className="mx-1 flex flex-col gap-y-1">
      {createMenuItems.map((item) => (
        <>
          <Button
            key={item.key}
            onClick={() => router.push(item.route)}
            className="paragraph-3-medium align-self-start flex w-full content-start items-center justify-start gap-x-1 rounded-md bg-white-100 align-middle text-dark-900 ring-0 hover:bg-primary-100 dark:bg-dark-800  dark:text-white-200 dark:hover:bg-primary-500"
          >
            <ThinPlus className="size-4 self-center" />
            <span>{item.label}</span>
          </Button>
        </>
      ))}
    </div>
  );
};
const CreateButton = () => {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <Popover key={"menuPopover" + isMobile}>
      <PopoverTrigger className="bg-inherit" aria-label="CreateButton">
        <Plus />
      </PopoverTrigger>
      <PopoverContent className="flex w-full justify-start rounded-lg border border-white-border bg-white-100 p-2 shadow-xl dark:border-dark-700 dark:bg-dark-800">
        <MenuButtons />
      </PopoverContent>
    </Popover>
  );
};

export default CreateButton;
