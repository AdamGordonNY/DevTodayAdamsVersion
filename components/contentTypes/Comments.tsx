"use client";

import React, { useEffect, useState, useTransition } from "react";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";

import { ContentCategoryType, ContentType } from "@/lib/types.d";
import { Input } from "../ui/input";
import { Separator } from "../ui/separator";

import { ProfilePlaceholder } from "../ui";
import toast from "react-hot-toast";
import { createComment } from "@/lib/actions/comment.actions";
import { getUserIdWithClerkID } from "@/lib/actions/user.actions";
import { CommentCardSkeleton } from "../shared/Skeletons";

const Comments = ({
  content,
  contentCategory,
  children,
  loggedInUserImage,
}: {
  content: ContentType;
  contentCategory: ContentCategoryType;
  children: React.ReactNode;
  loggedInUserImage: string;
}) => {
  const {
    user: { firstName, lastName },
    id,
  } = content;

  const fullName = `${firstName} ${lastName}`;
  const [pending, startTransition] = useTransition();
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    const handleSubmit = async () => {
      const { userId } = await getUserIdWithClerkID();

      try {
        if (userId) {
          const dataToSend = { commentText, contentCategory, userId, id };
          startTransition(async () => {
            const createdComment = await createComment(dataToSend);
            if (createdComment) setCommentText("");
          });
        }
      } catch (error) {
        console.log("error in catch", error);
        toast.error("Unable to create or edit post");
      }
    };

    const onEnter = (event: KeyboardEvent) => {
      if (
        event.key === "Enter" &&
        document.activeElement?.id === "comment" &&
        commentText.length > 0
      ) {
        event.preventDefault();
        handleSubmit();
      }
    };

    window.addEventListener("keydown", onEnter);
    return () => window.removeEventListener("keydown", onEnter);
  }, [commentText, contentCategory, id]);

  return (
    <section className="flex w-full flex-col gap-y-4">
      <p className="heading-1-medium dark:text-white-200">Comments</p>
      <div className="mb-4 flex items-center gap-x-2">
        {loggedInUserImage ? (
          <div className="relative size-11 shrink-0">
            <Image
              src={loggedInUserImage}
              fill
              alt="user-profile-image"
              className="rounded-full"
            />
          </div>
        ) : (
          <ProfilePlaceholder size={44} className="shrink-0" />
        )}

        <Input
          id="comment"
          className="paragraph-3-regular border-white-border bg-white-100 text-dark-700  placeholder:text-white-400 dark:border-dark-border dark:bg-dark-800 dark:text-white-100"
          placeholder={`Say something nice to ${fullName}... `}
          onChange={(e) => setCommentText(e.target.value)}
          value={commentText}
        />
      </div>

      {pending && <CommentCardSkeleton />}
      <AnimatePresence mode="popLayout">{children}</AnimatePresence>

      {/* MOBILE VIEW */}
      <Separator
        orientation="horizontal"
        className="my-4 size-px w-full text-white-border md-b:hidden dark:bg-dark-700 dark:text-dark-700"
      />
    </section>
  );
};

export default Comments;
