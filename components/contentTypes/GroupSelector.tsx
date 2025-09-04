import React, { useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

import { CaretDown, CaretUp, ProfilePlaceholder } from "@/components/ui";
import { getAllGroups } from "@/lib/actions/group.actions";
import { getUserIdWithClerkID } from "@/lib/actions/user.actions";
import { Group } from "@prisma/client";
import Image from "next/image";

const GroupSelector = ({ onChange, value }: { onChange: any; value: any }) => {
  const [isCaretDown, setCaretDown] = useState(false);
  const [dbUserId, setDbUserId] = useState<number>();
  const [groups, setGroups] = useState<Group[]>([]);

  useEffect(() => {
    const getUserId = async () => {
      const { userId } = await getUserIdWithClerkID();
      if (userId) setDbUserId(userId);
    };

    getUserId();
  }, []);

  useEffect(() => {
    const getGroups = async () => {
      const groups = await getAllGroups(dbUserId as number);
      const extractedGroups = groups && groups.extractedGroups;

      if (extractedGroups) {
        const concatenatedGroups = extractedGroups.adminGroups.concat(
          extractedGroups.memberGroups
        );

        setGroups(concatenatedGroups);
      }
    };

    getGroups();
  }, [dbUserId]);

  return (
    <section className="flex w-full gap-3 max-md:flex-col">
      <DropdownMenu onOpenChange={() => setCaretDown((curr: boolean) => !curr)}>
        <DropdownMenuTrigger
          className="content-dropdown-trigger focus-ring w-full justify-between bg-white-100 px-3 dark:bg-dark-800 dark:disabled:bg-dark-900"
          onClick={() => setCaretDown((curr: boolean) => !curr)}
          disabled={groups.length === 0}
          aria-label="Choose a group"
          aria-haspopup="listbox"
          aria-expanded={isCaretDown}
        >
          {groups.length === 0 ? (
            <p className="paragraph-3-regular flex animate-pulse text-white-400">
              Loading groups...
            </p>
          ) : (
            <>
              <p className="paragraph-3-regular flex truncate text-white-400">
                Select Group |{" "}
                <p className="ml-1 inline-block w-[calc(50vw-40px)] items-center truncate text-left align-middle text-dark-800 dark:text-white-100">
                  {value}
                </p>
              </p>

              <div>
                {isCaretDown ? <CaretUp size={14} /> : <CaretDown size={14} />}
              </div>
            </>
          )}
        </DropdownMenuTrigger>

        <DropdownMenuContent
          className="paragraph-3-medium mt-1 flex w-[calc(100vw-50px)] max-w-[840px] flex-col gap-y-1 bg-white-100 py-2 text-dark-700 dark:bg-dark-800 dark:text-white-200 "
          align="start"
          role="listbox"
          aria-label="Groups"
        >
          {groups.length > 0 &&
            groups.map((group) => {
              const { id, name, about, coverImage } = group;
              return (
                <DropdownMenuItem
                  key={id}
                  className="flex items-center gap-x-3 p-2 dark:text-white-200"
                  textValue={value}
                  role="option"
                  aria-selected={value === name}
                  onSelect={() => onChange({ name, id })}
                >
                  {coverImage ? (
                    <div className="relative size-8 shrink-0">
                      <Image
                        src={coverImage}
                        alt="group-cover-image"
                        fill
                        className="rounded-full"
                      />
                    </div>
                  ) : (
                    <ProfilePlaceholder size={32} className="shrink-0" />
                  )}
                  <div className="group flex w-[calc(80vw-40px)] max-w-[840px]  flex-col">
                    <p className="paragraph-4-medium cursor-pointer truncate text-dark-800 group-hover:text-primary-500 dark:text-white-200">
                      {name}
                    </p>
                    <p className="subtitle-regular cursor-pointer truncate text-white-400 group-hover:text-primary-500">
                      {about}
                    </p>
                  </div>
                </DropdownMenuItem>
              );
            })}
        </DropdownMenuContent>
      </DropdownMenu>
    </section>
  );
};

export default GroupSelector;
