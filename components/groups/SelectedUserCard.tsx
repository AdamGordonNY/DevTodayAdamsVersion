"use client";
import React from "react";

import Image from "next/image";
import { motion } from "framer-motion";
import { X } from "lucide-react";

import { SelectedGroupUsers } from "@/lib/types.d";
import { ProfilePlaceholder } from "../ui";

const SelectedUserCard = ({
  user,
  handleDelete,
}: {
  user: SelectedGroupUsers;
  handleDelete: (user: SelectedGroupUsers) => void;
}) => {
  return (
    <div className="my-1 flex h-6 items-center gap-x-1 rounded-2xl bg-white-200 px-3 dark:bg-dark-700">
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
      <p className="caption-10 text-center text-white-400 dark:text-white-300">
        {user.firstName} {user.lastName}
      </p>
      <motion.button
        type="button"
        onClick={() => handleDelete(user)}
        whileHover={{
          scale: 1.3,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
        }}
      >
        <X className="text-white-400 dark:text-white-300" size={12} />
      </motion.button>
    </div>
  );
};

export default SelectedUserCard;
