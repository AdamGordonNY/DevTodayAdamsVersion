"use client";

import React from "react";
import Image from "next/image";

import { User } from "@prisma/client";
import { ProfilePlaceholder } from "../ui";

const SearchResultCard = ({
  user,
  handleSelect,
}: {
  user: User;
  handleSelect: (user: User) => void;
}) => {
  return (
    <button
      className="group flex cursor-pointer gap-x-2 rounded px-6 py-1 transition duration-300 hover:bg-primary-500"
      id={`${user.id}`}
      onClick={() => handleSelect(user)}
    >
      {user.image ? (
        <div className="relative size-3 shrink-0">
          <Image
            src={user.image}
            fill
            alt="author-profile-image"
            className="rounded-full"
          />
        </div>
      ) : (
        <ProfilePlaceholder size={12} className="shrink-0" />
      )}
      <p className="caption-10 paragraph-3-regular text-white-400 group-hover:text-white-100 dark:text-white-300">
        {user.firstName} {user.lastName}
      </p>
    </button>
  );
};

export default SearchResultCard;
