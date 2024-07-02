"use client";

import React, { useEffect, useState, useRef, useTransition } from "react";

import { User } from "@prisma/client";
import useOutsideClickHandler from "@/lib/useOutsideClickHandler";
import { SelectedGroupUsers } from "@/lib/types.d";
import { findUsers } from "@/lib/actions/search.actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SearchResultCard from "./SearchResultCard";
import SelectedUserCard from "./SelectedUserCard";
import { GroupSearchMenuSkeleton } from "../shared/Skeletons";

const GroupMemberTags = ({
  setValue,
  formState,
  defaultValue = [],
  memberType,
}: {
  setValue: any;
  formState: any;
  defaultValue?: SelectedGroupUsers[];
  memberType: "admins" | "members";
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<User[]>();
  const [filteredSearchResults, setFilteredSearchResults] = useState<User[]>();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUsers, setSelectedUsers] =
    useState<SelectedGroupUsers[]>(defaultValue);

  useOutsideClickHandler(ref, () => {
    setIsOpen(false);
  });

  useEffect(() => {
    if (searchTerm.length > 0) {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  }, [searchTerm]);

  useEffect(() => {
    setValue(
      memberType === "admins" ? "groupAdmins" : "groupMembers",
      selectedUsers
    );
  }, [setValue, selectedUsers, memberType]);

  useEffect(() => {
    const getUsers = async () => {
      startTransition(async () => {
        const searchResults = await findUsers(searchTerm);
        if (searchResults && searchResults.users && searchTerm.length > 0) {
          setSearchResults(searchResults.users as User[]);
        }
      });
    };
    // to account for delay in react state and prevent loading previous results before the loading state
    if (!isOpen) getUsers();

    const timeout = setTimeout(() => {
      getUsers();
    }, 150);

    return () => clearTimeout(timeout);
  }, [isOpen, memberType, searchTerm, selectedUsers]);

  useEffect(() => {
    const filteredResults = searchResults?.filter((user) => {
      const selectedUser = selectedUsers?.find(
        (selectedUser) => selectedUser.id === user.id
      );
      if (selectedUser) return false;

      const isGroupAdmin =
        formState.groupAdmins.length > 0 &&
        memberType === "members" &&
        formState.groupAdmins.find((admin: User) => admin.id === user.id);
      if (isGroupAdmin) return false;

      const isGroupMember =
        formState.groupMembers.length > 0 &&
        memberType === "admins" &&
        formState.groupMembers.find((member: User) => member.id === user.id);
      if (isGroupMember) return false;

      return true;
    });

    setFilteredSearchResults(filteredResults);
  }, [formState, memberType, searchResults, selectedUsers]);

  const handleSelect = (user: User) => {
    const updatedSelectedUsers = [];

    selectedUsers?.forEach((selectedUser) => {
      if (selectedUser.id !== user.id) {
        updatedSelectedUsers.push({
          firstName: selectedUser.firstName,
          lastName: selectedUser.lastName,
          id: selectedUser.id,
          image: selectedUser.image,
        });
      }
    });
    updatedSelectedUsers.push({
      firstName: user.firstName,
      lastName: user.lastName,
      id: user.id,
      image: user.image,
    });

    setSelectedUsers(updatedSelectedUsers as SelectedGroupUsers[]);
    setSearchTerm("");
  };

  const handleDelete = (user: SelectedGroupUsers) => {
    const filteredUsers =
      selectedUsers &&
      selectedUsers.filter((userToRemove) => user.id !== userToRemove.id);
    setSelectedUsers(filteredUsers);
  };

  return (
    <section className="flex w-full flex-col">
      <Label className="paragraph-3-medium text-dark-800 dark:text-white-200">
        Add {memberType}
      </Label>

      {isPending && isOpen ? (
        <div ref={ref}>
          <GroupSearchMenuSkeleton />
        </div>
      ) : (
        searchTerm.length > 0 &&
        isOpen && (
          <div className="relative -scale-y-100" ref={ref}>
            <div className="absolute flex w-full -scale-y-100 flex-col gap-y-1 rounded-lg border border-white-border bg-white-100 py-1 dark:border-dark-border dark:bg-dark-800">
              {filteredSearchResults?.map((user) => {
                return (
                  <SearchResultCard
                    user={user}
                    handleSelect={handleSelect}
                    key={user.id}
                  />
                );
              })}

              {filteredSearchResults?.length === 0 && (
                <div className=" paragraph-3-regular flex h-[196px] justify-center">
                  <p className="flex items-center justify-center align-middle text-white-400 dark:text-white-300">
                    No users found
                  </p>
                </div>
              )}
            </div>
          </div>
        )
      )}

      <div className="paragraph-3-regular mt-3 flex w-full flex-wrap items-center gap-x-2 gap-y-1 rounded-lg border border-white-border bg-white-100 px-4 py-1 dark:border-dark-border dark:bg-dark-800 dark:text-white-200">
        {selectedUsers &&
          selectedUsers.length > 0 &&
          selectedUsers.map((user) => (
            <SelectedUserCard
              user={user}
              handleDelete={handleDelete}
              key={user.id}
            />
          ))}

        <Input
          className="paragraph-3-regular disabled:opacity-1 flex h-6 w-fit flex-1 border-none bg-transparent py-0 placeholder:text-white-400 dark:bg-dark-800 dark:text-white-200"
          placeholder="Search users..."
          type="text"
          onChange={(event) => setSearchTerm(event.target.value)}
          value={searchTerm}
          id={memberType}
        />
      </div>
    </section>
  );
};

export default GroupMemberTags;
